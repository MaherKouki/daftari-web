import { Routes } from '@angular/router';
import { guestOnly, requireUnverifiedUser } from '../../core/auth/auth.guards';

/** Routes d'authentification, chargées à la demande (le SDK Firebase n'alourdit donc pas la landing page). */
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'تسجيل الدخول : دفتري',
    canActivate: [guestOnly],
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    title: 'إنشاء حساب : دفتري',
    canActivate: [guestOnly],
    loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'forgot-password',
    title: 'نسيت كلمة السر : دفتري',
    canActivate: [guestOnly],
    loadComponent: () => import('./forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'verify-email',
    title: 'تأكيد البريد : دفتري',
    canActivate: [requireUnverifiedUser],
    loadComponent: () => import('./verify-email/verify-email.page').then((m) => m.VerifyEmailPage),
  },
  {
    // Page ouverte depuis les e-mails Firebase (URL d'action personnalisée) : pas de garde, l'utilisateur peut être déconnecté.
    path: 'auth/action',
    title: 'تأكيد : دفتري',
    loadComponent: () => import('./action/action.page').then((m) => m.ActionPage),
  },
];
