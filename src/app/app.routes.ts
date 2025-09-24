import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'daily',
    loadComponent: () => import('@domains/daily').then((m) => m.Daily),
    children: [
      {
        path: 'exercises',
        loadComponent: () => import('@domains/daily/features').then((m) => m.Exercises),
      },
      {
        path: 'progress',
        loadComponent: () => import('@domains/daily/features').then((m) => m.Progresses),
      },
      {
        path: '**',
        redirectTo: 'progress',
      },
    ],
  },
  { path: 'members', loadComponent: () => import('@domains/members').then((m) => m.Members) },
  {
    path: '**',
    redirectTo: 'daily',
  },
];
