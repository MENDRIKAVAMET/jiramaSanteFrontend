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
import { AgentService } from '@core/services';
import { Agent } from '@core/models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule,
    PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent,
  ],
  template: `
    <div class="page-container">
      <app-page-header icon="group" title="Agents" subtitle="Gestion des agents JIRAMA"></app-page-header>

      <mat-card class="toolbar-card">
        <mat-toolbar>
          <div class="search">
            <mat-form-field appearance="outline">
              <input matInput placeholder="Rechercher" [formControl]="searchControl" (keyup.enter)="onSearch()" />
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="onSearch()"><mat-icon>search</mat-icon> Rechercher</button>
          </div>
          <span class="spacer"></span>
          <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouvel agent</button>
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <form *ngIf="showForm()" [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          <mat-form-field appearance="outline">
            <mat-label>Matricule</mat-label>
            <input matInput formControlName="matricule" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">Enregistrer</button>
          </div>
        </form>

        <loading-spinner *ngIf="loading()"></loading-spinner>

        <ng-container *ngIf="!loading()">
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucun agent disponible pour le moment."></empty-state>

          <div *ngIf="data().length > 0" class="table-wrapper">
            <table mat-table [dataSource]="data()" class="mat-elevation-z2">
              <ng-container matColumnDef="matricule">
                <th mat-header-cell *matHeaderCellDef>Matricule</th>
                <td mat-cell *matCellDef="let row">{{ row.matricule }}</td>
              </ng-container>
              <ng-container matColumnDef="firstName">
                <th mat-header-cell *matHeaderCellDef>Prénom</th>
                <td mat-cell *matCellDef="let row">{{ row.firstName }}</td>
              </ng-container>
              <ng-container matColumnDef="lastName">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let row">{{ row.lastName }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let row">{{ row.email }}</td>
              </ng-container>
              <ng-container matColumnDef="directionName">
                <th mat-header-cell *matHeaderCellDef>Direction</th>
                <td mat-cell *matCellDef="let row">{{ row.directionName }}</td>
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
  `,
  styles: [
    `.toolbar-card { margin-bottom: 16px; }
    .search { display:flex; gap:8px; align-items:center; }
    .spacer { flex: 1 1 auto; }
    .content-card { padding: 16px; }
    .table-wrapper { overflow: auto; }
    .form-grid { display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom:16px; }
    .form-actions { grid-column: 1 / -1; display:flex; justify-content:flex-end; gap:8px; }`
  ],
})
export class AgentsComponent implements OnInit {
  private readonly service = inject(AgentService);
  readonly loading = signal(false);
  readonly data = signal<Agent[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly displayedColumns = ['matricule', 'firstName', 'lastName', 'email', 'directionName', 'serviceName', 'actions'];
  readonly searchControl = new FormControl('');
  readonly form = new FormGroup({
    matricule: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadAgents();
  }

  onSearch(): void {
    this.loadAgents(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ matricule: '', firstName: '', lastName: '', email: '', phone: '' });
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (agent) => {
        this.editingId.set(id);
        this.form.reset({
          matricule: agent.matricule,
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          phone: agent.phone ?? '',
        });
        this.showForm.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onDelete(id: string): void {
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadAgents(this.searchControl.value?.trim() ?? ''),
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
      ? this.service.update(this.editingId()!, { ...payload, phone: payload.phone || null })
      : this.service.create({ ...payload, phone: payload.phone || null, directionId: '', serviceId: '', positionId: '', isActive: true, hiredAt: new Date().toISOString(), directionName: '', serviceName: '', positionName: '' } as Agent);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadAgents(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ matricule: '', firstName: '', lastName: '', email: '', phone: '' });
  }

  private loadAgents(query = ''): void {
    this.loading.set(true);
    const request = query
      ? this.service.search(query, { page: 1, pageSize: 20 })
      : this.service.getAll({ page: 1, pageSize: 20 });

    request.subscribe({
      next: (response) => {
        this.data.set(response.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
