// import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
// import { AuthService } from '../../core/auth/auth.service';

// /** Tableau de bord provisoire : les prochaines étapes y seront branchées (classes, matières, registres). */
// @Component({
//   selector: 'dft-dashboard-page',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   styles: `
//     h1 { font-size: clamp(28px, 3.6vw, 38px); }
//     .lead { color: var(--ink-soft); margin: 10px 0 28px; font-size: 17px; }
//     .steps-card { background: var(--card); border: 2px solid var(--border); border-radius: 28px 28px 28px 8px; padding: 26px; box-shadow: 0 10px 0 var(--shadow); max-width: 640px; }
//     h2 { font-family: 'Tajawal', sans-serif; font-weight: 800; font-size: 19px; margin-bottom: 14px; }
//     .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 16px; border-radius: 16px; background: var(--paper-2); margin-bottom: 8px; font-size: 15px; }
//   `,
//   template: `
//     <h1>مرحبًا {{ user()?.displayName }}</h1>
//     <p class="lead">حسابك جاهز. هذه خطواتك الأولى لإعداد فضائك في دفتري.</p>

//     <section class="steps-card" aria-labelledby="first-steps">
//       <h2 id="first-steps">ابدأ بإعداد فضائك</h2>
//       <div class="row">أضف قسمك الأول (المستوى واسم المجموعة) <span class="badge badge-wait">قريبًا</span></div>
//       <div class="row">اختر المواد التي تدرّسها <span class="badge badge-wait">قريبًا</span></div>
//       <div class="row">أدخل تلاميذ كل قسم في سجل الحضور <span class="badge badge-wait">قريبًا</span></div>
//     </section>
//   `,
// })
// export class DashboardPage {
//   protected readonly user = inject(AuthService).user;
// }




import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { MeService } from '../../core/api/me.service';
import { AuthService } from '../../core/auth/auth.service';

function classesLabel(max: number): string {
  if (max === 1) return 'قسم واحد';
  if (max === 2) return 'قسمان';
  return `${max} أقسام`;
}

/** Tableau de bord provisoire : affiche le plan et sera complété avec les étapes d'installation de l'espace. */
@Component({
  selector: 'dft-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h1 { font-size: clamp(28px, 3.6vw, 38px); }
    .lead { color: var(--ink-soft); margin: 10px 0 20px; font-size: 17px; }
    .plan { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
    .plan .badge { font-size: 14px; padding: 5px 14px; }
    .plan small { color: var(--ink-soft); font-size: 14px; }
    .steps-card { background: var(--card); border: 2px solid var(--border); border-radius: 28px 28px 28px 8px; padding: 26px; box-shadow: 0 10px 0 var(--shadow); max-width: 640px; }
    h2 { font-family: 'Tajawal', sans-serif; font-weight: 800; font-size: 19px; margin-bottom: 14px; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 16px; border-radius: 16px; background: var(--paper-2); margin-bottom: 8px; font-size: 15px; }
    .small { padding: 8px 16px; font-size: 14px; }
  `,
  template: `
    <h1>مرحبًا {{ user()?.displayName }}</h1>
    <p class="lead">حسابك جاهز. هذه خطواتك الأولى لإعداد فضائك في دفتري.</p>

    @switch (meService.state()) {
      @case ('ready') {
        <div class="plan">
          <span class="badge" [class.badge-ok]="isPro()" [class.badge-wait]="!isPro()">{{ planLabel() }}</span>
          <small>{{ planDetail() }}</small>
        </div>
      }
      @case ('error') {
        <div class="alert alert-error" role="alert">
          {{ meService.error() }}
          <button type="button" class="btn btn-ghost small" (click)="reload()">إعادة المحاولة</button>
        </div>
      }
      @default {
        <p class="lead" role="status">جارٍ تحميل حسابك…</p>
      }
    }

    <section class="steps-card" aria-labelledby="first-steps">
      <h2 id="first-steps">ابدأ بإعداد فضائك</h2>
      <div class="row">أضف قسمك الأول (المستوى واسم المجموعة) <span class="badge badge-wait">قريبًا</span></div>
      <div class="row">اختر المواد التي تدرّسها <span class="badge badge-wait">قريبًا</span></div>
      <div class="row">أدخل تلاميذ كل قسم في سجل الحضور <span class="badge badge-wait">قريبًا</span></div>
    </section>
  `,
})
export class DashboardPage implements OnInit {
  protected readonly user = inject(AuthService).user;
  protected readonly meService = inject(MeService);

  protected readonly isPro = computed(() => this.meService.me()?.plan === 'PRO');
  protected readonly planLabel = computed(() => (this.isPro() ? 'النسخة المتقدمة' : 'النسخة المجانية'));
  protected readonly planDetail = computed(() => {
    const max = this.meService.me()?.limits.maxClasses;
    return max == null ? 'عدد غير محدود من الأقسام' : `${classesLabel(max)} كحدّ أقصى`;
  });

  ngOnInit(): void {
    void this.meService.load();
  }

  protected reload(): void {
    void this.meService.load();
  }
}