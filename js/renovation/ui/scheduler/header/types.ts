import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import {
  ToolbarItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ToolbarButtonProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ToolbarButtonGroupProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ToolbarDropDownButtonProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ToolbarTextBoxProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ToolbarCheckBoxProps,
} from '../../toolbar/toolbar_props';

@ComponentBindings()
export class SchedulerToolbarItemProps extends ToolbarItem {
  @OneWay()
  defaultElement?: DefaultElement;
}

export type SchedulerToolbarItem = string | SchedulerToolbarItemProps;

export type DefaultElement = 'dateNavigator' | 'viewSwitcher';

export type Direction = -1 | 1;

export interface ItemOptions {
  useDropDownViewSwitcher: boolean;
  selectedView: string;
  views: ItemView[];
  setCurrentView: (view: ItemView) => void;
  showCalendar: () => void;
  captionText: string;
  updateDateByDirection: (direction: Direction) => void;
  isPreviousButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
}

export interface ItemView {
  text: string;
  name: string;
}
