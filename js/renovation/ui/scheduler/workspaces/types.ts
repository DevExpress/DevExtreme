import type { dxSchedulerScrolling } from '../../../../ui/scheduler';
import { BaseTemplateProps, GroupOrientation, ViewType } from '../types';
import { GetDateForHeaderText } from '../view_model/to_test/views/types';

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
  firstDayOfMonth?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
}

export interface DateHeaderCellData extends ViewCellData {
  colSpan: number;
}

interface ViewDataBase {
  groupIndex: number;
  isGroupedAllDayPanel?: boolean;
}

interface ViewData extends ViewDataBase {
  dateTable: ViewCellData[][];
  allDayPanel?: ViewCellData[];
}

interface TimePanelCellsData extends ViewDataBase {
  dateTable: ViewCellData[];
  allDayPanel?: ViewCellData;
}

interface GroupedViewDataBase {
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
  leftVirtualCellWidth?: number;
  rightVirtualCellWidth?: number;
  leftVirtualCellCount: number;
  rightVirtualCellCount: number;
  topVirtualRowCount: number;
  bottomVirtualRowCount: number;
}

export interface GroupedViewData extends GroupedViewDataBase {
  groupedData: ViewData[];
}

interface CellPositionData {
  rowIndex: number;
  columnIndex: number;
}

interface CellInfo {
  data: ViewCellData;
  position: CellPositionData;
}

export interface ViewDataMap {
  dateTableMap: CellInfo[][];
  allDayPanelMap: CellInfo[];
}

export interface TimePanelData extends GroupedViewDataBase {
  groupedData: TimePanelCellsData[];
}

export interface GroupItem {
  id: number | string;
  text?: string;
  color?: string;
}
export interface GroupRenderItem extends GroupItem {
  key: string;
  resourceName: string;
  data: GroupItem;
  colSpan?: number;
  isFirstGroupCell?: boolean;
  isLastGroupCell?: boolean;
}

export interface GroupPanelData {
  groupPanelItems: GroupRenderItem[][];
  baseColSpan: number;
}

export interface Group {
  name: string;
  items: GroupItem[];
  data: GroupItem[];
}

interface BaseTemplateData {
  groups?: Record<string, unknown>;
  groupIndex?: number;
  allDay?: boolean;
  text?: string;
}

interface DataCellTemplateData extends BaseTemplateData {
  startDate: Date;
  endDate: Date;
}

interface DateCellTemplateData extends BaseTemplateData {
  date: Date;
}

interface TemplateData extends BaseTemplateData {
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface ContentTemplateProps extends BaseTemplateProps {
  data: TemplateData;
}

export interface DataCellTemplateProps extends BaseTemplateProps {
  data: DataCellTemplateData;
}

export interface DateTimeCellTemplateProps extends BaseTemplateProps {
  data: DateCellTemplateData;
}

interface ResourceCellTemplateData {
  data: GroupItem;
  id: number | string;
  text?: string;
  color?: string;
}

export interface ResourceCellTemplateProps extends BaseTemplateProps {
  data: ResourceCellTemplateData;
}

export interface DateHeaderData {
  dataMap: DateHeaderCellData[][];
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount: number;
  rightVirtualCellCount: number;
  weekDayLeftVirtualCellWidth?: number;
  weekDayRightVirtualCellWidth?: number;
  weekDayLeftVirtualCellCount?: number;
  weekDayRightVirtualCellCount?: number;
}

interface CountGenerationConfig {
  intervalCount: number;
  currentDate: Date;
  viewType: string;
  hoursInterval: number;
  startDayHour: number;
  endDayHour: number;
}

interface ViewOptions {
  isVerticalGrouping: boolean;
  groupOrientation: GroupOrientation;
  isGroupedByDate: boolean;
}

export interface ViewDataProviderOptions {
  startRowIndex: number;
  startCellIndex: number;
  groupOrientation: GroupOrientation;
  groupByDate: boolean;
  groups: Group[];
  isProvideVirtualCellsWidth: boolean;
  isAllDayPanelVisible: boolean;
  selectedCells?: unknown;
  focusedCell?: unknown;
  headerCellTextFormat: string | ((date: Date) => string);
  getDateForHeaderText: GetDateForHeaderText;
  startDayHour: number;
  endDayHour: number;
  cellDuration: number;
  viewType: ViewType;
  intervalCount: number;
  hoursInterval: number;
  currentDate: Date;
  startDate?: Date;
  firstDayOfWeek: number;

  isGenerateTimePanelData: boolean;
  isGenerateWeekDaysHeaderData: boolean;
}

// TODO: tempporary
export interface ViewDataProviderType {
  completeViewDataMap: ViewCellData[][];
  viewDataMap: ViewDataMap;
  timePanelData: TimePanelData;
  viewData: GroupedViewData;
  dateHeaderData: DateHeaderData;
  getCellCount: (config: CountGenerationConfig) => number;
  getRowCount: (config: CountGenerationConfig) => number;
  update: (options: unknown, isGenerateNewData: boolean) => void;
  getGroupPanelData: (options: unknown) => GroupPanelData;
  getLastCellEndDate: () => Date;
  getVisibleDayDuration: (
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number
  ) => number;
  getLastViewDateByEndDayHour: (endDayHour: number) => Date;
  getIntervalDuration: (intervalCount: number) => number;
  getStartViewDate: () => Date;
  getViewOptions: () => ViewOptions;
  setViewOptions: (options: ViewDataProviderOptions) => void;
  createGroupedDataMapProvider: () => void;
}

interface CompleteViewDataGenerationOptions {
  currentDate: Date;
  startDate?: Date;
  startDayHour: number;
  endDayHour: number;
  groupByDate: boolean;
  groups: Group[];
  intervalCount: number;
  firstDayOfWeek: number;
  hoursInterval: number;
  cellDuration: number;
  startViewDate: Date;
  groupOrientation: GroupOrientation;
  isVerticalGrouping: boolean;
  isHorizontalGrouping: boolean;
  isGroupedByDate: boolean;
  isAllDayPanelVisible: boolean;
  viewType: ViewType;
  interval: number;
}

interface ViewDataMapGenerationOptions {
  startRowIndex: number;
  startCellIndex: number;
  isVerticalGrouping: boolean;
  isAllDayPanelVisible: boolean;
}

interface ViewDataGenerationOptions {
  topVirtualRowHeight: number;
  bottomVirtualRowHeight: number;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  startRowIndex: number;
  startCellIndex: number;
  isProvideVirtualCellsWidth: boolean;
  isVerticalGrouping: boolean;
  isAllDayPanelVisible: boolean;
  isGroupedAllDayPanel: boolean;
}

interface GetCellCountOptions {
  intervalCount: number;
  viewType: ViewType;
  startDayHour: number;
  endDayHour: number;
  hoursInterval: number;
  currentDate: Date;
}

type GenerateViewDataMap = (
  completeViewDateMap: ViewCellData[][],
  options: ViewDataMapGenerationOptions,
) => ViewDataMap;

type GetViewDataFromMap = (
  completeViewDateMap: ViewCellData[][],
  viewDataMap: ViewDataMap,
  options: ViewDataGenerationOptions,
) => GroupedViewData;

// TODO: use TS in ViewDataGenerators
export interface ViewDataGeneratorType {
  getCompleteViewDataMap: (options: CompleteViewDataGenerationOptions) => ViewCellData[][];
  generateViewDataMap: GenerateViewDataMap;
  getViewDataFromMap: GetViewDataFromMap;
  getInterval: (hoursInterval: number) => number;
  getCellCount: (options: GetCellCountOptions) => number;
}

interface CompleteDateHeaderMapGenerationOptions {
  isGenerateWeekDaysHeaderData: boolean;
  isGroupedByDate: boolean;
  groups: Group[];
  groupOrientation: GroupOrientation;
  startDayHour: number;
  endDayHour: number;
  hoursInterval: number;
  isHorizontalGrouping: boolean;
  intervalCount: number;
  today?: Date;
  headerCellTextFormat: string | ((date: Date) => string);
  getDateForHeaderText: GetDateForHeaderText;
  interval: number;
  startViewDate: Date;
  currentDate: Date;
  viewType: ViewType;
}

interface DateHeaderDataGenerationOptions {
  isGenerateWeekDaysHeaderData: boolean;
  cellWidth: number;
  isProvideVirtualCellsWidth: boolean;
  startDayHour: number;
  endDayHour: number;
  hoursInterval: number;
  startCellIndex: number;
  cellCount?: number;
  groups: Group[];
  groupOrientation: GroupOrientation;
  isGroupedByDate: boolean;
}

type GetCompleteDateHeaderMap = (
  options: CompleteDateHeaderMapGenerationOptions,
  completeViewData: ViewCellData[][],
) => DateHeaderCellData[][];

type GenerateDateHeaderData = (
  completeDateHeaderMap: DateHeaderCellData[][],
  completeViewDataMap: ViewCellData[][],
  options: DateHeaderDataGenerationOptions,
) => DateHeaderData;

// TODO: use TS in DateHeaderDataGenerator
export interface DateHeaderDataGeneratorType {
  getCompleteDateHeaderMap: GetCompleteDateHeaderMap;
  generateDateHeaderData: GenerateDateHeaderData;
}

interface CompleteTimePanelMapGenerationOptions {
  startViewDate: Date;
  cellDuration: number;
  startDayHour: number;
  endDayHour: number;
  isVerticalGrouping: boolean;
  intervalCount: number;
  currentDate: Date;
  viewType: ViewType;
  hoursInterval: number;
}

interface TimePanelDataGenerationOptions {
  startRowIndex: number;
  rowCount?: number;
  topVirtualRowHeight: number;
  bottomVirtualRowHeight: number;
  isGroupedAllDayPanel: boolean;
  isVerticalGrouping: boolean;
  isAllDayPanelVisible: boolean;
}

type GetCompleteTimePanelMap = (
  options: CompleteTimePanelMapGenerationOptions,
  completeViewData: ViewCellData[][],
) => ViewCellData[];

type GenerateTimePanelData = (
  completeTimePanelMap: ViewCellData[],
  options: TimePanelDataGenerationOptions,
) => TimePanelData;

// TODO: use TS in TimePanelDataGenerator
export interface TimePanelDataGeneratorType {
  getCompleteTimePanelMap: GetCompleteTimePanelMap;
  generateTimePanelData: GenerateTimePanelData;
}

export interface WorkSpaceGenerationOptions {
  intervalCount: number;
  groups: Group[];
  groupByDate: boolean;
  groupOrientation: GroupOrientation;
  startDayHour: number;
  endDayHour: number;
  currentDate: Date;
  startDate?: Date;
  firstDayOfWeek: number;
  hoursInterval: number;
  type: ViewType;
  cellDuration: number;
}

export interface CellsMetaData {
  dateTableCellsMeta: DOMRect[][];
  allDayPanelCellsMeta: DOMRect[];
}

export interface ViewDataProviderValidationOptions {
  intervalCount: number;
  currentDate: Date;
  type: ViewType;
  hoursInterval: number;
  startDayHour: number;
  endDayHour: number;
  groups: Group[];
  groupOrientation?: GroupOrientation;
  groupByDate: boolean;
  crossScrollingEnabled: boolean;
  firstDayOfWeek: number;
  startDate?: Date;
  showAllDayPanel: boolean;
  allDayPanelExpanded: boolean;
  scrolling: dxSchedulerScrolling;
  cellDuration: number;
}

export interface ViewMetaData {
  viewDataProvider: ViewDataProviderType;
  cellsMetaData: CellsMetaData;
  viewDataProviderValidationOptions: ViewDataProviderValidationOptions;
}

export interface TableWidthWorkSpaceConfig extends CountGenerationConfig {
  groups: Group[];
  groupOrientation: GroupOrientation;
}
