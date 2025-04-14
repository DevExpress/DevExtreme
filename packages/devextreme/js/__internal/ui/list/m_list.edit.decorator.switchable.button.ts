/* eslint-disable max-classes-per-file */
import { fx } from '@js/common/core/animation';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
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
class SwitchableButtonEditDecorator extends SwitchableEditDecorator {
  _$buttonContainer!: dxElementWrapper;

  _buttonContainerWidth!: number;

  _init(): void {
    // @ts-expect-error ts-error
    super._init.apply(this, arguments);

    const $buttonContainer = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS);
    const $buttonWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS);
    const $buttonInnerWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS);
    const $button = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CLASS);

    this._list._createComponent($button, Button, {
      text: messageLocalization.format('dxListEditDecorator-delete'),
      type: 'danger',
      // @ts-expect-error ts-error
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
  }

  _enablePositioning($itemElement): void {
    // @ts-expect-error ts-error
    super._enablePositioning.apply(this, arguments);
    // @ts-expect-error ts-error
    fx.stop(this._$buttonContainer, true);
    this._$buttonContainer.appendTo($itemElement);
  }

  _disablePositioning(): void {
    // @ts-expect-error ts-error
    super._disablePositioning.apply(this, arguments);

    this._$buttonContainer.detach();
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  _animatePrepareDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = getWidth(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth : -buttonWidth;
    const toValue = rtl ? listWidth - buttonWidth : 0;
    // @ts-expect-error ts-error
    return fx.animate(this._$buttonContainer, {
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      from: { right: fromValue },
      to: { right: toValue },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  _animateForgetDeleteReady() {
    const rtl = this._isRtlEnabled();
    const listWidth = getWidth(this._list.$element());
    const buttonWidth = this._buttonWidth();
    const fromValue = rtl ? listWidth - buttonWidth : 0;
    const toValue = rtl ? listWidth : -buttonWidth;
    // @ts-expect-error ts-error
    return fx.animate(this._$buttonContainer, {
      type: 'custom',
      duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
      from: { right: fromValue },
      to: { right: toValue },
    });
  }

  _buttonWidth(): number {
    if (!this._buttonContainerWidth) {
      this._buttonContainerWidth = getOuterWidth(this._$buttonContainer);
    }
    return this._buttonContainerWidth;
  }

  dispose(): void {
    if (this._$buttonContainer) {
      this._$buttonContainer.remove();
    }
    // @ts-expect-error ts-error
    super.dispose.apply(this, arguments);
  }
}

const TOGGLE_DELETE_SWITCH_CONTAINER_CLASS = 'dx-list-toggle-delete-switch-container';
const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';

class SwitchableButtonToggleEditDecorator extends SwitchableButtonEditDecorator {
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
  }
}

registerDecorator(
  'delete',
  'toggle',
  SwitchableButtonToggleEditDecorator,
);

class SwitchableButtonSlideEditDecorator extends SwitchableButtonEditDecorator {
  // eslint-disable-next-line class-methods-use-this
  _shouldHandleSwipe(): boolean {
    return true;
  }

  _swipeEndHandler($itemElement, args) {
    if (args.targetOffset !== 0) {
      // @ts-expect-error ts-error
      fx.stop(this._$buttonContainer, false);
      this._toggleDeleteReady($itemElement);
    }

    return true;
  }
}

registerDecorator(
  'delete',
  'slideButton',
  SwitchableButtonSlideEditDecorator,
);

export default SwitchableButtonEditDecorator;
