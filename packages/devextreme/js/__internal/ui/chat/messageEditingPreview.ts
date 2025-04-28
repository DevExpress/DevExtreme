import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Properties as DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

export const CHAT_EDITING_PREVIEW_CLASS = 'dx-chat-editing-preview';
export const CHAT_EDITING_QUOTE_LINE_CLASS = 'dx-chat-editing-quote-line';
export const CHAT_EDITING_MESSAGE_CLASS = 'dx-chat-editing-message';
export const CHAT_EDITING_MESSAGE_CAPTION_CLASS = 'dx-chat-editing-message-caption';
export const CHAT_EDITING_MESSAGE_TEXT_CLASS = 'dx-chat-editing-message-text';
export const CHAT_CANCEL_EDITING_BUTTON_CLASS = 'dx-chat-cancel-editing-button';

export interface Properties extends DOMComponentProperties<MessageEditingPreview> {
  text?: string;
  onCancel?: (e: ClickEvent) => void;
}

class MessageEditingPreview extends DOMComponent<MessageEditingPreview, Properties> {
  _messageText!: dxElementWrapper;

  _closeButton!: Button;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      onCancel: undefined,
    };
  }

  _init(): void {
    super._init();

    $(this.element()).addClass(CHAT_EDITING_PREVIEW_CLASS);
  }

  _initMarkup(): void {
    super._initMarkup();

    const { text } = this.option();

    if (text) {
      this._renderContent();
    }
  }

  _renderContent(): void {
    this._renderMessagePreview();
    this._updateText();
    this._renderCloseButton();
  }

  _renderMessagePreview(): void {
    $('<div>')
      .addClass(CHAT_EDITING_QUOTE_LINE_CLASS)
      .appendTo(this.element());

    const $message = $('<div>')
      .addClass(CHAT_EDITING_MESSAGE_CLASS)
      .appendTo(this.element());

    $('<div>')
      .addClass(CHAT_EDITING_MESSAGE_CAPTION_CLASS)
      .text(messageLocalization.format('dxChat-editingMessageCaption'))
      .appendTo($message);

    this._messageText = $('<div>')
      .addClass(CHAT_EDITING_MESSAGE_TEXT_CLASS)
      .appendTo($message);
  }

  _updateText(): void {
    const { text = '' } = this.option();

    this._messageText.text(text);
  }

  _renderCloseButton(): void {
    const { onCancel } = this.option();

    const $button = $('<div>')
      .addClass(CHAT_CANCEL_EDITING_BUTTON_CLASS)
      .appendTo(this.element());

    this._closeButton = this._createComponent($button, Button, {
      icon: 'remove',
      type: 'normal',
      stylingMode: 'text',
      elementAttr: { 'aria-label': messageLocalization.format('dxChat-cancelEditingButtonAriaLabel') },
      onClick: onCancel,
    });
  }

  _processTextUpdate(previousValue?: string): void {
    const { text = '' } = this.option();

    if (previousValue && text) {
      this._updateText();

      return;
    }

    if (text) {
      this._renderContent();

      return;
    }

    this._cleanContent();
  }

  _cleanContent(): void {
    this.$element().empty();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, previousValue } = args;

    switch (name) {
      case 'text':
        this._processTextUpdate(previousValue);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageEditingPreview;
