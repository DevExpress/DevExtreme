import type { Callback } from '@js/core/utils/callbacks';

import { AIChat } from '../ai_chat/ai_chat';
import type { AIChatOptions } from '../ai_chat/types';
import { View } from '../m_modules';

export class AIAssistantView extends View {
  private aiChatInstance!: AIChat;

  public visibilityChanged?: Callback;

  private getAIChatConfig(): AIChatOptions {
    return {
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onVisibilityChanged: (visible: boolean): void => {
        this.visibilityChanged?.fire(visible);
      },
    };
  }

  protected _renderCore(): void {
    const config = this.getAIChatConfig();

    if (!this.aiChatInstance) {
      this.aiChatInstance = new AIChat(config);
    }
  }

  protected callbackNames(): string[] {
    return ['visibilityChanged'];
  }

  public isVisible(): boolean {
    return !!this.option('aiAssistant.enabled');
  }

  public isShown(): boolean {
    return this.aiChatInstance?.isShown() ?? false;
  }

  public hide(): Promise<boolean> {
    return this.aiChatInstance?.hide() ?? Promise.resolve(false);
  }

  public toggle(): Promise<boolean> {
    return this.aiChatInstance?.toggle() ?? Promise.resolve(false);
  }
}
