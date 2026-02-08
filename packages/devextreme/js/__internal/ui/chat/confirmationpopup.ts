import eventsEngine from '@js/common/core/events/core/events_engine';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import messageLocalization from '@js/localization/message';
import Popup, { type Properties as PopupProperties, type ToolbarItem } from '@js/ui/popup';
import { BUTTON_CLASS } from '@ts/ui/button/button';

export const CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS = 'dx-chat-confirmation-popup-wrapper';

const POPUP_WIDTH = 240;

interface ConfirmationPopupActions {
  onApplyButtonClick?: () => void;
  onCancelButtonClick?: () => void;
}

type ConfirmationPopupProperties = PopupProperties & ConfirmationPopupActions;

class ConfirmationPopup {
  _$container: dxElementWrapper;

  _popup!: Popup;

  _popupConfig?: ConfirmationPopupProperties;

  _actions?: ConfirmationPopupActions;

  constructor(
    $container: dxElementWrapper,
    config?: ConfirmationPopupProperties,
  ) {
    this._$container = $container;

    const { onApplyButtonClick, onCancelButtonClick, ...popupConfig } = config ?? {};

    this._actions = {
      onApplyButtonClick,
      onCancelButtonClick,
    };

    this._popupConfig = popupConfig;

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
      .text(messageLocalization.format('dxChat-editingDeleteConfirmText'))
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
          .find(`.${BUTTON_CLASS}`)
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

  _getApplyButtonConfig(): ToolbarItem {
    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'before',
      options: {
        text: messageLocalization.format('Yes'),
        type: 'default',
        stylingMode: 'contained',
        onClick: (): void => {
          this._actions?.onApplyButtonClick?.();
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._popup.hide();
        },
      },
    };
  }

  _getCancelButtonConfig(): ToolbarItem {
    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'after',
      options: {
        text: messageLocalization.format('No'),
        type: 'normal',
        stylingMode: 'outlined',
        onClick: (): void => {
          this._actions?.onCancelButtonClick?.();
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._popup.hide();
        },
      },
    };
  }

  _getToolbarItems(): ToolbarItem[] {
    return [
      this._getApplyButtonConfig(),
      this._getCancelButtonConfig(),
    ];
  }

  show(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup.show();
  }

  dispose(): void {
    this._popup.dispose();
  }
}

export default ConfirmationPopup;
