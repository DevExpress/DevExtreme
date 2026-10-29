import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type {
  Attachment, AttachmentDownloadClickEvent, Message, ToolCall,
} from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import { ICON_CLASS } from '@ts/core/utils/icon';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import Accordion from '@ts/ui/accordion';
import FileView from '@ts/ui/chat/file_view/file_view';
import TextArea from '@ts/ui/text_area';

export const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
export const CHAT_MESSAGEBUBBLE_DELETED_CLASS = 'dx-chat-messagebubble-deleted';
export const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
export const CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS = 'dx-chat-messagebubble-toolcalls';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS = 'dx-chat-messagebubble-toolcall-error';
export const CHAT_MESSAGEBUBBLE_TOOLCALLS_TITLE_CLASS = 'dx-chat-messagebubble-toolcalls-title';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_ICON_CLASS = 'dx-chat-messagebubble-toolcall-icon';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_NAME_CLASS = 'dx-chat-messagebubble-toolcall-name';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS = 'dx-chat-messagebubble-toolcall-error-tag';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_CLASS = 'dx-chat-messagebubble-toolcall-field';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_LABEL_CLASS = 'dx-chat-messagebubble-toolcall-field-label';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_ARGUMENTS_CLASS = 'dx-chat-messagebubble-toolcall-arguments';
export const CHAT_MESSAGEBUBBLE_TOOLCALL_RESULT_CLASS = 'dx-chat-messagebubble-toolcall-result';
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
  toolCalls?: ToolCall[];
  showToolCalls?: boolean;
  expandAllToolCalls?: boolean;
  onAttachmentDownloadClick?: (e: AttachmentDownloadClickEvent) => void;
  template?: ((message: Message, container: Element) => void) | null;
}

class MessageBubble extends Widget<Properties> {
  _$content!: dxElementWrapper;

  _$toolCalls?: dxElementWrapper;

  _$attachments?: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      isDeleted: false,
      isEdited: false,
      text: '',
      template: null,
      showToolCalls: true,
    };
  }

  _initMarkup(): void {
    const $element = $(this.element());

    $element.addClass(CHAT_MESSAGEBUBBLE_CLASS);

    super._initMarkup();

    this._renderToolCallsElement();
    this._renderContentContainer();
    this._renderAttachmentsElement();

    this._renderToolCalls();
    this._updateContent();
    this._renderAttachments();
  }

  _renderToolCallsElement(): void {
    const { toolCalls, isDeleted, showToolCalls } = this.option();

    this._$toolCalls?.remove();
    this._$toolCalls = undefined;

    if (toolCalls?.length && !isDeleted && showToolCalls) {
      this._$toolCalls = $('<div>')
        .addClass(CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS)
        .prependTo(this.$element());
    }
  }

  _renderToolCalls(): void {
    const { toolCalls, expandAllToolCalls } = this.option();

    if (!this._$toolCalls || !toolCalls) {
      return;
    }

    if (toolCalls.length > 1) {
      this._renderToolCallsTitle(toolCalls, this._$toolCalls);
    }

    const items = toolCalls.map((call) => ({ title: call.name, call }));

    this._createComponent($('<div>').appendTo(this._$toolCalls), Accordion, {
      dataSource: items,
      collapsible: true,
      multiple: true,
      focusStateEnabled: false,
      selectedItems: items.filter(({ call }) => call.expanded ?? expandAllToolCalls),
      itemTitleTemplate: ({ call }: { call: ToolCall }, _: number, element: Element): void => {
        this._renderToolCallTitle(call, element);
      },
      itemTemplate: ({ call }: { call: ToolCall }, _: number, element: Element): void => {
        this._renderToolCallBody(call, element);
      },
    });
  }

  _renderToolCallsTitle(toolCalls: ToolCall[], $container: dxElementWrapper): void {
    const errorCount = toolCalls.filter(({ status }) => status === 'error').length;
    const $title = $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALLS_TITLE_CLASS)
      .appendTo($container);

    $('<span>')
      .text(messageLocalization.format('dxChat-toolCallsTitle', toolCalls.length))
      .appendTo($title);

    if (errorCount) {
      const errorKey = errorCount === 1
        ? 'dxChat-toolCallsErrorSingle'
        : 'dxChat-toolCallsErrorMultiple';

      this._renderToolCallErrorTag(messageLocalization.format(errorKey, errorCount), $title);
    }
  }

  _renderToolCallTitle(call: ToolCall, container: Element): void {
    const $container = $(container);

    $('<span>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALL_ICON_CLASS)
      .appendTo($container);

    $('<span>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALL_NAME_CLASS)
      .text(call.name)
      .appendTo($container);

    if (call.status === 'error') {
      this._renderToolCallErrorTag(messageLocalization.format('dxChat-toolCallError'), $container);
    }
  }

  _renderToolCallErrorTag(text: string, $container: dxElementWrapper): void {
    $('<span>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS)
      .text(text)
      .appendTo($container);
  }

  _renderToolCallBody(call: ToolCall, container: Element): void {
    const hasArguments = !!call.arguments && Object.keys(call.arguments).length > 0;
    const hasResult = call.result !== undefined;

    if (hasArguments) {
      this._renderToolCallField(
        container,
        CHAT_MESSAGEBUBBLE_TOOLCALL_ARGUMENTS_CLASS,
        messageLocalization.format('dxChat-toolCallArgumentsLabel'),
        this._stringifyToolCallValue(call.arguments),
      );
    }

    if (hasResult) {
      this._renderToolCallField(
        container,
        CHAT_MESSAGEBUBBLE_TOOLCALL_RESULT_CLASS,
        messageLocalization.format('dxChat-toolCallResultLabel'),
        this._stringifyToolCallValue(call.result),
        call.status === 'error',
      );
    }
  }

  _renderToolCallField(
    container: Element,
    fieldClass: string,
    labelText: string,
    value: string,
    isError = false,
  ): void {
    const labelId = `dx-${new Guid()}`;
    const $field = $('<div>')
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_CLASS)
      .addClass(fieldClass)
      .appendTo(container);

    $('<div>')
      .attr('id', labelId)
      .addClass(CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_LABEL_CLASS)
      .text(labelText)
      .appendTo($field);

    this._createComponent($('<div>').appendTo($field), TextArea, {
      value,
      readOnly: true,
      autoResizeEnabled: true,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      inputAttr: { 'aria-labelledby': labelId },
      elementAttr: isError ? { class: CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS } : {},
    });
  }

  _stringifyToolCallValue(value: unknown): string {
    return typeof value === 'string'
      ? value
      : JSON.stringify(value, null, 2);
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
          this._renderToolCallsElement();
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
      case 'showToolCalls':
      case 'expandAllToolCalls':
        this._renderToolCallsElement();
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
