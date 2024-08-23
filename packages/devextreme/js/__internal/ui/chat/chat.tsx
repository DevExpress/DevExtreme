import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import type {
  Message, MessageSendEvent, Properties,
} from '@js/ui/chat';
import { render } from 'inferno';

import Widget from '../widget';
import ChatHeader from './chat_header';
import type {
  MessageSendEvent as MessageBoxMessageSendEvent,
} from './chat_message_box';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

class Chat extends Widget<Properties> {
  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
      items: [],
      user: { id: new Guid().toString() },
      onMessageSend: undefined,
    };
  }

  _init(): void {
    super._init();

    this._createMessageSendAction();
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_CLASS);

    super._initMarkup();

    this._infernoRender();
  }

  _infernoRender(): void {
    render(
      <>
        <ChatHeader
          title={this.option('title')}
        />
        <MessageList
          currentUserId={this.option('user')?.id}
          items={this.option('items')}
        />
        <MessageBox
          onMessageSend={this._messageSendHandler.bind(this)}
        />
      </>,
      $(this.element()).get(0),
    );
  }

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _messageSendHandler(e: MessageBoxMessageSendEvent): void {
    const { text, event } = e;
    const { user } = this.option();

    const message: Message = {
      timestamp: String(Date.now()),
      author: user,
      text,
    };

    this.renderMessage(message);
    this._messageSendAction?.({ message, event });
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'title':
      case 'user':
      case 'items':
        this._infernoRender();
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  renderMessage(message: Message): void {
    const { items } = this.option();

    const newItems = items ? [...items, message] : [message];

    this.option('items', newItems);
  }

  _clean(): void {
    render(null, $(this.element()).get(0));
    super._clean();
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
