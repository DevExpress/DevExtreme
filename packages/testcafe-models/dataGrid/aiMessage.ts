const CLASS = {
  pending: 'dx-ai-chat__message--pending',
  success: 'dx-ai-chat__message--success',
  error: 'dx-ai-chat__message--error',
  header: 'dx-ai-chat__message-header',
  errorText: 'dx-ai-chat__message-error-text',
  regenerateButton: 'dx-ai-chat__message-regenerate-button',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  actionListItemAborted: 'dx-ai-chat__action-list-item--aborted',
  actionListItemText: 'dx-ai-chat__action-list-item-text',
};

export class AIMessage {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  hasPendingState(): Promise<boolean> {
    return this.element.hasClass(CLASS.pending);
  }

  hasSuccessState(): Promise<boolean> {
    return this.element.hasClass(CLASS.success);
  }

  hasErrorState(): Promise<boolean> {
    return this.element.hasClass(CLASS.error);
  }

  hasRegenerateButton(): Promise<boolean> {
    return this.getRegenerateButton().exists;
  }

  getHeader(): Selector {
    return this.element.find(`.${CLASS.header}`);
  }

  getErrorText(): Selector {
    return this.element.find(`.${CLASS.errorText}`);
  }

  // Rendered as a plain icon element, not as a dxButton.
  getRegenerateButton(): Selector {
    return this.element.find(`.${CLASS.regenerateButton}`);
  }

  getActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItemSuccess}`);
  }

  getErrorActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItemError}`);
  }

  getAbortedActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItemAborted}`);
  }

  getActionItemText(index: number): Selector {
    return this.getActionItems().nth(index).find(`.${CLASS.actionListItemText}`);
  }
}
