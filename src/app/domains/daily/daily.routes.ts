import { Routes } from '@angular/router';

export const dailyRoutes: Routes = [
  {
    path: 'progress',
    loadComponent: () => import('@domains/daily/features').then((m) => m.Progress),
  },
  {
    path: 'groups',
    loadComponent: () => import('@domains/daily/features').then((m) => m.ManageGroups),
  },
  {
    path: '',
    redirectTo: 'progress',
    pathMatch: 'full',
  },
];
