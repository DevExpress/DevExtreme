import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  input: 'dx-texteditor-input',
  label: 'dx-label',
};

export default class TextBox extends Widget {
  public readonly input: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.element.locator(`.${CLASS.input}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTextBox'; }

  public getLabel(): Locator {
    return this.element.locator(`.${CLASS.label}`);
  }

  public getLabelSpan(): Locator {
    return this.getLabel().locator('span');
  }
}
