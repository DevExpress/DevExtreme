import type { SingleMultipleAllOrNone, SingleMultipleOrNone } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeLoadResult } from '@js/common/data/data_source/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error ts-error
  fromPromise,
  when,
} from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined, isObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { ItemLike, SelectionChangeInfo } from '@js/ui/collection/ui.collection_widget.base';
import errors from '@js/ui/widget/ui.errors';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type {
  CollectionItemInfo,
  CollectionItemKey,
  CollectionWidgetBaseProperties,
  PostprocessRenderItemInfo,
} from '@ts/ui/collection/collection_widget.base';
import BaseCollectionWidget from '@ts/ui/collection/collection_widget.base';
import PlainEditStrategy from '@ts/ui/collection/collection_widget.edit.strategy.plain';
import type DataController from '@ts/ui/collection/m_data_controller';
import Selection from '@ts/ui/selection/m_selection';

import type { CollectionItemIndex } from './collection_widget.edit.strategy';

const ITEM_DELETING_DATA_KEY = 'dxItemDeleting';
const SELECTED_ITEM_CLASS = 'dx-item-selected';

export const NOT_EXISTING_INDEX = -1;

export const indexExists = (index: CollectionItemIndex): boolean => index !== NOT_EXISTING_INDEX;

type SelectionInfo<TItem, TKey = CollectionItemKey> = SelectionChangeInfo<TItem> & {
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
};

type SelectOption = 'selectedIndex' | 'selectedItems' | 'selectedItem' | 'selectedItemKeys';

export interface CollectionWidgetEditProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends CollectionWidget<any, TItem, TKey> | any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends CollectionWidgetBaseProperties<TComponent, TItem, TKey> {
  selectionMode?: SingleMultipleOrNone | SingleMultipleAllOrNone;
  selectionRequired?: boolean;
  focusOnSelectedItem?: boolean;
  selectByClick?: boolean;
  maxFilterLengthInRequest?: number;
  grouped?: boolean;
  onItemReordered?: ((e) => void) | null;
  onItemDeleting?: ((e) => void) | null;
  onItemDeleted?: ((e) => void) | null;
}

class CollectionWidget<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends BaseCollectionWidget<TProperties, TItem, TKey> {
  static _userOptions = {};

  // @ts-expect-error TItem
  _selection!: Selection<TItem, TKey, false>;

  _editStrategy!: PlainEditStrategy<TItem, TKey>;

  _actions!: Record<string, (args: Record<string, unknown>) => void>;

  _rendered?: boolean;

  _rendering?: boolean;

  _dataController!: DataController;

  _keyGetter!: (item: TItem) => TKey;

  constructor(element: Element, options?: Record<string, unknown>) {
    CollectionWidget._userOptions = options ?? {};
    // @ts-expect-error
    super(element, options);
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();
    // @ts-expect-error
    this._optionsByReference.selectedItem = true;
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      selectionMode: 'none',
      selectionRequired: false,
      selectByClick: true,
      selectedItems: [],
      selectedItemKeys: [],
      maxFilterLengthInRequest: 1500,
      keyExpr: null,
      selectedIndex: NOT_EXISTING_INDEX,
      focusOnSelectedItem: true,
      selectedItem: null,
      onSelectionChanging: null,
      onSelectionChanged: null,
      onItemReordered: null,
      onItemDeleting: null,
      onItemDeleted: null,
    };
  }

  _init(): void {
    this._initEditStrategy();

    super._init();

    this._initKeyGetter();

    this._initActions();

    this._initSelectionModule();
  }

  _initKeyGetter(): void {
    const { keyExpr } = this.option();

    // @ts-expect-error compileGetter
    this._keyGetter = compileGetter(keyExpr);
  }

  _selectedItemClass(): string {
    return SELECTED_ITEM_CLASS;
  }

  _getActionsList(): ('onSelectionChanging' | 'onSelectionChanged')[] {
    return ['onSelectionChanging', 'onSelectionChanged'];
  }

  _initActions(): void {
    this._actions = {};
    const actions = this._getActionsList();

    actions.forEach((action) => {
      this._actions[action] = this._createActionByOption(action, {
        excludeValidators: ['disabled', 'readOnly'],
      }) ?? noop;
    });
  }

  _getKeysByItems(selectedItems: TItem[]): TKey[] {
    return this._editStrategy.getKeysByItems(selectedItems);
  }

  _getItemsByKeys(selectedItemKeys: TKey[], selectedItems: TItem[]): TItem[] {
    return this._editStrategy.getItemsByKeys(selectedItemKeys, selectedItems);
  }

  _getKeyByIndex(index: CollectionItemIndex): TKey {
    return this._editStrategy.getKeyByIndex(index);
  }

  _getIndexByKey(key: TKey): number {
    return this._editStrategy.getIndexByKey(key);
  }

  _getIndexByItemData(itemData: TItem): CollectionItemIndex {
    return this._editStrategy.getIndexByItemData(itemData);
  }

  _isKeySpecified(): boolean {
    return !!this._dataController.key();
  }

  _getCombinedFilter(): unknown {
    // @ts-expect-error arguments
    return this._dataController.filter();
  }

  key(): string | Function | undefined {
    const { keyExpr } = this.option();

    if (keyExpr) {
      return keyExpr;
    }

    return this._dataController.key() as string | Function | undefined;
  }

  keyOf(item: TItem): TKey {
    const { keyExpr } = this.option();

    if (keyExpr) {
      return this._keyGetter(item);
    }

    if (this._dataController.store()) {
      return this._dataController.keyOf(item) as TKey;
    }

    return item as unknown as TKey;
  }

  _nullValueSelectionSupported(): boolean {
    return false;
  }

  _initSelectionModule(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const { itemsGetter } = this._editStrategy;
    const { selectionMode, maxFilterLengthInRequest } = this.option();

    // @ts-expect-error TItem
    this._selection = new Selection<TItem, TKey>({
      allowNullValue: this._nullValueSelectionSupported(),
      mode: selectionMode,
      maxFilterLengthInRequest,
      equalByReference: !this._isKeySpecified(),
      onSelectionChanging: (args): void => {
        const isSelectionChanged = args.addedItemKeys.length || args.removedItemKeys.length;
        if (!this._rendered || !isSelectionChanged) {
          return;
        }

        const selectionChangingArgs = {
          removedItems: args.removedItems,
          addedItems: args.addedItems,
          cancel: false,
        };
        this._actions.onSelectionChanging?.(selectionChangingArgs);
        args.cancel = selectionChangingArgs.cancel;
      },
      onSelectionChanged: (args): void => {
        if (args.addedItemKeys.length || args.removedItemKeys.length) {
          this.option('selectedItems', this._getItemsByKeys(args.selectedItemKeys, args.selectedItems));
          this._updateSelectedItems(args);
        }
      },
      filter: this._getCombinedFilter.bind(this),
      totalCount: (): number => {
        const { items = [] } = this.option();
        const totalCount: number = this._dataController.totalCount();
        return totalCount >= 0
          ? totalCount
          : this._getItemsCount(items);
      },
      key: this.key.bind(this),
      keyOf: this.keyOf.bind(this),
      load(options): DeferredObj<TItem[]> {
        const dataController = that._dataController;
        options.customQueryParams = dataController.loadOptions()?.customQueryParams;
        options.userData = dataController.userData();

        if (dataController.store()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return dataController.loadFromStore(options).done((loadResult) => {
            if (that._disposed) {
              return;
            }
            // @ts-expect-error arguments
            const items = normalizeLoadResult(loadResult).data;

            dataController.applyMapFunction(items);
          });
        }
        return Deferred<TItem[]>().resolve(this.plainItems());
      },
      // eslint-disable-next-line @stylistic/max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-function-return-type
      dataFields: () => this._dataController.select(),
      plainItems: itemsGetter.bind(this._editStrategy),
    });
  }

  _getItemsCount(items: TItem[]): number {
    return items.reduce((itemsCount, item) => {
      // @ts-expect-error subItems
      const subItemsCount = item.items ? this._getItemsCount(item.items) : 1;

      return itemsCount + subItemsCount;
    }, 0);
  }

  _initEditStrategy(): void {
    this._editStrategy = new PlainEditStrategy<TItem, TKey>(this);
  }

  _getSelectedItemIndices(keys?: TKey[]): number[] {
    const indices: number[] = [];

    const selectedKeys = keys ?? this._selection.getSelectedItemKeys();

    this._editStrategy.beginCache();

    each(selectedKeys, (_, key) => {
      const selectedIndex = this._getIndexByKey(key);

      if (indexExists(selectedIndex)) {
        indices.push(selectedIndex);
      }
    });

    this._editStrategy.endCache();

    return indices;
  }

  _initMarkup(): void {
    this._rendering = true;
    if (!this._dataController.isLoading()) {
      this._syncSelectionOptions().done(() => {
        this._normalizeSelectedItems();
      });
    }

    super._initMarkup();
  }

  _render(): void {
    super._render();

    this._rendering = false;
  }

  _fireContentReadyAction(): void {
    this._rendering = false;
    this._rendered = true;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    super._fireContentReadyAction();
  }

  _syncSelectionOptions(byOption?: string): DeferredObj<unknown> {
    const selectedByOption = byOption ?? this._chooseSelectOption();

    // eslint-disable-next-line default-case
    switch (selectedByOption) {
      case 'selectedIndex': {
        const { selectedIndex } = this.option();
        const selectedItem = this._editStrategy.getItemDataByIndex(
          selectedIndex ?? NOT_EXISTING_INDEX,
        );

        if (isDefined(selectedItem)) {
          this._setOptionWithoutOptionChange('selectedItems', [selectedItem]);
          this._setOptionWithoutOptionChange('selectedItem', selectedItem);
          this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems([selectedItem]));
        } else {
          this._setOptionWithoutOptionChange('selectedItems', []);
          this._setOptionWithoutOptionChange('selectedItemKeys', []);
          this._setOptionWithoutOptionChange('selectedItem', null);
        }
        break;
      }
      case 'selectedItems': {
        const { selectedItems = [], selectionRequired } = this.option();
        const selectedIndex = selectedItems.length
          ? this._editStrategy.getIndexByItemData(selectedItems[0])
          : NOT_EXISTING_INDEX;

        if (selectionRequired && !indexExists(selectedIndex)) {
          return this._syncSelectionOptions('selectedIndex');
        }

        this._setOptionWithoutOptionChange('selectedItem', selectedItems[0]);
        this._setOptionWithoutOptionChange('selectedIndex', selectedIndex);
        this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems(selectedItems));
        break;
      }
      case 'selectedItem': {
        const { selectedItem = {} as TItem, selectionRequired } = this.option();
        const selectedIndex = this._editStrategy.getIndexByItemData(selectedItem);

        if (selectionRequired && !indexExists(selectedIndex)) {
          return this._syncSelectionOptions('selectedIndex');
        }

        if (isDefined(selectedItem)) {
          this._setOptionWithoutOptionChange('selectedItems', [selectedItem]);
          this._setOptionWithoutOptionChange('selectedIndex', selectedIndex);
          this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems([selectedItem]));
        } else {
          this._setOptionWithoutOptionChange('selectedItems', []);
          this._setOptionWithoutOptionChange('selectedItemKeys', []);
          this._setOptionWithoutOptionChange('selectedIndex', NOT_EXISTING_INDEX);
        }
        break;
      }
      case 'selectedItemKeys': {
        const { selectedItemKeys = [], selectionRequired } = this.option();

        if (selectionRequired) {
          const selectedItemIndex = this._getIndexByKey(selectedItemKeys[0]);

          if (!indexExists(selectedItemIndex)) {
            return this._syncSelectionOptions('selectedIndex');
          }
        }

        return this._selection.setSelection(selectedItemKeys);
      }
    }

    return Deferred().resolve();
  }

  _chooseSelectOption(): SelectOption {
    let optionName: SelectOption = 'selectedIndex';

    const isOptionDefined = (
      name: 'selectedItems' | 'selectedItem' | 'selectedItemKeys',
    ): boolean => {
      const { [name]: optionValue } = this.option();
      const length = isDefined(optionValue) && Array.isArray(optionValue) && optionValue.length;

      return !!length || name in CollectionWidget._userOptions;
    };

    if (isOptionDefined('selectedItems')) {
      optionName = 'selectedItems';
    } else if (isOptionDefined('selectedItem')) {
      optionName = 'selectedItem';
    } else if (isOptionDefined('selectedItemKeys')) {
      optionName = 'selectedItemKeys';
    }

    return optionName;
  }

  _compareKeys(
    oldKeys: TKey[],
    newKeys: TKey[],
  ): boolean {
    if (oldKeys.length !== newKeys.length) {
      return false;
    }

    for (let i = 0; i < newKeys.length; i += 1) {
      if (oldKeys[i] !== newKeys[i]) {
        return false;
      }
    }

    return true;
  }

  _normalizeSelectedItems(): DeferredObj<unknown> {
    const { selectionMode, selectedItems = [], items } = this.option();

    if (selectionMode === 'none') {
      this._setOptionWithoutOptionChange('selectedItems', []);
      this._syncSelectionOptions('selectedItems');
    } else if (selectionMode === 'single') {
      const newSelection = selectedItems ?? [];
      const { selectionRequired } = this.option();

      if (newSelection.length > 1 || (!newSelection.length && selectionRequired && items?.length)) {
        const currentSelection = this._selection.getSelectedItems();

        let normalizedSelection = newSelection[0] ?? currentSelection[0];

        if (normalizedSelection === undefined) {
          // eslint-disable-next-line prefer-destructuring
          normalizedSelection = this._editStrategy.itemsGetter()[0];
        }

        const { grouped } = this.option();

        const hasSubItems = (item: TItem): item is TItem & { items: TItem[] } => isObject(item) && 'items' in item && Array.isArray(item.items);
        if (grouped && hasSubItems(normalizedSelection)) {
          normalizedSelection.items = [normalizedSelection.items[0]];
        }

        this._selection.setSelection(this._getKeysByItems([normalizedSelection]));

        this._setOptionWithoutOptionChange('selectedItems', [normalizedSelection]);

        return this._syncSelectionOptions('selectedItems');
      }
      this._selection.setSelection(this._getKeysByItems(newSelection));
    } else {
      const newKeys = this._getKeysByItems(selectedItems);
      const oldKeys = this._selection.getSelectedItemKeys();
      if (!this._compareKeys(oldKeys, newKeys)) {
        this._selection.setSelection(newKeys);
      }
    }

    return Deferred().resolve();
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    let itemSelectPromise = Deferred().resolve();
    this._createAction((event) => {
      itemSelectPromise = this._itemSelectHandler(event.event) ?? itemSelectPromise;
    }, {
      validatingTargetName: 'itemElement',
    })({
      itemElement: $(e.currentTarget),
      event: e,
    });

    itemSelectPromise.always(() => {
      super._itemClickHandler(e, args, config);
    });
  }

  _itemSelectHandler(
    e: DxEvent,
    shouldIgnoreSelectByClick?: boolean | number,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): DeferredObj<unknown> | void {
    const { selectByClick } = this.option();

    if (!shouldIgnoreSelectByClick && !selectByClick) {
      return;
    }

    const $itemElement = e.currentTarget;

    if (this.isItemSelected($itemElement)) {
      this.unselectItem(e.currentTarget);
    } else {
      const itemSelectPromise = this.selectItem(e.currentTarget);

      // @ts-expect-error Promise DefferedObj
      // eslint-disable-next-line consistent-return
      return itemSelectPromise?.promise();
    }
  }

  _selectedItemElement(index: number): dxElementWrapper {
    return this._itemElements().eq(index);
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<TItem>): void {
    const { selectionMode } = this.option();

    if (selectionMode !== 'none') {
      const $itemElement = $(args.itemElement);
      const normalizedItemIndex = this._editStrategy.getNormalizedIndex($itemElement.get(0));
      const isItemSelected = this._isItemSelected(normalizedItemIndex);

      this._processSelectableItem($itemElement, isItemSelected);
    }
  }

  _processSelectableItem(
    $itemElement: dxElementWrapper,
    isSelected: boolean,
  ): void {
    $itemElement.toggleClass(this._selectedItemClass(), isSelected);
    this._setAriaSelectionAttribute($itemElement, String(isSelected));
  }

  _updateSelectedItems(args: SelectionInfo<TItem, TKey>): void {
    const { addedItemKeys, removedItemKeys } = args;

    if (this._rendered && (addedItemKeys.length || removedItemKeys.length)) {
      if (!this._rendering) {
        const addedSelection: number[] = [];
        const removedSelection: number[] = [];

        this._editStrategy.beginCache();

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < addedItemKeys.length; i += 1) {
          const normalizedIndex = this._getIndexByKey(addedItemKeys[i]);
          addedSelection.push(normalizedIndex);
          this._addSelection(normalizedIndex);
        }

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < removedItemKeys.length; i += 1) {
          const normalizedIndex = this._getIndexByKey(removedItemKeys[i]);
          removedSelection.push(normalizedIndex);
          this._removeSelection(normalizedIndex);
        }

        this._editStrategy.endCache();
        this._updateSelection(addedSelection, removedSelection);
      }

      this._actions.onSelectionChanged({
        addedItems: args.addedItems,
        removedItems: args.removedItems,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateSelection(addedSelection?: unknown[], removedSelection?: unknown[]): void {}

  _setAriaSelectionAttribute(
    $target: dxElementWrapper,
    value: string,
  ): void {
    this.setAria('selected', value, $target);
  }

  _getFocusedElementIndex(): number {
    const { focusOnSelectedItem } = this.option();

    return focusOnSelectedItem
      ? this._getFlatIndex()
      : super._getFocusedElementIndex();
  }

  _getFlatIndex(): number {
    const { selectedIndex = NOT_EXISTING_INDEX } = this.option();

    return selectedIndex;
  }

  _removeSelection(normalizedIndex: number): void {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, false);
      // @ts-expect-error arguments
      eventsEngine.triggerHandler($itemElement, 'stateChanged', false);
    }
  }

  _addSelection(normalizedIndex: number): void {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, true);
      // @ts-expect-error arguments
      eventsEngine.triggerHandler($itemElement, 'stateChanged', true);
    }
  }

  _isItemSelected(index: CollectionItemIndex): boolean {
    const key = this._getKeyByIndex(index);

    return this._selection.isItemSelected(key, { checkPending: true });
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'selectionMode':
        this._invalidate();
        break;
      case 'dataSource':

        if (!args.value || (Array.isArray(args.value) && !args.value.length)) {
          this.option('selectedItemKeys', []);
        }

        super._optionChanged(args);
        break;
      case 'selectedIndex':
      case 'selectedItem':
      case 'selectedItems':
      case 'selectedItemKeys':
        this._syncSelectionOptions(args.name).done(() => {
          this._normalizeSelectedItems();
        });
        break;
      case 'keyExpr':
        this._initKeyGetter();
        break;
      case 'selectionRequired':
        this._normalizeSelectedItems();
        break;
      case 'onSelectionChanging':
      case 'onSelectionChanged':
        this._initActions();
        break;
      case 'selectByClick':
      case 'onItemDeleting':
      case 'onItemDeleted':
      case 'onItemReordered':
      case 'maxFilterLengthInRequest':
        break;
      case 'focusOnSelectedItem':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _clearSelectedItems(): void {
    this._setOptionWithoutOptionChange('selectedItems', []);
    this._syncSelectionOptions('selectedItems');
  }

  _waitDeletingPrepare($itemElement: dxElementWrapper): Promise<unknown> {
    if ($itemElement.data(ITEM_DELETING_DATA_KEY)) {
      return Deferred().resolve().promise();
    }

    $itemElement.data(ITEM_DELETING_DATA_KEY, true);

    const deferred = Deferred();
    const deletingActionArgs = { cancel: false };
    const deletePromise = this._itemEventHandler(
      $itemElement,
      'onItemDeleting',
      deletingActionArgs,
      { excludeValidators: ['disabled', 'readOnly'] },
    );

    // eslint-disable-next-line func-names
    when(deletePromise).always(function (value) {
      // @ts-expect-error ts-error
      const deletePromiseExists = !deletePromise;
      // @ts-expect-error ts-error
      const deletePromiseResolved = !deletePromiseExists && deletePromise.state() === 'resolved';
      const argumentsSpecified = !!arguments.length;

      const shouldDeleteImmediately = deletePromiseExists;
      const shouldDeleteWhenNoArgs = deletePromiseResolved && !argumentsSpecified;
      const shouldDeleteWithValue = deletePromiseResolved && value;

      const shouldDelete = shouldDeleteImmediately
        || shouldDeleteWhenNoArgs
        || shouldDeleteWithValue;

      when(fromPromise(deletingActionArgs.cancel))
        .always(() => {
          $itemElement.data(ITEM_DELETING_DATA_KEY, false);
        })
        .done((cancel) => {
          if (shouldDelete && !cancel) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .fail(deferred.reject);
    });

    return deferred.promise();
  }

  _deleteItemFromDS($item: dxElementWrapper): Promise<unknown> | DeferredObj<unknown> {
    const dataController = this._dataController;
    const deferred = Deferred();
    const { disabled } = this.option();

    const dataStore = dataController.store();

    if (!dataStore) {
      return Deferred().resolve().promise();
    }

    if (!dataStore.remove) {
      throw errors.Error('E1011');
    }

    this.option('disabled', true);

    dataStore.remove(dataController.keyOf(this._getItemData($item)))
      .done((key) => {
        if (key !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .fail(() => {
        deferred.reject();
      });

    deferred.always((): void => {
      this.option('disabled', disabled);
    });

    return deferred;
  }

  _tryRefreshLastPage(): Promise<unknown> {
    const deferred = Deferred();

    const { grouped } = this.option();
    // @ts-expect-error mixin method
    if (this._isLastPage() || grouped) {
      deferred.resolve();
    } else {
      this._refreshLastPage().done(() => {
        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  _refreshLastPage(): DeferredObj<unknown> {
    this._expectLastItemLoading();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataController.load();
  }

  _updateSelectionAfterDelete(index: number): void {
    const key = this._getKeyByIndex(index);

    this._selection.deselect([key]);
  }

  _updateIndicesAfterIndex(index: number): void {
    const itemElements = this._itemElements();
    for (let i = index + 1; i < itemElements.length; i += 1) {
      $(itemElements[i]).data(this._itemIndexKey(), i - 1);
    }
  }

  _simulateOptionChange(optionName: keyof TProperties): void {
    const optionValue = this.option(optionName);

    if (optionValue instanceof DataSource) {
      return;
    }

    this._optionChangedAction?.({ name: optionName, fullName: optionName, value: optionValue });
  }

  isItemSelected(itemElement: Element | number): boolean {
    return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement));
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  selectItem(itemElement: Element | number | TItem): DeferredObj<unknown> | void {
    const { selectionMode } = this.option();

    if (selectionMode === 'none') return Deferred().resolve();

    const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
    if (!indexExists(itemIndex)) {
      return Deferred().resolve();
    }

    const key = this._getKeyByIndex(itemIndex);

    if (this._selection.isItemSelected(key)) {
      return Deferred().resolve();
    }

    if (selectionMode === 'single') {
      return this._selection.setSelection([key]);
    }

    const { selectedItemKeys } = this.option();

    return this._selection.setSelection([...selectedItemKeys ?? [], key], [key]);
  }

  unselectItem(itemElement: Element | number | TItem): void {
    const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
    if (!indexExists(itemIndex)) {
      return;
    }

    const selectedItemKeys = this._selection.getSelectedItemKeys();
    const { selectionRequired } = this.option();

    if (selectionRequired && selectedItemKeys.length <= 1) {
      return;
    }

    const key = this._getKeyByIndex(itemIndex);

    if (!this._selection.isItemSelected(key, { checkPending: true })) {
      return;
    }

    this._selection.deselect([key]);
  }

  _deleteItemElementByIndex(index: number): void {
    this._updateSelectionAfterDelete(index);
    this._updateIndicesAfterIndex(index);
    this._editStrategy.deleteItemAtIndex(index);
  }

  _afterItemElementDeleted(
    $item: dxElementWrapper,
    deletedActionArgs: CollectionItemInfo<TItem>,
  ): void {
    const changingOption = this._dataController.getDataSource()
      ? 'dataSource'
      : 'items';
    this._simulateOptionChange(changingOption);
    this._itemEventHandler($item, 'onItemDeleted', deletedActionArgs, {
      beforeExecute() {
        $item.remove();
      },
      excludeValidators: ['disabled', 'readOnly'],
    });
    this._renderEmptyMessage();
  }

  deleteItem(itemElement: dxElementWrapper | Element | CollectionItemIndex): PromiseLike<unknown> {
    const deferred = Deferred();
    const $item = this._editStrategy.getItemElement(itemElement);
    const index = this._editStrategy.getNormalizedIndex(itemElement);
    const itemResponseWaitClass = this._itemResponseWaitClass();

    if (indexExists(index)) {
      // @ts-expect-error Promise DefferedObj
      this._waitDeletingPrepare($item).done(() => {
        $item.addClass(itemResponseWaitClass);
        const deletedActionArgs = this._extendActionArgs($item);
        // @ts-expect-error Promise DefferedObj
        this._deleteItemFromDS($item).done(() => {
          this._deleteItemElementByIndex(index);
          this._afterItemElementDeleted($item, deletedActionArgs);
          // @ts-expect-error Promise DefferedObj
          this._tryRefreshLastPage().done(() => {
            // @ts-expect-error ts-error
            deferred.resolveWith(this);
          });
        }).fail(() => {
          $item.removeClass(itemResponseWaitClass);
          // @ts-expect-error ts-error
          deferred.rejectWith(this);
        });
      }).fail(() => {
        // @ts-expect-error ts-error
        deferred.rejectWith(this);
      });
    } else {
      // @ts-expect-error ts-error
      deferred.rejectWith(this);
    }

    return deferred.promise();
  }

  reorderItem(
    itemElement: dxElementWrapper | Element | CollectionItemIndex,
    toItemElement: dxElementWrapper | Element | CollectionItemIndex,
  ): DeferredObj<unknown> {
    const deferred = Deferred();
    const strategy = this._editStrategy;

    const $movingItem = strategy.getItemElement(itemElement);
    const $destinationItem = strategy.getItemElement(toItemElement);
    const movingIndex = strategy.getNormalizedIndex(itemElement);
    const destinationIndex = strategy.getNormalizedIndex(toItemElement);
    const changingOption = this._dataController.getDataSource()
      ? 'dataSource'
      : 'items';

    const canMoveItems = indexExists(movingIndex)
      && indexExists(destinationIndex)
      && movingIndex !== destinationIndex;
    if (canMoveItems) {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    } else {
      // @ts-expect-error ts-error
      deferred.rejectWith(this);
    }
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise().done(() => {
      $destinationItem[strategy.itemPlacementFunc(movingIndex, destinationIndex)]($movingItem);

      strategy.moveItemAtIndexToIndex(movingIndex, destinationIndex);
      this._updateIndicesAfterIndex(movingIndex);
      this.option('selectedItems', this._getItemsByKeys(this._selection.getSelectedItemKeys(), this._selection.getSelectedItems()));

      if (changingOption === 'items') {
        this._simulateOptionChange(changingOption);
      }
      this._itemEventHandler($movingItem, 'onItemReordered', {
        fromIndex: strategy.getIndex(movingIndex),
        toIndex: strategy.getIndex(destinationIndex),
      }, {
        excludeValidators: ['disabled', 'readOnly'],
      });
    });
  }
}

export default CollectionWidget;
