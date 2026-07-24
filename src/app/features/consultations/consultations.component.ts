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
import { ConsultationService, DeclarationService, UserService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { ConsultationListItem, Declaration, Doctor } from '@core/models';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="medical_services" title="Consultations" subtitle="Historique des consultations et suivis"></app-page-header>

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
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouvelle consultation</button>
          }
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <form *ngIf="showForm()" [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Déclaration</mat-label>
            <mat-select formControlName="declarationId">
              <mat-option *ngFor="let d of declarations()" [value]="d.id">{{ declarationLabel(d) }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Médecin</mat-label>
            <mat-select formControlName="doctorId">
              <mat-option [value]="null">—</mat-option>
              <mat-option *ngFor="let doc of doctors()" [value]="doc.id">Dr {{ doc.firstName }} {{ doc.lastName }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date planifiée</mat-label>
            <input matInput type="datetime-local" formControlName="scheduledAt" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option value="planifiee">Planifiée</mat-option>
              <mat-option value="terminee">Terminée</mat-option>
              <mat-option value="annulee">Annulée</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput rows="4" formControlName="notes"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>

        <loading-spinner *ngIf="loading()"></loading-spinner>
        <ng-container *ngIf="!loading()">
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucune consultation disponible pour le moment."></empty-state>
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
              <ng-container matColumnDef="doctor">
                <th mat-header-cell *matHeaderCellDef>Médecin</th>
                <td mat-cell *matCellDef="let row">{{ row.doctorName }}</td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let row">{{ row.date }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let row">{{ row.status }}</td>
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
export class ConsultationsComponent implements OnInit {
  private readonly service = inject(ConsultationService);
  private readonly declarationService = inject(DeclarationService);
  private readonly userService = inject(UserService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly data = signal<ConsultationListItem[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly declarations = signal<Declaration[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly displayedColumns = ['reference', 'patient', 'doctor', 'date', 'status', 'actions'];
  readonly searchControl = new FormControl('');

  readonly form = new FormGroup({
    declarationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    doctorId: new FormControl<string | null>(null),
    scheduledAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<string>('planifiee', { nonNullable: true }),
    notes: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadConsultations();
  }

  onSearch(): void {
    this.loadConsultations(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ declarationId: '', doctorId: null, scheduledAt: '', status: 'planifiee', notes: '' });
    this.loadFormOptions();
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.loadFormOptions();
    this.service.getById(id).subscribe({
      next: (consultation: any) => {
        this.editingId.set(id);
        this.form.reset({
          declarationId: consultation.declarationId,
          doctorId: consultation.doctorId ?? null,
          scheduledAt: this.toDateTimeLocal(consultation.scheduledAt),
          status: consultation.status ?? 'planifiee',
          notes: consultation.notes ?? '',
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
    if (!confirm('Supprimer cette consultation ?')) {
      return;
    }
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadConsultations(this.searchControl.value?.trim() ?? ''),
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

    // declarationId n'est modifiable qu'à la création (absent du DTO update)
    const payload: any = this.editingId()
      ? {
          doctorId: raw.doctorId || undefined,
          scheduledAt: new Date(raw.scheduledAt).toISOString(),
          status: raw.status,
          notes: raw.notes || undefined,
        }
      : {
          declarationId: raw.declarationId,
          doctorId: raw.doctorId || undefined,
          scheduledAt: new Date(raw.scheduledAt).toISOString(),
          status: raw.status,
          notes: raw.notes || undefined,
        };

    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadConsultations(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ declarationId: '', doctorId: null, scheduledAt: '', status: 'planifiee', notes: '' });
  }

  declarationLabel(declaration: Declaration): string {
    const agent = declaration.agent ? `${declaration.agent.firstName} ${declaration.agent.lastName}` : '—';
    const ref = declaration.id.slice(0, 8);
    return `${ref} — ${agent}`;
  }

  private toDateTimeLocal(value: string): string {
    // Convertit une date ISO en format attendu par <input type="datetime-local">
    const date = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private loadFormOptions(): void {
    this.declarationService.getAll({ page: 1, pageSize: 100 }).subscribe({
      next: (response: any) => this.declarations.set(response.items),
    });
    this.userService.getDoctors().subscribe({
      next: (doctors: Doctor[]) => this.doctors.set(doctors),
    });
  }

  private loadConsultations(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items.map((consultation) => ({
          id: consultation.id,
          reference: consultation.id.slice(0, 8),
          patientName: consultation.declaration?.agent
            ? `${consultation.declaration.agent.firstName} ${consultation.declaration.agent.lastName}`
            : '—',
          doctorName: consultation.doctor
            ? `Dr ${consultation.doctor.firstName} ${consultation.doctor.lastName}`
            : '—',
          date: consultation.scheduledAt,
          status: consultation.status,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
