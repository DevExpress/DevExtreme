import type { Locator } from '@playwright/test';
import GridFocusableElement from '../gridCore/focusable';

const CLASS = {
  commandEdit: 'dx-command-edit',
  commandExpand: 'dx-command-expand',
  commandSelect: 'dx-command-select',
  commandAdaptive: 'dx-command-adaptive',
  commandAI: 'dx-command-ai',
  editButton: 'dx-link-edit',
};

const commandSelector = [
  `.${CLASS.commandEdit}`,
  `.${CLASS.commandExpand}`,
  `.${CLASS.commandSelect}`,
  `.${CLASS.commandAdaptive}`,
  `.${CLASS.commandAI}`,
].join(', ');

export default class CommandCell extends GridFocusableElement {
  constructor(dataRow: Locator, index: number) {
    super(dataRow.locator(`:scope > td[aria-colindex='${index + 1}']:is(${commandSelector})`));
  }

  public getButton(index: number): Locator {
    return this.element.locator(':scope > *').nth(index);
  }

  public getEditButton(): Locator {
    return this.element.locator(`.${CLASS.editButton}`);
  }
}
