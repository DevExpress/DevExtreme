import { isDefined } from '../../../core/utils/type';

// Returns IPdfRowInfo[]
// [
//    {
//      rowType, - readonly
//      rowIndex, - readonly
//      indentLevel, - readonly
//      cells: [ - readonly
//        {
//          gridCell, - readonly
//          colSpan, - readonly (for internal use/hide from api/useless???)
//          rowSpan, - readonly (for internal use/hide from api/useless???)
//          text,
//          wordWrapEnabled,
//        }
//      ],
//    }
// ]

function generateRowsInfo(dataProvider, dataGrid, headerBackgroundColor) {
    const result = [];

    const rowsCount = dataProvider.getRowsCount();
    const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
    const columns = dataProvider.getColumns();

    for(let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
        let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
        const previousRow = result[rowIndex - 1];
        if(rowType === 'groupFooter' && previousRow?.rowType === 'groupFooter') {
            indentLevel = previousRow.indentLevel - 1;
        }

        result.push({
            rowType: rowType,
            indentLevel,
            cells: generateRowCells({
                dataProvider,
                rowIndex,
                wordWrapEnabled,
                columns,
                rowType,
                colCount: columns.length,
                backgroundColor: (rowType === 'header') ? headerBackgroundColor : undefined
            }),
            rowIndex,
        });
    }

    return result;
}

function generateRowCells({ dataProvider, rowIndex, wordWrapEnabled, colCount, rowType, backgroundColor }) {
    const result = [];
    for(let cellIndex = 0; cellIndex < colCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: {
                text: cellData.value,
                wordWrapEnabled,
                backgroundColor,
                _rect: {}
            }
        };

        if(rowType === 'header') {
            const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
            if(cellMerging && cellMerging.rowspan > 0) {
                cellInfo.rowSpan = cellMerging.rowspan;
            }
            if(cellMerging && cellMerging.colspan > 0) {
                cellInfo.colSpan = cellMerging.colspan;
            }
        } else if(rowType === 'group') {
            cellInfo.pdfCell.drawLeftBorder = cellIndex === 0;
            cellInfo.pdfCell.drawRightBorder = cellIndex === colCount - 1;

            if(cellIndex > 0) {
                const isEmptyCellsExceptFirst = result.slice(1).reduce(
                    (accumulate, cellInfo) => { return accumulate && !isDefined(cellInfo.pdfCell.text); },
                    true);
                if(!isDefined(cellInfo.pdfCell.text) && isEmptyCellsExceptFirst) {
                    result[0].pdfCell.drawRightBorder = true;
                    for(let i = 0; i < result.length; i++) {
                        result[i].colSpan = result.length;
                    }
                    cellInfo.colSpan = result.length;
                }
            }
        }

        result.push(cellInfo);
    }
    return result;
}

export { generateRowsInfo };
