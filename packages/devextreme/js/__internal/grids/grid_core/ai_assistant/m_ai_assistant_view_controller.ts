import { ViewController } from '../m_modules';
import type { AIAssistantView } from './m_ai_assistant_view';

export class AIAssistantViewController extends ViewController {
  private aiAssistantView!: AIAssistantView;

  public init(): void {
    this.aiAssistantView = this.getView('aiAssistantView');
  }

  public show(): Promise<boolean> {
    return this.aiAssistantView.show();
  }

  public hide(): Promise<boolean> {
    return this.aiAssistantView.hide();
  }
}
