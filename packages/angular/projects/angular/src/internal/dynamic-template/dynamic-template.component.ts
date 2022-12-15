import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UnknownRecord } from '@devextreme/core';
import { AngularTemplate } from '../types';
import { ViewComponent } from './view.component';

interface AngularTemplateContext<T> {
  $implicit: T;
}

@Component({
  selector: 'dx-dynamic-template',
  template: '',
  styles: [':host {display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTemplateComponent<
  TComponent extends ViewComponent,
  TData extends UnknownRecord,
  > {
  @Input() set template(template: AngularTemplate<TComponent>) {
    if (template === this.templateValue) {
      return;
    }

    this.setTemplate(template);
  }

  @Input() set data(data: TData) {
    if (data === this.dataValue) {
      return;
    }

    this.setTemplateData(data);
  }

  private templateValue?: AngularTemplate<TComponent>;

  private dataValue?: TData;

  private componentRef?: ComponentRef<TComponent>;

  private templateRef?: EmbeddedViewRef<AngularTemplateContext<TData>>;

  constructor(
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  private setTemplate(template: AngularTemplate<TComponent>): void {
    if (!template) {
      return;
    }

    this.templateValue = template;

    if (template instanceof TemplateRef) {
      this.templateRef = this.viewContainerRef.createEmbeddedView(template);
    } else {
      this.componentRef = this.viewContainerRef.createComponent(template);
    }

    this.setTemplateData(this.dataValue);
  }

  private setTemplateData(data?: TData): void {
    if (!data) {
      return;
    }

    this.dataValue = data;

    if (this.componentRef) {
      this.setDataToComponent();
    } else if (this.templateRef) {
      this.templateRef.context = { $implicit: this.dataValue! };
    }
  }

  private setDataToComponent(): void {
    const { instance } = this.componentRef!;

    (Object.keys(this.dataValue!) as (keyof TData)[])
      // TODO: Think about optimization here.
      // .filter((key) => Object.prototype.hasOwnProperty.call(instance, key))
      .forEach((key) => {
        (instance as UnknownRecord)[key] = this.dataValue![key];
      });

    instance.markForCheck();
  }
}
