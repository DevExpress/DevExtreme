"use strict";

exports.Options = void 0;
var _type = require("../utils/type");
var _common = require("../utils/common");
var _option_manager = require("./option_manager");
var _data = require("../utils/data");
var _utils = require("./utils");
var _extend = require("../utils/extend");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class Options {
  constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
    this._deprecatedCallback;
    this._startChangeCallback;
    this._endChangeCallback;
    this._default = defaultOptions;
    this._deprecated = deprecatedOptions;
    this._deprecatedNames = [];
    this._initDeprecatedNames();
    this._optionManager = new _option_manager.OptionManager(options, optionsByReference);
    this._optionManager.onRelevantNamesPrepared((options, name, value, silent) => this._setRelevantNames(options, name, value, silent));
    this._cachedOptions = {};
    this._rules = [];
  }
  set _initial(value) {
    this._initialOptions = value;
  }
  get _initial() {
    if (!this._initialOptions) {
      const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));
      this._initialOptions = this._default;
      this._optionManager._setByReference(this._initialOptions, rulesOptions);
    }
    return this._initialOptions;
  }
  _initDeprecatedNames() {
    for (const optionName in this._deprecated) {
      this._deprecatedNames.push(optionName);
    }
  }
  _getByRules(rules) {
    rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;
    return (0, _utils.convertRulesToOptions)(rules);
  }
  _notifyDeprecated(option) {
    const info = this._deprecated[option];
    if (info) {
      this._deprecatedCallback(option, info);
    }
  }
  _setRelevantNames(options, name, value, silent) {
    if (name) {
      const normalizedName = this._normalizeName(name, silent);
      if (normalizedName && normalizedName !== name) {
        this._setField(options, normalizedName, value);
        this._clearField(options, name);
      }
    }
  }
  _setField(options, fullName, value) {
    let fieldName = '';
    let fieldObject = null;
    do {
      fieldName = fieldName ? `.${fieldName}` : '';
      fieldName = (0, _utils.getFieldName)(fullName) + fieldName;
      fullName = (0, _utils.getParentName)(fullName);
      fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options;
    } while (!fieldObject);
    fieldObject[fieldName] = value;
  }
  _clearField(options, name) {
    delete options[name];
    const previousFieldName = (0, _utils.getParentName)(name);
    const fieldObject = previousFieldName ? this._optionManager.get(options, previousFieldName, false) : options;
    if (fieldObject) {
      delete fieldObject[(0, _utils.getFieldName)(name)];
    }
  }
  _normalizeName(name, silent) {
    if (this._deprecatedNames.length && name) {
      for (let i = 0; i < this._deprecatedNames.length; i++) {
        if (this._deprecatedNames[i] === name) {
          const deprecate = this._deprecated[name];
          if (deprecate) {
            !silent && this._notifyDeprecated(name);
            return deprecate.alias || name;
          }
        }
      }
    }
    return name;
  }
  addRules(rules) {
    this._rules = rules.concat(this._rules);
  }
  applyRules(rules) {
    const options = this._getByRules(rules);
    this.silent(options);
  }
  dispose() {
    this._deprecatedCallback = _common.noop;
    this._startChangeCallback = _common.noop;
    this._endChangeCallback = _common.noop;
    this._optionManager.dispose();
  }
  onChanging(callBack) {
    this._optionManager.onChanging(callBack);
  }
  onChanged(callBack) {
    this._optionManager.onChanged(callBack);
  }
  onDeprecated(callBack) {
    this._deprecatedCallback = callBack;
  }
  onStartChange(callBack) {
    this._startChangeCallback = callBack;
  }
  onEndChange(callBack) {
    this._endChangeCallback = callBack;
  }
  isInitial(name) {
    const value = this.silent(name);
    const initialValue = this.initial(name);
    const areFunctions = (0, _type.isFunction)(value) && (0, _type.isFunction)(initialValue);
    return areFunctions ? value.toString() === initialValue.toString() : (0, _common.equalByValue)(value, initialValue);
  }
  initial(name) {
    return (0, _utils.getNestedOptionValue)(this._initial, name);
  }
  option(options, value) {
    const isGetter = arguments.length < 2 && (0, _type.type)(options) !== 'object';
    if (isGetter) {
      return this._optionManager.get(undefined, this._normalizeName(options));
    } else {
      this._startChangeCallback();
      try {
        this._optionManager.set(options, value);
      } finally {
        this._endChangeCallback();
      }
    }
  }
  silent(options, value) {
    const isGetter = arguments.length < 2 && (0, _type.type)(options) !== 'object';
    if (isGetter) {
      return this._optionManager.get(undefined, options, undefined, true);
    } else {
      this._optionManager.set(options, value, undefined, true);
    }
  }
  reset(name) {
    if (name) {
      const fullPath = (0, _data.getPathParts)(name);
      const value = fullPath.reduce((value, field) => value ? value[field] : this.initial(field), null);
      const defaultValue = (0, _type.isObject)(value) ? _extends({}, value) : value;
      this._optionManager.set(name, defaultValue, false);
    }
  }
  getAliasesByName(name) {
    return Object.keys(this._deprecated).filter(aliasName => name === this._deprecated[aliasName].alias);
  }
  isDeprecated(name) {
    return Object.prototype.hasOwnProperty.call(this._deprecated, name);
  }
  cache(name, options) {
    const isGetter = arguments.length < 2;
    if (isGetter) {
      return this._cachedOptions[name];
    } else {
      this._cachedOptions[name] = (0, _extend.extend)(this._cachedOptions[name], options);
    }
  }
}
exports.Options = Options;