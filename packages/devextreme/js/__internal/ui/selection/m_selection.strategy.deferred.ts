// import type { LoadResult } from '@js/common/data';
import dataQuery from '@js/common/data/query';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isString } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import SelectionStrategy from '@ts/ui/selection/m_selection.strategy';
import type { SelectionFilter, SelectionItem } from '@ts/ui/selection/types';

export default class DeferredStrategy<TItem extends SelectionItem = any, TKey extends string | number = any> extends SelectionStrategy<TItem, TKey> {
  getSelectedItems(): DeferredObj<TItem[]> {
    return this._loadFilteredData(this.options.selectionFilter);
  }

  getSelectedItemKeys(): Promise<unknown> {
    const d = Deferred();
    const that = this;
    const key = this.options.key();
    const select = isString(key) ? [key] : key;

    this._loadFilteredData(this.options.selectionFilter, null, select).done((items) => {
      const keys = (Array.isArray(items) ? items : []).map((item) => that.options.keyOf(item));

      d.resolve(keys);
    }).fail((error) => {
      d.reject(error);
    });

    return d.promise();
  }

  selectedItemKeys(
    keys: TKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
  ): DeferredObj<unknown> {
    if (isSelectAll) {
      const filter = this.options.filter();
      const needResetSelectionFilter = !filter || JSON.stringify(filter) === JSON.stringify(this.options.selectionFilter) && isDeselect;

      if (needResetSelectionFilter) {
        this._setOption('selectionFilter', isDeselect ? [] : null);
      } else {
        this._addSelectionFilter(isDeselect, filter, isSelectAll);
      }
    } else {
      if (!preserve) {
        this._setOption('selectionFilter', []);
      }

      for (let i = 0; i < keys.length; i++) {
        if (isDeselect) {
          this.removeSelectedItem(keys[i]);
        } else {
          this.addSelectedItem(keys[i], isSelectAll, !preserve);
        }
      }
    }

    this.onSelectionChanged();

    return Deferred().resolve();
  }

  setSelectedItems(keys: TKey[]): void {
    this._setOption('selectionFilter', null);
    for (let i = 0; i < keys.length; i++) {
      this.addSelectedItem(keys[i]);
    }
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

    // @ts-expect-error
    return !!dataQuery([itemData], queryParams).filter(selectionFilter).toArray().length;
  }

  _getKeyExpr(): string | undefined | Function {
    const keyField = this.options.key();
    if (Array.isArray(keyField) && keyField.length === 1) {
      return keyField[0];
    }
    return keyField;
  }

  _normalizeKey(key) {
    const keyExpr = this.options.key();
    if (Array.isArray(keyExpr) && keyExpr.length === 1) {
      return key[keyExpr[0]];
    }
    return key;
  }

  _getFilterByKey(key: TKey): SelectionFilter {
    const keyField = this._getKeyExpr();
    let filter: SelectionFilter = [keyField, '=', this._normalizeKey(key)];

    if (Array.isArray(keyField)) {
      filter = [];
      for (let i = 0; i < keyField.length; i++) {
        filter.push([keyField[i], '=', key[keyField[i]]]);
        if (i !== keyField.length - 1) {
          filter.push('and');
        }
      }
    }

    return filter;
  }

  addSelectedItem(key: TKey, dataOrIsSelectAll?: boolean, skipFilter?: boolean): void {
    const filter = this._getFilterByKey(key);

    this._addSelectionFilter(false, filter, dataOrIsSelectAll, skipFilter);
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

  _findSubFilter(selectionFilter?: SelectionFilter, filter?: SelectionFilter): number {
    if (!selectionFilter) return -1;
    const filterString = JSON.stringify(filter);

    for (let index = 0; index < selectionFilter.length; index++) {
      const subFilter = selectionFilter[index];
      if (subFilter && JSON.stringify(subFilter) === filterString) {
        return index;
      }
    }

    return -1;
  }

  _isLastSubFilter(selectionFilter?: SelectionFilter, filter?: SelectionFilter) {
    if (selectionFilter && filter) {
      return this._findSubFilter(selectionFilter, filter) === selectionFilter.length - 1 || this._findSubFilter([selectionFilter], filter) === 0;
    }
    return false;
  }

  _addFilterOperator(selectionFilter: SelectionFilter, filterOperator: 'and' | 'or'): SelectionFilter {
    if (selectionFilter.length > 1 && isString(selectionFilter[1]) && selectionFilter[1] !== filterOperator) {
      selectionFilter = [selectionFilter];
    }
    if (Array.isArray(selectionFilter) && selectionFilter.length) {
      selectionFilter.push(filterOperator);
    }
    return selectionFilter;
  }

  _denormalizeFilter(filter: SelectionFilter): SelectionFilter {
    if (filter && isString(filter[0])) {
      filter = [filter];
    }
    return filter;
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
    isDeselect?: boolean,
    filter?: SelectionFilter,
    isSelectAll?: boolean,
    skipFilter?: boolean,
  ): void {
    const that = this;
    const currentFilter = isDeselect ? ['!', filter] : filter;
    const currentOperation = isDeselect ? 'and' : 'or';
    let needAddFilter = true;
    let selectionFilter: SelectionFilter = that.options.selectionFilter || [];

    selectionFilter = that._denormalizeFilter(selectionFilter);
    if (selectionFilter?.length && !skipFilter) {
      const removedIndex = that._removeSameFilter(selectionFilter, filter, isDeselect, isSelectAll);
      const filterIndex = that._removeSameFilter(selectionFilter, filter, !isDeselect);

      const shouldCleanFilter = isDeselect
                    && (removedIndex !== -1 || filterIndex !== -1)
                    && this._isOnlyNegativeFiltersLeft(selectionFilter);

      if (shouldCleanFilter) {
        selectionFilter = [];
      }

      const isKeyOperatorsAfterRemoved = this._isKeyFilter(filter) && this._hasKeyFiltersOnlyStartingFromIndex(selectionFilter, filterIndex);

      needAddFilter = !!filter?.length && !isKeyOperatorsAfterRemoved;
    }

    if (needAddFilter) {
      selectionFilter = that._addFilterOperator(selectionFilter, currentOperation);
      Array.isArray(selectionFilter) && selectionFilter.push(currentFilter);
    }

    selectionFilter = that._normalizeFilter(selectionFilter);

    that._setOption('selectionFilter', !isDeselect && !selectionFilter.length ? null : selectionFilter);
  }

  _normalizeFilter(filter: SelectionFilter): SelectionFilter {
    if (filter && filter.length === 1) {
      [filter] = filter;
    }
    return filter;
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

  _isSimpleKeyFilter(filter?: SelectionFilter, key?: string | Function): boolean {
    return filter?.length === 3 && filter[0] === key && filter[1] === '=';
  }

  _isKeyFilter(filter?: SelectionFilter): boolean {
    if (filter?.length === 2 && filter?.[0] === '!') {
      return this._isKeyFilter(filter[1]);
    }
    const keyField = this._getKeyExpr();

    if (Array.isArray(keyField)) {
      if (filter?.length !== keyField.length * 2 - 1) {
        return false;
      }
      for (let i = 0; i < keyField.length; i++) {
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

  _hasKeyFiltersOnlyStartingFromIndex(selectionFilter: SelectionFilter, filterIndex: number): boolean {
    if (filterIndex >= 0) {
      for (let i = filterIndex; i < selectionFilter.length; i++) {
        if (typeof selectionFilter[i] !== 'string' && !this._isKeyFilter(selectionFilter[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  _removeSameFilter(selectionFilter: SelectionFilter, filter?: SelectionFilter, inverted?: boolean, isSelectAll?: boolean): number {
    filter = inverted ? ['!', filter] : filter;

    if (JSON.stringify(filter) === JSON.stringify(selectionFilter)) {
      selectionFilter.splice(0, selectionFilter.length);
      return 0;
    }

    const filterIndex = this._findSubFilter(selectionFilter, filter);

    if (filterIndex >= 0) {
      this._removeFilterByIndex(selectionFilter, filterIndex, isSelectAll);
      return filterIndex;
    }
    for (let i = 0; i < selectionFilter.length; i++) {
      if (Array.isArray(selectionFilter[i]) && selectionFilter[i].length > 2) {
        const filterIndex = this._removeSameFilter(selectionFilter[i], filter, false, isSelectAll);
        if (filterIndex >= 0) {
          if (!selectionFilter[i].length) {
            this._removeFilterByIndex(selectionFilter, i, isSelectAll);
          } else if (selectionFilter[i].length === 1) {
            const [firstFilter] = selectionFilter[i];
            selectionFilter[i] = firstFilter;
          }
          return filterIndex;
        }
      }
    }
    return -1;
  }

  getSelectAllState(): boolean | undefined {
    const filter = this.options.filter();
    let { selectionFilter } = this.options;

    if (!selectionFilter) return true;
    if (!selectionFilter.length) return false;
    if (!filter || !filter.length) return undefined;

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
