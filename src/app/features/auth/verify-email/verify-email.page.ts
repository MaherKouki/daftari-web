import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { authErrorMessage } from '../../../core/auth/auth-errors';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

type MessageKind = 'ok' | 'error' | 'info';

const RESEND_COOLDOWN_SECONDS = 60;

@Component({
  selector: 'dft-verify-email-page',
  imports: [AuthLayoutComponent],
  templateUrl: './verify-email.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Quand l'utilisateur revient de sa boîte mail, on revérifie automatiquement.
  host: { '(document:visibilitychange)': 'onVisibilityChange()' },
})
export class VerifyEmailPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly email = computed(() => this.auth.user()?.email ?? '');
  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly kind = signal<MessageKind>('info');
  protected readonly cooldown = signal(0);

  protected async check(): Promise<void> {
    this.busy.set(true);
    try {
      if (await this.refreshAndMaybeLeave()) return;
      this.show('info', 'لم يتم تأكيد البريد بعد. افتح الرابط الذي أرسلناه إليك ثم اضغط من جديد.');
    } catch (e) {
      this.show('error', authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }

  protected async resend(): Promise<void> {
    if (this.cooldown() > 0) return;
    this.busy.set(true);
    try {
      await this.auth.resendVerification();
      this.show('ok', 'أرسلنا رابطًا جديدًا. تحقّق من صندوق الوارد والرسائل غير المرغوبة.');
      this.startCooldown();
    } catch (e) {
      this.show('error', authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }

  protected onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.refreshAndMaybeLeave().catch(() => undefined);
    }
  }

  /** Recharge l'utilisateur ; s'il est vérifié, on entre dans l'application. */
  private async refreshAndMaybeLeave(): Promise<boolean> {
    const verified = await this.auth.refreshUser();
    if (verified) await this.router.navigateByUrl('/app');
    return verified;
  }

  private show(kind: MessageKind, text: string): void {
    this.kind.set(kind);
    this.message.set(text);
  }

  private startCooldown(): void {
    this.cooldown.set(RESEND_COOLDOWN_SECONDS);
    const timer = setInterval(() => {
      this.cooldown.update((v) => v - 1);
      if (this.cooldown() <= 0) clearInterval(timer);
    }, 1000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}
