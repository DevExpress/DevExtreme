/* eslint-disable import/no-commonjs */
const DevExpress = require('./core');
const errors = require('../../core/errors');

module.exports = DevExpress.data = DevExpress.data || {};

Object.defineProperty(DevExpress.data, 'errorHandler', {
    get: function() {
        return require('../../data/errors').errorHandler;
    },
    set: function(value) {
        errors.log('W0003', 'DevExpress.data', 'errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead');
        require('../../data/errors').setErrorHandler(value);
    }
});

// TODO: try remove (plugins failed without this)
Object.defineProperty(DevExpress.data, '_errorHandler', {
    get: function() {
        return require('../../data/errors').handleError;
    },
    set: function(value) {
        errors.log('W0003', 'DevExpress.data', '_errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead');
        require('../../data/errors').setErrorHandler(value);
    }
});

DevExpress.data.setErrorHandler = require('../../data/errors').setErrorHandler;
DevExpress.data.DataSource = require('../../data/data_source');
DevExpress.data.query = require('../../data/query');
DevExpress.data.Store = require('../../data/abstract_store');
DevExpress.data.ArrayStore = require('../../data/array_store');
DevExpress.data.CustomStore = require('../../data/custom_store');
DevExpress.data.LocalStore = require('../../data/local_store');
DevExpress.data.base64_encode = require('../../data/utils').base64_encode;
DevExpress.data.applyChanges = require('../../data/apply_changes');

DevExpress.data.Guid = require('../../core/guid');

DevExpress.data.utils = {};
DevExpress.data.utils.compileGetter = require('../../core/utils/data').compileGetter;
DevExpress.data.utils.compileSetter = require('../../core/utils/data').compileSetter;

DevExpress.EndpointSelector = require('../../data/endpoint_selector');

DevExpress.data.queryImpl = require('../../data/query_implementation').queryImpl;
DevExpress.data.queryAdapters = require('../../data/query_adapters');

DevExpress.data.utils.normalizeBinaryCriterion = require('../../data/utils').normalizeBinaryCriterion;
DevExpress.data.utils.normalizeSortingInfo = require('../../data/utils').normalizeSortingInfo;
DevExpress.data.utils.errorMessageFromXhr = require('../../data/utils').errorMessageFromXhr;
DevExpress.data.utils.aggregators = require('../../data/utils').aggregators;
DevExpress.data.utils.keysEqual = require('../../data/utils').keysEqual;
DevExpress.data.utils.isDisjunctiveOperator = require('../../data/utils').isDisjunctiveOperator;
DevExpress.data.utils.isConjunctiveOperator = require('../../data/utils').isConjunctiveOperator;
DevExpress.data.utils.processRequestResultLock = require('../../data/utils').processRequestResultLock;

DevExpress.data.utils.toComparable = require('../../core/utils/data').toComparable;

DevExpress.data.utils.multiLevelGroup = require('../../data/store_helper').multiLevelGroup;
DevExpress.data.utils.arrangeSortingInfo = require('../../data/store_helper').arrangeSortingInfo;

DevExpress.data.utils.normalizeDataSourceOptions = require('../../data/data_source/utils').normalizeDataSourceOptions;
