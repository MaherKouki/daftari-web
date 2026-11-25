import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Validateur de groupe : les champs `password` et `confirm` doivent être identiques. */
export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}
