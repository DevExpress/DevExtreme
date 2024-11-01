import { fx } from '@js/common/core/animation';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { getOuterWidth, getWidth } from '@js/core/utils/size';
import Button from '@js/ui/button';
import { isMaterialBased } from '@js/ui/themes';

import SwitchableEditDecorator from './m_list.edit.decorator.switchable';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

const SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';
const SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = 'dx-list-switchable-delete-button-wrapper';
const SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = 'dx-list-switchable-delete-button-inner-wrapper';
const SWITCHABLE_DELETE_BUTTON_CLASS = 'dx-list-switchable-delete-button';

const SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION = 200;

const SwitchableButtonEditDecorator = SwitchableEditDecorator.inherit({

  _init() {
    this.callBase.apply(this, arguments);

    const $buttonContainer = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS);
    const $buttonWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS);
    const $buttonInnerWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS);
    const $button = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CLASS);

    this._list._createComponent($button, Button, {
      text: messageLocalization.format('dxListEditDecorator-delete'),
      type: 'danger',
      // @ts-expect-error
      stylingMode: isMaterialBased() ? 'text' : 'contained',
      onClick: function (e) {
        this._deleteItem();
        e.event.stopPropagation();
      }.bind(this),
      integrationOptions: {},
      elementAttr: {
        role: null,
        'aria-label': null,
      },
      tabIndex: -1,
    });

    $buttonContainer.append($buttonWrapper);
    $buttonWrapper.append($buttonInnerWrapper);
    $buttonInnerWrapper.append($button);

    this._$buttonContainer = $buttonContainer;
  },

  _enablePositioning($itemElement) {
    this.callBase.apply(this, arguments);

    fx.stop(this._$buttonContainer, true);
    this._$buttonContainer.appendTo($itemElement);
  },

  _disablePositioning() {
    this.callBase.apply(this, arguments);

    this._$buttonContainer.detach();
  },

  _animatePrepareDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = getWidth(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth : -buttonWidth;
    const toValue = rtl ? listWidth - buttonWidth : 0;

    return fx.animate(this._$buttonContainer, {
      // @ts-expect-error
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      // @ts-expect-error
      from: { right: fromValue },
      // @ts-expect-error
      to: { right: toValue },
    });
  },

  _animateForgetDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = getWidth(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth - buttonWidth : 0;
    const toValue = rtl ? listWidth : -buttonWidth;

    return fx.animate(this._$buttonContainer, {
      // @ts-expect-error
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      // @ts-expect-error
      from: { right: fromValue },
      // @ts-expect-error
      to: { right: toValue },
    });
  },

  _buttonWidth() {
    if (!this._buttonContainerWidth) {
      this._buttonContainerWidth = getOuterWidth(this._$buttonContainer);
    }
    return this._buttonContainerWidth;
  },

  dispose() {
    if (this._$buttonContainer) {
      this._$buttonContainer.remove();
    }

    this.callBase.apply(this, arguments);
  },

});

const TOGGLE_DELETE_SWITCH_CONTAINER_CLASS = 'dx-list-toggle-delete-switch-container';
const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';

registerDecorator(
  'delete',
  'toggle',
  SwitchableButtonEditDecorator.inherit({

    beforeBag(config) {
      const { $itemElement } = config;
      const { $container } = config;

      const $toggle = $('<div>').addClass(TOGGLE_DELETE_SWITCH_CLASS);
      this._list._createComponent($toggle, Button, {
        icon: 'toggle-delete',
        onClick: function (e) {
          fx.stop(this._$buttonContainer, false);
          this._toggleDeleteReady($itemElement);
          e.event.stopPropagation();
        }.bind(this),
        integrationOptions: {},
        elementAttr: {
          role: null,
          'aria-label': null,
        },
        tabIndex: -1,
      });

      $container.addClass(TOGGLE_DELETE_SWITCH_CONTAINER_CLASS);
      $container.append($toggle);
    },

  }),
);

registerDecorator(
  'delete',
  'slideButton',
  SwitchableButtonEditDecorator.inherit({

    _shouldHandleSwipe: true,

    _swipeEndHandler($itemElement, args) {
      if (args.targetOffset !== 0) {
        fx.stop(this._$buttonContainer, false);
        this._toggleDeleteReady($itemElement);
      }

      return true;
    },

  }),
);

export default SwitchableButtonEditDecorator;
