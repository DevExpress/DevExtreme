import { expect } from '@playwright/test';
import GridFocusableElement from '../gridCore/focusable';

const CLASS = {
  commandExpand: 'dx-command-expand',
  groupOpened: 'dx-datagrid-group-opened',
};

export default class GroupRow extends GridFocusableElement {
  public async expectExpanded(present = true): Promise<void> {
    await expect(this.element.locator(`.${CLASS.commandExpand} .${CLASS.groupOpened}`))
      .toBeAttached({ attached: present });
  }
}
