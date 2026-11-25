import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { checkPassword } from '../../core/auth/password-policy';

/** Liste des conditions du mot de passe, cochées en direct pendant la saisie. */
@Component({
  selector: 'dft-password-checklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 4px; font-size: 13.5px; }
    li { color: var(--ink-soft); display: flex; gap: 8px; align-items: baseline; }
    li.ok { color: var(--mint-text); font-weight: 700; }
    .note { margin: 8px 0 0; font-size: 12.5px; color: var(--ink-soft); }
  `,
  template: `
    <ul aria-label="شروط كلمة السر">
      @for (rule of rules(); track rule.key) {
        <li [class.ok]="rule.ok"><span aria-hidden="true">{{ rule.ok ? '✓' : '○' }}</span> {{ rule.label }}</li>
      }
    </ul>
    <p class="note">الحروف الكبيرة والصغيرة تكون لاتينية (A-Z وa-z)، ويمكنك إضافة أحرف عربية أيضًا.</p>
  `,
})
export class PasswordChecklistComponent {
  readonly password = input('');
  protected readonly rules = computed(() => checkPassword(this.password()));
}
