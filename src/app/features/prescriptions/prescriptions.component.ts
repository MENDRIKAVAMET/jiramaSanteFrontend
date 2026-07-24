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
import { PrescriptionService, ConsultationService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { PrescriptionListItem, Consultation, PrescriptionStatus, PRESCRIPTION_STATUS_LABELS } from '@core/models';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="receipt_long" title="Prescriptions" subtitle="Gestion des prescriptions médicales"></app-page-header>

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
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouvelle prescription</button>
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
          <mat-form-field appearance="outline">
            <mat-label>Médicament</mat-label>
            <input matInput formControlName="medication" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dosage</mat-label>
            <input matInput formControlName="dosage" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Durée</mat-label>
            <input matInput formControlName="duration" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option *ngFor="let s of prescriptionStatuses" [value]="s.value">{{ s.label }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Instructions</mat-label>
            <textarea matInput rows="4" formControlName="instructions"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>

        <loading-spinner *ngIf="loading()"></loading-spinner>
        <ng-container *ngIf="!loading()">
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucune prescription disponible pour le moment."></empty-state>
          <div *ngIf="data().length > 0" class="table-wrapper">
            <table mat-table [dataSource]="data()" class="mat-elevation-z2">
              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Réf.</th>
                <td mat-cell *matCellDef="let row">{{ row.reference }}</td>
              </ng-container>
              <ng-container matColumnDef="patient">
                <th mat-header-cell *matHeaderCellDef>Patient</th>
                <td mat-cell *matCellDef="let row">{{ row.patientName }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let row">{{ statusLabel(row.status) }}</td>
              </ng-container>
              <ng-container matColumnDef="issuedAt">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let row">{{ row.issuedAt }}</td>
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
export class PrescriptionsComponent implements OnInit {
  private readonly service = inject(PrescriptionService);
  private readonly consultationService = inject(ConsultationService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly data = signal<PrescriptionListItem[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly consultations = signal<Consultation[]>([]);
  readonly displayedColumns = ['reference', 'patient', 'status', 'issuedAt', 'actions'];
  readonly searchControl = new FormControl('');
  readonly prescriptionStatuses = Object.entries(PRESCRIPTION_STATUS_LABELS).map(([value, label]) => ({ value, label }));

  readonly form = new FormGroup({
    consultationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    medication: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dosage: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    duration: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    instructions: new FormControl('', { nonNullable: true }),
    status: new FormControl<PrescriptionStatus>('active', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  onSearch(): void {
    this.loadPrescriptions(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ consultationId: '', medication: '', dosage: '', duration: '', instructions: '', status: 'active' });
    this.loadFormOptions();
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.loadFormOptions();
    this.service.getById(id).subscribe({
      next: (prescription) => {
        this.editingId.set(id);
        this.form.reset({
          consultationId: prescription.consultationId,
          medication: prescription.medication,
          dosage: prescription.dosage,
          duration: prescription.duration,
          instructions: prescription.instructions ?? '',
          status: prescription.status,
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
    if (!confirm('Supprimer cette prescription ?')) {
      return;
    }
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadPrescriptions(this.searchControl.value?.trim() ?? ''),
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
      medication: raw.medication,
      dosage: raw.dosage,
      duration: raw.duration,
      instructions: raw.instructions || null,
      status: raw.status,
    };

    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadPrescriptions(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ consultationId: '', medication: '', dosage: '', duration: '', instructions: '', status: 'active' });
  }

  statusLabel(status: PrescriptionStatus): string {
    return PRESCRIPTION_STATUS_LABELS[status] ?? status;
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

  private loadPrescriptions(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items.map((prescription) => ({
          id: prescription.id,
          reference: prescription.id.slice(0, 8),
          patientName: prescription.consultation?.declaration?.agent
            ? `${prescription.consultation.declaration.agent.firstName} ${prescription.consultation.declaration.agent.lastName}`
            : '—',
          issuedAt: prescription.createdAt,
          status: prescription.status,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
