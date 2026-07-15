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
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'consultations',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'diagnostics',
        canActivate: [roleGuard(['ADMINISTRATEUR', 'MEDECIN'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'prescriptions',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'certificates',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'agents',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'doctors',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'directions',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'services',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'positions',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'symptoms',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '404' },
];
