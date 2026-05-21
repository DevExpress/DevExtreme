import type { ArrayStore } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import type { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import type { AIAssistantViewController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_view_controller';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import { CLASSES } from '@ts/grids/grid_core/ai_chat/const';

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

    controller.sendRequestToAI({
      author: { id: 'user', name: 'User' },
      text,
      timestamp: new Date().toISOString(),
    } as Message).catch(() => {});
  }

  public getMessageStore(): ArrayStore<Message, string> {
    return this.getAiAssistantController().getMessageStore();
  }

  public loadMessages(): Promise<Message[]> {
    return this.getMessageStore().load() as Promise<Message[]>;
  }

  public findMessages(): dxElementWrapper {
    return $(`.${CLASSES.aiChat}`).find(`.${CLASSES.message}`);
  }

  public getMessageStatus($message: dxElementWrapper): MessageStatus {
    if ($message.hasClass(CLASSES.messagePending)) {
      return MessageStatus.Pending;
    }
    if ($message.hasClass(CLASSES.messageSuccess)) {
      return MessageStatus.Success;
    }
    if ($message.hasClass(CLASSES.messageError)) {
      return MessageStatus.Failure;
    }
    return '' as never;
  }

  public getErrorMessage(messageIndex: number): dxElementWrapper {
    return this.findMessages()
      .eq(messageIndex)
      .find(`.${CLASSES.messageErrorText}`);
  }

  public getActionList(messageIndex: number): dxElementWrapper {
    return this.findMessages()
      .eq(messageIndex)
      .find(`.${CLASSES.actionListItemText}`);
  }

  public getRegenerateButton(messageIndex: number): HTMLElement {
    return this.findMessages()
      .eq(messageIndex)
      .find(`.${CLASSES.messageRegenerateButton}`)
      .get(0) as HTMLElement;
  }

  public async togglePopup(): Promise<void> {
    await this.getAiAssistantViewController().toggle();
  }
}
