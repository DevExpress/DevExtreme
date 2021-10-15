import ArrayStore, {
    ArrayStoreOptions,
} from './array_store';

/** @public */
export type Options<
    TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> = LocalStoreOptions<TValue, TKeyExpr, TKey>;

/**
 * @namespace DevExpress.data
 * @deprecated Use Options instead
 */
export interface LocalStoreOptions<
    TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> extends ArrayStoreOptions<TValue, TKeyExpr, TKey> {
    /**
     * @docid
     * @default 10000
     * @public
     */
    flushInterval?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    immediate?: boolean;
    /**
     * @docid
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @inherits ArrayStore
 * @public
 */
export default class LocalStore
<TValue = any,
    TKeyExpr extends string | Array<string> = string | Array<string>,
    TKey = TKeyExpr extends keyof TValue ? TValue[TKeyExpr] : any,
> extends ArrayStore<TValue, TKeyExpr, TKey> {
    constructor(options?: Options<TValue, TKeyExpr, TKey>)
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
}
