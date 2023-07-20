import { Selector } from 'testcafe';

const CLASS = {
  overlayWrapper: 'dx-overlay-wrapper',
  overlayContent: 'dx-overlay-content',
  invalidMessage: 'dx-invalid-message',
  revertTooltip: 'dx-datagrid-revert-tooltip',
  checkbox: 'dx-checkbox',
};

export class Overlay {
  element: Selector;

  content: Selector;

  constructor(id?: Selector) {
    this.element = id ?? Selector(`.${CLASS.overlayWrapper}`);

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
}
