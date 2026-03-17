import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Theme } from '../../services/theme';
import { LeadsService } from '../../services/leads';
import { LocationService } from '../../services/location';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, Sidebar, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  public theme = inject(Theme);
  private leadsService = inject(LeadsService);
  private locationService = inject(LocationService);
  private cdr = inject(ChangeDetectorRef);

  allLeads = signal<any[]>([]);
  isModalOpen = signal(false);
  isEditing = signal(false);
  isLoading = signal(false);
  selectedLeadId = signal<string | null>(null);

  // Lógica de Cidades IBGE
  cidades = signal<string[]>([]);
  searchTermCity = signal('');
  isCityDropdownOpen = signal(false);

  filteredCidades = computed(() => {
    const term = this.searchTermCity().toLowerCase();
    return this.cidades().filter(c => c.toLowerCase().includes(term));
  });

  novosLeads = computed(() => this.allLeads().filter(l => l.status === 'NOVO'));
  qualificacao = computed(() => this.allLeads().filter(l => l.status === 'QUALIFICADO'));
  proposta = computed(() => this.allLeads().filter(l => l.status === 'PROPOSTA'));
  fechamento = computed(() => this.allLeads().filter(l => l.status === 'FECHADO'));

  public leadForm = {
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    origem: 'WhatsApp',
  };

  ngOnInit() {
    this.loadLeads();
    this.locationService.getCities().subscribe(data => this.cidades.set(data));
  }

  loadLeads() {
    this.leadsService.getLeads().subscribe({
      next: (data) => {
        const processed = data.map(lead => ({
          ...lead,
          localidade: lead.cidade,
          tempo: this.calculateTime(lead.dataCriacao),
          mensagem: lead.email || 'Lead sem e-mail'
        }));
        this.allLeads.set(processed);
        this.cdr.detectChanges();
      }
    });
  }

  drop(event: CdkDragDrop<any[]>, novoStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const lead = event.item.data;
      this.leadsService.updateStatus(lead.id, novoStatus).subscribe({
        next: () => {
          const updated = this.allLeads().map(l => 
            l.id === lead.id ? { ...l, status: novoStatus } : l
          );
          this.allLeads.set(updated);
          this.cdr.detectChanges();
        },
        error: () => alert('Erro na sincronização.')
      });
    }
  }

  editarLead(lead: any) {
    this.isEditing.set(true);
    this.selectedLeadId.set(lead.id);
    this.leadForm = {
      nome: lead.nome,
      email: lead.email || '',
      telefone: lead.telefone,
      cidade: lead.cidade,
      origem: lead.origem
    };
    this.isModalOpen.set(true);
  }

  saveLead() {
    const data: any = { ...this.leadForm };
    if (!data.email || data.email.trim() === '') delete data.email;
    this.isLoading.set(true);

    const request = this.isEditing() 
      ? this.leadsService.updateLead(this.selectedLeadId()!, data)
      : this.leadsService.createLead(data);

    request.subscribe({
      next: () => {
        this.loadLeads();
        this.toggleModal();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
    if (!this.isModalOpen()) this.resetForm();
  }

  resetForm() {
    this.isEditing.set(false);
    this.selectedLeadId.set(null);
    this.isCityDropdownOpen.set(false);
    this.searchTermCity.set('');
    this.leadForm = { nome: '', email: '', telefone: '', cidade: '', origem: 'WhatsApp' };
  }

  toggleCityDropdown() { this.isCityDropdownOpen.set(!this.isCityDropdownOpen()); }
  selectCity(cidade: string) {
    this.leadForm.cidade = cidade;
    this.isCityDropdownOpen.set(false);
    this.searchTermCity.set('');
  }

  private calculateTime(date: string) {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }

  trackByFn(index: number, item: any): string { return item.id; }
}