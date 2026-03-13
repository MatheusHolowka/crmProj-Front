import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mude para o endereço local onde o seu NestJS está rodando (geralmente porta 3000)
  private readonly API_URL = 'http://127.0.0.1:3000/auth'; 

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        // ATENÇÃO: Verifique se o seu interceptor busca 'access_token' ou apenas 'token'
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }
}