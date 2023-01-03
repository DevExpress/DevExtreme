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
  selector: 'dx-dynamic-template[template]',
  template: '',
  styles: [':host {display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTemplateComponent<
  TComponent extends ViewComponent,
  TData extends UnknownRecord,
  > {
  @Input() set template(template: AngularTemplate<TComponent> | null) {
    this.setTemplate(template);
  }

  @Input() set data(data: TData | null) {
    this.setTemplateData(data);
  }

  private templateValue: AngularTemplate<TComponent> | null = null;

  private dataValue: TData | null = null;

  private componentRef?: ComponentRef<TComponent>;

  private templateRef?: EmbeddedViewRef<AngularTemplateContext<TData>>;

  constructor(
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  private setTemplate(template: AngularTemplate<TComponent> | null): void {
    if (template === this.templateValue) {
      return;
    }

    this.templateValue = template;

    if (!template) {
      this.clearTemplate();
      return;
    }

    if (template instanceof TemplateRef) {
      this.templateRef = this.viewContainerRef.createEmbeddedView(template);
    } else {
      this.componentRef = this.viewContainerRef.createComponent(template);
    }

    this.setTemplateData(this.dataValue);
  }

  private clearTemplate(): void {
    this.viewContainerRef.clear();
    this.templateRef = undefined;
    this.componentRef = undefined;
  }

  private setTemplateData(data: TData | null): void {
    if (data === this.dataValue) {
      return;
    }

    this.dataValue = data;

    if (!data) {
      return;
    }

    if (this.componentRef) {
      this.setDataToComponent();
    } else if (this.templateRef) {
      this.templateRef.context = { $implicit: this.dataValue! };
    }
  }

  private setDataToComponent(): void {
    const { instance } = this.componentRef!;
    const instanceAsRecord = instance as UnknownRecord;

    (Object.keys(this.dataValue!) as (keyof TData)[])
      // TODO (Vinogradov): Think about optimization here.
      .forEach((key) => {
        instanceAsRecord[key] = this.dataValue![key];
      });

    instance.markForCheck();
  }
}
