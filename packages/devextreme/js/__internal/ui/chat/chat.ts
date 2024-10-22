import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { Options as DataSourceOptions } from '@js/data/data_source';
import DataHelperMixin from '@js/data_helper';
import type { NativeEventInfo } from '@js/events';
import messageLocalization from '@js/localization/message';
import type {
  Message,
  MessageSendEvent,
  Properties as ChatProperties,
  User,
} from '@js/ui/chat';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import ErrorList from './errorlist';
import ChatHeader from './header';
import type {
  MessageSendEvent as MessageBoxMessageSendEvent,
  Properties as MessageBoxProperties,
} from './messagebox';
import MessageBox from './messagebox';
import MessageList from './messagelist';

const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

type TypingStartEvent = NativeEventInfo<Chat> & { user?: User };
type TypingEndEvent = NativeEventInfo<Chat> & { user?: User };

type Properties = ChatProperties & {
  title: string;
  showDayHeaders: boolean;
  onTypingStart?: ((e: TypingStartEvent) => void);
  onTypingEnd?: ((e: TypingEndEvent) => void);
};

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox!: MessageBox;

  _messageList!: MessageList;

  _errorList!: ErrorList;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _typingStartAction?: (e: Partial<TypingStartEvent>) => void;

  _typingEndAction?: (e: Partial<TypingEndEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
      showDayHeaders: true,
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      items: [],
      dataSource: null,
      user: { id: new Guid().toString() },
      errors: [],
      onMessageSend: undefined,
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

    this._createMessageSendAction();
    this._createTypingStartAction();
    this._createTypingEndAction();
  }

  _dataSourceLoadErrorHandler(): void {
    this.option('items', []);
  }

  _dataSourceChangedHandler(newItems: Message[]): void {
    this.option('items', newItems.slice());
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

    const { title } = this.option();

    if (title) {
      this._renderHeader(title);
    }

    this._renderMessageList();
    this._renderErrorList();
    this._renderMessageBox();

    this._updateRootAria();
    this._updateMessageBoxAria();
  }

  _renderHeader(title: string): void {
    const $header = $('<div>');

    this.$element().append($header);
    this._chatHeader = this._createComponent($header, ChatHeader, {
      title,
    });
  }

  _renderMessageList(): void {
    const { items = [], user, showDayHeaders } = this.option();

    const currentUserId = user?.id;
    const $messageList = $('<div>');

    this.$element().append($messageList);

    this._messageList = this._createComponent($messageList, MessageList, {
      items,
      currentUserId,
      showDayHeaders,
      // @ts-expect-error
      isLoading: this._dataController.isLoading(),
    });
  }

  _renderErrorList(): void {
    const $errors = $('<div>');

    this.$element().append($errors);

    const { errors = [] } = this.option();

    this._errorList = this._createComponent($errors, ErrorList, {
      items: errors,
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
      onMessageSend: (e) => {
        this._messageSendHandler(e);
      },
      onTypingStart: () => {
        this._typingStartHandler();
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

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _createTypingStartAction(): void {
    this._typingStartAction = this._createActionByOption(
      'onTypingStart',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _createTypingEndAction(): void {
    this._typingEndAction = this._createActionByOption(
      'onTypingEnd',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _messageSendHandler(e: MessageBoxMessageSendEvent): void {
    const { text, event } = e;
    const { user } = this.option();

    const message: Message = {
      timestamp: new Date(),
      author: user,
      text,
    };

    this._messageSendAction?.({ message, event });
  }

  _typingStartHandler(): void {
    const { user } = this.option();

    this._typingStartAction?.({ user });
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
      case 'title': {
        if (value) {
          if (this._chatHeader) {
            this._chatHeader.option('title', value);
          } else {
            this._renderHeader(value);
          }
        } else if (this._chatHeader) {
          this._chatHeader.dispose();
          this._chatHeader.$element().remove();
        }
        break;
      }
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
      case 'errors':
        this._errorList.option('items', value ?? []);
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      case 'onTypingStart':
        this._createTypingStartAction();
        break;
      case 'onTypingEnd':
        this._createTypingEndAction();
        break;
      case 'showDayHeaders':
        this._messageList.option(name, value);
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
    // @ts-expect-error
    const dataSource = this.getDataSource();

    if (!isDefined(dataSource)) {
      this._insertNewItem(message);
      return;
    }

    dataSource.store().insert(message).done(() => {
      this._insertNewItem(message);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Chat as any).include(DataHelperMixin);

registerComponent('dxChat', Chat);

export default Chat;
