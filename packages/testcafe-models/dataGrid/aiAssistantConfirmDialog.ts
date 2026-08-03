import Button from '../button';

const CLASS = {
  button: 'dx-dialog-button',
};

const BUTTON_ARIA_LABEL = {
  decline: 'No',
  confirm: 'Yes',
};

export class AIAssistantConfirmDialog {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  getButtons(): Selector {
    return this.element.find(`.${CLASS.button}`);
  }

  getConfirmButton(): Button {
    return new Button(this.getButtons().withAttribute('aria-label', BUTTON_ARIA_LABEL.confirm));
  }

  getDeclineButton(): Button {
    return new Button(this.getButtons().withAttribute('aria-label', BUTTON_ARIA_LABEL.decline));
  }
}
