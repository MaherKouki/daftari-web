import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dft-cta',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cta.component.css',
  template: `
    <div class="wrap" id="try">
      <div class="cta">
        <h2>مستعدّ تجرّب دفتري في قسمك؟</h2>
        <p>هذا النموذج الأولي مبني ليُعرض على معلّم شريك قبل بداية تطوير المنصة الكاملة.</p>
        <p class="note">النسخة المجانية تتّسع لقسمين كحدّ أقصى، ويمكنك طلب تفعيل بقية الميزات في أي وقت.</p>
        <a routerLink="/signup" class="btn btn-primary">أنشئ حسابك المجاني</a>
      </div>
    </div>
  `,
})
export class CtaComponent {}
