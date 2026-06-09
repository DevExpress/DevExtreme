export interface WorkspaceGroupedStrategyConfig {
  isGroupedByDate: () => boolean;
  getCellCount: () => number;
  getGroupCount: () => number;
  getRowCount: () => number;
  getCellWidth: () => number;
  getCellHeight: () => number;
  getAllDayHeight: () => number;
  getTimePanelWidth: () => number;
  getGroupTableWidth: () => number;
  getWorkSpaceWidth: () => number;
  getWorkSpaceLeftOffset: () => number;
  getIndicatorOffset: () => number;
  getIndicationHeight: () => number;
  getIndicationWidth: () => number;
  getCellIndexByCoordinates: (
    coordinates: { top: number; left: number },
    allDay?: boolean,
  ) => number;
  supportAllDayRow: () => boolean;
  getScrollableScrollTop: () => number;
  getScrollableContentElement: () => HTMLElement;
  getElement: () => HTMLElement;
  getHeaderPanelContainerElement: () => HTMLElement;
  isRtlEnabled: () => boolean;
  isShowAllDayPanel: () => boolean;
  isCrossScrollingEnabled: () => boolean;
  getStartDayHour: () => number;
  getEndDayHour: () => number;
  getHoursInterval: () => number;
  getHeaderHeight: () => number;
}
