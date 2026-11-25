import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeService } from '../../core/api/me.service';

/** Demande le nom de l'école à la première visite ; il accompagnera ensuite l'enseignante (en-têtes des documents). */
@Component({
  selector: 'dft-school-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .panel { background: var(--card); border: 2px solid var(--border); border-radius: 28px 28px 28px 8px; padding: 22px 26px; box-shadow: 0 10px 0 var(--shadow); max-width: 640px; margin-bottom: 24px; }
    h2 { font-family: 'Tajawal', sans-serif; font-weight: 800; font-size: 19px; margin-bottom: 6px; }
    p { color: var(--ink-soft); margin: 0 0 14px; font-size: 14.5px; }
    form { display: flex; gap: 10px; align-items: flex-start; flex-wrap: wrap; }
    .grow { flex: 1; min-width: 220px; }
  `,
  template: `
    <section class="panel" aria-labelledby="school-title">
      <h2 id="school-title">ما اسم مدرستك؟</h2>
      <p>سيرافق اسم المدرسة وثائقك لاحقًا (ملف المتفقد، الملفات التقييمية…). يمكنك تعديله في أي وقت.</p>
      @if (error()) {
        <div class="alert alert-error" role="alert">{{ error() }}</div>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="grow">
          <label class="label" for="school">اسم المدرسة</label>
          <input id="school" class="input" type="text" maxlength="200" formControlName="schoolName"
                 [class.invalid]="form.controls.schoolName.touched && form.controls.schoolName.invalid" />
          @if (form.controls.schoolName.touched && form.controls.schoolName.invalid) {
            <div class="field-error">أدخل اسم مدرستك.</div>
          }
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top: 28px" [disabled]="busy()">{{ busy() ? 'جارٍ الحفظ…' : 'حفظ' }}</button>
      </form>
    </section>
  `,
})
export class SchoolFormComponent {
  private readonly meService = inject(MeService);

  protected readonly form = inject(NonNullableFormBuilder).group({
    schoolName: ['', [Validators.required, Validators.maxLength(200), Validators.pattern(/\S/)]],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.meService.saveSchoolName(this.form.getRawValue().schoolName.trim());
    } catch {
      this.error.set('تعذّر حفظ اسم المدرسة. أعد المحاولة بعد قليل.');
    } finally {
      this.busy.set(false);
    }
  }
}