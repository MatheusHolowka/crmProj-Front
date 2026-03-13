import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private http = inject(HttpClient);
  private readonly API = 'http://127.0.0.1:3000/leads';

  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  createLead(lead: any): Observable<any> {
    return this.http.post(this.API, lead);
  }

  // Corrigido para this.API e removido o /leads repetido
  updateLead(id: string, lead: any): Observable<any> {
    return this.http.patch(`${this.API}/${id}`, lead);
  }
}