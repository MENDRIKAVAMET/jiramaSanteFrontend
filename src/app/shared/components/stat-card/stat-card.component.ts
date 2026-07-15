import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type StatCardColor = 'primary' | 'accent' | 'warn' | 'success';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card stat-{{ color }}">
      <div class="stat-icon-wrapper">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .stat-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .stat-icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 13px;
      color: #78909c;
      margin-top: 4px;
    }
    .stat-primary .stat-icon-wrapper { background: rgba(0, 137, 123, 0.12); color: #00897b; }
    .stat-primary .stat-value { color: #00695c; }
    .stat-accent .stat-icon-wrapper { background: rgba(30, 136, 229, 0.12); color: #1e88e5; }
    .stat-accent .stat-value { color: #1565c0; }
    .stat-warn .stat-icon-wrapper { background: rgba(244, 67, 54, 0.12); color: #f44336; }
    .stat-warn .stat-value { color: #c62828; }
    .stat-success .stat-icon-wrapper { background: rgba(76, 175, 80, 0.12); color: #4caf50; }
    .stat-success .stat-value { color: #2e7d32; }
  `],
})
export class StatCardComponent {
  @Input() icon = 'bar_chart';
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() color: StatCardColor = 'primary';
}
