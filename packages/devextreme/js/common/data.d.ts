import { applyChanges } from '../data/apply_changes';
import ArrayStore, { ArrayStoreOptions } from '../data/array_store';
import CustomStore, { ResolvedData, CustomStoreOptions } from '../data/custom_store';
import DataSource, { DataSourceOptions } from '../data/data_source';
import { LocalStore, LocalStoreOptions } from '../data/local_store';
import { ODataContext } from '../data/odata/context';
import { ODataStore, ODataStoreOptions } from '../data/odata/store';
import { EdmLiteral, keyConverters } from '../data/odata/utils';
import { EndpointSelector } from '../data/endpoint_selector';
import { errorHandler, setErrorHandler } from '../data/errors';
import query, { Query } from '../data/query';
import { LoadOptions, LangParams } from '../data';
import { base64_encode } from '../data/utils';
import { compileGetter, compileSetter } from '../utils';

import {
    GroupItem,
    isGroupItemsArray,
    isItemsArray,
    isLoadResultObject,
    LoadResult,
    LoadResultObject,
} from './data/custom-store';

export {
    /**
     * @docid Utils.applyChanges
     * @publicName applyChanges(data, changes, options)
     * @param3 options?:any
     * @namespace DevExpress.data
     * @public
     */
    applyChanges,
    /**
     * @docid
     * @inherits Store
     * @public
     * @options ArrayStoreOptions
     */
    ArrayStore,
    /**
     * @docid
     * @public
     * @namespace DevExpress.data
     */
    ArrayStoreOptions,
    /**
     * @docid
     * @inherits Store
     * @public
     * @options CustomStoreOptions
     */
    CustomStore,
    /**
     * @docid
     * @public
     * @namespace DevExpress.data
     */
    CustomStoreOptions,
    /**
     * @docid
     * @public
     * @type object
     * @deprecated Use LoadResult instead
     */
    ResolvedData,
    /**
     * @docid
     * @public
     * @options DataSourceOptions
     */
    DataSource,
    /**
     * @namespace DevExpress.data
     * @public
     * @docid
     * @type object
     */
    DataSourceOptions,
    /**
     * @docid
     * @inherits ArrayStore
     * @public
     * @options LocalStoreOptions
     */
    LocalStore,
    /**
     * @docid
     * @namespace DevExpress.data
     * @public
     */
    LocalStoreOptions,
    /**
     * @docid
     * @public
     * @options ODataContextOptions
     */
    ODataContext,
    /**
     * @docid
     * @inherits Store
     * @public
     * @options ODataStoreOptions
     */
    ODataStore,
    /**
     * @docid
     * @public
     * @namespace DevExpress.data
     */
    ODataStoreOptions,
    /**
     * @docid
     * @namespace DevExpress.data
     * @public
     */
    EdmLiteral,
    /**
     * @const Utils.keyConverters
     * @publicName odata.keyConverters
     * @namespace DevExpress.data.utils.odata
     * @public
     */
    keyConverters,
    /**
     * @docid
     * @namespace DevExpress
     * @public
     */
    EndpointSelector,
    /**
     * @docid Utils.errorHandler
     * @type function(e)
     * @namespace DevExpress.data
     * @deprecated Utils.setErrorHandler
     * @public
     */
    errorHandler,
    /**
     * @docid Utils.setErrorHandler
     * @type function(handler)
     * @namespace DevExpress.data
     * @public
     */
    setErrorHandler,
    /**
    * @docid Utils.query
    * @param2 queryOptions:object
    * @namespace DevExpress.data
    * @public
    */
    query,
    /**
     * @docid
     * @type object
     * @public
     */
    Query,
    /**
     * @docid
     * @public
     */
    GroupItem,
    /**
     * @docid
     * @public
     */
    isGroupItemsArray,
    /**
     * @docid
     * @public
     */
    isItemsArray,
    /**
     * @docid
     * @public
     */
    isLoadResultObject,
    /**
     * @docid
     * @public
     * @type object
     */
    LoadResult,
    /**
     * @docid
     * @public
     */
    LoadResultObject,
    /**
     * @docid
     * @public
     */
    LangParams,
    /**
     * @public
     * @docid LoadOptions
     * @namespace DevExpress.data
     * @type object
     */
    LoadOptions,
    /**
     * @docid Utils.base64_encode
     * @publicName base64_encode(input)
     * @namespace DevExpress.data
     * @public
     */
    base64_encode,
    /**
     * @docid Utils.compileGetter
     * @publicName compileGetter(expr)
     * @namespace DevExpress.data.utils
     * @public
     */
    compileGetter,
    /**
     * @docid Utils.compileSetter
     * @publicName compileSetter(expr)
     * @namespace DevExpress.data.utils
     * @public
     */
    compileSetter,
};


