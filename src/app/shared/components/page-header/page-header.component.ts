import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <mat-icon class="header-icon">dashboard</mat-icon>
        <div class="header-text">
          <h1 class="header-title">Tableau de bord</h1>
          <p class="header-subtitle">Gestion et vue d'ensemble des activités</p>
        </div>
      </div>
      <div class="header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-content { display: flex; align-items: center; gap: 16px; }
    .header-icon { font-size: 36px; width: 36px; height: 36px; color: #00897b; }
    .header-title { font-size: 24px; font-weight: 500; color: #1a1a1a; margin: 0; }
    .header-subtitle { font-size: 14px; color: #78909c; margin-top: 4px; }
    .header-actions { display: flex; align-items: center; gap: 8px; }
  `],
})
export class PageHeaderComponent {
  // Valeurs hardcodées directement dans la classe si besoin
  icon = 'dashboard';
  title = 'Tableau de bord';
  subtitle = 'Gestion et vue d\'ensemble des activités';
}