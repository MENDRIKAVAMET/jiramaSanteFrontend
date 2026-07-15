import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="biotech"
        title="Diagnostics"
        subtitle="Diagnostics médicaux associés aux consultations"
      ></app-page-header>
      <p class="placeholder-text">
        Les diagnostics médicaux seront disponibles ici une fois le backend connecté.
      </p>
    </div>
  `,
  styles: [`
    .placeholder-text {
      color: #78909c;
      font-size: 15px;
      line-height: 1.6;
    }
  `],
})
export class DiagnosticsComponent {}
