import { Component, inject, signal, OnInit, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Theme } from '../../services/theme';
import { LeadsService } from '../../services/leads';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, Sidebar, FormsModule],
  templateUrl: './leads.html',
  styleUrl: './leads.css',
})
export class Leads implements OnInit {
  public theme = inject(Theme);
  private leadsService = inject(LeadsService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  leads = signal<any[]>([]);
  cidades = signal<string[]>([]);
  isModalOpen = signal(false);
  isLoading = signal(false);
  isEditing = signal(false);
  selectedLeadId = signal<string | null>(null);
  searchTermLeads = signal('');

  filteredLeads = computed(() => {
    const term = this.searchTermLeads().toLowerCase().trim();
    const allLeads = this.leads();

    if (!term) return allLeads;

    return allLeads.filter(
      (lead) =>
        lead.nome.toLowerCase().includes(term) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        lead.cidade.toLowerCase().includes(term),
    );
  });

  public notification = {
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
  };

  public newLead = {
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    origem: 'WhatsApp',
  };

  searchTermCity = signal('');

  filteredCidades = computed(() => {
    const term = this.searchTermCity().toLowerCase();
    return this.cidades().filter((c) => c.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadLeads();
    this.loadCidades();
  }

  loadCidades() {
    this.http
      .get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MT/municipios')
      .subscribe({
        next: (data) => {
          this.cidades.set(data.map((c) => c.nome).sort());
          this.cdr.detectChanges();
        },
      });
  }

  loadLeads() {
    this.leadsService.getLeads().subscribe({
      next: (data) => {
        const mappedLeads = data.map((lead: any) => ({
          ...lead,
          statusCor: this.getStatusColor(lead.status),
          dataFormatted: new Date(lead.dataCriacao).toLocaleDateString('pt-BR'),
        }));
        this.leads.set(mappedLeads);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.showToast('Não Autorizado', 'Sessão expirou.', 'error');
        }
      },
    });
  }

  onTelefoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10)}`;
    this.newLead.telefone = value;
    event.target.value = value;
  }

  toggleModal() {
    this.isModalOpen.set(!this.isModalOpen());
    if (!this.isModalOpen()) this.resetForm();
  }

  // FUNÇÃO ÚNICA: Sem duplicidade agora!
  saveLead() {
    const leadData: any = { ...this.newLead };
    if (!leadData.email || leadData.email.trim() === '') delete leadData.email;

    this.isLoading.set(true);

    const request = this.isEditing()
      ? this.leadsService.updateLead(this.selectedLeadId()!, leadData)
      : this.leadsService.createLead(leadData);

    request.subscribe({
      next: () => {
        this.loadLeads();
        this.toggleModal();
        this.isLoading.set(false);
        this.showToast('Sucesso', this.isEditing() ? 'Lead atualizado!' : 'Lead salvo!', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro:', err.error);
        this.showToast('Erro', 'Verifique os dados.', 'error');
      },
    });
  }

  editLead(lead: any) {
    this.isEditing.set(true);
    this.selectedLeadId.set(lead.id);
    this.newLead = {
      nome: lead.nome,
      email: lead.email || '',
      telefone: lead.telefone,
      cidade: lead.cidade,
      origem: lead.origem,
    };
    this.isModalOpen.set(true);
  }

  resetForm() {
    this.isEditing.set(false);
    this.selectedLeadId.set(null);
    this.newLead = { nome: '', email: '', telefone: '', cidade: '', origem: 'WhatsApp' };
    this.searchTermCity.set('');
  }

  private showToast(title: string, message: string, type: 'success' | 'error') {
    this.notification = { show: true, title, message, type };
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notification.show = false;
      this.cdr.detectChanges();
    }, 4000);
  }

  getStatusColor(status: string): string {
    const colors: any = {
      NOVO: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      QUALIFICADO: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      PROPOSTA: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      PERDIDO: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  }

  isCityDropdownOpen = signal(false);
  toggleCityDropdown() {
    this.isCityDropdownOpen.set(!this.isCityDropdownOpen());
  }
  selectCity(cidade: string) {
    this.newLead.cidade = cidade;
    this.isCityDropdownOpen.set(false);
    this.searchTermCity.set('');
  }
}
