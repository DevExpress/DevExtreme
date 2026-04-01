import { AIChat } from '../ai_chat/ai_chat';
import type { AIChatOptions } from '../ai_chat/types';
import { View } from '../m_modules';

export class AIAssistantView extends View {
  private aiChatInstance!: AIChat;

  private getAIChatConfig(): AIChatOptions {
    return {
      container: this.element(),
      createComponent: this._createComponent.bind(this),
    };
  }

  protected _renderCore(): void {
    const config = this.getAIChatConfig();

    if (!this.aiChatInstance) {
      this.aiChatInstance = new AIChat(config);
    }
  }

  public show(): Promise<boolean> {
    return this.aiChatInstance?.show() ?? Promise.resolve(false);
  }

  public hide(): Promise<boolean> {
    return this.aiChatInstance?.hide() ?? Promise.resolve(false);
  }
}
