import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="receipt_long"
        title="Prescriptions"
        subtitle="Gestion des prescriptions médicales"
      ></app-page-header>
      <p class="placeholder-text">
        Les prescriptions médicales seront disponibles ici une fois le backend connecté.
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
export class PrescriptionsComponent {}
