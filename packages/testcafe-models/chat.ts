import type { WidgetName } from './types';
import Widget from './internal/widget';
import dxChat from 'devextreme/ui/chat';

const CLASS = {
  input: 'dx-texteditor-input',
  messageList: 'dx-chat-messagelist',
  messageBoxButton: 'dx-chat-messagebox-button',
};

export default class Chat extends Widget {
  messageList: Selector;
  messageBoxButton: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.messageList = this.element.find(`.${CLASS.messageList}`);
    this.messageBoxButton = this.element.find(`.${CLASS.messageBoxButton}`);
  }

  getInstance: () => dxChat;

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxChat'; }

  getInput(): Selector {
    return this.element.find(`.${CLASS.input}`);
  }
}
