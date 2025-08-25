import dataQuery from '@js/common/data/query';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isString } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import SelectionStrategy from '@ts/ui/selection/selection.strategy';
import type { KeyExpr, SelectionFilter, SelectionItem } from '@ts/ui/selection/types';

export default class DeferredStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends SelectionStrategy<TItem, TKey> {
  getSelectedItems(): DeferredObj<TItem[]> {
    return this._loadFilteredData(this.options.selectionFilter);
  }

  getSelectedItemKeys(): Promise<TKey[]> {
    const d = Deferred<TKey[]>();
    const key = this.options.key();
    const select = isString(key) ? [key] : key;
    const getKey = (item: TItem): TKey => this.options.keyOf(item);

    this._loadFilteredData(this.options.selectionFilter, null, select).done((items) => {
      const keys = (Array.isArray(items) ? items : []).map(getKey);

      d.resolve(keys);
    }).fail((error) => {
      // @ts-expect-error error
      d.reject(error);
    });

    return d.promise();
  }

  selectedItemKeys(
    keys: TKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
  ): DeferredObj<TItem[]> {
    if (isSelectAll) {
      const filter = this.options.filter();
      const needResetSelectionFilter = !filter
        || (JSON.stringify(filter) === JSON.stringify(this.options.selectionFilter) && isDeselect);

      if (needResetSelectionFilter) {
        this._setOption('selectionFilter', isDeselect ? [] : null);
      } else {
        this._addSelectionFilter(isDeselect, filter, isSelectAll);
      }
    } else {
      if (!preserve) {
        this._setOption('selectionFilter', []);
      }

      keys.forEach((key) => {
        if (isDeselect) {
          this.removeSelectedItem(key);
        } else {
          this.addSelectedItem(key, isSelectAll, !preserve);
        }
      });
    }

    this.onSelectionChanged();

    return Deferred<TItem[]>().resolve();
  }

  setSelectedItems(keys: TKey[]): void {
    this._setOption('selectionFilter', null);
    keys.forEach((key) => {
      this.addSelectedItem(key);
    });
  }

  isItemDataSelected(itemData: TItem | TKey): boolean {
    return this.isItemKeySelected(itemData);
  }

  isItemKeySelected(itemData: TItem | TKey): boolean {
    const { selectionFilter } = this.options;

    if (!selectionFilter) {
      return true;
    }

    const queryParams = this._getQueryParams();

    // @ts-expect-error dataQuery
    return !!dataQuery([itemData], queryParams).filter(selectionFilter).toArray().length;
  }

  _getKeyExpr(): KeyExpr | Function | undefined {
    const keyField = this.options.key();
    if (Array.isArray(keyField) && keyField.length === 1) {
      return keyField[0];
    }
    return keyField;
  }

  _normalizeKey(key: TKey): TKey {
    const keyExpr = this.options.key();
    if (Array.isArray(keyExpr) && keyExpr.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return key[keyExpr[0]];
    }
    return key;
  }

  _getFilterByKey(key: TKey): SelectionFilter {
    const keyField = this._getKeyExpr();
    let filter: SelectionFilter = [keyField, '=', this._normalizeKey(key)];

    if (Array.isArray(keyField)) {
      filter = [];
      for (let i = 0; i < keyField.length; i += 1) {
        filter.push([keyField[i], '=', key[keyField[i]]]);
        if (i !== keyField.length - 1) {
          filter.push('and');
        }
      }
    }

    return filter;
  }

  addSelectedItem(key: TKey, isSelectAll?: boolean, skipFilter?: boolean): void {
    const filter = this._getFilterByKey(key);

    this._addSelectionFilter(false, filter, isSelectAll, skipFilter);
  }

  removeSelectedItem(key: TKey): void {
    const filter = this._getFilterByKey(key);

    this._addSelectionFilter(true, filter);
  }

  validate(): void {
    const { key } = this.options;

    if (key && key() === undefined) {
      throw errors.Error('E1042', 'Deferred selection');
    }
  }

  _findSubFilter(
    selectionFilter: SelectionFilter | undefined,
    filter: SelectionFilter | undefined,
  ): number {
    if (!selectionFilter) return -1;
    const filterString = JSON.stringify(filter);

    for (let index = 0; index < selectionFilter.length; index += 1) {
      const subFilter = selectionFilter[index];
      if (subFilter && JSON.stringify(subFilter) === filterString) {
        return index;
      }
    }

    return -1;
  }

  _isLastSubFilter(
    selectionFilter: SelectionFilter | undefined,
    filter: SelectionFilter | undefined,
  ): boolean {
    if (selectionFilter && filter) {
      return this._findSubFilter(selectionFilter, filter) === selectionFilter.length - 1
        || this._findSubFilter([selectionFilter], filter) === 0;
    }
    return false;
  }

  _addFilterOperator(selectionFilter: SelectionFilter, filterOperator: 'and' | 'or'): SelectionFilter {
    let filter = selectionFilter;
    if (
      filter.length > 1
      && isString(filter[1])
      && filter[1] !== filterOperator
    ) {
      filter = [filter];
    }
    if (Array.isArray(filter) && filter.length) {
      filter.push(filterOperator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return filter;
  }

  _denormalizeFilter(filter: SelectionFilter): SelectionFilter {
    let resultFilter = filter;
    if (resultFilter && isString(resultFilter[0])) {
      resultFilter = [resultFilter];
    }
    return resultFilter;
  }

  _isOnlyNegativeFiltersLeft(filters: SelectionFilter): boolean {
    return filters.every((filterItem, i) => {
      if (i % 2 === 0) {
        return Array.isArray(filterItem) && filterItem[0] === '!';
      }
      return filterItem === 'and';
    });
  }

  _addSelectionFilter(
    isDeselect: boolean | undefined,
    filter: SelectionFilter | undefined,
    isSelectAll?: boolean,
    skipFilter?: boolean,
  ): void {
    const currentOperation = isDeselect ? 'and' : 'or';
    let needAddFilter = true;
    let selectionFilter: SelectionFilter = this.options.selectionFilter || [];

    selectionFilter = this._denormalizeFilter(selectionFilter);
    if (selectionFilter?.length && !skipFilter) {
      const removedIndex = this._removeSameFilter(selectionFilter, filter, isDeselect, isSelectAll);
      const filterIndex = this._removeSameFilter(selectionFilter, filter, !isDeselect);

      const shouldCleanFilter = isDeselect
                    && (removedIndex !== -1 || filterIndex !== -1)
                    && this._isOnlyNegativeFiltersLeft(selectionFilter);

      if (shouldCleanFilter) {
        selectionFilter = [];
      }

      const isKeyOperatorsAfterRemoved = this._isKeyFilter(filter)
        && this._hasKeyFiltersOnlyStartingFromIndex(selectionFilter, filterIndex);

      needAddFilter = !!filter?.length && !isKeyOperatorsAfterRemoved;
    }

    if (needAddFilter) {
      selectionFilter = this._addFilterOperator(selectionFilter, currentOperation);
      if (Array.isArray(selectionFilter) && filter) {
        const currentFilter = isDeselect ? ['!', filter] : filter;
        selectionFilter.push(currentFilter);
      }
    }

    selectionFilter = this._normalizeFilter(selectionFilter);

    this._setOption('selectionFilter', !isDeselect && !selectionFilter.length ? null : selectionFilter);
  }

  _normalizeFilter(filter: SelectionFilter): SelectionFilter {
    let resultFilter = filter;
    if (resultFilter && resultFilter.length === 1) {
      [resultFilter] = resultFilter;
    }
    return resultFilter;
  }

  _removeFilterByIndex(filter: SelectionFilter, filterIndex: number, isSelectAll?: boolean): void {
    const operation = filter[1];

    if (filterIndex > 0) {
      filter.splice(filterIndex - 1, 2);
    } else {
      filter.splice(filterIndex, 2);
    }

    if (isSelectAll && operation === 'and') {
      filter.splice(0, filter.length);
    }
  }

  _isSimpleKeyFilter(
    filter: SelectionFilter | undefined,
    key: string | Function | undefined,
  ): boolean {
    return filter?.length === 3 && filter[0] === key && filter[1] === '=';
  }

  _isKeyFilter(filter: SelectionFilter | undefined): boolean {
    if (filter?.length === 2 && filter?.[0] === '!') {
      return this._isKeyFilter(filter[1]);
    }
    const keyField = this._getKeyExpr();

    if (Array.isArray(keyField)) {
      if (filter?.length !== keyField.length * 2 - 1) {
        return false;
      }
      for (let i = 0; i < keyField.length; i += 1) {
        if (i > 0 && filter?.[i * 2 - 1] !== 'and') {
          return false;
        }
        if (!this._isSimpleKeyFilter(filter?.[i * 2], keyField[i])) {
          return false;
        }
      }
      return true;
    }

    return this._isSimpleKeyFilter(filter, keyField);
  }

  _hasKeyFiltersOnlyStartingFromIndex(
    selectionFilter: SelectionFilter,
    filterIndex: number,
  ): boolean {
    if (filterIndex >= 0) {
      for (let i = filterIndex; i < selectionFilter.length; i += 1) {
        if (typeof selectionFilter[i] !== 'string' && !this._isKeyFilter(selectionFilter[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  _removeSameFilter(
    selectionFilter: SelectionFilter,
    filter: SelectionFilter | undefined,
    inverted?: boolean,
    isSelectAll?: boolean,
  ): number {
    const sameFilter = inverted ? ['!', filter] : filter;

    if (JSON.stringify(sameFilter) === JSON.stringify(selectionFilter)) {
      selectionFilter.splice(0, selectionFilter.length);
      return 0;
    }

    const filterIndex = this._findSubFilter(selectionFilter, sameFilter);

    if (filterIndex >= 0) {
      this._removeFilterByIndex(selectionFilter, filterIndex, isSelectAll);
      return filterIndex;
    }

    const filtersWithConditions = selectionFilter
      .filter((filterItem) => Array.isArray(filterItem) && filterItem.length > 2);
    for (let i = 0; i < filtersWithConditions.length; i += 1) {
      const innerFilterIndex = this._removeSameFilter(
        filtersWithConditions[i],
        sameFilter,
        false,
        isSelectAll,
      );

      if (innerFilterIndex >= 0) {
        if (!filtersWithConditions[i].length) {
          this._removeFilterByIndex(filtersWithConditions, i, isSelectAll);
        } else if (filtersWithConditions[i].length === 1) {
          const [firstFilter] = filtersWithConditions[i];
          filtersWithConditions[i] = firstFilter;
        }
        return innerFilterIndex;
      }
    }
    return -1;
  }

  getSelectAllState(): boolean | undefined {
    const filter = this.options.filter();
    let { selectionFilter } = this.options;

    if (!selectionFilter) return true;
    if (!selectionFilter.length) return false;
    if (!filter?.length) return undefined;

    selectionFilter = this._denormalizeFilter(selectionFilter);

    if (this._isLastSubFilter(selectionFilter, filter)) {
      return true;
    }

    if (this._isLastSubFilter(selectionFilter, ['!', filter])) {
      return false;
    }

    return undefined;
  }

  loadSelectedItemsWithFilter(): DeferredObj<unknown> {
    const componentFilter = this.options.filter();
    const { selectionFilter } = this.options;

    const filter = componentFilter
      ? [componentFilter, 'and', selectionFilter]
      : selectionFilter;

    return this._loadFilteredData(filter);
  }

  _onePageSelectAll(isDeselect: boolean): DeferredObj<unknown> {
    this._selectAllPlainItems(isDeselect);

    this.onSelectionChanged();

    return Deferred().resolve();
  }
}
