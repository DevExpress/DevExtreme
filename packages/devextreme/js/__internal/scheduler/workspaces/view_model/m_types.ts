import type { TimeZoneCalculator } from '../../r1/timezone_calculator/calculator';
import type {
  CellPositionData,
  CountGenerationConfig,
  GetDateForHeaderText,
  GroupOrientation,
  ViewOptions,
  ViewType,
} from '../../types';
import type { ResourceManager } from '../../utils/resource_manager/resource_manager';
import type { GroupLeaf } from '../../utils/resource_manager/types';

interface CommonOptions extends CountGenerationConfig {
  getResourceManager: () => ResourceManager;
  groupOrientation: GroupOrientation;
  isAllDayPanelVisible: boolean;
  viewOffset: number;
  hoursInterval: number;
  viewType: ViewType;
  skippedDays?: number[];
  cellCount: number;
  isProvideVirtualCellsWidth: boolean;
  isGenerateTimePanelData?: boolean;
  isGenerateWeekDaysHeaderData?: boolean;
  today: Date;
  headerCellTextFormat: string | ((date: Date) => string);
  getDateForHeaderText: GetDateForHeaderText;
  startRowIndex: number;
  startCellIndex: number;
  firstDayOfWeek: number;
  showCurrentTimeIndicator: boolean;
  cellDuration: number;
  indicatorTime?: Date;
  timeZoneCalculator?: TimeZoneCalculator;
}

export interface ViewDataProviderOptions extends CommonOptions {
  groupByDate: boolean;
}

export interface ViewDataProviderExtendedOptions extends CommonOptions, ViewOptions {
  startViewDate: Date;
  isVerticalGrouping: boolean;
  isHorizontalGrouping: boolean;
  isGroupedByDate: boolean;
  isGroupedAllDayPanel: boolean;
  interval: number;
}

export interface ViewCellDataSimple {
  groups?: GroupLeaf['grouped'];
  groupIndex: number;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
}

export interface MonthViewCellDataSimple extends ViewCellDataSimple {
  today: boolean;
  otherMonth: boolean;
  isFirstDayMonthHighlighting: boolean;
  text: string;
}

export interface ViewCellIndex {
  index: number;
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
}

export interface ViewCellKey {
  key: number;
}

export type ViewCellGeneratedData = ViewCellDataSimple & ViewCellIndex & ViewCellKey;

export interface CellPosition extends CellPositionData {
  allDay: boolean;
}
