import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export abstract class ItemBase {
  @OneWay() colSpan?: number;

  @OneWay() cssClass?: string;

  @OneWay() horizontalAlignment?: 'center' | 'left' | 'right';

  @OneWay() itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';

  @OneWay() name?: string;

  @OneWay() verticalAlignment?: 'bottom' | 'center' | 'top';

  @OneWay() visible?: boolean;

  @OneWay() visibleIndex?: number;
}
