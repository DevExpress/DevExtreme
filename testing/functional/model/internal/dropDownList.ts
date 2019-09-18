import { Selector, t } from 'testcafe';
import List from '../list';
import TextBox from '../textBox';

const ATTR = {
    popupId: 'aria-controls'
};

export default abstract class DropDownList extends TextBox {
    opened: Promise<boolean>;

    constructor (id: string) {
        super(id);

        this.opened = this.input.hasAttribute(ATTR.popupId);
    }

    async getList(): Promise<List> {
        await t.expect(this.opened).ok();

        const popupId = await this.input.getAttribute(ATTR.popupId);
        const popup = Selector(`#${popupId}`);

        return new List(popup);
    }
}
