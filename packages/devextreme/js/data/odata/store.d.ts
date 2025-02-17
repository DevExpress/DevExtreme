import { ODataStoreOptions, ODataStore } from '../../common/data';

export type Options<
    TItem = any,
    TKey = any,
> = ODataStoreOptions<TItem, TKey>;

export {
    ODataStoreOptions,
};

export default ODataStore;
