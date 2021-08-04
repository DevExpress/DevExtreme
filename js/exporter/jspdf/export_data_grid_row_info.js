import { isDefined } from '../../core/utils/type';

function createRowInfo({ dataProvider, rowIndex, rowOptions, prevRowInfo }) {
    const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    if(rowType === 'groupFooter' && prevRowInfo?.rowType === 'groupFooter') {
        indentLevel = prevRowInfo.indentLevel - 1;
    }
    const startNewTableWithIndent = (prevRowInfo?.indentLevel !== undefined) && prevRowInfo.indentLevel !== indentLevel;
    const columns = dataProvider.getColumns();

    const rowInfo = {
        rowType: rowType,
        rowHeight: rowOptions.rowHeight,
        indentLevel: indentLevel,
        startNewTableWithIndent,
        cellsInfo: [],
        rowIndex
    };

    _fillRowCellsInfo({ rowInfo, rowOptions, dataProvider, columns });

    return rowInfo;
}

function createPdfCell(cellInfo) {
    return {
        text: cellInfo.text,
        rowSpan: cellInfo.rowSpan,
        colSpan: cellInfo.colSpan,
        drawLeftBorder: cellInfo.drawLeftBorder,
        drawRightBorder: cellInfo.drawRightBorder,
        backgroundColor: cellInfo.backgroundColor,
    };
}

function _createCellInfo({ rowInfo, rowOptions, dataProvider, cellIndex }) {
    const cellData = dataProvider.getCellData(rowInfo.rowIndex, cellIndex, true);
    const cellInfo = {
        gridCell: cellData.cellSourceData,
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
        if(isDefined(rowOptions.headerStyles?.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.headerStyles.backgroundColor;
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
        if(isDefined(rowOptions.groupStyles?.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.groupStyles.backgroundColor;
        }
    } else if(rowInfo.rowType === 'groupFooter' || rowInfo.rowType === 'totalFooter') {
        if(isDefined(rowOptions.totalStyles?.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.totalStyles.backgroundColor;
        }
    }
    return cellInfo;
}

function _fillRowCellsInfo({ rowInfo, rowOptions, dataProvider, columns }) {
    for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        rowInfo.cellsInfo.push(_createCellInfo({ rowInfo, rowOptions, dataProvider, cellIndex }));
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

export { createRowInfo, createPdfCell };
