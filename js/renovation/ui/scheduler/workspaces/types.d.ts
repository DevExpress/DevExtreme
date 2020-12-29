export interface ViewCellData {
  startDate: Date;
  endDate: Date;
  text: string;
  otherMonth?: boolean;
  today?: boolean;
  allDay?: boolean;
  groups?: object;
  groupIndex?: number;
  index: number;
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
  key: string;
}

interface ViewData {
  dateTable: ViewCellData[][];
  groupIndex: number;
  allDayPanel?: ViewCellData[];
  isGroupedAllDayPanel?: boolean;
}

export interface GroupedViewData {
  groupedData: ViewData[];
  isVirtual?: boolean;
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
  leftVirtualCellWidth?: number;
  rightVirtualCellWidth?: number;
  cellCountInGroupRow: number;
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
}

export interface Group {
  name: string;
  items: GroupItem[];
  data: GroupItem[];
}

interface BaseTemplateData {
  groups?: object;
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

