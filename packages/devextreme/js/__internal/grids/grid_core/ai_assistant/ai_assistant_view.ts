import { AIChat } from '../ai_chat/ai_chat';
import type { AIChatOptions } from '../ai_chat/types';
import { View } from '../m_modules';

export class AIAssistantView extends View {
  private aiChatInstance!: AIChat;

  public onVisibilityChanged?: (visible: boolean) => void;

  private getAIChatConfig(): AIChatOptions {
    return {
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onVisibilityChanged: (visible: boolean): void => {
        this.onVisibilityChanged?.(visible);
      },
    };
  }

  protected _renderCore(): void {
    const config = this.getAIChatConfig();

    if (!this.aiChatInstance) {
      this.aiChatInstance = new AIChat(config);
    }
  }

  public isVisible(): boolean {
    return !!this.option('aiAssistant.enabled');
  }

  public isShown(): boolean {
    return this.aiChatInstance?.isShown() ?? false;
  }

  public toggle(): Promise<boolean> {
    return this.aiChatInstance?.toggle() ?? Promise.resolve(false);
  }
}
