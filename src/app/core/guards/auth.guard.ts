import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function authGuard(allowedRoles?: ('arrendatario' | 'arrendador')[]): CanActivateFn {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();

    if (!user) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      return router.createUrlTree(['/']);
    }

    return true;
  };
}
