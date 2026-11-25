import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dft-problem',
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemComponent {
  protected readonly after = [
    { color: 'var(--sky)', text: 'ملف تقييمي لكل تلميذ' },
    { color: 'var(--sun)', text: 'جذاذات ووثائق في محرّر نصوص واحد' },
    { color: 'var(--coral)', text: 'تحليل النتائج وتمارين علاجية' },
    { color: 'var(--mint)', text: 'ملف المتفقد جاهز للتصدير' },
  ];
}
