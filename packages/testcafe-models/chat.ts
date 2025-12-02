import type { WidgetName } from './types';
import Widget from './internal/widget';
import Scrollable from './scrollView/scrollable';
import TextArea from './textArea';
import dxChat from 'devextreme/ui/chat';

const CLASS = {
  input: 'dx-texteditor-input',
  messageList: 'dx-chat-messagelist',
  messageBoxButton: 'dx-button',
  scrollable: 'dx-scrollable',
  textArea: 'dx-textarea',
  messageBubble: 'dx-chat-messagebubble',
  contextMenuContent: 'dx-messagelist-context-menu-content',
  menuItem: 'dx-menu-item',
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

  getMessage(index: number): Selector {
    return this.element.find(`.${CLASS.messageBubble}`).nth(index);
  }

  getContextMenuContent(): Selector {
    return this.element.find(`.${CLASS.contextMenuContent}`);
  }

  getContextMenuItem(index: number): Selector {
    return (this.getContextMenuContent()).find(`.${CLASS.menuItem}`).nth(index);
  }
}
