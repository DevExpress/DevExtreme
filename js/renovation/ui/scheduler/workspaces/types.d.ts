export interface ViewCellData {
  startDate: Date;
  endDate: Date;
  text: string;
  otherMonth?: boolean;
  today?: boolean;
  allDay?: boolean;
  groups?: object;
  groupIndex?: number;
}

interface ViewData {
  dateTable: ViewCellData[][];
  allDayPanel?: ViewCellData[];
  isGroupedAllDayPanel?: boolean;
}

export interface GroupedViewData {
  groupedData: ViewData[];
  isVirtual?: boolean;
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
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
