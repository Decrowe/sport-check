import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@domains/daily').then((m) => m.Daily),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
