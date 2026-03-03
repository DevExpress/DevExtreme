import $ from 'jquery';

import {
    FORM_FIELD_ITEM_COL_CLASS,
    FIELD_ITEM_CLASS,
} from '__internal/ui/form/constants';

import {
    LAYOUT_MANAGER_FIRST_ROW_CLASS,
    LAYOUT_MANAGER_LAST_ROW_CLASS,
    LAYOUT_MANAGER_FIRST_COL_CLASS,
    LAYOUT_MANAGER_LAST_COL_CLASS,
} from '__internal/ui/form/form.layout_manager';

export const generateFormItems = function(count) {
    const items = [];
    for(let i = 0; i < count; i += 1) {
        items.push({ dataField: `field${i}` });
    }
    return items;
};

export const assertFormItemsPositionCssClasses = function($container, colCount, assert) {
    const $fieldItems = $container.find(`.${FIELD_ITEM_CLASS}`);
    const itemCount = $fieldItems.length;
    const rowCount = Math.ceil(itemCount / colCount);

    $fieldItems.each((index, element) => {
        const $element = $(element);
        const row = Math.floor(index / colCount);
        const col = index % colCount;

        assert.strictEqual($element.hasClass(LAYOUT_MANAGER_FIRST_ROW_CLASS), row === 0, `item ${index}: should ${row === 0 ? '' : 'not '}have dx-first-row`);
        assert.strictEqual($element.hasClass(LAYOUT_MANAGER_LAST_ROW_CLASS), row === rowCount - 1, `item ${index}: should ${row === rowCount - 1 ? '' : 'not '}have dx-last-row`);
        assert.strictEqual($element.hasClass(LAYOUT_MANAGER_FIRST_COL_CLASS), col === 0, `item ${index}: should ${col === 0 ? '' : 'not '}have dx-first-col`);
        assert.strictEqual($element.hasClass(LAYOUT_MANAGER_LAST_COL_CLASS), col === colCount - 1, `item ${index}: should ${col === colCount - 1 ? '' : 'not '}have dx-last-col`);
        assert.strictEqual($element.hasClass(`${FORM_FIELD_ITEM_COL_CLASS}${col}`), true, `item ${index}: should have dx-col-${col}`);
    });
};
