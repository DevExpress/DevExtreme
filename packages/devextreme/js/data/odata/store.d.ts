import { ODataStoreOptions, ODataStore } from '../../common/data';

/**
 * @public
 * @namespace DevExpress.data.ODataStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = ODataStoreOptions<TItem, TKey>;

export {
    ODataStoreOptions,
};

export default ODataStore;
