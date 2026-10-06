import { equalByValue, getKeyHash } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { isFunction, isObject, isString } from '@js/core/utils/type';

type KeyGetter = (item: unknown) => unknown;
type EqualKeys = (key1: unknown, key2: unknown) => boolean;
type PlainKeyExpression = string | KeyGetter;
type KeyExpression = PlainKeyExpression | string[];

interface SelectionFilter {
  getLocalFilter: (
    keyGetter: KeyGetter,
    equalKeys?: EqualKeys,
    equalByReference?: boolean,
    keyExpr?: KeyExpression,
  ) => (item: unknown) => boolean;
  getExpr: (keyExpr?: KeyExpression) => unknown[] | undefined;
  getCombinedFilter: (
    keyExpr?: KeyExpression,
    dataSourceFilter?: unknown,
    forceCombinedFilter?: boolean,
  ) => unknown;
}

export const SelectionFilterCreator = function SelectionFilterCreator(
  this: SelectionFilter,
  selectedItemKeys: readonly unknown[],
  isSelectAll?: boolean,
): void {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned when first needed
  let selectedItemKeyHashesMap: Record<string, boolean> | undefined;

  const normalizeKeys = function normalizeKeys(
    keys: readonly unknown[],
    keyOf: KeyGetter,
    keyExpr?: KeyExpression,
  ): readonly unknown[] {
    return Array.isArray(keyExpr) ? keys.map((key) => keyOf(key)) : keys;
  };

  const getSelectedItemKeyHashesMap = function getSelectedItemKeyHashesMap(
    keyOf: KeyGetter,
    keyExpr?: KeyExpression,
  ): Record<string, boolean> {
    if (!selectedItemKeyHashesMap) {
      selectedItemKeyHashesMap = {};
      const normalizedKeys = normalizeKeys(selectedItemKeys, keyOf, keyExpr);
      for (const normalizedKey of normalizedKeys) {
        selectedItemKeyHashesMap[getKeyHash(normalizedKey)] = true;
      }
    }
    return selectedItemKeyHashesMap;
  };

  function functionFilter(
    equalKeys: EqualKeys,
    keyOf: KeyGetter,
    equalByReference: boolean | undefined,
    keyExpr: KeyExpression | undefined,
    item: unknown,
  ): boolean {
    const key = keyOf(item);

    if (!equalByReference) {
      const keyHash = getKeyHash(key);
      if (!isObject(keyHash)) {
        const selectedKeyHashesMap = getSelectedItemKeyHashesMap(keyOf, keyExpr);
        if (selectedKeyHashesMap[keyHash]) {
          return !isSelectAll;
        }
        return !!isSelectAll;
      }
    }

    for (const selectedItemKey of selectedItemKeys) {
      if (equalKeys(selectedItemKey, key)) {
        return !isSelectAll;
      }
    }
    return !!isSelectAll;
  }

  function getFilterForPlainKey(
    keyExpr: PlainKeyExpression,
    keyValue: unknown,
  ): unknown[] | undefined {
    if (keyValue === undefined) {
      return undefined;
    }
    return [keyExpr, isSelectAll ? '<>' : '=', keyValue];
  }

  function getFilterForCompositeKey(keyExpr: string[], itemKeyValue: unknown): unknown[] {
    const filterExpr: unknown[] = [];

    for (let i = 0, { length } = keyExpr; i < length; i += 1) {
      const currentKeyExpr = keyExpr[i];
      const keyValueGetter = compileGetter(currentKeyExpr);
      // @ts-expect-error keyValueGetter is unknown
      const currentKeyValue = itemKeyValue && keyValueGetter(itemKeyValue);
      const filterExprPart = getFilterForPlainKey(currentKeyExpr, currentKeyValue);

      if (!filterExprPart) {
        break;
      }

      if (i > 0) {
        filterExpr.push(isSelectAll ? 'or' : 'and');
      }

      filterExpr.push(filterExprPart);
    }

    return filterExpr;
  }

  this.getLocalFilter = function getLocalFilter(
    keyGetter: KeyGetter,
    equalKeys?: EqualKeys,
    equalByReference?: boolean,
    keyExpr?: KeyExpression,
  ): (item: unknown) => boolean {
    const equalKeysFunction = equalKeys === undefined ? equalByValue : equalKeys;
    return functionFilter.bind(this, equalKeysFunction, keyGetter, equalByReference, keyExpr);
  };

  this.getExpr = function getExpr(keyExpr?: KeyExpression): unknown[] | undefined {
    if (!keyExpr) {
      return undefined;
    }

    let filterExpr = undefined as unknown[] | undefined;

    selectedItemKeys.forEach((key, index) => {
      filterExpr = filterExpr || [];

      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the branches
      let filterExprPart: unknown[] | undefined;

      if (index > 0) {
        filterExpr.push(isSelectAll ? 'and' : 'or');
      }

      if (isString(keyExpr) || isFunction(keyExpr)) {
        filterExprPart = getFilterForPlainKey(keyExpr, key);
      } else {
        filterExprPart = getFilterForCompositeKey(keyExpr, key);
      }

      filterExpr.push(filterExprPart);
    });

    if (filterExpr?.length === 1) {
      filterExpr = filterExpr[0] as unknown[] | undefined;
    }

    return filterExpr;
  };

  this.getCombinedFilter = function getCombinedFilter(
    keyExpr?: KeyExpression,
    dataSourceFilter?: unknown,
    forceCombinedFilter = false,
  ): unknown {
    const filterExpr = this.getExpr(keyExpr);
    let combinedFilter: unknown = filterExpr;

    if ((forceCombinedFilter || isSelectAll) && dataSourceFilter) {
      if (filterExpr) {
        combinedFilter = [filterExpr, dataSourceFilter];
      } else {
        combinedFilter = dataSourceFilter;
      }
    }

    return combinedFilter;
  };
};
