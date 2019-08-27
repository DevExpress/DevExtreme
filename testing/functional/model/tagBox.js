import { Selector } from 'testcafe';
import ListModel from './list';

const CLASS = {
    input: 'dx-texteditor-input',
    focused: 'dx-state-focused',
};

const ATTR = {
    popupId: 'aria-controls'
};

export default function TagBoxModel(id) {
    const element = Selector(id);
    const input = element.find(`.${CLASS.input}`);

    return {
        element,
        isFocused: element.hasClass(CLASS.focused),
        opened: input.hasAttribute(ATTR.popupId),

        get list() {
            return input.getAttribute(ATTR.popupId).then(popupId => ListModel(Selector(`#${popupId}`)));
        }
    };
}
