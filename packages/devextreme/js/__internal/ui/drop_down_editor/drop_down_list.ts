import type { SingleMultipleAllOrNone } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSource, GroupItem } from '@js/common/data';
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
  // @ts-expect-error add export
  grep,
  noop,
} from '@js/core/utils/common';
import { Deferred, type DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getOuterHeight } from '@js/core/utils/size';
import { isDefined, isObject, isWindow } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';
import type { dxDropDownListOptions } from '@js/ui/drop_down_editor/ui.drop_down_list';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Item, ItemClickEvent } from '@js/ui/list';
import type { Properties as PopupProperties } from '@js/ui/popup';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import { getDataSourceOptions } from '@ts/data/data_converter/grouped';
import type DataController from '@ts/ui/collection/m_data_controller';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import List from '@ts/ui/list/list.edit.search';

const window = getWindow();

const LIST_ITEM_SELECTOR = '.dx-list-item';
const LIST_ITEM_DATA_KEY = 'dxListItemData';
const DROPDOWNLIST_POPUP_WRAPPER_CLASS = 'dx-dropdownlist-popup-wrapper';

const SEARCH_EVENT = 'input';

const SEARCH_MODES = ['startswith', 'contains', 'endwith', 'notcontains'];

const useCompositionEvents = devices.real().platform !== 'android';

export interface ItemCache { itemByValue?: Record<PropertyKey, Item> }

interface DropDownListProperties extends Omit<dxDropDownListOptions<DropDownList>,
  'onOpened' | 'onClosed'
  | 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
  | 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  encodeNoDataText?: boolean;
  displayCustomValue?: boolean;
  items?: Item[];
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

  _itemClickAction!: (event?: ItemClickEvent<Item>) => void;

  _$customBoundaryContainer?: dxElementWrapper;

  _pageIndex?: number;

  _dataController!: DataController;

  _dataSource!: DataSource;

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

  _setSelectedElement($element: dxElementWrapper): void {
    // @ts-expect-error refactor DataExpressionMixin
    const value = this._valueGetter(this._list._getItemData($element));
    this._setValue(value);
  }

  _setValue(value: unknown): void {
    this.option('value', value);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error refactor DataExpressionMixin
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
    ] as DefaultOptionsRule<TProperties>[]);
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
    // @ts-expect-error refactor DataExpressionMixin
    this._initDataExpressions();
    this._initActions();
    this._setListDataSource();
    this._validateSearchMode();
    this._clearSelectedItem();
    this._initItems();
  }

  _setListFocusedElementOptionChange(): void {
    if (!this._list) {
      return;
    }

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
    // @ts-expect-error _contentReadyAction not typed on base class
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

  _fitIntoRange(value: number, start: number, end: number): number {
    if (value > end) {
      return start;
    }
    if (value < start) {
      return end;
    }
    return value;
  }

  _items(): Item[] {
    const items = this._getPlainItems(!this._list && this._dataSource.items());
    // @ts-expect-error dataQuery is callable as a constructor
    // eslint-disable-next-line new-cap
    return new dataQuery(items).filter('disabled', '<>', true).toArray() as Item[];
  }

  _calcNextItem(step: number): Item {
    const items = this._items();
    const nextIndex = this._fitIntoRange(this._getSelectedIndex() + step, 0, items.length - 1);
    return items[nextIndex];
  }

  _getSelectedIndex(): number {
    const items = this._items();
    const { selectedItem } = this.option();
    // @ts-expect-error refactor DataExpressionMixin
    return items.findIndex((item) => this._isValueEquals(item, selectedItem));
  }

  _createPopup(): void {
    super._createPopup();
    this._updateCustomBoundaryContainer();
    this._popup?.$wrapper()?.addClass(this._popupWrapperClass());
    const $popupContent = this._popup?.$content();
    eventsEngine.off($popupContent, 'mouseup');
    eventsEngine.on($popupContent, 'mouseup', this._saveFocusOnWidget.bind(this));
  }

  _updateCustomBoundaryContainer(): void {
    const { dropDownOptions } = this.option();
    const customContainer = dropDownOptions?.container;
    const $container = $(customContainer);

    if ($container.length && !isWindow($container.get(0))) {
      const $containerWithParents: Element[] = [].slice.call($container.parents());

      $containerWithParents.unshift($container.get(0));

      const overflowParent = $containerWithParents.find(
        (parent) => parent !== $('body').get(0) && window.getComputedStyle(parent).overflowY === 'hidden',
      );

      if (overflowParent) {
        this._$customBoundaryContainer = $(overflowParent);
      }
    }
  }

  _popupWrapperClass(): string {
    return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
  }

  _renderInputValue(
    { value, renderOnly }: { value?: unknown; renderOnly?: boolean } = {},
  ): DeferredObj<unknown> {
    // @ts-expect-error refactor DataExpressionMixin
    const currentValue = value ?? this._getCurrentValue();
    // @ts-expect-error refactor DataExpressionMixin
    this._rejectValueLoading();

    if (renderOnly) {
      return super._renderInputValue(currentValue);
    }

    return this
      ._loadInputValue(
        currentValue,
        (...args: [unknown]) => { this._setSelectedItem(...args as [Item]); },
      )
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .always(super._renderInputValue.bind(this, currentValue));
  }

  _loadInputValue(value: unknown, callback: (...args: [unknown]) => void): DeferredObj<unknown> {
    return (this._loadItem(value) as DeferredObj<unknown>).always(callback);
  }

  _getItemFromPlain(value: unknown, cache?: ItemCache): Item | undefined {
    let plainItems: Item[] = [];
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let selectedItem: Item | undefined;

    if (cache && typeof value !== 'object') {
      if (!cache.itemByValue) {
        cache.itemByValue = {};
        plainItems = this._getPlainItems();
        const { itemByValue } = cache;
        plainItems.forEach((item) => {
          // @ts-expect-error refactor DataExpressionMixin
          itemByValue[this._valueGetter(item)] = item;
        }, this);
      }
      selectedItem = cache.itemByValue[value as PropertyKey];
    }

    if (!selectedItem) {
      plainItems = this._getPlainItems();
      // eslint-disable-next-line prefer-destructuring
      selectedItem = grep(
        plainItems,
        // @ts-expect-error refactor DataExpressionMixin
        (item: Item) => this._isValueEquals(this._valueGetter(item), value) as boolean,
      )[0];
    }

    return selectedItem;
  }

  _resetInputText(): void {
    this._renderInputValue({ renderOnly: true });
  }

  _loadItem(value: unknown, cache?: ItemCache): DeferredObj<unknown> | Promise<unknown> {
    const selectedItem = this._getItemFromPlain(value, cache);

    if (selectedItem !== undefined) {
      return Deferred().resolve(selectedItem);
    }

    // @ts-expect-error refactor DataExpressionMixin
    return this._loadValue(value) as DeferredObj<unknown>;
  }

  _getPlainItems(inputItems?: Item[] | GroupItem<Item>[] | false): Item[] {
    const { grouped, items: optionItems } = this.option();
    const items: (Item | GroupItem<Item>)[] = (
      Array.isArray(inputItems) ? inputItems : undefined
    ) ?? optionItems ?? this._dataSource.items() ?? [];

    return items.flatMap((item) => {
      const groupedItem = item as GroupItem<Item>;
      return (grouped && groupedItem.items) ? groupedItem.items as Item[] : [item as Item];
    });
  }

  _updateActiveDescendant($target?: dxElementWrapper): void {
    const { opened } = this.option();
    const listFocusedItemId = this._list?.getFocusedItemId();
    const isElementOnDom = $(`#${listFocusedItemId}`).length > 0;
    const activedescendant = opened && isElementOnDom && listFocusedItemId;

    this.setAria({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      activedescendant: activedescendant || null,
    }, $target);
  }

  _setSelectedItem(item: Item): void {
    const displayValue = this._displayValue(item);
    this.option('selectedItem', ensureDefined(item, null));
    this.option('displayValue', displayValue);
  }

  _displayValue(item: Item): string {
    // @ts-expect-error refactor DataExpressionMixin
    return this._displayGetter(item) as string;
  }

  _refreshSelected(): void {
    const cache: ItemCache = {};
    const elements = Array.from(this._listItemElements() as unknown as ArrayLike<Element>);

    elements.forEach((itemElement) => {
      const $itemElement = $(itemElement);
      // @ts-expect-error refactor DataExpressionMixin
      const itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

      const isItemSelected = this._isSelectedValue(itemValue, cache);

      if (isItemSelected) {
        this._list?.selectItem(itemElement);
      } else {
        this._list?.unselectItem(itemElement);
      }
    });
  }

  _popupShownHandler(): void {
    super._popupShownHandler();
    this._setFocusPolicy();
  }

  _setFocusPolicy(): void {
    const { focusStateEnabled } = this.option();

    if (!focusStateEnabled || !this._list) {
      return;
    }

    this._list.option('focusedElement', null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isSelectedValue(value: unknown, cache?: ItemCache): boolean {
    const { value: optionValue } = this.option();

    // @ts-expect-error refactor DataExpressionMixin
    return this._isValueEquals(value, optionValue) as boolean;
  }

  _validateSearchMode(): void {
    const { searchMode } = this.option();

    if (!searchMode) {
      return;
    }

    const normalizedSearchMode = searchMode?.toLowerCase();

    if (!SEARCH_MODES.includes(normalizedSearchMode)) {
      throw errors.Error('E1019', searchMode);
    }
  }

  _clearSelectedItem(): void {
    this.option('selectedItem', null);
  }

  _processDataSourceChanging(): void {
    // @ts-expect-error refactor DataExpressionMixin
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

  _isCustomValueAllowed(): boolean {
    const { displayCustomValue } = this.option();

    return Boolean(displayCustomValue);
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
    this._updateCustomBoundaryContainer();
    const maxHeight = this._getMaxHeight();

    return {
      ...super._popupConfig(),
      templatesRenderAsynchronously: false,
      autoResizeEnabled: false,
      maxHeight,
    } as PopupProperties;
  }

  _renderPopupContent(): void {
    super._renderPopupContent();
    this._renderList();
  }

  _getKeyboardListeners(): unknown[] {
    const canListHaveFocus = this._canListHaveFocus();

    if (!canListHaveFocus) {
      return super._getKeyboardListeners().concat([this._list]);
    }

    return super._getKeyboardListeners();
  }

  _renderList(): void {
    // @ts-expect-error Guid has no _value
    this._listId = `dx-${new Guid()._value}`;

    const $list = $('<div>')
      .attr('id', this._listId)
      .appendTo(this._popup?.$content() as dxElementWrapper);
    this._$list = $list;

    this._list = this._createComponent($list, List, this._listConfig());
    this._refreshList();

    this._renderPreventBlurOnListClick();
    this._setListFocusedElementOptionChange();
  }

  _renderPreventBlurOnListClick(): void {
    const eventName = addNamespace('mousedown', 'dxDropDownList');

    eventsEngine.off(this._$list, eventName);
    eventsEngine.on(this._$list, eventName, (e: MouseEvent) => e.preventDefault());
  }

  _getControlsAria(): string | undefined {
    return this._list && this._listId;
  }

  _renderOpenedState(): void {
    super._renderOpenedState();
    if (this._list) {
      this._updateActiveDescendant();
    }
    this.setAria('owns', this._popup && this._popupContentId);
  }

  _getAriaHasPopup(): string {
    return 'listbox';
  }

  _refreshList(): void {
    if (this._list && this._shouldRefreshDataSource()) {
      this._setListDataSource();
    }
  }

  _shouldRefreshDataSource(): boolean {
    const { dataSource } = this._list?.option() ?? {};

    return Boolean(dataSource) !== this._needPassDataSourceToList();
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
      // @ts-expect-error refactor DataExpressionMixin
      keyExpr: this._getCollectionKeyExpr(),
      // @ts-expect-error refactor DataExpressionMixin
      displayExpr: this._displayGetterExpr(),
      groupTemplate,
      onItemClick: this._listItemClickAction.bind(this),
      dataSource: this._getDataSource(),
      _dataController: this._dataController,
      hoverStateEnabled: this._isDesktopDevice() ? hoverStateEnabled : false,
      focusStateEnabled,
      _onItemsRendered: (): void => {
        this._popup?.repaint();
      },
    };

    if (!this._canListHaveFocus()) {
      // @ts-expect-error Fix on List level
      options.tabIndex = null;
    }

    return options;
  }

  _canListHaveFocus(): boolean {
    return false;
  }

  _getDataSource(): DataSourceLike<Item> | null {
    return this._needPassDataSourceToList() ? this._dataSource : null;
  }

  _dataSourceOptions(): Partial<DataSourceOptions<Item>> {
    return {
      paginate: false,
    };
  }

  _getSpecificDataSourceOption(): DataSourceLike<Item>
    | DataSourceOptions<GroupItem<Item>>
    | null
    | undefined {
    const { grouped, dataSource } = this.option();

    if (dataSource && grouped) {
      return getDataSourceOptions(dataSource);
    }

    return dataSource;
  }

  _dataSourceFromUrlLoadMode(): string {
    return 'raw';
  }

  _listContentReadyHandler(): void {
    if (!this._$list) {
      return;
    }

    const { deferRendering } = this.option();

    this._list = List.getInstance<List>(this._$list);

    if (!deferRendering) {
      this._refreshSelected();
    }

    this._updatePopupWidth();
    this._updateListDimensions();
    this._contentReadyAction?.();
  }

  _setListOption<K extends keyof ListBaseProperties>(
    optionName: K, value?: ListBaseProperties[K]
  ): void;
  _setListOption(optionName: string, value?: unknown): void;
  _setListOption(...args: [string, unknown?]): void {
    // @ts-expect-error fix on Widget level
    this._setWidgetOption('_list', args);
  }

  _listItemClickAction(e: ItemClickEvent<Item>): void {
    this._listItemClickHandler(e);
    this._itemClickAction(e);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _listItemClickHandler(e?: ItemClickEvent<Item>): void { }

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
    const { minSearchLength } = this.option();

    return this._searchValue().toString().length >= (minSearchLength ?? 0);
  }

  _needClearFilter(): boolean {
    return this._canKeepDataSource() ? false : this._needPassDataSourceToList();
  }

  _canKeepDataSource(): boolean {
    const isMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    const { showDataBeforeSearch, minSearchLength } = this.option();

    return this._dataController.isLoaded() as boolean
      && Boolean(showDataBeforeSearch)
      && Boolean(minSearchLength)
      && !isMinSearchLengthExceeded
      && !this._isLastMinSearchLengthExceeded;
  }

  _searchValue(): string {
    return this._input().val() || '';
  }

  _getSearchEvent(): string {
    return addNamespace(SEARCH_EVENT, `${this.NAME}Search`);
  }

  _getCompositionStartEvent(): string {
    return addNamespace('compositionstart', `${this.NAME}CompositionStart`);
  }

  _getCompositionEndEvent(): string {
    return addNamespace('compositionend', `${this.NAME}CompositionEnd`);
  }

  _getSetFocusPolicyEvent(): string {
    return addNamespace('input', `${this.NAME}FocusPolicy`);
  }

  _renderEvents(): void {
    super._renderEvents();
    eventsEngine.on(
      this._input(),
      this._getSetFocusPolicyEvent(),
      () => { this._setFocusPolicy(); },
    );

    if (this._shouldRenderSearchEvent()) {
      eventsEngine.on(
        this._input(),
        this._getSearchEvent(),
        (e: InputEvent) => { this._searchHandler(e); },
      );
      if (useCompositionEvents) {
        eventsEngine.on(
          this._input(),
          this._getCompositionStartEvent(),
          () => { this._isTextCompositionInProgress(true); },
        );
        eventsEngine.on(
          this._input(),
          this._getCompositionEndEvent(),
          (e: CompositionEvent) => {
            this._isTextCompositionInProgress(undefined);
            this._searchHandler(e, this._searchValue());
          },
        );
      }
    }
  }

  _shouldRenderSearchEvent(): boolean | undefined {
    const { searchEnabled } = this.option();

    return searchEnabled;
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

  _isTextCompositionInProgress(value?: boolean): boolean | undefined {
    if (arguments.length) {
      this._isTextComposition = value;
    } else {
      return this._isTextComposition;
    }

    return undefined;
  }

  _searchHandler(e?: InputEvent | CompositionEvent, searchValue?: string): void {
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
      // eslint-disable-next-line no-restricted-globals
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

  _filterDataSource(searchValue: string | null): void {
    const { searchExpr } = this.option();
    this._clearSearchTimer();

    const dataController = this._dataController;
    // @ts-expect-error refactor DataExpressionMixin
    dataController.searchExpr(searchExpr ?? this._displayGetterExpr());
    dataController.searchOperation(this.option('searchMode'));
    dataController.searchValue(searchValue);
    dataController.load().done(this._dataSourceFiltered.bind(this, searchValue));
  }

  _clearFilter(): void {
    const dataController = this._dataController;

    // @ts-expect-error fix argument type in m_data_controller.ts
    if (dataController.searchValue()) {
      dataController.searchValue(null);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dataSourceFiltered(searchValue?: string | null): void {
    this._isLastMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
    this._refreshList();
    this._refreshPopupVisibility();
  }

  _shouldOpenPopup(): boolean {
    return this._hasItemsToShow();
  }

  _refreshPopupVisibility(): void {
    const { readOnly } = this.option();

    if (readOnly || !this._searchValue()) {
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

  _dataSourceChangedHandler(newItems: Item[]): void {
    if (this._dataController.pageIndex() === 0) {
      this.option().items = newItems;
    } else {
      this.option().items = (this.option().items ?? []).concat(newItems);
    }
  }

  _hasItemsToShow(): boolean {
    const dataController = this._dataController;
    const resultItems = dataController.items() ?? [];
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
    this._updatePopupMaxHeight();
    this._updateListDimensions();
  }

  _updatePopupMaxHeight(): void {
    const cachedMaxHeight = this._options.cache('dropDownOptions')?.maxHeight;

    if (cachedMaxHeight === undefined) {
      const maxHeight = this._getMaxHeight();
      this._setPopupOption('maxHeight', maxHeight);
    }
  }

  _dimensionChanged(): void {
    super._dimensionChanged();

    this._updateListDimensions();
    this._updatePopupMaxHeight();
  }

  _needPopupRepaint(): boolean {
    const dataController = this._dataController;
    const currentPageIndex = dataController.pageIndex();
    const needRepaint = (isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex)
      || (dataController.isLastPage() as boolean && !this._list?._scrollViewIsFull());

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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._list.updateDimensions();
    }
  }

  _getMaxHeight(): number {
    const $element = this.$element();
    const $customBoundaryContainer = this._$customBoundaryContainer;

    const offsetTop = ($element.offset()?.top ?? 0) - (
      $customBoundaryContainer ? $customBoundaryContainer.offset()?.top ?? 0 : 0
    );

    const windowHeight = getOuterHeight(window);

    const containerHeight = $customBoundaryContainer
      ? Math.min(getOuterHeight($customBoundaryContainer), windowHeight)
      : windowHeight;

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

  _setCollectionWidgetOption(...args: Parameters<DropDownList['_setListOption']>): void {
    this._setListOption(...args);
  }

  _setSubmitValue(): void {
    const { value } = this.option();
    // @ts-expect-error refactor DataExpressionMixin
    const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  }

  _shouldUseDisplayValue(value: unknown): boolean {
    const { valueExpr } = this.option();
    return valueExpr === 'this' && isObject(value);
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    // @ts-expect-error refactor DataExpressionMixin
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'hoverStateEnabled':
        if (this._isDesktopDevice()) {
          this._setListOption(args.name, args.value);
        }
        super._optionChanged(args);
        break;
      case 'focusStateEnabled':
        this._setListOption(args.name, args.value);
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
        // @ts-expect-error refactor DataExpressionMixin
        this._setListOption('keyExpr', this._getCollectionKeyExpr());
        break;
      case 'displayExpr':
        this._renderValue();
        // @ts-expect-error refactor DataExpressionMixin
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

// @ts-expect-error refactor DataExpressionMixin
DropDownList.include(DataExpressionMixin);

registerComponent('dxDropDownList', DropDownList);

export default DropDownList;
