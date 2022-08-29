import { Selector } from 'testcafe';

export const CLASS = {
  content: 'dx-popup-content',
  item: 'dx-item',
  listItem: 'dx-list-item',
  dropDownEditorButton: 'dx-dropdowneditor-button',
  selectBoxPopupWrapper: 'dx-selectbox-popup-wrapper',
};

export class ToolbarPopup {
  element: Selector;

  constructor(id: string) {
    this.element = Selector(id);
  }

  // eslint-disable-next-line class-methods-use-this
  getDropDownEditorButton(): Selector {
    return Selector(`.${CLASS.content} .${CLASS.dropDownEditorButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getMenuItem(): Selector {
    return Selector(`.${CLASS.selectBoxPopupWrapper} .${CLASS.item}.${CLASS.listItem}`).nth(1);
  }
}
