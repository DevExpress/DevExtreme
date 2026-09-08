import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Popup from '../popup';

const CLASS = {
  input: 'dx-texteditor-input',
  dropDownEditorButton: 'dx-dropdowneditor-button',
  doneButton: 'dx-popup-done',
  popup: 'dx-popup',
};

export default class DateBox extends Widget {
  public readonly input: Locator;

  public readonly dropDownEditorButton: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.element.locator(`.${CLASS.input}`);
    this.dropDownEditorButton = this.element.locator(`.${CLASS.dropDownEditorButton}`);
  }

  static getDoneButton(page: Page): Locator {
    return page.locator(`.${CLASS.doneButton}`);
  }

  static getDateViewRollerClass(viewName: string): string {
    return `.dx-dateviewroller-${viewName}`;
  }

  static getRollerScrollTop(page: Page, viewName: string): Promise<number> {
    return page.evaluate(
      (rollerClass) => $(`${rollerClass} .dx-scrollable-container`).scrollTop() ?? 0,
      DateBox.getDateViewRollerClass(viewName),
    );
  }

  public getPopup(): Popup {
    return new Popup(this.page, this.element.locator(`.${CLASS.popup}`));
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxDateBox'; }
}
