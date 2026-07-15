import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="error-page">
      <mat-icon class="error-icon">search_off</mat-icon>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page introuvable</h2>
      <p class="error-message">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <button mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon> Retour au tableau de bord
      </button>
    </div>
  `,
  styles: [`
    .error-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 24px; }
    .error-icon { font-size: 80px; width: 80px; height: 80px; color: #78909c; }
    .error-code { font-size: 72px; font-weight: 700; color: #78909c; margin: 16px 0 8px; }
    .error-title { font-size: 24px; font-weight: 500; color: #333; margin: 0 0 8px; }
    .error-message { font-size: 14px; color: #78909c; max-width: 400px; margin: 0 0 24px; }
  `],
})
export class NotFoundComponent {}
