import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = true;
  if (isAdmin) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
