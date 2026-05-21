import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import { CLASSES } from '@ts/grids/grid_core/ai_chat/const';

export class AIChatModel {
  protected readonly root: dxElementWrapper;

  constructor() {
    this.root = $(`.${CLASSES.aiChat}`);
  }

  public getMessages(): dxElementWrapper {
    return this.root.find(`.${CLASSES.message}`);
  }

  public getMessage(messageIndex: number): dxElementWrapper {
    return this.getMessages().eq(messageIndex);
  }

  public getMessageStatus(messageIndex: number): MessageStatus {
    const $message = this.getMessage(messageIndex);
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
    return this.getMessage(messageIndex)
      .find(`.${CLASSES.messageErrorText}`);
  }

  public getActionList(messageIndex: number): dxElementWrapper {
    return this.getMessage(messageIndex)
      .find(`.${CLASSES.actionListItemText}`);
  }

  public getRegenerateButton(messageIndex: number): HTMLElement {
    return this.getMessage(messageIndex)
      .find(`.${CLASSES.messageRegenerateButton}`)
      .get(0) as HTMLElement;
  }
}
