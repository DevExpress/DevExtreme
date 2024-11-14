import ArrayStore from '@js/common/data/array_store';
import DataHelperMixin from '@js/common/data/data_helper';
import DataSource from '@js/common/data/data_source';
import { ensureDefined, noop } from '@js/core/utils/common';
import {
  compileGetter,
  toComparable,
} from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  isDefined, isFunction, isObject as isObjectType, isString,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';

const DataExpressionMixin = extend({}, DataHelperMixin, {

  _dataExpressionDefaultOptions() {
    return {
      items: [],

      dataSource: null,

      itemTemplate: 'item',

      value: null,

      valueExpr: 'this',

      displayExpr: undefined,
    };
  },

  _initDataExpressions() {
    this._compileValueGetter();
    this._compileDisplayGetter();
    this._initDynamicTemplates();
    this._initDataSource();
    this._itemsToDataSource();
  },

  _itemsToDataSource() {
    if (!this.option('dataSource')) {
      // TODO: try this.option("dataSource", new ...)
      this._dataSource = new DataSource({
        store: new ArrayStore(this.option('items')),
        pageSize: 0,
      });
      this._initDataController();
    }
  },

  _compileDisplayGetter() {
    this._displayGetter = compileGetter(this._displayGetterExpr());
  },

  _displayGetterExpr() {
    return this.option('displayExpr');
  },

  _compileValueGetter() {
    this._valueGetter = compileGetter(this._valueGetterExpr());
  },

  _valueGetterExpr() {
    return this.option('valueExpr') || 'this';
  },

  _loadValue(value) {
    const deferred = Deferred();
    value = this._unwrappedValue(value);

    if (!isDefined(value)) {
      return deferred.reject().promise();
    }

    this._loadSingle(this._valueGetterExpr(), value)
      .done((item) => {
        this._isValueEquals(this._valueGetter(item), value)
          ? deferred.resolve(item)
          : deferred.reject();
      })
      .fail(() => {
        deferred.reject();
      });

    this._loadValueDeferred = deferred;
    return deferred.promise();
  },

  _rejectValueLoading() {
    this._loadValueDeferred?.reject({ shouldSkipCallback: true });
  },

  _getCurrentValue() {
    return this.option('value');
  },

  _unwrappedValue(value) {
    value = value ?? this._getCurrentValue();

    if (value && this._dataSource && this._valueGetterExpr() === 'this') {
      value = this._getItemKey(value);
    }

    return variableWrapper.unwrap(value);
  },

  _getItemKey(value) {
    const key = this._dataSource.key();

    if (Array.isArray(key)) {
      const result = {};
      for (let i = 0, n = key.length; i < n; i++) {
        result[key[i]] = value[key[i]];
      }
      return result;
    }

    if (key && typeof value === 'object') {
      value = value[key];
    }

    return value;
  },

  _isValueEquals(value1, value2) {
    const dataSourceKey = this._dataSource && this._dataSource.key();

    let result = this._compareValues(value1, value2);

    if (!result && dataSourceKey && isDefined(value1) && isDefined(value2)) {
      if (Array.isArray(dataSourceKey)) {
        result = this._compareByCompositeKey(value1, value2, dataSourceKey);
      } else {
        result = this._compareByKey(value1, value2, dataSourceKey);
      }
    }

    return result;
  },

  _compareByCompositeKey(value1, value2, key) {
    const isObject = isObjectType;

    if (!isObject(value1) || !isObject(value2)) {
      return false;
    }

    for (let i = 0, n = key.length; i < n; i++) {
      if (value1[key[i]] !== value2[key[i]]) {
        return false;
      }
    }

    return true;
  },

  _compareByKey(value1, value2, key) {
    const unwrapObservable = variableWrapper.unwrap;
    const valueKey1 = ensureDefined(unwrapObservable(value1[key]), value1);
    const valueKey2 = ensureDefined(unwrapObservable(value2[key]), value2);

    return this._compareValues(valueKey1, valueKey2);
  },

  _compareValues(value1, value2) {
    return toComparable(value1, true) === toComparable(value2, true);
  },

  _initDynamicTemplates: noop,

  _setCollectionWidgetItemTemplate() {
    this._initDynamicTemplates();
    this._setCollectionWidgetOption('itemTemplate', this.option('itemTemplate'));
  },

  _getCollectionKeyExpr() {
    const valueExpr = this.option('valueExpr');
    const isValueExprField = isString(valueExpr) && valueExpr !== 'this' || isFunction(valueExpr);

    return isValueExprField ? valueExpr : null;
  },

  _dataExpressionOptionChanged(args) {
    // eslint-disable-next-line default-case
    switch (args.name) {
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
  },
});

export default DataExpressionMixin;
