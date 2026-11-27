import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  header: 'dx-ai-chat__message-header',
  errorText: 'dx-ai-chat__message-error-text',
  regenerateButton: 'dx-ai-chat__message-regenerate-button',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  actionListItemAborted: 'dx-ai-chat__action-list-item--aborted',
  actionListItemText: 'dx-ai-chat__action-list-item-text',
};

export default class AIMessage extends GridElement {
  public getHeader(): Locator {
    return this.element.locator(`.${CLASS.header}`);
  }

  public getErrorText(): Locator {
    return this.element.locator(`.${CLASS.errorText}`);
  }

  // A plain icon element, not a dxButton.
  public getRegenerateButton(): Locator {
    return this.element.locator(`.${CLASS.regenerateButton}`);
  }

  public getActionItems(): Locator {
    return this.element.locator(`.${CLASS.actionListItem}`);
  }

  public getSuccessActionItems(): Locator {
    return this.element.locator(`.${CLASS.actionListItemSuccess}`);
  }

  public getErrorActionItems(): Locator {
    return this.element.locator(`.${CLASS.actionListItemError}`);
  }

  public getAbortedActionItems(): Locator {
    return this.element.locator(`.${CLASS.actionListItemAborted}`);
  }

  public getActionItemText(index: number): Locator {
    return this.getActionItems().nth(index).locator(`.${CLASS.actionListItemText}`);
  }
}
