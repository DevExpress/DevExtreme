import dataQuery from '@js/common/data/query';
import { getUniqueValues, removeDuplicates } from '@js/core/utils/array';
import { isKeysEqual } from '@js/core/utils/array_compare';
import { getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { SelectionFilterCreator } from '@js/core/utils/selection_filter';
import { isDefined, isNumeric, isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import SelectionStrategy from '@ts/ui/selection/m_selection.strategy';
import type {
  PendingOptions,
  RequestData,
  RequestItems,
  SelectionFilter,
  SelectionItem,
  SelectionOptions,
} from '@ts/ui/selection/types';

interface KeyIndicesToRemoveMap {
  [index: number]: boolean;
}

export default class StandardStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends string | number = any,
> extends SelectionStrategy<TItem, TKey> {
  _shouldMergeWithLastRequest?: boolean;

  _lastLoadDeferred?: DeferredObj<TItem[]>;

  _lastRequestData?: RequestData<TItem, TKey>;

  _isCancelingInProgress?: boolean;

  _lastSelectAllPageDeferred = Deferred().reject();

  _storedSelectionState?: {
    selectedItems: TItem[];
    selectedItemKeys: TKey[];
    keyHashIndices: string;
  };

  constructor(options: SelectionOptions<TItem, TKey>) {
    super(options);
    this._initSelectedItemKeyHash();
  }

  _initSelectedItemKeyHash(): void {
    this._setOption('keyHashIndices', this.options.equalByReference ? null : {});
  }

  getSelectedItemKeys(): TKey[] {
    return this.options.selectedItemKeys.slice(0);
  }

  getSelectedItems(): TItem[] {
    return this.options.selectedItems.slice(0);
  }

  _preserveSelectionUpdate(items: TItem[], isDeselect?: boolean): void {
    const { keyOf } = this.options;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let keyIndicesToRemoveMap: KeyIndicesToRemoveMap | undefined;

    if (!keyOf) return;

    const isBatchDeselect = isDeselect && items.length > 1 && !this.options.equalByReference;

    if (isBatchDeselect) {
      keyIndicesToRemoveMap = {};
    }

    items.forEach((item) => {
      const key = keyOf(item);
      if (isDeselect) {
        const keyIndex = this.removeSelectedItem(
          key,
          keyIndicesToRemoveMap,
          item && typeof item === 'object' && 'disabled' in item ? !!item.disabled : false,
        );
        if (keyIndicesToRemoveMap && isNumeric(keyIndex) && keyIndex >= 0) {
          keyIndicesToRemoveMap[keyIndex] = true;
        }
      } else {
        this.addSelectedItem(key, item);
      }
    });

    if (isBatchDeselect && keyIndicesToRemoveMap) {
      this._batchRemoveSelectedItems(keyIndicesToRemoveMap);
    }
  }

  _batchRemoveSelectedItems(keyIndicesToRemoveMap: KeyIndicesToRemoveMap): void {
    const selectedItemKeys = this.options.selectedItemKeys.slice(0);
    const selectedItems = this.options.selectedItems.slice(0);

    this.options.selectedItemKeys.length = 0;
    this.options.selectedItems.length = 0;

    for (let i = 0; i < selectedItemKeys.length; i += 1) {
      if (!keyIndicesToRemoveMap[i]) {
        this.options.selectedItemKeys.push(selectedItemKeys[i]);
        this.options.selectedItems.push(selectedItems[i]);
      }
    }

    this._initSelectedItemKeyHash();
    this.updateSelectedItemKeyHash(this.options.selectedItemKeys);
  }

  _loadSelectedItemsCore(
    keys: TKey[],
    isDeselect?: boolean,
    isSelectAll?: boolean,
    filter?: SelectionFilter,
    forceCombinedFilter = false,
  ): DeferredObj<TItem[]> {
    let deferred = Deferred<TItem[]>();
    const key = this.options.key();

    if (!keys.length && !isSelectAll) {
      deferred.resolve([]);
      return deferred;
    }

    if (isSelectAll && isDeselect && !filter) {
      deferred.resolve(this.getSelectedItems());
      return deferred;
    }

    const selectionFilterCreator = new SelectionFilterCreator(keys, isSelectAll);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(
      key,
      filter,
      forceCombinedFilter,
    );

    let deselectedItems = [];
    if (isDeselect) {
      const { selectedItems } = this.options;
      deselectedItems = combinedFilter && keys.length !== selectedItems.length
        // @ts-expect-error dataQuery
        ? dataQuery(selectedItems).filter(combinedFilter).toArray()
        : selectedItems.slice(0);
    }

    let filteredItems = deselectedItems.length
      ? deselectedItems
      : this.options.plainItems(true)
        .filter(this.options.isSelectableItem)
        .map(this.options.getItemData);

    const localFilter = selectionFilterCreator.getLocalFilter(
      this.options.keyOf,
      this.equalKeys.bind(this),
      this.options.equalByReference,
      key,
    );

    filteredItems = filteredItems.filter(localFilter);

    if (deselectedItems.length || (!isSelectAll && filteredItems.length === keys.length)) {
      deferred.resolve(filteredItems);
    } else {
      deferred = this._loadFilteredData(combinedFilter, localFilter, null, isSelectAll);
    }

    return deferred;
  }

  _replaceSelectionUpdate(items: TItem[]): void {
    const { keyOf } = this.options;

    if (!keyOf) return;

    const internalKeys: TKey[] = items.map((item) => keyOf(item));

    this.setSelectedItems(internalKeys, items);
  }

  _warnOnIncorrectKeys(keys: TKey[]): void {
    const { allowNullValue } = this.options;

    keys.forEach((key) => {
      if ((!allowNullValue || key !== null) && !this.isItemKeySelected(key)) {
        errors.log('W1002', key);
      }
    });
  }

  _isMultiSelectEnabled(): boolean {
    const { mode } = this.options;
    return mode === 'all' || mode === 'multiple';
  }

  _requestInProgress(): boolean {
    return this._lastLoadDeferred?.state() === 'pending';
  }

  _concatRequestsItems(
    keys: TKey[],
    oldRequestItems: RequestItems<TItem, TKey>,
    isDeselect?: boolean,
    updatedKeys?: TKey[],
  ): RequestData<TItem, TKey> {
    let selectedItems: TKey[] = [];
    const deselectedItems = isDeselect ? keys : [];

    if (updatedKeys) {
      selectedItems = updatedKeys;
    } else {
      // @ts-expect-error removeDuplicates
      selectedItems = removeDuplicates(keys, this.options.selectedItemKeys);
    }

    return {
      addedItems: oldRequestItems.added.concat(selectedItems),
      removedItems: oldRequestItems.removed.concat(deselectedItems),
      keys,
    };
  }

  _collectLastRequestData(
    keys: TKey[],
    isDeselect?: boolean,
    isSelectAll?: boolean,
    updatedKeys?: TKey[],
  ): RequestData<TItem, TKey> {
    const isDeselectAll = isDeselect && isSelectAll;
    const oldRequestItems: RequestItems = {
      added: [],
      removed: [],
    };
    const multiSelectEnabled = this._isMultiSelectEnabled();
    const emptyData: RequestData<TItem, TKey> = {
      addedItems: [],
      removedItems: [],
      keys: [],
    };
    let lastRequestData: RequestData<TItem, TKey> = multiSelectEnabled
      ? this._lastRequestData ?? emptyData
      : emptyData;

    if (multiSelectEnabled) {
      if (this._shouldMergeWithLastRequest) {
        if (isDeselectAll) {
          this._lastLoadDeferred?.reject();
          lastRequestData = {} as RequestData<TItem, TKey>;
        } else if (!isKeysEqual(keys, this.options.selectedItemKeys)) {
          oldRequestItems.added = lastRequestData?.addedItems;
          oldRequestItems.removed = lastRequestData?.removedItems;

          if (!isDeselect) {
            this._lastLoadDeferred?.reject();
          }
        }
      }

      lastRequestData = this._concatRequestsItems(
        keys,
        oldRequestItems,
        isDeselect,
        this._shouldMergeWithLastRequest ? undefined : updatedKeys,
      );
    }

    return lastRequestData;
  }

  _updateKeysByLastRequestData(keys: TKey[], isDeselect?: boolean, isSelectAll?: boolean): TKey[] {
    let currentKeys = keys;
    if (
      this._isMultiSelectEnabled()
      && this._shouldMergeWithLastRequest
      && this._lastRequestData
      && !isDeselect
      && !isSelectAll
    ) {
      currentKeys = removeDuplicates(
        // @ts-expect-error removeDuplicates
        [
          ...keys,
          ...this._lastRequestData.addedItems,
        ],
        this._lastRequestData?.removedItems,
      );
      // @ts-expect-error getUniqueValues
      currentKeys = getUniqueValues(currentKeys);
    }

    return currentKeys;
  }

  _loadSelectedItems(
    keys: TKey[],
    isDeselect?: boolean,
    isSelectAll?: boolean,
    updatedKeys?: TKey[],
    forceCombinedFilter = false,
  ): DeferredObj<TItem[]> {
    const deferred = Deferred<TItem[]>();
    const filter = this.options.filter();

    this._shouldMergeWithLastRequest = this._requestInProgress();

    this._lastRequestData = this._collectLastRequestData(
      keys,
      isDeselect,
      isSelectAll,
      updatedKeys,
    );

    when(this._lastLoadDeferred).always(() => {
      const currentKeys = this._updateKeysByLastRequestData(keys, isDeselect, isSelectAll);

      this._shouldMergeWithLastRequest = false;

      this._loadSelectedItemsCore(currentKeys, isDeselect, isSelectAll, filter, forceCombinedFilter)
        .done((result) => {
          deferred.resolve(result);
        })
        .fail((error) => {
          deferred.reject(error);
        });
    });

    this._lastLoadDeferred = deferred;

    return deferred;
  }

  selectedItemKeys(
    keys: TKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
    updatedKeys?: TKey[],
    forceCombinedFilter?: boolean,
  ): DeferredObj<TItem[]> {
    if (this._isCancelingInProgress) {
      return Deferred<TItem[]>().reject();
    }

    const loadingDeferred = this._loadSelectedItems(
      keys,
      isDeselect,
      isSelectAll,
      updatedKeys,
      forceCombinedFilter,
    );

    const selectionDeferred = Deferred<TItem[]>();

    loadingDeferred.done((items) => {
      this._storeSelectionState();

      if (preserve) {
        this._preserveSelectionUpdate(items, isDeselect);
      } else {
        this._replaceSelectionUpdate(items);
      }
      /// #DEBUG
      if (!isSelectAll && !isDeselect) {
        this._warnOnIncorrectKeys(keys);
      }
      /// #ENDDEBUG

      this._isCancelingInProgress = true;
      this._callCallbackIfNotCanceled(() => {
        this._isCancelingInProgress = false;
        this.onSelectionChanged();
        selectionDeferred.resolve(items);
      }, () => {
        this._isCancelingInProgress = false;
        this._restoreSelectionState();
        selectionDeferred.reject();
      });
    });

    return selectionDeferred;
  }

  addSelectedItem(key: TKey, item: TItem): void {
    if (
      isDefined(item)
      && !this.options.ignoreDisabledItems
      && item.disabled
    ) {
      if (!this.options.disabledItemKeys.includes(key)) {
        this.options.disabledItemKeys.push(key);
      }
      return;
    }

    const keyHash = this._getKeyHash(key);

    if (this._indexOfSelectedItemKey(keyHash) === -1) {
      if (!isObject(keyHash) && this.options.keyHashIndices) {
        this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
      }

      this.options.selectedItemKeys.push(key);
      this.options.addedItemKeys.push(key);
      this.options.addedItems.push(item);
      this.options.selectedItems.push(item);
    }
  }

  _getSelectedIndexByKey(key: TKey, ignoreIndicesMap?: KeyIndicesToRemoveMap): number {
    const { selectedItemKeys } = this.options;

    return selectedItemKeys
      .findIndex(
        (_, index) => (!ignoreIndicesMap || !ignoreIndicesMap[index])
          && this.equalKeys(selectedItemKeys[index], key),
      );
  }

  _getSelectedIndexByHash(key: TKey, ignoreIndicesMap?: KeyIndicesToRemoveMap): number {
    let indices = this.options.keyHashIndices?.[key];

    if (indices && indices.length > 1 && ignoreIndicesMap) {
      indices = indices.filter((index) => !ignoreIndicesMap[index]);
    }

    return indices && indices[0] >= 0 ? indices[0] : -1;
  }

  _indexOfSelectedItemKey(key: TKey, ignoreIndicesMap?: KeyIndicesToRemoveMap): number {
    let selectedIndex = -1;

    if (this.options.equalByReference) {
      selectedIndex = this.options.selectedItemKeys.indexOf(key);
    } else if (isObject(key)) {
      selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
    } else {
      selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
    }

    return selectedIndex;
  }

  _shiftSelectedKeyIndices(keyIndex: number): void {
    for (
      let currentKeyIndex = keyIndex;
      currentKeyIndex < this.options.selectedItemKeys.length;
      currentKeyIndex += 1
    ) {
      const currentKey = this.options.selectedItemKeys[currentKeyIndex];
      const currentKeyHash = getKeyHash(currentKey);
      const currentKeyIndices = this.options.keyHashIndices?.[currentKeyHash];

      // eslint-disable-next-line no-continue
      if (!currentKeyIndices) continue;

      for (let i = 0; i < currentKeyIndices.length; i += 1) {
        if (currentKeyIndices[i] > keyIndex) {
          currentKeyIndices[i] -= 1;
        }
      }
    }
  }

  removeSelectedItem(
    key: TKey,
    keyIndicesToRemoveMap?: KeyIndicesToRemoveMap,
    isDisabled?: boolean,
  ): number | undefined {
    if (!this.options.ignoreDisabledItems && isDisabled) {
      return undefined;
    }

    const keyHash = this._getKeyHash(key);
    const isBatchDeselect = !!keyIndicesToRemoveMap;
    const keyIndex = this._indexOfSelectedItemKey(keyHash, keyIndicesToRemoveMap);

    if (keyIndex < 0) {
      return keyIndex;
    }

    this.options.removedItemKeys.push(key);
    this.options.removedItems.push(this.options.selectedItems[keyIndex]);

    if (isBatchDeselect) {
      return keyIndex;
    }

    this.options.selectedItemKeys.splice(keyIndex, 1);
    this.options.selectedItems.splice(keyIndex, 1);

    if (isObject(keyHash) || !this.options.keyHashIndices) {
      return keyIndex;
    }

    const keyIndices = this.options.keyHashIndices[keyHash];

    if (!keyIndices) {
      return keyIndex;
    }

    keyIndices.shift();

    if (!keyIndices.length) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.options.keyHashIndices[keyHash];
    }

    this._shiftSelectedKeyIndices(keyIndex);

    return keyIndex;
  }

  _updateAddedItemKeys(keys: TKey[], items: TItem[]): void {
    for (let i = 0; i < keys.length; i += 1) {
      if (!this.isItemKeySelected(keys[i])) {
        this.options.addedItemKeys.push(keys[i]);
        this.options.addedItems.push(items[i]);
      }
    }
  }

  _updateRemovedItemKeys(_: TKey[], oldSelectedKeys: TKey[], oldSelectedItems: TItem[]): void {
    for (let i = 0; i < oldSelectedKeys.length; i += 1) {
      if (!this.isItemKeySelected(oldSelectedKeys[i])) {
        this.options.removedItemKeys.push(oldSelectedKeys[i]);
        this.options.removedItems.push(oldSelectedItems[i]);
      }
    }
  }

  _isItemSelectionInProgress(key: TKey, checkPending?: boolean): boolean {
    const shouldCheckPending = checkPending && this._lastRequestData && this._requestInProgress();
    if (shouldCheckPending) {
      const addedItems = this._lastRequestData?.addedItems ?? [];
      return addedItems.includes(key);
    }
    return false;
  }

  _getKeyHash(key: TKey): TKey {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.options.equalByReference ? key : getKeyHash(key);
  }

  setSelectedItems(keys: TKey[], items: TItem[]): void {
    this._updateAddedItemKeys(keys, items);

    const oldSelectedKeys = this.options.selectedItemKeys;
    const oldSelectedItems = this.options.selectedItems;

    if (!this.options.equalByReference) {
      this._initSelectedItemKeyHash();
      this.updateSelectedItemKeyHash(keys);
    }

    this._setOption('selectedItemKeys', keys);
    this._setOption('selectedItems', items);

    this._updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems);
  }

  isItemDataSelected(itemData: TItem, options: PendingOptions = {}): boolean {
    const key = this.options.keyOf(itemData);
    return this.isItemKeySelected(key, options);
  }

  isItemKeySelected(key: TKey, options: PendingOptions = {}): boolean {
    let result = this._isItemSelectionInProgress(key, options.checkPending);

    if (!result) {
      const keyHash = this._getKeyHash(key);
      const index = this._indexOfSelectedItemKey(keyHash);
      result = index !== -1;
    }

    return result;
  }

  getSelectAllState(visibleOnly: boolean): boolean | undefined {
    if (visibleOnly) {
      return this._getVisibleSelectAllState();
    }
    return this._getFullSelectAllState();
  }

  loadSelectedItemsWithFilter(): DeferredObj<TItem[]> {
    const keyExpr = this.options.key();
    const keys = this.getSelectedItemKeys();
    const filter = this.options.filter();

    if (!keys.length) {
      return Deferred<TItem[]>().resolve([]);
    }

    const selectionFilterCreator = new SelectionFilterCreator(keys);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(keyExpr, filter, true);

    return this._loadFilteredData(combinedFilter);
  }

  _storeSelectionState(): void {
    const { selectedItems, selectedItemKeys, keyHashIndices } = this.options;

    this._storedSelectionState = {
      keyHashIndices: JSON.stringify(keyHashIndices),
      selectedItems: [...selectedItems],
      selectedItemKeys: [...selectedItemKeys],
    };
  }

  _restoreSelectionState(): void {
    this._clearItemKeys();

    if (!this._storedSelectionState) {
      return;
    }

    const { selectedItemKeys, selectedItems, keyHashIndices } = this._storedSelectionState;
    this._setOption('selectedItemKeys', selectedItemKeys);
    this._setOption('selectedItems', selectedItems);
    this._setOption('keyHashIndices', JSON.parse(keyHashIndices));
  }

  _onePageSelectAll(isDeselect: boolean): DeferredObj<unknown> {
    if (this._lastSelectAllPageDeferred.state() === 'pending') {
      return Deferred().reject();
    }

    this._storeSelectionState();

    this._selectAllPlainItems(isDeselect);

    this._lastSelectAllPageDeferred = Deferred();

    this._callCallbackIfNotCanceled(() => {
      this.onSelectionChanged();
      this._lastSelectAllPageDeferred.resolve();
    }, () => {
      this._restoreSelectionState();
      this._lastSelectAllPageDeferred.reject();
    });

    return this._lastSelectAllPageDeferred;
  }
}
