import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { getDefaultRouteForRole } from '@core/constants';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-logo">health_and_safety</mat-icon>
          <h1 class="auth-title">JIRAMA Santé</h1>
          <p class="auth-subtitle">Déclaration et suivi sanitaire</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="votre.email@jirama.mg" />
            <mat-icon matSuffix>mail</mat-icon>
            @if (emailCtrl.hasError('required') && emailCtrl.touched) { <mat-error>L'email est requis</mat-error> }
            @if (emailCtrl.hasError('email') && emailCtrl.touched) { <mat-error>Email invalide</mat-error> }
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Votre mot de passe" />
            <button matIconButtonSuffix (click)="hidePassword.set(!hidePassword())" type="button" [attr.aria-label]="hidePassword() ? 'Afficher' : 'Masquer'">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (passwordCtrl.hasError('required') && passwordCtrl.touched) { <mat-error>Le mot de passe est requis</mat-error> }
          </mat-form-field>
          @if (errorMessage()) { <div class="auth-error">{{ errorMessage() }}</div> }
          <button mat-raised-button color="primary" type="submit" class="auth-submit" [disabled]="loading()">
            @if (loading()) { <mat-progress-spinner [diameter]="20" mode="indeterminate"></mat-progress-spinner> } @else { Se connecter }
          </button>
        </form>
        <p class="auth-footer">Application de déclaration sanitaire — Agents JIRAMA</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; background: linear-gradient(135deg, #00897b 0%, #004d40 100%); }
    .auth-card { width: 100%; max-width: 420px; padding: 32px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 56px; width: 56px; height: 56px; color: #00897b; }
    .auth-title { font-size: 24px; font-weight: 600; color: #00695c; margin-top: 12px; }
    .auth-subtitle { font-size: 14px; color: #78909c; margin-top: 4px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .auth-submit { height: 48px; font-size: 16px; margin-top: 8px; }
    .auth-error { color: #f44336; font-size: 13px; text-align: center; padding: 8px; background: rgba(244,67,54,0.08); border-radius: 8px; }
    .auth-footer { text-align: center; font-size: 12px; color: #b0bec5; margin-top: 24px; }
  `],
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailCtrl() { return this.form.controls.email; }
  get passwordCtrl() { return this.form.controls.password; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue() as { email: string; password: string };
    this.auth.login({ email, password }).subscribe({
      next: (session) => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(redirect ?? getDefaultRouteForRole(session.user.role));
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ?? 0;
        this.errorMessage.set(
          status === 401 ? 'Email ou mot de passe incorrect.' :
          status === 403 ? "Votre compte est désactivé." :
          status === 0 ? 'Serveur injoignable.' : 'Une erreur est survenue.'
        );
      },
    });
  }
}
