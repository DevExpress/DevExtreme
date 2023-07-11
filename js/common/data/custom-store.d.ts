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

type LoadedArray<TItem = any> = Array<TItem> | Array<GroupItem<TItem>>;

/**
 * @docid
 * @public
 */
export type LoadedSummary<TItem = any> = {
    data: Array<TItem> | Array<GroupItem<TItem>>;
    totalCount?: number;
    summary?: Array<any>;
    groupCount?: number;
  };

/**
 * @docid
 * @public
 * @type object
 */
export type LoadResult<
    TItem = any,
> =
  | Object
  | LoadedArray<TItem>
  | LoadedSummary<TItem>;

/**
 * @docid
 * @public
 */
export function isSummary<TItem>(res: LoadResult<TItem>): res is LoadedSummary<TItem>;

/**
 * @docid
 * @public
 */
export function isGroupItemsArray<TItem>(res: LoadResult<TItem>): res is Array<GroupItem<TItem>>;

/**
 * @docid
 * @public
 */
export function isItemsArray<TItem>(res: LoadResult<TItem>): res is Array<TItem>;
