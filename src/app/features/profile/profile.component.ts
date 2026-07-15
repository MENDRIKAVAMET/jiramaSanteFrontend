import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="person"
        title="Mon profil"
        subtitle="Gestion de votre profil utilisateur"
      ></app-page-header>
      <p class="placeholder-text">
        La gestion du profil sera disponible ici une fois le backend connecté.
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
export class ProfileComponent {}
