/**
 * @docid
 * @public
 */
export type CustomStoreGroupItem<
    TItem = any,
> = {
  key: any | string | number;
  items: Array<TItem> | Array<CustomStoreGroupItem<TItem>> | null;
  count?: number;
  summary?: Array<any>;
};

type CustomStoreLoadedArray<TItem = any> = Array<TItem> | Array<CustomStoreGroupItem<TItem>>;

/**
 * @docid
 * @public
 */
export type CustomStoreLoadedSummary<TItem = any> = {
    data: Array<TItem> | Array<CustomStoreGroupItem<TItem>>;
    totalCount?: number;
    summary?: Array<any>;
    groupCount?: number;
  };

/**
 * @docid
 * @public
 * @type object
 */
export type CustomStoreLoadResult<
    TItem = any,
> =
  | Object
  | CustomStoreLoadedArray<TItem>
  | CustomStoreLoadedSummary<TItem>;

/**
 * @docid
 * @public
 */
export function isCustomStoreSummary<TItem>(res: CustomStoreLoadResult<TItem>): res is CustomStoreLoadedSummary<TItem>;

/**
 * @docid
 * @public
 */
export function isCustomStoreGroupItemsArray<TItem>(res: CustomStoreLoadResult<TItem>): res is Array<CustomStoreGroupItem<TItem>>;

/**
 * @docid
 * @public
 */
export function isCustomStoreItemsArray<TItem>(res: CustomStoreLoadResult<TItem>): res is Array<TItem>;
