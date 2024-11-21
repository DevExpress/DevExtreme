import {
  DxExtendedPromise,
} from '../../core/utils/deferred';
import {
  Store,
  StoreOptions,
  LoadOptions,
} from './store_base';

export type Options<
  TItem = any,
  TKey = any,
  > = AbstractStoreOptions<TItem, TKey>;

/**
 * @namespace DevExpress.data
 */
export interface AbstractStoreOptions<
  TItem = any,
  TKey = any,
  > extends StoreOptions<TItem, TKey> {
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
  > extends Store<TItem, TKey> {
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


export type {
  /**
   * @namespace DevExpress.data
   * @deprecated Use Options from data/store instead
   */
  StoreOptions,

  /**
   * @namespace DevExpress.data
   * @deprecated Use Store from data/store instead
   */
  Store,
} from './store_base';
