import type { Coordinates } from '@js/core/renderer';

export interface GroupedStrategyConfig {
  getRowCount: () => number;
  getCellCount: () => number;
  getGroupCount: () => number;
  getCellHeight: () => number;
  getCellWidth: () => number;
  getTimePanelWidth: () => number;
  getGroupTableWidth: () => number;
  getAllDayHeight: () => number;
  getWorkSpaceWidth: () => number;
  getWorkSpaceLeftOffset: () => number;
  getIndicatorOffset: () => number;
  getIndicationHeight: () => number;
  getIndicationWidth: () => number;
  getGroupHeights?: () => number[] | undefined;
  getScrollableScrollTop: () => number;
  getScrollableContentElement: () => Element;
  getElement: () => Element;
  getHeaderPanelContainerElement: () => Element;
  getCellIndexByCoordinates: (
    coordinates: Coordinates & { groupIndex?: number },
  ) => number;
  supportAllDayRow: () => boolean;
  isGroupedByDate: () => boolean;
  showAllDayPanel: () => boolean;
  startDayHour: () => number;
  endDayHour: () => number;
  hoursInterval: () => number;
  crossScrollingEnabled: () => boolean;
  rtlEnabled: () => boolean;
  getHeaderHeight: () => number;
}
