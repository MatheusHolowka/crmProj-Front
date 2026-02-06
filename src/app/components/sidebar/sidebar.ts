import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Theme } from '../../services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  public theme = inject(Theme);

  isDarkMode() { return this.theme.isDarkMode(); }
  toggleTheme() { this.theme.toggleTheme(); }
}