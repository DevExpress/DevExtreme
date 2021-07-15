import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { ItemBase } from './item_base';
import { ButtonItem } from './button_item';
import { EmptyItem } from './empty_item';
import { SimpleItem } from './simple_item';
import { TabbedItem } from './tabbed_item';

@ComponentBindings()
export class GroupItem extends ItemBase {
  @OneWay() alignItemLabels?: boolean;

  @OneWay() caption?: string;

  @OneWay() colCount?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() colCountByScreen?: any;

  @OneWay() items?: (string | SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem)[];

  // TODO: not working yet
  // @OneWay() template?: template;
}
