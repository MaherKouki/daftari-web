import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dft-site-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-header.component.css',
  template: `
    <header>
      <div class="nav wrap">
        <a class="brand" routerLink="/" aria-label="دفتري : الصفحة الرئيسية">
          <span class="brand-mark" aria-hidden="true">د</span>
          <span class="brand-name">دفتري</span>
        </a>
        <nav class="nav-links" aria-label="التنقّل الرئيسي">
          <a routerLink="/" fragment="problem">التحدي</a>
          <a routerLink="/" fragment="features">المميزات</a>
          <a routerLink="/" fragment="why">لماذا دفتري</a>
        </nav>
        <div class="nav-actions">
          <a routerLink="/login" class="login-link">دخول</a>
          <a routerLink="/signup" class="btn btn-primary">ابدأ مجانًا</a>
        </div>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {}
