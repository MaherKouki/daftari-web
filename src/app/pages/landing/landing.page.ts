import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaComponent } from './sections/cta.component';
import { HeroComponent } from './sections/hero.component';
import { PitchComponent } from './sections/pitch.component';
import { ProblemComponent } from './sections/problem.component';
import { ShowcaseComponent } from './sections/showcase/showcase.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { SiteHeaderComponent } from './sections/site-header.component';

/** Page d'accueil publique : assemble les sections de la landing page. */
@Component({
  selector: 'dft-landing-page',
  imports: [SiteHeaderComponent, HeroComponent, ProblemComponent, ShowcaseComponent, PitchComponent, CtaComponent, SiteFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dft-site-header />
    <main>
      <dft-hero />
      <dft-problem />
      <dft-showcase />
      <dft-pitch />
      <dft-cta />
    </main>
    <dft-site-footer />
  `,
})
export class LandingPage {}
