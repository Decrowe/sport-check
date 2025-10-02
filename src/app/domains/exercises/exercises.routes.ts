import { Routes } from '@angular/router';

export const ExercisesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@domains/exercises/features').then((m) => m.ManageExercises),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
