import type { template } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import Action from '@js/core/action';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import type {
  DeepPartial,
} from '@js/core/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import {
  // @ts-expect-error ts-error
  deferRenderer,
  ensureDefined,
} from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import { findTemplates } from '@js/core/utils/template_manager';
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import type { DataSourceOptions } from '@js/data/data_source';
import DataHelperMixin from '@js/data_helper';
import type {
  Cancelable, DxEvent, EventInfo, ItemInfo,
} from '@js/events';
import type { CollectionWidgetItem as CollectionWidgetItemProperties, CollectionWidgetOptions, ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import { focusable } from '@js/ui/widget/selectors';
import { getPublicElement } from '@ts/core/m_element';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type CollectionItem from '@ts/ui/collection/m_item';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

const COLLECTION_CLASS = 'dx-collection';
const ITEM_CLASS = 'dx-item';
const CONTENT_CLASS_POSTFIX = '-content';
const ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';
const ITEM_DATA_KEY = 'dxItemData';
const ITEM_INDEX_KEY = 'dxItemIndex';
const ITEM_TEMPLATE_ID_PREFIX = 'tmpl-';
const ITEMS_OPTIONS_NAME = 'dxItem';
const SELECTED_ITEM_CLASS = 'dx-item-selected';
const ITEM_RESPONSE_WAIT_CLASS = 'dx-item-response-wait';
const EMPTY_COLLECTION = 'dx-empty-collection';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const ITEM_PATH_REGEX = /^([^.]+\[\d+\]\.)+([\w.]+)$/;
const ANONYMOUS_TEMPLATE_NAME = 'item';

const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const FOCUS_PAGE_UP = 'pageup';
const FOCUS_PAGE_DOWN = 'pagedown';
const FOCUS_LAST = 'last';
const FOCUS_FIRST = 'first';

export type DataChangeType = 'insert' | 'update' | 'remove';

export interface DataChange<TItem = CollectionItem, TKey = number | string> {
  key: TKey;
  type: DataChangeType;
  data: DeepPartial<TItem>;
}

type ItemTemplate<TItem> = template | (
  (itemData: TItem, itemIndex: number, itemElement: Element) => string | dxElementWrapper
);
export interface ItemRenderInfo<TItem> {
  index: number;
  itemData: TItem;
  container: dxElementWrapper;
  contentClass: string;
  defaultTemplateName: ItemTemplate<TItem> | undefined;
  uniqueKey?: string;
  templateProperty?: string;
}

export interface PostprocessRenderItemInfo<TItem> {
  itemElement: dxElementWrapper;
  itemContent: dxElementWrapper;
  itemData: TItem;
  itemIndex: number;
}

export interface CollectionWidgetBaseProperties<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TComponent extends CollectionWidget<any, TItem, TKey> | any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
  focusedElement?: dxElementWrapper;

  focusOnSelectedItem?: boolean;

  encodeNoDataText?: boolean;

  _itemAttributes?: Record<string, string>;

  selectOnFocus?: boolean;
}

class CollectionWidget<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetBaseProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends Widget<TProperties> {
  private _focusedItemId?: string;

  // eslint-disable-next-line no-restricted-globals
  private _itemFocusTimeout?: ReturnType<typeof setTimeout>;

  private _itemRenderAction?: (event?: Partial<EventInfo<unknown> & ItemInfo<TItem>>) => void;

  _displayGetter?: unknown;

  _shouldSkipSelectOnFocus?: boolean;

  _renderedItemsCount?: number;

  _startIndexForAppendedItems?: number | null;

  _$noData?: dxElementWrapper;

  _itemFocusHandler?: () => void;

  _inkRipple?: {
    showWave: (config: {
      element: dxElementWrapper;
      event: unknown;
    }) => void;
    hideWave: (config: {
      element: dxElementWrapper;
      event: unknown;
    }) => void;
  };

  _supportedKeys(): Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void> {
    const space = (e): void => {
      e.preventDefault();
      this._enterKeyHandler(e);
    };
    const move = (location, e): void => {
      if (!isCommandKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        this._moveFocus(location, e);
      }
    };

    return {
      ...super._supportedKeys(),
      space,
      enter: this._enterKeyHandler,
      leftArrow: move.bind(this, FOCUS_LEFT),
      rightArrow: move.bind(this, FOCUS_RIGHT),
      upArrow: move.bind(this, FOCUS_UP),
      downArrow: move.bind(this, FOCUS_DOWN),
      pageUp: move.bind(this, FOCUS_UP),
      pageDown: move.bind(this, FOCUS_DOWN),
      home: move.bind(this, FOCUS_FIRST),
      end: move.bind(this, FOCUS_LAST),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _getHandlerExtendedParams(
    e: Record<string, unknown>,
    $target: dxElementWrapper,
  ): Record<string, unknown> {
    const params = extend({}, e, {
      target: $target.get(0),
      currentTarget: $target.get(0),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return params;
  }

  _enterKeyHandler(e: KeyboardEvent): void {
    const { focusedElement } = this.option();

    const $itemElement = $(focusedElement);

    if (!$itemElement.length) {
      return;
    }

    const itemData = this._getItemData($itemElement);
    // @ts-expect-error ts-error
    if (itemData?.onClick) {
      // @ts-expect-error ts-error
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
        event: e,
      });
    }
    // @ts-expect-error ts-error
    this._itemClickHandler(this._getHandlerExtendedParams(e, $itemElement));
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      selectOnFocus: false,
      loopItemFocus: true,
      items: [],
      itemTemplate: 'item',
      onItemRendered: null,
      onItemClick: null,
      onItemHold: null,
      itemHoldTimeout: 750,
      onItemContextMenu: null,
      onFocusedItemChanged: null,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      encodeNoDataText: false,
      dataSource: null,
      _dataController: null,

      _itemAttributes: {},
      itemTemplateProperty: 'template',
      focusOnSelectedItem: true,
      focusedElement: null,

      displayExpr: undefined,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      disabledExpr(data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data ? data.disabled : undefined;
      },
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      visibleExpr(data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data ? data.visible : undefined;
      },
    };
  }

  _init(): void {
    this._compileDisplayGetter();
    // @ts-expect-error ts-error
    this._initDataController();
    super._init();

    this._activeStateUnit = `.${ITEM_CLASS}`;

    this._cleanRenderedItems();
    // @ts-expect-error ts-error
    this._refreshDataSource();
  }

  _compileDisplayGetter(): void {
    // @ts-expect-error ts-error
    const { displayExpr } = this.option();

    this._displayGetter = displayExpr ? compileGetter(displayExpr) : undefined;
  }

  _initTemplates(): void {
    this._initItemsFromMarkup();

    this._initDefaultItemTemplate();
    super._initTemplates();
  }

  // eslint-disable-next-line class-methods-use-this
  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initDefaultItemTemplate(): void {
    const fieldsMap = this._getFieldsMap();
    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container: dxElementWrapper, data) => {
        if (isPlainObject(data)) {
          this._prepareDefaultItemTemplate(data, $container);
        } else {
          if (fieldsMap && isFunction(fieldsMap.text)) {
            // eslint-disable-next-line no-param-reassign
            data = fieldsMap.text(data);
          }
          $container.text(String(ensureDefined(data, '')));
        }
      }, this._getBindableFields(), this.option('integrationOptions.watchMethod'), fieldsMap),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _getBindableFields(): string[] {
    return ['text', 'html'];
  }

  _getFieldsMap(): { text: unknown } | undefined {
    if (this._displayGetter) {
      return { text: this._displayGetter };
    }

    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  _prepareDefaultItemTemplate(
    data: CollectionWidgetItemProperties,
    $container: dxElementWrapper,
  ): void {
    const { text, html } = data;

    if (isDefined(text)) {
      $container.text(text);
    }

    if (isDefined(html)) {
      $container.html(html);
    }
  }

  _initItemsFromMarkup(): void {
    const rawItems = findTemplates(this.$element(), ITEMS_OPTIONS_NAME);
    // @ts-expect-error ts-error
    if (!rawItems.length || this.option('items').length) {
      return;
    }

    const items = rawItems.map(({ element, options }) => {
      // @ts-expect-error ts-error
      const isTemplateRequired = /\S/.test(element.innerHTML) && !options.template;

      if (isTemplateRequired) {
        options.template = this._prepareItemTemplate(element);
      } else {
        $(element).remove();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return options;
    });

    this.option('items', items);
  }

  _prepareItemTemplate(item: Element): string {
    const templateId = `${ITEM_TEMPLATE_ID_PREFIX}${new Guid()}`;
    const $template = $(item)
      .detach()
      .clone()
      .removeAttr('data-options')
      .addClass(TEMPLATE_WRAPPER_CLASS);

    this._saveTemplate(templateId, $template);

    return templateId;
  }

  // eslint-disable-next-line class-methods-use-this
  _dataSourceOptions(): DataSourceOptions {
    return { paginate: false };
  }

  _cleanRenderedItems(): void {
    this._renderedItemsCount = 0;
  }

  _focusTarget(): dxElementWrapper {
    return this.$element();
  }

  _focusInHandler(e: DxEvent): void {
    super._focusInHandler(e);

    if (!this._isFocusTarget(e.target)) {
      return;
    }
    // @ts-expect-error ts-error
    const $focusedElement = $(this.option('focusedElement'));
    if ($focusedElement.length) {
      // NOTE: If focusedElement is set, selection was already processed on its focusing.
      this._shouldSkipSelectOnFocus = true;
      this._setFocusedItem($focusedElement);
      this._shouldSkipSelectOnFocus = false;
    } else {
      const $activeItem = this._getActiveItem();
      if ($activeItem.length) {
        this.option('focusedElement', getPublicElement($activeItem));
      }
    }
  }

  _focusOutHandler(e: DxEvent): void {
    super._focusOutHandler(e);

    const { focusedElement } = this.option();
    const $target = $(focusedElement);

    this._updateFocusedItemState($target, false);
  }

  _findActiveTarget($element: dxElementWrapper): dxElementWrapper {
    return $element.find(this._activeStateUnit);
  }

  _getActiveItem(last?: boolean): dxElementWrapper {
    const { focusedElement } = this.option();

    const $focusedElement = $(focusedElement);

    if ($focusedElement.length) {
      return $focusedElement;
    }

    const { focusOnSelectedItem, selectedIndex } = this.option();

    let index = focusOnSelectedItem ? selectedIndex : 0;

    const activeElements = this._getActiveElement();
    const lastIndex = activeElements.length - 1;

    // @ts-expect-error ts-error
    if (index < 0) {
      index = last ? lastIndex : 0;
    }
    // @ts-expect-error ts-error
    return activeElements.eq(index);
  }

  // eslint-disable-next-line consistent-return
  _moveFocus(
    location: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: unknown,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): boolean | undefined | void {
    const $items = this._getAvailableItems();
    let $newTarget: dxElementWrapper = $();

    switch (location) {
      case FOCUS_PAGE_UP:
      case FOCUS_UP:
        $newTarget = this._prevItem($items);
        break;
      case FOCUS_PAGE_DOWN:
      case FOCUS_DOWN:
        $newTarget = this._nextItem($items);
        break;
      case FOCUS_RIGHT:
        $newTarget = this.option('rtlEnabled') ? this._prevItem($items) : this._nextItem($items);
        break;
      case FOCUS_LEFT:
        $newTarget = this.option('rtlEnabled') ? this._nextItem($items) : this._prevItem($items);
        break;
      case FOCUS_FIRST:
        $newTarget = $items.first();
        break;
      case FOCUS_LAST:
        $newTarget = $items.last();
        break;
      default:
        return false;
    }

    if ($newTarget.length !== 0) {
      this.option('focusedElement', getPublicElement($newTarget));
    }
  }

  _getVisibleItems($itemElements?: dxElementWrapper): dxElementWrapper {
    const $items = $itemElements ?? this._itemElements();
    return $items.filter(':visible');
  }

  _getAvailableItems($itemElements?: dxElementWrapper): dxElementWrapper {
    return this._getVisibleItems($itemElements);
  }

  _prevItem($items: dxElementWrapper): dxElementWrapper {
    const $target = this._getActiveItem();
    const targetIndex = $items.index($target);
    const $last = $items.last();
    let $item = $($items[targetIndex - 1]);
    const loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $last;
    }

    return $item;
  }

  _nextItem($items: dxElementWrapper): dxElementWrapper {
    const $target = this._getActiveItem(true);
    const targetIndex = $items.index($target);
    const $first = $items.first();
    let $item = $($items[targetIndex + 1]);
    const loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $first;
    }

    return $item;
  }

  _selectFocusedItem($target: dxElementWrapper): void {
    // @ts-expect-error ts-error
    this.selectItem($target);
  }

  _updateFocusedItemState(
    target: dxElementWrapper | Element | undefined,
    isFocused: boolean,
    needCleanItemId?: boolean | undefined,
  ): void {
    const $target = $(target);

    if ($target.length) {
      this._refreshActiveDescendant();
      this._refreshItemId($target, needCleanItemId);
      this._toggleFocusClass(isFocused, $target);
    }

    this._updateParentActiveDescendant();
  }

  // eslint-disable-next-line class-methods-use-this
  _getElementClassToSkipRefreshId(): string {
    return '';
  }

  _shouldSkipRefreshId(target: Element | dxElementWrapper): boolean {
    const elementClass = this._getElementClassToSkipRefreshId();
    const shouldSkipRefreshId = $(target).hasClass(elementClass);

    return shouldSkipRefreshId;
  }

  _refreshActiveDescendant($target?: dxElementWrapper): void {
    const { focusedElement } = this.option();

    if (isDefined(focusedElement)) {
      const shouldSetExistingId = this._shouldSkipRefreshId(focusedElement);
      const id = shouldSetExistingId ? $(focusedElement).attr('id') : this.getFocusedItemId();

      this.setAria('activedescendant', id, $target);

      return;
    }

    this.setAria('activedescendant', null, $target);
  }

  _refreshItemId(
    $target: dxElementWrapper,
    needCleanItemId: boolean | undefined,
  ): void {
    const { focusedElement } = this.option();
    const shouldSkipRefreshId = this._shouldSkipRefreshId($target);

    if (shouldSkipRefreshId) {
      return;
    }

    if (!needCleanItemId && focusedElement) {
      this.setAria('id', this.getFocusedItemId(), $target);
    } else {
      this.setAria('id', null, $target);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _isDisabled($element: dxElementWrapper): boolean {
    return $element && $($element).attr('aria-disabled') === 'true';
  }

  _setFocusedItem($target: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!$target || !$target.length) {
      return;
    }

    this._updateFocusedItemState($target, true);
    // @ts-expect-error ts-error
    this.onFocusedItemChanged(this.getFocusedItemId());

    const { selectOnFocus } = this.option();
    const isTargetDisabled = this._isDisabled($target);

    if (selectOnFocus && !isTargetDisabled && !this._shouldSkipSelectOnFocus) {
      this._selectFocusedItem($target);
    }
  }

  _findItemElementByItem(item: TItem): dxElementWrapper {
    let result = $();
    const itemDataKey = this._itemDataKey();

    this.itemElements().each((index, itemElement): boolean => {
      const $item = $(itemElement);
      if ($item.data(itemDataKey) === item) {
        result = $item;
        return false;
      }

      return true;
    });

    return result;
  }

  _getIndexByItem(item: TItem): number {
    const { items } = this.option();

    // @ts-expect-error ts-error
    return items.indexOf(item);
  }

  _itemOptionChanged(
    item: TItem,
    property: keyof TItem,
    value: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prevValue?: unknown,
  ): void {
    const $item = this._findItemElementByItem(item);
    if (!$item.length) {
      return;
    }
    // @ts-expect-error ts-error
    if (!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
      this._refreshItem($item, item);
    }

    const isDisabling = property === 'disabled' && value;

    if (isDisabling) {
      this._resetItemFocus($item);
    }
  }

  _resetItemFocus($item: dxElementWrapper): void {
    // @ts-expect-error ts-error
    if ($item.is(this.option('focusedElement'))) {
      this.option('focusedElement', null);
    }
  }

  _refreshItem(
    $item: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item: TItem,
  ): void {
    const itemData = this._getItemData($item);
    const index = $item.data(this._itemIndexKey());
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this._renderItem(this._renderedItemsCount + index, itemData, null, $item);
  }

  // eslint-disable-next-line class-methods-use-this
  _updateParentActiveDescendant(): void {}

  _optionChanged(args: OptionChanged<TProperties>): void {
    const {
      name, value, previousValue, fullName,
    } = args;

    if (name === 'items') {
      // @ts-expect-error ts-error
      const matches = fullName.match(ITEM_PATH_REGEX);

      if (matches?.length) {
        const property = matches[matches.length - 1];
        // @ts-expect-error ts-error
        const itemPath = fullName.replace(`.${property}`, '');
        const item = this.option(itemPath);

        // @ts-expect-error ts-error
        this._itemOptionChanged(item, property, value, previousValue);
        return;
      }
    }

    switch (name) {
      case 'items':
      case '_itemAttributes':
      case 'itemTemplateProperty':
      case 'useItemTextAsTitle':
        this._cleanRenderedItems();
        this._invalidate();
        break;
      case 'dataSource':
        // @ts-expect-error ts-error
        this._refreshDataSource();
        this._renderEmptyMessage();
        break;
      case 'noDataText':
      case 'encodeNoDataText':
        this._renderEmptyMessage();
        break;
      case 'itemTemplate':
        this._invalidate();
        break;
      case 'onItemRendered':
        this._createItemRenderAction();
        break;
      case 'onItemClick':
        break;
      case 'onItemHold':
      case 'itemHoldTimeout':
        this._attachHoldEvent();
        break;
      case 'onItemContextMenu':
        this._attachContextMenuEvent();
        break;
      case 'onFocusedItemChanged':
        // @ts-expect-error ts-error
        this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');
        break;
      case 'selectOnFocus':
      case 'loopItemFocus':
      case 'focusOnSelectedItem':
        break;
      case 'focusedElement':
        this._updateFocusedItemState(previousValue as Element | undefined, false, true);
        this._setFocusedItem($(value as Element | undefined));
        break;
      case 'displayExpr':
        this._compileDisplayGetter();
        this._initDefaultItemTemplate();
        this._invalidate();
        break;
      case 'visibleExpr':
      case 'disabledExpr':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _invalidate(): void {
    this.option('focusedElement', null);

    super._invalidate();
  }

  _loadNextPage(): Promise<unknown> {
    this._expectNextPageLoading();
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataController.loadNextPage();
  }

  _expectNextPageLoading(): void {
    this._startIndexForAppendedItems = 0;
  }

  _expectLastItemLoading(): void {
    this._startIndexForAppendedItems = -1;
  }

  _forgetNextPageLoading(): void {
    this._startIndexForAppendedItems = null;
  }

  _dataSourceChangedHandler(
    newItems: TItem[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: { changes?: DataChange<TItem>[] },
  ): void {
    const items = this.option('items');
    if (this._initialized && items && this._shouldAppendItems()) {
      // @ts-expect-error ts-error
      this._renderedItemsCount = items.length;
      // @ts-expect-error ts-error
      if (!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
        // @ts-expect-error ts-error
        this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems));
      }

      this._forgetNextPageLoading();
      this._refreshContent();
    } else {
      this.option('items', newItems.slice());
    }
  }

  _refreshContent(): void {
    this._prepareContent();
    this._renderContent();
  }

  _dataSourceLoadErrorHandler(): void {
    this._forgetNextPageLoading();
    this.option('items', this.option('items'));
  }

  _shouldAppendItems(): boolean {
    return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
  }

  // eslint-disable-next-line class-methods-use-this
  _allowDynamicItemsAppend(): boolean {
    return false;
  }

  _clean(): void {
    this._cleanFocusState();
    this._cleanItemContainer();

    if (this._inkRipple) {
      delete this._inkRipple;
    }

    this._resetActiveState();
  }

  _cleanItemContainer(): void {
    $(this._itemContainer()).empty();
  }

  _dispose(): void {
    super._dispose();

    clearTimeout(this._itemFocusTimeout);
  }

  _refresh(): void {
    this._cleanRenderedItems();

    super._refresh();
  }

  _itemContainer(): dxElementWrapper {
    return this.$element();
  }

  // eslint-disable-next-line class-methods-use-this
  _itemClass(): string {
    return ITEM_CLASS;
  }

  _itemContentClass(): string {
    return `${this._itemClass()}${CONTENT_CLASS_POSTFIX}`;
  }

  // eslint-disable-next-line class-methods-use-this
  _selectedItemClass(): string {
    return SELECTED_ITEM_CLASS;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemResponseWaitClass(): string {
    return ITEM_RESPONSE_WAIT_CLASS;
  }

  _itemSelector(): string {
    return `.${this._itemClass()}`;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemDataKey(): string {
    return ITEM_DATA_KEY;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemIndexKey(): string {
    return ITEM_INDEX_KEY;
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().find(this._itemSelector());
  }

  _initMarkup(): void {
    super._initMarkup();
    // @ts-expect-error ts-error
    this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');

    this.$element().addClass(COLLECTION_CLASS);
    this._prepareContent();
  }

  _prepareContent(): void {
    deferRenderer(() => {
      this._renderContentImpl();
    })();
  }

  _renderContent(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._fireContentReadyAction();
  }

  _render(): void {
    super._render();

    this._attachClickEvent();
    this._attachHoldEvent();
    this._attachContextMenuEvent();
  }

  // eslint-disable-next-line class-methods-use-this
  _getPointerEvent(): string {
    return pointerEvents.down;
  }

  _attachClickEvent(): void {
    const itemSelector = this._itemSelector();
    const pointerEvent = this._getPointerEvent();
    // @ts-expect-error ts-error
    const clickEventNamespace = addNamespace(clickEventName, this.NAME);
    // @ts-expect-error ts-error
    const pointerEventNamespace = addNamespace(pointerEvent, this.NAME);

    const pointerAction = new Action((args) => {
      const { event } = args;

      this._itemPointerDownHandler(event);
    });

    const clickEventCallback = (e): void => this._itemClickHandler(e);
    const pointerEventCallback = (e): void => {
      pointerAction.execute({
        element: $(e.target),
        event: e,
      });
    };

    eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
    eventsEngine.off(this._itemContainer(), pointerEventNamespace, itemSelector);
    eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, clickEventCallback);
    eventsEngine.on(
      this._itemContainer(),
      pointerEventNamespace,
      itemSelector,
      pointerEventCallback,
    );
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    this._itemDXEventHandler(e, 'onItemClick', args, config);
  }

  _itemPointerDownHandler(e: DxEvent): void {
    if (!this.option('focusStateEnabled')) {
      return;
    }
    this._itemFocusHandler = (): void => {
      clearTimeout(this._itemFocusTimeout);
      this._itemFocusHandler = undefined;

      if (e.isDefaultPrevented()) {
        return;
      }

      const $target = $(e.target);
      const $closestItem = $target.closest(this._itemElements());
      const $closestFocusable = this._closestFocusable($target);

      if ($closestItem.length && this._isFocusTarget($closestFocusable?.get(0))) {
        // NOTE: Selection here is already processed in click handler.
        this._shouldSkipSelectOnFocus = true;
        this.option('focusedElement', getPublicElement($closestItem));
        this._shouldSkipSelectOnFocus = false;
      }
    };

    // eslint-disable-next-line no-restricted-globals
    this._itemFocusTimeout = setTimeout(
      this._forcePointerDownFocus.bind(this),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  _closestFocusable(
    $target: dxElementWrapper,
  ): dxElementWrapper | undefined {
    // @ts-expect-error ts-error
    if ($target.is(focusable)) {
      return $target;
    }
    let $nextTarget = $target.parent();
    while ($nextTarget.length
        && !domAdapter.isDocument($nextTarget.get(0))
        && !domAdapter.isDocumentFragment($nextTarget.get(0))
    ) {
      // @ts-expect-error ts-error
      if ($nextTarget.is(focusable)) {
        return $nextTarget;
      }
      $nextTarget = $nextTarget.parent();
    }

    return undefined;
  }

  _forcePointerDownFocus(): void {
    if (this._itemFocusHandler) {
      this._itemFocusHandler();
    }
  }

  _updateFocusState(e: DxEvent, isFocused: boolean): void {
    super._updateFocusState(e, isFocused);

    this._forcePointerDownFocus();
  }

  _attachHoldEvent(): void {
    const $itemContainer = this._itemContainer();
    const itemSelector = this._itemSelector();
    // @ts-expect-error ts-error
    const eventName = addNamespace(holdEvent.name, this.NAME);

    eventsEngine.off($itemContainer, eventName, itemSelector);
    eventsEngine.on(
      $itemContainer,
      eventName,
      itemSelector,
      { timeout: this._getHoldTimeout() },
      // @ts-expect-error ts-error
      this._itemHoldHandler.bind(this),
    );
  }

  _getHoldTimeout(): number | undefined {
    const { itemHoldTimeout } = this.option();

    return itemHoldTimeout;
  }

  _shouldFireHoldEvent(): boolean {
    return this.hasActionSubscription('onItemHold');
  }

  _itemHoldHandler(e: DxEvent & Cancelable): void {
    if (this._shouldFireHoldEvent()) {
      this._itemDXEventHandler(e, 'onItemHold');
    } else {
      e.cancel = true;
    }
  }

  _attachContextMenuEvent(): void {
    const $itemContainer = this._itemContainer();
    const itemSelector = this._itemSelector();
    // @ts-expect-error ts-error
    const eventName = addNamespace(contextMenuEventName, this.NAME);

    eventsEngine.off($itemContainer, eventName, itemSelector);
    eventsEngine.on(
      $itemContainer,
      eventName,
      itemSelector,
      this._itemContextMenuHandler.bind(this),
    );
  }

  _shouldFireContextMenuEvent(): boolean {
    return this.hasActionSubscription('onItemContextMenu');
  }

  _itemContextMenuHandler(e: DxEvent & Cancelable): void {
    if (this._shouldFireContextMenuEvent()) {
      this._itemDXEventHandler(e, 'onItemContextMenu');
    } else {
      e.cancel = true;
    }
  }

  _renderContentImpl(): void {
    const { items } = this.option();
    const itemsToRender = items ?? [];

    if (this._renderedItemsCount) {
      this._renderItems(itemsToRender.slice(this._renderedItemsCount));
    } else {
      this._renderItems(itemsToRender);
    }
  }

  _renderItems(items: TItem[]): void {
    if (items.length) {
      each(items, (index, itemData) => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        this._renderItem(this._renderedItemsCount + index, itemData);
      });
    }
    this._renderEmptyMessage();
  }

  _getItemsContainer(): dxElementWrapper {
    return this._itemContainer();
  }

  _setAttributes($element: dxElementWrapper): void {
    const attributes = { ...this.option('_itemAttributes') };
    // @ts-expect-error ts-error
    const { class: customClassValue } = attributes;

    if (customClassValue) {
      const currentClassValue = $element.get(0).className;
      // @ts-expect-error ts-error
      attributes.class = [currentClassValue, customClassValue].join(' ');
    }
    // @ts-expect-error ts-error
    $element.attr(attributes);
  }

  _renderItem(
    index: { group: number; item: number } | number,
    itemData: TItem,
    $container?: dxElementWrapper | null,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper {
    // @ts-expect-error ts-error
    const itemIndex = index?.item ?? index;
    const $containerToRender = $container ?? this._getItemsContainer();
    const $itemFrame = this._renderItemFrame(
      itemIndex,
      itemData,
      $containerToRender,
      $itemToReplace,
    );
    this._setElementData($itemFrame, itemData, itemIndex);
    this._setAttributes($itemFrame);
    this._attachItemClickEvent(itemData, $itemFrame);
    const $itemContent = this._getItemContent($itemFrame);

    const { itemTemplate } = this.option();

    const renderContentPromise = this._renderItemContent({
      index: itemIndex,
      itemData,
      container: getPublicElement($itemContent),
      contentClass: this._itemContentClass(),
      defaultTemplateName: itemTemplate,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    when(renderContentPromise).done(($content) => {
      this._postprocessRenderItem({
        itemElement: $itemFrame,
        itemContent: $content,
        itemData,
        itemIndex,
      });

      // @ts-expect-error ts-error
      this._executeItemRenderAction(index, itemData, getPublicElement($itemFrame));
    });

    return $itemFrame;
  }

  // eslint-disable-next-line class-methods-use-this
  _getItemContent($itemFrame: dxElementWrapper): dxElementWrapper {
    const $itemContent = $itemFrame.find(`.${ITEM_CONTENT_PLACEHOLDER_CLASS}`);
    $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    return $itemContent;
  }

  _attachItemClickEvent(itemData: TItem, $itemElement: dxElementWrapper): void {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!itemData || !itemData.onClick) {
      return;
    }

    eventsEngine.on($itemElement, clickEventName, (e) => {
      // @ts-expect-error ts-error
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
        event: e,
      });
    });
  }

  _renderItemContent(
    args: ItemRenderInfo<TItem>,
  ): dxElementWrapper | DeferredObj<dxElementWrapper> {
    const itemTemplateName = this._getItemTemplateName(args);
    const itemTemplate = this._getTemplate(itemTemplateName);

    this._addItemContentClasses(args);
    const $templateResult = $(this._createItemByTemplate(itemTemplate, args));
    if (!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      return args.container;
    }

    return this._renderItemContentByNode(args, $templateResult);
  }

  _renderItemContentByNode(
    args: ItemRenderInfo<TItem>,
    $node: dxElementWrapper,
  ): dxElementWrapper {
    $(args.container).replaceWith($node);
    args.container = getPublicElement($node);
    this._addItemContentClasses(args);

    return $node;
  }

  // eslint-disable-next-line class-methods-use-this
  _addItemContentClasses(args: ItemRenderInfo<TItem>): void {
    const classes = [
      ITEM_CLASS + CONTENT_CLASS_POSTFIX,
      args.contentClass,
    ];

    $(args.container).addClass(classes.join(' '));
  }

  // eslint-disable-next-line class-methods-use-this
  _appendItemToContainer(
    $container: dxElementWrapper,
    $itemFrame: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index: number,
  ): void {
    $itemFrame.appendTo($container);
  }

  _renderItemFrame(
    index: number,
    itemData: TItem,
    $container: dxElementWrapper,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = $('<div>');
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-new
    new this.constructor.ItemClass($itemFrame, this._itemOptions(), itemData || {});

    if ($itemToReplace?.length) {
      $itemToReplace.replaceWith($itemFrame);
    } else {
      this._appendItemToContainer.call(this, $container, $itemFrame, index);
    }

    if (this.option('useItemTextAsTitle')) {
      // @ts-expect-error ts-error
      const displayValue = this._displayGetter ? this._displayGetter(itemData) : itemData;
      $itemFrame.attr('title', displayValue);
    }

    return $itemFrame;
  }

  _itemOptions(): Record<string, unknown> {
    return {
      watchMethod: () => this.option('integrationOptions.watchMethod'),
      owner: this,
      fieldGetter: (field): unknown => {
        const expr = this.option(`${field}Expr`);
        // @ts-expect-error ts-error
        const getter = compileGetter(expr);

        return getter;
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _postprocessRenderItem(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: PostprocessRenderItemInfo<TItem>,
  ): void {}

  _executeItemRenderAction(
    index: number,
    itemData: TItem,
    itemElement: HTMLElement,
  ): void {
    this._getItemRenderAction()({
      itemElement,
      itemIndex: index,
      itemData,
    });
  }

  _setElementData(
    element: dxElementWrapper,
    data: TItem,
    index: number,
  ): void {
    element
      .addClass([ITEM_CLASS, this._itemClass()].join(' '))
      .data(this._itemDataKey(), data)
      .data(this._itemIndexKey(), index);
  }

  _createItemRenderAction(): (event?: Partial<EventInfo<unknown> & ItemInfo<TItem>>) => void {
    this._itemRenderAction = this._createActionByOption('onItemRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering',
    });

    return this._itemRenderAction;
  }

  _getItemRenderAction(): (event?: Partial<EventInfo<unknown> & ItemInfo<TItem>>) => void {
    return this._itemRenderAction ?? this._createItemRenderAction();
  }

  _getItemTemplateName(
    args: ItemRenderInfo<TItem>,
  ): ItemTemplate<TItem> {
    const data = args.itemData;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const templateProperty = args.templateProperty || this.option('itemTemplateProperty');
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const template = data && data[templateProperty];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return template || args.defaultTemplateName;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _createItemByTemplate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    itemTemplate,
    renderArgs: ItemRenderInfo<TItem>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemTemplate.render({
      model: renderArgs.itemData,
      container: renderArgs.container,
      index: renderArgs.index,
      onRendered: this._onItemTemplateRendered(itemTemplate, renderArgs),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _onItemTemplateRendered(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    itemTemplate: { source: () => unknown },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderArgs: { itemData: unknown },
  ): () => void {
    return (): void => {};
  }

  _emptyMessageContainer(): dxElementWrapper {
    return this._itemContainer();
  }

  _renderEmptyMessage(rootNodes?: TItem[]): void {
    // eslint-disable-next-line no-param-reassign
    const items = rootNodes ?? this.option('items');
    const noDataText = this.option('noDataText');
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const hideNoData = !noDataText || (items && items.length) || this._dataController.isLoading();

    if (hideNoData && this._$noData) {
      this._$noData.remove();
      // @ts-expect-error ts-error
      this._$noData = null;
      this.setAria('label', undefined);
    }

    if (!hideNoData) {
      this._$noData = this._$noData ?? $('<div>').addClass('dx-empty-message');
      this._$noData.appendTo(this._emptyMessageContainer());

      if (this.option('encodeNoDataText')) {
        // @ts-expect-error ts-error
        this._$noData.text(noDataText);
      } else {
        // @ts-expect-error ts-error
        this._$noData.html(noDataText);
      }
    }
    this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);
  }

  _itemDXEventHandler(
    dxEvent: DxEvent,
    handlerOptionName: string,
    actionArgs?: Record<string, unknown>,
    actionConfig?: ActionConfig,
  ): void {
    this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
      event: dxEvent,
    }), actionConfig);
  }

  _itemEventHandler(
    initiator: dxElementWrapper | Element,
    handlerOptionName: string,
    actionArgs: Record<string, unknown>,
    actionConfig?: ActionConfig,
  ): void {
    const action = this._createActionByOption(handlerOptionName, extend({
      validatingTargetName: 'itemElement',
    }, actionConfig));
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  }

  _itemEventHandlerByHandler(
    initiator: dxElementWrapper | Element,
    handler: () => void,
    actionArgs: Record<string, unknown>,
    actionConfig: ActionConfig,
  ): void {
    const action = this._createAction(handler, extend({
      validatingTargetName: 'itemElement',
    }, actionConfig));
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  }

  _itemEventHandlerImpl(
    initiator: dxElementWrapper | Element,
    action: (event?: Record<string, unknown>) => void,
    actionArgs: ActionConfig,
  ): void {
    const $itemElement = this._closestItemElement($(initiator));
    const args = extend({}, actionArgs);

    return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
  }

  _extendActionArgs($itemElement: dxElementWrapper): ItemInfo<TItem> {
    return {
      itemElement: getPublicElement($itemElement),
      itemIndex: this._itemElements().index($itemElement),
      itemData: this._getItemData($itemElement),
    };
  }

  _closestItemElement($element: dxElementWrapper): dxElementWrapper {
    return $($element).closest(this._itemSelector());
  }

  _getItemData(itemElement: Element | dxElementWrapper): TItem {
    // @ts-expect-error ts-error
    return $(itemElement).data(this._itemDataKey());
  }

  // eslint-disable-next-line class-methods-use-this
  _getSummaryItemsSize(
    dimension: string,
    items: dxElementWrapper,
    includeMargin?: boolean,
  ): number {
    let result = 0;

    if (items) {
      each(items, (_, item) => {
        if (dimension === 'width') {
          result += getOuterWidth(item, includeMargin ?? false);
        } else if (dimension === 'height') {
          result += getOuterHeight(item, includeMargin ?? false);
        }
      });
    }

    return result;
  }

  getFocusedItemId(): string {
    if (!this._focusedItemId) {
      this._focusedItemId = `dx-${new Guid()}`;
    }

    return this._focusedItemId;
  }

  itemElements(): dxElementWrapper {
    return this._itemElements();
  }

  itemsContainer(): dxElementWrapper {
    return this._itemContainer();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CollectionWidget as any).include(DataHelperMixin);

// @ts-expect-error ts-error
CollectionWidget.ItemClass = CollectionWidgetItem;

export default CollectionWidget;
