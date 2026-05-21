import type { ArrayStore } from '@js/common/data';
import type { Message } from '@js/ui/chat';
import { AIChatModel } from '@ts/grids/data_grid/__tests__/__mock__/model/ai_chat';
import type { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import type { AIAssistantViewController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_view_controller';
import type { AIMessage } from '@ts/grids/grid_core/ai_assistant/types';

import { DataGridModel } from './data_grid';

export class AIAssistantDataGridModel extends DataGridModel {
  public getAiAssistantController(): AIAssistantController {
    return this.getInstance().getController('aiAssistant');
  }

  public getAiAssistantViewController(): AIAssistantViewController {
    return this.getInstance().getController('aiAssistantViewController');
  }

  public sendAiRequest(text: string): void {
    const controller = this.getAiAssistantController();

    controller
      .sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text,
        timestamp: new Date().toISOString(),
      } as Message)
      .catch(() => {});
  }

  public sendAiRequestWithResponse(message: Message | AIMessage): Promise<void> {
    const controller = this.getAiAssistantController();

    return controller
      .sendRequestToAI(message)
      .catch(() => {});
  }

  public getMessageStore(): ArrayStore<Message, string> {
    return this.getAiAssistantController().getMessageStore();
  }

  public loadMessages(): Promise<Message[]> {
    return this.getMessageStore().load() as Promise<Message[]>;
  }

  public getAiChatModel(): AIChatModel {
    return new AIChatModel();
  }

  public async togglePopup(): Promise<void> {
    await this.getAiAssistantViewController().toggle();
  }
}
