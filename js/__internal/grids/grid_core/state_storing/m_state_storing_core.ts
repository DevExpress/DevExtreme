// @ts-expect-error
import { fromPromise } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { sessionStorage } from '@js/core/utils/storage';
import { isDefined, isEmptyObject, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import eventsEngine from '@js/events/core/events_engine';
import errors from '@js/ui/widget/ui.errors';

import modules from '../m_modules';

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const parseDates = function (state) {
  if (!state) return;
  each(state, (key, value) => {
    if (isPlainObject(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      const date = DATE_REGEX.exec(value);
      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};

const StateStoringController = modules.ViewController.inherit((function () {
  const getStorage = function (options) {
    const storage = options.type === 'sessionStorage' ? sessionStorage() : getWindow().localStorage;

    if (!storage) {
      throw new Error('E1007');
    }

    return storage;
  };

  const getUniqueStorageKey = function (options) {
    return isDefined(options.storageKey) ? options.storageKey : 'storage';
  };

  return {
    _loadState() {
      const options = this.option('stateStoring');

      if (options.type === 'custom') {
        return options.customLoad && options.customLoad();
      }
      try {
        // @ts-expect-error
        return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
      } catch (e: any) {
        errors.log(e.message);
      }
    },

    _saveState(state) {
      const options = this.option('stateStoring');

      if (options.type === 'custom') {
        options.customSave && options.customSave(state);
        return;
      }
      try {
        getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
      } catch (e: any) {
        errors.log(e.message);
      }
    },

    publicMethods() {
      return ['state'];
    },

    isEnabled() {
      return this.option('stateStoring.enabled');
    },

    init() {
      const that = this;

      that._state = {};
      that._isLoaded = false;
      that._isLoading = false;

      that._windowUnloadHandler = function () {
        if (that._savingTimeoutID !== undefined) {
          that._saveState(that.state());
        }
      };

      eventsEngine.on(getWindow(), 'unload', that._windowUnloadHandler);

      return that;
    },

    isLoaded() {
      return this._isLoaded;
    },

    isLoading() {
      return this._isLoading;
    },

    load() {
      this._isLoading = true;
      const loadResult = fromPromise(this._loadState());
      loadResult.always(() => {
        this._isLoaded = true;
        this._isLoading = false;
      }).done((state) => {
        if (state !== null && !isEmptyObject(state)) {
          this.state(state);
        }
      });
      return loadResult;
    },

    state(state) {
      const that = this;

      if (!arguments.length) {
        return extend(true, {}, that._state);
      }
      that._state = extend({}, state);
      parseDates(that._state);
    },

    save() {
      const that = this;

      clearTimeout(that._savingTimeoutID);
      that._savingTimeoutID = setTimeout(() => {
        that._saveState(that.state());
        that._savingTimeoutID = undefined;
      }, that.option('stateStoring.savingTimeout'));
    },

    optionChanged(args) {
      const that = this;

      switch (args.name) {
        case 'stateStoring':
          if (that.isEnabled() && !that.isLoading()) {
            that.load();
          }

          args.handled = true;
          break;
        default:
          that.callBase(args);
      }
    },

    dispose() {
      clearTimeout(this._savingTimeoutID);
      eventsEngine.off(getWindow(), 'unload', this._windowUnloadHandler);
    },
  };
})());

export default { StateStoringController };
