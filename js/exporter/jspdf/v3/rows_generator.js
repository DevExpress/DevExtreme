import { isDefined } from '../../../core/utils/type';

// Returns IPdfRowInfo[]
// [
//    {
//      rowType, - readonly
//      rowIndex, - readonly
//      indentLevel, - readonly
//      cells: [ - readonly
//        {
//          colSpan, - readonly (for internal use/hide from api/useless???)
//          rowSpan, - readonly (for internal use/hide from api/useless???)
//          gridCell, - readonly
//          pdfCell : {
//              text,
//              textColor: '#0000ff', // TODO: specify color format for docs
//              backgroundColor: '#0000ff', // TODO: specify color format for docs
//              verticalAlign: 'top' | 'bottom' | 'middle | undefined. Default value is middle
//              horizontalAlign: 'left' | 'right' | 'center' | undefined. Default value is left
//              wordWrapEnabled, // true | false. Default value is inherited from grid props,
//              drawRightBorder,
//              drawLeftBorder
//              drawTopBorder
//              drawBottomBorder
//          }
//        }
//      ],
//    }
// ]

function generateRowsInfo(dataProvider, wordWrapEnabled, rtlEnabled, headerBackgroundColor) {
    const result = [];

    const rowsCount = dataProvider.getRowsCount();
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
                rtlEnabled,
                columns,
                rowType,
                colCount: columns.length,
                backgroundColor: (rowType === 'header') ? headerBackgroundColor : undefined,
                horizontalAlign: rtlEnabled ? 'right' : 'left'
            }),
            rowIndex,
        });
    }

    return result;
}

function generateRowCells({ dataProvider, rowIndex, wordWrapEnabled, colCount, rowType, backgroundColor, horizontalAlign, rtlEnabled }) {
    const result = [];
    for(let cellIndex = 0; cellIndex < colCount; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: {
                text: cellData.value,
                verticalAlign: 'middle',
                horizontalAlign,
                wordWrapEnabled,
                backgroundColor,
                padding: 0,
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
            const drawLeftBorder = cellIndex === 0;
            const drawRightBorder = cellIndex === colCount - 1;
            cellInfo.pdfCell.drawLeftBorder = rtlEnabled ? drawRightBorder : drawLeftBorder;
            cellInfo.pdfCell.drawRightBorder = rtlEnabled ? drawLeftBorder : drawRightBorder;

            if(cellIndex > 0) {
                const isEmptyCellsExceptFirst = result.slice(1).reduce(
                    (accumulate, cellInfo) => { return accumulate && !isDefined(cellInfo.pdfCell.text); },
                    true);
                if(!isDefined(cellInfo.pdfCell.text) && isEmptyCellsExceptFirst) {
                    if(rtlEnabled) {
                        result[0].pdfCell.drawLeftBorder = true;
                    } else {
                        result[0].pdfCell.drawRightBorder = true;
                    }
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
