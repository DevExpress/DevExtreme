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
    'deleteTable'
];

function getTableFormats(quill) {
    const tableModule = quill.getModule('table');
    return tableModule?.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS; // backward compatibility with previous devextreme-quill versions
}

export {
    TABLE_OPERATIONS,
    getTableFormats
};
