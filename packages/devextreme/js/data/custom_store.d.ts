import { CustomStore, CustomStoreOptions } from '../common/data';

export {
  /**
   * @deprecated Use GroupItem from /common/data instead
   */
  GroupItem,
  /**
   * @deprecated Use ResolvedData from /common/data instead
   */
  ResolvedData,
  /**
   * @deprecated Use CustomStoreOptions from /common/data instead
   */
  CustomStoreOptions,
} from '../common/data';

/**
 * @deprecated Use CustomStoreOptions from /common/data instead
 * @namespace DevExpress.data.CustomStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

/**
 * @deprecated Use CustomStore from /common/data instead
 */
export default CustomStore;
