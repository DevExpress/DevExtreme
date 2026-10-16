import errors from '@js/core/errors';
import { each } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import {
  isDefined, isFunction, isObject, isPlainObject,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import { Guid } from '@ts/core/guid';

export interface GetterOptions {
  functionsAsIs?: boolean;
  unwrapObservables?: boolean;
  defaultValue?: unknown;
}

export interface SetterOptions {
  functionsAsIs?: boolean;
  unwrapObservables?: boolean;
  merge?: boolean;
}

export type Getter = (obj: unknown, options?: GetterOptions) => unknown;

export type Setter = (obj: unknown, value: unknown, options?: SetterOptions) => void;

type GetterExpr = string | string[] | null | undefined;

type DataOptions = GetterOptions & SetterOptions;

interface ComparableOptions {
  collatorOptions?: Intl.CollatorOptions;
  locale?: string;
}

const unwrapVariable = variableWrapper.unwrap;
const { isWrapped } = variableWrapper;
const { assign } = variableWrapper;

const bracketsToDots = function bracketsToDots(expr: string): string {
  return expr
    .replace(/\[/g, '.')
    .replace(/\]/g, '');
};

const UNSAFE_PATH_FRAGMENTS = new Set(['__proto__', 'constructor']);

const isUnsafePathFragment = (name: string): boolean => UNSAFE_PATH_FRAGMENTS.has(name);
const isUnsafePrototypeAccess = (obj: unknown, name: string): boolean => name === 'prototype' && typeof obj === 'function';

export const getPathParts = function getPathParts(name: string): string[] {
  return bracketsToDots(name).split('.');
};

function unwrap(value: unknown, options: DataOptions): unknown {
  return options.unwrapObservables ? unwrapVariable(value) : value;
}

const readPropValue = function readPropValue(
  obj: unknown,
  propName: string,
  options?: DataOptions,
): unknown {
  const readOptions = options ?? { };
  if (propName === 'this') {
    return unwrap(obj, readOptions);
  }
  // @ts-expect-error a property of any value is read
  return unwrap(obj[propName], readOptions);
};

const assignPropValue = function assignPropValue(
  obj: Record<string, unknown>,
  propName: string,
  value: unknown,
  options: DataOptions,
): void {
  if (propName === 'this') {
    throw new errors.Error('E4016');
  }

  const propValue = obj[propName];
  if (options.unwrapObservables && isWrapped(propValue)) {
    assign(propValue, value);
  } else {
    obj[propName] = value;
  }
};

const prepareOptions = function prepareOptions(options?: DataOptions): DataOptions {
  const preparedOptions = options || {};
  preparedOptions.unwrapObservables = preparedOptions.unwrapObservables !== undefined
    ? preparedOptions.unwrapObservables
    : true;
  return preparedOptions;
};

export function compileGetter<TGetter extends (...args: never[]) => unknown>(
  expr: TGetter,
): TGetter;
export function compileGetter(expr?: GetterExpr, ...exprs: GetterExpr[]): Getter;
export function compileGetter(expr?: unknown, ...exprs: unknown[]): unknown {
  const getterExpr = exprs.length > 0 ? [expr, ...exprs] : expr;

  if (!getterExpr || getterExpr === 'this') {
    return function getSelf(obj: unknown): unknown { return obj; };
  }

  if (typeof getterExpr === 'string') {
    const path = getPathParts(getterExpr);
    const unsafeFragment = path.find(isUnsafePathFragment);

    if (unsafeFragment !== undefined) {
      errors.log('E0123', unsafeFragment);
      return function getNothing(): void {
        // eslint-disable-next-line no-useless-return
        return;
      };
    }

    return function getValue(obj: unknown, options?: GetterOptions): unknown {
      const getterOptions = prepareOptions(options);
      const functionAsIs = getterOptions.functionsAsIs;
      const hasDefaultValue = 'defaultValue' in getterOptions;
      let current = unwrap(obj, getterOptions);

      for (const pathPart of path) {
        if (isUnsafePrototypeAccess(current, pathPart)) {
          errors.log('E0123', pathPart);
          return undefined;
        }

        if (!current) {
          if (current == null && hasDefaultValue) {
            return getterOptions.defaultValue;
          }
          break;
        }

        if (hasDefaultValue && isObject(current) && !(pathPart in current)) {
          return getterOptions.defaultValue;
        }

        let next = unwrap(current[pathPart], getterOptions);

        if (!functionAsIs && isFunction(next)) {
          next = next.call(current);
        }

        current = next;
      }

      return current;
    };
  }

  if (Array.isArray(getterExpr)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- the two call each other
    return combineGetters(getterExpr);
  }

  if (isFunction(getterExpr)) {
    return getterExpr;
  }

  return undefined;
}

function combineGetters(getters: GetterExpr[]): Getter {
  const compiledGetters: Record<string, Getter> = {};
  for (let i = 0, l = getters.length; i < l; i += 1) {
    const getter = getters[i];
    // @ts-expect-error a getter expression is the key as it is
    compiledGetters[getter] = compileGetter(getter);
  }

  return function getValues(obj: unknown, options?: GetterOptions): unknown {
    let result = undefined as Record<string, unknown> | undefined;

    each(compiledGetters, function setPathValue(this: Getter, name: string) {
      const value = this(obj, options);

      if (value === undefined) {
        return;
      }

      let current = result ?? (result = {});
      const path = name.split('.');
      const last = path.length - 1;

      for (let i = 0; i < last; i += 1) {
        const pathItem = path[i];
        if (!(pathItem in current)) {
          current[pathItem] = { };
        }
        // @ts-expect-error a path step holds an object
        current = current[pathItem];
      }

      current[path[last]] = value;
    });
    return result;
  };
}

function toLowerCase(value: string, options?: ComparableOptions): string {
  return options?.locale ? value.toLocaleLowerCase(options.locale) : value.toLowerCase();
}

function toUpperCase(value: string, options?: ComparableOptions): string {
  return options?.locale ? value.toLocaleUpperCase(options.locale) : value.toUpperCase();
}

const ensurePropValueDefined = function ensurePropValueDefined(
  obj: Record<string, unknown>,
  propName: string,
  value: unknown,
  options: DataOptions,
): unknown {
  if (isDefined(value)) {
    return value;
  }

  const newValue = {};
  assignPropValue(obj, propName, newValue, options);

  return newValue;
};

export const compileSetter = function compileSetter(expr?: string): Setter {
  const path = getPathParts(expr || 'this');
  const lastLevelIndex = path.length - 1;
  const unsafeFragment = path.find(isUnsafePathFragment);

  if (unsafeFragment !== undefined) {
    errors.log('E0123', unsafeFragment);
    return function setNothing(): void {
      // eslint-disable-next-line no-useless-return
      return;
    };
  }

  return function setValue(obj: unknown, value: unknown, options?: SetterOptions): void {
    const setterOptions = prepareOptions(options);

    // @ts-expect-error the path is walked through objects
    let currentValue: Record<string, unknown> = unwrap(obj, setterOptions);
    let hasUnsafePrototypeAccess = false;

    path.forEach((propertyName, levelIndex) => {
      if (hasUnsafePrototypeAccess) {
        return;
      }

      if (isUnsafePrototypeAccess(currentValue, propertyName)) {
        errors.log('E0123', propertyName);
        hasUnsafePrototypeAccess = true;
        return;
      }

      let propertyValue = readPropValue(currentValue, propertyName, setterOptions);
      const isPropertyFunc = !setterOptions.functionsAsIs
        && isFunction(propertyValue)
        && !isWrapped(propertyValue);

      if (levelIndex === lastLevelIndex) {
        if (setterOptions.merge
          && isPlainObject(value)
          && (!isDefined(propertyValue) || isPlainObject(propertyValue))) {
          propertyValue = ensurePropValueDefined(
            currentValue,
            propertyName,
            propertyValue,
            setterOptions,
          );
          deepExtendArraySafe(propertyValue, value, false, true);
        } else if (isPropertyFunc) {
          // @ts-expect-error a function property is called as a method
          currentValue[propertyName](value);
        } else {
          assignPropValue(currentValue, propertyName, value, setterOptions);
        }
      } else {
        propertyValue = ensurePropValueDefined(
          currentValue,
          propertyName,
          propertyValue,
          setterOptions,
        );
        if (isPropertyFunc) {
          // @ts-expect-error a function property is called as a method
          propertyValue = propertyValue.call(currentValue);
        }
        // @ts-expect-error the path is walked through objects
        currentValue = propertyValue;
      }
    });
  };
};

export const toComparable = function toComparable(
  value: unknown,
  caseSensitive?: boolean,
  options: ComparableOptions = {},
): unknown {
  if (value instanceof Date) {
    return value.getTime();
  }

  const collatorSensitivity = options?.collatorOptions?.sensitivity;
  let comparable = value;

  if (comparable instanceof Guid) {
    comparable = comparable.valueOf();
  } else if (typeof comparable === 'string' && (collatorSensitivity === 'base' || collatorSensitivity === 'case')) {
    const REMOVE_DIACRITICAL_MARKS_REGEXP = /[\u0300-\u036f]/g;

    let text = comparable;

    if (collatorSensitivity === 'base') {
      text = toLowerCase(text, options);
    }

    comparable = text.normalize('NFD').replace(REMOVE_DIACRITICAL_MARKS_REGEXP, '');
  }

  const isCaseSensitive = caseSensitive || collatorSensitivity === 'case' || collatorSensitivity === 'variant';

  if (typeof comparable === 'string' && !isCaseSensitive) {
    const text = comparable.normalize('NFC');
    const locale = options?.locale?.toLowerCase();
    const useUpperCase = locale && !!['hy', 'el'].find((code) => locale === code || locale.startsWith(`${code}-`));

    return (useUpperCase ? toUpperCase : toLowerCase)(text, options);
  }

  return comparable;
};
