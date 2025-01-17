import eventsEngine from '@js/common/core/events/core/events_engine';
import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeLoadResult } from '@js/common/data/data_source/utils';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import {
  Deferred,
  // @ts-expect-error
  fromPromise,
  when,
} from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import BaseCollectionWidget from '@ts/ui/collection/m_collection_widget.base';
import Selection from '@ts/ui/selection/m_selection';

import PlainEditStrategy from './m_collection_widget.edit.strategy.plain';

const ITEM_DELETING_DATA_KEY = 'dxItemDeleting';
const NOT_EXISTING_INDEX = -1;

const indexExists = function (index) {
  return index !== NOT_EXISTING_INDEX;
};
// @ts-expect-error
const CollectionWidget = BaseCollectionWidget.inherit({

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      selectedItem: true,
    });
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
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
    });
  },

  ctor(element, options) {
    this._userOptions = options || {};

    this.callBase(element, options);
  },

  _init() {
    this._initEditStrategy();

    this.callBase();

    this._initKeyGetter();

    this._initActions();

    this._initSelectionModule();
  },

  _initKeyGetter() {
    this._keyGetter = compileGetter(this.option('keyExpr'));
  },

  _getActionsList() {
    return ['onSelectionChanging', 'onSelectionChanged'];
  },

  _initActions() {
    this._actions = {};
    const actions = this._getActionsList();

    actions.forEach((action) => {
      this._actions[action] = this._createActionByOption(action, {
        excludeValidators: ['disabled', 'readOnly'],
      }) ?? noop;
    });
  },

  _getKeysByItems(selectedItems) {
    return this._editStrategy.getKeysByItems(selectedItems);
  },

  _getItemsByKeys(selectedItemKeys, selectedItems) {
    return this._editStrategy.getItemsByKeys(selectedItemKeys, selectedItems);
  },

  _getKeyByIndex(index) {
    return this._editStrategy.getKeyByIndex(index);
  },

  _getIndexByKey(key) {
    return this._editStrategy.getIndexByKey(key);
  },

  _getIndexByItemData(itemData) {
    return this._editStrategy.getIndexByItemData(itemData);
  },

  _isKeySpecified() {
    return !!this._dataController.key();
  },

  _getCombinedFilter() {
    return this._dataController.filter();
  },

  key() {
    if (this.option('keyExpr')) return this.option('keyExpr');
    return this._dataController.key();
  },

  keyOf(item) {
    let key = item;

    if (this.option('keyExpr')) {
      key = this._keyGetter(item);
    } else if (this._dataController.store()) {
      key = this._dataController.keyOf(item);
    }

    return key;
  },

  _nullValueSelectionSupported() {
    return false;
  },

  _initSelectionModule() {
    const that = this;
    const { itemsGetter } = that._editStrategy;

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
      filter: that._getCombinedFilter.bind(that),
      totalCount() {
        const items = that.option('items');
        const totalCount = that._dataController.totalCount();
        return totalCount >= 0
          ? totalCount
          : that._getItemsCount(items);
      },
      key: that.key.bind(that),
      keyOf: that.keyOf.bind(that),
      load(options) {
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
      dataFields() {
        return that._dataController.select();
      },
      plainItems: itemsGetter.bind(that._editStrategy),
    });
  },

  _getItemsCount(items) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-return-assign
    return items.reduce((itemsCount, item) => itemsCount += item.items
      ? this._getItemsCount(item.items)
      : 1, 0);
  },

  _initEditStrategy() {
    const Strategy = PlainEditStrategy;
    this._editStrategy = new Strategy(this);
  },

  _getSelectedItemIndices(keys) {
    const that = this;
    const indices = [];

    keys = keys || this._selection.getSelectedItemKeys();

    that._editStrategy.beginCache();

    each(keys, (_, key) => {
      const selectedIndex = that._getIndexByKey(key);

      if (indexExists(selectedIndex)) {
        // @ts-expect-error
        indices.push(selectedIndex);
      }
    });

    that._editStrategy.endCache();

    return indices;
  },

  _initMarkup() {
    this._rendering = true;

    if (!this._dataController.isLoading()) {
      this._syncSelectionOptions().done(() => this._normalizeSelectedItems());
    }

    this.callBase();
  },
  _render() {
    this.callBase();

    this._rendering = false;
  },

  _fireContentReadyAction() {
    this._rendering = false;
    this._rendered = true;
    this.callBase.apply(this, arguments);
  },

  _syncSelectionOptions(byOption) {
    byOption = byOption || this._chooseSelectOption();

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
  },

  _chooseSelectOption() {
    let optionName = 'selectedIndex';

    const isOptionDefined = function (optionName) {
      const optionValue = this.option(optionName);
      const length = isDefined(optionValue) && optionValue.length;
      return length || optionName in this._userOptions;
    }.bind(this);

    if (isOptionDefined('selectedItems')) {
      optionName = 'selectedItems';
    } else if (isOptionDefined('selectedItem')) {
      optionName = 'selectedItem';
    } else if (isOptionDefined('selectedItemKeys')) {
      optionName = 'selectedItemKeys';
    }

    return optionName;
  },

  _compareKeys(oldKeys, newKeys) {
    if (oldKeys.length !== newKeys.length) {
      return false;
    }

    for (let i = 0; i < newKeys.length; i++) {
      if (oldKeys[i] !== newKeys[i]) {
        return false;
      }
    }

    return true;
  },

  _normalizeSelectedItems() {
    if (this.option('selectionMode') === 'none') {
      this._setOptionWithoutOptionChange('selectedItems', []);
      this._syncSelectionOptions('selectedItems');
    } else if (this.option('selectionMode') === 'single') {
      const newSelection = this.option('selectedItems');

      if (newSelection.length > 1 || !newSelection.length && this.option('selectionRequired') && this.option('items') && this.option('items').length) {
        const currentSelection = this._selection.getSelectedItems();
        let normalizedSelection = newSelection[0] === undefined ? currentSelection[0] : newSelection[0];

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
  },

  _itemClickHandler(e) {
    let itemSelectPromise = Deferred().resolve();
    const { callBase } = this;

    this._createAction((e) => {
      itemSelectPromise = this._itemSelectHandler(e.event) ?? itemSelectPromise;
    }, {
      validatingTargetName: 'itemElement',
    })({
      itemElement: $(e.currentTarget),
      event: e,
    });

    itemSelectPromise.always(() => {
      callBase.apply(this, arguments);
    });
  },

  _itemSelectHandler(e, shouldIgnoreSelectByClick) {
    let itemSelectPromise;

    if (!shouldIgnoreSelectByClick && !this.option('selectByClick')) {
      return;
    }

    const $itemElement = e.currentTarget;

    if (this.isItemSelected($itemElement)) {
      this.unselectItem(e.currentTarget);
    } else {
      itemSelectPromise = this.selectItem(e.currentTarget);
    }

    return itemSelectPromise?.promise();
  },

  _selectedItemElement(index) {
    return this._itemElements().eq(index);
  },

  _postprocessRenderItem(args) {
    if (this.option('selectionMode') !== 'none') {
      const $itemElement = $(args.itemElement);
      const normalizedItemIndex = this._editStrategy.getNormalizedIndex($itemElement);
      const isItemSelected = this._isItemSelected(normalizedItemIndex);

      this._processSelectableItem($itemElement, isItemSelected);
    }
  },

  _processSelectableItem($itemElement, isSelected) {
    $itemElement.toggleClass(this._selectedItemClass(), isSelected);
    this._setAriaSelectionAttribute($itemElement, String(isSelected));
  },

  _updateSelectedItems(args) {
    const that = this;
    const { addedItemKeys } = args;
    const { removedItemKeys } = args;

    if (that._rendered && (addedItemKeys.length || removedItemKeys.length)) {
      const selectionChangePromise = that._selectionChangePromise;
      if (!that._rendering) {
        const addedSelection = [];
        let normalizedIndex;
        const removedSelection = [];

        that._editStrategy.beginCache();

        for (let i = 0; i < addedItemKeys.length; i++) {
          normalizedIndex = that._getIndexByKey(addedItemKeys[i]);
          // @ts-expect-error
          addedSelection.push(normalizedIndex);
          that._addSelection(normalizedIndex);
        }

        for (let i = 0; i < removedItemKeys.length; i++) {
          normalizedIndex = that._getIndexByKey(removedItemKeys[i]);
          // @ts-expect-error
          removedSelection.push(normalizedIndex);
          that._removeSelection(normalizedIndex);
        }

        that._editStrategy.endCache();

        that._updateSelection(addedSelection, removedSelection);
      }

      when(selectionChangePromise).done(() => {
        this._actions.onSelectionChanged({
          addedItems: args.addedItems,
          removedItems: args.removedItems,
        });
      });
    }
  },

  _updateSelection: noop,

  _setAriaSelectionAttribute($target, value) {
    this.setAria('selected', value, $target);
  },

  _removeSelection(normalizedIndex) {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, false);
      // @ts-expect-error
      eventsEngine.triggerHandler($itemElement, 'stateChanged', false);
    }
  },

  _addSelection(normalizedIndex) {
    const $itemElement = this._editStrategy.getItemElement(normalizedIndex);

    if (indexExists(normalizedIndex)) {
      this._processSelectableItem($itemElement, true);
      // @ts-expect-error
      eventsEngine.triggerHandler($itemElement, 'stateChanged', true);
    }
  },

  _isItemSelected(index) {
    const key = this._getKeyByIndex(index);
    return this._selection.isItemSelected(key, { checkPending: true });
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'selectionMode':
        this._invalidate();
        break;
      case 'dataSource':
        if (!args.value || Array.isArray(args.value) && !args.value.length) {
          this.option('selectedItemKeys', []);
        }

        this.callBase(args);
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
        this.callBase(args);
    }
  },

  _clearSelectedItems() {
    this._setOptionWithoutOptionChange('selectedItems', []);
    this._syncSelectionOptions('selectedItems');
  },

  _waitDeletingPrepare($itemElement) {
    if ($itemElement.data(ITEM_DELETING_DATA_KEY)) {
      return Deferred().resolve().promise();
    }

    $itemElement.data(ITEM_DELETING_DATA_KEY, true);

    const deferred = Deferred();
    const deletingActionArgs = { cancel: false };
    const deletePromise = this._itemEventHandler($itemElement, 'onItemDeleting', deletingActionArgs, { excludeValidators: ['disabled', 'readOnly'] });

    when(deletePromise).always(function (value) {
      const deletePromiseExists = !deletePromise;
      const deletePromiseResolved = !deletePromiseExists && deletePromise.state() === 'resolved';
      const argumentsSpecified = !!arguments.length;

      const shouldDelete = deletePromiseExists || deletePromiseResolved && !argumentsSpecified || deletePromiseResolved && value;

      when(fromPromise(deletingActionArgs.cancel))
        .always(() => {
          $itemElement.data(ITEM_DELETING_DATA_KEY, false);
        })
        .done((cancel) => {
          shouldDelete && !cancel ? deferred.resolve() : deferred.reject();
        })
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .fail(deferred.reject);
    });

    return deferred.promise();
  },

  _deleteItemFromDS($item) {
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
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .fail(() => {
        deferred.reject();
      });

    deferred.always(() => {
      this.option('disabled', disabledState);
    });

    return deferred;
  },

  _tryRefreshLastPage() {
    const deferred = Deferred();

    if (this._isLastPage() || this.option('grouped')) {
      deferred.resolve();
    } else {
      this._refreshLastPage().done(() => {
        deferred.resolve();
      });
    }

    return deferred.promise();
  },

  _refreshLastPage() {
    this._expectLastItemLoading();
    return this._dataController.load();
  },

  _updateSelectionAfterDelete(index) {
    const key = this._getKeyByIndex(index);
    this._selection.deselect([key]);
  },

  _updateIndicesAfterIndex(index) {
    const itemElements = this._itemElements();
    for (let i = index + 1; i < itemElements.length; i++) {
      $(itemElements[i]).data(this._itemIndexKey(), i - 1);
    }
  },

  _simulateOptionChange(optionName) {
    const optionValue = this.option(optionName);

    if (optionValue instanceof DataSource) {
      return;
    }

    this._optionChangedAction({ name: optionName, fullName: optionName, value: optionValue });
  },

  isItemSelected(itemElement) {
    return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement));
  },

  selectItem(itemElement) {
    if (this.option('selectionMode') === 'none') return Deferred().resolve();

    const itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
    if (!indexExists(itemIndex)) {
      return Deferred().resolve();
    }

    const key = this._getKeyByIndex(itemIndex);

    if (this._selection.isItemSelected(key)) {
      return Deferred().resolve();
    }

    if (this.option('selectionMode') === 'single') {
      return this._selection.setSelection([key]);
    }

    const selectedItemKeys = this.option('selectedItemKeys') || [];
    return this._selection.setSelection([...selectedItemKeys, key], [key]);
  },

  unselectItem(itemElement) {
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

    this._selection.deselect([key]);
  },

  _deleteItemElementByIndex(index) {
    this._updateSelectionAfterDelete(index);
    this._updateIndicesAfterIndex(index);
    this._editStrategy.deleteItemAtIndex(index);
  },

  _afterItemElementDeleted($item, deletedActionArgs) {
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
  },

  deleteItem(itemElement) {
    const that = this;

    const deferred = Deferred();
    const $item = this._editStrategy.getItemElement(itemElement);
    const index = this._editStrategy.getNormalizedIndex(itemElement);
    const itemResponseWaitClass = this._itemResponseWaitClass();

    if (indexExists(index)) {
      this._waitDeletingPrepare($item).done(() => {
        $item.addClass(itemResponseWaitClass);
        const deletedActionArgs = that._extendActionArgs($item);
        that._deleteItemFromDS($item).done(() => {
          that._deleteItemElementByIndex(index);
          that._afterItemElementDeleted($item, deletedActionArgs);
          that._tryRefreshLastPage().done(() => {
            deferred.resolveWith(that);
          });
        }).fail(() => {
          $item.removeClass(itemResponseWaitClass);
          deferred.rejectWith(that);
        });
      }).fail(() => {
        deferred.rejectWith(that);
      });
    } else {
      deferred.rejectWith(that);
    }

    return deferred.promise();
  },

  reorderItem(itemElement, toItemElement) {
    const deferred = Deferred();

    const that = this;
    const strategy = this._editStrategy;

    const $movingItem = strategy.getItemElement(itemElement);
    const $destinationItem = strategy.getItemElement(toItemElement);
    const movingIndex = strategy.getNormalizedIndex(itemElement);
    const destinationIndex = strategy.getNormalizedIndex(toItemElement);

    const changingOption = this._dataController.getDataSource()
      ? 'dataSource'
      : 'items';

    const canMoveItems = indexExists(movingIndex) && indexExists(destinationIndex) && movingIndex !== destinationIndex;
    if (canMoveItems) {
      deferred.resolveWith(this);
    } else {
      deferred.rejectWith(this);
    }
    // @ts-expect-error
    return deferred.promise().done(function () {
      $destinationItem[strategy.itemPlacementFunc(movingIndex, destinationIndex)]($movingItem);

      strategy.moveItemAtIndexToIndex(movingIndex, destinationIndex);
      this._updateIndicesAfterIndex(movingIndex);
      that.option('selectedItems', that._getItemsByKeys(that._selection.getSelectedItemKeys(), that._selection.getSelectedItems()));

      if (changingOption === 'items') {
        that._simulateOptionChange(changingOption);
      }
      that._itemEventHandler($movingItem, 'onItemReordered', {
        fromIndex: strategy.getIndex(movingIndex),
        toIndex: strategy.getIndex(destinationIndex),
      }, {
        excludeValidators: ['disabled', 'readOnly'],
      });
    });
  },
});

export default CollectionWidget;
