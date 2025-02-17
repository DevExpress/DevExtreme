import {
  LocalStoreOptions,
  LocalStore,
} from '../common/data';

export {
  LocalStoreOptions,
} from '../common/data';

export default LocalStore;

/**
 * @deprecated Use LocalStoreOptions from /common/data instead
 */
export type Options<
  TItem = any,
  TKey = any,
> = LocalStoreOptions<TItem, TKey>;
