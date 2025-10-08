import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Message } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_ATTACHMENTS_CLASS = 'dx-chat-messagebubble-attachments';
export const CHAT_MESSAGEBUBBLE_ATTACHMENT_CLASS = 'dx-chat-messagebubble-attachment';
export const CHAT_MESSAGEBUBBLE_ATTACHMENT_ICON_CLASS = 'dx-chat-messagebubble-attachment-icon';
export const CHAT_MESSAGEBUBBLE_ATTACHMENT_NAME_CLASS = 'dx-chat-messagebubble-attachment-name';
export const CHAT_MESSAGEBUBBLE_ATTACHMENT_SIZE_CLASS = 'dx-chat-messagebubble-attachment-size';
export const CHAT_MESSAGEBUBBLE_ATTACHMENT_DOWNLOAD_CLASS = 'dx-chat-messagebubble-attachment-download';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
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
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    downloadUrl: string;
  }[];
  template?: ((message: Message, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _downloadButton?: Button;

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

    $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS)
      .appendTo($element);

    super._initMarkup();

    this._updateContent();
  }

  _updateContent(): void {
    const {
      template,
      type,
      text,
      src,
      alt,
      isDeleted = false,
      attachments = [],
    } = this.option();

    this.$element().removeClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

    const $bubbleContainer = $(this.element()).find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
    $bubbleContainer.empty();

    if (template) {
      template({
        type, text, src, alt, attachments,
      }, getPublicElement($bubbleContainer));

      return;
    }

    if (isDeleted) {
      this.$element().addClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS);

      const $icon = $('<div>')
        .addClass(ICON_CLASS)
        .addClass(CHAT_MESSAGEBUBBLE_ICON_PROHIBITION_CLASS);

      const $deletedMessage = $('<div>')
        .text(messageLocalization.format('dxChat-deletedMessageText'));

      $bubbleContainer
        .append($icon)
        .append($deletedMessage);

      return;
    }

    switch (type) {
      case 'image':
        this.$element().addClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS);
        $('<img>')
          .attr('src', src ?? '')
          .attr('alt', alt ?? messageLocalization.format('dxChat-defaultImageAlt'))
          .addClass(CHAT_MESSAGEBUBBLE_IMAGE_CLASS)
          .appendTo($bubbleContainer);
        break;
      case 'text':
      default:
        $bubbleContainer.text(text ?? '');
        if (attachments.length) {
          const $attachmentsContainer = $('<div>')
            .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENTS_CLASS);

          attachments.forEach((attachment) => {
            const $attachment = $('<div>')
              .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENT_CLASS)
              .appendTo($attachmentsContainer);

            $('<div>')
              .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENT_ICON_CLASS)
              .addClass(ICON_CLASS)
              .addClass(`${ICON_CLASS}-${this._getIconName(attachment.fileName)}`)
              .appendTo($attachment);

            $('<div>')
              .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENT_NAME_CLASS)
              .text(attachment.fileName)
              .attr('title', attachment.fileName)
              .appendTo($attachment);

            if (attachment.fileSize) {
              $('<div>')
                .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENT_SIZE_CLASS)
                .text(`${attachment.fileSize} B`)
                .appendTo($attachment);
            }

            const $downloadButton = $('<div>')
              .addClass(CHAT_MESSAGEBUBBLE_ATTACHMENT_DOWNLOAD_CLASS)
              .appendTo($attachment);

            this._downloadButton = this._createComponent<Button, ButtonProperties>(
              $downloadButton,
              Button,
              {
                icon: 'download',
                type: 'default',
                stylingMode: 'text',
                onClick: () => {
                  const { downloadUrl, fileName } = attachment;
                  fetch(downloadUrl)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = fileName;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    })
                    .catch(() => {

                    });
                },
              },
            );
          });

          $bubbleContainer
            .append($attachmentsContainer);
        }
    }
  }

  // move stuff like this to utils to reuse in messageBox too
  _getIconName(filename: string): string {
    const extension = filename.split('.').pop();

    switch (extension) {
      case 'pdf':
        return 'pdffile';
      case 'doc':
      case 'docx':
        return 'docfile';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return 'imagethumbnail';
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'm4a':
      case 'm4a1-s':
      case 'flac':
        return 'music';
      default:
        return 'file';
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
        break;
      case 'template':
        this._updateContent();
        break;
      case 'isEdited':
        this._updateMessageData(name, value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
