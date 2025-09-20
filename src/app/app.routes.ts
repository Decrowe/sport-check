import { Routes } from '@angular/router';
import { DailyChallange } from './domains/daily-challange/daily-challange';

export const routes: Routes = [
  {
    path: 'daily-challange',
    component: DailyChallange,
  },
  {
    path: '**',
    redirectTo: 'daily-challange',
  },
];
