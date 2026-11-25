import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AttendanceScreenComponent } from './screens/attendance-screen.component';
import { EvalFileScreenComponent } from './screens/eval-file-screen.component';
import { LessonPlanScreenComponent } from './screens/lesson-plan-screen.component';

type TabId = 'eval' | 'attendance' | 'plans' | 'student' | 'analysis' | 'inspector' | 'planning' | 'library';

interface Tab {
  id: TabId;
  label: string;
}

type Tone = 'sky' | 'sun' | 'coral' | 'mint' | 'off';

@Component({
  selector: 'dft-showcase',
  imports: [EvalFileScreenComponent, AttendanceScreenComponent, LessonPlanScreenComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  protected readonly tabs: Tab[] = [
    { id: 'eval', label: 'ملف تقييمي' },
    { id: 'attendance', label: 'الحضور والفروض' },
    { id: 'plans', label: 'الجذاذات' },
    { id: 'student', label: 'ملف التلميذ' },
    { id: 'analysis', label: 'تحليل النتائج' },
    { id: 'inspector', label: 'ملف المتفقد' },
    { id: 'planning', label: 'التخطيط' },
    { id: 'library', label: 'مكتبة الوثائق' },
  ];

  protected readonly active = signal<TabId>('eval');

  protected readonly students = ['مريم بن سالم', 'أحمد الطرابلسي', 'آية الجبالي', 'يوسف الغزواني'];

  protected readonly analysis = [
    { label: 'فهم المنطوق', value: 82, level: 'ok', text: 'txt-ok' },
    { label: 'القراءة', value: 76, level: 'ok', text: 'txt-ok' },
    { label: 'الإنتاج الكتابي', value: 44, level: 'low', text: 'txt-low' },
    { label: 'حلّ المسائل', value: 58, level: 'mid', text: 'txt-mid' },
  ];

  protected readonly inspectorItems = [
    'سجل الحضور', 'الجذاذات', 'الملفات التقييمية للتلاميذ', 'التوزيع السنوي', 'الفروض والتصحيحات', 'جدول الحصص',
  ];

  protected readonly timetable: { time: string; cells: { subject: string; tone: Tone }[] }[] = [
    { time: '8:00', cells: [
      { subject: 'رياضيات', tone: 'sky' }, { subject: 'عربية', tone: 'sun' }, { subject: 'رياضيات', tone: 'sky' },
      { subject: 'فرنسية', tone: 'coral' }, { subject: 'عربية', tone: 'sun' },
    ] },
    { time: '9:30', cells: [
      { subject: 'عربية', tone: 'sun' }, { subject: 'إيقاظ علمي', tone: 'mint' }, { subject: 'فرنسية', tone: 'coral' },
      { subject: 'عربية', tone: 'sun' }, { subject: 'رياضيات', tone: 'sky' },
    ] },
    { time: '11:00', cells: [
      { subject: 'فرنسية', tone: 'coral' }, { subject: 'رياضيات', tone: 'sky' }, { subject: 'تربية فنية', tone: 'off' },
      { subject: 'إيقاظ علمي', tone: 'mint' }, { subject: 'تربية بدنية', tone: 'off' },
    ] },
  ];

  protected readonly weekdays = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  protected readonly terms = ['الثلاثي الأول', 'عطلة', 'الثلاثي الثاني', 'عطلة', 'الثلاثي الثالث'];

  protected readonly folders = [
    { label: 'تحضيرات الدروس', color: 'var(--sky)' },
    { label: 'أوراق العمل', color: 'var(--sun)' },
    { label: 'الفروض', color: 'var(--coral)' },
    { label: 'الجذاذات', color: 'var(--mint)' },
    { label: 'ملفات المتفقد', color: 'var(--grape)' },
    { label: 'شهادات وملفات إدارية', color: 'var(--sun)' },
  ];

  protected select(id: TabId): void {
    this.active.set(id);
  }

  /** Navigation au clavier (flèches) dans la liste d'onglets ; en RTL la flèche gauche va à l'onglet suivant. */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    let next = index;
    if (event.key === 'ArrowLeft') next = (index + 1) % this.tabs.length;
    else if (event.key === 'ArrowRight') next = (index - 1 + this.tabs.length) % this.tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = this.tabs.length - 1;
    else return;

    event.preventDefault();
    this.select(this.tabs[next].id);
    queueMicrotask(() => document.getElementById('tab-' + this.tabs[next].id)?.focus());
  }
}
