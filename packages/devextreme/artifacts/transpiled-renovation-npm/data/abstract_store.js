"use strict";

exports.default = void 0;
var _class = _interopRequireDefault(require("../core/class"));
var _events_strategy = require("../core/events_strategy");
var _iterator = require("../core/utils/iterator");
var _errors = require("./errors");
var _utils = require("./utils");
var _data = require("../core/utils/data");
var _store_helper = _interopRequireDefault(require("./store_helper"));
var _deferred = require("../core/utils/deferred");
var _common = require("../core/utils/common");
var _type = require("../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const abstract = _class.default.abstract;
const queryByOptions = _store_helper.default.queryByOptions;
const storeImpl = {};
const Store = _class.default.inherit({
  _langParams: {},
  ctor: function (options) {
    const that = this;
    options = options || {};
    this._eventsStrategy = new _events_strategy.EventsStrategy(this);
    (0, _iterator.each)(['onLoaded', 'onLoading', 'onInserted', 'onInserting', 'onUpdated', 'onUpdating', 'onPush', 'onRemoved', 'onRemoving', 'onModified', 'onModifying'], function (_, optionName) {
      if (optionName in options) {
        that.on(optionName.slice(2).toLowerCase(), options[optionName]);
      }
    });
    this._key = options.key;
    this._errorHandler = options.errorHandler;
    this._useDefaultSearch = true;
  },
  _clearCache: _common.noop,
  _customLoadOptions: function () {
    return null;
  },
  key: function () {
    return this._key;
  },
  keyOf: function (obj) {
    if (!this._keyGetter) {
      this._keyGetter = (0, _data.compileGetter)(this.key());
    }
    return this._keyGetter(obj);
  },
  _requireKey: function () {
    if (!this.key()) {
      throw _errors.errors.Error('E4005');
    }
  },
  load: function (options) {
    const that = this;
    options = options || {};
    this._eventsStrategy.fireEvent('loading', [options]);
    return this._withLock(this._loadImpl(options)).done(function (result) {
      that._eventsStrategy.fireEvent('loaded', [result, options]);
    });
  },
  _loadImpl: function (options) {
    if (!(0, _type.isEmptyObject)(this._langParams)) {
      options = options || {};
      options._langParams = _extends({}, this._langParams, options._langParams);
    }
    return queryByOptions(this.createQuery(options), options).enumerate();
  },
  _withLock: function (task) {
    const result = new _deferred.Deferred();
    task.done(function () {
      const that = this;
      const args = arguments;
      _utils.processRequestResultLock.promise().done(function () {
        result.resolveWith(that, args);
      });
    }).fail(function () {
      result.rejectWith(this, arguments);
    });
    return result;
  },
  createQuery: abstract,
  totalCount: function (options) {
    return this._totalCountImpl(options);
  },
  _totalCountImpl: function (options) {
    return queryByOptions(this.createQuery(options), options, true).count();
  },
  byKey: function (key, extraOptions) {
    return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
  },
  _byKeyImpl: abstract,
  insert: function (values) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('inserting', [values]);
    return that._addFailHandlers(that._insertImpl(values).done(function (callbackValues, callbackKey) {
      that._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _insertImpl: abstract,
  update: function (key, values) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('updating', [key, values]);
    return that._addFailHandlers(that._updateImpl(key, values).done(function () {
      that._eventsStrategy.fireEvent('updated', [key, values]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _updateImpl: abstract,
  push: function (changes) {
    const beforePushArgs = {
      changes,
      waitFor: []
    };
    this._eventsStrategy.fireEvent('beforePushAggregation', [beforePushArgs]);
    (0, _deferred.when)(...beforePushArgs.waitFor).done(() => {
      this._pushImpl(changes);
      this._eventsStrategy.fireEvent('beforePush', [{
        changes
      }]);
      this._eventsStrategy.fireEvent('push', [changes]);
    });
  },
  _pushImpl: _common.noop,
  remove: function (key) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('removing', [key]);
    return that._addFailHandlers(that._removeImpl(key).done(function (callbackKey) {
      that._eventsStrategy.fireEvent('removed', [callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _removeImpl: abstract,
  _addFailHandlers: function (deferred) {
    return deferred.fail(this._errorHandler).fail(_errors.handleError);
  },
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  },
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
});
Store.create = function (alias, options) {
  if (!(alias in storeImpl)) {
    throw _errors.errors.Error('E4020', alias);
  }
  return new storeImpl[alias](options);
};
Store.registerClass = function (type, alias) {
  if (alias) {
    storeImpl[alias] = type;
  }
  return type;
};
Store.inherit = function (inheritor) {
  return function (members, alias) {
    const type = inheritor.apply(this, [members]);
    Store.registerClass(type, alias);
    return type;
  };
}(Store.inherit);
var _default = exports.default = Store;
module.exports = exports.default;
module.exports.default = exports.default;