import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Me {
  id: number;
  email: string;
  displayName: string | null;
  schoolName: string | null;
  profileComplete: boolean;
  role: 'TEACHER' | 'ADMIN';
  plan: 'FREE' | 'PRO';
  paidUntil: string | null;
  /** maxClasses vide (null) = pas de limite (compte PRO actif). */
  limits: { maxClasses: number | null };
}

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Profil du compte connecté, lu depuis l'API (/api/v1/me).
 * Fourni au niveau de la route /app (pas en « root ») : il utilise le HttpClient qui porte l'intercepteur d'authentification.
 */
@Injectable()
export class MeService {
  private readonly http = inject(HttpClient);

  readonly me = signal<Me | null>(null);
  readonly state = signal<LoadState>('idle');
  readonly error = signal('');

  async load(): Promise<void> {
    this.state.set('loading');
    this.error.set('');
    try {
      this.me.set(await firstValueFrom(this.http.get<Me>(`${environment.apiUrl}/api/v1/me`)));
      this.state.set('ready');
    } catch (e) {
      this.error.set(describeError(e));
      this.state.set('error');
    }
  }

  /** Charge le profil seulement s'il ne l'est pas encore (utile quand on arrive directement sur une sous-page). */
  async ensureLoaded(): Promise<void> {
    if (this.state() === 'idle') await this.load();
  }

  async saveSchoolName(schoolName: string): Promise<void> {
    this.me.set(await firstValueFrom(this.http.put<Me>(`${environment.apiUrl}/api/v1/me/profile`, { schoolName })));
  }
}

function describeError(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) return 'تعذّر الاتصال بالخادم. تحقّق من اتصالك أو أعد المحاولة بعد قليل.';
    if (e.status === 401) return 'انتهت جلستك. سجّل الدخول من جديد.';
    if (e.status === 403) return 'هذا الحساب غير مسموح له بالدخول (البريد غير مؤكَّد أو الحساب موقوف).';
  }
  return 'حدث خطأ غير متوقّع. أعد المحاولة بعد قليل.';
}