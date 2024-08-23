import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';

export interface MessageBubbleOptions {
  text?: string;
  className?: string;
}

class MessageBubble extends Component<MessageBubbleOptions> {
  render(): InfernoNode {
    return (
      <div className={`${CHAT_MESSAGE_BUBBLE_CLASS} ${this.props.className}`}>
        {this.props.text}
      </div>
    );
  }
}

export default MessageBubble;
