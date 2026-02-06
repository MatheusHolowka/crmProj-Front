import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Estado de autenticação persistido no localStorage
  isAuthenticated = signal<boolean>(localStorage.getItem('isLogged') === 'true');

  login() {
    this.isAuthenticated.set(true);
    localStorage.setItem('isLogged', 'true');
  }

  logout() {
    this.isAuthenticated.set(false);
    localStorage.removeItem('isLogged');
  }
}