import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class SimpleItem {
  @OneWay() colSpan?: number;

  @OneWay() cssClass?: string;

  @OneWay() horizontalAlignment?: 'center' | 'left' | 'right';

  @OneWay() itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';

  @OneWay() name?: string;

  @OneWay() verticalAlignment?: 'bottom' | 'center' | 'top';

  @OneWay() visible?: boolean;

  @OneWay() visibleIndex?: number;

  @OneWay() dataField?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() editorOptions?: any;

  @OneWay() editorType?: 'dxTextBox';

  @OneWay() helpText?: string;

  @OneWay() isRequired?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() label?: any;

  // TODO: not working yet
  // template?: template;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() validationRules?: any[];
}
