import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header class="login-header">
          <mat-card-title>Bienvenue</mat-card-title>
          <mat-card-subtitle>Connectez-vous à votre compte</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <!-- Champ Email -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Adresse Email</mat-label>
              <input 
                matInput 
                type="email" 
                formControlName="email" 
                placeholder="exemple@domaine.com"
                required>
              <mat-icon matPrefix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>L'email est requis</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Format d'email invalide</mat-error>
              }
            </mat-form-field>

            <!-- Champ Mot de passe -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'" 
                formControlName="password" 
                required>
              <mat-icon matPrefix>lock</mat-icon>
              <button 
                type="button" 
                mat-icon-button 
                matSuffix 
                (click)="hidePassword = !hidePassword" 
                [attr.aria-label]="'Masquer le mot de passe'" 
                [attr.aria-pressed]="hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>Le mot de passe est requis</mat-error>
              }
            </mat-form-field>

            <!-- Bouton de connexion -->
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="full-width submit-btn" 
              [disabled]="loginForm.invalid || isLoading">
              @if (isLoading) {
                <mat-progress-spinner mode="indeterminate" [diameter]="24" class="btn-spinner"></mat-progress-spinner>
              } @else {
                <span>Se connecter</span>
              }
            </button>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 24px 16px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      background: #ffffff;
    }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;

      mat-card-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 6px;
      }

      mat-card-subtitle {
        font-size: 0.95rem;
        color: #64748b;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .submit-btn {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-spinner {
      margin: 0 auto;
    }

    /* Ajustement des icônes Angular Material */
    mat-icon[matPrefix] {
      margin-right: 8px;
      color: #64748b;
    }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  hidePassword = true;
  isLoading = false;

  onSubmit(): void {
    if (loginFormValid(this.loginForm)) {
      this.isLoading = true;
      
      // Simulation de la requête d'authentification
      setTimeout(() => {
        console.log('Données de connexion :', this.loginForm.value);
        this.isLoading = false;
      }, 2000);
    }
  }
}

function loginFormValid(form: FormGroup): boolean {
  return form.valid;
}