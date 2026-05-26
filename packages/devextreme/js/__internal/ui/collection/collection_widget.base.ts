import type { template } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import Action from '@js/core/action';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
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
import type {
  Cancelable, DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type {
  CollectionWidgetItem as CollectionWidgetItemProperties,
  CollectionWidgetOptions,
  ItemLike,
} from '@js/ui/collection/ui.collection_widget.base';
import { getPublicElement } from '@ts/core/m_element';
import { focusable } from '@ts/core/utils/m_selectors';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys, WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import DataHelperMixin from '@ts/data/m_data_helper';
import type { ClickableCollectionWidgetItem, ItemClickEvent } from '@ts/ui/collection/item';
import type CollectionItem from '@ts/ui/collection/item';
import CollectionWidgetItem from '@ts/ui/collection/item';

import type { PublicNode } from '../hierarchical_collection/data_converter';
import type { CollectionItemIndex } from './collection_widget.edit.strategy';

const COLLECTION_CLASS = 'dx-collection';
export const ITEM_CLASS = 'dx-item';
const CONTENT_CLASS_POSTFIX = '-content';
const ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';
const ITEM_DATA_KEY = 'dxItemData';
const ITEM_INDEX_KEY = 'dxItemIndex';
const ITEM_TEMPLATE_ID_PREFIX = 'tmpl-';
const ITEMS_OPTIONS_NAME = 'dxItem';
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
export interface CollectionItemInfo<TItem, TIndex = CollectionItemIndex> {
  readonly itemData: TItem;
  readonly itemElement: HTMLElement;
  readonly itemIndex: TIndex;
}

export type CollectionItemKey = string | number;

export type ActionArgs<TItem> = CollectionItemInfo<TItem> | {
  cancel?: boolean;
  event?: DxEvent;
  fromIndex?: CollectionItemIndex;
  toIndex?: CollectionItemIndex;
  node?: PublicNode;
};
export interface DataChange<TItem = CollectionItem, TKey = CollectionItemKey> {
  key: TKey;
  type: DataChangeType;
  data: TItem;
  index: number;
  oldItem?: TItem;
}

export type ItemTemplate<TItem> = template | (
  (itemData: TItem, itemIndex: number, itemElement: Element) => string | dxElementWrapper
);
export interface ItemRenderInfo<TItem> {
  index: number;
  itemData: TItem;
  container: dxElementWrapper | Element;
  contentClass?: string;
  defaultTemplateName?: ItemTemplate<TItem>;
  uniqueKey?: string;
  templateProperty?: string;
}

export interface PostprocessRenderItemInfo<TItem> {
  itemElement: dxElementWrapper;
  itemContent: dxElementWrapper | Element;
  itemData: TItem;
  itemIndex: number;
}

export type InkRippleEvent = DxEvent<PointerInteractionEvent>;
export type Constructor<T> = new (...args: unknown[]) => T;

export interface CollectionWidgetBaseProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends CollectionWidget<any, TItem, TKey> | any,
  TItem extends ItemLike = CollectionWidgetItemProperties,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey>, Omit<
    WidgetProperties<TComponent>,
    keyof CollectionWidgetOptions<TComponent, TItem, TKey>
  > {
  focusedElement?: Element | null;

  encodeNoDataText?: boolean;

  _itemAttributes?: Record<string, unknown>;

  selectOnFocus?: boolean;

  loopItemFocus?: boolean;

  useItemTextAsTitle?: boolean;

  itemTemplateProperty?: string | null;

  displayExpr?: string | ((item: TItem) => string);
}

class CollectionWidget<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetBaseProperties<any, TItem, TKey>,
  TItem extends ItemLike = CollectionWidgetItemProperties,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends Widget<TProperties> {
  private _focusedItemId?: string;

  private _itemFocusTimeout?: ReturnType<typeof setTimeout>;

  private _itemRenderAction?: (event?: ActionArgs<TItem>) => void;

  _displayGetter?: ((item: TItem) => string);

  _shouldSkipSelectOnFocus?: boolean;

  _renderedItemsCount!: number;

  _startIndexForAppendedItems?: number | null;

  _$noData?: dxElementWrapper;

  _itemFocusHandler?: () => void;

  _inkRipple?: {
    showWave: (config: {
      element: dxElementWrapper;
      event: InkRippleEvent;
    }) => void;
    hideWave: (config: {
      element: dxElementWrapper;
      event: InkRippleEvent;
    }) => void;
  };

  protected _activeStateUnit(): string {
    return `.${ITEM_CLASS}`;
  }

  _supportedKeys(): SupportedKeys {
    const space = (e: DxEvent<KeyboardEvent>): void => {
      e.preventDefault();
      this._enterKeyHandler(e);
    };
    const move = (location: string, e: DxEvent<KeyboardEvent>): void => {
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

  _enterKeyHandler(e: DxEvent<KeyboardEvent>): void {
    const { focusedElement } = this.option();

    const $itemElement = $(focusedElement);

    if (!$itemElement.length) {
      return;
    }

    const itemData = this._getItemData($itemElement);
    if (CollectionWidgetItem.isClickableItem(itemData)) {
      const actionArgs: ActionArgs<TItem> = {
        event: e,
      };
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, actionArgs);
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

    this._cleanRenderedItems();
    // @ts-expect-error ts-error
    this._refreshDataSource();
  }

  _compileDisplayGetter(): void {
    const { displayExpr } = this.option();
    // @ts-expect-error ts-error
    this._displayGetter = displayExpr ? compileGetter(displayExpr) : undefined;
  }

  _initTemplates(): void {
    this._initItemsFromMarkup();

    this._initDefaultItemTemplate();
    super._initTemplates();
  }

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

  _getBindableFields(): string[] {
    return ['text', 'html'];
  }

  _getFieldsMap(): { text: unknown } | undefined {
    if (this._displayGetter) {
      return { text: this._displayGetter };
    }

    return undefined;
  }

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
    const { items: userItems = [] } = this.option();

    if (!rawItems.length || userItems.length) {
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

    const { focusedElement } = this.option();
    const $focusedElement = $(focusedElement);
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
    return $element.find(this._activeStateUnit());
  }

  _getActiveItem(last?: boolean): dxElementWrapper {
    const { focusedElement } = this.option();
    const $focusedElement = $(focusedElement);

    if ($focusedElement.length) {
      return $focusedElement;
    }

    return this._determineFocusedElement(last);
  }

  _determineFocusedElement(last?: boolean): dxElementWrapper {
    let index = this._getFocusedElementIndex();

    const activeElements = this._getActiveElement();
    const lastIndex = activeElements.length - 1;

    if (index < 0) {
      index = last ? lastIndex : 0;
    }

    return activeElements.eq(index);
  }

  _getFocusedElementIndex(): number {
    return 0;
  }

  // eslint-disable-next-line consistent-return
  _moveFocus(
    location: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: DxEvent<KeyboardEvent>,
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
      case FOCUS_RIGHT: {
        const { rtlEnabled } = this.option();

        $newTarget = rtlEnabled ? this._prevItem($items) : this._nextItem($items);
        break;
      }
      case FOCUS_LEFT: {
        const { rtlEnabled } = this.option();

        $newTarget = rtlEnabled ? this._nextItem($items) : this._prevItem($items);
        break;
      }
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
    const { loopItemFocus } = this.option();

    if ($item.length === 0 && loopItemFocus) {
      $item = $last;
    }

    return $item;
  }

  _nextItem($items: dxElementWrapper): dxElementWrapper {
    const $target = this._getActiveItem(true);
    const targetIndex = $items.index($target);
    const $first = $items.first();
    let $item = $($items[targetIndex + 1]);
    const { loopItemFocus } = this.option();

    if ($item.length === 0 && loopItemFocus) {
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

      const { focusStateEnabled } = this.option();

      if (focusStateEnabled) {
        this._toggleFocusClass(isFocused, $target);
      }
    }

    this._updateParentActiveDescendant();
  }

  _getElementClassToSkipRefreshId(): string {
    return '';
  }

  _shouldSkipRefreshId(target: Element | dxElementWrapper): boolean {
    const elementClass = this._getElementClassToSkipRefreshId();
    const shouldSkipRefreshId = $(target).hasClass(elementClass);

    return shouldSkipRefreshId;
  }

  _refreshActiveDescendant($target?: dxElementWrapper | null): void {
    const { focusedElement } = this.option();

    if (isDefined(focusedElement)) {
      const shouldSetExistingId = this._shouldSkipRefreshId(focusedElement);
      const id = shouldSetExistingId ? $(focusedElement).attr('id') : this.getFocusedItemId();

      this.setAria('activedescendant', id, $target);

      return;
    }

    this.setAria('activedescendant', null, $target);
  }

  _getItemIdTarget($target: dxElementWrapper): dxElementWrapper {
    return $target;
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

    const $idTarget = this._getItemIdTarget($target);

    if (!needCleanItemId && focusedElement) {
      this.setAria('id', this.getFocusedItemId(), $idTarget);
    } else {
      this.setAria('id', null, $idTarget);
    }
  }

  _isDisabled($element: dxElementWrapper): boolean {
    return $element && $($element).attr('aria-disabled') === 'true';
  }

  _setFocusedItem($target: dxElementWrapper): void {
    if (!$target?.length) {
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

    this.itemElements().each((_index: number, itemElement: Element): boolean => {
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
    const { focusedElement } = this.option();
    // @ts-expect-error ts-error
    if ($item.is(focusedElement)) {
      this._resetFocusedElement();
    }
  }

  _resetFocusedElement(): void {
    this.option('focusedElement', null);
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
    this._resetFocusedElement();

    super._invalidate();
  }

  _loadNextPage(): DeferredObj<unknown> {
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
    e?: { changes?: DataChange<TItem, TKey>[] },
  ): void {
    const { items } = this.option();
    if (this._initialized && items && this._shouldAppendItems()) {
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

    const { items } = this.option();

    this.option('items', items);
  }

  _shouldAppendItems(): boolean {
    return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
  }

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

  _itemContainer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchEnabled?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousSelectAllEnabled?: boolean,
  ): dxElementWrapper {
    return this.$element();
  }

  _itemClass(): string {
    return ITEM_CLASS;
  }

  _itemContentClass(): string {
    return `${this._itemClass()}${CONTENT_CLASS_POSTFIX}`;
  }

  _itemResponseWaitClass(): string {
    return ITEM_RESPONSE_WAIT_CLASS;
  }

  _itemSelector(): string {
    return `.${this._itemClass()}`;
  }

  _itemDataKey(): string {
    return ITEM_DATA_KEY;
  }

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

  _getPointerEvent(): string {
    return pointerEvents.down;
  }

  _attachClickEvent(): void {
    const itemSelector = this._itemSelector();
    const pointerDownEvent = pointerEvents.down;
    const pointerUpEvent = pointerEvents.up;
    // @ts-expect-error ts-error
    const clickEventNamespace = addNamespace(clickEventName, this.NAME);
    // @ts-expect-error ts-error
    const pointerDownEventNamespace = addNamespace(pointerDownEvent, this.NAME);
    // @ts-expect-error ts-error
    const pointerUpEventNamespace = addNamespace(pointerUpEvent, this.NAME);

    const pointerDownAction = new Action((args) => {
      const { event } = args;

      this._itemPointerHandler(event);
    });

    const pointerUpAction = new Action((args) => {
      const { event } = args;

      this._itemPointerUpHandler(event);
    });

    const clickEventCallback = (e): void => this._itemClickHandler(e);
    const pointerDownEventCallback = (e): void => {
      pointerDownAction.execute({
        element: $(e.target),
        event: e,
      });
    };

    const pointerUpEventCallback = (e): void => {
      pointerUpAction.execute({
        element: $(e.target),
        event: e,
      });
    };

    eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
    eventsEngine.off(this._itemContainer(), pointerDownEventNamespace, itemSelector);
    eventsEngine.off(this._itemContainer(), pointerUpEventNamespace, itemSelector);
    eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, clickEventCallback);
    eventsEngine.on(
      this._itemContainer(),
      pointerDownEventNamespace,
      itemSelector,
      pointerDownEventCallback,
    );
    eventsEngine.on(
      this._itemContainer(),
      pointerUpEventNamespace,
      itemSelector,
      pointerUpEventCallback,
    );
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    this._itemDXEventHandler(e, 'onItemClick', args, config);
  }

  _handleItemFocus(e: DxEvent): void {
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
  }

  _itemPointerHandler(e: DxEvent): void {
    const { focusStateEnabled } = this.option();

    if (!focusStateEnabled) {
      return;
    }

    this._itemFocusHandler = (): void => {
      clearTimeout(this._itemFocusTimeout);
      this._itemFocusHandler = undefined;

      this._handleItemFocus(e);
    };

    // eslint-disable-next-line no-restricted-globals
    this._itemFocusTimeout = setTimeout(() => {
      this._forcePointerDownFocus();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemPointerUpHandler(e: DxEvent): void {}

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
      each(items, (index: number, itemData: TItem): void => {
        this._renderItem(this._renderedItemsCount + index, itemData);
      });
    }
    this._renderEmptyMessage();
  }

  _getItemsContainer(): dxElementWrapper {
    return this._itemContainer();
  }

  _setAttributes($element: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _itemAttributes } = this.option();
    const attributes = { ..._itemAttributes };
    const { class: customClassValue } = attributes;

    if (customClassValue) {
      const currentClassValue = $element.get(0).className;
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
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

  _getItemContent($itemFrame: dxElementWrapper): dxElementWrapper {
    const $itemContent = $itemFrame.find(`.${ITEM_CONTENT_PLACEHOLDER_CLASS}`);
    $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    return $itemContent;
  }

  _attachItemClickEvent(itemData: TItem, $itemElement: dxElementWrapper): void {
    if (!itemData || !CollectionWidgetItem.isClickableItem(itemData)) {
      return;
    }

    eventsEngine.on(
      $itemElement,
      clickEventName,
      (e: DxEvent) => {
        const actionArgs = {
          event: e,
        };
        this._itemEventHandlerByHandler($itemElement, itemData.onClick, actionArgs);
      },
    );
  }

  _renderItemContent(
    args: ItemRenderInfo<TItem>,
  ): dxElementWrapper | Element | DeferredObj<dxElementWrapper> {
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

  _addItemContentClasses(args: ItemRenderInfo<TItem>): void {
    const classes = [
      ITEM_CLASS + CONTENT_CLASS_POSTFIX,
      args.contentClass,
    ];

    $(args.container).addClass(classes.join(' '));
  }

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

    const { useItemTextAsTitle } = this.option();

    if (useItemTextAsTitle) {
      const displayValue = this._displayGetter
        ? this._displayGetter(itemData)
        : itemData;
      // @ts-expect-error
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

  _createItemRenderAction(): (event?: ActionArgs<TItem>) => void {
    this._itemRenderAction = this._createActionByOption('onItemRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering',
    });

    return this._itemRenderAction;
  }

  _getItemRenderAction(): (event?: ActionArgs<TItem>) => void {
    return this._itemRenderAction ?? this._createItemRenderAction();
  }

  _getItemTemplateName(
    args: ItemRenderInfo<TItem>,
  ): ItemTemplate<TItem> {
    const data = args.itemData;
    const { itemTemplateProperty } = this.option();

    const templateProperty = args.templateProperty ?? itemTemplateProperty;

    const template = data && templateProperty
      ? data[templateProperty]
      : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return template || args.defaultTemplateName;
  }

  _createItemByTemplate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    itemTemplate,
    renderArgs: ItemRenderInfo<TItem>,
  ): dxElementWrapper {
    const { itemData, container, index } = renderArgs;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemTemplate.render({
      model: itemData,
      container,
      index,
      onRendered: this._onItemTemplateRendered(itemTemplate, renderArgs),
    });
  }

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

  _renderEmptyMessage(rootNodes?: TItem[]): boolean {
    const { items: userItems = [], noDataText } = this.option();

    const items = rootNodes ?? userItems;
    // @ts-expect-error ts-error
    const hideNoData = !noDataText || items?.length || this._dataController.isLoading();

    if (hideNoData && this._$noData) {
      this._$noData.remove();
      // @ts-expect-error ts-error
      this._$noData = null;
    }

    if (!hideNoData) {
      this._$noData = this._$noData ?? $('<div>').addClass('dx-empty-message');
      this._$noData.appendTo(this._emptyMessageContainer());

      const { encodeNoDataText } = this.option();

      if (encodeNoDataText) {
        this._$noData.text(noDataText);
      } else {
        this._$noData.html(noDataText);
      }
    }
    this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);

    return !hideNoData;
  }

  _itemDXEventHandler(
    dxEvent: DxEvent,
    handlerOptionName: keyof TProperties,
    actionArgs?: Record<string, unknown>,
    actionConfig?: ActionConfig,
  ): void {
    this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
      event: dxEvent,
    }), actionConfig);
  }

  _itemEventHandler(
    initiator: dxElementWrapper | Element,
    handlerOptionName: keyof TProperties,
    actionArgs: ActionArgs<TItem>,
    actionConfig?: ActionConfig,
  ): void {
    const action = this._createActionByOption(handlerOptionName, {
      validatingTargetName: 'itemElement',
      ...actionConfig,
    });
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  }

  _itemEventHandlerByHandler(
    initiator: dxElementWrapper | Element,
    handler: (e: ItemClickEvent<ClickableCollectionWidgetItem>) => void,
    actionArgs: ActionArgs<TItem>,
    actionConfig?: ActionConfig,
  ): void {
    const action = this._createAction(handler, extend({
      validatingTargetName: 'itemElement',
    }, actionConfig));
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  }

  _itemEventHandlerImpl(
    initiator: dxElementWrapper | Element,
    action: (event?: Record<string, unknown>) => void,
    actionArgs: ActionArgs<TItem>,
  ): void {
    const $itemElement = this._closestItemElement($(initiator));
    const args = extend({}, actionArgs);

    return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
  }

  _extendActionArgs(
    $itemElement: dxElementWrapper,
  ): CollectionItemInfo<TItem> {
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
    return $(itemElement).data(this._itemDataKey()) as TItem;
  }

  _getSummaryItemsSize(
    dimension: string,
    items: dxElementWrapper | dxElementWrapper[],
    includeMargin?: boolean,
  ): number {
    let result = 0;

    if (items) {
      each(items, (_index: number, item: dxElementWrapper) => {
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

// @ts-expect-error ts-error
CollectionWidget.ItemClass = CollectionWidgetItem;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CollectionWidget as any).include(DataHelperMixin);

export default CollectionWidget;
