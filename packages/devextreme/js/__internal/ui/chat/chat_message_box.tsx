/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { NativeEventInfo } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { InfernoNode } from 'inferno';
import { Component, createRef } from 'inferno';

import type dxTextArea from '../../../ui/text_area';
import TextArea from '../m_text_area';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

export type MessageSendEvent =
  NativeEventInfo<MessageBox, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> &
  { text?: string };

export interface MessageBoxProperties {
  onMessageSend?: (e: MessageSendEvent) => void;
}

class MessageBox extends Component<MessageBoxProperties> {
  textAreaRef = createRef<HTMLDivElement>();

  buttonRef = createRef<HTMLDivElement>();

  _textArea!: dxTextArea;

  _button!: Button;

  render(): InfernoNode {
    return (
      <div className={CHAT_MESSAGE_BOX_CLASS}>
        <div
          className={CHAT_MESSAGE_BOX_TEXTAREA_CLASS}
          ref={this.textAreaRef}
        />
        <div
          className={CHAT_MESSAGE_BOX_BUTTON_CLASS}
          ref={this.buttonRef}
        />
      </div>
    );
  }

  componentDidMount(): void {
    this._textArea = new TextArea(this.textAreaRef.current!, {});
    this._button = new Button(this.buttonRef.current!, {
      icon: 'send',
      stylingMode: 'text',
      onClick: (e): void => {
        this._sendHandler(e);
      },
    });
  }

  _sendHandler(e: ClickEvent): void {
    const text = this._textArea?.option('text');

    if (!text) {
      return;
    }

    // @ts-expect-error
    this.props.onMessageSend?.({ text, event: e.event });
    this._textArea?.reset();
  }
}

export default MessageBox;
