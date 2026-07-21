import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner, loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <mat-progress-spinner [diameter]="diameter" mode="indeterminate" color="primary"></mat-progress-spinner>
      @if (message) { <p class="loading-message">{{ message }}</p> }
    </div>
  `,
  styles: [`
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; gap: 16px; }
    .loading-message { color: #78909c; font-size: 14px; }
  `],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 48;
  @Input() message = 'Chargement…';
}
