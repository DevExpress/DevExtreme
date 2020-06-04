import { Selector, t } from 'testcafe';
import List from '../list';
import TextBox from '../textBox';

const ATTR = {
    popupId: 'aria-controls'
};

const CLASS = {
    dropDownButton: 'dx-dropdowneditor-button'
};

export default abstract class DropDownList extends TextBox {
    opened: Promise<boolean>;
    dropDownButton: Selector;

    constructor(id: string) {
        super(id);

        const popupOwnerElement = this.getPopupOwnerElement();
        const popupIdAttr = this.getPopupIdAttr();

        this.opened = popupOwnerElement.hasAttribute(popupIdAttr);
        this.dropDownButton = this.element.find(`.${CLASS.dropDownButton}`);
    }

    getPopupOwnerElement() {
        return this.input;
    }

    getPopupIdAttr() {
        return ATTR.popupId;
    }

    async getList(): Promise<List> {
        await t.expect(this.opened).ok();

        const popupOwnerElement = this.getPopupOwnerElement();
        const popupIdAttr = this.getPopupIdAttr();
        const popupId = await popupOwnerElement.getAttribute(popupIdAttr);
        const popup = Selector(`#${popupId}`);

        return new List(popup);
    }
}
