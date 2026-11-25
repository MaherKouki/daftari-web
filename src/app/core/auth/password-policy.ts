import { ValidatorFn } from '@angular/forms';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export interface PasswordRule {
  key: 'length' | 'upper' | 'lower' | 'digit';
  label: string;
  ok: boolean;
}

/**
 * Règles de mot de passe vérifiées dans le navigateur pour guider l'utilisateur.
 * À garder identiques à la « Password policy » de la console Firebase (qui, elle, est appliquée côté serveur).
 */
export function checkPassword(password: string): PasswordRule[] {
  return [
    { key: 'length', label: `${PASSWORD_MIN_LENGTH} أحرف على الأقل`, ok: password.length >= PASSWORD_MIN_LENGTH },
    { key: 'upper', label: 'حرف كبير واحد على الأقل (A-Z)', ok: /[A-Z]/.test(password) },
    { key: 'lower', label: 'حرف صغير واحد على الأقل (a-z)', ok: /[a-z]/.test(password) },
    { key: 'digit', label: 'رقم واحد على الأقل (0-9)', ok: /[0-9]/.test(password) },
  ];
}

export function meetsPasswordPolicy(password: string): boolean {
  return checkPassword(password).every((rule) => rule.ok);
}

/** Validateur de champ Angular. */
export const passwordPolicy: ValidatorFn = (control) =>
  meetsPasswordPolicy(String(control.value ?? '')) ? null : { passwordPolicy: true };
