import Store, {
    Options as StoreOptions,
} from './abstract_store';
import { Query } from './query';

/** @public */
export type Options<
    TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> = ArrayStoreOptions<TValue, TKeyExpr, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface ArrayStoreOptions<
    TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> extends StoreOptions<TValue, TKeyExpr, TKey> {
    /**
     * @docid
     * @public
     */
    data?: Array<TValue>;
}
/**
 * @docid
 * @inherits Store
 * @public
 */
export default class ArrayStore<
    TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> extends Store<TValue, TKeyExpr, TKey> {
    constructor(options?: Options<TValue, TKeyExpr, TKey>)
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName createQuery()
     * @return object
     * @public
     */
    createQuery(): Query;
}
