import { Selector } from 'testcafe';
import { ToolbarPopup } from './toolbar-popup';

const CLASS = {
  popup: 'dx-overlay-content',
  toolbarMenuContainer: 'dx-toolbar-menu-container',
  button: 'dx-button',
};

export class Toolbar {
  element: Selector;

  popup: ToolbarPopup;

  constructor(id: string) {
    this.element = Selector(id);

    this.popup = new ToolbarPopup(`.${CLASS.popup}`);
  }

  getButton(): Selector {
    return this.element.find(`.${CLASS.toolbarMenuContainer} > .${CLASS.button}`);
  }
}
