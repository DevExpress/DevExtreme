import { GroupItem, ResolvedData, SummaryResult } from './custom_store';

/**
 * @docid Utils.base64_encode
 * @publicName base64_encode(input)
 * @namespace DevExpress.data
 * @public
 */
export function base64_encode(input: string | Array<number>): string;

/**
 * @public
 */
export function isSummaryResult<TItem>(res: ResolvedData<TItem>): res is SummaryResult<TItem>;

/**
 * @public
 */
export function isGroupItemsArray<TItem>(res: ResolvedData<TItem>): res is Array<GroupItem<TItem>>;

/**
 * @public
 */
export function isItemsArray<TItem>(res: ResolvedData<TItem>): res is Array<TItem>;
