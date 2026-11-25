import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dft-pitch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pitch.component.css',
  template: `
    <section class="section pitch" id="why">
      <div class="wrap">
        <!-- TODO avant toute diffusion publique : remplacer ce témoignage fictif par un vrai avis d'enseignant. -->
        <figure class="pitch-card">
          <blockquote>
            لو كان عندي دفتري السنة الفارطة، كنت نربح وقت كبير في كل بداية ثلاثي، خاصة في ملفات التلاميذ ومحاضر اجتماعات الأولياء.
          </blockquote>
          <figcaption class="pitch-sign">
            <span class="avatar" aria-hidden="true">م</span>
            <span>
              <strong>أستاذة تعليم ابتدائي</strong>
              <small>مدرسة ابتدائية، تونس</small>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  `,
})
export class PitchComponent {}
