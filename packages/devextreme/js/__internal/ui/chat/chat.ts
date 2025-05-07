import { Guid } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSourceOptions } from '@js/common/data';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import DataHelperMixin from '@js/data_helper';
import type {
  Message,
  MessageEnteredEvent,
  Properties,
  TypingEndEvent,
  TypingStartEvent,
} from '@js/ui/chat';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import AlertList from '@ts/ui/chat/alertlist';
import type {
  MessageEnteredEvent as MessageBoxMessageEnteredEvent,
  Properties as MessageBoxProperties,
  TypingStartEvent as MessageBoxTypingStartEvent,
} from '@ts/ui/chat/messagebox';
import MessageBox from '@ts/ui/chat/messagebox';
import type { MessageTemplate, Properties as MessageListProperties } from '@ts/ui/chat/messagelist';
import MessageList from '@ts/ui/chat/messagelist';
import type { DataChange } from '@ts/ui/collection/collection_widget.base';

const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

class Chat extends Widget<Properties> {
  _messageBox!: MessageBox;

  _messageList!: MessageList;

  _alertList!: AlertList;

  _messageEnteredAction?: (e: Partial<MessageEnteredEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: (e: Partial<TypingEndEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      showDayHeaders: true,
      activeStateEnabled: true,
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
    };
  }

  _init(): void {
    super._init();

    // @ts-expect-error
    this._initDataController();
    // @ts-expect-error
    this._refreshDataSource();

    this._createMessageEnteredAction();
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
      messageTemplate: this._getMessageTemplate(),
      showDayHeaders,
      showAvatar,
      showUserName,
      showMessageTimestamp,
      dayHeaderFormat,
      messageTimestampFormat,
      typingUsers,
      isLoading,
    };

    return options;
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Chat as any).include(DataHelperMixin);

registerComponent('dxChat', Chat);

export default Chat;
