import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[dx-service-popup-insertion]',
})
export class DxServicePopupInsertionDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
