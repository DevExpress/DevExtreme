import type { JSXTemplate } from '@devextreme-generator/declarations';
import type { GroupItem, ViewDataBase } from '@ts/scheduler/r1/types';

export interface BaseTemplateProps {
  index: number;
}

interface BaseTemplateData {
  groups?: Record<string, unknown>;
  groupIndex?: number;
  allDay?: boolean;
  text?: string;
}

interface TemplateData extends BaseTemplateData {
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

interface DateCellTemplateData extends BaseTemplateData {
  date: Date;
}

export interface ContentTemplateProps extends BaseTemplateProps {
  data: TemplateData;
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
  highlighted?: boolean;
}

export interface DateHeaderCellData extends ViewCellData {
  colSpan: number;
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
  isMonthDateHeader?: boolean;
}

interface DataCellTemplateData extends BaseTemplateData {
  startDate: Date;
  endDate: Date;
}

export interface DataCellTemplateProps extends BaseTemplateProps {
  data: DataCellTemplateData;
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

export interface RowData {
  cells: ViewCellData[];
  key: number;
}

interface ViewData extends ViewDataBase {
  dateTable: RowData[];
  allDayPanel?: ViewCellData[];
}

export interface GroupedViewData extends GroupedViewDataBase {
  groupedData: ViewData[];
}

export interface CellTemplateProps extends ViewCellData {
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}
