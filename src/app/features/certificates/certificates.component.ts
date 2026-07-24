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
import { MatDatepickerModule } from '@angular/material/datepicker';

import { PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent } from '@shared/components';
import { CertificateService, DeclarationService, DoctorService, mapDeclarationToListItem } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { CertificateListItem, DeclarationListItem, Doctor, CertificateType, CERTIFICATE_TYPE_LABELS } from '@core/models';
import { DateUtils } from '@shared/utils/date.utils';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule, MatDatepickerModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="verified" title="Certificats médicaux" subtitle="Arrêts maladie, aptitudes, évacuations"></app-page-header>

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
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouveau certificat</button>
          }
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <form *ngIf="showForm()" [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          <mat-form-field appearance="outline">
            <mat-label>Déclaration</mat-label>
            <mat-select formControlName="declarationId">
              <mat-option *ngFor="let d of declarations()" [value]="d.id">{{ d.reference }} — {{ d.agentName }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Médecin</mat-label>
            <mat-select formControlName="doctorId">
              <mat-option *ngFor="let doc of doctors()" [value]="doc.id">Dr {{ doc.firstName }} {{ doc.lastName }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option *ngFor="let t of certificateTypes" [value]="t.value">{{ t.label }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Valide du</mat-label>
            <input matInput [matDatepicker]="validFromPicker" formControlName="validFrom" readonly (click)="validFromPicker.open()" />
            <mat-datepicker-toggle matSuffix [for]="validFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #validFromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Valide au</mat-label>
            <input matInput [matDatepicker]="validToPicker" formControlName="validTo" readonly (click)="validToPicker.open()" />
            <mat-datepicker-toggle matSuffix [for]="validToPicker"></mat-datepicker-toggle>
            <mat-datepicker #validToPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contenu</mat-label>
            <textarea matInput rows="4" formControlName="content"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>

        <loading-spinner *ngIf="loading()"></loading-spinner>
        <ng-container *ngIf="!loading()">
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucun certificat disponible pour le moment."></empty-state>
          <div *ngIf="data().length > 0" class="table-wrapper">
            <table mat-table [dataSource]="data()" class="mat-elevation-z2">
              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Référence</th>
                <td mat-cell *matCellDef="let row">{{ row.reference }}</td>
              </ng-container>
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let row">{{ typeLabel(row.type) }}</td>
              </ng-container>
              <ng-container matColumnDef="issuedTo">
                <th mat-header-cell *matHeaderCellDef>Dossier</th>
                <td mat-cell *matCellDef="let row">{{ row.issuedTo }}</td>
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
export class CertificatesComponent implements OnInit {
  private readonly service = inject(CertificateService);
  private readonly declarationService = inject(DeclarationService);
  private readonly doctorService = inject(DoctorService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly data = signal<CertificateListItem[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly declarations = signal<DeclarationListItem[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly displayedColumns = ['reference', 'type', 'issuedTo', 'date', 'actions'];
  readonly searchControl = new FormControl('');
  readonly certificateTypes = Object.entries(CERTIFICATE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

  readonly form = new FormGroup({
    declarationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    doctorId: new FormControl('', { nonNullable: true }),
    type: new FormControl<CertificateType>('repos', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    validFrom: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    validTo: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.loadCertificates();
  }

  onSearch(): void {
    this.loadCertificates(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ declarationId: '', doctorId: '', type: 'repos', content: '', validFrom: null, validTo: null });
    this.loadFormOptions();
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.loadFormOptions();
    this.service.getById(id).subscribe({
      next: (certificate) => {
        this.editingId.set(id);
        this.form.reset({
          declarationId: certificate.declarationId,
          doctorId: certificate.doctorId ?? '',
          type: certificate.type,
          content: certificate.content,
          validFrom: certificate.validFrom ? new Date(certificate.validFrom) : null,
          validTo: certificate.validTo ? new Date(certificate.validTo) : null,
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
    if (!confirm('Supprimer ce certificat ?')) {
      return;
    }
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadCertificates(this.searchControl.value?.trim() ?? ''),
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
      declarationId: raw.declarationId,
      doctorId: raw.doctorId || null,
      type: raw.type,
      content: raw.content,
      validFrom: DateUtils.toDateOnlyIso(raw.validFrom),
      validTo: DateUtils.toDateOnlyIso(raw.validTo),
    };

    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadCertificates(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ declarationId: '', doctorId: '', type: 'repos', content: '', validFrom: null, validTo: null });
  }

  typeLabel(type: CertificateType): string {
    return CERTIFICATE_TYPE_LABELS[type] ?? type;
  }

  private loadFormOptions(): void {
    this.declarationService.getAll({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.declarations.set(response.items.map(mapDeclarationToListItem)),
    });
    this.doctorService.getAll({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.doctors.set(response.items),
    });
  }

  private loadCertificates(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items.map((certificate) => ({
          id: certificate.id,
          reference: certificate.id.slice(0, 8),
          type: certificate.type,
          issuedTo: certificate.declaration?.agent
            ? `${certificate.declaration.agent.firstName} ${certificate.declaration.agent.lastName}`
            : '—',
          date: certificate.issuedAt,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}