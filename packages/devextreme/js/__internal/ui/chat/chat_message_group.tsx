/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Message } from '@js/ui/chat';
import { combineClasses } from '@ts/core/r1/utils/render_utils';
import type { InfernoNode, RefObject } from 'inferno';
import { Component } from 'inferno';

import Avatar from './chat_avatar';
import MessageBubble from './chat_message_bubble';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_NAME_CLASS = 'dx-chat-message-name';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';

export interface MessageGroupOptions {
  items?: Message[];
  alignment?: 'start' | 'end';
  innerRef?: RefObject<HTMLDivElement>;
}

class MessageGroup extends Component<MessageGroupOptions> {
  _getAlignmentClass(): string {
    const alignment = this.props.alignment ?? 'start';

    const alignmentClass = alignment === 'start'
      ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS
      : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;

    return alignmentClass;
  }

  render(): InfernoNode {
    const alignment = this.props.alignment ?? 'start';

    return (
      <div className={`${CHAT_MESSAGE_GROUP_CLASS} ${this._getAlignmentClass()}`} ref={this.props.innerRef}>
        {alignment === 'start' && (
          <Avatar
            name={this.props.items?.[0].author?.name}
          />
        )}
        {this._renderMessageGroupInformation(this.props.items?.[0]!)}
        {this._renderMessageBubbles(this.props.items ?? [])}
      </div>
    );
  }

  _renderMessageBubble(message: Message, index: number, length: number): InfernoNode {
    const isFirst = index === 0;
    const isLast = index === length - 1;

    const className = combineClasses({
      [CHAT_MESSAGE_BUBBLE_FIRST_CLASS]: isFirst,
      [CHAT_MESSAGE_BUBBLE_LAST_CLASS]: isLast,
    });

    return (
      <MessageBubble
        className={className}
        text={message.text}
      />
    );
  }

  _renderMessageBubbles(items: Message[]): InfernoNode {
    return (
      <>
        {items.map(
          (message, index) => this._renderMessageBubble(message, index, items.length),
        )}
      </>
    );
  }

  _renderName(name: string): InfernoNode {
    return (
      <div className={CHAT_MESSAGE_NAME_CLASS}>
        {name}
      </div>
    );
  }

  _renderTime(timestamp: string): InfernoNode {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateTime = new Date(Number(timestamp));
    const dateTimeString = dateTime.toLocaleTimeString(undefined, options);

    return (
      <div className={CHAT_MESSAGE_TIME_CLASS}>
        {dateTimeString}
      </div>
    );
  }

  _renderMessageGroupInformation(message: Message): InfernoNode {
    const { timestamp, author } = message;

    return (
      <div className={CHAT_MESSAGE_GROUP_INFORMATION_CLASS}>
        {author?.name && this._renderName(author.name)}
        {timestamp && this._renderTime(timestamp)}
      </div>
    );
  }
}

export default MessageGroup;
