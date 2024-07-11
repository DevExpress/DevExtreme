"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _position = _interopRequireDefault(require("../../../animation/position"));
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _dom = require("../../../core/utils/dom");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _contextmenu = require("../../../events/contextmenu");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hold = _interopRequireDefault(require("../../../events/hold"));
var _index = require("../../../events/utils/index");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _ui2 = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _themes = require("../../../ui/themes");
var _m_menu_base = _interopRequireDefault(require("../../ui/context_menu/m_menu_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_ITEM_CLASS = `${DX_MENU_CLASS}-item`;
const DX_MENU_ITEM_EXPANDED_CLASS = `${DX_MENU_ITEM_CLASS}-expanded`;
const DX_MENU_PHONE_CLASS = 'dx-menu-phone-overlay';
const DX_MENU_ITEMS_CONTAINER_CLASS = `${DX_MENU_CLASS}-items-container`;
const DX_MENU_ITEM_WRAPPER_CLASS = `${DX_MENU_ITEM_CLASS}-wrapper`;
const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_HAS_CONTEXT_MENU_CLASS = 'dx-has-context-menu';
const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const SCROLLABLE_CLASS = 'dx-scrollable';
const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const FOCUS_FIRST = 'first';
const FOCUS_LAST = 'last';
const ACTIONS = ['onShowing', 'onShown', 'onSubmenuCreated', 'onHiding', 'onHidden', 'onPositioning', 'onLeftFirstItem', 'onLeftLastItem', 'onCloseRootSubmenu', 'onExpandLastSubmenu'];
const LOCAL_SUBMENU_DIRECTIONS = [FOCUS_UP, FOCUS_DOWN, FOCUS_FIRST, FOCUS_LAST];
const DEFAULT_SHOW_EVENT = 'dxcontextmenu';
const SUBMENU_PADDING = 10;
const BORDER_WIDTH = 1;
const window = (0, _window.getWindow)();
class ContextMenu extends _m_menu_base.default {
  getShowEvent(showEventOption) {
    if ((0, _type.isObject)(showEventOption)) {
      if (showEventOption.name !== null) {
        return showEventOption.name ?? DEFAULT_SHOW_EVENT;
      }
    } else {
      return showEventOption;
    }
    return null;
  }
  getShowDelay(showEventOption) {
    // @ts-expect-error
    return (0, _type.isObject)(showEventOption) && showEventOption.delay;
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      showEvent: DEFAULT_SHOW_EVENT,
      hideOnOutsideClick: true,
      position: {
        at: 'top left',
        my: 'top left'
      },
      onShowing: null,
      onShown: null,
      onSubmenuCreated: null,
      onHiding: null,
      onHidden: null,
      onPositioning: null,
      submenuDirection: 'auto',
      visible: false,
      target: undefined,
      onLeftFirstItem: null,
      onLeftLastItem: null,
      onCloseRootSubmenu: null,
      onExpandLastSubmenu: null
    });
  }
  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([{
      device: () => !(0, _window.hasWindow)(),
      options: {
        animation: null
      }
    }]);
  }
  _setDeprecatedOptions() {
    super._setDeprecatedOptions();
    (0, _extend.extend)(this._deprecatedOptions, {
      closeOnOutsideClick: {
        since: '22.2',
        alias: 'hideOnOutsideClick'
      }
    });
  }
  _initActions() {
    this._actions = {};
    (0, _iterator.each)(ACTIONS, (index, action) => {
      this._actions[action] = this._createActionByOption(action) || _common.noop;
    });
  }
  _setOptionsByReference() {
    super._setOptionsByReference();
    (0, _extend.extend)(this._optionsByReference, {
      animation: true,
      selectedItem: true
    });
  }
  _focusInHandler() {}
  _itemContainer() {
    // @ts-expect-error
    return this._overlay ? this._overlay.$content() : (0, _renderer.default)();
  }
  _eventBindingTarget() {
    return this._itemContainer();
  }
  itemsContainer() {
    // @ts-expect-error
    return this._overlay ? this._overlay.$content() : undefined;
  }
  _supportedKeys() {
    const selectItem = () => {
      // @ts-expect-error
      const $item = (0, _renderer.default)(this.option('focusedElement'));
      this.hide();
      if (!$item.length || !this._isSelectionEnabled()) {
        return;
      }
      this.selectItem($item[0]);
    };
    return (0, _extend.extend)(super._supportedKeys(), {
      space: selectItem,
      escape: this.hide
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getActiveItem(last) {
    const $availableItems = this._getAvailableItems();
    const $focusedItem = $availableItems.filter(`.${DX_STATE_FOCUSED_CLASS}`);
    const $hoveredItem = $availableItems.filter(`.${DX_STATE_HOVER_CLASS}`);
    const $hoveredItemContainer = $hoveredItem.closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
    if ($hoveredItemContainer.find(`.${DX_MENU_ITEM_CLASS}`).index($focusedItem) >= 0) {
      return $focusedItem;
    }
    if ($hoveredItem.length) {
      return $hoveredItem;
    }
    return super._getActiveItem();
  }
  _moveFocus(location) {
    const $items = this._getItemsByLocation(location);
    const $oldTarget = this._getActiveItem(true);
    const $hoveredItem = this.itemsContainer().find(`.${DX_STATE_HOVER_CLASS}`);
    // @ts-expect-error
    const $focusedItem = (0, _renderer.default)(this.option('focusedElement'));
    const $activeItemHighlighted = !!($focusedItem.length || $hoveredItem.length);
    let $newTarget;
    switch (location) {
      case FOCUS_UP:
        $newTarget = $activeItemHighlighted ? this._prevItem($items) : $oldTarget;
        this._setFocusedElement($newTarget);
        if ($oldTarget.is($items.first())) {
          this._actions.onLeftFirstItem($oldTarget);
        }
        break;
      case FOCUS_DOWN:
        $newTarget = $activeItemHighlighted ? this._nextItem($items) : $oldTarget;
        this._setFocusedElement($newTarget);
        if ($oldTarget.is($items.last())) {
          this._actions.onLeftLastItem($oldTarget);
        }
        break;
      case FOCUS_RIGHT:
        $newTarget = this.option('rtlEnabled') ? this._hideSubmenuHandler() : this._expandSubmenuHandler($items, location);
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_LEFT:
        $newTarget = this.option('rtlEnabled') ? this._expandSubmenuHandler($items, location) : this._hideSubmenuHandler();
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_FIRST:
        $newTarget = $items.first();
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_LAST:
        $newTarget = $items.last();
        this._setFocusedElement($newTarget);
        break;
      default:
        return super._moveFocus(location);
    }
  }
  _setFocusedElement($element) {
    if ($element && $element.length !== 0) {
      this.option('focusedElement', (0, _element.getPublicElement)($element));
      this._scrollToElement($element);
    }
  }
  _scrollToElement($element) {
    const $scrollableElement = $element.closest(`.${SCROLLABLE_CLASS}`);
    const scrollableInstance = $scrollableElement.dxScrollable('instance');
    scrollableInstance === null || scrollableInstance === void 0 || scrollableInstance.scrollToElement($element);
  }
  _getItemsByLocation(location) {
    const $activeItem = this._getActiveItem(true);
    let $items;
    if (LOCAL_SUBMENU_DIRECTIONS.includes(location)) {
      $items = $activeItem.closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`).children().children();
    }
    $items = this._getAvailableItems($items);
    return $items;
  }
  _getAriaTarget() {
    return this.$element();
  }
  _refreshActiveDescendant() {
    if ((0, _type.isDefined)(this._overlay)) {
      // @ts-expect-error
      const $target = this._overlay.$content();
      super._refreshActiveDescendant($target);
    }
  }
  // @ts-expect-error
  _hideSubmenuHandler() {
    const $curItem = this._getActiveItem(true);
    const $parentItem = $curItem.parents(`.${DX_MENU_ITEM_EXPANDED_CLASS}`).first();
    if ($parentItem.length) {
      this._hideSubmenusOnSameLevel($parentItem);
      this._hideSubmenu($curItem.closest(`.${DX_SUBMENU_CLASS}`));
      return $parentItem;
    }
    this._actions.onCloseRootSubmenu($curItem);
  }
  _expandSubmenuHandler($items, location) {
    const $curItem = this._getActiveItem(true);
    const itemData = this._getItemData($curItem);
    const node = this._dataAdapter.getNodeByItem(itemData);
    const isItemHasSubmenu = this._hasSubmenu(node);
    const $submenu = $curItem.children(`.${DX_SUBMENU_CLASS}`);
    if (isItemHasSubmenu && !$curItem.hasClass(DX_STATE_DISABLED_CLASS)) {
      // @ts-expect-error
      if (!$submenu.length || $submenu.css('visibility') === 'hidden') {
        this._showSubmenu($curItem);
      }
      return this._nextItem(this._getItemsByLocation(location));
    }
    this._actions.onExpandLastSubmenu($curItem);
    return undefined;
  }
  _clean() {
    if (this._overlay) {
      this._overlay.$element().remove();
      // @ts-expect-error
      this._overlay = null;
    }
    this._detachShowContextMenuEvents(this._getTarget());
    super._clean();
  }
  _initMarkup() {
    this.$element()
    // @ts-expect-error
    .addClass(DX_HAS_CONTEXT_MENU_CLASS);
    super._initMarkup();
  }
  _render() {
    super._render();
    this._renderVisibility(this.option('visible'));
    this._addWidgetClass();
  }
  _isTargetOutOfComponent(relatedTarget) {
    const isInsideContextMenu = (0, _renderer.default)(relatedTarget).closest(`.${DX_CONTEXT_MENU_CLASS}`).length !== 0;
    return !isInsideContextMenu;
  }
  _focusOutHandler(e) {
    const {
      relatedTarget
    } = e;
    if (relatedTarget) {
      const isTargetOutside = this._isTargetOutOfComponent(relatedTarget);
      if (isTargetOutside) {
        this.hide();
      }
    }
    super._focusOutHandler(e);
  }
  _renderContentImpl() {
    this._detachShowContextMenuEvents(this._getTarget());
    this._attachShowContextMenuEvents();
  }
  _attachKeyboardEvents() {
    !this._keyboardListenerId && this._focusTarget().length && super._attachKeyboardEvents();
  }
  _renderContextMenuOverlay() {
    if (this._overlay) {
      return;
    }
    const overlayOptions = this._getOverlayOptions();
    // @ts-expect-error
    this._overlay = this._createComponent((0, _renderer.default)('<div>').appendTo(this._$element), _ui.default, overlayOptions);
    // @ts-expect-error
    const $overlayContent = this._overlay.$content();
    $overlayContent.addClass(DX_CONTEXT_MENU_CLASS);
    this._addCustomCssClass($overlayContent);
    this._addPlatformDependentClass($overlayContent);
    this._attachContextMenuEvent();
  }
  preventShowingDefaultContextMenuAboveOverlay() {
    const $itemContainer = this._itemContainer();
    const eventName = (0, _index.addNamespace)(_contextmenu.name, this.NAME);
    _events_engine.default.off($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`);
    _events_engine.default.on($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`, e => {
      e.stopPropagation();
      e.preventDefault();
      _events_engine.default.off($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`);
    });
  }
  _itemContextMenuHandler(e) {
    super._itemContextMenuHandler(e);
    e.stopPropagation();
  }
  _addPlatformDependentClass($element) {
    if (_devices.default.current().phone) {
      $element.addClass(DX_MENU_PHONE_CLASS);
    }
  }
  _detachShowContextMenuEvents(target) {
    // @ts-expect-error
    const showEvent = this.getShowEvent(this.option('showEvent'));
    if (!showEvent) {
      return;
    }
    const eventName = (0, _index.addNamespace)(showEvent, this.NAME);
    if (this._showContextMenuEventHandler) {
      _events_engine.default.off(_dom_adapter.default.getDocument(), eventName, target,
      // @ts-expect-error
      this._showContextMenuEventHandler);
    } else {
      _events_engine.default.off((0, _renderer.default)(target), eventName);
    }
  }
  _attachShowContextMenuEvents() {
    const target = this._getTarget();
    // @ts-expect-error
    const showEvent = this.getShowEvent(this.option('showEvent'));
    if (!showEvent) {
      return;
    }
    const eventName = (0, _index.addNamespace)(showEvent, this.NAME);
    // @ts-expect-error
    let contextMenuAction = this._createAction(e => {
      // @ts-expect-error
      const delay = this.getShowDelay(this.option('showEvent'));
      if (delay) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(() => this._show(e.event), delay);
      } else {
        this._show(e.event);
      }
    }, {
      validatingTargetName: 'target'
    });
    const handler = e => contextMenuAction({
      event: e,
      target: (0, _renderer.default)(e.currentTarget)
    });
    // @ts-expect-error
    contextMenuAction = this._createAction(contextMenuAction);
    if ((0, _type.isRenderer)(target) || target.nodeType || (0, _type.isWindow)(target)) {
      this._showContextMenuEventHandler = undefined;
      _events_engine.default.on(target, eventName, handler);
    } else {
      this._showContextMenuEventHandler = handler;
      _events_engine.default.on(_dom_adapter.default.getDocument(), eventName, target, this._showContextMenuEventHandler);
    }
  }
  _hoverEndHandler(e) {
    super._hoverEndHandler(e);
    e.stopPropagation();
  }
  _renderDimensions() {}
  _renderContainer($wrapper, submenuContainer) {
    const $holder = submenuContainer || this._itemContainer();
    $wrapper = (0, _renderer.default)('<div>');
    $wrapper.appendTo($holder).addClass(DX_SUBMENU_CLASS).css('visibility', submenuContainer ? 'hidden' : 'visible');
    if (!$wrapper.parent().hasClass(OVERLAY_CONTENT_CLASS)) {
      this._addCustomCssClass($wrapper);
    }
    const $itemsContainer = super._renderContainer($wrapper);
    if (submenuContainer) {
      return $itemsContainer;
    }
    if (this.option('width')) {
      // @ts-expect-error
      return $itemsContainer.css('minWidth', this.option('width'));
    }
    if (this.option('height')) {
      // @ts-expect-error
      return $itemsContainer.css('minHeight', this.option('height'));
    }
    return $itemsContainer;
  }
  _renderSubmenuItems(node, $itemFrame) {
    this._renderItems(this._getChildNodes(node), $itemFrame);
    const $submenu = $itemFrame.children(`.${DX_SUBMENU_CLASS}`);
    this._actions.onSubmenuCreated({
      itemElement: (0, _element.getPublicElement)($itemFrame),
      itemData: node.internalFields.item,
      submenuElement: (0, _element.getPublicElement)($submenu)
    });
    this._initScrollable($submenu);
    this.setAria({
      role: 'menu'
    }, $submenu);
  }
  _getOverlayOptions() {
    const position = this.option('position');
    const overlayOptions = {
      focusStateEnabled: this.option('focusStateEnabled'),
      animation: this.option('animation'),
      innerOverlay: true,
      hideOnOutsideClick: e => this._hideOnOutsideClickHandler(e),
      propagateOutsideClick: true,
      hideOnParentScroll: true,
      deferRendering: false,
      position: {
        // @ts-expect-error
        at: position.at,
        // @ts-expect-error
        my: position.my,
        of: this._getTarget(),
        collision: 'flipfit'
      },
      shading: false,
      showTitle: false,
      height: 'auto',
      width: 'auto',
      onShown: this._overlayShownActionHandler.bind(this),
      onHiding: this._overlayHidingActionHandler.bind(this),
      onHidden: this._overlayHiddenActionHandler.bind(this),
      visualContainer: window
    };
    return overlayOptions;
  }
  _overlayShownActionHandler(arg) {
    this._actions.onShown(arg);
  }
  _overlayHidingActionHandler(arg) {
    this._actions.onHiding(arg);
    if (!arg.cancel) {
      this._hideAllShownSubmenus();
      this._setOptionWithoutOptionChange('visible', false);
    }
  }
  _overlayHiddenActionHandler(arg) {
    this._actions.onHidden(arg);
  }
  _shouldHideOnOutsideClick(e) {
    // @ts-expect-error
    const {
      closeOnOutsideClick,
      hideOnOutsideClick
    } = this.option();
    if ((0, _type.isFunction)(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }
    if ((0, _type.isFunction)(closeOnOutsideClick)) {
      return closeOnOutsideClick(e);
    }
    return hideOnOutsideClick || closeOnOutsideClick;
  }
  _hideOnOutsideClickHandler(e) {
    if (!this._shouldHideOnOutsideClick(e)) {
      return false;
    }
    // @ts-expect-error
    if (_dom_adapter.default.isDocument(e.target)) {
      return true;
    }
    const $activeItemContainer = this._getActiveItemsContainer(e.target);
    const $itemContainers = this._getItemsContainers();
    const $clickedItem = this._searchActiveItem(e.target);
    // @ts-expect-error
    const $rootItem = this.$element().parents(`.${DX_MENU_ITEM_CLASS}`);
    const isRootItemClicked = $clickedItem[0] === $rootItem[0] && $clickedItem.length && $rootItem.length;
    const isInnerOverlayClicked = this._isIncludeOverlay($activeItemContainer, $itemContainers) && $clickedItem.length;
    if (isInnerOverlayClicked || isRootItemClicked) {
      if (this._getShowSubmenuMode() === 'onClick') {
        this._hideAllShownChildSubmenus($clickedItem);
      }
      return false;
    }
    return true;
  }
  _getActiveItemsContainer(target) {
    return (0, _renderer.default)(target).closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
  }
  _getItemsContainers() {
    // @ts-expect-error
    return this._overlay.$content().find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
  }
  _searchActiveItem(target) {
    return (0, _renderer.default)(target).closest(`.${DX_MENU_ITEM_CLASS}`).eq(0);
  }
  _isIncludeOverlay($activeOverlay, $allOverlays) {
    let isSame = false;
    (0, _iterator.each)($allOverlays, (index, $overlay) => {
      if ($activeOverlay.is($overlay) && !isSame) {
        isSame = true;
      }
    });
    return isSame;
  }
  _hideAllShownChildSubmenus($clickedItem) {
    const $submenuElements = $clickedItem.find(`.${DX_SUBMENU_CLASS}`);
    const shownSubmenus = (0, _extend.extend)([], this._shownSubmenus);
    if ($submenuElements.length > 0) {
      (0, _iterator.each)(shownSubmenus, (index, $submenu) => {
        const $context = this._searchActiveItem($submenu.context).parent();
        if ($context.parent().is($clickedItem.parent().parent()) && !$context.is($clickedItem.parent())) {
          this._hideSubmenu($submenu);
        }
      });
    }
  }
  _initScrollable($container) {
    this._createComponent($container, _ui2.default, {
      useKeyboard: false,
      _onVisibilityChanged: scrollable => {
        scrollable.scrollTo(0);
      }
    });
  }
  _setSubMenuHeight($submenu, anchor, isNestedSubmenu) {
    const $itemsContainer = $submenu.find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
    const contentHeight = (0, _size.getOuterHeight)($itemsContainer);
    const maxHeight = this._getMaxHeight(anchor, !isNestedSubmenu);
    const menuHeight = Math.min(contentHeight, maxHeight);
    $submenu.css('height', isNestedSubmenu ? menuHeight : '100%');
  }
  _getMaxHeight(anchor) {
    let considerAnchorHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const windowHeight = (0, _size.getOuterHeight)(window);
    const isAnchorRenderer = (0, _type.isRenderer)(anchor);
    const document = _dom_adapter.default.getDocument();
    const isAnchorDocument = anchor.length && anchor[0] === document;
    if (!isAnchorRenderer || isAnchorDocument) {
      return windowHeight;
    }
    const offsetTop = anchor[0].getBoundingClientRect().top;
    const anchorHeight = (0, _size.getOuterHeight)(anchor);
    const availableHeight = considerAnchorHeight ? Math.max(offsetTop, windowHeight - offsetTop - anchorHeight) : Math.max(offsetTop + anchorHeight, windowHeight - offsetTop);
    return availableHeight - SUBMENU_PADDING;
  }
  _dimensionChanged() {
    if (!this._shownSubmenus) {
      return;
    }
    this._shownSubmenus.forEach($submenu => {
      const $item = $submenu.closest(`.${DX_MENU_ITEM_CLASS}`);
      this._setSubMenuHeight($submenu, $item, true);
      this._scrollToElement($item);
      const submenuPosition = this._getSubmenuPosition($item);
      // @ts-expect-error
      _position.default.setup($submenu, submenuPosition);
    });
  }
  _getSubmenuBorderWidth() {
    return (0, _themes.isMaterialBased)((0, _themes.current)()) ? 0 : BORDER_WIDTH;
  }
  _showSubmenu($item) {
    const node = this._dataAdapter.getNodeByItem(this._getItemData($item));
    this._hideSubmenusOnSameLevel($item);
    if (!this._hasSubmenu(node)) return;
    let $submenu = $item.children(`.${DX_SUBMENU_CLASS}`);
    const isSubmenuRendered = $submenu.length;
    super._showSubmenu($item);
    if (!isSubmenuRendered) {
      this._renderSubmenuItems(node, $item);
      $submenu = $item.children(`.${DX_SUBMENU_CLASS}`);
    }
    this._setSubMenuHeight($submenu, $item, true);
    if (!this._isSubmenuVisible($submenu)) {
      this._drawSubmenu($item);
    }
  }
  _hideSubmenusOnSameLevel($item) {
    const $expandedItems = $item.parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`).siblings().find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`);
    if ($expandedItems.length) {
      $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
      this._hideSubmenu($expandedItems.find(`.${DX_SUBMENU_CLASS}`));
    }
  }
  _hideSubmenuGroup($submenu) {
    if (this._isSubmenuVisible($submenu)) {
      this._hideSubmenuCore($submenu);
    }
  }
  _isSubmenuVisible($submenu) {
    return $submenu.css('visibility') === 'visible';
  }
  _drawSubmenu($itemElement) {
    // @ts-expect-error
    const animation = this.option('animation') ? this.option('animation').show : {};
    const $submenu = $itemElement.children(`.${DX_SUBMENU_CLASS}`);
    const submenuPosition = this._getSubmenuPosition($itemElement);
    if (this._overlay && this._overlay.option('visible')) {
      if (!(0, _type.isDefined)(this._shownSubmenus)) {
        this._shownSubmenus = [];
      }
      if (!this._shownSubmenus.includes($submenu)) {
        this._shownSubmenus.push($submenu);
      }
      if (animation) {
        // @ts-expect-error
        _fx.default.stop($submenu);
      }
      // @ts-expect-error
      _position.default.setup($submenu, submenuPosition);
      if (animation) {
        if ((0, _type.isPlainObject)(animation.to)) {
          // @ts-expect-error
          animation.to.position = submenuPosition;
        }
        this._animate($submenu, animation);
      }
      $submenu.css('visibility', 'visible');
    }
  }
  _animate($container, options) {
    _fx.default.animate($container, options);
  }
  _getSubmenuPosition($rootItem) {
    // @ts-expect-error
    const submenuDirection = this.option('submenuDirection').toLowerCase();
    const $rootItemWrapper = $rootItem.parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`);
    const position = {
      collision: 'flip',
      of: $rootItemWrapper,
      // @ts-expect-error
      offset: {
        h: 0,
        v: -1
      }
    };
    switch (submenuDirection) {
      case 'left':
        position.at = 'left top';
        position.my = 'right top';
        break;
      case 'right':
        position.at = 'right top';
        position.my = 'left top';
        break;
      default:
        if (this.option('rtlEnabled')) {
          position.at = 'left top';
          position.my = 'right top';
        } else {
          position.at = 'right top';
          position.my = 'left top';
        }
        break;
    }
    return position;
  }
  // TODO: try to simplify it
  _updateSubmenuVisibilityOnClick(actionArgs) {
    if (!actionArgs.args.length) return;
    const {
      itemData
    } = actionArgs.args[0];
    const node = this._dataAdapter.getNodeByItem(itemData);
    if (!node) return;
    const $itemElement = (0, _renderer.default)(actionArgs.args[0].itemElement);
    let $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
    const shouldRenderSubmenu = this._hasSubmenu(node) && !$submenu.length;
    if (shouldRenderSubmenu) {
      this._renderSubmenuItems(node, $itemElement);
      $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
    }
    // @ts-expect-error
    if ($itemElement.context === $submenu.context && $submenu.css('visibility') === 'visible') {
      return;
    }
    this._updateSelectedItemOnClick(actionArgs);
    // T238943. Give the workaround with e.cancel and remove this hack
    const notCloseMenuOnItemClick = itemData && itemData.closeMenuOnClick === false;
    if (!itemData || itemData.disabled || notCloseMenuOnItemClick) {
      return;
    }
    if ($submenu.length === 0) {
      const $prevSubmenu = (0, _renderer.default)($itemElement.parents(`.${DX_SUBMENU_CLASS}`)[0]);
      this._hideSubmenu($prevSubmenu);
      if (!actionArgs.canceled && this._overlay && this._overlay.option('visible')) {
        this.option('visible', false);
      }
    } else {
      if (this._shownSubmenus && this._shownSubmenus.length > 0) {
        if (this._shownSubmenus[0].is($submenu)) {
          this._hideSubmenu($submenu); // close to parent?
        }
      }
      this._showSubmenu($itemElement);
    }
  }
  _hideSubmenu($curSubmenu) {
    const shownSubmenus = (0, _extend.extend)([], this._shownSubmenus);
    (0, _iterator.each)(shownSubmenus, (index, $submenu) => {
      if ($curSubmenu.is($submenu) || (0, _dom.contains)($curSubmenu[0], $submenu[0])) {
        $submenu.parent().removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
        this._hideSubmenuCore($submenu);
      }
    });
  }
  _hideSubmenuCore($submenu) {
    // @ts-expect-error
    const index = this._shownSubmenus.indexOf($submenu);
    // @ts-expect-error
    const animation = this.option('animation') ? this.option('animation').hide : null;
    if (index >= 0) {
      // @ts-expect-error
      this._shownSubmenus.splice(index, 1);
    }
    this._stopAnimate($submenu);
    animation && this._animate($submenu, animation);
    $submenu.css('visibility', 'hidden');
    // @ts-expect-error
    const scrollableInstance = $submenu.dxScrollable('instance');
    scrollableInstance.scrollTo(0);
    this.option('focusedElement', null);
  }
  _stopAnimate($container) {
    // @ts-expect-error
    _fx.default.stop($container, true);
  }
  _hideAllShownSubmenus() {
    const shownSubmenus = (0, _extend.extend)([], this._shownSubmenus);
    // @ts-expect-error
    const $expandedItems = this._overlay.$content().find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`);
    $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
    (0, _iterator.each)(shownSubmenus, (_, $submenu) => {
      this._hideSubmenu($submenu);
    });
  }
  _visibilityChanged(visible) {
    if (visible) {
      this._renderContentImpl();
    }
  }
  _optionChanged(args) {
    if (ACTIONS.includes(args.name)) {
      this._initActions();
      return;
    }
    switch (args.name) {
      case 'visible':
        this._renderVisibility(args.value);
        break;
      case 'showEvent':
      case 'position':
      case 'submenuDirection':
        this._invalidate();
        break;
      case 'target':
        args.previousValue && this._detachShowContextMenuEvents(args.previousValue);
        this._invalidate();
        break;
      case 'closeOnOutsideClick':
      case 'hideOnOutsideClick':
        break;
      default:
        super._optionChanged(args);
    }
  }
  _renderVisibility(showing) {
    return showing ? this._show() : this._hide();
  }
  _toggleVisibility() {}
  _show(event) {
    const args = {
      jQEvent: event
    };
    let promise = (0, _deferred.Deferred)().reject().promise();
    this._actions.onShowing(args);
    // @ts-expect-error
    if (args.cancel) {
      return promise;
    }
    const position = this._positionContextMenu(event);
    if (position) {
      var _event$originalEvent;
      if (!this._overlay) {
        this._renderContextMenuOverlay();
        // @ts-expect-error
        this._overlay.$content().addClass(this._widgetClass());
        this._renderFocusState();
        this._attachHoverEvents();
        this._attachClickEvent();
        this._renderItems(this._dataAdapter.getRootNodes());
      }
      const $subMenu = (0, _renderer.default)(this._overlay.content()).children(`.${DX_SUBMENU_CLASS}`);
      this._setOptionWithoutOptionChange('visible', true);
      this._overlay.option({
        height: () => this._getMaxHeight(position.of),
        maxHeight: () => {
          const $content = $subMenu.find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
          const borderWidth = this._getSubmenuBorderWidth();
          return (0, _size.getOuterHeight)($content) + borderWidth * 2;
        },
        position
      });
      if ($subMenu.length) {
        this._setSubMenuHeight($subMenu, position.of, false);
      }
      promise = this._overlay.show();
      event && event.stopPropagation();
      this._setAriaAttributes();
      // T983617. Prevent the browser's context menu appears on desktop touch screens.
      if ((event === null || event === void 0 || (_event$originalEvent = event.originalEvent) === null || _event$originalEvent === void 0 ? void 0 : _event$originalEvent.type) === _hold.default.name) {
        this.preventShowingDefaultContextMenuAboveOverlay();
      }
    }
    return promise;
  }
  _renderItems(nodes, submenuContainer) {
    super._renderItems(nodes, submenuContainer);
    const $submenu = (0, _renderer.default)(this._overlay.content()).children(`.${DX_SUBMENU_CLASS}`);
    if ($submenu.length) {
      this._initScrollable($submenu);
    }
  }
  _setAriaAttributes() {
    this._overlayContentId = `dx-${new _guid.default()}`;
    this.setAria('owns', this._overlayContentId);
    // @ts-expect-error
    this.setAria({
      id: this._overlayContentId,
      role: 'menu'
    }, this._overlay.$content());
  }
  _cleanAriaAttributes() {
    // @ts-expect-error
    this._overlay && this.setAria('id', null, this._overlay.$content());
    this.setAria('owns', undefined);
  }
  _getTarget() {
    // @ts-expect-error
    return this.option('target') || this.option('position').of || (0, _renderer.default)(_dom_adapter.default.getDocument());
  }
  _getContextMenuPosition() {
    return (0, _extend.extend)({}, this.option('position'), {
      of: this._getTarget()
    });
  }
  _positionContextMenu(jQEvent) {
    let position = this._getContextMenuPosition();
    const isInitialPosition = this._isInitialOptionValue('position');
    const positioningAction = this._createActionByOption('onPositioning');
    if (jQEvent && jQEvent.preventDefault && isInitialPosition) {
      position.of = jQEvent;
    }
    const actionArgs = {
      position,
      event: jQEvent
    };
    positioningAction(actionArgs);
    // @ts-expect-error
    if (actionArgs.cancel) {
      position = null;
    } else if (actionArgs.event) {
      actionArgs.event.cancel = true;
      jQEvent.preventDefault();
    }
    return position;
  }
  _refresh() {
    if (!(0, _window.hasWindow)()) {
      super._refresh();
    } else if (this._overlay) {
      const lastPosition = this._overlay.option('position');
      super._refresh();
      this._overlay && this._overlay.option('position', lastPosition);
    } else {
      super._refresh();
    }
  }
  _hide() {
    let promise;
    if (this._overlay) {
      promise = this._overlay.hide();
      this._setOptionWithoutOptionChange('visible', false);
    }
    this._cleanAriaAttributes();
    this.option('focusedElement', null);
    return promise || (0, _deferred.Deferred)().reject().promise();
  }
  toggle(showing) {
    const visible = this.option('visible');
    showing = showing === undefined ? !visible : showing;
    return this._renderVisibility(showing);
  }
  show() {
    return this.toggle(true);
  }
  hide() {
    return this.toggle(false);
  }
}
// @ts-expect-error
(0, _component_registrator.default)('dxContextMenu', ContextMenu);
var _default = exports.default = ContextMenu;