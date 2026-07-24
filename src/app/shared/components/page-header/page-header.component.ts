import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        @if (icon) {
          <mat-icon class="header-icon">{{ icon }}</mat-icon>
        }
        <div class="header-text">
          <h1 class="header-title">{{ title }}</h1>
          @if (subtitle) {
            <p class="header-subtitle">{{ subtitle }}</p>
          }
        </div>
      </div>
      <div class="header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-content { display: flex; align-items: center; gap: 16px; }
    .header-icon { font-size: 36px; width: 36px; height: 36px; color: #00897b; }
    .header-title { font-size: 24px; font-weight: 500; color: #1a1a1a; margin: 0; }
    .header-subtitle { font-size: 14px; color: #78909c; margin-top: 4px; }
    .header-actions { display: flex; align-items: center; gap: 8px; }
  `],
})
export class PageHeaderComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
}
