import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-symptoms',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="sick"
        title="Symptômes"
        subtitle="Catalogue des symptômes et niveaux de gravité"
      ></app-page-header>
      <p class="placeholder-text">
        Le catalogue des symptômes sera disponible ici une fois le backend connecté.
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
export class SymptomsComponent {}
