import { Routes } from '@angular/router';
import { DailyChallange } from './domains/daily-challange/daily-challange';

export const routes: Routes = [
  {
    path: '',
    component: DailyChallange,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
