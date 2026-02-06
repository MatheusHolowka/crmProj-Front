import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Theme } from '../../services/theme'; // Pela sua imagem, o caminho é este

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  public theme = inject(Theme);

  isDarkMode() { return this.theme.isDarkMode(); }
  toggleTheme() { this.theme.toggleTheme(); }
}