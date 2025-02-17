import { ArrayStore, ArrayStoreOptions } from '../common/data';

export {
    ArrayStoreOptions,
} from '../common/data';

/**
 * @deprecated Use ArrayStoreOptions from /common/data instead
 */
export type Options<
    TItem = any,
    TKey = any,
> = ArrayStoreOptions<TItem, TKey>;

export default ArrayStore;
