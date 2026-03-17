import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);
  private readonly IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/MT/municipios';
  
  // Usamos shareReplay para não bater na API do IBGE toda vez que mudar de tela
  private cities$?: Observable<string[]>;

  getCities(): Observable<string[]> {
    if (!this.cities$) {
      this.cities$ = this.http.get<any[]>(this.IBGE_URL).pipe(
        map(data => data.map(c => c.nome).sort()),
        shareReplay(1)
      );
    }
    return this.cities$;
  }
}