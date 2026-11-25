import { HttpErrorResponse } from '@angular/common/http';

/** Extrait le code d'erreur renvoyé par l'API ({"error": "CLASS_LIMIT_REACHED"}), ou NETWORK / UNKNOWN. */
export function apiErrorCode(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) return 'NETWORK';
    const body: unknown = e.error;
    if (body && typeof body === 'object' && 'error' in body) return String((body as { error: unknown }).error);
  }
  return 'UNKNOWN';
}