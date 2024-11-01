import { ODataStoreOptions, ODataStore } from '../../common/data';

/**
 * @public
 * @deprecated Use ODataStoreOptions from /common/data instead
 */
export type Options<
    TItem = any,
    TKey = any,
> = ODataStoreOptions<TItem, TKey>;

export {
    /**
     * @deprecated Use ODataStoreOptions from /common/data instead
     */
    ODataStoreOptions,
};

/**
 * @deprecated Use ODataStore from /common/data instead
 */
export default ODataStore;
