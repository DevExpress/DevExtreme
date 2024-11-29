import { ArrayStore, ArrayStoreOptions } from '../common/data';

export {
    /**
     * @deprecated Use ArrayStoreOptions from /common/data instead
     */
    ArrayStoreOptions,
} from '../common/data';

/**
 * @deprecated Use ArrayStoreOptions from /common/data instead
 * @namespace DevExpress.data.ArrayStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey>;

/**
 * @deprecated Use ArrayStore from /common/data instead
 */
export default ArrayStore;
