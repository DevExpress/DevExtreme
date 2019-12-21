var variableWrapper = require('../../core/utils/variable_wrapper'),
    dataCoreUtils = require('../../core/utils/data'),
    commonUtils = require('../../core/utils/common'),
    typeUtils = require('../../core/utils/type'),
    extend = require('../../core/utils/extend').extend,
    DataHelperMixin = require('../../data_helper'),
    DataSourceModule = require('../../data/data_source/data_source'),
    ArrayStore = require('../../data/array_store'),
    Deferred = require('../../core/utils/deferred').Deferred;

var DataExpressionMixin = extend({}, DataHelperMixin, {

    _dataExpressionDefaultOptions: function() {
        return {
            items: [],

            dataSource: null,

            itemTemplate: 'item',

            value: null,

            valueExpr: 'this',

            displayExpr: undefined
        };
    },

    _initDataExpressions: function() {
        this._compileValueGetter();
        this._compileDisplayGetter();
        this._initDynamicTemplates();
        this._initDataSource();
        this._itemsToDataSource();
    },

    _itemsToDataSource: function() {
        if(!this.option('dataSource')) {
            // TODO: try this.option("dataSource", new ...)
            this._dataSource = new DataSourceModule.DataSource({
                store: new ArrayStore(this.option('items')),
                pageSize: 0
            });
        }
    },

    _compileDisplayGetter: function() {
        this._displayGetter = dataCoreUtils.compileGetter(this._displayGetterExpr());
    },

    _displayGetterExpr: function() {
        return this.option('displayExpr');
    },

    _compileValueGetter: function() {
        this._valueGetter = dataCoreUtils.compileGetter(this._valueGetterExpr());
    },

    _valueGetterExpr: function() {
        return this.option('valueExpr') || 'this';
    },

    _loadValue: function(value) {
        var deferred = new Deferred();
        value = this._unwrappedValue(value);

        if(!typeUtils.isDefined(value)) {
            return deferred.reject().promise();
        }

        this._loadSingle(this._valueGetterExpr(), value)
            .done((function(item) {
                this._isValueEquals(this._valueGetter(item), value)
                    ? deferred.resolve(item)
                    : deferred.reject();
            }).bind(this))
            .fail(function() {
                deferred.reject();
            });

        return deferred.promise();
    },

    _getCurrentValue: function() {
        return this.option('value');
    },

    _unwrappedValue: function(value) {
        value = typeUtils.isDefined(value) ? value : this._getCurrentValue();

        if(value && this._dataSource && this._valueGetterExpr() === 'this') {
            value = this._getItemKey(value);
        }

        return variableWrapper.unwrap(value);
    },

    _getItemKey: function(value) {
        var key = this._dataSource.key();

        if(Array.isArray(key)) {
            var result = {};
            for(var i = 0, n = key.length; i < n; i++) {
                result[key[i]] = value[key[i]];
            }
            return result;
        }

        if(key && typeof value === 'object') {
            value = value[key];
        }

        return value;
    },

    _isValueEquals: function(value1, value2) {
        var dataSourceKey = this._dataSource && this._dataSource.key();

        var isDefined = typeUtils.isDefined;
        var result = this._compareValues(value1, value2);

        if(!result && dataSourceKey && isDefined(value1) && isDefined(value2)) {
            if(Array.isArray(dataSourceKey)) {
                result = this._compareByCompositeKey(value1, value2, dataSourceKey);
            } else {
                result = this._compareByKey(value1, value2, dataSourceKey);
            }
        }

        return result;
    },

    _compareByCompositeKey: function(value1, value2, key) {
        var isObject = typeUtils.isObject;

        if(!isObject(value1) || !isObject(value2)) {
            return false;
        }

        for(var i = 0, n = key.length; i < n; i++) {
            if(value1[key[i]] !== value2[key[i]]) {
                return false;
            }
        }

        return true;
    },

    _compareByKey: function(value1, value2, key) {
        var ensureDefined = commonUtils.ensureDefined;
        var unwrapObservable = variableWrapper.unwrap;
        var valueKey1 = ensureDefined(unwrapObservable(value1[key]), value1);
        var valueKey2 = ensureDefined(unwrapObservable(value2[key]), value2);

        return this._compareValues(valueKey1, valueKey2);
    },

    _compareValues: function(value1, value2) {
        return dataCoreUtils.toComparable(value1, true) === dataCoreUtils.toComparable(value2, true);
    },

    _initDynamicTemplates: commonUtils.noop,

    _setCollectionWidgetItemTemplate: function() {
        this._initDynamicTemplates();
        this._setCollectionWidgetOption('itemTemplate', this.option('itemTemplate'));
    },

    _getCollectionKeyExpr: function() {
        var valueExpr = this.option('valueExpr');
        var isValueExprField = typeUtils.isString(valueExpr) && valueExpr !== 'this' || typeUtils.isFunction(valueExpr);

        return isValueExprField ? valueExpr : null;
    },

    _dataExpressionOptionChanged: function(args) {
        switch(args.name) {
            case 'items':
                this._itemsToDataSource();
                this._setCollectionWidgetOption('items');
                break;
            case 'dataSource':
                this._initDataSource();
                break;
            case 'itemTemplate':
                this._setCollectionWidgetItemTemplate();
                break;
            case 'valueExpr':
                this._compileValueGetter();
                break;
            case 'displayExpr':
                this._compileDisplayGetter();
                this._initDynamicTemplates();
                this._setCollectionWidgetOption('displayExpr');
                break;
        }
    }
});

module.exports = DataExpressionMixin;
