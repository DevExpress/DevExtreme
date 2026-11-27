import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';

const CLASS = {
  fieldItemContent: 'dx-field-item-content',
  textBox: 'dx-textbox',
};

export default class AdaptiveCell extends GridFocusableElement {
  constructor(adaptiveRow: Locator, index: number) {
    super(adaptiveRow.locator(`.${CLASS.fieldItemContent}`).nth(index));
  }

  // An adaptive cell in the edit state holds its editor in place of the text.
  public async expectEditCell(present = true): Promise<void> {
    await expect(this.element.locator(`:scope > .${CLASS.textBox}`)).toBeAttached({ attached: present });
  }
}
