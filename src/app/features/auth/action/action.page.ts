import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { authErrorMessage } from '../../../core/auth/auth-errors';
import { AuthService } from '../../../core/auth/auth.service';
import { passwordPolicy } from '../../../core/auth/password-policy';
import { PasswordChecklistComponent } from '../../../shared/password-checklist/password-checklist.component';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { passwordsMatch } from '../passwords-match';

type Status = 'loading' | 'email-verified' | 'reset-form' | 'reset-done' | 'invalid';

const TITLES: Record<Status, { heading: string; subtitle: string }> = {
  loading: { heading: 'جارٍ التحقّق من الرابط…', subtitle: '' },
  'email-verified': { heading: 'تم تأكيد بريدك الإلكتروني', subtitle: 'يمكنك الآن الدخول إلى فضائك في دفتري.' },
  'reset-form': { heading: 'كلمة سر جديدة', subtitle: 'اختر كلمة سر جديدة لحسابك.' },
  'reset-done': { heading: 'تم تغيير كلمة السر', subtitle: 'يمكنك الآن تسجيل الدخول بكلمة السر الجديدة.' },
  invalid: { heading: 'الرابط غير صالح', subtitle: '' },
};

/** Page ouverte depuis les e-mails Firebase : /auth/action?mode=verifyEmail|resetPassword&oobCode=… */
@Component({
  selector: 'dft-action-page',
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, PasswordChecklistComponent],
  templateUrl: './action.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly status = signal<Status>('loading');
  protected readonly error = signal('');
  protected readonly busy = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly resetEmail = signal('');
  protected readonly isLoggedIn = computed(() => this.auth.user() !== null);

  protected readonly heading = computed(() => TITLES[this.status()].heading);
  protected readonly subtitle = computed(() => TITLES[this.status()].subtitle);

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      password: ['', [Validators.required, passwordPolicy]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  private code = '';

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.queryParamMap;
    const mode = params.get('mode');
    this.code = params.get('oobCode') ?? '';

    if (!this.code) {
      this.status.set('invalid');
      return;
    }
    try {
      if (mode === 'verifyEmail') {
        await this.auth.applyVerificationCode(this.code);
        this.status.set('email-verified');
      } else if (mode === 'resetPassword') {
        this.resetEmail.set(await this.auth.checkPasswordResetCode(this.code));
        this.status.set('reset-form');
      } else {
        this.status.set('invalid');
      }
    } catch (e) {
      this.error.set(authErrorMessage(e));
      this.status.set('invalid');
    }
  }

  protected async submitReset(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.resetPasswordWithCode(this.code, this.form.getRawValue().password);
      this.status.set('reset-done');
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
