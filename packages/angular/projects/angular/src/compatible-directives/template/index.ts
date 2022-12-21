/* eslint-disable max-classes-per-file */
import {
  Directive, Input, NgModule, TemplateRef,
} from '@angular/core';

@Directive({
  selector: '[dxTemplateCompat]',
})
export class TemplateCompatibleDirective {
  @Input() set dxTemplateCompatOf(value: string) {
    this.name = value;
  }

  name!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@NgModule({
  declarations: [TemplateCompatibleDirective],
  exports: [TemplateCompatibleDirective],
})
export class TemplateCompatibleModule { }
