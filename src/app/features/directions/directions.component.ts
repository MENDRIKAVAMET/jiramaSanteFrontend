import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-directions',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="account_tree"
        title="Directions"
        subtitle="Gestion des directions JIRAMA"
      ></app-page-header>
      <p class="placeholder-text">
        Les directions organisationnelles seront disponibles ici une fois le backend connecté.
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
export class DirectionsComponent {}
