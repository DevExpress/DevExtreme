const CLASS = {
  pending: 'dx-ai-chat__message--pending',
  success: 'dx-ai-chat__message--success',
  error: 'dx-ai-chat__message--error',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
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

  getActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(): Selector {
    return this.element.find(`.${CLASS.actionListItemSuccess}`);
  }
}
