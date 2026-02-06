import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard'; // Importe o componente do Kanban

export const routes: Routes = [
  { 
    path: '', 
    component: Landing, 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: 'dashboard', 
    component: Dashboard // Adicionando a rota para o seu CRM Kanban
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];