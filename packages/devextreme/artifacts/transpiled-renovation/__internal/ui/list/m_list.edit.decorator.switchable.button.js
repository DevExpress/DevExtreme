"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _size = require("../../../core/utils/size");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _button = _interopRequireDefault(require("../../../ui/button"));
var _themes = require("../../../ui/themes");
var _m_listEditDecorator = _interopRequireDefault(require("./m_list.edit.decorator.switchable"));
var _m_listEdit = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';
const SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = 'dx-list-switchable-delete-button-wrapper';
const SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = 'dx-list-switchable-delete-button-inner-wrapper';
const SWITCHABLE_DELETE_BUTTON_CLASS = 'dx-list-switchable-delete-button';
const SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION = 200;
const SwitchableButtonEditDecorator = _m_listEditDecorator.default.inherit({
  _init() {
    this.callBase.apply(this, arguments);
    const $buttonContainer = (0, _renderer.default)('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS);
    const $buttonWrapper = (0, _renderer.default)('<div>').addClass(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS);
    const $buttonInnerWrapper = (0, _renderer.default)('<div>').addClass(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS);
    const $button = (0, _renderer.default)('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CLASS);
    this._list._createComponent($button, _button.default, {
      text: _message.default.format('dxListEditDecorator-delete'),
      type: 'danger',
      // @ts-expect-error
      stylingMode: (0, _themes.isMaterialBased)() ? 'text' : 'contained',
      onClick: function (e) {
        this._deleteItem();
        e.event.stopPropagation();
      }.bind(this),
      integrationOptions: {},
      elementAttr: {
        role: null,
        'aria-label': null
      },
      tabIndex: -1
    });
    $buttonContainer.append($buttonWrapper);
    $buttonWrapper.append($buttonInnerWrapper);
    $buttonInnerWrapper.append($button);
    this._$buttonContainer = $buttonContainer;
  },
  _enablePositioning($itemElement) {
    this.callBase.apply(this, arguments);
    _fx.default.stop(this._$buttonContainer, true);
    this._$buttonContainer.appendTo($itemElement);
  },
  _disablePositioning() {
    this.callBase.apply(this, arguments);
    this._$buttonContainer.detach();
  },
  _animatePrepareDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = (0, _size.getWidth)(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth : -buttonWidth;
    const toValue = rtl ? listWidth - buttonWidth : 0;
    return _fx.default.animate(this._$buttonContainer, {
      // @ts-expect-error
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      // @ts-expect-error
      from: {
        right: fromValue
      },
      // @ts-expect-error
      to: {
        right: toValue
      }
    });
  },
  _animateForgetDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = (0, _size.getWidth)(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth - buttonWidth : 0;
    const toValue = rtl ? listWidth : -buttonWidth;
    return _fx.default.animate(this._$buttonContainer, {
      // @ts-expect-error
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      // @ts-expect-error
      from: {
        right: fromValue
      },
      // @ts-expect-error
      to: {
        right: toValue
      }
    });
  },
  _buttonWidth() {
    if (!this._buttonContainerWidth) {
      this._buttonContainerWidth = (0, _size.getOuterWidth)(this._$buttonContainer);
    }
    return this._buttonContainerWidth;
  },
  dispose() {
    if (this._$buttonContainer) {
      this._$buttonContainer.remove();
    }
    this.callBase.apply(this, arguments);
  }
});
const TOGGLE_DELETE_SWITCH_CONTAINER_CLASS = 'dx-list-toggle-delete-switch-container';
const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';
(0, _m_listEdit.register)('delete', 'toggle', SwitchableButtonEditDecorator.inherit({
  beforeBag(config) {
    const {
      $itemElement
    } = config;
    const {
      $container
    } = config;
    const $toggle = (0, _renderer.default)('<div>').addClass(TOGGLE_DELETE_SWITCH_CLASS);
    this._list._createComponent($toggle, _button.default, {
      icon: 'toggle-delete',
      onClick: function (e) {
        _fx.default.stop(this._$buttonContainer, false);
        this._toggleDeleteReady($itemElement);
        e.event.stopPropagation();
      }.bind(this),
      integrationOptions: {},
      elementAttr: {
        role: null,
        'aria-label': null
      },
      tabIndex: -1
    });
    $container.addClass(TOGGLE_DELETE_SWITCH_CONTAINER_CLASS);
    $container.append($toggle);
  }
}));
(0, _m_listEdit.register)('delete', 'slideButton', SwitchableButtonEditDecorator.inherit({
  _shouldHandleSwipe: true,
  _swipeEndHandler($itemElement, args) {
    if (args.targetOffset !== 0) {
      _fx.default.stop(this._$buttonContainer, false);
      this._toggleDeleteReady($itemElement);
    }
    return true;
  }
}));
var _default = exports.default = SwitchableButtonEditDecorator;