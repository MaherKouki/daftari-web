import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { apiErrorCode } from '../../../core/api/api-error';
import { ClassesService } from '../../../core/api/classes.service';
import { LEVELS } from '../../../core/levels';

const ERROR_MESSAGES: Record<string, string> = {
  CLASS_LIMIT_REACHED: 'وصلت إلى حدّ النسخة المجانية. لا يمكنك إضافة قسم آخر الآن.',
  CLASS_ALREADY_EXISTS: 'يوجد قسم بنفس المستوى والاسم في هذه السنة الدراسية.',
  VALIDATION_ERROR: 'تحقّق من المعطيات المُدخلة ثم أعد المحاولة.',
  NETWORK: 'تعذّر الاتصال بالخادم. أعد المحاولة بعد قليل.',
};

@Component({
  selector: 'dft-class-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './class-form.page.html',
  styleUrl: './class-form.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassFormPage implements OnInit {
  private readonly classesService = inject(ClassesService);
  private readonly router = inject(Router);

  protected readonly levels = LEVELS;
  protected readonly form = inject(NonNullableFormBuilder).group({
    level: [0, [Validators.min(1), Validators.max(6)]],
    name: ['', [Validators.required, Validators.maxLength(20)]],
  });
  protected readonly custom = new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] });

  protected readonly defaults = signal<string[]>([]);
  protected readonly selected = signal<string[]>([]);
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  /** Matières proposées + celles ajoutées à la main. */
  protected readonly choices = computed(() => {
    const base = this.defaults();
    return [...base, ...this.selected().filter((s) => !base.includes(s))];
  });

  async ngOnInit(): Promise<void> {
    try {
      this.defaults.set(await this.classesService.defaultSubjects());
    } catch {
      this.error.set('تعذّر تحميل قائمة المواد. يمكنك مع ذلك إضافة موادّك يدويًا.');
    }
  }

  protected isSelected(subject: string): boolean {
    return this.selected().includes(subject);
  }

  protected toggle(subject: string): void {
    this.selected.update((list) => (list.includes(subject) ? list.filter((s) => s !== subject) : [...list, subject]));
  }

  protected addCustom(): void {
    const value = this.custom.value.trim().replace(/\s+/g, ' ');
    if (!value || this.custom.invalid) return;
    if (!this.selected().includes(value)) this.selected.update((list) => [...list, value]);
    this.custom.reset('');
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.selected().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const { level, name } = this.form.getRawValue();
      await this.classesService.create({ level, name: name.trim(), subjects: this.selected() });
      await this.router.navigateByUrl('/app/classes');
    } catch (e) {
      this.error.set(ERROR_MESSAGES[apiErrorCode(e)] ?? 'حدث خطأ غير متوقّع. أعد المحاولة بعد قليل.');
    } finally {
      this.busy.set(false);
    }
  }
}
