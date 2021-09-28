import Store, {
    StoreOptions,
} from './abstract_store';
import { Query } from './query';

/** @namespace DevExpress.data */
export interface ArrayStoreOptions
<TValue = any,
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
export default class ArrayStore
<TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> extends Store<TValue, TKeyExpr, TKey> {
    constructor(options?: ArrayStoreOptions<TValue, TKeyExpr, TKey>)
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
