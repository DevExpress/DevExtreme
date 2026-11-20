import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import Button from './button';

const CLASS = {
  input: 'dx-texteditor-input',
  label: 'dx-label',
  buttonsContainer: 'dx-texteditor-buttons-container',
  button: 'dx-button',
};

export default class TextBox extends Widget {
  name: WidgetName = 'dxTextBox';

  public readonly input: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.element.locator(`.${CLASS.input}`);
  }

  public getButton(index = 0): Button {
    return new Button(
      this.page,
      this.element.locator(`.${CLASS.buttonsContainer} > .${CLASS.button}`).nth(index),
    );
  }

  public getLabel(): Locator {
    return this.element.locator(`.${CLASS.label}`);
  }

  public getLabelSpan(): Locator {
    return this.getLabel().locator('span');
  }
}
