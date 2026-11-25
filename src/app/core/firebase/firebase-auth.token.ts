import { InjectionToken } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

/** Instance Firebase Auth, créée à la première injection (donc seulement dans les pages qui en ont besoin). */
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth(initializeApp(environment.firebase));
    // Les e-mails de vérification et de réinitialisation partent en arabe.
    auth.languageCode = 'ar';
    return auth;
  },
});
