import { Guid } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSourceOptions } from '@js/common/data';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import DataHelperMixin from '@js/data_helper';
import type dxChat from '@js/ui/chat';
import type {
  AttachmentDownloadEvent,
  Message,
  MessageDeletedEvent,
  MessageDeletingEvent,
  MessageEditingStartEvent,
  MessageEnteredEvent,
  MessageUpdatedEvent,
  MessageUpdatingEvent,
  Properties,
  TypingEndEvent,
  TypingStartEvent,
} from '@js/ui/chat';
import { invokeConditionally } from '@ts/core/utils/conditional_invoke';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import AlertList from '@ts/ui/chat/alertlist';
import ConfirmationPopup from '@ts/ui/chat/confirmationpopup';
import type {
  MessageEnteredEvent as MessageBoxMessageEnteredEvent,
  Properties as MessageBoxProperties,
  TypingStartEvent as MessageBoxTypingStartEvent,
} from '@ts/ui/chat/message_box/message_box';
import MessageBox from '@ts/ui/chat/message_box/message_box';
import type {
  EmptyViewTemplate,
  MessageEditingEvent,
  MessageTemplate,
  Properties as MessageListProperties,
} from '@ts/ui/chat/messagelist';
import MessageList from '@ts/ui/chat/messagelist';
import type { DataChange } from '@ts/ui/collection/collection_widget.base';

const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

class Chat extends Widget<Properties> {
  _messageBox!: MessageBox;

  _messageList!: MessageList;

  _alertList!: AlertList;

  _messageToEdit?: Message;

  _deleteConfirmationPopup!: ConfirmationPopup;

  _messageToDelete?: Message;

  _messageEnteredAction?: (e: Partial<MessageEnteredEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: (e: Partial<TypingEndEvent>) => void;

  _messageEditingStartAction?: (e: Partial<MessageEditingStartEvent>) => void;

  _messageEditCanceledAction?: (e: Partial<MessageEnteredEvent>) => void;

  _messageDeletingAction?: (e: Partial<MessageDeletingEvent>) => void;

  _messageDeletedAction?: (e: Partial<MessageDeletedEvent>) => void;

  _messageUpdatingAction?: (e: Partial<MessageUpdatingEvent>) => void;

  _messageUpdatedAction?: (e: Partial<MessageUpdatedEvent>) => void;

  _attachmentDownloadAction?: (e: Partial<AttachmentDownloadEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      alerts: [],
      dataSource: null,
      dayHeaderFormat: 'shortdate',
      editing: {
        allowUpdating: false,
        allowDeleting: false,
      },
      emptyViewTemplate: null,
      fileUploaderOptions: undefined,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      items: [],
      messageTemplate: null,
      messageTimestampFormat: 'shorttime',
      reloadOnChange: true,
      showAvatar: true,
      showDayHeaders: true,
      showMessageTimestamp: true,
      showUserName: true,
      typingUsers: [],
      user: { id: new Guid().toString() },
      onMessageDeleted: undefined,
      onMessageDeleting: undefined,
      onMessageEditCanceled: undefined,
      onMessageEditingStart: undefined,
      onMessageEntered: undefined,
      onTypingEnd: undefined,
      onTypingStart: undefined,
      onAttachmentDownload: undefined,
    };
  }

  _init(): void {
    super._init();

    // @ts-expect-error
    this._initDataController();
    // @ts-expect-error
    this._refreshDataSource();

    this._createMessageEnteredAction();
    this._createMessageEditingStartAction();
    this._createMessageEditCanceledAction();
    this._createMessageDeletingAction();
    this._createMessageDeletedAction();
    this._createMessageUpdatingAction();
    this._createMessageUpdatedAction();
    this._createTypingStartAction();
    this._createTypingEndAction();
    this._createAttachmentDownloadAction();
  }

  _dataSourceLoadErrorHandler(): void {
    this.option('items', []);
  }

  _dataSourceChangedHandler(
    newItems: Message[],
    e?: { changes?: DataChange<Message>[] },
  ): void {
    if (e?.changes) {
      this._messageList._modifyByChanges(e.changes);

      this._setOptionWithoutOptionChange('items', newItems.slice());
      this._messageList._setOptionWithoutOptionChange('items', newItems.slice());

      this._messageList._toggleEmptyView();
    } else {
      this.option('items', newItems.slice());
    }
  }

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    this._messageList?.option('isLoading', isLoading);
  }

  _dataSourceOptions(): DataSourceOptions {
    return { paginate: false };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_CLASS);

    super._initMarkup();

    this._renderMessageList();
    this._renderAlertList();
    this._renderMessageBox();

    this._updateRootAria();
    this._updateMessageBoxAria();
  }

  _renderMessageList(): void {
    const $messageList = $('<div>');

    this.$element().append($messageList);

    this._messageList = this._createComponent(
      $messageList,
      MessageList,
      this._getMessageListOptions(),
    );
  }

  _getMessageListOptions(): MessageListProperties {
    const {
      items = [],
      user,
      showDayHeaders = false,
      showAvatar = false,
      showUserName = false,
      showMessageTimestamp = false,
      dayHeaderFormat,
      messageTimestampFormat,
      typingUsers = [],
    } = this.option();

    // @ts-expect-error
    const isLoading = this._dataController.isLoading();
    const currentUserId = user?.id;
    const onAttachmentDownload = this._getAttachmentDownloadHandler();

    const options: MessageListProperties = {
      items,
      currentUserId,
      allowUpdating: (message: Message): boolean => this._allowEditAction(message),
      allowDeleting: (message: Message): boolean => this._allowDeleteAction(message),
      isEditActionDisabled: (message) => this._messageToEdit === message,
      messageTemplate: this._getMessageTemplate(),
      emptyViewTemplate: this._getEmptyViewTemplate(),
      showDayHeaders,
      showAvatar,
      showUserName,
      showMessageTimestamp,
      dayHeaderFormat,
      messageTimestampFormat,
      typingUsers,
      isLoading,
      onMessageEditingStart: (e) => {
        this._messageEditingStartHandler(e);

        return () => this.focus();
      },
      onMessageDeleting: (e) => {
        this._messageDeletingHandler(e);
      },
      onEscapeKeyPressed: () => {
        this.focus();
      },
      onAttachmentDownload,
    };

    return options;
  }

  _getAttachmentDownloadHandler(): ((e: AttachmentDownloadEvent) => void) | undefined {
    const { onAttachmentDownload } = this.option();

    if (!onAttachmentDownload) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return (e: AttachmentDownloadEvent): void => { this._attachmentDownloadAction?.(e); };
  }

  protected _allowEditAction(message: Message): boolean {
    const { editing } = this.option();
    if (!editing) {
      return false;
    }

    const { allowUpdating } = editing;

    if (typeof allowUpdating === 'function') {
      return allowUpdating({
        component: this as unknown as dxChat,
        message,
      });
    }
    return allowUpdating ?? false;
  }

  protected _allowDeleteAction(message: Message): boolean {
    const { editing } = this.option();
    if (!editing) {
      return false;
    }

    const { allowDeleting } = editing;

    if (typeof allowDeleting === 'function') {
      return allowDeleting({
        component: this as unknown as dxChat,
        message,
      });
    }
    return allowDeleting ?? false;
  }

  _getRenderTemplateFunction(optionName: 'messageTemplate'): MessageTemplate;
  _getRenderTemplateFunction(optionName: 'emptyViewTemplate'): EmptyViewTemplate;
  _getRenderTemplateFunction(
    optionName: 'messageTemplate' | 'emptyViewTemplate',
  ): MessageTemplate | EmptyViewTemplate {
    const { [optionName]: templateOption } = this.option();

    if (templateOption) {
      return (data, $container): void => {
        const template = this._getTemplateByOption(optionName);
        const dataFieldName = optionName === 'messageTemplate' ? 'message' : 'texts';

        template.render({
          container: $container,
          model: {
            component: this,
            [dataFieldName]: data,
          },
        });
      };
    }

    return null;
  }

  _getMessageTemplate(): MessageTemplate {
    return this._getRenderTemplateFunction('messageTemplate');
  }

  _getEmptyViewTemplate(): EmptyViewTemplate {
    return this._getRenderTemplateFunction('emptyViewTemplate');
  }

  _messageEditingStartHandler(e: MessageEditingEvent): void {
    if (this._messageToEdit) {
      this._messageEditCanceledAction?.({ message: this._messageToEdit });
    }

    const messageEditingStartArgs = {
      message: e.message,
      cancel: false,
    };

    this._messageEditingStartAction?.(messageEditingStartArgs);

    invokeConditionally(
      messageEditingStartArgs.cancel,
      () => {
        this._messageBox.option('text', e.message.text);
        this._messageToEdit = e.message;
      },
    );
  }

  _messageEditCanceledHandler(): void {
    if (this._messageToEdit) {
      this._messageEditCanceledAction?.({ message: this._messageToEdit });
      this._messageToEdit = undefined;
    }
  }

  _showDeleteConfirmationPopup(e: Pick<MessageDeletingEvent, 'message'>): void {
    this._messageToDelete = e.message;

    if (!this._deleteConfirmationPopup) {
      this._deleteConfirmationPopup = new ConfirmationPopup(
        this.$element(),
        {
          onApplyButtonClick: (): void => {
            if (this._messageToEdit === this._messageToDelete) {
              this._messageBox.option('text', '');
              this._messageEditCanceledAction?.({ message: this._messageToEdit });
              this._messageToEdit = undefined;
            }

            this._messageDeletedAction?.({
              message: this._messageToDelete,
            });
          },
          rtlEnabled: this.option().rtlEnabled,
          onHidden: (): void => {
            this._messageToDelete = undefined;
            this._focusTarget()[0].focus();
          },
        },
      );
    }

    this._deleteConfirmationPopup.show();
  }

  _messageDeletingHandler(e: Pick<MessageDeletingEvent, 'message'>): void {
    const { message } = e;

    const messageDeletingArgs: Pick<MessageDeletingEvent, 'message' | 'cancel'> = {
      message,
      cancel: false,
    };

    this._messageDeletingAction?.(messageDeletingArgs);

    invokeConditionally(
      messageDeletingArgs.cancel,
      () => {
        this._showDeleteConfirmationPopup(messageDeletingArgs);
      },
    );
  }

  _messageUpdatingHandler(e: { text: string }): void {
    const { text } = e;

    const eventArgs: MessageUpdatingEvent = {
      // @ts-expect-error
      message: this._messageToEdit,
      text,
      cancel: false,
    };

    this._messageUpdatingAction?.(eventArgs);

    invokeConditionally(
      eventArgs.cancel,
      () => {
        this._messageBox.option('text', '');
        this._messageUpdatedAction?.(eventArgs);
        this._messageToEdit = undefined;
      },
    );
  }

  _renderAlertList(): void {
    const $errors = $('<div>');

    this.$element().append($errors);

    const { alerts = [] } = this.option();

    this._alertList = this._createComponent($errors, AlertList, {
      items: alerts,
    });
  }

  _renderMessageBox(): void {
    const {
      activeStateEnabled,
      fileUploaderOptions,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $messageBox = $('<div>');

    this.$element().append($messageBox);

    const configuration: MessageBoxProperties = {
      activeStateEnabled,
      fileUploaderOptions,
      focusStateEnabled,
      hoverStateEnabled,
      onMessageEntered: (e) => {
        this._messageEnteredHandler(e);
      },
      onTypingStart: (e) => {
        this._typingStartHandler(e);
      },
      onTypingEnd: () => {
        this._typingEndHandler();
      },
      onMessageEditCanceled: () => {
        this._messageEditCanceledHandler();
      },
      onMessageUpdating: (e) => {
        this._messageUpdatingHandler(e);
      },
    };

    this._messageBox = this._createComponent($messageBox, MessageBox, configuration);
  }

  _updateRootAria(): void {
    const aria = {
      role: 'group',
      label: messageLocalization.format('dxChat-elementAriaLabel'),
    };

    this.setAria(aria, this.$element());
  }

  _updateMessageBoxAria(): void {
    const emptyViewId = this._messageList.getEmptyViewId();

    this._messageBox.updateInputAria(emptyViewId);
  }

  _createMessageEnteredAction(): void {
    this._messageEnteredAction = this._createActionByOption(
      'onMessageEntered',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageEditingStartAction(): void {
    this._messageEditingStartAction = this._createActionByOption(
      'onMessageEditingStart',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageEditCanceledAction(): void {
    this._messageEditCanceledAction = this._createActionByOption(
      'onMessageEditCanceled',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageDeletingAction(): void {
    this._messageDeletingAction = this._createActionByOption(
      'onMessageDeleting',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageDeletedAction(): void {
    this._messageDeletedAction = this._createActionByOption(
      'onMessageDeleted',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageUpdatingAction(): void {
    this._messageUpdatingAction = this._createActionByOption(
      'onMessageUpdating',
      { excludeValidators: ['disabled'] },
    );
  }

  _createMessageUpdatedAction(): void {
    this._messageUpdatedAction = this._createActionByOption(
      'onMessageUpdated',
      { excludeValidators: ['disabled'] },
    );
  }

  _createTypingStartAction(): void {
    this._typingStartAction = this._createActionByOption(
      'onTypingStart',
      { excludeValidators: ['disabled'] },
    );
  }

  _createTypingEndAction(): void {
    this._typingEndAction = this._createActionByOption(
      'onTypingEnd',
      { excludeValidators: ['disabled'] },
    );
  }

  _createAttachmentDownloadAction(): void {
    this._attachmentDownloadAction = this._createActionByOption(
      'onAttachmentDownload',
      { excludeValidators: ['disabled'] },
    );
  }

  _messageEnteredHandler(e: MessageBoxMessageEnteredEvent): void {
    const { text, event } = e;
    const { user } = this.option();

    const message: Message = {
      timestamp: new Date(),
      author: user,
      text,
    };

    // @ts-expect-error
    const dataSource = this.getDataSource();

    if (isDefined(dataSource)) {
      dataSource.store().insert(message).done(() => {
        const { reloadOnChange } = this.option();

        if (reloadOnChange) {
          dataSource.reload();
        }
      });
    }

    this._messageEnteredAction?.({ message, event });
  }

  _typingStartHandler(e: MessageBoxTypingStartEvent): void {
    const { event } = e;
    const { user } = this.option();

    this._typingStartAction?.({ user, event });
  }

  _typingEndHandler(): void {
    const { user } = this.option();

    this._typingEndAction?.({ user });
  }

  _focusTarget(): dxElementWrapper {
    const $input = $(this.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);

    return $input;
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
      case 'fileUploaderOptions':
        this._messageBox.option(name, value);
        break;
      case 'user': {
        const author = value as Properties[typeof name];

        this._messageList.option('currentUserId', author?.id);
        break;
      }
      case 'editing':
        break;
      case 'items':
        this._messageList.option(name, this.option('items'));
        this._updateMessageBoxAria();
        break;
      case 'dataSource':
        // @ts-expect-error
        this._refreshDataSource();
        break;
      case 'alerts':
        this._alertList.option('items', value ?? []);
        break;
      case 'onMessageEntered':
        this._createMessageEnteredAction();
        break;
      case 'onMessageUpdating':
        this._createMessageEditCanceledAction();
        break;
      case 'onMessageUpdated':
        this._createMessageEditCanceledAction();
        break;
      case 'onMessageEditingStart':
        this._createMessageEditingStartAction();
        break;
      case 'onMessageEditCanceled':
        this._createMessageEditCanceledAction();
        break;
      case 'onMessageDeleting':
        this._createMessageDeletingAction();
        break;
      case 'onMessageDeleted':
        this._createMessageDeletedAction();
        break;
      case 'onTypingStart':
        this._createTypingStartAction();
        break;
      case 'onTypingEnd':
        this._createTypingEndAction();
        break;
      case 'onAttachmentDownload':
        this._createAttachmentDownloadAction();
        this._messageList.option({ onAttachmentDownload: this._getAttachmentDownloadHandler() });
        break;
      case 'showDayHeaders':
      case 'showAvatar':
      case 'showUserName':
      case 'showMessageTimestamp':
        this._messageList.option(name, !!value);
        break;
      case 'dayHeaderFormat':
      case 'messageTimestampFormat':
      case 'typingUsers':
        this._messageList.option(name, value);
        break;
      case 'messageTemplate':
        this._messageList.option(name, this._getMessageTemplate());
        break;
      case 'emptyViewTemplate':
        this._messageList.option(name, this._getEmptyViewTemplate());
        break;
      case 'reloadOnChange':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _insertNewItem(item: Message): void {
    const { items } = this.option();

    const newItems = [...items ?? [], item];
    this.option('items', newItems);
  }

  renderMessage(message: Message = {}): void {
    this._insertNewItem(message);
  }

  _dispose(): void {
    this._deleteConfirmationPopup?.dispose();
    super._dispose();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Chat as any).include(DataHelperMixin);

registerComponent('dxChat', Chat);

export default Chat;
