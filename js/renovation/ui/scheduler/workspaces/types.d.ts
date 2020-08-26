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
}

interface ViewData {
  dateTable: ViewCellData[][];
  allDayPanel?: ViewCellData[];
  isAllDayPanelInsideDateTable?: boolean;
}

export interface GroupedViewData {
  groupedData: ViewData[];
  isVirtual?: boolean;
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
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

interface TemplateDataProps {
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  text?: string;
  groups?: object;
  groupIndex?: number;
  allDay?: boolean;
}
export interface ContentTemplateProps {
  data: TemplateDataProps;
  index: number;
}
