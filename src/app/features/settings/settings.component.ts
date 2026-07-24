import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components';
import { ThemeService } from '@core/services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PageHeaderComponent, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <app-page-header
        icon="settings"
        title="Paramètres"
        subtitle="Configuration de l'application"
      ></app-page-header>

      <div class="settings-section">
        <h3 class="section-title">Apparence</h3>
        <div class="setting-row">
          <span>Thème de l'application</span>
          <button mat-stroked-button color="primary" (click)="theme.toggle()">
            <mat-icon>{{ theme.theme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
            {{ theme.theme() === 'light' ? 'Clair' : 'Sombre' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--jirama-text-primary);
      margin-bottom: 12px;
    }
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--jirama-border);
    }
    .setting-row button {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `],
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
}
