import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import {
  ToolbarItem,
} from '../../toolbar/toolbar_props';

@ComponentBindings()
export class SchedulerToolbarItemProps extends ToolbarItem {
  @OneWay()
  defaultElement?: 'dateNavigator' | 'viewSwitcher';
}
