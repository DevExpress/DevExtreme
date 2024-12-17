import { Selector } from 'testcafe';
import Toolbar from '../toolbar';

const CLASS = {
  overlayWrapper: 'dx-overlay-wrapper',
  overlayContent: 'dx-overlay-content',
  invalidMessage: 'dx-invalid-message',
  revertTooltip: 'dx-datagrid-revert-tooltip',
  toolbar: 'dx-toolbar',
  checkbox: 'dx-checkbox',
};

export class Overlay {
  element: Selector;

  content: Selector;

  constructor(id?: Selector, index?: number) {
    this.element = id 
      ? (index ? id.nth(index) : id) 
      : Selector(`.${CLASS.overlayWrapper}`).nth(index ? index : 0);

    this.content = this.element.find(`.${CLASS.overlayContent}`);
  }

  getInvalidMessage(): Selector {
    return this.element.filter(`.${CLASS.invalidMessage}`);
  }

  getRevertTooltip(): Selector {
    return this.element.filter(`.${CLASS.revertTooltip}`);
  }

  getPopupCheckbox(): Selector {
    return this.element.find(`.${CLASS.overlayContent} .${CLASS.checkbox}`);
  }

  getToolbar(idx?: number): Toolbar {
    return new Toolbar(this.element.find(`.${CLASS.toolbar}`).nth(idx ? idx : 0));
  }
}
