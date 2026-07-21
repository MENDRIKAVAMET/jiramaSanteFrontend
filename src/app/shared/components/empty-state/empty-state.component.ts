import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state, empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3 class="empty-title">{{ title }}</h3>
      @if (description) { <p class="empty-description">{{ description }}</p> }
    </div>
  `,
  styles: [`
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }
    .empty-icon { font-size: 56px; width: 56px; height: 56px; color: #b0bec5; margin-bottom: 16px; }
    .empty-title { font-size: 16px; font-weight: 500; color: #455a64; margin: 0 0 8px; }
    .empty-description { font-size: 13px; color: #78909c; max-width: 400px; margin: 0; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Aucune donnée';
  @Input() description = '';
}
