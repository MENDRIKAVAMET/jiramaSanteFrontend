import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="redirect-page">
      <mat-progress-spinner mode="indeterminate" [diameter]="40"></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .redirect-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
  `],
})
export class LoginRedirectComponent {}
