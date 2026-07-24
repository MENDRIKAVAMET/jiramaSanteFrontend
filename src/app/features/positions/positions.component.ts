import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent } from '@shared/components';
import { PositionService } from '@core/services';
import { Position } from '@core/models';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <ng-container *ngIf="showForm(); else tableView">
      <app-page-header
        icon="work"
        [title]="editingId() ? 'Modifier le poste' : 'Nouveau poste'"
        subtitle="Gestion des postes et fonctions">
      </app-page-header>
      <mat-card class="content-card">
        <form [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          <mat-form-field appearance="outline">
            <mat-label>Code</mat-label>
            <input matInput formControlName="code" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Service</mat-label>
            <input matInput formControlName="serviceId" />
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>
      </mat-card>
    </ng-container>

    <ng-template #tableView>
      <div class="page-container">
        <app-page-header icon="work" title="Postes" subtitle="Gestion des postes et fonctions"></app-page-header>

        <mat-card class="toolbar-card">
          <mat-toolbar>
            <div class="search">
              <mat-form-field appearance="outline">
                <input matInput placeholder="Rechercher" [formControl]="searchControl" (keyup.enter)="onSearch()" />
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="onSearch()"><mat-icon>search</mat-icon> Rechercher</button>
            </div>
            <span class="spacer"></span>
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouveau poste</button>
          </mat-toolbar>
        </mat-card>

        <mat-card class="content-card">
          <loading-spinner *ngIf="loading()"></loading-spinner>
          <ng-container *ngIf="!loading()">
            <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucun poste disponible pour le moment."></empty-state>
            <div *ngIf="data().length > 0" class="table-wrapper">
              <table mat-table [dataSource]="data()" class="mat-elevation-z2">
                <ng-container matColumnDef="code">
                  <th mat-header-cell *matHeaderCellDef>Code</th>
                  <td mat-cell *matCellDef="let row">{{ row.code }}</td>
                </ng-container>
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Nom</th>
                  <td mat-cell *matCellDef="let row">{{ row.title }}</td>
                </ng-container>
                <ng-container matColumnDef="serviceName">
                  <th mat-header-cell *matHeaderCellDef>Service</th>
                  <td mat-cell *matCellDef="let row">{{ row.serviceName }}</td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let row">
                    <button mat-icon-button color="primary" (click)="onEdit(row.id)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button color="warn" (click)="onDelete(row.id)"><mat-icon>delete</mat-icon></button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </ng-container>
        </mat-card>
      </div>
    </ng-template>
  `,
  styles: [`.toolbar-card { margin-bottom: 16px; } .search { display:flex; gap:8px; align-items:center; } .spacer { flex: 1 1 auto; } .content-card { padding: 16px; } .table-wrapper { overflow: auto; }`],
})
export class PositionsComponent implements OnInit {
  private readonly service = inject(PositionService);
  readonly loading = signal(false);
  readonly data = signal<Position[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly displayedColumns = ['code', 'title', 'serviceName', 'actions'];
  readonly searchControl = new FormControl('');
  readonly form = new FormGroup({
    code: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    serviceId: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadPositions();
  }

  onSearch(): void {
    this.loadPositions(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ code: '', title: '', serviceId: '' });
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (position) => {
        this.editingId.set(id);
        this.form.reset({ code: position.code ?? '', title: position.title, serviceId: position.serviceId ?? '' });
        this.showForm.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onDelete(id: string): void {
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadPositions(this.searchControl.value?.trim() ?? ''),
      error: () => this.loading.set(false),
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.form.getRawValue();
    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload as Position)
      : this.service.create(payload as Position);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadPositions(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ code: '', title: '', serviceId: '' });
  }

  private loadPositions(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items.map((position) => ({
          ...position,
          serviceName: position.service?.name ?? '—',
        })) as any);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}