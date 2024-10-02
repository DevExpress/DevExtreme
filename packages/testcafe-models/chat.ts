import type { WidgetName } from './types';
import Widget from './internal/widget';
import Scrollable from './scrollView/scrollable';
import TextArea from './textArea';
import dxChat from 'devextreme/ui/chat';

const CLASS = {
  input: 'dx-texteditor-input',
  messageList: 'dx-chat-messagelist',
  messageBoxButton: 'dx-chat-messagebox-button',
  scrollable: 'dx-scrollable',
  textArea: 'dx-textarea',
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

  getTextArea(): TextArea {
    return new TextArea(this.element.find(`.${CLASS.textArea}`));
  }

  getInput(): Selector {
    return this.getTextArea().getInput();
  }

  getScrollable(): Scrollable {
      return new Scrollable(this.element.find(`.${CLASS.scrollable}`));
  }
}
