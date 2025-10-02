import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'daily',
    loadChildren: () => import('@domains/daily').then((m) => m.dailyRoutes),
  },
  { path: 'members', loadChildren: () => import('@domains/members').then((m) => m.MemberRoutes) },
  {
    path: 'exercises',
    loadChildren: () => import('@domains/exercises').then((m) => m.ExercisesRoutes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'daily',
  },
];
