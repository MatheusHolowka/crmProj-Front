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

  // Novo método para persistir a mudança de coluna no MongoDB
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.API}/${id}/status`, { status });
  }

  createLead(lead: any): Observable<any> {
    return this.http.post(this.API, lead);
  }

  updateLead(id: string, lead: any): Observable<any> {
    return this.http.patch(`${this.API}/${id}`, lead);
  }
}