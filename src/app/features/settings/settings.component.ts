import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';
import { ThemeService } from '@core/services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PageHeaderComponent],
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
          <span class="theme-value">{{ theme.theme() === 'light' ? 'Clair' : 'Sombre' }}</span>
        </div>
      </div>

      <p class="placeholder-text">
        Les paramètres supplémentaires seront disponibles ici une fois le backend connecté.
      </p>
    </div>
  `,
  styles: [`
    .placeholder-text {
      color: #78909c;
      font-size: 15px;
      line-height: 1.6;
    }
    .settings-section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
    }
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    .theme-value {
      color: #00897b;
      font-weight: 500;
    }
  `],
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
}
