import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dft-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-footer.component.css',
  template: `
    <footer class="wrap">
      <div>دفتري : نموذج أولي لمنصة تنظيم الأقسام الابتدائية</div>
      <div>صُمّم للعرض على المعلّمين الشركاء في تونس</div>
    </footer>
  `,
})
export class SiteFooterComponent {}
