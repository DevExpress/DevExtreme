import {
  ChangeDetectionStrategy, Component, ContentChild, Input,
} from '@angular/core';
import { RadioGroupValue } from '@devextreme/components/src';
import { compileGetter, ItemLike } from '@devextreme/interim';
import { TemplateCompatibleDirective } from '../../compatible-directives/template';
import { RadioGroupBaseComponent } from '../../components/radio-common';

// TODO: Move these to components package
//  because these types equal to similar types in React RG compatible component.
type ValueGetter = <T extends RadioGroupValue>(item: ItemLike) => T;
type LabelGetter = (item: ItemLike) => string;

@Component({
  selector: 'dx-radio-group-compat',
  template: `
    <dx-radio-group
      [value]="value"
      (valueChange)="valueChange.emit($event)">
        <dx-radio-button
          *ngFor="let item of items"
          [label]="labelGetter | apply:item"
          [value]="valueGetter | apply:item"
          [labelTemplate]="labelTemplateDirective?.templateRef"
          >
        </dx-radio-button>
    </dx-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatibleComponent<T extends RadioGroupValue>
  extends RadioGroupBaseComponent<T> {
  @Input() value?: T;

  @Input() items: Array<ItemLike> = [];

  @Input() set valueExpr(value: string) {
    this.compileValueGetter(value);
  }

  @Input() set displayExpr(value: string) {
    this.compileLabelGetter(value);
  }

  @ContentChild(TemplateCompatibleDirective) labelTemplateDirective?: TemplateCompatibleDirective;

  valueGetter!: ValueGetter;

  labelGetter!: LabelGetter;

  constructor() {
    super();
    this.compileValueGetter();
    this.compileLabelGetter();
  }

  private compileValueGetter(expr = ''): void {
    this.valueGetter = compileGetter(expr) as ValueGetter;
  }

  private compileLabelGetter(expr = ''): void {
    this.labelGetter = compileGetter(expr) as LabelGetter;
  }
}
