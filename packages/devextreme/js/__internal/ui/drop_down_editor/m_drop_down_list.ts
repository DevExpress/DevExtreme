import type { SingleMultipleAllOrNone } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import type { GroupItem } from '@js/common/data';
import dataQuery from '@js/common/data/query';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import {
  ensureDefined,
  // @ts-expect-error ts-error
  grep,
  noop,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined, isObject, isWindow } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';
import type { dxDropDownListOptions } from '@js/ui/drop_down_editor/ui.drop_down_list';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Item } from '@js/ui/list';
import type { Properties as PopupProperties } from '@js/ui/popup';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import { getDataSourceOptions } from '@ts/data/data_converter/grouped';
import DropDownEditor from '@ts/ui/drop_down_editor/m_drop_down_editor';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import List from '@ts/ui/list/list.edit.search';

const window = getWindow();

const LIST_ITEM_SELECTOR = '.dx-list-item';
const LIST_ITEM_DATA_KEY = 'dxListItemData';
const DROPDOWNLIST_POPUP_WRAPPER_CLASS = 'dx-dropdownlist-popup-wrapper';

const SEARCH_EVENT = 'input';

const SEARCH_MODES = ['startswith', 'contains', 'endwith', 'notcontains'];

const useCompositionEvents = devices.real().platform !== 'android';

interface DropDownListProperties extends Omit<dxDropDownListOptions<DropDownList>,
'onOpened' | 'onClosed' |
'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  encodeNoDataText?: boolean;
}

class DropDownList<
  TProperties extends DropDownListProperties = DropDownListProperties,
> extends DropDownEditor<TProperties> {
  _list?: List;

  _$list?: dxElementWrapper;

  _listId?: string;

  _searchTimer?: ReturnType<typeof setTimeout>;

  _isLastMinSearchLengthExceeded?: boolean;

  _selectionChangedAction!: (event?: Record<string, unknown>) => void;

  _itemClickAction!: (event?: Record<string, unknown>) => void;

  _$customBoundaryContainer?: dxElementWrapper;

  _pageIndex?: number;

  _dataController?: any;

  _dataSource?: any;

  _isTextComposition?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    const parentSupportedKeys = super._supportedKeys();

    return {
      ...parentSupportedKeys,
      tab(e): void {
        if (this._allowSelectItemByTab()) {
          this._saveValueChangeEvent(e);
          const { focusedElement } = this._list.option();
          const $focusedItem = $(focusedElement);
          if ($focusedItem.length) {
            this._setSelectedElement($focusedItem);
          }
        }

        parentSupportedKeys.tab(e);
      },
      space: noop,
      home: noop,
      end: noop,
    };
  }

  _allowSelectItemByTab(): boolean | undefined {
    const { opened, applyValueMode } = this.option();
    return opened && applyValueMode === 'instantly';
  }

  _setSelectedElement($element): void {
    // @ts-expect-error ts-error
    const value = this._valueGetter(this._list._getItemData($element));
    this._setValue(value);
  }

  _setValue(value): void {
    this.option('value', value);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error ts-error
      ...DataExpressionMixin._dataExpressionDefaultOptions(),
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
    } as TProperties;
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
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
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      value: true,
      selectedItem: true,
      displayValue: true,
    });
  }

  _init(): void {
    super._init();
    // @ts-expect-error ts-error
    this._initDataExpressions();
    this._initActions();
    this._setListDataSource();
    this._validateSearchMode();
    this._clearSelectedItem();
    this._initItems();
  }

  _setListFocusedElementOptionChange(): void {
    // @ts-expect-error ts-error
    this._list._updateParentActiveDescendant = this._updateActiveDescendant.bind(this);
  }

  _initItems(): void {
    const { items } = this.option();

    if (items && !items.length && this._dataSource) {
      this.option().items = this._dataSource.items();
    }
  }

  _initActions(): void {
    this._initContentReadyAction();
    this._initSelectionChangedAction();
    this._initItemClickAction();
  }

  _initContentReadyAction(): void {
    // @ts-expect-error
    this._contentReadyAction = this._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initSelectionChangedAction(): void {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initItemClickAction(): void {
    this._itemClickAction = this._createActionByOption('onItemClick');
  }

  _initTemplates(): void {
    super._initTemplates();
    this._templateManager.addDefaultTemplates({
      item: new ChildDefaultTemplate('item'),
    });
  }

  _isEditable(): boolean | undefined {
    const { searchEnabled } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return super._isEditable() || searchEnabled;
  }

  _saveFocusOnWidget(): void {
    if (this._list?.initialOption('focusStateEnabled')) {
      this._focusInput();
    }
  }

  _fitIntoRange(value, start, end) {
    if (value > end) {
      return start;
    }
    if (value < start) {
      return end;
    }
    return value;
  }

  _items() {
    const items = this._getPlainItems(!this._list && this._dataSource.items());
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    const availableItems = new dataQuery(items).filter('disabled', '<>', true).toArray();

    return availableItems;
  }

  _calcNextItem(step) {
    const items = this._items();
    const nextIndex = this._fitIntoRange(this._getSelectedIndex() + step, 0, items.length - 1);
    return items[nextIndex];
  }

  _getSelectedIndex() {
    const items = this._items();
    const selectedItem = this.option('selectedItem');
    let result = -1;
    // @ts-expect-error
    each(items, (index, item) => {
      // @ts-expect-error ts-error
      if (this._isValueEquals(item, selectedItem)) {
        result = index;
        return false;
      }
    });

    return result;
  }

  _createPopup(): void {
    super._createPopup();
    this._updateCustomBoundaryContainer();
    // @ts-expect-error ts-error
    this._popup.$wrapper().addClass(this._popupWrapperClass());
    // @ts-expect-error ts-error
    const $popupContent = this._popup.$content();
    eventsEngine.off($popupContent, 'mouseup');
    eventsEngine.on($popupContent, 'mouseup', this._saveFocusOnWidget.bind(this));
  }

  _updateCustomBoundaryContainer(): void {
    const customContainer = this.option('dropDownOptions.container');
    // @ts-expect-error ts-error
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
  }

  _popupWrapperClass(): string {
    return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
  }

  _renderInputValue({ value, renderOnly }: { value?: unknown; renderOnly?: boolean } = {}) {
    // @ts-expect-error ts-error
    const currentValue = value ?? this._getCurrentValue();
    // @ts-expect-error ts-error
    this._rejectValueLoading();

    if (renderOnly) {
      return super._renderInputValue(currentValue);
    }

    return this
      ._loadInputValue(
        currentValue,
        // @ts-expect-error ts-error
        (...args) => { this._setSelectedItem(...args); },
      )
      .always(super._renderInputValue.bind(this, currentValue));
  }

  _loadInputValue(value, callback) {
    // @ts-expect-error ts-error
    return this._loadItem(value).always(callback);
  }

  _getItemFromPlain(value, cache?) {
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
      // @ts-expect-error ts-error
      // eslint-disable-next-line prefer-destructuring
      selectedItem = grep(plainItems, (item) => this._isValueEquals(this._valueGetter(item), value))[0];
    }

    return selectedItem;
  }

  _resetInputText(): void {
    this._renderInputValue({ renderOnly: true });
  }

  _loadItem(value, cache) {
    const selectedItem = this._getItemFromPlain(value, cache);

    return selectedItem !== undefined
      ? Deferred().resolve(selectedItem).promise()
      // @ts-expect-error ts-error
      : this._loadValue(value);
  }

  _getPlainItems(items?) {
    let plainItems: any = [];

    const { grouped } = this.option();

    items = items || this.option('items') || this._dataSource.items() || [];

    for (let i = 0; i < items.length; i++) {
      if (grouped && items[i]?.items) {
        plainItems = plainItems.concat(items[i].items);
      } else {
        plainItems.push(items[i]);
      }
    }

    return plainItems;
  }

  _updateActiveDescendant($target?): void {
    const opened = this.option('opened');
    const listFocusedItemId = this._list?.getFocusedItemId();
    const isElementOnDom = $(`#${listFocusedItemId}`).length > 0;
    const activedescendant = opened && isElementOnDom && listFocusedItemId;

    this.setAria({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      activedescendant: activedescendant || null,
    }, $target);
  }

  _setSelectedItem(item): void {
    const displayValue = this._displayValue(item);
    this.option('selectedItem', ensureDefined(item, null));
    this.option('displayValue', displayValue);
  }

  _displayValue(item) {
    // @ts-expect-error ts-error
    return this._displayGetter(item);
  }

  _refreshSelected(): void {
    const cache = {};
    // @ts-expect-error ts-error
    this._listItemElements().each((_, itemElement) => {
      const $itemElement = $(itemElement);
      // @ts-expect-error ts-error
      const itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

      const isItemSelected = this._isSelectedValue(itemValue, cache);

      if (isItemSelected) {
        // @ts-expect-error ts-error
        this._list.selectItem($itemElement);
      } else {
        // @ts-expect-error ts-error
        this._list.unselectItem($itemElement);
      }
    });
  }

  _popupShownHandler(): void {
    super._popupShownHandler();
    this._setFocusPolicy();
  }

  _setFocusPolicy(): void {
    if (!this.option('focusStateEnabled') || !this._list) {
      return;
    }

    this._list.option('focusedElement', null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isSelectedValue(value, cache?) {
    // @ts-expect-error ts-error
    return this._isValueEquals(value, this.option('value'));
  }

  _validateSearchMode(): void {
    const searchMode = this.option('searchMode');
    // @ts-expect-error ts-error
    const normalizedSearchMode = searchMode.toLowerCase();

    if (!SEARCH_MODES.includes(normalizedSearchMode)) {
      throw errors.Error('E1019', searchMode);
    }
  }

  _clearSelectedItem(): void {
    this.option('selectedItem', null);
  }

  _processDataSourceChanging(): void {
    // @ts-expect-error ts-error
    this._initDataController();
    this._setListOption('_dataController', this._dataController);
    this._setListDataSource();

    this._renderInputValue().fail(() => {
      if (this._isCustomValueAllowed()) {
        return;
      }
      this._clearSelectedItem();
    });
  }

  _isCustomValueAllowed() {
    return this.option('displayCustomValue');
  }

  clear(): void {
    super.clear();

    this._clearFilter();
    this._clearSelectedItem();
  }

  _listItemElements(): dxElementWrapper {
    return this._$list ? this._$list.find(LIST_ITEM_SELECTOR) : $();
  }

  _popupConfig(): PopupProperties {
    return {
      ...super._popupConfig(),
      templatesRenderAsynchronously: false,
      autoResizeEnabled: false,
      // @ts-expect-error ts-error
      maxHeight: this._getMaxHeight.bind(this),
    };
  }

  _renderPopupContent(): void {
    super._renderPopupContent();
    this._renderList();
  }

  _getKeyboardListeners(): any[] {
    const canListHaveFocus = this._canListHaveFocus();

    if (!canListHaveFocus) {
      return super._getKeyboardListeners().concat([this._list]);
    }

    return super._getKeyboardListeners();
  }

  _renderList(): void {
    // @ts-expect-error
    this._listId = `dx-${new Guid()._value}`;

    const $list = $('<div>')
      .attr('id', this._listId)
      // @ts-expect-error ts-error
      .appendTo(this._popup.$content());
    this._$list = $list;

    this._list = this._createComponent($list, List, this._listConfig());
    this._refreshList();

    this._renderPreventBlurOnListClick();
    this._setListFocusedElementOptionChange();
  }

  _renderPreventBlurOnListClick(): void {
    const eventName = addNamespace('mousedown', 'dxDropDownList');

    eventsEngine.off(this._$list, eventName);
    eventsEngine.on(this._$list, eventName, (e) => e.preventDefault());
  }

  _getControlsAria() {
    return this._list && this._listId;
  }

  _renderOpenedState(): void {
    super._renderOpenedState();
    this._list && this._updateActiveDescendant();
    this.setAria('owns', this._popup && this._popupContentId);
  }

  // eslint-disable-next-line class-methods-use-this
  _getAriaHasPopup(): string {
    return 'listbox';
  }

  _refreshList(): void {
    if (this._list && this._shouldRefreshDataSource()) {
      this._setListDataSource();
    }
  }

  _shouldRefreshDataSource(): boolean {
    // @ts-expect-error ts-error
    const dataSourceProvided = !!this._list.option('dataSource');

    return dataSourceProvided !== this._needPassDataSourceToList();
  }

  _isDesktopDevice(): boolean {
    return devices.real().deviceType === 'desktop';
  }

  _listConfig(): ListBaseProperties {
    const {
      noDataText,
      grouped,
      wrapItemText,
      itemTemplate,
      groupTemplate,
      hoverStateEnabled,
      focusStateEnabled,
      encodeNoDataText,
      useItemTextAsTitle,
    } = this.option();

    const options = {
      selectionMode: 'single' as SingleMultipleAllOrNone,
      _templates: this.option('_templates'),
      templateProvider: this.option('templateProvider'),
      noDataText,
      encodeNoDataText,
      grouped,
      wrapItemText,
      useItemTextAsTitle,
      onContentReady: this._listContentReadyHandler.bind(this),
      itemTemplate,
      indicateLoading: false,
      // @ts-expect-error ts-error
      keyExpr: this._getCollectionKeyExpr(),
      // @ts-expect-error ts-error
      displayExpr: this._displayGetterExpr(),
      groupTemplate,
      onItemClick: this._listItemClickAction.bind(this),
      dataSource: this._getDataSource(),
      _dataController: this._dataController,
      hoverStateEnabled: this._isDesktopDevice() ? hoverStateEnabled : false,
      focusStateEnabled: this._isDesktopDevice() ? focusStateEnabled : false,
      _onItemsRendered: (): void => {
        // @ts-expect-error ts-error
        this._popup.repaint();
      },
    };

    if (!this._canListHaveFocus()) {
      // @ts-expect-error ts-error
      options.tabIndex = null;
    }

    return options;
  }

  // eslint-disable-next-line class-methods-use-this
  _canListHaveFocus(): boolean {
    return false;
  }

  _getDataSource() {
    return this._needPassDataSourceToList() ? this._dataSource : null;
  }

  _dataSourceOptions() {
    return {
      paginate: false,
    };
  }

  _getSpecificDataSourceOption(): DataSourceLike<Item>
    | DataSourceOptions<GroupItem<Item>>
    | null
    | undefined {
    const { dataSource, grouped } = this.option();

    if (dataSource && grouped) {
      return getDataSourceOptions(dataSource);
    }

    return dataSource;
  }

  _dataSourceFromUrlLoadMode(): string {
    return 'raw';
  }

  _listContentReadyHandler(): void {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._list = this._list || this._$list.dxList('instance');

    if (!this.option('deferRendering')) {
      this._refreshSelected();
    }

    this._updatePopupWidth();
    this._updateListDimensions();
    // @ts-expect-error
    this._contentReadyAction();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setListOption(optionName, value?): void {
    // @ts-expect-error ts-error
    this._setWidgetOption('_list', arguments);
  }

  _listItemClickAction(e): void {
    this._listItemClickHandler(e);
    this._itemClickAction(e);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _listItemClickHandler(e?): void {}

  _setListDataSource(): void {
    if (!this._list) {
      return;
    }

    this._setListOption('dataSource', this._getDataSource());

    if (!this._needPassDataSourceToList()) {
      this._setListOption('items', []);
    }
  }

  _needPassDataSourceToList(): boolean {
    const { showDataBeforeSearch } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return showDataBeforeSearch || this._isMinSearchLengthExceeded();
  }

  _isMinSearchLengthExceeded(): boolean {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this._searchValue().toString().length >= this.option('minSearchLength');
  }

  _needClearFilter(): boolean {
    return this._canKeepDataSource() ? false : this._needPassDataSourceToList();
  }

  _canKeepDataSource(): boolean {
    const isMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    return this._dataController.isLoaded()
            && this.option('showDataBeforeSearch')
            && this.option('minSearchLength')
            && !isMinSearchLengthExceeded
            && !this._isLastMinSearchLengthExceeded;
  }

  _searchValue() {
    return this._input().val() || '';
  }

  _getSearchEvent() {
    return addNamespace(SEARCH_EVENT, `${this.NAME}Search`);
  }

  _getCompositionStartEvent() {
    return addNamespace('compositionstart', `${this.NAME}CompositionStart`);
  }

  _getCompositionEndEvent() {
    return addNamespace('compositionend', `${this.NAME}CompositionEnd`);
  }

  _getSetFocusPolicyEvent() {
    return addNamespace('input', `${this.NAME}FocusPolicy`);
  }

  _renderEvents(): void {
    super._renderEvents();
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
  }

  _shouldRenderSearchEvent(): boolean | undefined {
    // @ts-expect-error ts-error
    return this.option('searchEnabled');
  }

  _refreshEvents(): void {
    eventsEngine.off(this._input(), this._getSearchEvent());
    eventsEngine.off(this._input(), this._getSetFocusPolicyEvent());
    if (useCompositionEvents) {
      eventsEngine.off(this._input(), this._getCompositionStartEvent());
      eventsEngine.off(this._input(), this._getCompositionEndEvent());
    }

    super._refreshEvents();
  }

  // @ts-expect-error ts-error
  // eslint-disable-next-line consistent-return
  _isTextCompositionInProgress(value?: boolean) {
    if (arguments.length) {
      this._isTextComposition = value;
    } else {
      return this._isTextComposition;
    }
  }

  _searchHandler(e, searchValue?): void {
    if (this._isTextCompositionInProgress()) {
      return;
    }

    if (!this._isMinSearchLengthExceeded()) {
      this._searchCanceled();
      return;
    }

    const { searchTimeout } = this.option();

    if (searchTimeout) {
      this._clearSearchTimer();
      this._searchTimer = setTimeout(
        () => { this._searchDataSource(searchValue); },
        searchTimeout,
      );
    } else {
      this._searchDataSource(searchValue);
    }
  }

  _searchCanceled(): void {
    this._clearSearchTimer();
    if (this._needClearFilter()) {
      this._filterDataSource(null);
    }
    this._refreshList();
  }

  _searchDataSource(searchValue = this._searchValue()): void {
    this._filterDataSource(searchValue);
  }

  _filterDataSource(searchValue): void {
    this._clearSearchTimer();

    const dataController = this._dataController;
    // @ts-expect-error ts-error
    dataController.searchExpr(this.option('searchExpr') || this._displayGetterExpr());
    dataController.searchOperation(this.option('searchMode'));
    dataController.searchValue(searchValue);
    dataController.load().done(this._dataSourceFiltered.bind(this, searchValue));
  }

  _clearFilter(): void {
    const dataController = this._dataController;
    dataController.searchValue() && dataController.searchValue(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dataSourceFiltered(searchValue?): void {
    this._isLastMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    this._refreshList();
    this._refreshPopupVisibility();
  }

  _shouldOpenPopup(): boolean {
    return this._hasItemsToShow();
  }

  _refreshPopupVisibility(): void {
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
  }

  _dataSourceChangedHandler(newItems): void {
    if (this._dataController.pageIndex() === 0) {
      this.option().items = newItems;
    } else {
      // @ts-expect-error ts-error
      this.option().items = this.option().items.concat(newItems);
    }
  }

  _hasItemsToShow(): boolean {
    const dataController = this._dataController;
    const resultItems = dataController.items() || [];
    const resultAmount = resultItems.length;
    const isMinSearchLengthExceeded = this._needPassDataSourceToList();

    return !!(isMinSearchLengthExceeded && resultAmount);
  }

  _clearSearchTimer(): void {
    clearTimeout(this._searchTimer);
    delete this._searchTimer;
  }

  _popupShowingHandler(): void {
    this._updatePopupWidth();
    this._updateListDimensions();
  }

  _dimensionChanged(): void {
    super._dimensionChanged();

    this._updateListDimensions();
  }

  _needPopupRepaint(): boolean {
    const dataController = this._dataController;
    const currentPageIndex = dataController.pageIndex();
    const needRepaint = (isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex)
      // @ts-expect-error ts-error
      || (dataController.isLastPage() && !this._list._scrollViewIsFull());

    this._pageIndex = currentPageIndex;

    return needRepaint;
  }

  _updateListDimensions(): void {
    if (!this._popup) {
      return;
    }

    if (this._needPopupRepaint()) {
      this._popup.repaint();
    }

    if (this._list) {
      this._list.updateDimensions();
    }
  }

  _getMaxHeight(): number {
    const $element = this.$element();
    const $customBoundaryContainer = this._$customBoundaryContainer;
    // @ts-expect-error ts-error
    const offsetTop = $element.offset().top - ($customBoundaryContainer ? $customBoundaryContainer.offset().top : 0);
    const windowHeight = getOuterHeight(window);
    const containerHeight = $customBoundaryContainer ? Math.min(getOuterHeight($customBoundaryContainer), windowHeight) : windowHeight;
    const maxHeight = Math.max(offsetTop, containerHeight - offsetTop - getOuterHeight($element));

    return Math.min(containerHeight * 0.5, maxHeight);
  }

  _clean(): void {
    if (this._list) {
      delete this._list;
    }

    delete this._isLastMinSearchLengthExceeded;

    super._clean();
  }

  _dispose(): void {
    this._clearSearchTimer();
    super._dispose();
  }

  _setCollectionWidgetOption(): void {
    // @ts-expect-error ts-error
    this._setListOption.apply(this, arguments);
  }

  _setSubmitValue(): void {
    const value = this.option('value');
    // @ts-expect-error ts-error
    const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  }

  _shouldUseDisplayValue(value): boolean {
    // @ts-expect-error ts-error
    return this.option('valueExpr') === 'this' && isObject(value);
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    // @ts-expect-error ts-error
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'hoverStateEnabled':
      case 'focusStateEnabled':
        this._isDesktopDevice() && this._setListOption(args.name, args.value);
        super._optionChanged(args);
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
        // @ts-expect-error ts-error
        this._setListOption('keyExpr', this._getCollectionKeyExpr());
        break;
      case 'displayExpr':
        this._renderValue();
        // @ts-expect-error ts-error
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
        super._optionChanged(args);
    }
  }
}

// @ts-expect-error ts-error
DropDownList.include(DataExpressionMixin);

registerComponent('dxDropDownList', DropDownList);

export default DropDownList;
