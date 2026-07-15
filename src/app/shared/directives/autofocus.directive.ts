import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements OnInit {
  @Input('appAutofocus') enabled: string | boolean = true;

  private readonly el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const shouldFocus = this.enabled === true || this.enabled === 'true';
    if (shouldFocus) {
      setTimeout(() => this.el.nativeElement.focus());
    }
  }
}
