import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Attachment, AttachmentDownloadClickEvent, Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import Accordion from '@ts/ui/accordion';
import FileView from '@ts/ui/chat/file_view/file_view';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS = 'dx-chat-messagebubble-toolcalls';
export const CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS = `${ICON_CLASS}-cursorprohibition`;
export const CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS = 'dx-has-image';
export const CHAT_MESSAGEBUBBLE_IMAGE_CLASS = 'dx-chat-messagebubble-image';

export const MESSAGE_DATA_KEY = 'dxMessageData';

export interface Properties extends WidgetOptions<MessageBubble> {
  type?: 'text' | 'image';
  text?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  src?: string;
  alt?: string;
  attachments?: Attachment[];
  onAttachmentDownloadClick?: (e: AttachmentDownloadClickEvent) => void;
  template?: ((message: Message, container: Element) => void) | null;
  // SPIKE: no public types yet
  toolCalls?: any[];
  isToolCallsEnabled?: boolean;
}

class MessageBubble extends Widget<Properties> {
  _$content!: dxElementWrapper;

  _$toolCalls!: dxElementWrapper;

  // SPIKE: a class field with an initializer runs after the base constructor that renders the markup
  _openedToolCalls?: Set<number>;

  _$attachments?: dxElementWrapper;

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

    this._renderToolCallsContainer();
    this._renderContentContainer();
    this._renderAttachmentsElement();

    this._renderToolCalls();
    this._updateContent();
    this._renderAttachments();
  }

  // SPIKE: the container is before the content and is not touched when the text changes
  _renderToolCallsContainer(): void {
    this._$toolCalls = $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS)
      .appendTo(this.$element());
  }

  _renderToolCalls(): void {
    const { toolCalls, isToolCallsEnabled, isDeleted } = this.option();

    this._$toolCalls.empty();

    if (!isToolCallsEnabled || isDeleted || !toolCalls?.length) {
      return;
    }

    const errorCount = toolCalls.filter(({ status }) => status === 'error').length;

    // SPIKE: the texts are not localized yet
    if (toolCalls.length > 1) {
      const $title = $('<div>').addClass('tool-calls-title').appendTo(this._$toolCalls);

      $('<span>').text(`${toolCalls.length} tools`).appendTo($title);

      if (errorCount) {
        $('<span>').addClass('tool-error-tag').text(`${errorCount} ${errorCount === 1 ? 'Error' : 'Errors'}`).appendTo($title);
      }
    }

    const items = toolCalls.map((call, index) => ({ call, index, title: call.name }));

    this._createComponent($('<div>').addClass('tool-calls').appendTo(this._$toolCalls), Accordion, {
      dataSource: items,
      collapsible: true,
      multiple: true,
      selectedItems: items.filter(({ call, index }) => call.expanded || this._openedToolCalls?.has(index)),
      onSelectionChanged: (e: any): void => {
        this._openedToolCalls = new Set(e.component.option('selectedItems').map(({ index }: any) => index));
      },
      itemTitleTemplate: ({ call }: any, _: unknown, itemElement: any): void => {
        $('<span>').addClass('tool-name').text(call.name).appendTo(itemElement);

        if (call.status === 'error') {
          $('<span>').addClass('tool-error-tag').text('Error').appendTo(itemElement);
        }
      },
      itemTemplate: ({ call }: any, _: unknown, itemElement: any): void => {
        const $body = $('<div>').addClass('tool-body').appendTo(itemElement);

        if (call.arguments && Object.keys(call.arguments).length) {
          $('<div>').addClass('tool-label').text('Arguments').appendTo($body);
          $('<pre>').addClass('tool-value').text(JSON.stringify(call.arguments, null, 4)).appendTo($body);
        }

        $('<div>').addClass('tool-label').text('Result').appendTo($body);
        $('<pre>')
          .addClass('tool-value')
          .toggleClass('tool-result-error', call.status === 'error')
          .text(String(call.result ?? ''))
          .appendTo($body);
      },
    } as any);
  }

  _renderContentContainer(): void {
    this._$content = $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS)
      .appendTo(this.$element());
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

        if (name === 'isDeleted') {
          this._renderToolCalls();
        }

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
      case 'toolCalls':
      case 'isToolCallsEnabled':
        this._renderToolCalls();
        break;
      case 'isEdited':
        this._updateMessageData(name, value);
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
