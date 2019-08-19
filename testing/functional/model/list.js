import { Selector } from 'testcafe';

const CLASSES = {
    focusedState: 'dx-state-focused',
    listItem: 'dx-list-item',
    selectAllItem: 'dx-list-select-all'
};

export default function ListModel(id) {
    const mainElement = Selector(id);
    const selectAllItem = mainElement.find(`.${CLASSES.selectAllItem}`);

    return {
        selectAllItem: {
            get isFocused() {
                return selectAllItem.hasClass(CLASSES.focusedState);
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
