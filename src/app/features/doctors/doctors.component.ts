import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="local_hospital"
        title="Médecins"
        subtitle="Gestion des médecins et spécialistes"
      ></app-page-header>
      <p class="placeholder-text">
        La liste et la gestion des médecins seront disponibles ici une fois le backend connecté.
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
export class DoctorsComponent {}
