import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="error-page">
      <mat-icon class="error-icon">lock</mat-icon>
      <h1 class="error-code">403</h1>
      <h2 class="error-title">Accès interdit</h2>
      <p class="error-message">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
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
      color: #f44336;
      margin-bottom: 16px;
    }
    .error-code {
      font-size: 72px;
      font-weight: 700;
      color: #f44336;
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
export class ForbiddenComponent {}
