import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { ItemBase } from './item_base';

@ComponentBindings()
export class ButtonItem extends ItemBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() buttonOptions?: any;
}
