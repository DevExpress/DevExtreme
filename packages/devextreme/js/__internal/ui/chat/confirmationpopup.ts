import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import messageLocalization from '@js/localization/message';
import { custom } from '@js/ui/dialog';

export const CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS = 'dx-chat-confirmation-popup-wrapper';

const POPUP_WIDTH = 240;

interface ConfirmationPopupActions {
  onApplyButtonClick?: () => void;
  onCancelButtonClick?: () => void;
}

type ConfirmationPopupProperties = ConfirmationPopupActions & {
  rtlEnabled?: boolean;
  onHidden?: () => void;
};

class ConfirmationPopup {
  _customDialogInstance: ReturnType<typeof custom> | null = null;

  _actions?: ConfirmationPopupActions;

  _popupConfig?: ConfirmationPopupProperties;

  _$container: dxElementWrapper;

  constructor(
    $container: dxElementWrapper,
    config?: ConfirmationPopupProperties,
  ) {
    const { onApplyButtonClick, onCancelButtonClick, ...popupConfig } = config ?? {};
    this._actions = { onApplyButtonClick, onCancelButtonClick };
    this._popupConfig = popupConfig;
    this._$container = $container;
    this._renderPopup();
  }

  _renderPopup(): void {
    const { rtlEnabled, onHidden } = this._popupConfig ?? {};
    const $popupContainer = $('<div>').appendTo(this._$container);

    this._customDialogInstance = custom({
      messageHtml: messageLocalization.format(
        'dxChat-editingDeleteConfirmText',
      ),
      popupOptions: {
        width: POPUP_WIDTH,
        showTitle: false,
        showCloseButton: false,
        rtlEnabled,
        height: 'auto',
        shading: true,
        dragEnabled: false,
        hideOnOutsideClick: true,
        container: $popupContainer,
        position: {
          my: 'center',
          at: 'center',
          of: this._$container,
        },
        wrapperAttr: { class: CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS },
        onHidden,
        focusStateEnabled: true,
      },
      buttons: [
        {
          text: messageLocalization.format('Yes'),
          type: 'default',
          stylingMode: 'contained',
          onClick: (): void => {
            this._actions?.onApplyButtonClick?.();
          },
        },
        {
          text: messageLocalization.format('No'),
          type: 'normal',
          stylingMode: 'outlined',
          onClick: (): void => {
            this._actions?.onCancelButtonClick?.();
          },
        },
      ],
    });
  }

  show(): void {
    this._customDialogInstance.show();
  }

  dispose(): void {
    this._customDialogInstance = null;
  }
}

export default ConfirmationPopup;
