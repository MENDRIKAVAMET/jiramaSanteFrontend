import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfileService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { getDefaultRouteForRole } from '@core/constants';

function passwordsMatchValidator(group: import('@angular/forms').AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="change-password-container">
      <mat-card class="change-password-card">
        <div class="header">
          <mat-icon class="icon">lock_reset</mat-icon>
          <h1>Changement de mot de passe requis</h1>
          <p *ngIf="isForced()">
            Votre mot de passe est temporaire. Vous devez le modifier avant de continuer.
          </p>
          <p *ngIf="!isForced()">Choisissez un nouveau mot de passe pour votre compte.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe actuel</mat-label>
            <input matInput type="password" formControlName="currentPassword" />
            @if (form.controls.currentPassword.hasError('required') && form.controls.currentPassword.touched) {
              <mat-error>Le mot de passe actuel est requis</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nouveau mot de passe</mat-label>
            <input matInput type="password" formControlName="newPassword" />
            @if (form.controls.newPassword.hasError('required') && form.controls.newPassword.touched) {
              <mat-error>Le nouveau mot de passe est requis</mat-error>
            }
            @if (form.controls.newPassword.hasError('minlength') && form.controls.newPassword.touched) {
              <mat-error>Au moins 8 caractères</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmer le nouveau mot de passe</mat-label>
            <input matInput type="password" formControlName="confirmPassword" />
            @if (form.hasError('mismatch') && form.controls.confirmPassword.touched) {
              <mat-error>Les mots de passe ne correspondent pas</mat-error>
            }
          </mat-form-field>

          @if (errorMessage()) { <div class="error-banner">{{ errorMessage() }}</div> }

          <div class="actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">
              @if (loading()) { <mat-progress-spinner [diameter]="20" mode="indeterminate"></mat-progress-spinner> } @else { Enregistrer le nouveau mot de passe }
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .change-password-container { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:16px; }
    .change-password-card { width:100%; max-width:440px; padding:32px; border-radius:16px; }
    .header { text-align:center; margin-bottom:24px; }
    .icon { font-size:48px; width:48px; height:48px; color:#00897b; }
    .header h1 { font-size:20px; margin-top:8px; }
    .header p { font-size:14px; color:#607d8b; }
    .form { display:flex; flex-direction:column; gap:8px; }
    .full-width { width:100%; }
    .actions { margin-top:8px; }
    .actions button { width:100%; height:44px; }
    .error-banner { color:#f44336; font-size:13px; text-align:center; padding:8px; background:rgba(244,67,54,0.08); border-radius:8px; }
  `],
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isForced = computed(() => this.auth.mustChangePassword());

  readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const { currentPassword, newPassword } = this.form.getRawValue();

    this.profileService.changePassword({ currentPassword: currentPassword!, newPassword: newPassword! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.auth.clearMustChangePassword();
        const user = this.auth.currentUser();
        this.router.navigateByUrl(user ? getDefaultRouteForRole(user.role) : '/dashboard');
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ?? 0;
        this.errorMessage.set(
          status === 401
            ? 'Le mot de passe actuel est incorrect.'
            : 'Une erreur est survenue, veuillez réessayer.',
        );
      },
    });
  }
}
