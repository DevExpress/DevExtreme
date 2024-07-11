"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StateStoringController = void 0;
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _storage = require("../../../../core/utils/storage");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
const parseDates = function (state) {
  if (!state) return;
  (0, _iterator.each)(state, (key, value) => {
    if ((0, _type.isPlainObject)(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      const date = DATE_REGEX.exec(value);
      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};
const getStorage = function (options) {
  const storage = options.type === 'sessionStorage' ? (0, _storage.sessionStorage)() : (0, _window.getWindow)().localStorage;
  if (!storage) {
    throw new Error('E1007');
  }
  return storage;
};
const getUniqueStorageKey = function (options) {
  return (0, _type.isDefined)(options.storageKey) ? options.storageKey : 'storage';
};
class StateStoringController extends _m_modules.default.ViewController {
  // TODO getController
  // NOTE: sometimes fields empty in the runtime
  // getter here is a temporary solution
  getDataController() {
    return this.getController('data');
  }
  getExportController() {
    return this.getController('export');
  }
  getColumnsController() {
    return this.getController('columns');
  }
  init() {
    this._state = {};
    this._isLoaded = false;
    this._isLoading = false;
    this._windowUnloadHandler = () => {
      if (this._savingTimeoutID !== undefined) {
        this._saveState(this.state());
      }
    };
    _events_engine.default.on((0, _window.getWindow)(), 'unload', this._windowUnloadHandler);
    return this; // needed by pivotGrid mocks
  }
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
        super.optionChanged(args);
    }
  }
  dispose() {
    clearTimeout(this._savingTimeoutID);
    _events_engine.default.off((0, _window.getWindow)(), 'unload', this._windowUnloadHandler);
  }
  _loadState() {
    const options = this.option('stateStoring');
    if (options.type === 'custom') {
      return options.customLoad && options.customLoad();
    }
    try {
      // @ts-expect-error
      return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
    } catch (e) {
      _ui.default.log('W1022', 'State storing', e.message);
    }
  }
  _saveState(state) {
    const options = this.option('stateStoring');
    if (options.type === 'custom') {
      options.customSave && options.customSave(state);
      return;
    }
    try {
      getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
    } catch (e) {
      _ui.default.log(e.message);
    }
  }
  publicMethods() {
    return ['state'];
  }
  isEnabled() {
    return this.option('stateStoring.enabled');
  }
  isLoaded() {
    return this._isLoaded;
  }
  isLoading() {
    return this._isLoading;
  }
  load() {
    this._isLoading = true;
    const loadResult = (0, _deferred.fromPromise)(this._loadState());
    loadResult.always(() => {
      this._isLoaded = true;
      this._isLoading = false;
    }).done(state => {
      if (state !== null && !(0, _type.isEmptyObject)(state)) {
        this.state(state);
      }
    });
    return loadResult;
  }
  state(state) {
    const that = this;
    if (!arguments.length) {
      return (0, _extend.extend)(true, {}, that._state);
    }
    that._state = (0, _extend.extend)({}, state);
    parseDates(that._state);
  }
  save() {
    const that = this;
    clearTimeout(that._savingTimeoutID);
    that._savingTimeoutID = setTimeout(() => {
      that._saveState(that.state());
      that._savingTimeoutID = undefined;
    }, that.option('stateStoring.savingTimeout'));
  }
}
exports.StateStoringController = StateStoringController;
var _default = exports.default = {
  StateStoringController
};