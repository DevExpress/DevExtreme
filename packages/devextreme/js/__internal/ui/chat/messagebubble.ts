import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type {
  Attachment, AttachmentDownloadClickEvent, Message, MetaData,
} from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import Accordion from '@ts/ui/accordion';
import FileView from '@ts/ui/chat/file_view/file_view';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS = `${ICON_CLASS}-cursorprohibition`;
export const CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS = 'dx-has-image';
export const CHAT_MESSAGEBUBBLE_IMAGE_CLASS = 'dx-chat-messagebubble-image';
export const CHAT_MESSAGEBUBBLE_FUNCTIONCALL_CLASS = 'dx-chat-messagebubble-functioncall';

export const MESSAGE_DATA_KEY = 'dxMessageData';

export interface Properties extends WidgetOptions<MessageBubble> {
  type?: 'text' | 'image';
  text?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  src?: string;
  alt?: string;
  attachments?: Attachment[];
  metadata?: MetaData;
  onAttachmentDownloadClick?: (e: AttachmentDownloadClickEvent) => void;
  template?: ((message: Message, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _$content!: dxElementWrapper;

  _$attachments?: dxElementWrapper;

  _$functionCall?: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      isDeleted: false,
      isEdited: false,
      text: '',
      template: null,
    };
  }

  _initMarkup(): void {
    const $element = $(this.element());

    $element.addClass(CHAT_MESSAGEBUBBLE_CLASS);

    super._initMarkup();

    this._renderContentContainer();
    this._renderFunctionCallElement();
    this._renderAttachmentsElement();

    this._updateContent();
    this._renderFunctionCall();
    this._renderAttachments();
  }

  _renderContentContainer(): void {
    this._$content = $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS)
      .appendTo(this.$element());
  }

  _renderFunctionCallElement(): void {
    const { metadata, isDeleted } = this.option();

    this._$functionCall?.remove();
    this._$functionCall = undefined;

    if (metadata?.functionCall && !isDeleted) {
      this._$functionCall = $('<div>')
        .addClass(CHAT_MESSAGEBUBBLE_FUNCTIONCALL_CLASS)
        .appendTo(this.$element());
    }
  }

  _renderAttachmentsElement(): void {
    const { attachments, isDeleted } = this.option();

    this._$attachments?.remove();
    this._$attachments = undefined;

    if (attachments?.length && !isDeleted) {
      this._$attachments = $('<div>').appendTo(this.$element());
    }
  }

  _updateContent(): void {
    const {
      template,
      type,
      text,
      src,
      alt,
      isDeleted = false,
    } = this.option();

    this.$element()
      .removeClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS)
      .removeClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS);

    this._$content.empty();

    if (template) {
      template({
        type, text, src, alt,
      }, getPublicElement(this._$content));

      return;
    }

    if (isDeleted) {
      this.$element().addClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

      const icon = $('<div>')
        .addClass(ICON_CLASS)
        .addClass(CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS);

      const deletedMessage = $('<div>')
        .text(messageLocalization.format('dxChat-deletedMessageText'));

      this._$content
        .append(icon)
        .append(deletedMessage);

      return;
    }

    switch (type) {
      case 'image':
        this.$element().addClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS);
        $('<img>')
          .attr('src', src ?? '')
          .attr('alt', alt ?? messageLocalization.format('dxChat-defaultImageAlt'))
          .addClass(CHAT_MESSAGEBUBBLE_IMAGE_CLASS)
          .appendTo(this._$content);
        break;
      case 'text':
      default:
        this._$content.text(text ?? '');
    }
  }

  _renderFunctionCall(): void {
    const { metadata } = this.option();

    if (!this._$functionCall || !metadata?.functionCall) {
      return;
    }

    this._$functionCall.empty();

    const { functionCall } = metadata;

    const accordionItems = [{
      title: `${messageLocalization.format('dxChat-functionCallTitle')}`,
      template: (): dxElementWrapper => {
        const $content = $('<div>');

        const $functionName = $('<div>')
          .append($('<strong>').text(`${messageLocalization.format('dxChat-functionCallLabel')}: `))
          .append($('<span>').text(functionCall.name));

        const args = functionCall.arguments || [];
        const argumentsText = args.length > 0
          ? args.map((arg) => Object.entries(arg)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', '))
            .join(', ')
          : '';

        const $arguments = $('<div>')
          .append($('<strong>').text(`${messageLocalization.format('dxChat-argumentsLabel')}: `))
          .append($('<span>').text(argumentsText));

        const $result = $('<div>')
          .append($('<strong>').text(`${messageLocalization.format('dxChat-resultLabel')}: `))
          .append($('<span>').text(JSON.stringify(functionCall.result)));

        $content.append($functionName).append($arguments).append($result);

        return $content;
      },
    }];

    this._createComponent(this._$functionCall, Accordion, {
      dataSource: accordionItems,
      collapsible: true,
      multiple: false,
      selectedIndex: -1,
    });
  }

  _renderAttachments(): void {
    const {
      attachments,
      onAttachmentDownloadClick,
    } = this.option();

    if (!this._$attachments) {
      return;
    }

    this._$attachments.empty();

    if (attachments?.length) {
      this._createComponent(this._$attachments, FileView, {
        files: attachments,
        onDownload: onAttachmentDownloadClick,
      });
    }
  }

  _updateMessageData(property: string, value: string | boolean | undefined): void {
    const messageData = this.$element().data(MESSAGE_DATA_KEY) || {};

    messageData[property] = value;
    this.$element().data(MESSAGE_DATA_KEY, messageData);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'text':
      case 'src':
      case 'alt':
      case 'isDeleted':
        this._updateMessageData(name, value);
        this._updateContent();
        this._renderAttachmentsElement();
        this._renderAttachments();
        break;
      case 'type':
        this._updateContent();
        this._renderAttachmentsElement();
        this._renderAttachments();
        break;
      case 'template':
        this._updateContent();
        break;
      case 'isEdited':
        this._updateMessageData(name, value);
        break;
      case 'metadata':
        this._renderFunctionCallElement();
        this._renderFunctionCall();
        break;
      case 'onAttachmentDownloadClick':
      case 'attachments':
        this._renderAttachmentsElement();
        this._renderAttachments();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
