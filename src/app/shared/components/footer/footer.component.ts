import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <footer class="app-footer">
      <div class="footer-left">
        <mat-icon class="footer-icon">health_and_safety</mat-icon>
        <span>{{ appName }} &mdash; v{{ version }}</span>
      </div>
      <div class="footer-right">
        <span>&copy; {{ year }} JIRAMA. Tous droits réservés.</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid rgba(0,0,0,0.06); background: #fff; flex-wrap: wrap; gap: 8px; }
    .footer-left { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #78909c; }
    .footer-icon { font-size: 18px; width: 18px; height: 18px; color: #00897b; }
    .footer-right { font-size: 12px; color: #b0bec5; }
    @media (max-width: 599px) { .app-footer { justify-content: center; text-align: center; } }
  `],
})
export class FooterComponent {
  @Input() appName = 'JIRAMA Santé';
  @Input() version = '1.0.0';
  readonly year = new Date().getFullYear();
}
