export interface ViewCellData {
  startDate: Date;
  endDate: Date;
  text: string;
  otherMonth?: boolean;
  today?: boolean;
  allDay?: boolean;
  groups?: object;
}

interface ViewCellsData {
  dateTable: ViewCellData[][];
  allDayPanel?: ViewCellData[];
}

export interface GroupedViewData {
  groupedData: ViewCellsData[];
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
