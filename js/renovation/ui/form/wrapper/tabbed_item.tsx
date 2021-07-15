import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { ItemBase } from './item_base';

@ComponentBindings()
export class TabbedItem extends ItemBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() tabPanelOptions?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() tabs?: (any)[];
}
