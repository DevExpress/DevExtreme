import {
  ToolbarButtonGroupItemPropsType,
} from '../../toolbar/toolbar_props';

export type DefaultElement = 'dateNavigator' | 'viewSwitcher';

export type Direction = -1 | 1;

export interface ItemView {
  text: string;
  name: string;
  view: {
    text: string;
    type: string;
    name: string;
  };
}

export type SchedulerToolbarButtonGroupItemPropsType = ToolbarButtonGroupItemPropsType | string;

export interface ConfigOptionType {
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

export interface Caption {
  startDate: Date;
  endDate: Date;
  text: string;
}
