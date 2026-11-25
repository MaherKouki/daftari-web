import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** /app : il faut être connecté ET avoir vérifié son e-mail. */
export const requireVerifiedUser: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();

  const user = auth.user();
  if (!user) return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  if (!user.emailVerified) return router.createUrlTree(['/verify-email']);
  return true;
};

/** /verify-email : réservée aux utilisateurs connectés dont l'e-mail n'est pas encore vérifié. */
export const requireUnverifiedUser: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();

  const user = auth.user();
  if (!user) return router.createUrlTree(['/login']);
  if (user.emailVerified) return router.createUrlTree(['/app']);
  return true;
};

/** /login, /signup… : réservées aux visiteurs non connectés. */
export const guestOnly: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();

  const user = auth.user();
  if (!user) return true;
  return router.createUrlTree([user.emailVerified ? '/app' : '/verify-email']);
};
