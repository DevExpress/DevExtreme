export interface GroupItemData {
  key: unknown;
  items: GroupItemData[] | null;
  isContinuation?: boolean;
  count?: number;
}

export type DataItem = GroupItemData | Record<string, unknown>;

export interface GroupInfoData {
  offset: number;
  count: number;
  path: unknown[];
  isExpanded: boolean;
  isPending?: boolean;
}
