import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { provideNativeDateAdapter } from '@angular/material/core';
import { isLoggedIn } from '@shared/authentication';
import { routes } from './app.routes';

const guardedRoutes: Routes = [
  {
    path: '',
    children: routes,
    canActivateChild: [isLoggedIn],
  },
  {
    path: 'login',
    loadComponent: () => import('@shared/authentication').then((m) => m.Login),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(guardedRoutes),
    provideNativeDateAdapter(),
  ],
};
