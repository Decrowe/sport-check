import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

export const isLoggedIn: CanActivateFn = () => {
  const login = inject(LoginService);
  const router = inject(Router);
  if (login.member()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
