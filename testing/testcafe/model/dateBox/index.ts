import { Selector, ClientFunction } from 'testcafe';
import Widget from '../internal/widget';

const CLASS = {
  input: 'dx-texteditor-input',
  dropDownEditorButton: 'dx-dropdowneditor-button',
  doneButton: 'dx-popup-done',
};

export default class DateBox extends Widget {
  input: Selector;

  dropDownEditorButton: Selector;

  name = 'dxDateBox';

  constructor(id: string|Selector) {
    super(id);

    this.input = this.element.find(`.${CLASS.input}`);
    this.dropDownEditorButton = this.element.find(`.${CLASS.dropDownEditorButton}`);
  }

  static getDoneButton(): Selector {
    return Selector(`.${CLASS.doneButton}`);
  }

  static getDateViewRollerClass(viewName: string): string {
    return `.dx-dateviewroller-${viewName}`;
  }

  static getRollerScrollTop(viewName: string): Promise<number> {
    const rollerClass: string = DateBox.getDateViewRollerClass(viewName);
    return ClientFunction(() => $(`${rollerClass} .dx-scrollable-container`).scrollTop(),
      {
        dependencies: {
          rollerClass,
        },
      })();
  }
}
