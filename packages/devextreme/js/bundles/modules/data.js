/* eslint-disable import/no-commonjs */
const DevExpress = require('./core');
const errors = require('../../core/errors');

module.exports = DevExpress.data = DevExpress.data || {};

Object.defineProperty(DevExpress.data, 'errorHandler', {
    get: function() {
        return require('../../common/data').errorHandler;
    },
    set: function(value) {
        errors.log('W0003', 'DevExpress.data', 'errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead');
        require('../../common/data/errors').setErrorHandler(value);
    }
});

// TODO: try remove (plugins failed without this)
Object.defineProperty(DevExpress.data, '_errorHandler', {
    get: function() {
        return require('../../common/data/errors').handleError;
    },
    set: function(value) {
        errors.log('W0003', 'DevExpress.data', '_errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead');
        require('../../common/data/errors').setErrorHandler(value);
    }
});

DevExpress.data.setErrorHandler = require('../../common/data/errors').setErrorHandler;
DevExpress.data.DataSource = require('../../common/data/data_source');
DevExpress.data.query = require('../../common/data/query');
DevExpress.data.Store = require('../../data/abstract_store');
DevExpress.data.ArrayStore = require('../../common/data/array_store');
DevExpress.data.CustomStore = require('../../common/data/custom_store').CustomStore;
DevExpress.data.LocalStore = require('../../common/data/local_store');
DevExpress.data.base64_encode = require('../../common/data/utils').base64_encode;
DevExpress.data.applyChanges = require('../../common/data/apply_changes');

DevExpress.data.Guid = require('../../core/guid');

DevExpress.data.utils = {};
DevExpress.data.utils.compileGetter = require('../../core/utils/data').compileGetter;
DevExpress.data.utils.compileSetter = require('../../core/utils/data').compileSetter;

DevExpress.EndpointSelector = require('../../common/data/endpoint_selector');

DevExpress.data.queryImpl = require('../../common/data/query_implementation').queryImpl;
DevExpress.data.queryAdapters = require('../../common/data/query_adapters');

const dataUtils = require('../../common/data/utils');

DevExpress.data.utils.normalizeBinaryCriterion = dataUtils.normalizeBinaryCriterion;
DevExpress.data.utils.normalizeSortingInfo = dataUtils.normalizeSortingInfo;
DevExpress.data.utils.errorMessageFromXhr = dataUtils.errorMessageFromXhr;
DevExpress.data.utils.aggregators = dataUtils.aggregators;
DevExpress.data.utils.keysEqual = dataUtils.keysEqual;
DevExpress.data.utils.isDisjunctiveOperator = dataUtils.isDisjunctiveOperator;
DevExpress.data.utils.isConjunctiveOperator = dataUtils.isConjunctiveOperator;
DevExpress.data.utils.processRequestResultLock = dataUtils.processRequestResultLock;

DevExpress.data.utils.toComparable = require('../../core/utils/data').toComparable;

DevExpress.data.utils.multiLevelGroup = require('../../common/data/store_helper').multiLevelGroup;
DevExpress.data.utils.arrangeSortingInfo = require('../../common/data/store_helper').arrangeSortingInfo;

DevExpress.data.utils.normalizeDataSourceOptions = require('../../common/data/data_source/utils').normalizeDataSourceOptions;
