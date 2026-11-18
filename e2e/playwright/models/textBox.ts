import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  input: 'dx-texteditor-input',
};

export default class TextBox extends Widget {
  public readonly input: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.getInput();
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTextBox'; }

  public getInput(): Locator {
    return this.element.locator(`.${CLASS.input}`);
  }
}
