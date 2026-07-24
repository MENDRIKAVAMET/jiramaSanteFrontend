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
    <div class="auth-page">
      <div class="auth-card-split">
        
        <!-- Partie Gauche : Image et Slogan -->
        <div class="auth-brand-side">
          <div class="brand-overlay">
            <span class="brand-badge">JIRAMA</span>
            <h2 class="brand-slogan">Engagés pour votre bien-être &<br>suivi sanitaire</h2>
          </div>
        </div>

        <!-- Partie Droite : Formulaire -->
        <div class="auth-form-side">
          <div class="auth-header">
            <mat-icon class="auth-logo">health_and_safety</mat-icon> <!-- ou shield -->
            <h1 class="auth-title"><span class="text-dark">JIRAMA</span> <span class="text-green">Santé</span></h1>
            <p class="auth-subtitle">Portail de déclaration et suivi sanitaire</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Champ Email -->
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-icon matPrefix class="input-icon">mail_outline</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="Adresse email*" />
              @if (emailCtrl.hasError('required') && emailCtrl.touched) { <mat-error>L'email est requis</mat-error> }
              @if (emailCtrl.hasError('email') && emailCtrl.touched) { <mat-error>Email invalide</mat-error> }
            </mat-form-field>

            <!-- Champ Mot de passe -->
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-icon matPrefix class="input-icon">lock_outline</mat-icon>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Mot de passe*" />
              
              <!-- Le bouton d'affichage est bien aligné grâce à matSuffix -->
              <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" type="button" [attr.aria-label]="hidePassword() ? 'Afficher' : 'Masquer'">
                <mat-icon class="input-icon">{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              
              @if (passwordCtrl.hasError('required') && passwordCtrl.touched) { <mat-error>Le mot de passe est requis</mat-error> }
            </mat-form-field>

            @if (errorMessage()) { <div class="auth-error">{{ errorMessage() }}</div> }

            <!-- Bouton Submit -->
            <button mat-flat-button type="submit" class="auth-submit" [disabled]="loading()">
              @if (loading()) { 
                <mat-progress-spinner [diameter]="20" mode="indeterminate" color="accent"></mat-progress-spinner> 
              } @else { 
                <span class="submit-text">Se connecter</span>
                <mat-icon class="submit-icon">arrow_forward</mat-icon>
              }
            </button>
          </form>

          <!-- Footer -->
          <p class="auth-footer">
            Espace réservé aux agents certifiés <span class="footer-brand">JIRAMA</span>
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Arrière-plan de la page entière */
    .auth-page { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh; 
      background-color: #2b3a37; /* Couleur de fond foncée autour de la carte */
      padding: 24px; 
    }

    /* Le conteneur principal divisé en deux */
    .auth-card-split { 
      display: flex; 
      width: 100%; 
      max-width: 900px; 
      min-height: 500px; 
      background: #ffffff; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 12px 40px rgba(0,0,0,0.25); 
    }

    /* === PARTIE GAUCHE (Image) === */
    .auth-brand-side { 
      flex: 1; 
      position: relative; 
      /* TODO: Remplacer par le chemin réel de ton image JIRAMA */
      background: url('/jirama.jpeg') center/cover no-repeat; 
      background-color: #00695c; /* Fallback couleur si l'image ne charge pas */
      display: flex; 
      align-items: flex-end; 
      padding: 40px; 
    }
    
    .auth-brand-side::before { 
      content: ''; 
      position: absolute; 
      inset: 0; 
      background: linear-gradient(to top, rgba(0, 77, 64, 0.9) 0%, rgba(0, 77, 64, 0.1) 60%); 
    }

    .brand-overlay { position: relative; z-index: 1; color: #ffffff; }
    
    .brand-badge { 
      display: inline-block; 
      background: #f57c00; /* Orange JIRAMA */
      color: #ffffff; 
      font-size: 11px; 
      font-weight: 700; 
      padding: 4px 10px; 
      border-radius: 16px; 
      margin-bottom: 12px; 
    }
    
    .brand-slogan { font-size: 22px; font-weight: 600; line-height: 1.3; margin: 0; }

    /* === PARTIE DROITE (Formulaire) === */
    .auth-form-side { 
      flex: 1; 
      padding: 48px; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      background: #ffffff; 
    }

    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 28px; width: 28px; height: 28px; color: #00796b; margin-bottom: 8px; }
    .auth-title { font-size: 20px; font-weight: 700; margin: 0; }
    .text-dark { color: #1a1a1a; }
    .text-green { color: #00796b; }
    .auth-subtitle { font-size: 12px; color: #78909c; margin-top: 4px; }

    /* Formulaire et Inputs */
    .auth-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .input-icon { color: #90a4ae; }
    
    ::ng-deep .custom-field .mat-mdc-text-field-wrapper {
      background-color: #ffffff;
    }

    /* Bouton Submit personnalisé */
    .auth-submit { 
      height: 44px; 
      background-color: #00796b !important; 
      color: #ffffff !important; 
      border-radius: 6px; 
      font-size: 14px; 
      font-weight: 500; 
      margin-top: 16px; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      width: 100%;
    }
    .submit-text { margin-right: 8px; }
    .submit-icon { font-size: 18px; width: 18px; height: 18px; }

    .auth-error { color: #f44336; font-size: 13px; text-align: center; padding: 8px; background: rgba(244,67,54,0.08); border-radius: 8px; }
    
    /* Footer */
    .auth-footer { text-align: center; font-size: 11px; color: #90a4ae; margin-top: 32px; }
    .footer-brand { color: #f57c00; font-weight: 700; }

    /* Responsive Design pour petits écrans */
    @media (max-width: 768px) {
      .auth-card-split { flex-direction: column; }
      .auth-brand-side { min-height: 250px; padding: 24px; }
      .auth-form-side { padding: 32px 24px; }
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
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue() as { email: string; password: string };
    
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.mustChangePassword) {
          this.router.navigateByUrl('/change-password');
          return;
        }
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        const user = this.auth.currentUser();
        this.router.navigateByUrl(redirect ?? (user ? getDefaultRouteForRole(user.role) : '/dashboard'));
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status ?? 0;
        let message = 'Une erreur est survenue.';

        if (status === 401) {
          message = 'Email ou mot de passe incorrect.';
        } else if (status === 403) {
          message = 'Votre compte est désactivé.';
        } else if (status === 0) {
          message = 'Serveur injoignable.';
        }

        this.errorMessage.set(message);
      },
    });
  }
}