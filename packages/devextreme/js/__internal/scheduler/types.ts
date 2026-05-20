import type { dxElementWrapper } from '@js/core/renderer';
import type { Appointment, Properties } from '@js/ui/scheduler';
import type { Component } from '@ts/core/widget/component';

import type { ResourceLoader } from './utils/loader/resource_loader';
import type { GroupValues, RawGroupValues } from './utils/resource_manager/types';
import type { AppointmentViewModelPlain } from './view_model/types';

export type Direction = 'vertical' | 'horizontal';
export type GroupOrientation = 'vertical' | 'horizontal';
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
export type AllDayPanelModeType = 'all' | 'allDay' | 'hidden';
export type RenderStrategyName = 'horizontal' | 'horizontalMonth' | 'horizontalMonthLine' | 'vertical' | 'week' | 'agenda';
export type FilterItemType = Record<string, string | number> | string | number;
export type HeaderCellTextFormat = string | ((date: Date) => string);

export interface SafeAppointment extends Appointment {}

export interface TargetedAppointment extends Appointment {
  displayStartDate: Date;
  displayEndDate: Date;
}

export type CreateComponentFn = <TTComponent, IProperties = Record<string, unknown>>(
  element: string | HTMLElement | dxElementWrapper | Element,
  component: string | (new (...args) => TTComponent),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentConfiguration: TTComponent extends Component<any, infer TTProperties>
    ? TTProperties
    : IProperties,
) => TTComponent;

export interface AppointmentDataItem {
  startDate: Date;
  startDateTimeZone?: string;
  endDate: Date;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  hasRecurrenceRule: boolean;
  allDay: boolean;
  visible: boolean;
  rawAppointment: SafeAppointment;
}

export interface AppointmentGeometry {
  empty: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
}

export type GetDateForHeaderText = (
  index: number, date: Date, options: GetDateForHeaderTextOptions,
) => Date;

export interface GroupItem {
  id: number | string;
  text?: string;
  color?: string;
}

export interface Group {
  name: string;
  items: GroupItem[];
  data: GroupItem[];
}

export interface GetDateForHeaderTextOptions {
  startDayHour: number;
  startViewDate: Date;
  cellCountInDay: number;
  interval: number;
  viewOffset: number;
}

export type CalculateCellIndex = (
  rowIndex: number, columnIndex: number, rowCount: number, columnCount: number,
) => number;

export type CalculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  startDate: Date,
  intervalCount: number,
  firstDayOfWeekOption?: number,
  skippedDays?: number[],
) => Date;

export interface ViewCellData {
  startDate: Date;
  endDate: Date;
  text?: string;
  otherMonth?: boolean;
  today?: boolean;
  allDay?: boolean;
  groups?: Record<string, unknown>;
  groupIndex?: number;
  index: number;
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
  key: number;
  isFirstDayMonthHighlighting?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
  highlighted?: boolean;
}

export interface CountGenerationConfig {
  intervalCount: number;
  currentDate: Date;
  viewType: string;
  hoursInterval: number;
  startDayHour: number;
  endDayHour: number;
}

export interface ViewOptions {
  isVerticalGrouping: boolean;
  groupOrientation: GroupOrientation;
  isGroupedByDate: boolean;
  startCellIndex: number;
  startRowIndex: number;
  startDayHour: number;
  endDayHour: number;
}

export interface GroupRenderItem extends GroupItem {
  key: string;
  resourceName: string;
  data: GroupItem;
  colSpan?: number;
  isFirstGroupCell?: boolean;
  isLastGroupCell?: boolean;
}

export interface CellPositionData {
  rowIndex: number;
  columnIndex: number;
}

export interface ViewDataProviderOptions {
  startRowIndex: number;
  startCellIndex: number;
  groupOrientation: GroupOrientation;
  groupByDate: boolean;
  groups: ResourceLoader[];
  isProvideVirtualCellsWidth: boolean;
  isAllDayPanelVisible: boolean;
  selectedCells?: unknown;
  focusedCell?: unknown;
  headerCellTextFormat: string | ((date: Date) => string);
  getDateForHeaderText: GetDateForHeaderText;
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  cellDuration: number;
  viewType: ViewType;
  intervalCount: number;
  hoursInterval: number;
  currentDate: Date;
  startDate?: Date;
  firstDayOfWeek: number;
  today: Date;

  isGenerateTimePanelData?: boolean;
  isGenerateWeekDaysHeaderData?: boolean;
}

export interface CellInfo {
  cellData: ViewCellData;
  position: CellPositionData;
}

export interface ViewDataMap {
  dateTableMap: CellInfo[][];
  allDayPanelMap: CellInfo[];
}

export interface DateHeaderCellData extends ViewCellData {
  colSpan: number;
}

export interface DateHeaderData {
  dataMap: DateHeaderCellData[][];
  leftVirtualCellWidth?: number;
  rightVirtualCellWidth?: number;
  leftVirtualCellCount: number;
  rightVirtualCellCount: number;
  weekDayLeftVirtualCellWidth?: number;
  weekDayRightVirtualCellWidth?: number;
  weekDayLeftVirtualCellCount?: number;
  weekDayRightVirtualCellCount?: number;
  isMonthDateHeader?: boolean;
}

export interface GroupPanelData {
  groupPanelItems: GroupRenderItem[][];
  baseColSpan: number;
}

export interface ViewDataBase {
  groupIndex: number;
  isGroupedAllDayPanel?: boolean;
  key: string;
}

export interface GroupedViewDataBase {
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
  leftVirtualCellWidth?: number;
  rightVirtualCellWidth?: number;
  leftVirtualCellCount: number;
  rightVirtualCellCount: number;
  topVirtualRowCount: number;
  bottomVirtualRowCount: number;
}

export interface TimePanelCellsData extends ViewDataBase {
  dateTable: ViewCellData[];
  allDayPanel?: ViewCellData;
}

export interface TimePanelData extends GroupedViewDataBase {
  groupedData: TimePanelCellsData[];
}

export interface ViewDataProviderType {
  completeViewDataMap: ViewCellData[][];
  viewDataMap: ViewDataMap;
  timePanelData: TimePanelData;
  dateHeaderData: DateHeaderData;
  getCellData: (
    rowIndex: number,
    columnIndex: number,
    isAllDay?: boolean,
    rtlEnabled?: boolean,
  ) => ViewCellData;
  getCellCount: (config: CountGenerationConfig) => number;
  getRowCount: (config: CountGenerationConfig) => number;
  update: (options: unknown, isGenerateNewData: boolean) => void;
  getGroupPanelData: (options: unknown) => GroupPanelData;
  getLastCellEndDate: () => Date;
  getVisibleDayDuration: (
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ) => number;
  getLastViewDateByEndDayHour: (endDayHour: number) => Date;
  getIntervalDuration: (intervalCount: number) => number;
  getStartViewDate: () => Date;
  getViewOptions: () => ViewOptions;
  setViewOptions: (options: ViewDataProviderOptions) => void;
  createGroupedDataMapProvider: () => void;
  isDateSkipped: (date: Date) => boolean;
  getCellsByGroupIndexAndAllDay: (groupIndex: number, isAllDay: boolean) => ViewCellData[][];
  getCellsBetween: (first: ViewCellData, last: ViewCellData) => ViewCellData[];
  viewType: ViewType;
}

export interface AppointmentTooltipItem {
  appointment: Appointment;
  targetedAppointment?: Appointment | TargetedAppointment;
  color: Promise<string | undefined>;
}

export interface CompactAppointmentOptions {
  $container: dxElementWrapper;
  coordinates: { top: number; left: number };
  items: (AppointmentTooltipItem & {
    settings: AppointmentViewModelPlain;
  })[];
  buttonColor: Promise<string | undefined>;
  sortedIndex: number;
  width: number;
  height: number;
  onAppointmentClick: Properties['onAppointmentClick'];
  allowDrag: boolean;
  isCompact: boolean;
}

export interface ScrollToOptions {
  group?: RawGroupValues | GroupValues;
  allDay?: boolean | undefined;
  alignInView?: 'start' | 'center';
}

export type ScrollToGroupValuesOrOptions = RawGroupValues
  | GroupValues
  | ScrollToOptions
  | undefined;
