import { errors, handleError } from '@js/common/data/errors';
import storeHelper from '@js/common/data/store_helper';
import { processRequestResultLock } from '@js/common/data/utils';
import Class from '@js/core/class';
import { EventsStrategy } from '@js/core/events_strategy';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isEmptyObject } from '@js/core/utils/type';

const { abstract } = Class;
const { queryByOptions } = storeHelper;

const storeImpl = {};

const Store = Class.inherit({
  _langParams: {},
  ctor(options) {
    const that = this;
    options = options || {};
    this._eventsStrategy = new EventsStrategy(this);

    each(
      [
        'onLoaded',

        'onLoading',

        'onInserted',

        'onInserting',

        'onUpdated',

        'onUpdating',

        'onPush',

        'onRemoved',

        'onRemoving',

        'onModified',

        'onModifying',
      ],
      (_, optionName) => {
        if (optionName in options) {
          that.on(optionName.slice(2).toLowerCase(), options[optionName]);
        }
      },
    );

    this._key = options.key;

    this._errorHandler = options.errorHandler;

    this._useDefaultSearch = true;
  },

  _clearCache: noop,

  _customLoadOptions() {
    return null;
  },

  key() {
    return this._key;
  },

  keyOf(obj) {
    if (!this._keyGetter) {
      this._keyGetter = compileGetter(this.key());
    }

    return this._keyGetter(obj);
  },

  _requireKey() {
    if (!this.key()) {
      throw errors.Error('E4005');
    }
  },
  load(options) {
    const that = this;

    options = options || {};

    this._eventsStrategy.fireEvent('loading', [options]);

    return this._withLock(this._loadImpl(options)).done((result) => {
      that._eventsStrategy.fireEvent('loaded', [result, options]);
    });
  },

  _loadImpl(options) {
    if (!isEmptyObject(this._langParams)) {
      options = options || {};
      options._langParams = { ...this._langParams, ...options._langParams };
    }
    // @ts-expect-error
    return queryByOptions(this.createQuery(options), options).enumerate();
  },

  _withLock(task) {
    // @ts-expect-error
    const result = new Deferred();

    task.done(function () {
      const that = this;
      const args = arguments;

      processRequestResultLock
        .promise()
        .done(() => {
          result.resolveWith(that, args);
        });
    }).fail(function () {
      result.rejectWith(this, arguments);
    });

    return result;
  },

  createQuery: abstract,

  totalCount(options) {
    return this._totalCountImpl(options);
  },

  _totalCountImpl(options) {
    return queryByOptions(this.createQuery(options), options, true).count();
  },

  byKey(key, extraOptions) {
    return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
  },

  _byKeyImpl: abstract,

  insert(values) {
    const that = this;

    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('inserting', [values]);

    return that._addFailHandlers(that._insertImpl(values).done((callbackValues, callbackKey) => {
      that._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },

  _insertImpl: abstract,

  update(key, values) {
    const that = this;

    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('updating', [key, values]);

    return that._addFailHandlers(that._updateImpl(key, values).done(() => {
      that._eventsStrategy.fireEvent('updated', [key, values]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },

  _updateImpl: abstract,

  push(changes) {
    const beforePushArgs = {
      changes,
      waitFor: [],
    };

    this._eventsStrategy.fireEvent('beforePushAggregation', [beforePushArgs]);

    when(...beforePushArgs.waitFor).done(() => {
      this._pushImpl(changes);
      this._eventsStrategy.fireEvent('beforePush', [{ changes }]);
      this._eventsStrategy.fireEvent('push', [changes]);
    });
  },

  _pushImpl: noop,

  remove(key) {
    const that = this;

    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('removing', [key]);

    return that._addFailHandlers(that._removeImpl(key).done((callbackKey) => {
      that._eventsStrategy.fireEvent('removed', [callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },

  _removeImpl: abstract,

  _addFailHandlers(deferred) {
    return deferred.fail(this._errorHandler).fail(handleError);
  },

  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  },

  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  },
});
// @ts-expect-error
Store.create = function (alias, options) {
  if (!(alias in storeImpl)) {
    throw errors.Error('E4020', alias);
  }

  return new storeImpl[alias](options);
};
// @ts-expect-error
Store.registerClass = function (type, alias) {
  if (alias) {
    storeImpl[alias] = type;
  }
  return type;
};
Store.inherit = (function (inheritor) {
  return function (members, alias) {
    const type = inheritor.apply(this, [members]);
    // @ts-expect-error
    Store.registerClass(type, alias);
    return type;
  };
}(Store.inherit));

export default Store;
