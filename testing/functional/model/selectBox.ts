import { Selector } from 'testcafe';

const CLASS = {
    input: 'dx-texteditor-input',
    focused: 'dx-state-focused',
    buttonContainer: 'dx-texteditor-buttons-container',
    button: 'dx-button'
};

const ATTR = {
    popupId: 'aria-controls'
};

class ActionButton {
    element: Selector;

    constructor (editor: Selector, index: number) {
        this.element = editor.find(`.${CLASS.buttonContainer} .${CLASS.button}:nth-child(${++index})`);
    }
}

export default class SelectBox {
    element: Selector;
    input: Selector;
    isFocused: Promise<boolean>;
    value: Promise<string>;
    opened: Promise<boolean>;

    constructor (id: string) {
        this.element = Selector(id);
        this.input = this.element.find(`.${CLASS.input}`);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.value = this.input.value;
        this.opened = this.input.hasAttribute(ATTR.popupId);
    }

    async getButton(index:number):Promise<ActionButton> {
        return new ActionButton(this.element, index);
    }
}
