/* global DevExpress */

require('./data');

DevExpress.data.ODataStore = require('../../data/odata/store');
DevExpress.data.ODataContext = require('../../data/odata/context');

DevExpress.data.utils = DevExpress.data.utils || {};
DevExpress.data.utils.odata = {};

DevExpress.data.utils.odata.keyConverters = require('../../data/odata/utils').keyConverters;
DevExpress.data.EdmLiteral = require('../../data/odata/utils').EdmLiteral;

const ODataUtilsModule = require('../../data/odata/utils');
DevExpress.data.utils.odata.serializePropName = ODataUtilsModule.serializePropName;
DevExpress.data.utils.odata.serializeValue = ODataUtilsModule.serializeValue;
DevExpress.data.utils.odata.serializeKey = ODataUtilsModule.serializeKey;
DevExpress.data.utils.odata.sendRequest = ODataUtilsModule.sendRequest;

///#DEBUG
DevExpress.data.OData__internals = ODataUtilsModule.OData__internals;
///#ENDDEBUG

DevExpress.data.queryAdapters = DevExpress.data.queryAdapters || {};
DevExpress.data.queryAdapters.odata = require('../../data/odata/query_adapter').odata;
