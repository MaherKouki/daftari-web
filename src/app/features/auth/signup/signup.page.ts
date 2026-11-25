import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { authErrorMessage } from '../../../core/auth/auth-errors';
import { AuthService } from '../../../core/auth/auth.service';
import { passwordPolicy } from '../../../core/auth/password-policy';
import { PasswordChecklistComponent } from '../../../shared/password-checklist/password-checklist.component';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { passwordsMatch } from '../passwords-match';

@Component({
  selector: 'dft-signup-page',
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, PasswordChecklistComponent],
  templateUrl: './signup.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordPolicy]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly showPassword = signal(false);

  protected submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return Promise.resolve();
    }
    const { name, email, password } = this.form.getRawValue();
    return this.run(async () => {
      await this.auth.register(name, email.trim(), password);
      await this.router.navigateByUrl('/verify-email');
    });
  }

  protected google(): Promise<void> {
    return this.run(async () => {
      await this.auth.loginWithGoogle();
      await this.router.navigateByUrl('/app');
    });
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      await action();
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
