import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      @for (item of items; track item.label; let last = $last) {
        @if (!last && item.path) {
          <a [routerLink]="item.path" class="breadcrumb-link">{{ item.label }}</a>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
        } @else {
          <span class="breadcrumb-current">{{ item.label }}</span>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; font-size: 13px; }
    .breadcrumb-link { color: #00897b; cursor: pointer; transition: color 0.15s ease; &:hover { color: #00695c; text-decoration: underline; } }
    .breadcrumb-separator { font-size: 18px; width: 18px; height: 18px; color: #b0bec5; }
    .breadcrumb-current { color: #546e7a; font-weight: 500; }
  `],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
