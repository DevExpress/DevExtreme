import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

interface DxLetContext {
  $implicit: unknown;
  dxLet: unknown;
}

@Directive({
  selector: '[dxLet]'
})
export class DxLetDirective {
  @Input()
  set dxLet(value: any) {
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: value,
      dxLet: value
    });
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<DxLetContext>
  ) {}
}
