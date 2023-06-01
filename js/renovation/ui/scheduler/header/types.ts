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
