import { Routes } from '@angular/router';
import { DoctorsComponent } from './doctors.component';

export const DOCTORS_ROUTES: Routes = [
  { path: '', component: DoctorsComponent, title: 'Médecins' },
];
