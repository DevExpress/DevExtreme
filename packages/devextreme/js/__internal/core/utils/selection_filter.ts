import { equalByValue, getKeyHash } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { isFunction, isObject, isString } from '@js/core/utils/type';

type KeyGetter<TItem, TKey> = (item: TItem) => TKey;
type EqualKeys<TKey> = (key1: TKey, key2: TKey) => boolean;
type PlainKeyExpression<TItem> = string | KeyGetter<TItem, unknown>;
type KeyExpression<TItem> = PlainKeyExpression<TItem> | string[];

export class SelectionFilterCreator<TItem = unknown, TKey = unknown> {
  private readonly selectedItemKeys: readonly TKey[];

  private readonly isSelectAll?: boolean;

  private selectedItemKeyHashesMap?: Record<string, boolean>;

  constructor(selectedItemKeys: readonly TKey[], isSelectAll?: boolean) {
    this.selectedItemKeys = selectedItemKeys;
    this.isSelectAll = isSelectAll;
  }

  getLocalFilter(
    keyGetter: KeyGetter<TItem, TKey>,
    equalKeys?: EqualKeys<TKey>,
    equalByReference?: boolean,
    keyExpr?: KeyExpression<TItem>,
  ): (item: TItem) => boolean {
    const equalKeysFunction = equalKeys === undefined ? equalByValue : equalKeys;
    return this.functionFilter.bind(this, equalKeysFunction, keyGetter, equalByReference, keyExpr);
  }

  getExpr(keyExpr?: KeyExpression<TItem>): unknown[] | undefined {
    if (!keyExpr) {
      return undefined;
    }

    const filterExprParts = this.selectedItemKeys.map((key) => (
      isString(keyExpr) || isFunction(keyExpr)
        ? this.getFilterForPlainKey(keyExpr, key)
        : this.getFilterForCompositeKey(keyExpr, key)
    ));

    if (filterExprParts.length <= 1) {
      return filterExprParts[0];
    }

    const groupOperation = this.isSelectAll ? 'and' : 'or';

    return filterExprParts.flatMap((part, index) => (index > 0 ? [groupOperation, part] : [part]));
  }

  getCombinedFilter<TFilter>(
    keyExpr?: KeyExpression<TItem>,
    dataSourceFilter?: TFilter,
    forceCombinedFilter = false,
  ): unknown[] | NonNullable<TFilter> | undefined {
    const filterExpr = this.getExpr(keyExpr);
    let combinedFilter: unknown[] | NonNullable<TFilter> | undefined = filterExpr;

    if ((forceCombinedFilter || this.isSelectAll) && dataSourceFilter) {
      if (filterExpr) {
        combinedFilter = [filterExpr, dataSourceFilter];
      } else {
        combinedFilter = dataSourceFilter;
      }
    }

    return combinedFilter;
  }

  private normalizeKeys(
    keys: readonly TKey[],
    keyOf: KeyGetter<TItem, TKey>,
    keyExpr?: KeyExpression<TItem>,
  ): readonly TKey[] {
    // @ts-expect-error a composite key has the fields of the item, so the key getter reads it
    return Array.isArray(keyExpr) ? keys.map((key) => keyOf(key)) : keys;
  }

  private getSelectedItemKeyHashesMap(
    keyOf: KeyGetter<TItem, TKey>,
    keyExpr?: KeyExpression<TItem>,
  ): Record<string, boolean> {
    if (!this.selectedItemKeyHashesMap) {
      const selectedItemKeyHashesMap: Record<string, boolean> = {};
      const normalizedKeys = this.normalizeKeys(this.selectedItemKeys, keyOf, keyExpr);
      for (const normalizedKey of normalizedKeys) {
        selectedItemKeyHashesMap[getKeyHash(normalizedKey)] = true;
      }
      this.selectedItemKeyHashesMap = selectedItemKeyHashesMap;
    }
    return this.selectedItemKeyHashesMap;
  }

  private functionFilter(
    equalKeys: EqualKeys<TKey>,
    keyOf: KeyGetter<TItem, TKey>,
    equalByReference: boolean | undefined,
    keyExpr: KeyExpression<TItem> | undefined,
    item: TItem,
  ): boolean {
    const key = keyOf(item);

    if (!equalByReference) {
      const keyHash = getKeyHash(key);
      if (!isObject(keyHash)) {
        const selectedKeyHashesMap = this.getSelectedItemKeyHashesMap(keyOf, keyExpr);
        if (selectedKeyHashesMap[keyHash]) {
          return !this.isSelectAll;
        }
        return !!this.isSelectAll;
      }
    }

    for (const selectedItemKey of this.selectedItemKeys) {
      if (equalKeys(selectedItemKey, key)) {
        return !this.isSelectAll;
      }
    }
    return !!this.isSelectAll;
  }

  private getFilterForPlainKey(
    keyExpr: PlainKeyExpression<TItem>,
    keyValue: unknown,
  ): unknown[] | undefined {
    if (keyValue === undefined) {
      return undefined;
    }
    return [keyExpr, this.isSelectAll ? '<>' : '=', keyValue];
  }

  private getFilterForCompositeKey(keyExpr: string[], itemKeyValue: unknown): unknown[] {
    const filterExpr: unknown[] = [];

    for (let i = 0, { length } = keyExpr; i < length; i += 1) {
      const currentKeyExpr = keyExpr[i];
      const keyValueGetter = compileGetter(currentKeyExpr);
      // @ts-expect-error keyValueGetter is unknown
      const currentKeyValue = itemKeyValue && keyValueGetter(itemKeyValue);
      const filterExprPart = this.getFilterForPlainKey(currentKeyExpr, currentKeyValue);

      if (!filterExprPart) {
        break;
      }

      if (i > 0) {
        filterExpr.push(this.isSelectAll ? 'or' : 'and');
      }

      filterExpr.push(filterExprPart);
    }

    return filterExpr;
  }
}
