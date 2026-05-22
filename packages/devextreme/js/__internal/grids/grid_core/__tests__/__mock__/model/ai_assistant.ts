import type { ArrayStore } from '@js/common/data';
import type { Message } from '@js/ui/chat';
import DataGrid from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { AIChatModel } from '@ts/grids/grid_core/__tests__/__mock__/model/ai_chat';
import { DataGridBaseModel } from '@ts/grids/grid_core/__tests__/__mock__/model/data_grid_base';
import type { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import type { AIAssistantViewController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_view_controller';
import type { AIMessage } from '@ts/grids/grid_core/ai_assistant/types';

export class AIAssistantDataGridModel extends DataGridBaseModel<DataGrid> {
  protected NAME = 'dxDataGrid';

  public getInstance(): DataGridInstance {
    return DataGrid.getInstance(this.root) as DataGridInstance;
  }

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

  public sendAiRequestRaw(message: Message | AIMessage): Promise<void> {
    return this.getAiAssistantController().sendRequestToAI(message);
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
