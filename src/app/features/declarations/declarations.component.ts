import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-declarations',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="page-container">
      <app-page-header
        icon="assignment"
        title="Déclarations sanitaires"
        subtitle="Déclaration et suivi des cas sanitaires"
      ></app-page-header>
      <p class="placeholder-text">
        Les déclarations sanitaires et leur suivi seront disponibles ici une fois le backend connecté.
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
export class DeclarationsComponent {}
