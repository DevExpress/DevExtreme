import Button from '../button';

const CLASS = {
  button: 'dx-dialog-button',
};

const BUTTON_INDEX = {
  decline: 0,
  confirm: 1,
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
    return new Button(this.getButtons().nth(BUTTON_INDEX.confirm));
  }

  getDeclineButton(): Button {
    return new Button(this.getButtons().nth(BUTTON_INDEX.decline));
  }
}
