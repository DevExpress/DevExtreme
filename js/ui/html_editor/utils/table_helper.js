import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import { camelize } from '../../../core/utils/inflector';


const TABLE_FORMATS = ['table', 'tableHeaderCell'];
const TABLE_OPERATIONS = [
    'insertTable',
    'insertHeaderRow',
    'insertRowAbove',
    'insertRowBelow',
    'insertColumnLeft',
    'insertColumnRight',
    'deleteColumn',
    'deleteRow',
    'deleteTable',
    'cellProperties',
    'tableProperties'
];


function getTableFormats(quill) {
    const tableModule = quill.getModule('table');

    // backward compatibility with an old devextreme-quill packages
    return tableModule?.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}

function hasEmbedContent(module, selection) {
    return !!selection && module.quill.getText(selection).trim().length < selection.length;
}

function unfixTableWidth($table, tableBlot) {
    const unfixValue = 'initial';
    if(tableBlot) {
        tableBlot.format('tableWidth', unfixValue);
    } else {
        $table.css('width', unfixValue);
    }
}

function getColumnElements($table, index = 0) {
    return $table.find('tr').eq(index).find('th, td');
}

function getAutoSizedElements($table, direction = 'horizontal') {
    const result = [];
    const isHorizontal = direction === 'horizontal';
    const $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);

    $lineElements.each((index, element) => {
        const $element = $(element);
        if($element.get(0).style[isHorizontal ? 'width' : 'height'] === '') {
            result.push($element);
        }
    });

    return result;
}

function setLineElementsFormat(module, { elements, property, value }) {
    each(elements, (i, element) => {
        const cellBlot = module.quill.scroll.find(element);
        const fullPropertyName = `cell${camelize(property, true)}`;
        cellBlot?.format(fullPropertyName, value + 'px');
    });
}

function getLineElements($table, index, direction = 'horizontal') {
    return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}

function getRowElements($table, index = 0) {
    return $table.find(`th:nth-child(${(1 + index)}), td:nth-child(${(1 + index)})`);
}

function getTableOperationHandler(quill, operationName, ...rest) {
    return () => {
        const table = quill.getModule('table');

        if(!table) {
            return;
        }
        quill.focus();
        return table[operationName](...rest);
    };
}

export {
    TABLE_OPERATIONS,
    getTableFormats,
    getTableOperationHandler,
    unfixTableWidth,
    getColumnElements,
    getAutoSizedElements,
    setLineElementsFormat,
    getLineElements,
    getRowElements,
    hasEmbedContent
};
