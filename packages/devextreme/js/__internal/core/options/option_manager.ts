/* eslint-disable guard-for-in, no-restricted-syntax */
import { noop } from '@js/core/utils/common';
import { equals } from '@js/core/utils/comparator';
import { compileGetter, compileSetter, getPathParts } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { normalizeOptions } from '@ts/core/options/utils';

interface GetterOptions {
  functionsAsIs: boolean;
  unwrapObservables?: boolean;
}

interface SetterOptions {
  functionsAsIs: boolean;
  merge: boolean;
  unwrapObservables: boolean;
}

type Getter = (obj: object, options: GetterOptions) => unknown;

type Setter = (obj: object, value: unknown, options: SetterOptions) => void;

export type ChangingCallback = (name: string, previousValue: unknown, value: unknown) => void;

export type ChangedCallback = (name: string, value: unknown, previousValue: unknown) => void;

type NamePreparedCallback = (
  options: Record<string, unknown>,
  name: string,
  value: unknown,
  silent?: boolean,
) => void;

export type ValidateOptionsCallback = (
  options: Record<string, unknown>,
) => Record<string, unknown>;

const cachedGetters: Record<string, Getter> = {};
const cachedSetters: Record<string, Setter> = {};

export class OptionManager {
  _options: object;

  _optionsByReference: Record<string, unknown>;

  _changingCallback!: ChangingCallback;

  _changedCallback!: ChangedCallback;

  _namePreparedCallbacks!: NamePreparedCallback;

  _validateOptionsCallback?: ValidateOptionsCallback;

  constructor(options: object, optionsByReference: Record<string, unknown>) {
    this._options = options;
    this._optionsByReference = optionsByReference;
  }

  _setByReference(options: object, rulesOptions: object): void {
    extend(true, options, rulesOptions);

    for (const fieldName in this._optionsByReference) {
      if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
        options[fieldName] = rulesOptions[fieldName];
      }
    }
  }

  _setPreparedValue(name: string, value: unknown, merge?: boolean, silent?: boolean): void {
    const previousValue = this.get(this._options, name, false);

    if (!equals(previousValue, value)) {
      const path = getPathParts(name);

      if (!silent) {
        this._changingCallback(name, previousValue, value);
      }
      cachedSetters[name] = cachedSetters[name] || compileSetter(name);
      cachedSetters[name](this._options, value, {
        functionsAsIs: true,
        merge: isDefined(merge) ? merge : !this._optionsByReference[name],
        unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]],
      });
      if (!silent) {
        this._changedCallback(name, value, previousValue);
      }
    }
  }

  _prepareRelevantNames(
    options: Record<string, unknown>,
    name: string,
    value: unknown,
    silent?: boolean,
  ): void {
    if (isPlainObject(value)) {
      for (const valueName in value) {
        this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
      }
    }

    this._namePreparedCallbacks(options, name, value, silent);
  }

  // eslint-disable-next-line @typescript-eslint/default-param-last
  get(options: object = this._options, name: string, unwrapObservables?: boolean): unknown {
    cachedGetters[name] = cachedGetters[name] || compileGetter(name);

    return cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
  }

  set(
    options: string | Record<string, unknown>,
    value?: unknown,
    merge?: boolean,
    silent?: boolean,
  ): void {
    let normalizedOptions = normalizeOptions(options, value);

    for (const name in normalizedOptions) {
      this._prepareRelevantNames(normalizedOptions, name, normalizedOptions[name], silent);
    }

    if (this._validateOptionsCallback) {
      normalizedOptions = this._validateOptionsCallback(normalizedOptions);
    }

    for (const name in normalizedOptions) {
      this._setPreparedValue(name, normalizedOptions[name], merge, silent);
    }
  }

  onRelevantNamesPrepared(callBack: NamePreparedCallback): void {
    this._namePreparedCallbacks = callBack;
  }

  onChanging(callBack: ChangingCallback): void {
    this._changingCallback = callBack;
  }

  onChanged(callBack: ChangedCallback): void {
    this._changedCallback = callBack;
  }

  onValidateOptions(callback: ValidateOptionsCallback): void {
    this._validateOptionsCallback = callback;
  }

  dispose(): void {
    this._changingCallback = noop;
    this._changedCallback = noop;
  }
}
