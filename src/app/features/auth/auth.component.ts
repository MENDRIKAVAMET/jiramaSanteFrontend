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
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        
        <!-- CÔTÉ GAUCHE : Image JIRAMA avec Overlay Dégradé -->
        <div class="auth-image-side">
          <div class="image-overlay">
            <div class="overlay-brand">
              <span class="brand-tag">JIRAMA</span>
              <h2>Engagés pour votre bien-être & suivi sanitaire</h2>
            </div>
          </div>
        </div>

        <!-- CÔTÉ DROIT : Formulaire de connexion -->
        <div class="auth-form-side">
          <div class="form-wrapper">
            
            <!-- En-tête avec branding -->
            <div class="auth-header">
              <div class="logo-wrapper">
                <mat-icon class="auth-logo">health_and_safety</mat-icon>
              </div>
              <h1 class="auth-title">JIRAMA <span class="sante-text">Santé</span></h1>
              <p class="auth-subtitle">Portail de déclaration et suivi sanitaire</p>
            </div>

            <!-- Formulaire -->
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
              
              <!-- Champ Email -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Adresse email</mat-label>
                <mat-icon matPrefix class="field-icon">mail_outline</mat-icon>
                <input 
                  matInput 
                  type="email" 
                  formControlName="email" 
                  placeholder="votre.email@jirama.mg" 
                  autocomplete="email"
                />
                <mat-icon matSuffix class="field-icon-suffix">qr_code_scanner</mat-icon>
                @if (emailCtrl.hasError('required') && emailCtrl.touched) {
                  <mat-error>L'email est requis</mat-error>
                }
                @if (emailCtrl.hasError('email') && emailCtrl.touched) {
                  <mat-error>Format d'email invalide</mat-error>
                }
              </mat-form-field>

              <!-- Champ Mot de passe -->
              <div class="password-field-container">
                <!-- Champ Mot de passe nettoyé -->
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mot de passe</mat-label>
                  <mat-icon matPrefix class="field-icon">lock_outline</mat-icon>
                  
                  <input 
                    matInput 
                    [type]="hidePassword() ? 'password' : 'text'" 
                    formControlName="password" 
                    placeholder="••••••••" 
                    autocomplete="current-password"
                  />

                  <!-- Bouton Toggle placé à l'intérieur à droite -->
                  <button 
                    type="button"
                    mat-icon-button 
                    matSuffix 
                    (click)="hidePassword.set(!hidePassword())"
                    [attr.aria-label]="hidePassword() ? 'Afficher le mot de passe' : 'Masquer le mot de passe'"
                    class="toggle-password-btn"
                  >
                    <mat-icon class="toggle-icon">{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>

                  @if (passwordCtrl.hasError('required') && passwordCtrl.touched) {
                    <mat-error>Le mot de passe est requis</mat-error>
                  }
                </mat-form-field>
              </div>

             <!-- Alerte d'erreur (si présente) -->
            @if (errorMessage()) {
              <div class="auth-error">
                <mat-icon class="error-icon">error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <!-- Bouton de soumission avec alignement corrigé -->
            <button 
              mat-raised-button 
              type="submit" 
              class="auth-submit" 
              [disabled]="loading()"
            >
              @if (loading()) {
                <div class="spinner-container">
                  <mat-progress-spinner [diameter]="22" mode="indeterminate"></mat-progress-spinner>
                  <span>Connexion en cours...</span>
                </div>
              } @else {
                <div class="btn-content">
                  <span>Se connecter</span>
                  <mat-icon class="btn-arrow">arrow_forward</mat-icon>
                </div>
              }
            </button>
            </form>

            <!-- Pied de page -->
            <div class="auth-footer">
              <p>Espace réservé aux agents certifiés <strong class="jirama-highlight">JIRAMA</strong></p>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      --jirama-orange: #e65100;
      --jirama-green: #00796b;
      --jirama-green-dark: #004d40;
      --jirama-green-light: #e0f2f1;
      --text-main: #111827;
      --text-muted: #6b7280;
      --error-red: #d32f2f;
    }

    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--jirama-green-dark) 0%, #00695c 50%, var(--jirama-green-dark) 100%);
      padding: 24px;
      box-sizing: border-box;
    }

    .auth-container {
      display: flex;
      width: 100%;
      max-width: 1100px;
      min-height: 680px;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    }

    /* --- CÔTÉ GAUCHE : IMAGE --- */
    .auth-image-side {
      flex: 1.1;
      background-image: url('/jirama.jpeg');
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 77, 64, 0.9) 0%, rgba(0, 121, 107, 0.4) 60%, rgba(0, 0, 0, 0.1) 100%);
      padding: 40px;
      display: flex;
      align-items: flex-end;
    }

    .overlay-brand {
      color: #ffffff;
    }

    .brand-tag {
      background: var(--jirama-orange);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 12px;
    }

    .overlay-brand h2 {
      font-size: 26px;
      font-weight: 600;
      line-height: 1.3;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    /* --- CÔTÉ DROIT : FORMULAIRE --- */
    .auth-form-side {
      flex: 1;
      padding: 48px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }

    .form-wrapper {
      width: 100%;
      max-width: 380px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-wrapper {
      width: 68px;
      height: 68px;
      margin: 0 auto 16px auto;
      background: var(--jirama-green-light);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(0, 121, 107, 0.15);
    }

    .auth-logo {
      font-size: 38px;
      width: 38px;
      height: 38px;
      color: var(--jirama-green);
    }

    .auth-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;

      .sante-text {
        color: var(--jirama-green);
      }
    }

    .auth-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 6px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .field-icon {
      color: var(--text-muted);
      margin-right: 8px;
    }

    .field-icon-suffix {
      color: var(--text-muted);
      font-size: 20px;
    }

    /* Repositionnement du toggle password */
    .password-field-container {
      position: relative;
    }

    .password-bottom-bar {
      display: flex;
      justify-content: flex-start;
      margin-top: -12px;
      padding-left: 4px;
      margin-bottom: 8px;
    }

    .toggle-password-bottom-btn {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 4px 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: #e5e7eb;
        border-color: #d1d5db;
      }
    }

    .toggle-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    /* Bouton de soumission principal */
    .auth-submit {
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px !important;
      margin-top: 8px;
      background: var(--jirama-green) !important;
      color: #ffffff !important;
      box-shadow: 0 6px 20px rgba(0, 91, 150, 0.3) !important;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:hover:not([disabled]) {
        background: var(--jirama-green-dark) !important;
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(0, 77, 64, 0.4) !important;
      }

      &[disabled] {
        opacity: 0.7;
      }
    }

    .btn-arrow {
      font-size: 20px;
      width: 20px;
      height: 20px;
      transition: transform 0.2s ease;
    }

    .auth-submit:hover .btn-arrow {
      transform: translateX(4px);
    }

    .spinner-container {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
    }

    /* Alerte d'erreur globale */
    .auth-error {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--error-red);
      font-size: 13px;
      padding: 12px 16px;
      background: #fde8e8;
      border-left: 4px solid var(--error-red);
      border-radius: 8px;
    }

    .error-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .auth-footer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;

      .jirama-highlight {
        color: var(--jirama-orange);
      }
    }

    /* Responsivité Mobile / Tablette */
    @media (max-width: 850px) {
      .auth-container {
        flex-direction: column;
        min-height: auto;
      }

      .auth-image-side {
        min-height: 200px;
        flex: none;
      }

      .overlay-brand h2 {
        font-size: 20px;
      }

      .auth-form-side {
        padding: 32px 24px;
      }
    }
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
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue() as { email: string; password: string };

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        const user = this.auth.currentUser();
        this.router.navigateByUrl(redirect ?? (user ? getDefaultRouteForRole(user.role) : '/dashboard'));
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ?? 0;
        let message = 'Une erreur est survenue lors de la connexion.';

        if (status === 401) {
          message = 'Email ou mot de passe incorrect.';
        } else if (status === 403) {
          message = 'Votre compte a été désactivé.';
        } else if (status === 0) {
          message = 'Serveur injoignable. Vérifiez votre connexion.';
        }

        this.errorMessage.set(message);
      },
    });
  }
}