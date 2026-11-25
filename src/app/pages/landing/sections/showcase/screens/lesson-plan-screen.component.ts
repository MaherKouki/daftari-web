import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RichEditorComponent } from '../../../../../shared/rich-editor/rich-editor.component';

@Component({
  selector: 'dft-lesson-plan-screen',
  imports: [RichEditorComponent],
  templateUrl: './lesson-plan-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'screen', role: 'tabpanel' },
})
export class LessonPlanScreenComponent {
  protected readonly subjects = ['الرياضيات : الكسور', 'العربية : القراءة', 'الإيقاظ العلمي', 'الفرنسية'];

  protected readonly samplePlan = `
    <h5>جذاذة رياضيات : الكسور البسيطة</h5>
    <div><b>الهدف :</b> أن يتعرّف التلميذ على الكسر ويمثّله على شكل مقسّم.</div>
    <div><b>مراحل الدرس :</b></div>
    <ul>
      <li>وضعية انطلاق : تقسيم قطعة حلوى بين أربعة أطفال.</li>
      <li>بناء التعلّمات : قراءة الكسر وكتابته.</li>
      <li>تمارين تطبيقية وتقييم قصير.</li>
    </ul>`;
}
