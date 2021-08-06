/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import {
  ToolbarItem,
  ToolbarButtonProps,
  ToolbarButtonGroupProps,
  ToolbarDropDownButtonProps,
  ToolbarTextBoxProps,
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
  view: {
    text: string;
    type: string;
    name: string;
  };
}
