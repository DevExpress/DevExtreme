import { ArrayStore, ArrayStoreOptions } from '../common/data';

export {
    ArrayStoreOptions,
} from '../common/data';

/**
 * @public
 * @deprecated Use ArrayStoreOptions from /common/data instead
 * @namespace DevExpress.data.ArrayStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey>;

export default ArrayStore;
