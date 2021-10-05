import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import {
  ToolbarItem,
  ToolbarButtonProps,
  ToolbarButtonGroupProps,
  ToolbarTextBoxProps,
  ToolbarCheckBoxProps,
  ToolbarDropDownButtonProps,
} from '../../toolbar/toolbar_props';

@ComponentBindings()
class SchedulerToolbarItemProps extends ToolbarItem {
  @OneWay()
  defaultElement?: 'dateNavigator' | 'viewSwitcher';

  @OneWay()
  options?: (ToolbarButtonProps
  | ToolbarButtonGroupProps | ToolbarDropDownButtonProps
  | ToolbarTextBoxProps | ToolbarCheckBoxProps);
}

export type SchedulerToolbarItem = string | SchedulerToolbarItemProps;
