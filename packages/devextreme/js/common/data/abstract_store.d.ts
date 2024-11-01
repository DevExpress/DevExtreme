import {
  DxExtendedPromise,
} from '../../core/utils/deferred';
import {
  StoreBase,
  StoreOptionsBase,
  LoadOptions,
} from '../data';

export type Options<
  TItem = any,
  TKey = any,
  > = AbstractStoreOptions<TItem, TKey>;

/**
 * @namespace DevExpress.data
 */
interface AbstractStoreOptions<
  TItem = any,
  TKey = any,
  > extends StoreOptionsBase<TItem, TKey> {
  /**
   * @docid StoreOptions.onLoaded
   * @type_function_param2 loadOptions:LoadOptions
   * @action
   * @public
   */
  onLoaded?: ((result: Array<TItem>, loadOptions: LoadOptions<TItem>) => void);
}

/**
 * @namespace DevExpress.data
 */
export default class AbstractStore<
  TItem = any,
  TKey = any,
  > extends StoreBase<TItem, TKey> {
  constructor(options?: Options<TItem, TKey>);
  /**
   * @docid Store.load()
   * @publicName load()
   * @return Promise<any>
   * @public
   */
  load(): DxExtendedPromise<Array<TItem>>;
  /**
   * @docid Store.load(options)
   * @publicName load(options)
   * @param1 options:LoadOptions
   * @return Promise<any>
   * @public
   */
  load(options: LoadOptions<TItem>): DxExtendedPromise<Array<TItem>>;
}

/**
 * @namespace DevExpress.data
 * @deprecated Use Options from data/store instead
 */
export type StoreOptions<TItem = any, TKey = any> = StoreOptionsBase<TItem, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Store from data/store instead
 */
export type Store<TItem = any, TKey = any> = StoreBase<TItem, TKey>;
