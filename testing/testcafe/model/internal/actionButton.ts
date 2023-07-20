const CLASS = {
  buttonContainer: 'dx-texteditor-buttons-container',
  button: 'dx-button',
  buttonText: 'dx-button-text',
};

export default class ActionButton {
  element: Selector;

  constructor(editor: Selector, index: number) {
    this.element = editor.find(`.${CLASS.buttonContainer} .${CLASS.button}:nth-child(${index + 1})`);
  }

  getText(): Selector {
    return this.element.find(`.${CLASS.buttonText}`);
  }
}
