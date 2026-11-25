import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { COMPETENCIES, DemoStudent, buildTeacherNote, masteryOf } from '../../../../../core/mastery';
import { RichEditorComponent } from '../../../../../shared/rich-editor/rich-editor.component';

@Component({
  selector: 'dft-eval-file-screen',
  imports: [RichEditorComponent],
  templateUrl: './eval-file-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'screen', role: 'tabpanel' },
})
export class EvalFileScreenComponent {
  protected readonly students: DemoStudent[] = [
    { name: 'مريم بن سالم', gender: 'f', scores: [90, 82, 55, 78] },
    { name: 'أحمد الطرابلسي', gender: 'm', scores: [70, 48, 62, 85] },
    { name: 'آية الجبالي', gender: 'f', scores: [64, 72, 40, 58] },
    { name: 'يوسف الغزواني', gender: 'm', scores: [88, 90, 76, 52] },
  ];

  protected readonly selected = signal(0);
  protected readonly current = computed(() => this.students[this.selected()]);

  /** Une ligne par compétence : libellé, score et niveau de maîtrise. */
  protected readonly rows = computed(() =>
    this.current().scores.map((score, k) => ({ label: COMPETENCIES[k], score, mastery: masteryOf(score) })),
  );

  protected readonly note = computed(() => buildTeacherNote(this.current()));
}
