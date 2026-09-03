import type { Locator } from '@playwright/test';

const CLASS = {
  buttonContainer: 'dx-texteditor-buttons-container',
  button: 'dx-button',
  buttonText: 'dx-button-text',
};

export default class ActionButton {
  public readonly element: Locator;

  constructor(editor: Locator, index: number) {
    this.element = editor.locator(`.${CLASS.buttonContainer} .${CLASS.button}:nth-child(${index + 1})`);
  }

  public getText(): Locator {
    return this.element.locator(`.${CLASS.buttonText}`);
  }
}
