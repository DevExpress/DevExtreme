import { CustomStore, CustomStoreOptions } from '../common/data';

export {
  GroupItem,
  ResolvedData,
  CustomStoreOptions,
} from '../common/data';

/**
 * @deprecated Use CustomStoreOptions from /common/data instead
 */
export type Options<
    TItem = any,
    TKey = any,
> = CustomStoreOptions<TItem, TKey>;

export default CustomStore;
