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

const defaultStyles = {
    header: { font: { size: 10 }, textColor: '#979797', borderColor: '#979797' },
    group: { font: { style: 'bold', size: 10 }, borderColor: '#979797' },
    data: { font: { size: 10 }, borderColor: '#979797' },
    groupFooter: { font: { style: 'bold', size: 10 }, borderColor: '#979797' },
    totalFooter: { font: { style: 'bold', size: 10 }, borderColor: '#979797' },
};


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
                backgroundColor: (rowType === 'header') ? headerBackgroundColor : undefined
            }),
            rowIndex,
        });
    }

    return result;
}

function generateRowCells({ dataProvider, rowIndex, wordWrapEnabled, columns, rowType, backgroundColor }) {
    const result = [];
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        const style = defaultStyles[rowType];

        const pdfCell = {
            text: cellData.value?.toString(),
            verticalAlign: 'middle',
            horizontalAlign: columns[cellIndex].alignment ?? 'left',
            wordWrapEnabled,
            backgroundColor,
            padding: 5,
            _rect: {}
        };

        const cellInfo = {
            gridCell: cellData.cellSourceData,
            pdfCell: Object.assign({}, pdfCell, style)
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
            cellInfo.pdfCell.drawRightBorder = cellIndex === columns.length - 1;

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
