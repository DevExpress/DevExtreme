import eventsEngine from '@js/common/core/events/core/events_engine';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import messageLocalization from '@js/localization/message';
import Popup, { type Properties as PopupProperties, type ToolbarItem } from '@js/ui/popup';

export const CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS = 'dx-chat-confirmation-popup-wrapper';

const DX_BUTTON_CLASSNAME = 'dx-button';

const POPUP_WIDTH = 240;

const enum ConfirmationPopupButtonType {
  APPLY = 'apply',
  CANCEL = 'cancel',
}

interface ConfirmationPopupProperties {
  onApplyButtonClick?: () => void;
  onCancelButtonClick?: () => void;
}

class ConfirmationPopup {
  _$container: dxElementWrapper;

  _popupConfig?: PopupProperties;

  _onApplyButtonClick?: () => void;

  _onCancelButtonClick?: () => void;

  _popup!: Popup;

  _contentMessage!: string;

  _applyButtonText!: string;

  _cancelButtonText!: string;

  constructor(
    $container: dxElementWrapper,
    confirmationPopupConfig: ConfirmationPopupProperties,
    popupConfig?: PopupProperties,
  ) {
    this._$container = $container;
    this._popupConfig = popupConfig;

    this._onApplyButtonClick = confirmationPopupConfig.onApplyButtonClick;
    this._onCancelButtonClick = confirmationPopupConfig.onCancelButtonClick;

    this._contentMessage = messageLocalization.format('dxChat-editingDeleteConfirmText');
    this._applyButtonText = messageLocalization.format('Yes');
    this._cancelButtonText = messageLocalization.format('No');

    this._renderPopup();
  }

  _renderPopup(): void {
    const $popupContainer = $('<div>')
      .appendTo(this._$container);

    this._popup = new Popup($popupContainer.get(0), this._getPopupConfig());
  }

  _getPopupConfig(): PopupProperties {
    const messageId = new Guid().toString();
    const $message = $('<div>')
      .html(this._contentMessage)
      .attr('id', messageId);

    return extend({
      width: POPUP_WIDTH,
      height: 'auto',
      showTitle: false,
      showCloseButton: false,
      shading: true,
      dragEnabled: false,
      hideOnOutsideClick: true,
      toolbarItems: this._getToolbarItems(),
      onContentReady(args) {
        args.component.$content()
          .append($message);

        args.component.$overlayContent().attr('aria-labelledby', messageId);
      },
      onShown: (e) => {
        const $firstButton = e.component
          .bottomToolbar()
          .find(`.${DX_BUTTON_CLASSNAME}`)
          .first();
        // @ts-expect-error
        eventsEngine.trigger($firstButton, 'focus');
      },
      wrapperAttr: { class: CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS },
      focusStateEnabled: true,
      position: {
        my: 'center',
        at: 'center',
        of: this._$container,
      },
      ...this._popupConfig,
    }) as PopupProperties;
  }

  _getPopupButtonConfig(buttonType: ConfirmationPopupButtonType): ToolbarItem {
    const isConfirmButton = buttonType === ConfirmationPopupButtonType.APPLY;

    const text = isConfirmButton
      ? this._applyButtonText
      : this._cancelButtonText;

    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: isConfirmButton ? 'before' : 'after',
      options: {
        text,
        type: isConfirmButton ? 'default' : 'normal',
        stylingMode: isConfirmButton ? 'contained' : 'outlined',
        onClick: (): void => {
          if (isConfirmButton) {
            this._onApplyButtonClick?.();
          } else {
            this._onCancelButtonClick?.();
          }
          this._popup.hide();
        },
      },
    };
  }

  _getToolbarItems(): ToolbarItem[] {
    return [
      this._getPopupButtonConfig(ConfirmationPopupButtonType.APPLY),
      this._getPopupButtonConfig(ConfirmationPopupButtonType.CANCEL),
    ];
  }

  show(): void {
    this._popup.show();
  }
}

export default ConfirmationPopup;
