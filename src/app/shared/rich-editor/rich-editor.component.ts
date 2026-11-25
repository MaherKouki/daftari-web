import {
  ChangeDetectionStrategy, Component, ElementRef, SecurityContext, effect, inject, input, viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

type EditorCommand = 'bold' | 'italic' | 'insertUnorderedList';

/**
 * Mini éditeur de texte (gras, italique, liste) basé sur contenteditable.
 * `html` remplace le contenu à chaque changement de valeur ; la saisie de l'utilisateur n'est jamais écrasée sinon.
 */
@Component({
  selector: 'dft-rich-editor',
  templateUrl: './rich-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichEditorComponent {
  readonly html = input('');
  readonly minHeight = input(96);
  readonly label = input('محرّر النص');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly doc = inject(DOCUMENT);
  private readonly area = viewChild<ElementRef<HTMLDivElement>>('area');

  constructor() {
    effect(() => {
      const el = this.area()?.nativeElement;
      if (!el) return;
      el.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.html()) ?? '';
    });
  }

  protected exec(command: EditorCommand): void {
    // execCommand est déprécié mais reste la solution la plus simple pour une démo ; à remplacer par TipTap/Quill pour l'app réelle.
    this.doc.execCommand(command);
  }
}
