import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import dataQuery from '@js/common/data/query';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import {
  ensureDefined,
  // @ts-expect-error
  grep,
  noop,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined, isObject, isWindow } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import List from '@js/ui/list_light';
import errors from '@js/ui/widget/ui.errors';
import DataConverterMixin from '@ts/ui/shared/m_grouped_data_converter_mixin';

import DropDownEditor from './m_drop_down_editor';

const window = getWindow();

const LIST_ITEM_SELECTOR = '.dx-list-item';
const LIST_ITEM_DATA_KEY = 'dxListItemData';
const DROPDOWNLIST_POPUP_WRAPPER_CLASS = 'dx-dropdownlist-popup-wrapper';

const SEARCH_EVENT = 'input';

const SEARCH_MODES = ['startswith', 'contains', 'endwith', 'notcontains'];

const useCompositionEvents = devices.real().platform !== 'android';

const DropDownList = DropDownEditor.inherit({

  _supportedKeys() {
    const parent = this.callBase();

    return extend({}, parent, {
      tab(e) {
        if (this._allowSelectItemByTab()) {
          this._saveValueChangeEvent(e);
          const $focusedItem = $(this._list.option('focusedElement'));
          $focusedItem.length && this._setSelectedElement($focusedItem);
        }

        parent.tab.apply(this, arguments);
      },
      space: noop,
      home: noop,
      end: noop,
    });
  },

  _allowSelectItemByTab() {
    return this.option('opened') && this.option('applyValueMode') === 'instantly';
  },

  _setSelectedElement($element) {
    const value = this._valueGetter(this._list._getItemData($element));
    this._setValue(value);
  },

  _setValue(value) {
    this.option('value', value);
  },

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(this.callBase(), extend(DataExpressionMixin._dataExpressionDefaultOptions(), {
      displayValue: undefined,
      searchEnabled: false,
      searchMode: 'contains',
      searchTimeout: 500,
      minSearchLength: 0,
      searchExpr: null,
      valueChangeEvent: 'input change keyup',
      selectedItem: null,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      encodeNoDataText: false,
      onSelectionChanged: null,
      onItemClick: noop,
      showDataBeforeSearch: false,
      grouped: false,
      groupTemplate: 'group',
      popupPosition: {
        my: 'left top',
        at: 'left bottom',
        offset: { h: 0, v: 0 },
        collision: 'flip',
      },
      wrapItemText: false,
      useItemTextAsTitle: false,
    }));
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device: { platform: 'ios' },
        options: {
          popupPosition: { offset: { v: -1 } },
        },
      },
      {
        device: { platform: 'generic' },
        options: {
          buttonsLocation: 'bottom center',
        },
      },
    ]);
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      value: true,
      selectedItem: true,
      displayValue: true,
    });
  },

  _init() {
    this.callBase();

    this._initDataExpressions();
    this._initActions();
    this._setListDataSource();
    this._validateSearchMode();
    this._clearSelectedItem();
    this._initItems();
  },

  _setListFocusedElementOptionChange() {
    this._list._updateParentActiveDescendant = this._updateActiveDescendant.bind(this);
  },

  _initItems() {
    const { items } = this.option();
    if (items && !items.length && this._dataSource) {
      this.option().items = this._dataSource.items();
    }
  },

  _initActions() {
    this._initContentReadyAction();
    this._initSelectionChangedAction();
    this._initItemClickAction();
  },

  _initContentReadyAction() {
    this._contentReadyAction = this._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  },

  _initSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  },

  _initItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },

  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      item: new ChildDefaultTemplate('item'),
    });
  },

  _isEditable() {
    return this.callBase() || this.option('searchEnabled');
  },

  _saveFocusOnWidget() {
    if (this._list && this._list.initialOption('focusStateEnabled')) {
      this._focusInput();
    }
  },

  _fitIntoRange(value, start, end) {
    if (value > end) {
      return start;
    }
    if (value < start) {
      return end;
    }
    return value;
  },

  _items() {
    const items = this._getPlainItems(!this._list && this._dataSource.items());
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    const availableItems = new dataQuery(items).filter('disabled', '<>', true).toArray();

    return availableItems;
  },

  _calcNextItem(step) {
    const items = this._items();
    const nextIndex = this._fitIntoRange(this._getSelectedIndex() + step, 0, items.length - 1);
    return items[nextIndex];
  },

  _getSelectedIndex() {
    const items = this._items();
    const selectedItem = this.option('selectedItem');
    let result = -1;
    // @ts-expect-error
    each(items, (index, item) => {
      if (this._isValueEquals(item, selectedItem)) {
        result = index;
        return false;
      }
    });

    return result;
  },

  _createPopup() {
    this.callBase();
    this._updateCustomBoundaryContainer();
    this._popup.$wrapper().addClass(this._popupWrapperClass());

    const $popupContent = this._popup.$content();
    eventsEngine.off($popupContent, 'mouseup');
    eventsEngine.on($popupContent, 'mouseup', this._saveFocusOnWidget.bind(this));
  },

  _updateCustomBoundaryContainer() {
    const customContainer = this.option('dropDownOptions.container');
    const $container = customContainer && $(customContainer);

    if ($container && $container.length && !isWindow($container.get(0))) {
      const $containerWithParents = [].slice.call($container.parents());
      // @ts-expect-error
      $containerWithParents.unshift($container.get(0));

      // @ts-expect-error
      each($containerWithParents, (i, parent) => {
        if (parent === $('body').get(0)) {
          return false;
        } if (window.getComputedStyle(parent).overflowY === 'hidden') {
          this._$customBoundaryContainer = $(parent);
          return false;
        }
      });
    }
  },

  _popupWrapperClass() {
    return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
  },

  _renderInputValue() {
    const value = this._getCurrentValue();
    this._rejectValueLoading();

    return this._loadInputValue(value, this._setSelectedItem.bind(this))
      .always(this.callBase.bind(this, value));
  },

  _loadInputValue(value, callback) {
    return this._loadItem(value).always(callback);
  },

  _getItemFromPlain(value, cache) {
    let plainItems;
    let selectedItem;

    if (cache && typeof value !== 'object') {
      if (!cache.itemByValue) {
        cache.itemByValue = {};
        plainItems = this._getPlainItems();
        plainItems.forEach(function (item) {
          cache.itemByValue[this._valueGetter(item)] = item;
        }, this);
      }
      selectedItem = cache.itemByValue[value];
    }

    if (!selectedItem) {
      plainItems = this._getPlainItems();
      // eslint-disable-next-line prefer-destructuring
      selectedItem = grep(plainItems, (item) => this._isValueEquals(this._valueGetter(item), value))[0];
    }

    return selectedItem;
  },

  _loadItem(value, cache) {
    const selectedItem = this._getItemFromPlain(value, cache);

    return selectedItem !== undefined
      ? Deferred().resolve(selectedItem).promise()
      : this._loadValue(value);
  },

  _getPlainItems(items) {
    let plainItems: any = [];

    items = items || this.option('items') || this._dataSource.items() || [];

    for (let i = 0; i < items.length; i++) {
      if (items[i] && items[i].items) {
        plainItems = plainItems.concat(items[i].items);
      } else {
        plainItems.push(items[i]);
      }
    }

    return plainItems;
  },

  _updateActiveDescendant($target) {
    const opened = this.option('opened');
    const listFocusedItemId = this._list?.getFocusedItemId();
    const isElementOnDom = $(`#${listFocusedItemId}`).length > 0;
    const activedescendant = opened && isElementOnDom && listFocusedItemId;

    this.setAria({
      activedescendant: activedescendant || null,
    }, $target);
  },

  _setSelectedItem(item) {
    const displayValue = this._displayValue(item);
    this.option('selectedItem', ensureDefined(item, null));
    this.option('displayValue', displayValue);
  },

  _displayValue(item) {
    return this._displayGetter(item);
  },

  _refreshSelected() {
    const cache = {};
    this._listItemElements().each((_, itemElement) => {
      const $itemElement = $(itemElement);
      const itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

      const isItemSelected = this._isSelectedValue(itemValue, cache);

      if (isItemSelected) {
        this._list.selectItem($itemElement);
      } else {
        this._list.unselectItem($itemElement);
      }
    });
  },

  _popupShownHandler() {
    this.callBase();
    this._setFocusPolicy();
  },

  _setFocusPolicy() {
    if (!this.option('focusStateEnabled') || !this._list) {
      return;
    }

    this._list.option('focusedElement', null);
  },

  _isSelectedValue(value) {
    return this._isValueEquals(value, this.option('value'));
  },

  _validateSearchMode() {
    const searchMode = this.option('searchMode');
    const normalizedSearchMode = searchMode.toLowerCase();

    if (!SEARCH_MODES.includes(normalizedSearchMode)) {
      throw errors.Error('E1019', searchMode);
    }
  },

  _clearSelectedItem() {
    this.option('selectedItem', null);
  },

  _processDataSourceChanging() {
    this._initDataController();
    this._setListOption('_dataController', this._dataController);
    this._setListDataSource();

    this._renderInputValue().fail(() => {
      if (this._isCustomValueAllowed()) {
        return;
      }
      this._clearSelectedItem();
    });
  },

  _isCustomValueAllowed() {
    return this.option('displayCustomValue');
  },

  clear() {
    this.callBase();

    this._clearFilter();
    this._clearSelectedItem();
  },

  _listItemElements() {
    return this._$list ? this._$list.find(LIST_ITEM_SELECTOR) : $();
  },

  _popupConfig() {
    return extend(this.callBase(), {
      templatesRenderAsynchronously: false,
      autoResizeEnabled: false,
      maxHeight: this._getMaxHeight.bind(this),
    });
  },

  _renderPopupContent() {
    this.callBase();
    this._renderList();
  },

  _getKeyboardListeners() {
    const canListHaveFocus = this._canListHaveFocus();

    return this.callBase().concat([!canListHaveFocus && this._list]);
  },

  _renderList() {
    // @ts-expect-error
    this._listId = `dx-${new Guid()._value}`;

    const $list = $('<div>')
      .attr('id', this._listId)
      .appendTo(this._popup.$content());
    this._$list = $list;

    this._list = this._createComponent($list, List, this._listConfig());
    this._refreshList();

    this._renderPreventBlurOnListClick();
    this._setListFocusedElementOptionChange();
  },

  _renderPreventBlurOnListClick() {
    const eventName = addNamespace('mousedown', 'dxDropDownList');

    eventsEngine.off(this._$list, eventName);
    eventsEngine.on(this._$list, eventName, (e) => e.preventDefault());
  },

  _getControlsAria() {
    return this._list && this._listId;
  },

  _renderOpenedState() {
    this.callBase();

    this._list && this._updateActiveDescendant();
    this.setAria('owns', this._popup && this._popupContentId);
  },

  _getAriaHasPopup() {
    return 'listbox';
  },

  _refreshList() {
    if (this._list && this._shouldRefreshDataSource()) {
      this._setListDataSource();
    }
  },

  _shouldRefreshDataSource() {
    const dataSourceProvided = !!this._list.option('dataSource');

    return dataSourceProvided !== this._needPassDataSourceToList();
  },

  _isDesktopDevice() {
    return devices.real().deviceType === 'desktop';
  },

  _listConfig() {
    const options = {
      selectionMode: 'single',
      _templates: this.option('_templates'),
      templateProvider: this.option('templateProvider'),
      noDataText: this.option('noDataText'),
      encodeNoDataText: this.option('encodeNoDataText'),
      grouped: this.option('grouped'),
      wrapItemText: this.option('wrapItemText'),
      useItemTextAsTitle: this.option('useItemTextAsTitle'),
      onContentReady: this._listContentReadyHandler.bind(this),
      itemTemplate: this.option('itemTemplate'),
      indicateLoading: false,
      keyExpr: this._getCollectionKeyExpr(),
      displayExpr: this._displayGetterExpr(),
      groupTemplate: this.option('groupTemplate'),
      onItemClick: this._listItemClickAction.bind(this),
      dataSource: this._getDataSource(),
      _dataController: this._dataController,
      hoverStateEnabled: this._isDesktopDevice() ? this.option('hoverStateEnabled') : false,
      focusStateEnabled: this._isDesktopDevice() ? this.option('focusStateEnabled') : false,
      _onItemsRendered: (): void => {
        this._popup.repaint();
      },
    };

    if (!this._canListHaveFocus()) {
      // @ts-expect-error
      options.tabIndex = null;
    }

    return options;
  },

  _canListHaveFocus: () => false,

  _getDataSource() {
    return this._needPassDataSourceToList() ? this._dataSource : null;
  },

  _dataSourceOptions() {
    return {
      paginate: false,
    };
  },

  _getGroupedOption() {
    return this.option('grouped');
  },

  _dataSourceFromUrlLoadMode() {
    return 'raw';
  },

  _listContentReadyHandler() {
    this._list = this._list || this._$list.dxList('instance');

    if (!this.option('deferRendering')) {
      this._refreshSelected();
    }

    this._updatePopupWidth();
    this._updateListDimensions();

    this._contentReadyAction();
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setListOption(optionName, value) {
    this._setWidgetOption('_list', arguments);
  },

  _listItemClickAction(e) {
    this._listItemClickHandler(e);
    this._itemClickAction(e);
  },

  _listItemClickHandler: noop,

  _setListDataSource() {
    if (!this._list) {
      return;
    }

    this._setListOption('dataSource', this._getDataSource());

    if (!this._needPassDataSourceToList()) {
      this._setListOption('items', []);
    }
  },

  _needPassDataSourceToList() {
    return this.option('showDataBeforeSearch') || this._isMinSearchLengthExceeded();
  },

  _isMinSearchLengthExceeded() {
    return this._searchValue().toString().length >= this.option('minSearchLength');
  },

  _needClearFilter() {
    return this._canKeepDataSource() ? false : this._needPassDataSourceToList();
  },

  _canKeepDataSource() {
    const isMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    return this._dataController.isLoaded()
            && this.option('showDataBeforeSearch')
            && this.option('minSearchLength')
            && !isMinSearchLengthExceeded
            && !this._isLastMinSearchLengthExceeded;
  },

  _searchValue() {
    return this._input().val() || '';
  },

  _getSearchEvent() {
    return addNamespace(SEARCH_EVENT, `${this.NAME}Search`);
  },

  _getCompositionStartEvent() {
    return addNamespace('compositionstart', `${this.NAME}CompositionStart`);
  },

  _getCompositionEndEvent() {
    return addNamespace('compositionend', `${this.NAME}CompositionEnd`);
  },

  _getSetFocusPolicyEvent() {
    return addNamespace('input', `${this.NAME}FocusPolicy`);
  },

  _renderEvents() {
    this.callBase();
    eventsEngine.on(this._input(), this._getSetFocusPolicyEvent(), () => { this._setFocusPolicy(); });

    if (this._shouldRenderSearchEvent()) {
      eventsEngine.on(this._input(), this._getSearchEvent(), (e) => { this._searchHandler(e); });
      if (useCompositionEvents) {
        eventsEngine.on(this._input(), this._getCompositionStartEvent(), () => { this._isTextCompositionInProgress(true); });
        eventsEngine.on(this._input(), this._getCompositionEndEvent(), (e) => {
          this._isTextCompositionInProgress(undefined);
          this._searchHandler(e, this._searchValue());
        });
      }
    }
  },

  _shouldRenderSearchEvent() {
    return this.option('searchEnabled');
  },

  _refreshEvents() {
    eventsEngine.off(this._input(), this._getSearchEvent());
    eventsEngine.off(this._input(), this._getSetFocusPolicyEvent());
    if (useCompositionEvents) {
      eventsEngine.off(this._input(), this._getCompositionStartEvent());
      eventsEngine.off(this._input(), this._getCompositionEndEvent());
    }

    this.callBase();
  },

  _isTextCompositionInProgress(value) {
    if (arguments.length) {
      this._isTextComposition = value;
    } else {
      return this._isTextComposition;
    }
  },

  _searchHandler(e, searchValue) {
    if (this._isTextCompositionInProgress()) {
      return;
    }

    if (!this._isMinSearchLengthExceeded()) {
      this._searchCanceled();
      return;
    }

    const searchTimeout = this.option('searchTimeout');

    if (searchTimeout) {
      this._clearSearchTimer();
      this._searchTimer = setTimeout(
        () => { this._searchDataSource(searchValue); },
        searchTimeout,
      );
    } else {
      this._searchDataSource(searchValue);
    }
  },

  _searchCanceled() {
    this._clearSearchTimer();
    if (this._needClearFilter()) {
      this._filterDataSource(null);
    }
    this._refreshList();
  },

  _searchDataSource(searchValue = this._searchValue()) {
    this._filterDataSource(searchValue);
  },

  _filterDataSource(searchValue) {
    this._clearSearchTimer();

    const dataController = this._dataController;

    dataController.searchExpr(this.option('searchExpr') || this._displayGetterExpr());
    dataController.searchOperation(this.option('searchMode'));
    dataController.searchValue(searchValue);
    dataController.load().done(this._dataSourceFiltered.bind(this, searchValue));
  },

  _clearFilter() {
    const dataController = this._dataController;
    dataController.searchValue() && dataController.searchValue(null);
  },

  _dataSourceFiltered() {
    this._isLastMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    this._refreshList();
    this._refreshPopupVisibility();
  },

  _shouldOpenPopup() {
    return this._hasItemsToShow();
  },

  _refreshPopupVisibility() {
    if (this.option('readOnly') || !this._searchValue()) {
      return;
    }

    const shouldOpenPopup = this._shouldOpenPopup();

    if (shouldOpenPopup && !this._isFocused()) {
      return;
    }

    this.option('opened', shouldOpenPopup);

    if (shouldOpenPopup) {
      this._updatePopupWidth();
      this._updateListDimensions();
    }
  },

  _dataSourceChangedHandler(newItems) {
    if (this._dataController.pageIndex() === 0) {
      this.option().items = newItems;
    } else {
      this.option().items = this.option().items.concat(newItems);
    }
  },

  _hasItemsToShow() {
    const dataController = this._dataController;
    const resultItems = dataController.items() || [];
    const resultAmount = resultItems.length;
    const isMinSearchLengthExceeded = this._needPassDataSourceToList();

    return !!(isMinSearchLengthExceeded && resultAmount);
  },

  _clearSearchTimer() {
    clearTimeout(this._searchTimer);
    delete this._searchTimer;
  },

  _popupShowingHandler() {
    this._updatePopupWidth();
    this._updateListDimensions();
  },

  _dimensionChanged() {
    this.callBase();

    this._updateListDimensions();
  },

  _needPopupRepaint() {
    const dataController = this._dataController;
    const currentPageIndex = dataController.pageIndex();
    const needRepaint = (isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex) || (dataController.isLastPage() && !this._list._scrollViewIsFull());

    this._pageIndex = currentPageIndex;

    return needRepaint;
  },

  _updateListDimensions() {
    if (!this._popup) {
      return;
    }

    if (this._needPopupRepaint()) {
      this._popup.repaint();
    }

    this._list && this._list.updateDimensions();
  },

  _getMaxHeight() {
    const $element = this.$element();
    const $customBoundaryContainer = this._$customBoundaryContainer;
    const offsetTop = $element.offset().top - ($customBoundaryContainer ? $customBoundaryContainer.offset().top : 0);
    const windowHeight = getOuterHeight(window);
    const containerHeight = $customBoundaryContainer ? Math.min(getOuterHeight($customBoundaryContainer), windowHeight) : windowHeight;
    const maxHeight = Math.max(offsetTop, containerHeight - offsetTop - getOuterHeight($element));

    return Math.min(containerHeight * 0.5, maxHeight);
  },

  _clean() {
    if (this._list) {
      delete this._list;
    }
    delete this._isLastMinSearchLengthExceeded;
    this.callBase();
  },

  _dispose() {
    this._clearSearchTimer();
    this.callBase();
  },

  _setCollectionWidgetOption() {
    this._setListOption.apply(this, arguments);
  },

  _setSubmitValue() {
    const value = this.option('value');
    const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  },

  _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && isObject(value);
  },

  _optionChanged(args) {
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'hoverStateEnabled':
      case 'focusStateEnabled':
        this._isDesktopDevice() && this._setListOption(args.name, args.value);
        this.callBase(args);
        break;
      case 'items':
        if (!this.option('dataSource')) {
          this._processDataSourceChanging();
        }
        break;
      case 'dataSource':
        this._processDataSourceChanging();
        break;
      case 'valueExpr':
        this._renderValue();
        this._setListOption('keyExpr', this._getCollectionKeyExpr());
        break;
      case 'displayExpr':
        this._renderValue();
        this._setListOption('displayExpr', this._displayGetterExpr());
        break;
      case 'searchMode':
        this._validateSearchMode();
        break;
      case 'minSearchLength':
        this._refreshList();
        break;
      case 'searchEnabled':
      case 'showDataBeforeSearch':
      case 'searchExpr':
        this._invalidate();
        break;
      case 'onContentReady':
        this._initContentReadyAction();
        break;
      case 'onSelectionChanged':
        this._initSelectionChangedAction();
        break;
      case 'onItemClick':
        this._initItemClickAction();
        break;
      case 'grouped':
      case 'groupTemplate':
      case 'wrapItemText':
      case 'noDataText':
      case 'encodeNoDataText':
      case 'useItemTextAsTitle':
        this._setListOption(args.name);
        break;
      case 'displayValue':
        this.option('text', args.value);
        break;
      case 'itemTemplate':
      case 'searchTimeout':
        break;
      case 'selectedItem':
        if (args.previousValue !== args.value) {
          this._selectionChangedAction({ selectedItem: args.value });
        }
        break;
      default:
        this.callBase(args);
    }
  },

}).include(DataExpressionMixin, DataConverterMixin);

registerComponent('dxDropDownList', DropDownList);

export default DropDownList;
