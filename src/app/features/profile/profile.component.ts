import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PageHeaderComponent, LoadingSpinnerComponent } from '@shared/components';
import { ProfileService } from '@core/services';
import { User } from '@core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, PageHeaderComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-container">
      <app-page-header icon="person" title="Mon profil" subtitle="Gestion de votre profil utilisateur"></app-page-header>

      <mat-card>
        <loading-spinner *ngIf="loading()"></loading-spinner>
        <form *ngIf="!loading()" class="profile-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom complet</mat-label>
            <input matInput [formControl]="nameControl" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [formControl]="emailControl" />
          </mat-form-field>
          <div class="actions">
            <button mat-flat-button color="primary" (click)="onSave()">Enregistrer</button>
          </div>
        </form>
      </mat-card>

      <mat-card class="security-card">
        <div class="security-row">
          <div>
            <strong>Sécurité du compte</strong>
            <p>Modifiez votre mot de passe à tout moment.</p>
          </div>
          <button mat-stroked-button color="primary" routerLink="/change-password">
            <mat-icon>lock_reset</mat-icon> Changer le mot de passe
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .full-width { width: 100%; }
    .profile-form { display:flex; gap:12px; flex-direction:column; }
    .actions { display:flex; justify-content:flex-end; }
    .security-card { margin-top:16px; padding:16px; }
    .security-row { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    .security-row p { margin:4px 0 0; font-size:13px; color:#607d8b; }
  `],
})
export class ProfileComponent implements OnInit {
  private readonly service = inject(ProfileService);
  readonly loading = signal(false);
  readonly profile = signal<User | null>(null);
  readonly nameControl = new FormControl('');
  readonly emailControl = new FormControl('');

  ngOnInit(): void {
    this.loadProfile();
  }

  onSave(): void {
    const existing = this.profile();
    if (!existing) {
      return;
    }

    const [firstName, ...rest] = (this.nameControl.value ?? existing.firstName).trim().split(' ');
    const lastName = rest.length ? rest.join(' ') : existing.lastName;

    this.loading.set(true);
    this.service.updateProfile({
      firstName: firstName || existing.firstName,
      lastName,
      email: this.emailControl.value?.trim() ?? existing.email,
    }).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.nameControl.setValue(`${updated.firstName} ${updated.lastName}`.trim());
        this.emailControl.setValue(updated.email);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.nameControl.setValue(`${profile.firstName} ${profile.lastName}`.trim());
        this.emailControl.setValue(profile.email);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
