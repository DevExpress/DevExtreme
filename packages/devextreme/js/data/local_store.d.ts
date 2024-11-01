import {
  LocalStoreOptions,
  LocalStore,
} from '../common/data';

export {
  LocalStoreOptions,
} from '../common/data';

export default LocalStore;

/**
* @public
* @deprecated Use LocalStoreOptions from /common/data instead
* @namespace DevExpress.data.LocalStore
*/
export type Options<
  TItem = any,
  TKey = any,
> = LocalStoreOptions<TItem, TKey>;
