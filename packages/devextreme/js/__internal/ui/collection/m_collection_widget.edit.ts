import type { SingleMultipleOrNone } from '@js/common';
import type { ItemInfo } from '@js/common/core/events';
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
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events/events.types';
import type { ItemLike, SelectionChangeInfo } from '@js/ui/collection/ui.collection_widget.base';
import errors from '@js/ui/widget/ui.errors';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionWidgetBaseProperties, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import BaseCollectionWidget from '@ts/ui/collection/collection_widget.base';
import PlainEditStrategy from '@ts/ui/collection/m_collection_widget.edit.strategy.plain';
import Selection from '@ts/ui/selection/m_selection';

import type MenuBaseEditStrategy from '../context_menu/m_menu_base.edit.strategy';

const ITEM_DELETING_DATA_KEY = 'dxItemDeleting';
const NOT_EXISTING_INDEX = -1;

const indexExists = (index): boolean => index !== NOT_EXISTING_INDEX;

export interface CollectionWidgetEditProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends CollectionWidget<any, TItem, TKey> | any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends CollectionWidgetBaseProperties<TComponent, TItem, TKey> {
  selectionMode?: SingleMultipleOrNone;
}

class CollectionWidget<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends BaseCollectionWidget<TProperties> {
  _userOptions?: TProperties;

  _selection!: Selection;

  _editStrategy!: PlainEditStrategy<this> | MenuBaseEditStrategy;

  _actions!: Record<string, (args: Record<string, unknown>) => void>;

  _rendered?: boolean;

  _rendering?: boolean;

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      selectedItem: true,
    });
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
      selectedItem: null,
      onSelectionChanging: null,
      onSelectionChanged: null,
      onItemReordered: null,
      onItemDeleting: null,
      onItemDeleted: null,
    };
  }

  ctor(element: Element, options: TProperties): void {
    this._userOptions = options || {};

    super.ctor(element, options);
  }

  _init(): void {
    this._initEditStrategy();

    super._init();

    this._initKeyGetter();

    this._initActions();

    this._initSelectionModule();
  }

  _initKeyGetter(): void {
    // @ts-expect-error ts-error
    this._keyGetter = compileGetter(this.option('keyExpr'));
  }

  // eslint-disable-next-line class-methods-use-this
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

  _getKeysByItems(selectedItems) {
    return this._editStrategy.getKeysByItems(selectedItems);
  }

  _getItemsByKeys(selectedItemKeys, selectedItems) {
    return this._editStrategy.getItemsByKeys(selectedItemKeys, selectedItems);
  }

  _getKeyByIndex(index: number): unknown {
    return this._editStrategy.getKeyByIndex(index);
  }

  _getIndexByKey(key: unknown): number {
    return this._editStrategy.getIndexByKey(key);
  }

  _getIndexByItemData(itemData) {
    return this._editStrategy.getIndexByItemData(itemData);
  }

  _isKeySpecified() {
    // @ts-expect-error ts-error
    return !!this._dataController.key();
  }

  _getCombinedFilter() {
    // @ts-expect-error ts-error
    return this._dataController.filter();
  }

  key() {
    const { keyExpr } = this.option();
    if (keyExpr) return keyExpr;
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataController.key();
  }

  keyOf(item) {
    let key = item;

    if (this.option('keyExpr')) {
      // @ts-expect-error ts-error
      key = this._keyGetter(item);
      // @ts-expect-error ts-error
    } else if (this._dataController.store()) {
      // @ts-expect-error ts-error
      key = this._dataController.keyOf(item);
    }

    return key;
  }

  // eslint-disable-next-line class-methods-use-this
  _nullValueSelectionSupported(): boolean {
    return false;
  }

  _initSelectionModule(): void {
    const that = this;
    const { itemsGetter } = this._editStrategy;

    this._selection = new Selection({
      allowNullValue: this._nullValueSelectionSupported(),
      mode: this.option('selectionMode'),
      maxFilterLengthInRequest: this.option('maxFilterLengthInRequest'),
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
        const { items } = this.option();
        // @ts-expect-error ts-error
        const totalCount: number = this._dataController.totalCount();
        return totalCount >= 0
          ? totalCount
          // @ts-expect-error ts-error
          : this._getItemsCount(items);
      },
      key: this.key.bind(this),
      keyOf: this.keyOf.bind(this),
      load(options): DeferredObj<unknown> {
        // @ts-expect-error ts-error
        const dataController = that._dataController;
        options.customQueryParams = dataController.loadOptions()?.customQueryParams;
        options.userData = dataController.userData();

        if (dataController.store()) {
          return dataController.loadFromStore(options).done((loadResult) => {
            if (that._disposed) {
              return;
            }
            // @ts-expect-error
            const items = normalizeLoadResult(loadResult).data;

            dataController.applyMapFunction(items);
          });
        }
        return Deferred().resolve(this.plainItems());
      },
      // @ts-expect-error ts-error
      dataFields: () => this._dataController.select(),
      plainItems: itemsGetter.bind(this._editStrategy),
    });
  }

  _getItemsCount(items: TItem[]): number {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-return-assign
    return items.reduce((itemsCount, item) => itemsCount += item.items
      // @ts-expect-error ts-error
      ? this._getItemsCount(item.items)
      : 1, 0);
  }

  _initEditStrategy(): void {
    this._editStrategy = new PlainEditStrategy(this);
  }

  _getSelectedItemIndices(keys): number[] {
    const indices: number[] = [];

    keys = keys || this._selection.getSelectedItemKeys();

    this._editStrategy.beginCache();

    each(keys, (_, key) => {
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
    // @ts-expect-error ts-error
    if (!this._dataController.isLoading()) {
      this._syncSelectionOptions().done(() => this._normalizeSelectedItems());
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

  _syncSelectionOptions(byOption?: string) {
    byOption = byOption ?? this._chooseSelectOption();

    let selectedItem;
    let selectedIndex;
    let selectedItemKeys;
    let selectedItems;

    // eslint-disable-next-line default-case
    switch (byOption) {
      case 'selectedIndex':
        selectedItem = this._editStrategy.getItemDataByIndex(this.option('selectedIndex'));

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

      case 'selectedItems':
        selectedItems = this.option('selectedItems') || [];
        selectedIndex = selectedItems.length ? this._editStrategy.getIndexByItemData(selectedItems[0]) : NOT_EXISTING_INDEX;

        if (this.option('selectionRequired') && !indexExists(selectedIndex)) {
          return this._syncSelectionOptions('selectedIndex');
        }

        this._setOptionWithoutOptionChange('selectedItem', selectedItems[0]);
        this._setOptionWithoutOptionChange('selectedIndex', selectedIndex);
        this._setOptionWithoutOptionChange('selectedItemKeys', this._editStrategy.getKeysByItems(selectedItems));
        break;

      case 'selectedItem':
        selectedItem = this.option('selectedItem');
        selectedIndex = this._editStrategy.getIndexByItemData(selectedItem);

        if (this.option('selectionRequired') && !indexExists(selectedIndex)) {
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

      case 'selectedItemKeys':
        selectedItemKeys = this.option('selectedItemKeys');

        if (this.option('selectionRequired')) {
          const selectedItemIndex = this._getIndexByKey(selectedItemKeys[0]);

          if (!indexExists(selectedItemIndex)) {
            return this._syncSelectionOptions('selectedIndex');
          }
        }

        return this._selection.setSelection(selectedItemKeys);
    }

    return Deferred().resolve().promise();
  }

  _chooseSelectOption(): string {
    let optionName = 'selectedIndex';

    const isOptionDefined = (
      name: 'selectedItems' | 'selectedItem' | 'selectedItemKeys',
    ): boolean => {
      const optionValue = this.option(name);
      // @ts-expect-error ts-error
      const length = isDefined(optionValue) && optionValue.length;
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return length || name in this._userOptions;
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

  _compareKeys(oldKeys, newKeys): boolean {
    if (oldKeys.length !== newKeys.length) {
      return false;
    }

    for (let i = 0; i < newKeys.length; i++) {
      if (oldKeys[i] !== newKeys[i]) {
        return false;
      }
    }

    return true;
  }

  _normalizeSelectedItems(): Promise<unknown> {
    const { selectionMode, selectedItems, items } = this.option();

    if (selectionMode === 'none') {
      this._setOptionWithoutOptionChange('selectedItems', []);
      this._syncSelectionOptions('selectedItems');
    } else if (selectionMode === 'single') {
      const newSelection = selectedItems ?? [];

      // eslint-disable-next-line no-mixed-operators
      if (newSelection.length > 1 || !newSelection.length && this.option('selectionRequired') && items && items.length) {
        const currentSelection = this._selection.getSelectedItems();
        let normalizedSelection = newSelection[0] === undefined
          ? currentSelection[0]
          : newSelection[0];

        if (normalizedSelection === undefined) {
          // eslint-disable-next-line prefer-destructuring
          normalizedSelection = this._editStrategy.itemsGetter()[0];
        }

        if (this.option('grouped') && normalizedSelection && normalizedSelection.items) {
          normalizedSelection.items = [normalizedSelection.items[0]];
        }

        this._selection.setSelection(this._getKeysByItems([normalizedSelection]));

        this._setOptionWithoutOptionChange('selectedItems', [normalizedSelection]);

        return this._syncSelectionOptions('selectedItems');
      }
      this._selection.setSelection(this._getKeysByItems(newSelection));
    } else {
      const newKeys = this._getKeysByItems(this.option('selectedItems'));
      const oldKeys = this._selection.getSelectedItemKeys();
      if (!this._compareKeys(oldKeys, newKeys)) {
        this._selection.setSelection(newKeys);
      }
    }

    return Deferred().resolve().promise();
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    let itemSelectPromise = Deferred().resolve();

    this._createAction((e) => {
      itemSelectPromise = this._itemSelectHandler(e.event) ?? itemSelectPromise;
    }, {
      validatingTargetName: 'itemElement',
    })({
      itemElement: $(e.currentTarget),
      event: e,
    });
    // const parentItemClickHandler = super._itemClickHandler.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    itemSelectPromise.always(() => {
      super._itemClickHandler(e, args, config);
    });
  }

  _itemSelectHandler(
    e: DxEvent,
    shouldIgnoreSelectByClick?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): DeferredObj<unknown> | void {
    if (!shouldIgnoreSelectByClick && !this.option('selectByClick')) {
      return;
    }

    const $itemElement = e.currentTarget;

    // @ts-expect-error ts-error
    if (this.isItemSelected($itemElement)) {
      this.unselectItem(e.currentTarget);
    } else {
      const itemSelectPromise = this.selectItem(e.currentTarget);

      // @ts-expect-error ts-error
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
      // @ts-expect-error ts-error
      const normalizedItemIndex = this._editStrategy.getNormalizedIndex($itemElement);
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

  _updateSelectedItems(args: SelectionChangeInfo<TItem> & {
    addedItemKeys: unknown[];
    removedItemKeys: unknown[];
  }): void {
    const { addedItemKeys, removedItemKeys } = args;

    if (this._rendered && (addedItemKeys.length || removedItemKeys.length)) {
      if (!this._rendering) {
        const addedSelection = [];
        const removedSelection = [];

        this._editStrategy.beginCache();

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < addedItemKeys.length; i += 1) {
          const normalizedIndex = this._getIndexByKey(addedItemKeys[i]);
          // @ts-expect-error ts-error
          addedSelection.push(normalizedIndex);
          this._addSelection(normalizedIndex);
        }

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < removedItemKeys.length; i += 1) {
          const normalizedIndex = this._getIndexByKey(removedItemKeys[i]);
          // @ts-expect-error ts-error
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _updateSelection(addedSelection: unknown[], removedSelection: unknown[]): void {}

  _setAriaSelectionAttribute(
    $target: dxElementWrapper,
    value: string,
  ): void {
    this.setAria('selected', value, $target);
  }

  _removeSelection(normalizedIndex: number): void {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, false);
      // @ts-expect-error ts-error
      eventsEngine.triggerHandler($itemElement, 'stateChanged', false);
    }
  }

  _addSelection(normalizedIndex: number): void {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, true);
      // @ts-expect-error ts-error
      eventsEngine.triggerHandler($itemElement, 'stateChanged', true);
    }
  }

  _isItemSelected(index: number): boolean {
    const key = this._getKeyByIndex(index);

    return this._selection.isItemSelected(key, { checkPending: true });
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'selectionMode':
        this._invalidate();
        break;
      case 'dataSource':
        // eslint-disable-next-line no-mixed-operators
        if (!args.value || Array.isArray(args.value) && !args.value.length) {
          this.option('selectedItemKeys', []);
        }

        super._optionChanged(args);
        break;
      case 'selectedIndex':
      case 'selectedItem':
      case 'selectedItems':
      case 'selectedItemKeys':
        this._syncSelectionOptions(args.name).done(() => this._normalizeSelectedItems());
        break;
      case 'keyExpr':
        this._initKeyGetter();
        break;
      case 'selectionRequired':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    const deletePromise = this._itemEventHandler($itemElement, 'onItemDeleting', deletingActionArgs, { excludeValidators: ['disabled', 'readOnly'] });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises, func-names
    when(deletePromise).always(function (value) {
      // @ts-expect-error ts-error
      const deletePromiseExists = !deletePromise;
      // @ts-expect-error ts-error
      const deletePromiseResolved = !deletePromiseExists && deletePromise.state() === 'resolved';
      const argumentsSpecified = !!arguments.length;

      // eslint-disable-next-line no-mixed-operators
      const shouldDelete = deletePromiseExists || deletePromiseResolved
        // eslint-disable-next-line no-mixed-operators
        && !argumentsSpecified || deletePromiseResolved
        // eslint-disable-next-line no-mixed-operators
        && value;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      when(fromPromise(deletingActionArgs.cancel))
        .always(() => {
          $itemElement.data(ITEM_DELETING_DATA_KEY, false);
        })
        .done((cancel) => {
          if (shouldDelete && !cancel) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            deferred.resolve();
          } else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            deferred.reject();
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .fail(deferred.reject);
    });

    return deferred.promise();
  }

  _deleteItemFromDS($item: dxElementWrapper): Promise<unknown> | DeferredObj<unknown> {
    // @ts-expect-error ts-error
    const dataController = this._dataController;
    const deferred = Deferred();
    const disabledState = this.option('disabled');
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
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          deferred.resolve();
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          deferred.reject();
        }
      })
      .fail(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        deferred.reject();
      });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferred.always((): void => {
      this.option('disabled', disabledState);
    });

    return deferred;
  }

  _tryRefreshLastPage(): Promise<unknown> {
    const deferred = Deferred();
    // @ts-expect-error ts-error
    if (this._isLastPage() || this.option('grouped')) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferred.resolve();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._refreshLastPage().done(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  _refreshLastPage(): DeferredObj<unknown> {
    this._expectLastItemLoading();
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataController.load();
  }

  _updateSelectionAfterDelete(index: number): void {
    const key = this._getKeyByIndex(index);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  isItemSelected(itemElement: dxElementWrapper | number): boolean {
    // @ts-expect-error ts-error
    return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement));
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  selectItem(itemElement: Element): DeferredObj<unknown> | void {
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

  unselectItem(itemElement: Element): void {
    const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
    if (!indexExists(itemIndex)) {
      return;
    }

    const selectedItemKeys = this._selection.getSelectedItemKeys();

    if (this.option('selectionRequired') && selectedItemKeys.length <= 1) {
      return;
    }

    const key = this._getKeyByIndex(itemIndex);

    if (!this._selection.isItemSelected(key, { checkPending: true })) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._selection.deselect([key]);
  }

  _deleteItemElementByIndex(index: number): void {
    this._updateSelectionAfterDelete(index);
    this._updateIndicesAfterIndex(index);
    this._editStrategy.deleteItemAtIndex(index);
  }

  _afterItemElementDeleted(
    $item: dxElementWrapper,
    deletedActionArgs: ItemInfo<TItem>,
  ): void {
    // @ts-expect-error ts-error
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

  deleteItem(itemElement: Element): Promise<unknown> {
    const deferred = Deferred();
    const $item = this._editStrategy.getItemElement(itemElement);
    const index = this._editStrategy.getNormalizedIndex(itemElement);
    const itemResponseWaitClass = this._itemResponseWaitClass();

    if (indexExists(index)) {
      // @ts-expect-error ts-error
      this._waitDeletingPrepare($item).done(() => {
        $item.addClass(itemResponseWaitClass);
        const deletedActionArgs = this._extendActionArgs($item);
        // @ts-expect-error ts-error
        this._deleteItemFromDS($item).done(() => {
          this._deleteItemElementByIndex(index);
          this._afterItemElementDeleted($item, deletedActionArgs);
          // @ts-expect-error ts-error
          this._tryRefreshLastPage().done(() => {
            // @ts-expect-error ts-error
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            deferred.resolveWith(this);
          });
        }).fail(() => {
          $item.removeClass(itemResponseWaitClass);
          // @ts-expect-error ts-error
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          deferred.rejectWith(this);
        });
      }).fail(() => {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        deferred.rejectWith(this);
      });
    } else {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferred.rejectWith(this);
    }

    return deferred.promise();
  }

  reorderItem(itemElement: Element, toItemElement: Element): DeferredObj<unknown> {
    const deferred = Deferred();
    const strategy = this._editStrategy;

    const $movingItem = strategy.getItemElement(itemElement);
    const $destinationItem = strategy.getItemElement(toItemElement);
    const movingIndex = strategy.getNormalizedIndex(itemElement);
    const destinationIndex = strategy.getNormalizedIndex(toItemElement);
    // @ts-expect-error ts-error
    const changingOption = this._dataController.getDataSource()
      ? 'dataSource'
      : 'items';

    const canMoveItems = indexExists(movingIndex)
      && indexExists(destinationIndex)
      && movingIndex !== destinationIndex;
    if (canMoveItems) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferred.resolveWith(this);
    } else {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
