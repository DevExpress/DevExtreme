import Widget from './internal/widget';

const CLASS = {
    buttonContainer: 'dx-texteditor-buttons-container',
    button: 'dx-button',
    input: 'dx-texteditor-input'
};

class ActionButton {
    element: Selector;

    constructor (editor: Selector, index: number) {
        this.element = editor.find(`.${CLASS.buttonContainer} .${CLASS.button}:nth-child(${++index})`);
    }
}

export default class TextBox extends Widget {
    input: Selector;
    value: Promise<string>;

    name: string = 'dxTextBox';

    constructor (id: string) {
        super(id);

        this.input = this.element.find(`.${CLASS.input}`);
        this.value = this.input.value;
    }

    async getButton(index:number):Promise<ActionButton> {
        return new ActionButton(this.element, index);
    }
}
