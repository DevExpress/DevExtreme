import {
  DxExtendedPromise,
} from '../core/utils/deferred';
import {
  Store as StoreBase,
  StoreOptions as StoreOptionsBase,
} from './store';
import { LoadOptions } from '../common/data';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<
  TItem = any,
  TKey = any,
  > = AbstractStoreOptions<TItem, TKey>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface AbstractStoreOptions<
  TItem = any,
  TKey = any,
  > extends StoreOptionsBase<TItem, TKey> {
  /**
   * A function that is executed after data is loaded to the store.
   */
  onLoaded?: ((result: Array<TItem>, loadOptions: LoadOptions<TItem>) => void);
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class AbstractStore<
  TItem = any,
  TKey = any,
  > extends StoreBase<TItem, TKey> {
  constructor(options?: Options<TItem, TKey>);
  /**
   * Starts loading data.
   */
  load(): DxExtendedPromise<Array<TItem>>;
  /**
   * Starts loading data.
   */
  load(options: LoadOptions<TItem>): DxExtendedPromise<Array<TItem>>;
}

/**
 * @deprecated Use StoreOptions from common/data instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type StoreOptions<TItem = any, TKey = any> = StoreOptionsBase<TItem, TKey>;

/**
 * @deprecated Use Store from common/data instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Store<TItem = any, TKey = any> = StoreBase<TItem, TKey>;
