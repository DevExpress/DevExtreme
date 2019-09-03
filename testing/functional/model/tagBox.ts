import { Selector, t } from 'testcafe';
import List from './list';

const CLASS = {
    input: 'dx-texteditor-input',
    focused: 'dx-state-focused',
};

const ATTR = {
    popupId: 'aria-controls'
};

export default class TagBox {
    element: Selector;
    input: Selector;
    isFocused: Promise<boolean>;
    opened: Promise<boolean>;

    constructor (id: string) {
        this.element = Selector(id);
        this.input = this.element.find(`.${CLASS.input}`);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.opened = this.input.hasAttribute(ATTR.popupId);
    }

    async getList():Promise<List> {
        await t.expect(this.opened).ok();

        const popupId = await this.input.getAttribute(ATTR.popupId);
        const popup = Selector(`#${popupId}`);

        return new List(popup);
    }
}
