import type { Locator } from '@playwright/test';
import GridElement from '../gridCore/element';

const CLASS = {
  actionListItem: 'dx-ai-chat__action-list-item',
};

export default class AIMessage extends GridElement {
  public getActionItems(): Locator {
    return this.element.locator(`.${CLASS.actionListItem}`);
  }
}
