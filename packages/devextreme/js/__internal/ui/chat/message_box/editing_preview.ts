import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

export const CHAT_EDITING_PREVIEW_CLASS = 'dx-chat-editing-preview';
export const CHAT_EDITING_PREVIEW_HIDING_CLASS = 'dx-chat-editing-preview-hiding';
export const CHAT_EDITING_PREVIEW_CONTENT_CLASS = 'dx-chat-editing-preview-content';
export const CHAT_EDITING_PREVIEW_CAPTION_CLASS = 'dx-chat-editing-preview-caption';
export const CHAT_EDITING_PREVIEW_TEXT_CLASS = 'dx-chat-editing-preview-text';
export const CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS = 'dx-chat-editing-preview-cancel-button';

export interface Properties extends DOMComponentProperties<EditingPreview> {
  activeStateEnabled?: boolean;
  focusStateEnabled?: boolean;
  hoverStateEnabled?: boolean;
  text?: string;
  onCancel?: (e: ClickEvent) => void;
}

class EditingPreview extends DOMComponent<EditingPreview, Properties> {
  _$messageText!: dxElementWrapper;

  _closeButton!: Button;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
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
      return;
    }

    this._cleanContent();
  }

  _renderContent(): void {
    this._renderMessagePreview();
    this._updateText();
    this._renderCloseButton();
  }

  _renderMessagePreview(): void {
    const $message = $('<div>')
      .addClass(CHAT_EDITING_PREVIEW_CONTENT_CLASS)
      .appendTo(this.element());

    $('<div>')
      .addClass(CHAT_EDITING_PREVIEW_CAPTION_CLASS)
      .text(messageLocalization.format('dxChat-editingMessageCaption'))
      .appendTo($message);

    this._$messageText = $('<div>')
      .addClass(CHAT_EDITING_PREVIEW_TEXT_CLASS)
      .appendTo($message);
  }

  _updateText(): void {
    const { text = '' } = this.option();

    this._$messageText.text(text);
  }

  _renderCloseButton(): void {
    const {
      onCancel,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $button = $('<div>')
      .addClass(CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS)
      .appendTo(this.element());

    this._closeButton = this._createComponent<Button, ButtonProperties>($button, Button, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'remove',
      type: 'normal',
      stylingMode: 'text',
      elementAttr: { 'aria-label': messageLocalization.format('dxChat-cancelEditingButtonAriaLabel') },
      onClick: (e) => {
        onCancel?.(e);
      },
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

    this.$element().get(0).addEventListener('animationend', () => {
      this._cleanContent();
    }, { once: true });

    this.$element().addClass(CHAT_EDITING_PREVIEW_HIDING_CLASS);
  }

  _cleanContent(): void {
    super._dispose();
    this.$element().remove();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled': {
        this._closeButton.option(name, value);
        break;
      }
      case 'text':
        this._processTextUpdate(previousValue);
        break;
      case 'onCancel':
        this._closeButton.option('onClick', value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default EditingPreview;
