import { Selector } from 'testcafe';
import ListModel from './list';

const CLASSES = {
    input: 'dx-texteditor-input',
    focusedState: 'dx-state-focused',
};

const ATTRS = {
    popupId: 'aria-controls'
};

export default (id) => {
    const mainElement = Selector(id);
    const input = mainElement.find(`.${CLASSES.input}`);

    return {
        mainElement,
        isFocused: mainElement.hasClass(CLASSES.focusedState),

        get opened() {
            return input.hasAttribute(ATTRS.popupId);
        },

        get list() {
            return input.getAttribute(ATTRS.popupId).then(popupId => ListModel(Selector(`#${popupId}`)))
        }
    };
}
