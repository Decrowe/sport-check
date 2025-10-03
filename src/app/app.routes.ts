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
        path: 'states',
        loadComponent: () => import('@domains/daily/features').then((m) => m.MemberStates),
      },
      {
        path: '**',
        redirectTo: 'states',
      },
    ],
  },
  { path: 'members', loadComponent: () => import('@domains/members').then((m) => m.Members) },
  {
    path: '**',
    redirectTo: 'daily',
  },
];
