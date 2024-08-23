/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { hasWindow } from '@js/core/utils/window';
import type { Message } from '@js/ui/chat';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { InfernoNode } from 'inferno';
import { Component, createPortal, createRef } from 'inferno';

import MessageGroup from './chat_message_group';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const CHAT_MESSAGE_LIST_CONTENT_CLASS = 'dx-chat-message-list-content';

export interface MessageListOptions {
  items?: Message[];
  currentUserId?: number | string;
}

class MessageList extends Component<MessageListOptions> {
  scrollableRef = createRef<HTMLDivElement>();

  scrollableContentRef = createRef<HTMLDivElement>();

  lastMessageGroupRef = createRef<HTMLDivElement>();

  private _scrollable!: dxScrollable<unknown>;

  render(): InfernoNode {
    return (
      <div className={CHAT_MESSAGE_LIST_CLASS}>
        <div ref={this.scrollableRef}></div>
        {this.scrollableContentRef.current && createPortal(
          this._renderMessageListContent(),
          this.scrollableContentRef.current,
        )}
      </div>
    );
  }

  componentDidMount(): void {
    this._scrollable = new Scrollable<unknown>(this.scrollableRef.current!, { useNative: true });
    // @ts-expect-error
    this.scrollableContentRef.current = this._scrollable.$content().get(0);
    // just for triggering re-render
    this.setState({
      scrollableRendered: true,
    });
  }

  componentDidUpdate(): void {
    this._scrollContentToLastMessageGroup();
  }

  _isCurrentUser(id): boolean {
    const { currentUserId } = this.props;

    return currentUserId === id;
  }

  _messageGroupAlignment(id): 'start' | 'end' {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }

  _createMessageGroupComponent(items, userId, isLast = false): InfernoNode {
    return (
      <MessageGroup
        items={items}
        alignment={this._messageGroupAlignment(userId)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        innerRef={isLast ? this.lastMessageGroupRef as any : undefined}
      />
    );
  }

  _renderMessageListContent(): InfernoNode {
    const { items } = this.props;

    const groupItems: InfernoNode[] = [];

    let currentMessageGroupUserId = items?.[0]?.author?.id;
    let currentMessageGroupItems: Message[] = [];

    (items ?? []).forEach((item, index) => {
      const id = item?.author?.id;

      if (id === currentMessageGroupUserId) {
        currentMessageGroupItems.push(item);
      } else {
        groupItems.push(
          this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId),
        );

        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(item);
      }

      if (items!.length - 1 === index) {
        groupItems.push(
          this._createMessageGroupComponent(
            currentMessageGroupItems,
            currentMessageGroupUserId,
            true,
          ),
        );
      }
    });

    return (
      <div className={CHAT_MESSAGE_LIST_CONTENT_CLASS}>
        {groupItems}
      </div>
    );
  }

  _scrollContentToLastMessageGroup(): void {
    if (!(this.lastMessageGroupRef.current && this._scrollable && hasWindow())) {
      return;
    }

    const lastMessageGroup = this.lastMessageGroupRef.current;

    this._scrollable.scrollToElement(lastMessageGroup);
  }
}

export default MessageList;
