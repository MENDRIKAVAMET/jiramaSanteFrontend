import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { DeclarationService, AgentService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import {
  DeclarationListItem,
  DeclarationType,
  DeclarationPriority,
  DECLARATION_PRIORITY_LABELS,
} from '@core/models';

@Component({
  selector: 'app-declarations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="assignment" title="Déclarations sanitaires" [subtitle]="subtitle()"></app-page-header>

      <mat-card class="toolbar-card">
        <mat-toolbar>
          @if (auth.isAdmin()) {
            <div class="search">
              <mat-form-field appearance="outline">
                <input matInput placeholder="Rechercher" [formControl]="searchControl" (keyup.enter)="onSearch()" />
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="onSearch()"><mat-icon>search</mat-icon> Rechercher</button>
            </div>
          }
          <span class="spacer"></span>
          @if (auth.isAgent() || auth.isAdmin()) {
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouvelle déclaration</button>
          }
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
        <form *ngIf="showForm()" [formGroup]="form" class="form-grid" (ngSubmit)="submitForm()">
          @if (auth.isAdmin()) {
            <mat-form-field appearance="outline">
              <mat-label>Agent</mat-label>
              <mat-select formControlName="agentId">
                <mat-option *ngFor="let a of agents()" [value]="a.id">
                  {{ a.firstName }} {{ a.lastName }} ({{ a.matricule }})
                </mat-option>
              </mat-select>
            </mat-form-field>
          }
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="maladie">Maladie</mat-option>
              <mat-option value="accident">Accident</mat-option>
              <mat-option value="blessure">Blessure</mat-option>
              <mat-option value="symptome">Symptôme</mat-option>
              <mat-option value="visite_medicale">Visite médicale</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option *ngFor="let p of priorities" [value]="p">{{ priorityLabels[p] }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput type="date" formControlName="date" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Sujet</mat-label>
            <input matInput formControlName="subject" />
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
          <empty-state *ngIf="data().length === 0" title="Aucune donnée" description="Aucune déclaration disponible pour le moment."></empty-state>
          <div *ngIf="data().length > 0" class="table-wrapper">
            <table mat-table [dataSource]="data()" class="mat-elevation-z2">
              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Référence</th>
                <td mat-cell *matCellDef="let row">{{ row.reference }}</td>
              </ng-container>
              <ng-container matColumnDef="agentName">
                <th mat-header-cell *matHeaderCellDef>Agent</th>
                <td mat-cell *matCellDef="let row">{{ row.agentName }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let row">{{ row.status }}</td>
              </ng-container>
              <ng-container matColumnDef="declarationDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let row">{{ row.declarationDate | slice:0:10 }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="onView(row.id)"><mat-icon>visibility</mat-icon></button>
                  @if (auth.isAdmin()) {
                    <button mat-icon-button color="primary" (click)="onEdit(row.id)"><mat-icon>edit</mat-icon></button>
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
export class DeclarationsComponent implements OnInit {
  private readonly service = inject(DeclarationService);
  private readonly agentService = inject(AgentService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly data = signal<DeclarationListItem[]>([]);
  readonly agents = signal<{ id: string; firstName: string; lastName: string; matricule: string }[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly displayedColumns = ['reference', 'agentName', 'status', 'declarationDate', 'actions'];
  readonly searchControl = new FormControl('');

  readonly priorities: DeclarationPriority[] = ['faible', 'moyenne', 'elevee', 'urgente'];
  readonly priorityLabels = DECLARATION_PRIORITY_LABELS;

  readonly subtitle = computed(() => {
    if (this.auth.isAdmin()) return 'Toutes les déclarations sanitaires';
    if (this.auth.isMedecin()) return 'Déclarations en attente de prise en charge';
    return 'Mes déclarations';
  });

  readonly form = new FormGroup({
    agentId: new FormControl<string | null>(null),
    type: new FormControl<DeclarationType>('maladie', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl<DeclarationPriority>('moyenne', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl('', { nonNullable: true }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.loadDeclarations();
    if (this.auth.isAdmin()) {
      this.agentService.getAll({ page: 1, pageSize: 100 }).subscribe({
        next: (response) => this.agents.set(response.items as any),
      });
    }
  }

  onSearch(): void {
    this.loadDeclarations(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    this.editingId.set(null);
    this.form.reset({ agentId: null, type: 'maladie', priority: 'moyenne', date: '', subject: '', description: '' });
    this.showForm.set(true);
  }

  onEdit(id: string): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (declaration: any) => {
        this.editingId.set(id);
        this.form.reset({
          agentId: declaration.agentId ?? null,
          type: declaration.type,
          priority: declaration.priority,
          date: declaration.date?.slice(0, 10) ?? '',
          subject: declaration.subject,
          description: declaration.description,
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
    if (!confirm('Supprimer cette déclaration ?')) return;
    this.loading.set(true);
    this.service.delete(id).subscribe({
      next: () => this.loadDeclarations(this.searchControl.value?.trim() ?? ''),
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
      type: raw.type,
      priority: raw.priority,
      subject: raw.subject,
      description: raw.description,
      date: raw.date ? new Date(raw.date).toISOString() : undefined,
      agentId: raw.agentId || undefined,
    };

    const request = this.editingId()
      ? this.service.update(this.editingId()!, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadDeclarations(this.searchControl.value?.trim() ?? '');
      },
      error: () => this.loading.set(false),
    });
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ agentId: null, type: 'maladie', priority: 'moyenne', date: '', subject: '', description: '' });
  }

  private mapRow = (declaration: any): DeclarationListItem => ({
    id: declaration.id,
    reference: declaration.number,
    agentName: declaration.agent
      ? `${declaration.agent.firstName} ${declaration.agent.lastName}`
      : '—',
    status: declaration.status,
    declarationDate: declaration.date,
  } as any);

  private loadDeclarations(query = ''): void {
    this.loading.set(true);

    if (this.auth.isAdmin()) {
      const request = query
        ? this.service.search(query, { page: 1, pageSize: 20 })
        : this.service.getAll({ page: 1, pageSize: 20 });

      request.subscribe({
        next: (response) => {
          this.data.set(response.items.map(this.mapRow));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
      return;
    }

    const request = this.auth.isMedecin()
      ? this.service.getPending()
      : this.service.getMyDeclarations();

    request.subscribe({
      next: (items) => {
        this.data.set((items as any[]).map(this.mapRow));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}