import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/layouts';
import { authGuard, guestGuard, roleGuard } from '@core/guards';
import { ForbiddenComponent, NotFoundComponent } from '@pages';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('@features/auth/auth.component').then((m) => m.AuthComponent),
  },
  { path: '403', component: ForbiddenComponent, title: 'Accès interdit' },
  { path: '404', component: NotFoundComponent, title: 'Page introuvable' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'declarations',
        loadComponent: () => import('@features/declarations/declarations.component').then((m) => m.DeclarationsComponent),
      },
      {
        path: 'consultations',
        canActivate: [roleGuard(['ADMINISTRATEUR', 'MEDECIN'])],
        loadComponent: () => import('@features/consultations/consultations.component').then((m) => m.ConsultationsComponent),
      },
      {
        path: 'diagnostics',
        canActivate: [roleGuard(['ADMINISTRATEUR', 'MEDECIN'])],
        loadComponent: () => import('@features/diagnostics/diagnostics.component').then((m) => m.DiagnosticsComponent),
      },
      {
        path: 'prescriptions',
        canActivate: [roleGuard(['ADMINISTRATEUR', 'MEDECIN'])],
        loadComponent: () => import('@features/prescriptions/prescriptions.component').then((m) => m.PrescriptionsComponent),
      },
      {
        path: 'certificates',
        canActivate: [roleGuard(['ADMINISTRATEUR', 'MEDECIN'])],
        loadComponent: () => import('@features/certificates/certificates.component').then((m) => m.CertificatesComponent),
      },
      {
        path: 'agents',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/agents/agents.component').then((m) => m.AgentsComponent),
      },
      {
        path: 'doctors',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/doctors/doctors.component').then((m) => m.DoctorsComponent),
      },
      {
        path: 'directions',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/directions/directions.component').then((m) => m.DirectionsComponent),
      },
      {
        path: 'services',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'positions',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/positions/positions.component').then((m) => m.PositionsComponent),
      },
      {
        path: 'symptoms',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/symptoms/symptoms.component').then((m) => m.SymptomsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('@features/notifications/notifications.component').then((m) => m.NotificationsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'change-password',
        loadComponent: () => import('@features/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('@features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '404' },
];
