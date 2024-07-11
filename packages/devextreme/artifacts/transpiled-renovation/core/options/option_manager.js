"use strict";

exports.OptionManager = void 0;
var _data = require("../utils/data");
var _common = require("../utils/common");
var _comparator = require("../utils/comparator");
var _extend = require("../utils/extend");
var _type = require("../utils/type");
var _utils = require("./utils");
const cachedGetters = {};
const cachedSetters = {};
class OptionManager {
  constructor(options, optionsByReference) {
    this._options = options;
    this._optionsByReference = optionsByReference;
    this._changingCallback;
    this._changedCallback;
    this._namePreparedCallbacks;
  }
  _setByReference(options, rulesOptions) {
    (0, _extend.extend)(true, options, rulesOptions);
    for (const fieldName in this._optionsByReference) {
      if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
        options[fieldName] = rulesOptions[fieldName];
      }
    }
  }
  _setPreparedValue(name, value, merge, silent) {
    const previousValue = this.get(this._options, name, false);
    if (!(0, _comparator.equals)(previousValue, value)) {
      const path = (0, _data.getPathParts)(name);
      !silent && this._changingCallback(name, previousValue, value);
      cachedSetters[name] = cachedSetters[name] || (0, _data.compileSetter)(name);
      cachedSetters[name](this._options, value, {
        functionsAsIs: true,
        merge: (0, _type.isDefined)(merge) ? merge : !this._optionsByReference[name],
        unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
      });
      !silent && this._changedCallback(name, value, previousValue);
    }
  }
  _prepareRelevantNames(options, name, value, silent) {
    if ((0, _type.isPlainObject)(value)) {
      for (const valueName in value) {
        this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
      }
    }
    this._namePreparedCallbacks(options, name, value, silent);
  }
  get() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._options;
    let name = arguments.length > 1 ? arguments[1] : undefined;
    let unwrapObservables = arguments.length > 2 ? arguments[2] : undefined;
    cachedGetters[name] = cachedGetters[name] || (0, _data.compileGetter)(name);
    return cachedGetters[name](options, {
      functionsAsIs: true,
      unwrapObservables
    });
  }
  set(options, value, merge, silent) {
    options = (0, _utils.normalizeOptions)(options, value);
    for (const name in options) {
      this._prepareRelevantNames(options, name, options[name], silent);
    }
    for (const name in options) {
      this._setPreparedValue(name, options[name], merge, silent);
    }
  }
  onRelevantNamesPrepared(callBack) {
    this._namePreparedCallbacks = callBack;
  }
  onChanging(callBack) {
    this._changingCallback = callBack;
  }
  onChanged(callBack) {
    this._changedCallback = callBack;
  }
  dispose() {
    this._changingCallback = _common.noop;
    this._changedCallback = _common.noop;
  }
}
exports.OptionManager = OptionManager;