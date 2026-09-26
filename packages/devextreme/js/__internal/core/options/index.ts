import type { DefaultOptionsRule } from '@js/core/options';
import { equalByValue, noop } from '@js/core/utils/common';
import { getPathParts } from '@js/core/utils/data';
import { isFunction, isObject, type } from '@js/core/utils/type';
import type {
  ChangedCallback,
  ChangingCallback,
  ValidateOptionsCallback,
} from '@ts/core/options/option_manager';
import { OptionManager } from '@ts/core/options/option_manager';
import {
  convertRulesToOptions, getFieldName, getNestedOptionValue, getParentName,
} from '@ts/core/options/utils';

interface DeprecatedOptionInfo {
  since: string;
  message: string;
  alias?: string;
}

type DeprecatedCallback = (option: string, info: DeprecatedOptionInfo) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionValue = any;

export class Options {
  _deprecatedCallback!: DeprecatedCallback;

  _startChangeCallback!: () => void;

  _endChangeCallback!: () => void;

  _validateOptionsCallback?: ValidateOptionsCallback;

  _default: object;

  _deprecated: Record<string, DeprecatedOptionInfo>;

  _deprecatedNames: string[];

  _optionManager: OptionManager;

  _rules: DefaultOptionsRule<object>[];

  _initialOptions?: object;

  constructor(
    options: object,
    defaultOptions: object,
    optionsByReference: Record<string, unknown>,
    deprecatedOptions: Record<string, unknown>,
  ) {
    this._default = defaultOptions;
    // @ts-expect-error unknown values are not assignable to DeprecatedOptionInfo
    this._deprecated = deprecatedOptions;

    this._deprecatedNames = [];
    this._initDeprecatedNames();

    this._optionManager = new OptionManager(
      options,
      optionsByReference,
    );
    this._optionManager.onRelevantNamesPrepared(
      (newOptions, name, value, silent) => this._setRelevantNames(newOptions, name, value, silent),
    );

    this._rules = [];
  }

  set _initial(value: object) {
    this._initialOptions = value;
  }

  get _initial(): object {
    if (!this._initialOptions) {
      const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));

      this._initialOptions = this._default;
      this._optionManager._setByReference(this._initialOptions, rulesOptions);
    }

    return this._initialOptions;
  }

  _initDeprecatedNames(): void {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const optionName in this._deprecated) {
      this._deprecatedNames.push(optionName);
    }
  }

  _getByRules(rules?: DefaultOptionsRule<object>[] | null): object {
    const allRules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;

    return convertRulesToOptions(allRules);
  }

  _notifyDeprecated(option: string): void {
    const info = this._deprecated[option];

    if (info) {
      this._deprecatedCallback(option, info);
    }
  }

  _setRelevantNames(
    options: Record<string, unknown>,
    name: string,
    value: unknown,
    silent?: boolean,
  ): void {
    if (name) {
      const normalizedName = this._normalizeName(name, silent);

      if (normalizedName && normalizedName !== name) {
        this._setField(options, normalizedName, value);
        this._clearField(options, name);
      }
    }
  }

  _setField(options: Record<string, unknown>, fullName: string, value: unknown): void {
    let fieldName = '';
    let fieldObject: unknown = null;
    let currentName = fullName;

    do {
      fieldName = fieldName ? `.${fieldName}` : '';
      fieldName = getFieldName(currentName) + fieldName;
      currentName = getParentName(currentName);
      fieldObject = currentName ? this._optionManager.get(options, currentName, false) : options;
    } while (!fieldObject);

    fieldObject[fieldName] = value;
  }

  _clearField(options: Record<string, unknown>, name: string): void {
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

  _normalizeName(name: string, silent?: boolean): string {
    if (!this._deprecatedNames.length || !name) {
      return name;
    }

    for (const deprecatedName of this._deprecatedNames) {
      const deprecate = deprecatedName === name && this._deprecated[name];

      if (deprecate) {
        if (!silent) {
          this._notifyDeprecated(name);
        }

        return deprecate.alias || name;
      }
    }

    return name;
  }

  addRules(rules: DefaultOptionsRule<object>[]): void {
    this._rules = rules.concat(this._rules);
  }

  applyRules(rules?: DefaultOptionsRule<object>[]): void {
    const options = this._getByRules(rules);

    this.silent(options);
  }

  dispose(): void {
    this._deprecatedCallback = noop;
    this._startChangeCallback = noop;
    this._endChangeCallback = noop;
    this._optionManager.dispose();
  }

  onChanging(callBack: ChangingCallback): void {
    this._optionManager.onChanging(callBack);
  }

  onChanged(callBack: ChangedCallback): void {
    this._optionManager.onChanged(callBack);
  }

  validateOptions<TOptions extends object>(callBack: (options: TOptions) => TOptions): void {
    // @ts-expect-error (options: TOptions) => TOptions is not assignable to ValidateOptionsCallback
    this._optionManager.onValidateOptions(callBack);
  }

  onDeprecated(callBack: DeprecatedCallback): void {
    this._deprecatedCallback = callBack;
  }

  onStartChange(callBack: () => void): void {
    this._startChangeCallback = callBack;
  }

  onEndChange(callBack: () => void): void {
    this._endChangeCallback = callBack;
  }

  isInitial(name: string): boolean {
    const value = this.silent(name);
    const initialValue = this.initial(name);
    const areFunctions = isFunction(value) && isFunction(initialValue);

    return areFunctions
      ? value.toString() === initialValue.toString()
      : equalByValue(value, initialValue);
  }

  initial(name: string): OptionValue {
    return getNestedOptionValue(this._initial, name);
  }

  option(options?: string | object, value?: unknown): OptionValue {
    const isGetter = arguments.length < 2 && type(options) !== 'object';

    if (isGetter) {
      // @ts-expect-error string | object | undefined is not assignable to string
      return this._optionManager.get(undefined, this._normalizeName(options));
    }
    this._startChangeCallback();
    try {
      // @ts-expect-error string | object | undefined is not assignable to set() options
      this._optionManager.set(options, value);
    } finally {
      this._endChangeCallback();
    }

    return undefined;
  }

  silent(options?: PropertyKey | object, value?: unknown): OptionValue {
    const isGetter = arguments.length < 2 && type(options) !== 'object';

    if (isGetter) {
      // @ts-expect-error PropertyKey | object | undefined is not assignable to string
      return this._optionManager.get(undefined, options, undefined);
    }
    // @ts-expect-error PropertyKey | object | undefined is not assignable to set() options
    this._optionManager.set(options, value, undefined, true);

    return undefined;
  }

  reset(name: string): void {
    if (name) {
      const fullPath = getPathParts(name);
      const value = fullPath.reduce(
        (currentValue: unknown, field: string): unknown => (
          currentValue ? currentValue[field] : this.initial(field)
        ),
        null,
      );

      const defaultValue = isObject(value) ? { ...value } : value;

      this._optionManager.set(name, defaultValue, false);
    }
  }

  getAliasesByName(name: string): string[] {
    return Object.keys(this._deprecated).filter(
      (aliasName) => name === this._deprecated[aliasName].alias,
    );
  }

  isDeprecated(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._deprecated, name);
  }

  cache(name: string, value?: unknown): OptionValue {
    const isGetter = arguments.length < 2;
    const optionName = `_cached_${name}`;

    if (isGetter) {
      return this.option(optionName);
    }
    this.option(optionName, value);

    return undefined;
  }
}
