import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard'; 
import { WhatsappChat } from './pages/whatsapp/whatsapp-chat';
import { Leads } from './pages/leads/leads';

export const routes: Routes = [
  { path: '', component: Landing, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'whatsapp', component: WhatsappChat },
  { path: 'leads', component: Leads }, 
  { path: '**', redirectTo: '' }
];