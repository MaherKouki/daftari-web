import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassesService, SchoolClassDto } from '../../../core/api/classes.service';
import { MeService } from '../../../core/api/me.service';
import { levelLabel } from '../../../core/levels';

@Component({
  selector: 'dft-classes-page',
  imports: [RouterLink],
  templateUrl: './classes.page.html',
  styleUrl: './classes.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPage implements OnInit {
  protected readonly meService = inject(MeService);
  protected readonly classesService = inject(ClassesService);

  protected readonly count = computed(() => this.classesService.classes().length);
  protected readonly max = computed(() => this.meService.me()?.limits.maxClasses ?? null);
  protected readonly atLimit = computed(() => this.max() !== null && this.count() >= (this.max() ?? 0));

  async ngOnInit(): Promise<void> {
    await Promise.all([this.meService.ensureLoaded(), this.classesService.load()]);
  }

  protected label(level: number): string {
    return levelLabel(level);
  }

  protected async archive(c: SchoolClassDto): Promise<void> {
    if (!confirm(`أرشفة القسم « ${c.name} » (${levelLabel(c.level)})؟ يمكن أن يظلّ محفوظًا لكنه لن يظهر في قائمتك.`)) return;
    await this.classesService.archive(c.id);
  }

  protected reload(): void {
    void this.classesService.load();
  }
}
