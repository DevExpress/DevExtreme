// Returns
// [
//    {
//      rowType,
//      cells: [
//        { gridCell, text, wordWrapEnabled }
//      ],
//      rowIndex
//    }
// ]

function generateRows(dataProvider, dataGrid) {
    const rows = [];

    const rowsCount = dataProvider.getRowsCount();
    const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
    const columns = dataProvider.getColumns();

    for(let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const previousRow = (rowIndex > 1) ? rows[rowIndex - 1] : null;

        const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
        let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
        if(rowType === 'groupFooter' && previousRow?.rowType === 'groupFooter') {
            indentLevel = previousRow.indentLevel - 1;
        }

        const currentRow = {
            rowType: rowType,
            cells: generateIndentCell(indentLevel).concat(generateRowCells({ dataProvider, rowIndex, wordWrapEnabled, columns })),
            rowIndex
        };

        rows.push(currentRow);
    }

    return rows;
}

function generateIndentCell() {
    return {
        isIndentCell: true,
        gridCell: null,
        pdfCell: { text: null }
    };
}

function generateRowCells({ dataProvider, rowIndex, wordWrapEnabled, columns }) {
    const result = [];
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: { text: cellData.value, wordWrapEnabled }
        };
        result.push(cellInfo);
    }
    return result;
}

export { generateRows };
