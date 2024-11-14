import { name as clickEventName } from '@js/common/core/events/click';
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import DataHelperMixin from '@js/common/data/data_helper';
import Action from '@js/core/action';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import {
  // @ts-expect-error
  deferRenderer,
  ensureDefined,
  noop,
} from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import { findTemplates } from '@js/core/utils/template_manager';
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import { focusable } from '@js/ui/widget/selectors';
import Widget from '@js/ui/widget/ui.widget';

import CollectionWidgetItem from './m_item';

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
// @ts-expect-error
const CollectionWidget = Widget.inherit({

  _activeStateUnit: `.${ITEM_CLASS}`,

  _supportedKeys() {
    const space = function (e) {
      e.preventDefault();
      this._enterKeyHandler(e);
    };
    const move = function (location, e) {
      if (!isCommandKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        this._moveFocus(location, e);
      }
    };
    return extend(this.callBase(), {
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
    });
  },

  _getHandlerExtendedParams(e, target) {
    const params = extend({}, e, {
      target: target.get(0),
      currentTarget: target.get(0),
    });

    return params;
  },

  _enterKeyHandler(e) {
    const $itemElement = $(this.option('focusedElement'));

    if (!$itemElement.length) {
      return;
    }

    const itemData = this._getItemData($itemElement);
    if (itemData?.onClick) {
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
        event: e,
      });
    }

    this._itemClickHandler(this._getHandlerExtendedParams(e, $itemElement));
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
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
      disabledExpr(data) { return data ? data.disabled : undefined; },
      visibleExpr(data) { return data ? data.visible : undefined; },

    });
  },

  _init() {
    this._compileDisplayGetter();
    this._initDataController();
    this.callBase();

    this._cleanRenderedItems();
    this._refreshDataSource();
  },

  _compileDisplayGetter() {
    const displayExpr = this.option('displayExpr');
    this._displayGetter = displayExpr ? compileGetter(this.option('displayExpr')) : undefined;
  },

  _initTemplates() {
    this._initItemsFromMarkup();

    this._initDefaultItemTemplate();
    this.callBase();
  },

  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },

  _initDefaultItemTemplate() {
    const fieldsMap = this._getFieldsMap();
    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container, data) => {
        if (isPlainObject(data)) {
          this._prepareDefaultItemTemplate(data, $container);
        } else {
          if (fieldsMap && isFunction(fieldsMap.text)) {
            data = fieldsMap.text(data);
          }
          $container.text(String(ensureDefined(data, '')));
        }
      }, this._getBindableFields(), this.option('integrationOptions.watchMethod'), fieldsMap),
    });
  },

  _getBindableFields() {
    return ['text', 'html'];
  },
  // @ts-expect-error
  _getFieldsMap() {
    if (this._displayGetter) {
      return { text: this._displayGetter };
    }
  },

  _prepareDefaultItemTemplate(data, $container) {
    if (isDefined(data.text)) {
      $container.text(data.text);
    }

    if (isDefined(data.html)) {
      $container.html(data.html);
    }
  },

  _initItemsFromMarkup() {
    const rawItems = findTemplates(this.$element(), ITEMS_OPTIONS_NAME);

    if (!rawItems.length || this.option('items').length) {
      return;
    }

    const items = rawItems.map(({ element, options }) => {
      // @ts-expect-error
      const isTemplateRequired = /\S/.test(element.innerHTML) && !options.template;

      if (isTemplateRequired) {
        options.template = this._prepareItemTemplate(element);
      } else {
        $(element).remove();
      }

      return options;
    });

    this.option('items', items);
  },

  _prepareItemTemplate(item) {
    const templateId = ITEM_TEMPLATE_ID_PREFIX + new Guid();
    const $template = $(item)
      .detach()
      .clone()
      .removeAttr('data-options')
      .addClass(TEMPLATE_WRAPPER_CLASS);

    this._saveTemplate(templateId, $template);

    return templateId;
  },

  _dataSourceOptions() {
    return { paginate: false };
  },

  _cleanRenderedItems() {
    this._renderedItemsCount = 0;
  },

  _focusTarget() {
    return this.$element();
  },

  _focusInHandler(e) {
    this.callBase.apply(this, arguments);

    if (!this._isFocusTarget(e.target)) {
      return;
    }

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
  },

  _focusOutHandler() {
    this.callBase.apply(this, arguments);

    const $target = $(this.option('focusedElement'));

    this._updateFocusedItemState($target, false);
  },

  _findActiveTarget($element) {
    return $element.find(this._activeStateUnit);
  },

  _getActiveItem(last) {
    const $focusedElement = $(this.option('focusedElement'));

    if ($focusedElement.length) {
      return $focusedElement;
    }

    let index = this.option('focusOnSelectedItem') ? this.option('selectedIndex') : 0;

    const activeElements = this._getActiveElement();
    const lastIndex = activeElements.length - 1;

    if (index < 0) {
      index = last ? lastIndex : 0;
    }

    return activeElements.eq(index);
  },
  // @ts-expect-error
  _moveFocus(location) {
    const $items = this._getAvailableItems();
    let $newTarget;

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
  },

  _getVisibleItems($itemElements) {
    $itemElements = $itemElements || this._itemElements();
    return $itemElements.filter(':visible');
  },

  _getAvailableItems($itemElements) {
    return this._getVisibleItems($itemElements);
  },

  _prevItem($items) {
    const $target = this._getActiveItem();
    const targetIndex = $items.index($target);
    const $last = $items.last();
    let $item = $($items[targetIndex - 1]);
    const loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $last;
    }

    return $item;
  },

  _nextItem($items) {
    const $target = this._getActiveItem(true);
    const targetIndex = $items.index($target);
    const $first = $items.first();
    let $item = $($items[targetIndex + 1]);
    const loop = this.option('loopItemFocus');

    if ($item.length === 0 && loop) {
      $item = $first;
    }

    return $item;
  },

  _selectFocusedItem($target) {
    this.selectItem($target);
  },

  _updateFocusedItemState(target, isFocused, needCleanItemId) {
    const $target = $(target);

    if ($target.length) {
      this._refreshActiveDescendant();
      this._refreshItemId($target, needCleanItemId);
      this._toggleFocusClass(isFocused, $target);
    }

    this._updateParentActiveDescendant();
  },

  _getElementClassToSkipRefreshId: noop,

  _shouldSkipRefreshId(target) {
    const elementClass = this._getElementClassToSkipRefreshId() ?? '';
    const shouldSkipRefreshId = $(target).hasClass(elementClass);

    return shouldSkipRefreshId;
  },

  _refreshActiveDescendant($target) {
    const { focusedElement } = this.option();

    if (isDefined(focusedElement)) {
      const shouldSetExistingId = this._shouldSkipRefreshId(focusedElement);
      const id = shouldSetExistingId ? $(focusedElement).attr('id') : this.getFocusedItemId();

      this.setAria('activedescendant', id, $target);

      return;
    }

    this.setAria('activedescendant', null, $target);
  },

  _refreshItemId($target, needCleanItemId) {
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
  },

  _isDisabled($element) {
    return $element && $($element).attr('aria-disabled') === 'true';
  },

  _setFocusedItem($target) {
    if (!$target || !$target.length) {
      return;
    }

    this._updateFocusedItemState($target, true);
    this.onFocusedItemChanged(this.getFocusedItemId());

    const { selectOnFocus } = this.option();
    const isTargetDisabled = this._isDisabled($target);

    if (selectOnFocus && !isTargetDisabled && !this._shouldSkipSelectOnFocus) {
      this._selectFocusedItem($target);
    }
  },

  _findItemElementByItem(item) {
    let result = $();
    const that = this;
    // @ts-expect-error
    this.itemElements().each(function () {
      const $item = $(this);
      if ($item.data(that._itemDataKey()) === item) {
        result = $item;
        return false;
      }
    });

    return result;
  },

  _getIndexByItem(item) {
    return this.option('items').indexOf(item);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemOptionChanged(item, property, value, oldValue) {
    const $item = this._findItemElementByItem(item);
    if (!$item.length) {
      return;
    }
    if (!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
      this._refreshItem($item, item);
    }

    const isDisabling = property === 'disabled' && value;

    if (isDisabling) {
      this._resetItemFocus($item);
    }
  },

  _resetItemFocus($item) {
    if ($item.is(this.option('focusedElement'))) {
      this.option('focusedElement', null);
    }
  },

  _refreshItem($item) {
    const itemData = this._getItemData($item);
    const index = $item.data(this._itemIndexKey());
    this._renderItem(this._renderedItemsCount + index, itemData, null, $item);
  },

  _updateParentActiveDescendant: noop,

  _optionChanged(args) {
    if (args.name === 'items') {
      const matches = args.fullName.match(ITEM_PATH_REGEX);

      if (matches && matches.length) {
        const property = matches[matches.length - 1];
        const itemPath = args.fullName.replace(`.${property}`, '');
        const item = this.option(itemPath);

        this._itemOptionChanged(item, property, args.value, args.previousValue);
        return;
      }
    }

    switch (args.name) {
      case 'items':
      case '_itemAttributes':
      case 'itemTemplateProperty':
      case 'useItemTextAsTitle':
        this._cleanRenderedItems();
        this._invalidate();
        break;
      case 'dataSource':
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
        this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');
        break;
      case 'selectOnFocus':
      case 'loopItemFocus':
      case 'focusOnSelectedItem':
        break;
      case 'focusedElement':
        this._updateFocusedItemState(args.previousValue, false, true);
        this._setFocusedItem($(args.value));
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
        this.callBase(args);
    }
  },

  _invalidate() {
    this.option('focusedElement', null);

    return this.callBase.apply(this, arguments);
  },

  _loadNextPage() {
    this._expectNextPageLoading();

    return this._dataController.loadNextPage();
  },

  _expectNextPageLoading() {
    this._startIndexForAppendedItems = 0;
  },

  _expectLastItemLoading() {
    this._startIndexForAppendedItems = -1;
  },

  _forgetNextPageLoading() {
    this._startIndexForAppendedItems = null;
  },

  _dataSourceChangedHandler(newItems) {
    const items = this.option('items');
    if (this._initialized && items && this._shouldAppendItems()) {
      this._renderedItemsCount = items.length;
      if (!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
        this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems));
      }

      this._forgetNextPageLoading();
      this._refreshContent();
    } else {
      this.option('items', newItems.slice());
    }
  },

  _refreshContent() {
    this._prepareContent();
    this._renderContent();
  },

  _dataSourceLoadErrorHandler() {
    this._forgetNextPageLoading();
    this.option('items', this.option('items'));
  },

  _shouldAppendItems() {
    return this._startIndexForAppendedItems != null && this._allowDynamicItemsAppend();
  },

  _allowDynamicItemsAppend() {
    return false;
  },

  _clean() {
    this._cleanFocusState();
    this._cleanItemContainer();
    this._inkRipple && delete this._inkRipple;
    this._resetActiveState();
  },

  _cleanItemContainer() {
    $(this._itemContainer()).empty();
  },

  _dispose() {
    this.callBase();

    clearTimeout(this._itemFocusTimeout);
  },

  _refresh() {
    this._cleanRenderedItems();

    this.callBase.apply(this, arguments);
  },

  _itemContainer() {
    return this.$element();
  },

  _itemClass() {
    return ITEM_CLASS;
  },

  _itemContentClass() {
    return this._itemClass() + CONTENT_CLASS_POSTFIX;
  },

  _selectedItemClass() {
    return SELECTED_ITEM_CLASS;
  },

  _itemResponseWaitClass() {
    return ITEM_RESPONSE_WAIT_CLASS;
  },

  _itemSelector() {
    return `.${this._itemClass()}`;
  },

  _itemDataKey() {
    return ITEM_DATA_KEY;
  },

  _itemIndexKey() {
    return ITEM_INDEX_KEY;
  },

  _itemElements() {
    return this._itemContainer().find(this._itemSelector());
  },

  _initMarkup() {
    this.callBase();
    this.onFocusedItemChanged = this._createActionByOption('onFocusedItemChanged');

    this.$element().addClass(COLLECTION_CLASS);
    this._prepareContent();
  },

  _prepareContent: deferRenderer(function () {
    this._renderContentImpl();
  }),

  _renderContent() {
    this._fireContentReadyAction();
  },

  _render() {
    this.callBase();

    this._attachClickEvent();
    this._attachHoldEvent();
    this._attachContextMenuEvent();
  },

  _getPointerEvent() {
    return pointerEvents.down;
  },

  _attachClickEvent() {
    const itemSelector = this._itemSelector();
    const pointerEvent = this._getPointerEvent();

    const clickEventNamespace = addNamespace(clickEventName, this.NAME);
    const pointerEventNamespace = addNamespace(pointerEvent, this.NAME);

    const pointerAction = new Action((args) => {
      const { event } = args;

      this._itemPointerDownHandler(event);
    });

    const clickEventCallback = (e) => this._itemClickHandler(e);
    const pointerEventCallback = (e) => {
      pointerAction.execute({
        element: $(e.target),
        event: e,
      });
    };

    eventsEngine.off(this._itemContainer(), clickEventNamespace, itemSelector);
    eventsEngine.off(this._itemContainer(), pointerEventNamespace, itemSelector);
    eventsEngine.on(this._itemContainer(), clickEventNamespace, itemSelector, clickEventCallback);
    eventsEngine.on(this._itemContainer(), pointerEventNamespace, itemSelector, pointerEventCallback);
  },

  _itemClickHandler(e, args, config) {
    this._itemDXEventHandler(e, 'onItemClick', args, config);
  },

  _itemPointerDownHandler(e) {
    if (!this.option('focusStateEnabled')) {
      return;
    }

    this._itemFocusHandler = function () {
      clearTimeout(this._itemFocusTimeout);
      this._itemFocusHandler = null;

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
    }.bind(this);

    this._itemFocusTimeout = setTimeout(this._forcePointerDownFocus.bind(this));
  },

  _closestFocusable($target) {
    if ($target.is(focusable)) {
      return $target;
    }
    $target = $target.parent();
    while ($target.length && !domAdapter.isDocument($target.get(0)) && !domAdapter.isDocumentFragment($target.get(0))) {
      if ($target.is(focusable)) {
        return $target;
      }
      $target = $target.parent();
    }
  },

  _forcePointerDownFocus() {
    this._itemFocusHandler && this._itemFocusHandler();
  },

  _updateFocusState() {
    this.callBase.apply(this, arguments);

    this._forcePointerDownFocus();
  },

  _attachHoldEvent() {
    const $itemContainer = this._itemContainer();
    const itemSelector = this._itemSelector();
    const eventName = addNamespace(holdEvent.name, this.NAME);

    eventsEngine.off($itemContainer, eventName, itemSelector);
    // @ts-expect-error
    eventsEngine.on($itemContainer, eventName, itemSelector, { timeout: this._getHoldTimeout() }, this._itemHoldHandler.bind(this));
  },

  _getHoldTimeout() {
    return this.option('itemHoldTimeout');
  },

  _shouldFireHoldEvent() {
    return this.hasActionSubscription('onItemHold');
  },

  _itemHoldHandler(e) {
    if (this._shouldFireHoldEvent()) {
      this._itemDXEventHandler(e, 'onItemHold');
    } else {
      e.cancel = true;
    }
  },

  _attachContextMenuEvent() {
    const $itemContainer = this._itemContainer();
    const itemSelector = this._itemSelector();
    const eventName = addNamespace(contextMenuEventName, this.NAME);

    eventsEngine.off($itemContainer, eventName, itemSelector);
    eventsEngine.on($itemContainer, eventName, itemSelector, this._itemContextMenuHandler.bind(this));
  },

  _shouldFireContextMenuEvent() {
    return this.hasActionSubscription('onItemContextMenu');
  },

  _itemContextMenuHandler(e) {
    if (this._shouldFireContextMenuEvent()) {
      this._itemDXEventHandler(e, 'onItemContextMenu');
    } else {
      e.cancel = true;
    }
  },

  _renderContentImpl() {
    const items = this.option('items') || [];
    if (this._renderedItemsCount) {
      this._renderItems(items.slice(this._renderedItemsCount));
    } else {
      this._renderItems(items);
    }
  },

  _renderItems(items) {
    if (items.length) {
      each(items, (index, itemData) => {
        this._renderItem(this._renderedItemsCount + index, itemData);
      });
    }

    this._renderEmptyMessage();
  },

  _getItemsContainer() {
    return this._itemContainer();
  },

  _setAttributes($element) {
    const attributes = { ...this.option('_itemAttributes') };
    const { class: customClassValue } = attributes;

    if (customClassValue) {
      const currentClassValue = $element.get(0).className;

      attributes.class = [currentClassValue, customClassValue].join(' ');
    }

    $element.attr(attributes);
  },

  _renderItem(index, itemData, $container, $itemToReplace) {
    const itemIndex = index?.item ?? index;
    $container = $container || this._getItemsContainer();
    const $itemFrame = this._renderItemFrame(itemIndex, itemData, $container, $itemToReplace);
    this._setElementData($itemFrame, itemData, itemIndex);
    this._setAttributes($itemFrame);
    this._attachItemClickEvent(itemData, $itemFrame);
    const $itemContent = this._getItemContent($itemFrame);

    const renderContentPromise = this._renderItemContent({
      index: itemIndex,
      itemData,
      container: getPublicElement($itemContent),
      contentClass: this._itemContentClass(),
      defaultTemplateName: this.option('itemTemplate'),
    });

    const that = this;
    when(renderContentPromise).done(($itemContent) => {
      that._postprocessRenderItem({
        itemElement: $itemFrame,
        itemContent: $itemContent,
        itemData,
        itemIndex,
      });

      that._executeItemRenderAction(index, itemData, getPublicElement($itemFrame));
    });

    return $itemFrame;
  },

  _getItemContent($itemFrame) {
    const $itemContent = $itemFrame.find(`.${ITEM_CONTENT_PLACEHOLDER_CLASS}`);
    $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    return $itemContent;
  },

  _attachItemClickEvent(itemData, $itemElement) {
    if (!itemData || !itemData.onClick) {
      return;
    }

    eventsEngine.on($itemElement, clickEventName, (e) => {
      this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
        event: e,
      });
    });
  },

  _renderItemContent(args) {
    const itemTemplateName = this._getItemTemplateName(args);
    const itemTemplate = this._getTemplate(itemTemplateName);

    this._addItemContentClasses(args);
    const $templateResult = $(this._createItemByTemplate(itemTemplate, args));
    if (!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      return args.container;
    }

    return this._renderItemContentByNode(args, $templateResult);
  },

  _renderItemContentByNode(args, $node) {
    $(args.container).replaceWith($node);
    args.container = getPublicElement($node);
    this._addItemContentClasses(args);

    return $node;
  },

  _addItemContentClasses(args) {
    const classes = [
      ITEM_CLASS + CONTENT_CLASS_POSTFIX,
      args.contentClass,
    ];

    $(args.container).addClass(classes.join(' '));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _appendItemToContainer($container, $itemFrame, index) {
    $itemFrame.appendTo($container);
  },

  _renderItemFrame(index, itemData, $container, $itemToReplace) {
    const $itemFrame = $('<div>');
    // eslint-disable-next-line no-new
    new this.constructor.ItemClass($itemFrame, this._itemOptions(), itemData || {});

    if ($itemToReplace && $itemToReplace.length) {
      $itemToReplace.replaceWith($itemFrame);
    } else {
      this._appendItemToContainer.call(this, $container, $itemFrame, index);
    }

    if (this.option('useItemTextAsTitle')) {
      const displayValue = this._displayGetter ? this._displayGetter(itemData) : itemData;
      $itemFrame.attr('title', displayValue);
    }

    return $itemFrame;
  },

  _itemOptions() {
    const that = this;
    return {
      watchMethod() {
        return that.option('integrationOptions.watchMethod');
      },
      owner: that,
      fieldGetter(field) {
        const expr = that.option(`${field}Expr`);
        const getter = compileGetter(expr);

        return getter;
      },
    };
  },

  _postprocessRenderItem: noop,

  _executeItemRenderAction(index, itemData, itemElement) {
    this._getItemRenderAction()({
      itemElement,
      itemIndex: index,
      itemData,
    });
  },

  _setElementData(element, data, index) {
    element
      .addClass([ITEM_CLASS, this._itemClass()].join(' '))
      .data(this._itemDataKey(), data)
      .data(this._itemIndexKey(), index);
  },

  _createItemRenderAction() {
    // eslint-disable-next-line no-return-assign
    return (this._itemRenderAction = this._createActionByOption('onItemRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering',
    }));
  },

  _getItemRenderAction() {
    return this._itemRenderAction || this._createItemRenderAction();
  },

  _getItemTemplateName(args) {
    const data = args.itemData;
    const templateProperty = args.templateProperty || this.option('itemTemplateProperty');
    const template = data && data[templateProperty];

    return template || args.defaultTemplateName;
  },

  _createItemByTemplate(itemTemplate, renderArgs) {
    return itemTemplate.render({
      model: renderArgs.itemData,
      container: renderArgs.container,
      index: renderArgs.index,
      onRendered: this._onItemTemplateRendered(itemTemplate, renderArgs),
    });
  },

  _onItemTemplateRendered() {
    return noop;
  },

  _emptyMessageContainer() {
    return this._itemContainer();
  },

  _renderEmptyMessage(items) {
    items = items || this.option('items');
    const noDataText = this.option('noDataText');
    const hideNoData = !noDataText || (items && items.length) || this._dataController.isLoading();

    if (hideNoData && this._$noData) {
      this._$noData.remove();
      this._$noData = null;
      this.setAria('label', undefined);
    }

    if (!hideNoData) {
      this._$noData = this._$noData || $('<div>').addClass('dx-empty-message');
      this._$noData.appendTo(this._emptyMessageContainer());

      if (this.option('encodeNoDataText')) {
        this._$noData.text(noDataText);
      } else {
        this._$noData.html(noDataText);
      }
    }
    this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData);
  },

  _itemDXEventHandler(dxEvent, handlerOptionName, actionArgs, actionConfig) {
    this._itemEventHandler(dxEvent.target, handlerOptionName, extend(actionArgs, {
      event: dxEvent,
    }), actionConfig);
  },

  _itemEventHandler(initiator, handlerOptionName, actionArgs, actionConfig) {
    const action = this._createActionByOption(handlerOptionName, extend({
      validatingTargetName: 'itemElement',
    }, actionConfig));
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  },

  _itemEventHandlerByHandler(initiator, handler, actionArgs, actionConfig) {
    const action = this._createAction(handler, extend({
      validatingTargetName: 'itemElement',
    }, actionConfig));
    return this._itemEventHandlerImpl(initiator, action, actionArgs);
  },

  _itemEventHandlerImpl(initiator, action, actionArgs) {
    const $itemElement = this._closestItemElement($(initiator));
    const args = extend({}, actionArgs);

    return action(extend(actionArgs, this._extendActionArgs($itemElement), args));
  },

  _extendActionArgs($itemElement) {
    return {
      itemElement: getPublicElement($itemElement),
      itemIndex: this._itemElements().index($itemElement),
      itemData: this._getItemData($itemElement),
    };
  },

  _closestItemElement($element) {
    return $($element).closest(this._itemSelector());
  },

  _getItemData(itemElement) {
    return $(itemElement).data(this._itemDataKey());
  },

  _getSummaryItemsSize(dimension, items, includeMargin) {
    let result = 0;

    if (items) {
      each(items, (_, item) => {
        if (dimension === 'width') {
          result += getOuterWidth(item, includeMargin || false);
        } else if (dimension === 'height') {
          result += getOuterHeight(item, includeMargin || false);
        }
      });
    }

    return result;
  },

  getFocusedItemId() {
    if (!this._focusedItemId) {
      this._focusedItemId = `dx-${new Guid()}`;
    }

    return this._focusedItemId;
  },

  itemElements() {
    return this._itemElements();
  },

  itemsContainer() {
    return this._itemContainer();
  },

}).include(DataHelperMixin);

CollectionWidget.ItemClass = CollectionWidgetItem;

export default CollectionWidget;
