"use strict";

var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _size = require("../../../core/utils/size");
var _click = require("../../../events/click");
var _emitter = require("../../../events/core/emitter.feedback");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _action_sheet = _interopRequireDefault(require("../../../ui/action_sheet"));
var _themes = require("../../../ui/themes");
var _m_listEditDecorator = _interopRequireDefault(require("./m_list.edit.decorator.switchable"));
var _m_listEdit = _interopRequireDefault(require("./m_list.edit.decorator_menu_helper"));
var _m_listEdit2 = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const CLICK_EVENT_NAME = (0, _index.addNamespace)(_click.name, LIST_EDIT_DECORATOR);
const ACTIVE_EVENT_NAME = (0, _index.addNamespace)(_emitter.active, LIST_EDIT_DECORATOR);
const SLIDE_MENU_CLASS = 'dx-list-slide-menu';
const SLIDE_MENU_WRAPPER_CLASS = 'dx-list-slide-menu-wrapper';
const SLIDE_MENU_CONTENT_CLASS = 'dx-list-slide-menu-content';
const SLIDE_MENU_BUTTONS_CONTAINER_CLASS = 'dx-list-slide-menu-buttons-container';
const SLIDE_MENU_BUTTONS_CLASS = 'dx-list-slide-menu-buttons';
const SLIDE_MENU_BUTTON_CLASS = 'dx-list-slide-menu-button';
const SLIDE_MENU_BUTTON_MENU_CLASS = 'dx-list-slide-menu-button-menu';
const SLIDE_MENU_BUTTON_DELETE_CLASS = 'dx-list-slide-menu-button-delete';
const SLIDE_MENU_ANIMATION_DURATION = 400;
const SLIDE_MENU_ANIMATION_EASING = 'cubic-bezier(0.075, 0.82, 0.165, 1)';
(0, _m_listEdit2.register)('menu', 'slide', _m_listEditDecorator.default.inherit({
  _shouldHandleSwipe: true,
  _init() {
    this.callBase.apply(this, arguments);
    this._$buttonsContainer = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_BUTTONS_CONTAINER_CLASS);
    _events_engine.default.on(this._$buttonsContainer, ACTIVE_EVENT_NAME, _common.noop);
    this._$buttons = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_BUTTONS_CLASS).appendTo(this._$buttonsContainer);
    this._renderMenu();
    this._renderDeleteButton();
  },
  _renderMenu() {
    if (!this._menuEnabled()) {
      return;
    }
    const menuItems = this._menuItems();
    if (menuItems.length === 1) {
      const menuItem = menuItems[0];
      this._renderMenuButton(menuItem.text, e => {
        e.stopPropagation();
        this._fireAction(menuItem);
      });
    } else {
      const $menu = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_CLASS);
      this._menu = this._list._createComponent($menu, _action_sheet.default, {
        showTitle: false,
        items: menuItems,
        onItemClick: function (args) {
          this._fireAction(args.itemData);
        }.bind(this),
        integrationOptions: {}
      });
      $menu.appendTo(this._list.$element());
      const $menuButton = this._renderMenuButton(_message.default.format('dxListEditDecorator-more'), e => {
        e.stopPropagation();
        this._menu.show();
      });
      this._menu.option('target', $menuButton);
    }
  },
  _renderMenuButton(text, action) {
    const $menuButton = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_BUTTON_CLASS).addClass(SLIDE_MENU_BUTTON_MENU_CLASS).text(text);
    this._$buttons.append($menuButton);
    _events_engine.default.on($menuButton, CLICK_EVENT_NAME, action);
    return $menuButton;
  },
  _renderDeleteButton() {
    if (!this._deleteEnabled()) {
      return;
    }
    const $deleteButton = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_BUTTON_CLASS).addClass(SLIDE_MENU_BUTTON_DELETE_CLASS)
    // @ts-expect-error
    .text((0, _themes.isMaterialBased)() ? '' : _message.default.format('dxListEditDecorator-delete'));
    _events_engine.default.on($deleteButton, CLICK_EVENT_NAME, e => {
      e.stopPropagation();
      this._deleteItem();
    });
    this._$buttons.append($deleteButton);
  },
  _fireAction(menuItem) {
    this._fireMenuAction((0, _renderer.default)(this._cachedNode), menuItem.action);
    this._cancelDeleteReadyItem();
  },
  modifyElement(config) {
    this.callBase.apply(this, arguments);
    const {
      $itemElement
    } = config;
    $itemElement.addClass(SLIDE_MENU_WRAPPER_CLASS);
    const $slideMenuContent = (0, _renderer.default)('<div>').addClass(SLIDE_MENU_CONTENT_CLASS);
    $itemElement.wrapInner($slideMenuContent);
  },
  _getDeleteButtonContainer() {
    return this._$buttonsContainer;
  },
  handleClick(_, e) {
    if ((0, _renderer.default)(e.target).closest(`.${SLIDE_MENU_CONTENT_CLASS}`).length) {
      return this.callBase.apply(this, arguments);
    }
    return false;
  },
  _swipeStartHandler($itemElement) {
    this._enablePositioning($itemElement);
    this._cacheItemData($itemElement);
    this._setPositions(this._getPositions(0));
  },
  _swipeUpdateHandler($itemElement, args) {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;
    const isItemReadyToDelete = this._isReadyToDelete($itemElement);
    const moveJustStarted = this._getCurrentPositions().content === this._getStartPositions().content;
    if (moveJustStarted && !isItemReadyToDelete && args.offset * signCorrection > 0) {
      args.cancel = true;
      return;
    }
    const offset = this._cachedItemWidth * args.offset;
    const startOffset = isItemReadyToDelete ? -this._cachedButtonWidth * signCorrection : 0;
    const correctedOffset = (offset + startOffset) * signCorrection;
    const percent = correctedOffset < 0 ? Math.abs((offset + startOffset) / this._cachedButtonWidth) : 0;
    this._setPositions(this._getPositions(percent));
    return true;
  },
  _getStartPositions() {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;
    return {
      content: 0,
      buttonsContainer: rtl ? -this._cachedButtonWidth : this._cachedItemWidth,
      buttons: -this._cachedButtonWidth * signCorrection
    };
  },
  _getPositions(percent) {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;
    const startPositions = this._getStartPositions();
    return {
      content: startPositions.content - percent * this._cachedButtonWidth * signCorrection,
      buttonsContainer: startPositions.buttonsContainer - Math.min(percent, 1) * this._cachedButtonWidth * signCorrection,
      buttons: startPositions.buttons + Math.min(percent, 1) * this._cachedButtonWidth * signCorrection
    };
  },
  _getCurrentPositions() {
    return {
      content: (0, _translator.locate)(this._$cachedContent).left,
      buttonsContainer: (0, _translator.locate)(this._$buttonsContainer).left,
      buttons: (0, _translator.locate)(this._$buttons).left
    };
  },
  _setPositions(positions) {
    (0, _translator.move)(this._$cachedContent, {
      left: positions.content
    });
    (0, _translator.move)(this._$buttonsContainer, {
      left: positions.buttonsContainer
    });
    (0, _translator.move)(this._$buttons, {
      left: positions.buttons
    });
  },
  _cacheItemData($itemElement) {
    if ($itemElement[0] === this._cachedNode) {
      return;
    }
    this._$cachedContent = $itemElement.find(`.${SLIDE_MENU_CONTENT_CLASS}`);
    this._cachedItemWidth = (0, _size.getOuterWidth)($itemElement);
    this._cachedButtonWidth = this._cachedButtonWidth || (0, _size.getOuterWidth)(this._$buttons);
    (0, _size.setWidth)(this._$buttonsContainer, this._cachedButtonWidth);
    if (this._$cachedContent.length) {
      // eslint-disable-next-line prefer-destructuring
      this._cachedNode = $itemElement[0];
    }
  },
  _minButtonContainerLeftOffset() {
    return this._cachedItemWidth - this._cachedButtonWidth;
  },
  _swipeEndHandler($itemElement, args) {
    this._cacheItemData($itemElement);
    const signCorrection = this._isRtlEnabled() ? 1 : -1;
    const offset = this._cachedItemWidth * args.offset;
    const endedAtReadyToDelete = !this._isReadyToDelete($itemElement) && offset * signCorrection > this._cachedButtonWidth * 0.2;
    const readyToDelete = args.targetOffset === signCorrection && endedAtReadyToDelete;
    this._toggleDeleteReady($itemElement, readyToDelete);
    return true;
  },
  _enablePositioning($itemElement) {
    _fx.default.stop(this._$cachedContent, true);
    this.callBase.apply(this, arguments);
    this._$buttonsContainer.appendTo($itemElement);
  },
  _disablePositioning() {
    this.callBase.apply(this, arguments);
    this._$buttonsContainer.detach();
  },
  _animatePrepareDeleteReady() {
    return this._animateToPositions(this._getPositions(1));
  },
  _animateForgetDeleteReady($itemElement) {
    this._cacheItemData($itemElement);
    return this._animateToPositions(this._getPositions(0));
  },
  _animateToPositions(positions) {
    const that = this;
    const currentPosition = this._getCurrentPositions();
    const durationTimePart = Math.min(Math.abs(currentPosition.content - positions.content) / this._cachedButtonWidth, 1);
    return _fx.default.animate(this._$cachedContent, {
      from: currentPosition,
      to: positions,
      easing: SLIDE_MENU_ANIMATION_EASING,
      duration: SLIDE_MENU_ANIMATION_DURATION * durationTimePart,
      // @ts-expect-error
      strategy: 'frame',
      draw(positions) {
        that._setPositions(positions);
      }
    });
  },
  dispose() {
    if (this._menu) {
      this._menu.$element().remove();
    }
    if (this._$buttonsContainer) {
      this._$buttonsContainer.remove();
    }
    this.callBase.apply(this, arguments);
  }
}).include(_m_listEdit.default));