import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Theme } from '../../services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  public theme = inject(Theme);
  
  // CHAVE PARA O LOCALSTORAGE
  private readonly STORAGE_KEY = 'sidebar_collapsed';

  // 1. INICIALIZAÇÃO INTELIGENTE
  // O signal começa lendo o que está salvo. Se não tiver nada, assume false.
  public isCollapsed = signal<boolean>(this.getStoredState());

  isDarkMode() { return this.theme.isDarkMode(); }
  toggleTheme() { this.theme.toggleTheme(); }
  
  // Método para alternar o estado
  toggleSidebar() {
    this.isCollapsed.update(currentState => {
      const newState = !currentState;
      
      // 2. SALVAR A MUDANÇA
      // Salva o novo estado no navegador
      localStorage.setItem(this.STORAGE_KEY, String(newState));
      
      return newState;
    });
  }

  // Função auxiliar para ler do localStorage com segurança
  private getStoredState(): boolean {
    // Verifica se o localStorage existe (segurança para não quebrar em alguns ambientes)
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      return savedState === 'true'; // Retorna true se a string for "true"
    }
    return false; // Padrão se não houver nada salvo
  }
}