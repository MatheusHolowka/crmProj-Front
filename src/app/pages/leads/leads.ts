import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './leads.html',
  styleUrl: './leads.css'
})
export class Leads {
  public theme = inject(Theme);
  
  leads = signal([
    { nome: 'João Silva', email: 'joao@agro.com.br', status: 'NOVO', statusCor: 'bg-indigo-100 text-indigo-600', origem: 'WhatsApp', cidade: 'Sinop - MT', data: '06/02/2026' },
    { nome: 'Maria Fazenda', email: 'maria@fazenda.com', status: 'QUALIFICADO', statusCor: 'bg-amber-100 text-amber-600', origem: 'Site', cidade: 'Sorriso - MT', data: '05/02/2026' },
    { nome: 'Carlos Trator', email: 'carlos@vendas.com', status: 'PROPOSTA', statusCor: 'bg-emerald-100 text-emerald-600', origem: 'Indicação', cidade: 'Lucas do Rio Verde - MT', data: '04/02/2026' }
  ]);

  isDarkMode() { return this.theme.isDarkMode(); }
}