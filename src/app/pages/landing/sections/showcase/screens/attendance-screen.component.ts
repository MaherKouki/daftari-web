import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Pupil {
  name: string;
  present: boolean;
}

@Component({
  selector: 'dft-attendance-screen',
  templateUrl: './attendance-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'screen', role: 'tabpanel' },
})
export class AttendanceScreenComponent {
  protected readonly pupils = signal<Pupil[]>([
    { name: 'مريم بن سالم', present: true },
    { name: 'أحمد الطرابلسي', present: true },
    { name: 'آية الجبالي', present: true },
    { name: 'يوسف الغزواني', present: false },
  ]);

  protected readonly presentCount = computed(() => this.pupils().filter((p) => p.present).length);

  protected toggle(index: number): void {
    this.pupils.update((list) => list.map((p, i) => (i === index ? { ...p, present: !p.present } : p)));
  }
}
