import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AngularTemplate} from '../../types/index';
import {DxViewComponent} from './dx-view.component';

type Nullable<T> = T | null

interface AngularTemplateContext<TComponent> {
  $implicit: TComponent;
}

@Component({
  selector: 'dx-dynamic-template',
  template: '',
  styles: [':host {display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxDynamicTemplateComponent<TComponent extends DxViewComponent> {
  @Input() set template(template: Nullable<AngularTemplate<TComponent>>) {
    template && this.setTemplate(template);
  }

  @Input() set data(templateData: Nullable<unknown>) {
    const typedTemplateData = templateData as Nullable<TComponent>;
    this.templateData = typedTemplateData;
    typedTemplateData && this.setTemplateData();
  }

  private templateData: Nullable<TComponent> = null;
  private componentRef: Nullable<ComponentRef<TComponent>> = null;
  private templateRef: Nullable<EmbeddedViewRef<AngularTemplateContext<TComponent>>> = null;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  private setTemplate(template: AngularTemplate<TComponent>): void {
    if (template instanceof TemplateRef) {
      this.templateRef = this.viewContainerRef.createEmbeddedView(template);
    } else {
      this.componentRef = this.viewContainerRef.createComponent(template);
    }
  }

  private setTemplateData(): void {
    if (!this.templateData) {
      return;
    }

    if (this.componentRef) {
      const {instance} = this.componentRef;

      (Object.keys(this.templateData) as (keyof TComponent)[]).forEach((dataKey) => {
        instance[dataKey] = this.templateData![dataKey];
      });

      instance.markForCheck();
    }

    if (this.templateRef) {
      this.templateRef.context = {$implicit: this.templateData};
    }
  }
}
