import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appFlexFill]',
  standalone: true,
})
export class FlexFillDirective {
  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex') flex = '1 1 auto';
  @Input() @HostBinding('style.align-items') alignItems = 'center';
  @Input() @HostBinding('style.justify-content') justifyContent = 'center';
}
