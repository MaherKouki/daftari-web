import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'دفتري : ملف كل تلميذ، جذاذاتك، ووثائق المتفقد في مكان واحد',
    loadComponent: () => import('./pages/landing/landing.page').then((m) => m.LandingPage),
  },
  // /login, /signup, /forgot-password, /verify-email
  { path: '', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  // Espace connecté
  { path: 'app', loadChildren: () => import('./features/app/app.routes').then((m) => m.APP_ROUTES) },
  { path: '**', redirectTo: '' },
];