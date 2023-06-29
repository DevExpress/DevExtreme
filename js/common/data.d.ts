/**
 * @docid
 * @public
 */
export type GroupItem<
    TItem = any,
> = {
  key: any | string | number;
  items: Array<TItem> | Array<GroupItem<TItem>> | null;
  count?: number;
  summary?: Array<any>;
};

type ItemsArray<TItem = any> = Array<TItem> | Array<GroupItem<TItem>>;

/**
 * @public
 */
export type SummaryResult<TItem = any> = {
    data: Array<TItem> | Array<GroupItem>;
    totalCount?: number;
    summary?: Array<any>;
    groupCount?: number;
  };

/**
 * @docid
 * @public
 * @type object
 */
export type ResolvedData<
    TItem = any,
> =
  | Object
  | ItemsArray<TItem>
  | SummaryResult<TItem>;

/**
 * @public
 */
export function isCustomStoreSummaryResult<TItem>(res: ResolvedData<TItem>): res is SummaryResult<TItem>;

/**
 * @public
 */
export function isCustomStoreGroupItemsArrayResult<TItem>(res: ResolvedData<TItem>): res is Array<GroupItem<TItem>>;

/**
 * @public
 */
export function isCustomStoreItemsArrayResult<TItem>(res: ResolvedData<TItem>): res is Array<TItem>;
