import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

export interface ChatHeaderProperties {
  title?: string;
}

class ChatHeader extends Component<ChatHeaderProperties> {
  render(): InfernoNode {
    return (
      <div className={CHAT_HEADER_CLASS}>
        <div className={CHAT_HEADER_TEXT_CLASS}>
          {this.props.title}
        </div>
      </div>
    );
  }
}

export default ChatHeader;
