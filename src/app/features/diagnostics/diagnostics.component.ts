import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent } from '@shared/components';
import { DiagnosticService } from '@core/services';
import { DiagnosticListItem } from '@core/models';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="health_and_safety" title="Diagnostics" subtitle="Résultats et suivi des diagnostics"></app-page-header>

      <mat-card class="toolbar-card">
        <mat-toolbar>
          <div class="search">
            <mat-form-field appearance="outline">
              <input matInput placeholder="Rechercher" [formControl]="searchControl" (keyup.enter)="onSearch()" />
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="onSearch()"><mat-icon>search</mat-icon> Rechercher</button>
          </div>
          <span class="spacer"></span>
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <loading-spinner *ngIf="loading()"></loading-spinner>
        <ng-container *ngIf="!loading()">
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucun diagnostic disponible pour le moment."></empty-state>
          <div *ngIf="data().length > 0" class="table-wrapper">
            <table mat-table [dataSource]="data()" class="mat-elevation-z2">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let row">{{ row.id }}</td>
              </ng-container>
              <ng-container matColumnDef="consultationRef">
                <th mat-header-cell *matHeaderCellDef>Consultation</th>
                <td mat-cell *matCellDef="let row">{{ row.consultationRef }}</td>
              </ng-container>
              <ng-container matColumnDef="result">
                <th mat-header-cell *matHeaderCellDef>Résultat</th>
                <td mat-cell *matCellDef="let row">{{ row.result }}</td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let row">{{ row.date }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </ng-container>
      </mat-card>
    </div>
  `,
  styles: [`.toolbar-card { margin-bottom: 16px; } .search { display:flex; gap:8px; align-items:center; } .spacer { flex: 1 1 auto; } .content-card { padding: 16px; } .table-wrapper { overflow: auto; }`],
})
export class DiagnosticsComponent implements OnInit {
  private readonly service = inject(DiagnosticService);
  readonly loading = signal(false);
  readonly data = signal<DiagnosticListItem[]>([]);
  readonly displayedColumns = ['id', 'consultationRef', 'result', 'date'];
  readonly searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadDiagnostics();
  }

  onSearch(): void {
    this.loadDiagnostics(this.searchControl.value?.trim() ?? '');
  }

  private loadDiagnostics(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items.map((diagnostic) => ({
          id: diagnostic.id,
          consultationRef: diagnostic.consultationId.slice(0, 8),
          result: diagnostic.description,
          date: diagnostic.createdAt,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
