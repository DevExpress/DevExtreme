import { Selector } from 'testcafe';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  menu: 'dx-dropdownmenu-popup',
  select: 'dx-selectbox-popup-wrapper',

  editorButton: 'dx-dropdowneditor-button',
  item: 'dx-item',
  listItem: 'dx-list-item',
};

export class DropDownSelectPopup {
  menu: Selector;

  select: Selector;

  constructor() {
    this.menu = Selector(`.${CLASS.menu}`);
    this.select = Selector(`.${CLASS.select}`);
  }

  menuContent(): Selector {
    return this.menu.find(`.${CLASS.overlayContent}`);
  }

  editButton(): Selector {
    return this.menu.find(`.${CLASS.editorButton}`);
  }

  getSelectItem(index: number): Selector {
    return this.select.find(`.${CLASS.item}.${CLASS.listItem}`).nth(index);
  }
}
