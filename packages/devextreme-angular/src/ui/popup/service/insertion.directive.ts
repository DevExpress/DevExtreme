import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[popup-content-insertion]',
})
export class DxServicePopupInsertionDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
