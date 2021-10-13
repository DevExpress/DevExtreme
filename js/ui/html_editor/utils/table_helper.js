import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';


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

function unfixTableWidth($table) {
    $table.css('width', 'initial');
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

function setLineElementsStyleValue($lineElements, property, value) {
    each($lineElements, (i, element) => {
        $(element).css(property, value + 'px');
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
    setLineElementsStyleValue,
    getLineElements,
    getRowElements,
    hasEmbedContent
};
