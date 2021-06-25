import { isDefined } from '../../core/utils/type';

const DataGridRowExporter = {
    createRowInfo: function({ dataProvider, rowIndex, prevRowInfo }) {
        const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
        let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
        if(rowType === 'groupFooter' && prevRowInfo?.rowType === 'groupFooter') {
            indentLevel = prevRowInfo.indentLevel - 1;
        }
        const startNewTableWithIndent = (prevRowInfo?.indentLevel !== undefined) && prevRowInfo.indentLevel !== indentLevel;
        const columns = dataProvider.getColumns();

        const rowInfo = {
            rowType: rowType,
            indentLevel: indentLevel,
            startNewTableWithIndent,
            cellsInfo: [],
            rowIndex
        };

        fillRowCellsInfo({ rowInfo, dataProvider, columns });

        return rowInfo;
    },

    createPdfCell: function(cellInfo) {
        return {
            text: cellInfo.text,
            rowSpan: cellInfo.rowSpan,
            colSpan: cellInfo.colSpan,
            drawLeftBorder: cellInfo.drawLeftBorder,
            drawRightBorder: cellInfo.drawRightBorder,
        };
    },

};

function createCellInfo({ rowInfo, dataProvider, cellIndex }) {
    const cellData = dataProvider.getCellData(rowInfo.rowIndex, cellIndex, true);
    const cellInfo = {
        value: cellData.value,
        text: cellData.value
    };

    if(rowInfo.rowType === 'header') {
        const cellMerging = dataProvider.getCellMerging(rowInfo.rowIndex, cellIndex);
        if(cellMerging && cellMerging.rowspan > 0) {
            cellInfo.rowSpan = cellMerging.rowspan;
        }
        if(cellMerging && cellMerging.colspan > 0) {
            cellInfo.colSpan = cellMerging.colspan;
        }
    } else if(rowInfo.rowType === 'group') {
        cellInfo.drawLeftBorder = false;
        cellInfo.drawRightBorder = false;

        if(cellIndex > 0) {
            const isEmptyCellsExceptFirst = rowInfo.cellsInfo.slice(1).reduce(
                (accumulate, pdfCell) => { return accumulate && !isDefined(pdfCell.text); },
                true);
            if(!isDefined(cellInfo.text) && isEmptyCellsExceptFirst) {
                for(let i = 0; i < rowInfo.cellsInfo.length; i++) {
                    rowInfo.cellsInfo[i].colSpan = rowInfo.cellsInfo.length;
                }
                cellInfo.colSpan = rowInfo.cellsInfo.length;
            }
        }
    }
    return cellInfo;
}

function fillRowCellsInfo({ rowInfo, dataProvider, columns }) {
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        rowInfo.cellsInfo.push(createCellInfo({ rowInfo, dataProvider, cellIndex }));
    }

    if(rowInfo.rowType === 'group') {
        rowInfo.cellsInfo[0].drawLeftBorder = true;

        if(rowInfo.cellsInfo[0].colSpan === rowInfo.cellsInfo.length - 1) {
            rowInfo.cellsInfo[0].drawRightBorder = true;
        }

        const lastCell = rowInfo.cellsInfo[rowInfo.cellsInfo.length - 1];
        if(!isDefined(lastCell.colSpan)) {
            lastCell.drawRightBorder = true;
        }
    }
}

export { DataGridRowExporter };
