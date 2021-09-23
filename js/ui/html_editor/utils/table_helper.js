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
    getTableOperationHandler
};
