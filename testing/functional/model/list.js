import { Selector } from 'testcafe';

const CLASSES = {
    focusedState: 'dx-state-focused',
    listItem: 'dx-list-item',
    selectAllCheckBox: 'dx-list-select-all-checkbox'
};

export default function ListModel(id) {
    const mainElement = Selector(id);

    return {
        selectAllCheckBox: {
            get isFocused() {
                return mainElement.find(`.${CLASSES.selectAllCheckBox}`).hasClass(CLASSES.focusedState);
            }
        },

        getItem: (index = 0) => {
            const itemElement = mainElement.find(`.${CLASSES.listItem}`).nth(index);

            return {
                element: itemElement,
                checkBox: {
                    get isFocused() {
                        return itemElement.hasClass(CLASSES.focusedState);
                    }
                }
            };
        }
    };
}
