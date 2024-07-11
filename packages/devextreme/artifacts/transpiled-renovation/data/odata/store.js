"use strict";

exports.default = void 0;
var _type = require("../../core/utils/type");
var _config = _interopRequireDefault(require("../../core/config"));
var _utils = require("./utils");
var _errors = require("../errors");
var _query = _interopRequireDefault(require("../query"));
var _abstract_store = _interopRequireDefault(require("../abstract_store"));
var _request_dispatcher = _interopRequireDefault(require("./request_dispatcher"));
var _deferred = require("../../core/utils/deferred");
require("./query_adapter");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ANONYMOUS_KEY_NAME = '5d46402c-7899-4ea9-bd81-8b73c47c7683';
const expandKeyType = (key, keyType) => ({
  [key]: keyType
});
const mergeFieldTypesWithKeyType = (fieldTypes, keyType) => {
  const result = {};
  for (const field in fieldTypes) {
    result[field] = fieldTypes[field];
  }
  for (const keyName in keyType) {
    if (keyName in result) {
      if (result[keyName] !== keyType[keyName]) {
        _errors.errors.log('W4001', keyName);
      }
    } else {
      result[keyName] = keyType[keyName];
    }
  }
  return result;
};
const ODataStore = _abstract_store.default.inherit({
  ctor(options) {
    this.callBase(options);
    this._requestDispatcher = new _request_dispatcher.default(options);
    let key = this.key();
    let fieldTypes = options.fieldTypes;
    let keyType = options.keyType;
    if (keyType) {
      const keyTypeIsString = typeof keyType === 'string';
      if (!key) {
        key = keyTypeIsString ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
        this._legacyAnonymousKey = key;
      }
      if (keyTypeIsString) {
        keyType = expandKeyType(key, keyType);
      }
      fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, keyType);
    }
    this._fieldTypes = fieldTypes || {};
    if (this.version() === 2) {
      this._updateMethod = 'MERGE';
    } else {
      this._updateMethod = 'PATCH';
    }
  },
  _customLoadOptions() {
    return ['expand', 'customQueryParams'];
  },
  _byKeyImpl(key, extraOptions) {
    const params = {};
    if (extraOptions) {
      params['$expand'] = (0, _utils.generateExpand)(this.version(), extraOptions.expand, extraOptions.select) || undefined;
      params['$select'] = (0, _utils.generateSelect)(this.version(), extraOptions.select) || undefined;
    }
    return this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'GET', params);
  },
  createQuery(loadOptions) {
    let url;
    const queryOptions = {
      adapter: 'odata',
      beforeSend: this._requestDispatcher.beforeSend,
      errorHandler: this._errorHandler,
      jsonp: this._requestDispatcher.jsonp,
      version: this._requestDispatcher.version,
      withCredentials: this._requestDispatcher._withCredentials,
      expand: loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.expand,
      requireTotalCount: loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.requireTotalCount,
      deserializeDates: this._requestDispatcher._deserializeDates,
      fieldTypes: this._fieldTypes
    };

    // NOTE: For AppBuilder, do not remove
    url = (loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.urlOverride) ?? this._requestDispatcher.url;
    if ((0, _type.isDefined)(this._requestDispatcher.filterToLower)) {
      queryOptions.filterToLower = this._requestDispatcher.filterToLower;
    }
    if (loadOptions !== null && loadOptions !== void 0 && loadOptions.customQueryParams) {
      const params = (0, _utils.escapeServiceOperationParams)(loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.customQueryParams, this.version());
      if (this.version() === 4) {
        url = (0, _utils.formatFunctionInvocationUrl)(url, params);
      } else {
        queryOptions.params = params;
      }
    }
    return (0, _query.default)(url, queryOptions);
  },
  _insertImpl(values) {
    this._requireKey();
    const d = new _deferred.Deferred();
    (0, _deferred.when)(this._requestDispatcher.sendRequest(this._requestDispatcher.url, 'POST', null, values)).done(serverResponse => d.resolve(serverResponse && !(0, _config.default)().useLegacyStoreResult ? serverResponse : values, this.keyOf(serverResponse))).fail(d.reject);
    return d.promise();
  },
  _updateImpl(key, values) {
    const d = new _deferred.Deferred();
    (0, _deferred.when)(this._requestDispatcher.sendRequest(this._byKeyUrl(key), this._updateMethod, null, values)).done(serverResponse => (0, _config.default)().useLegacyStoreResult ? d.resolve(key, values) : d.resolve(serverResponse || values, key)).fail(d.reject);
    return d.promise();
  },
  _removeImpl(key) {
    const d = new _deferred.Deferred();
    (0, _deferred.when)(this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'DELETE')).done(() => d.resolve(key)).fail(d.reject);
    return d.promise();
  },
  _convertKey(value) {
    let result = value;
    const fieldTypes = this._fieldTypes;
    const key = this.key() || this._legacyAnonymousKey;
    if (Array.isArray(key)) {
      result = {};
      for (let i = 0; i < key.length; i++) {
        const keyName = key[i];
        result[keyName] = (0, _utils.convertPrimitiveValue)(fieldTypes[keyName], value[keyName]);
      }
    } else if (fieldTypes[key]) {
      result = (0, _utils.convertPrimitiveValue)(fieldTypes[key], value);
    }
    return result;
  },
  _byKeyUrl(value) {
    const baseUrl = this._requestDispatcher.url;
    const convertedKey = this._convertKey(value);
    return `${baseUrl}(${encodeURIComponent((0, _utils.serializeKey)(convertedKey, this.version()))})`;
  },
  version() {
    return this._requestDispatcher.version;
  }
}, 'odata');
var _default = exports.default = ODataStore;
module.exports = exports.default;
module.exports.default = exports.default;