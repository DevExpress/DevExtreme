import { Selector } from 'testcafe';

const CLASS = {
    checkbox: 'dx-list-select-checkbox',
    checked: 'dx-checkbox-checked',
    focused: 'dx-state-focused',
    item: 'dx-list-item',
    selectAllItem: 'dx-list-select-all'
};

export default function ListModel(id) {
    const element = typeof id === 'string' ? Selector(id) : id;
    const selectAllItem = element.find(`.${CLASS.selectAllItem}`);
    const items = element.find(`.${CLASS.item}`);
    const getItem = (index = 0) => {
        const item = items.nth(index);

        return {
            element: item,
            checkBox: {
                isFocused: item.hasClass(CLASS.focused),
                isChecked: item.find(`.${CLASS.checkbox}`).hasClass(CLASS.checked)
            }
        };
    };

    return {
        selectAllItem: {
            get isFocused() {
                return selectAllItem.hasClass(CLASS.focused);
            }
        },

        itemsCount: items.count,

        isItemFocused: (index) => getItem(index).checkBox.isFocused,
        isItemChecked: (index) => getItem(index).checkBox.isChecked,

        getItem,
    };
}
