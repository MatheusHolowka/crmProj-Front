import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // PUBLIC é essencial para o HTML enxergar
  public theme = inject(Theme);
  public auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    this.auth.login();
    this.router.navigate(['/dashboard']);
  }
}