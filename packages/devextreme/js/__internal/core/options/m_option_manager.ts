/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { normalizeOptions } from '@js/core/options/utils';
import { noop } from '@js/core/utils/common';
import { equals } from '@js/core/utils/comparator';
import { compileGetter, compileSetter, getPathParts } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isDefined, isPlainObject } from '@js/core/utils/type';

const cachedGetters = {};
const cachedSetters = {};

export class OptionManager {
  _options: any;

  _optionsByReference: any;

  _changingCallback: any;

  _changedCallback: any;

  _namePreparedCallbacks: any;

  _validateOptionsCallback: any;

  constructor(options, optionsByReference) {
    this._options = options;
    this._optionsByReference = optionsByReference;

    this._changingCallback;
    this._changedCallback;
    this._namePreparedCallbacks;
    this._validateOptionsCallback;
  }

  _setByReference(options, rulesOptions) {
    extend(true, options, rulesOptions);

    for (const fieldName in this._optionsByReference) {
      if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
        options[fieldName] = rulesOptions[fieldName];
      }
    }
  }

  _setPreparedValue(name, value, merge?: any, silent?: boolean) {
    const previousValue = this.get(this._options, name, false);

    if (!equals(previousValue, value)) {
      const path = getPathParts(name);

      !silent && this._changingCallback(name, previousValue, value);
      cachedSetters[name] = cachedSetters[name] || compileSetter(name);
      cachedSetters[name](this._options, value, {
        functionsAsIs: true,
        merge: isDefined(merge) ? merge : !this._optionsByReference[name],
        unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]],
      });
      !silent && this._changedCallback(name, value, previousValue);
    }
  }

  _prepareRelevantNames(options, name, value, silent?: boolean) {
    if (isPlainObject(value)) {
      for (const valueName in value) {
        this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
      }
    }

    this._namePreparedCallbacks(options, name, value, silent);
  }

  // eslint-disable-next-line @typescript-eslint/default-param-last
  get(options = this._options, name, unwrapObservables?: boolean) {
    cachedGetters[name] = cachedGetters[name] || compileGetter(name);

    return cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
  }

  set(options, value, merge?: any, silent?: boolean) {
    options = normalizeOptions(options, value);

    for (const name in options) {
      this._prepareRelevantNames(options, name, options[name], silent);
    }

    if (this._validateOptionsCallback) {
      options = this._validateOptionsCallback(options);
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

  onValidateOptions(callback) {
    this._validateOptionsCallback = callback;
  }

  dispose() {
    this._changingCallback = noop;
    this._changedCallback = noop;
  }
}
