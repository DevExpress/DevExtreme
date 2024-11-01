/* global DevExpress */
/* eslint-disable import/no-commonjs */
require('./data');

DevExpress.data.ODataStore = require('../../common/data/odata/store');
DevExpress.data.ODataContext = require('../../common/data/odata/context');

DevExpress.data.utils = DevExpress.data.utils || {};
DevExpress.data.utils.odata = {};

DevExpress.data.utils.odata.keyConverters = require('../../common/data/odata/utils').keyConverters;
DevExpress.data.EdmLiteral = require('../../common/data/odata/utils').EdmLiteral;

const ODataUtilsModule = require('../../common/data/odata/utils');
DevExpress.data.utils.odata.serializePropName = ODataUtilsModule.serializePropName;
DevExpress.data.utils.odata.serializeValue = ODataUtilsModule.serializeValue;
DevExpress.data.utils.odata.serializeKey = ODataUtilsModule.serializeKey;
DevExpress.data.utils.odata.sendRequest = ODataUtilsModule.sendRequest;

///#DEBUG
DevExpress.data.OData__internals = ODataUtilsModule.OData__internals;
///#ENDDEBUG

DevExpress.data.queryAdapters = DevExpress.data.queryAdapters || {};
DevExpress.data.queryAdapters.odata = require('../../common/data/odata/query_adapter').odata;
