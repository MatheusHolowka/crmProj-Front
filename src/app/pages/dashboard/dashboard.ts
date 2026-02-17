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
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public theme = inject(Theme);

  // Etapas do Funil (Mock de dados)
  novosLeads: Lead[] = [
    {
      id: 1,
      nome: 'João Silva',
      origem: 'WhatsApp',
      mensagem: 'Interesse no ERP Agro',
      localidade: 'Sinop - MT',
      tempo: '5 min',
    },
    {
      id: 2,
      nome: 'Maria Agro',
      origem: 'Site',
      mensagem: 'Dúvida sobre Firebird 3.0',
      localidade: 'Sorriso - MT',
      tempo: '12 min',
    },
    {
      id: 3,
      nome: 'Pedro Lucas',
      origem: 'LinkedIn',
      mensagem: 'Solicitação de Demo Online',
      localidade: 'Cuiabá - MT',
      tempo: '30 min',
    },
    {
      id: 4,
      nome: 'Fazenda Sta. Rita',
      origem: 'Indicação',
      mensagem: 'Renovação de licença anual',
      localidade: 'Lucas do R. Verde',
      tempo: '1h',
    },
  ];

  qualificacao: Lead[] = [];
  proposta: Lead[] = [];
  fechamento: Lead[] = [];

  // MELHORIA DE PERFORMANCE:
  // Isso diz ao Angular para rastrear os itens pelo ID e não pela referência do objeto.
  // Remove o "piscar" e o lag durante o arrasto.
  trackByFn(index: number, item: Lead): number {
    return item.id;
  }

  drop(event: CdkDragDrop<Lead[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  editarLead(lead: Lead) {
    console.log('Editando lead:', lead);
    // Aqui você colocará a lógica para abrir seu modal
    alert(`Editando: ${lead.nome}`);
  }

  isDarkMode() {
    return this.theme.isDarkMode();
  }
  toggleTheme() {
    this.theme.toggleTheme();
  }
}
