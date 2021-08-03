import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';
import {
  ToolbarItem,
  ToolbarButtonProps,
  ToolbarButtonGroupProps,
  ToolbarDropDownButtonProps,
  ToolbarTextBoxProps,
  ToolbarCheckBoxProps,
} from '../../toolbar/toolbar_props';
import {
  DefaultElement,
} from './types';

@ComponentBindings()
export class SchedulerToolbarItemProps extends ToolbarItem {
  @OneWay()
  defaultElement?: DefaultElement;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type SchedulerToolbarItem = string | SchedulerToolbarItemProps;
