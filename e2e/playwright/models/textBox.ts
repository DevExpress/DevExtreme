import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import ActionButton from './internal/actionButton';

const CLASS = {
  input: 'dx-texteditor-input',
  isInvalid: 'dx-invalid',
  label: 'dx-label',
  buttonsContainer: 'dx-texteditor-buttons-container',
  clearButton: 'dx-clear-button-area',
};

export default class TextBox extends Widget {
  public readonly input: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.getInput();
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTextBox'; }

  public getValue(): Promise<string> {
    return this.input.inputValue();
  }

  public isInvalid(): Promise<boolean> {
    return this.hasClass(CLASS.isInvalid);
  }

  public getInput(): Locator {
    return this.element.locator(`.${CLASS.input}`);
  }

  public getButton(index: number): ActionButton {
    return new ActionButton(this.element, index);
  }

  public getClearButton(): Locator {
    return this.element.locator(`.${CLASS.buttonsContainer}`).locator(`.${CLASS.clearButton}`);
  }

  public getLabel(): Locator {
    return this.element.locator(`.${CLASS.label}`);
  }

  public getLabelSpan(): Locator {
    return this.getLabel().locator('span');
  }
}
