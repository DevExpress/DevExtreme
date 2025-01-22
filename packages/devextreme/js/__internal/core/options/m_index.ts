import { OptionManager } from '@js/core/options/option_manager';
import {
  convertRulesToOptions, getFieldName, getNestedOptionValue, getParentName,
} from '@js/core/options/utils';
import { equalByValue, noop } from '@js/core/utils/common';
import { getPathParts } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isFunction, isObject, type } from '@js/core/utils/type';

export class Options {
  _deprecatedCallback: any;

  _startChangeCallback: any;

  _endChangeCallback: any;

  _validateOptionsCallback: any;

  _default: any;

  _deprecated: any;

  _deprecatedNames: any[];

  _optionManager: OptionManager;

  _cachedOptions: Record<string, any>;

  _rules: any[];

  _initialOptions: any;

  constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
    this._deprecatedCallback;
    this._startChangeCallback;
    this._endChangeCallback;
    this._validateOptionsCallback;

    this._default = defaultOptions;
    this._deprecated = deprecatedOptions;

    this._deprecatedNames = [];
    this._initDeprecatedNames();

    this._optionManager = new OptionManager(
      options,
      optionsByReference,
    );
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

    return convertRulesToOptions(rules);
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
    let fieldObject: any = null;

    do {
      fieldName = fieldName ? `.${fieldName}` : '';
      fieldName = getFieldName(fullName) + fieldName;
      fullName = getParentName(fullName);
      fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options;
    } while (!fieldObject);

    fieldObject[fieldName] = value;
  }

  _clearField(options, name) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete options[name];

    const previousFieldName = getParentName(name);
    const fieldObject = previousFieldName
      ? this._optionManager.get(options, previousFieldName, false)
      : options;

    if (fieldObject) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete fieldObject[getFieldName(name)];
    }
  }

  _normalizeName(name, silent?: boolean) {
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
    this._deprecatedCallback = noop;
    this._startChangeCallback = noop;
    this._endChangeCallback = noop;
    this._optionManager.dispose();
  }

  onChanging(callBack) {
    this._optionManager.onChanging(callBack);
  }

  onChanged(callBack) {
    this._optionManager.onChanged(callBack);
  }

  validateOptions(callBack) {
    this._optionManager.onValidateOptions(callBack);
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
    const areFunctions = isFunction(value) && isFunction(initialValue);

    return areFunctions
      ? value.toString() === initialValue.toString()
      : equalByValue(value, initialValue);
  }

  initial(name): any {
    return getNestedOptionValue(this._initial, name);
  }

  option(options, value) {
    const isGetter = arguments.length < 2 && type(options) !== 'object';

    if (isGetter) {
      return this._optionManager.get(undefined, this._normalizeName(options));
    }
    this._startChangeCallback();
    try {
      this._optionManager.set(options, value);
    } finally {
      this._endChangeCallback();
    }
  }

  silent(options, value?: unknown) {
    const isGetter = arguments.length < 2 && type(options) !== 'object';

    if (isGetter) {
      // @ts-expect-error more args than needed
      return this._optionManager.get(undefined, options, undefined, true);
    }
    this._optionManager.set(options, value, undefined, true);
  }

  reset(name) {
    if (name) {
      const fullPath = getPathParts(name);
      const value = fullPath.reduce((value: any, field) => (value ? value[field] : this.initial(field)), null);

      const defaultValue = isObject(value) ? { ...value } : value;

      this._optionManager.set(name, defaultValue, false);
    }
  }

  getAliasesByName(name) {
    return Object.keys(this._deprecated).filter(
      (aliasName) => name === this._deprecated[aliasName].alias,
    );
  }

  isDeprecated(name) {
    return Object.prototype.hasOwnProperty.call(this._deprecated, name);
  }

  cache(name, options?: Record<string, unknown>) {
    const isGetter = arguments.length < 2;

    if (isGetter) {
      return this._cachedOptions[name];
    }
    this._cachedOptions[name] = extend(this._cachedOptions[name], options);
  }
}
