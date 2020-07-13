export interface ViewCellData {
  startDate: Date;
  endDate: Date;
  otherMonth?: boolean;
  today?: boolean;
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
