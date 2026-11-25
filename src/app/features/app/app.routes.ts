import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { ClassesService } from '../../core/api/classes.service';
import { MeService } from '../../core/api/me.service';
import { requireVerifiedUser } from '../../core/auth/auth.guards';
import { authInterceptor } from '../../core/auth/auth.interceptor';
import { AppShellComponent } from './app-shell.component';

/** Espace connecté (/app) : réservé aux utilisateurs connectés dont l'e-mail est vérifié. */
export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [requireVerifiedUser],
    providers: [provideHttpClient(withInterceptors([authInterceptor])), MeService, ClassesService],
    children: [
      {
        path: '',
        title: 'فضائي : دفتري',
        loadComponent: () => import('./dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'classes',
        title: 'أقسامي : دفتري',
        loadComponent: () => import('./classes/classes.page').then((m) => m.ClassesPage),
      },
      {
        path: 'classes/new',
        title: 'قسم جديد : دفتري',
        loadComponent: () => import('./classes/class-form.page').then((m) => m.ClassFormPage),
      },
    ],
  },
];