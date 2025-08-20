import dataQuery from '@js/common/data/query';
import {
  equalByValue,
  getKeyHash,
  noop,
} from '@js/core/utils/common';
import { Deferred, type DeferredObj } from '@js/core/utils/deferred';
import { isObject, isPlainObject, isPromise } from '@js/core/utils/type';
import type {
  QueryParams,
  RemoteFilter,
  SelectionFilter,
  SelectionItem,
  SelectionOptions,
} from '@ts/ui/selection/types';

export default class SelectionStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey= any,
> {
  options: SelectionOptions<TItem, TKey>;

  _lastSelectAllPageDeferred = Deferred().reject();

  constructor(options: SelectionOptions<TItem, TKey>) {
    this.options = options;

    this._setOption('disabledItemKeys', []);
    this._clearItemKeys();
  }

  _clearItemKeys(): void {
    this._setOption('addedItemKeys', []);
    this._setOption('removedItemKeys', []);
    this._setOption('removedItems', []);
    this._setOption('addedItems', []);
  }

  // eslint-disable-next-line class-methods-use-this
  validate(): void {}

  _setOption(name: string, value: unknown): void {
    this.options[name] = value;
  }

  onSelectionChanging(): boolean | Promise<boolean> {
    const {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      onSelectionChanging = noop,
    } = this.options;

    const selectionChangingArgs = {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      cancel: false,
    };

    onSelectionChanging(selectionChangingArgs);
    return selectionChangingArgs.cancel;
  }

  _callCallbackIfNotCanceled(callback: () => void, cancelCallback: () => void): void {
    const cancelResult = this.onSelectionChanging();

    if (isPromise(cancelResult)) {
      cancelResult
        .then((cancel) => {
          if (!cancel) {
            callback();
          } else {
            cancelCallback();
          }
        })
        .catch(() => {
          callback();
        });
    } else if (!cancelResult) {
      callback();
    } else {
      cancelCallback();
    }
  }

  onSelectionChanged(): void {
    const {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      onSelectionChanged = noop,
    } = this.options;

    this._clearItemKeys();
    onSelectionChanged({
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
    });
  }

  equalKeys(key1: TKey, key2: TKey): boolean {
    if (this.options.equalByReference) {
      if (isObject(key1) && isObject(key2)) {
        return key1 === key2;
      }
    }

    return equalByValue(key1, key2);
  }

  // eslint-disable-next-line class-methods-use-this
  getSelectableItems(items: TItem[]): TItem[] {
    return items.filter((item) => !item?.disabled);
  }

  _clearSelection(
    keys: TKey[] | TKey,
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
  ): DeferredObj<TItem[]> {
    let normalizedKeys = keys || [];
    normalizedKeys = Array.isArray(normalizedKeys) ? normalizedKeys : [normalizedKeys];
    this.validate();
    return this.selectedItemKeys(normalizedKeys, preserve, isDeselect, isSelectAll);
  }

  _removeTemplateProperty(remoteFilter: RemoteFilter): RemoteFilter {
    if (Array.isArray(remoteFilter)) {
      return remoteFilter.map((f) => this._removeTemplateProperty(f));
    }

    if (isObject(remoteFilter)) {
      delete remoteFilter.template;
    }

    return remoteFilter;
  }

  _getQueryParams(): QueryParams | undefined {
    const { sensitivity } = this.options;

    if (!sensitivity) {
      return undefined;
    }

    return {
      langParams: {
        collatorOptions: {
          sensitivity,
        },
      },
    };
  }

  _loadFilteredData(
    remoteFilter: SelectionFilter,
    localFilter?: unknown,
    select?: unknown,
    isSelectAll?: boolean,
  ): DeferredObj<TItem[]> {
    const filterLength = encodeURI(
      JSON.stringify(this._removeTemplateProperty(remoteFilter)),
    ).length;
    const needLoadAllData = this.options.maxFilterLengthInRequest
      && (filterLength > this.options.maxFilterLengthInRequest);
    const deferred = Deferred<TItem[]>();
    const queryParams = this._getQueryParams();

    const loadOptions = {
      filter: needLoadAllData ? undefined : remoteFilter,
      select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields(),
      ...queryParams,
    };

    if (remoteFilter && Array.isArray(remoteFilter) && remoteFilter.length === 0) {
      deferred.resolve([]);
    } else {
      this.options.load(loadOptions)
        .done((items) => {
          let filteredItems = !Array.isArray(items) && isPlainObject(items) ? items.data : items;

          if (localFilter && !isSelectAll) {
            filteredItems = filteredItems.filter(localFilter);
          } else if (needLoadAllData) {
            // @ts-expect-error dataQuary
            filteredItems = dataQuery(filteredItems).filter(remoteFilter).toArray();
          }

          deferred.resolve(filteredItems);
        })
        .fail((error) => {
          // @ts-expect-error error
          deferred.reject(error);
        });
    }

    return deferred;
  }

  updateSelectedItemKeyHash(keys: TKey[]): void {
    for (let i = 0; i < keys.length; i += 1) {
      const keyHash = getKeyHash(keys[i]);

      if (!isObject(keyHash)) {
        this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];

        const keyIndices = this.options.keyHashIndices[keyHash];
        keyIndices.push(i);
      }
    }
  }

  _isAnyItemSelected(items: TItem[]): boolean | undefined {
    if (items.find((item) => this.options.isItemSelected(item))) {
      return undefined;
    }

    return false;
  }

  _getFullSelectAllState(): boolean | undefined {
    const items = this.options.plainItems();
    const { filter } = this.options;
    const dataFilter = filter();
    let selectedItems = this.options.ignoreDisabledItems
      ? this.options.selectedItems
      : this.options.selectedItems.filter((item) => !item?.disabled);

    if (dataFilter) {
      // @ts-expect-error dataQuery
      selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
    }

    const selectedItemsLength = selectedItems.length;
    const disabledItemsLength = items.length - this.getSelectableItems(items).length;

    if (!selectedItemsLength) {
      return this._isAnyItemSelected(items);
    }

    if (selectedItemsLength >= this.options.totalCount() - disabledItemsLength) {
      return true;
    }
    return undefined;
  }

  _getVisibleSelectAllState(): boolean | undefined {
    const items = this.getSelectableItems(this.options.plainItems());
    let hasSelectedItems = false;
    let hasUnselectedItems = false;

    items.forEach((item) => {
      const itemData = this.options.getItemData(item);
      const key = this.options.keyOf(itemData);

      if (this.options.isSelectableItem(item)) {
        if (this.isItemKeySelected(key)) {
          hasSelectedItems = true;
        } else {
          hasUnselectedItems = true;
        }
      }
    });

    if (hasSelectedItems) {
      return !hasUnselectedItems ? true : undefined;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  selectedItemKeys(
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    keys: TKey[],
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    preserve?: boolean,
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    isDeselect?: boolean,
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    isSelectAll?: boolean,
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    updatedKeys?: TKey[],
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    forceCombinedFilter?: boolean,
  ): DeferredObj<TItem[]> {
    throw new Error('selectedItemKeys method should be overriden');
  }

  isItemKeySelected(itemKey: TKey | TItem): boolean;
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars, class-methods-use-this
  isItemKeySelected(itemKey: TKey | TItem, options: { checkPending?: boolean } = {}): boolean {
    throw new Error('isItemKeySelected method should be overriden');
  }

  isItemDataSelected(itemKey: TKey | TItem): boolean;
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars, class-methods-use-this
  isItemDataSelected(itemKey: TKey | TItem, options: { checkPending?: boolean } = {}): boolean {
    throw new Error('isItemKeySelected method should be overriden');
  }

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars, class-methods-use-this
  addSelectedItem(itemKey: TKey, dataOrIsSelectAll?: TItem | boolean, skipFilter?: boolean): void {
    throw new Error('addSelectedItem method should be overriden');
  }

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars, class-methods-use-this
  removeSelectedItem(itemKey: TKey): void {
    throw new Error('removeSelectedItem method should be overriden');
  }

  _selectAllPlainItems(isDeselect: boolean): void {
    const items = this.getSelectableItems(this.options.plainItems());
    items.forEach((item) => {
      if (this.options.isSelectableItem(item)) {
        const itemData = this.options.getItemData(item);
        const itemKey = this.options.keyOf(itemData);
        const isSelected = this.isItemKeySelected(itemKey);

        if (!isSelected && !isDeselect) {
          this.addSelectedItem(itemKey, itemData);
        }

        if (isSelected && isDeselect) {
          this.removeSelectedItem(itemKey);
        }
      }
    });
  }
}
