import Chat from '@js/ui/chat';
import { CHAT_MESSAGEBUBBLE_CLASS } from '@ts/ui/chat/messagebubble';
import { CHAT_MESSAGEGROUP_CLASS } from '@ts/ui/chat/messagegroup';

import { MessageBubbleModel } from './message_bubble';

export class ChatModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getInstance(): Chat {
    return Chat.getInstance(this.root) as Chat;
  }

  public getMessageBubbles(): MessageBubbleModel[] {
    return Array.from(this.root.querySelectorAll(`.${CHAT_MESSAGEBUBBLE_CLASS}`))
      .map((element) => new MessageBubbleModel(element as HTMLElement));
  }

  public getMessageBubble(index: number): MessageBubbleModel {
    return this.getMessageBubbles()[index];
  }

  public getLastMessageBubble(): MessageBubbleModel {
    return this.getMessageBubbles().slice(-1)[0];
  }

  public getMessageGroupsCount(): number {
    return this.root.querySelectorAll(`.${CHAT_MESSAGEGROUP_CLASS}`).length;
  }

  public getToolCallsElements(): HTMLElement[] {
    return this.getMessageBubbles()
      .map((bubble) => bubble.getToolCallsElement())
      .filter((element): element is HTMLElement => !!element);
  }
}
