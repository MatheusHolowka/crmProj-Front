import { Component, inject, ChangeDetectorRef } from '@angular/core'; // Adicionado ChangeDetectorRef
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Theme } from '../../services/theme';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public theme = inject(Theme);
  public auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Injetado para forçar a atualização da UI

  email = '';
  password = '';
  isLoading = false;

  public notification = {
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error'
  };

  onSubmit() {
    // Validação básica antes de disparar o loading
    if (this.isLoading || !this.email || !this.password) return;
    
    this.isLoading = true;
    this.notification.show = false; // Garante que popups antigos sumam ao tentar de novo
    this.cdr.detectChanges(); // Força a UI a mostrar o "Carregando"

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.showToast('Sucesso!', 'Acesso autorizado. Redirecionando...', 'success');
        // Mantém o estado de loading até o redirecionamento
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false; // PARA o loading imediatamente no erro
        const msg = err.status === 401 
          ? 'E-mail ou senha incorretos. Tente novamente.' 
          : 'Falha de conexão com o banco de dados.';
        
        this.showToast('Erro na Autenticação', msg, 'error');
        this.cdr.detectChanges(); // Força o popup de erro a aparecer
      }
    });
  }

  private showToast(title: string, message: string, type: 'success' | 'error') {
    this.notification = { show: true, title, message, type };
    this.cdr.detectChanges(); // Garante que o popup seja renderizado
    
    // O popup some automaticamente após 4 segundos
    setTimeout(() => {
      this.notification.show = false;
      this.cdr.detectChanges(); // Garante que o popup suma visualmente
    }, 4000);
  }
}