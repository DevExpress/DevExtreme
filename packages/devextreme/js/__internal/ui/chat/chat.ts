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
  Message,
  MessageDeletedEvent,
  MessageDeletingEvent,
  MessageEditingStartEvent,
  MessageEnteredEvent,
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
} from '@ts/ui/chat/messagebox';
import MessageBox from '@ts/ui/chat/messagebox';
import type {
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

  _messageToEdit: Message | null = null;

  _deleteConfirmationPopup!: ConfirmationPopup;

  _messageToDelete?: Message;

  _messageEnteredAction?: (e: Partial<MessageEnteredEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: (e: Partial<TypingEndEvent>) => void;

  _messageEditingStartAction?: (e: Partial<MessageEditingStartEvent>) => void;

  _messageEditCanceledAction?: (e: Partial<MessageEnteredEvent>) => void;

  _messageDeletingAction?: (e: Partial<MessageDeletingEvent>) => void;

  _messageDeletedAction?: (e: Partial<MessageDeletedEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      showDayHeaders: true,
      activeStateEnabled: true,
      editing: {
        allowUpdating: false,
        allowDeleting: false,
      },
      focusStateEnabled: true,
      hoverStateEnabled: true,
      items: [],
      dataSource: null,
      user: { id: new Guid().toString() },
      dayHeaderFormat: 'shortdate',
      messageTemplate: null,
      messageTimestampFormat: 'shorttime',
      alerts: [],
      showAvatar: true,
      showUserName: true,
      showMessageTimestamp: true,
      typingUsers: [],
      onMessageEntered: undefined,
      reloadOnChange: true,
      onTypingStart: undefined,
      onTypingEnd: undefined,
      onMessageEditingStart: undefined,
      onMessageEditCanceled: undefined,
      onMessageDeleting: undefined,
      onMessageDeleted: undefined,
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
    this._createTypingStartAction();
    this._createTypingEndAction();
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

    const options: MessageListProperties = {
      items,
      currentUserId,
      allowUpdating: (message: Message): boolean => this._allowEditAction(message),
      allowDeleting: (message: Message): boolean => this._allowDeleteAction(message),
      isEditActionDisabled: (message) => this._messageToEdit === message,
      messageTemplate: this._getMessageTemplate(),
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
      },
      onMessageDeleting: (e) => {
        this._messageDeletingHandler(e);
      },
      onKeyHandled: () => {
        this.focus();
      },
    };

    return options;
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

  _getMessageTemplate(): MessageTemplate {
    const { messageTemplate } = this.option();
    if (messageTemplate) {
      return (message, $container): void => {
        const template = this._getTemplateByOption('messageTemplate');

        template.render({
          container: $container,
          model: {
            component: this,
            message,
          },
        });
      };
    }

    return null;
  }

  _messageEditingStartHandler(e: MessageEditingEvent): void {
    const messageEditingStartArgs = {
      message: e.message,
      cancel: false,
    };

    this._messageEditingStartAction?.(messageEditingStartArgs);

    invokeConditionally(
      messageEditingStartArgs.cancel,
      () => {
        this._messageToEdit = e.message;
        this._messageBox.option('editingText', e.message.text);
      },
    );
  }

  _messageEditCanceledHandler(): void {
    if (this._messageToEdit) {
      this._messageEditCanceledAction?.({ message: this._messageToEdit });
      this._messageToEdit = null;
    }
  }

  _showDeleteConfirmationPopup(e: Pick<MessageDeletingEvent, 'message'>): void {
    this._messageToDelete = e.message;

    if (!this._deleteConfirmationPopup) {
      this._deleteConfirmationPopup = new ConfirmationPopup(
        this.$element(),
        {
          onApplyButtonClick: (): void => {
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
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $messageBox = $('<div>');

    this.$element().append($messageBox);

    const configuration: MessageBoxProperties = {
      activeStateEnabled,
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
        this._messageList.option(name, value);
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
