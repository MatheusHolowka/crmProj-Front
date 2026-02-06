import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDrag, 
  CdkDropList, 
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Theme } from '../../services/theme';

interface Lead {
  id: number;
  nome: string;
  origem: string;
  mensagem: string;
  localidade: string;
  tempo: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  public theme = inject(Theme);

  // Etapas do Funil (Mock de dados que viriam do seu banco)
  novosLeads: Lead[] = [
    { id: 1, nome: 'João Silva', origem: 'WhatsApp', mensagem: 'Interesse no ERP Agro', localidade: 'Sinop - MT', tempo: '5 min' },
    { id: 2, nome: 'Maria Agro', origem: 'Site', mensagem: 'Dúvida sobre Firebird 3.0', localidade: 'Sorriso - MT', tempo: '12 min' }
  ];

  qualificacao: Lead[] = [];
  proposta: Lead[] = [];
  fechamento: Lead[] = [];

  drop(event: CdkDragDrop<Lead[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  isDarkMode() { return this.theme.isDarkMode(); }
  toggleTheme() { this.theme.toggleTheme(); }
}