import eventsEngine from '@js/common/core/events/core/events_engine';
import pointer from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent, PointerInteractionEvent } from '@js/events/events.types';
import TextEditorButton from '@ts/ui/text_box/texteditor_button_collection/button';

import type NumberBoxBase from './number_box.base';
import type { SpinChangeEvent } from './number_box.spin';
import SpinButton from './number_box.spin';

const SPIN_CLASS = 'dx-numberbox-spin';
const SPIN_CONTAINER_CLASS = 'dx-numberbox-spin-container';
const SPIN_TOUCH_FRIENDLY_CLASS = 'dx-numberbox-spin-touch-friendly';

interface SpinButtonsOptions {
  visible: boolean;
  disabled: boolean | undefined;
}

export default class SpinButtons extends TextEditorButton<NumberBoxBase> {
  declare instance?: dxElementWrapper | null;

  _attachEvents(
    instance: dxElementWrapper,
    $spinContainer: dxElementWrapper,
  ): void {
    const { editor } = this;

    if (!editor) {
      return;
    }

    const eventName = addNamespace(pointer.down, editor.NAME ?? '');
    const $spinContainerChildren = $spinContainer.children();

    const pointerDownAction = editor._createAction(
      () => { this.editor?._spinButtonsPointerDownHandler(); },
    );

    eventsEngine.off($spinContainer, eventName);

    eventsEngine.on(
      $spinContainer,
      eventName,
      (e: DxEvent<PointerInteractionEvent>) => pointerDownAction({ event: e }),
    );

    SpinButton.getInstance<SpinButton>($spinContainerChildren.eq(0)).option(
      'onChange',
      (e: SpinChangeEvent) => { this.editor?._spinUpChangeHandler(e); },
    );

    SpinButton.getInstance<SpinButton>($spinContainerChildren.eq(1)).option(
      'onChange',
      (e: SpinChangeEvent) => { this.editor?._spinDownChangeHandler(e); },
    );
  }

  _create(): {
    $element: dxElementWrapper;
    instance: dxElementWrapper;
  } {
    const { editor } = this;

    const $spinContainer = $('<div>').addClass(SPIN_CONTAINER_CLASS);
    const $spinUp = $('<div>').appendTo($spinContainer);
    const $spinDown = $('<div>').appendTo($spinContainer);
    const options = this._getOptions();

    this._addToContainer($spinContainer);

    editor?._createComponent($spinUp, SpinButton, { direction: 'up', ...options });
    editor?._createComponent($spinDown, SpinButton, { direction: 'down', ...options });

    this._legacyRender(editor?.$element(), this._isTouchFriendly(), options.visible);

    return {
      instance: $spinContainer,
      $element: $spinContainer,
    };
  }

  _getOptions(): SpinButtonsOptions {
    const { editor } = this;

    const visible = this._isVisible();
    const { disabled } = editor?.option() ?? {};

    return {
      visible,
      disabled,
    };
  }

  _isVisible(): boolean {
    const { editor } = this;
    const { showSpinButtons } = editor?.option() ?? {};

    return super._isVisible() && !!showSpinButtons;
  }

  _isTouchFriendly(): boolean {
    const { editor } = this;
    const { showSpinButtons, useLargeSpinButtons } = editor?.option() ?? {};

    return !!showSpinButtons && !!useLargeSpinButtons;
  }

  // TODO: get rid of it
  _legacyRender(
    $editor?: dxElementWrapper,
    isTouchFriendly?: boolean,
    isVisible?: boolean,
  ): void {
    $editor?.toggleClass(SPIN_TOUCH_FRIENDLY_CLASS, isTouchFriendly);
    $editor?.toggleClass(SPIN_CLASS, isVisible);
  }

  update(): boolean {
    const shouldUpdate = super.update();
    const { editor, instance } = this;

    if (shouldUpdate && instance) {
      const $spinButtons = instance.children();
      const spinUp = SpinButton.getInstance<SpinButton>($spinButtons.eq(0));
      const spinDown = SpinButton.getInstance<SpinButton>($spinButtons.eq(1));
      const options = this._getOptions();

      spinUp.option(options);
      spinDown.option(options);

      this._legacyRender(editor?.$element(), this._isTouchFriendly(), options.visible);
    }

    return shouldUpdate;
  }
}
