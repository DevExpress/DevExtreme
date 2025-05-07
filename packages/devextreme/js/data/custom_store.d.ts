import { CustomStore, CustomStoreOptions } from '../common/data';

export {
  GroupItem,
  ResolvedData,
  CustomStoreOptions,
} from '../common/data';

/**
 * @public
 * @deprecated Use CustomStoreOptions from /common/data instead
 * @namespace DevExpress.data.CustomStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

export default CustomStore;
