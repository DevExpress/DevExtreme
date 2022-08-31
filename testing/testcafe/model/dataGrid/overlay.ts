import { Selector } from 'testcafe';

const CLASS = {
  overlayWrapper: 'dx-overlay-wrapper',
  overlayContent: 'dx-overlay-content',
  invalidMessage: 'dx-invalid-message',
  revertTooltip: 'dx-datagrid-revert-tooltip',
  checkbox: 'dx-checkbox',
};

export class Overlay {
  element: Selector = Selector(`.${CLASS.overlayWrapper}`);

  content: Selector;

  constructor(id?: Selector | string) {
    if (id) {
      this.element = typeof id === 'string' ? Selector(id) : id;
    }

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
