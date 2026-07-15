import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="error-page">
      <mat-icon class="error-icon">explore_off</mat-icon>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page introuvable</h2>
      <p class="error-message">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <button mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Retour au tableau de bord
      </button>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
      background: #f5f7fa;
    }
    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #78909c;
      margin-bottom: 16px;
    }
    .error-code {
      font-size: 72px;
      font-weight: 700;
      color: #78909c;
      margin: 0;
    }
    .error-title {
      font-size: 24px;
      font-weight: 500;
      color: #333;
      margin-top: 8px;
    }
    .error-message {
      color: #78909c;
      margin: 12px 0 24px;
      max-width: 400px;
    }
  `],
})
export class NotFoundComponent {}
