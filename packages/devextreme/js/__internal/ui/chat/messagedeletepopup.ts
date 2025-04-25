import eventsEngine from '@js/common/core/events/core/events_engine';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { Message } from '@js/ui/chat';
import Popup, { type Properties as PopupProperties, type ToolbarItem } from '@js/ui/popup';

export const CHAT_DELETE_CONFIRMATION_POPUP_CLASS_BASE = 'dx-chat-deleteconfirmation-popup';
export const CHAT_DELETE_CONFIRMATION_POPUP_WRAPPER_CLASS = `${CHAT_DELETE_CONFIRMATION_POPUP_CLASS_BASE}-wrapper`;
export const CHAT_DELETE_CONFIRMATION_POPUP_CONTENT_CLASS = `${CHAT_DELETE_CONFIRMATION_POPUP_CLASS_BASE}-content`;

const DX_BUTTON_CLASSNAME = 'dx-button';

const POPUP_WIDTH = 240;

const enum DeleteConfirmationPopupButtonType {
  APPLY = 'apply',
  CANCEL = 'cancel',
}

interface MessageDeletePopupProperties {
  message: string;
  applyButtonLabel: string;
  cancelButtonLabel: string;
  onApplyButtonClick?: (message: Message) => void;
  onCancelButtonClick?: () => void;
}

class MessageDeletePopup {
  _$container: dxElementWrapper;

  _popupConfig?: PopupProperties;

  _deletePopupConfig!: MessageDeletePopupProperties;

  _popup!: Popup;

  _message!: Message;

  constructor(
    $container: dxElementWrapper,
    deletePopupConfig: MessageDeletePopupProperties,
    popupConfig?: PopupProperties,
  ) {
    this._$container = $container;
    this._deletePopupConfig = deletePopupConfig;
    this._popupConfig = popupConfig;

    this._renderPopup();
  }

  _renderPopup(): void {
    const $popupContainer = $('<div>')
      .addClass(CHAT_DELETE_CONFIRMATION_POPUP_CLASS_BASE)
      .appendTo(this._$container);

    this._popup = new Popup($popupContainer.get(0), this._getPopupConfig());
  }

  _getPopupConfig(): PopupProperties {
    return extend({
      width: POPUP_WIDTH,
      height: 'auto',
      showTitle: false,
      showCloseButton: false,
      shading: true,
      shadingColor: 'rgba(0,0,0,.32)',
      dragEnabled: false,
      hideOnOutsideClick: true,
      toolbarItems: this._getToolbarItems(),
      contentTemplate: (container): void => this._getPopupContent($(container)),
      onShown: (e) => {
        const $firstButton = e.component
          .bottomToolbar()
          .find(`.${DX_BUTTON_CLASSNAME}`)
          .first();
        // @ts-expect-error
        eventsEngine.trigger($firstButton, 'focus');
      },
      _wrapperClassExternal: CHAT_DELETE_CONFIRMATION_POPUP_WRAPPER_CLASS,
      focusStateEnabled: true,
      position: {
        my: 'center',
        at: 'center',
        of: this._$container,
      },
      ...this._popupConfig,
    }) as PopupProperties;
  }

  _getPopupButtonCssClass(buttonType: DeleteConfirmationPopupButtonType): string {
    return `${CHAT_DELETE_CONFIRMATION_POPUP_CLASS_BASE}-${buttonType}-button`;
  }

  _getPopupButtonConfig(buttonType: DeleteConfirmationPopupButtonType): ToolbarItem {
    const isConfirmButton = buttonType === DeleteConfirmationPopupButtonType.APPLY;

    const text = isConfirmButton
      ? this._deletePopupConfig.applyButtonLabel
      : this._deletePopupConfig.cancelButtonLabel;

    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: isConfirmButton ? 'before' : 'after',
      cssClass: this._getPopupButtonCssClass(buttonType),
      options: {
        text,
        type: isConfirmButton ? 'default' : 'normal',
        stylingMode: isConfirmButton ? 'contained' : 'outlined',
        onClick: (): void => {
          if (isConfirmButton) {
            this._deletePopupConfig.onApplyButtonClick?.(this._message);
          } else {
            this._deletePopupConfig.onCancelButtonClick?.();
          }
          this._popup.hide()
            .then(() => {})
            .catch(() => {});
        },
      },
    };
  }

  _getToolbarItems(): ToolbarItem[] {
    return [
      this._getPopupButtonConfig(DeleteConfirmationPopupButtonType.APPLY),
      this._getPopupButtonConfig(DeleteConfirmationPopupButtonType.CANCEL),
    ];
  }

  _getPopupContent($container: dxElementWrapper): void {
    $('<div>')
      .addClass(CHAT_DELETE_CONFIRMATION_POPUP_CONTENT_CLASS)
      .text(this._deletePopupConfig.message)
      .appendTo($container);
  }

  show(message: Message): void {
    if (this._popup.option('visible')) {
      return;
    }

    this._message = message;

    this._popup.show()
      .then(() => {})
      .catch(() => {});
  }
}

export default MessageDeletePopup;
