import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent } from '@shared/components';
import { DeclarationService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { DeclarationListItem } from '@core/models';

@Component({
  selector: 'app-declarations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule, PageHeaderComponent, EmptyStateComponent, LoadingSpinnerComponent],
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
          @if (auth.isAgent()) {
            <button mat-flat-button color="primary" (click)="onCreate()"><mat-icon>add</mat-icon> Nouvelle déclaration</button>
          }
        </mat-toolbar>
      </mat-card>

      <mat-card class="content-card">
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
                <td mat-cell *matCellDef="let row">{{ row.declarationDate }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="onView(row.id)"><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button color="primary" (click)="onEdit(row.id)"><mat-icon>edit</mat-icon></button>
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
  styles: [`.toolbar-card { margin-bottom: 16px; } .search { display:flex; gap:8px; align-items:center; } .spacer { flex: 1 1 auto; } .content-card { padding: 16px; } .table-wrapper { overflow: auto; }`],
})
export class DeclarationsComponent implements OnInit {
  private readonly service = inject(DeclarationService);
  readonly auth = inject(AuthService);
  readonly loading = signal(false);
  readonly data = signal<DeclarationListItem[]>([]);
  readonly displayedColumns = ['reference', 'agentName', 'status', 'declarationDate', 'actions'];
  readonly searchControl = new FormControl('');

  readonly subtitle = computed(() => {
    if (this.auth.isAdmin()) return 'Toutes les déclarations sanitaires';
    if (this.auth.isMedecin()) return 'Déclarations en attente de prise en charge';
    return 'Mes déclarations';
  });

  ngOnInit(): void {
    this.loadDeclarations();
  }

  onSearch(): void {
    // La recherche côté serveur n'existe que pour la liste paginée (Admin).
    this.loadDeclarations(this.searchControl.value?.trim() ?? '');
  }

  onCreate(): void {
    console.warn('Create declaration workflow is not implemented yet.');
  }

  onView(id: string): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  onEdit(id: string): void {
    this.onView(id);
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

    // Chaque rôle n'a accès qu'à un sous-ensemble de l'API côté backend :
    // - ADMINISTRATEUR : liste paginée complète (+ recherche)
    // - MEDECIN : déclarations en attente de prise en charge
    // - AGENT : ses propres déclarations
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

    const request = this.auth.isMedecin() ? this.service.getPending() : this.service.getMyDeclarations();

    request.subscribe({
      next: (items) => {
        this.data.set((items as any[]).map(this.mapRow));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
