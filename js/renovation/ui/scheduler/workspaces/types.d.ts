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
  cellCountInGroupRow: number;
  leftVirtualCellCount: number;
  rightVirtualCellCount: number;
  topVirtualRowCount: number;
  bottomVirtualRowCount: number;
}

export interface GroupedViewData extends GroupedViewDataBase {
  groupedData: ViewData[];
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

interface BaseTemplateProps {
  index: number;
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
}
