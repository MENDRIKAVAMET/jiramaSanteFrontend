import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent } from '@shared/components';
import { DiagnosticService, ConsultationService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { DiagnosticListItem, Consultation } from '@core/models';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
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
          @if (auth.isAdmin() || auth.isMedecin()) {
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouveau diagnostic</button>
          }
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <form *ngIf="showForm()" [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Consultation</mat-label>
            <mat-select formControlName="consultationId">
              <mat-option *ngFor="let c of consultations()" [value]="c.id">{{ consultationLabel(c) }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput rows="4" formControlName="description"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>

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
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="onView(row.id)"><mat-icon>visibility</mat-icon></button>
                  @if (auth.isAdmin() || auth.isMedecin()) {
                    <button mat-icon-button color="primary" (click)="onEdit(row.id)"><mat-icon>edit</mat-icon></button>
                  }
                  @if (auth.isAdmin()) {
                    <button mat-icon-button color="warn" (click)="onDelete(row.id)"><mat-icon>delete</mat-icon></button>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </ng-container>
      </mat-card>
    </div>
  `,
  styles: [`.toolbar-card { margin-bottom: 16px; } .search { display:flex; gap:8px; align-items:center; } .spacer { flex: 1 1 auto; } .content-card { padding: 16px; } .table-wrapper { overflow: auto; } .form-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; margin-bottom: 16px; } .full-width { grid-column: 1 / -1; } .form-actions { grid-column: 1 / -1; display:flex; justify-content:flex-end; gap: 8px; }`],
})
export class DiagnosticsComponent implements OnInit {
  private readonly service = inject(DiagnosticService);
  private readonly consultationService = inject(ConsultationService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly data = signal<DiagnosticListItem[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly consultations = signal<Consultation[]>([]);
  readonly displayedColumns = ['id', 'consultationRef', 'result', 'date', 'actions'];
  readonly searchControl = new FormControl('');

  readonly form = new FormGroup({
    consultationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.loadDiagnostics();
  }

  onSearch(): void {
    this.loadDiagnostics(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ consultationId: '', description: '' });
    this.loadFormOptions();
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.loadFormOptions();
    this.service.getById(id).subscribe({
      next: (diagnostic) => {
        this.editingId.set(id);
        this.form.reset({
          consultationId: diagnostic.consultationId,
          description: diagnostic.description,
        });
        this.showForm.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onView(id: string): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  onDelete(id: string): void {
    if (!confirm('Supprimer ce diagnostic ?')) {
      return;
    }
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadDiagnostics(this.searchControl.value?.trim() ?? ''),
      error: () => this.loading.set(false),
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const raw = this.form.getRawValue();
    const payload: any = {
      consultationId: raw.consultationId,
      description: raw.description,
    };

    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadDiagnostics(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ consultationId: '', description: '' });
  }

  consultationLabel(consultation: Consultation): string {
    const date = consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleDateString('fr-FR') : '—';
    const patient = consultation.declaration?.agent
      ? `${consultation.declaration.agent.firstName} ${consultation.declaration.agent.lastName}`
      : '—';
    const doctor = consultation.doctor ? ` (Dr ${consultation.doctor.lastName})` : '';
    return `${date} — ${patient}${doctor}`;
  }

  private loadFormOptions(): void {
    this.consultationService.getAll({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.consultations.set(response.items),
    });
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
