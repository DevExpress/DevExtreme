import { DataSource, DataSourceOptions } from '../common/data';

export {
  /**
   * @deprecated Use DataSourceOptions from /common/data instead
   */
  DataSourceOptions,
  /**
   * @deprecated Use DataSourceLike from /common/data instead
   */
  DataSourceLike,
} from '../common/data';

/**
 * @public
 * @deprecated Use DataSourceOptions from /common/data instead
 */
export type Options<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> = DataSourceOptions<TStoreItem, TItem, TMappedItem, TKey>;

/**
 * @deprecated Use DataSource from /common/data instead
 */
export default DataSource;
