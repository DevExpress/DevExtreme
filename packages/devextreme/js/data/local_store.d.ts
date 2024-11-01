import {
  LocalStoreOptions,
  LocalStore,
} from '../common/data';

export {
  /**
   * @deprecated Use LocalStoreOptions from /common/data instead
   */
  LocalStoreOptions,
} from '../common/data';

/**
 * @deprecated Use LocalStore from /common/data instead
 */
export default LocalStore;

/**
* @public
* @deprecated Use LocalStoreOptions from /common/data instead
*/
export type Options<
  TItem = any,
  TKey = any,
> = LocalStoreOptions<TItem, TKey>;
