import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';

const CLASS = {
  input: 'dx-texteditor-input',
  dropDownEditorButton: 'dx-dropdowneditor-button',
};

export default class DateBox extends Widget {
  public readonly input: Locator;

  public readonly dropDownEditorButton: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.element.locator(`.${CLASS.input}`);
    this.dropDownEditorButton = this.element.locator(`.${CLASS.dropDownEditorButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxDateBox'; }
}
