import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { PdfGrid } from './pdf_grid';

function _getFullOptions(options) {
    const fullOptions = extend({}, options);
    if(!isDefined(fullOptions.topLeft)) {
        throw 'options.topLeft is required';
    }
    if(!isDefined(fullOptions.indent)) {
        fullOptions.indent = 10;
    }

    return fullOptions;
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(options));

    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const columns = dataProvider.getColumns();
            const pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);
            const rowsGroups = [];

            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);

            const dataRowsCount = dataProvider.getRowsCount();

            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
                let groupLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
                if(rowsGroups.length > 0) {
                    const prevRowGroup = rowsGroups[rowsGroups.length - 1];
                    if(prevRowGroup.rowType === 'groupFooter') {
                        groupLevel = prevRowGroup.groupLevel - 1;
                    }
                }

                const currentRow = [];
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };

                    if(rowType === 'header') {
                        const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
                        if(cellMerging && cellMerging.rowspan > 0) {
                            pdfCell.rowSpan = cellMerging.rowspan;
                        }
                        if(cellMerging && cellMerging.colspan > 0) {
                            pdfCell.colSpan = cellMerging.colspan;
                        }
                    } else if(rowType === 'group') {
                        pdfCell.drawLeftBorder = false;
                        pdfCell.drawRightBorder = false;

                        if(cellIndex > 0) {
                            const isEmptyCellsExceptFirst = currentRow.slice(1).reduce(
                                (accumulate, pdfCell) => { return accumulate && !isDefined(pdfCell.text); },
                                true);
                            if(!isDefined(pdfCell.text) && isEmptyCellsExceptFirst) {
                                for(let i = 0; i < currentRow.length; i++) {
                                    currentRow[i].colSpan = currentRow.length;
                                }
                                pdfCell.colSpan = currentRow.length;
                            }
                        }
                    }

                    if(options.onCellExporting) {
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    currentRow.push(pdfCell);
                }

                if(rowType === 'group') {
                    currentRow[0].drawLeftBorder = true;

                    if(currentRow[0].colSpan === currentRow.length - 1) {
                        currentRow[0].drawRightBorder = true;
                    }

                    const lastCell = currentRow[currentRow.length - 1];
                    if(!isDefined(lastCell.colSpan)) {
                        lastCell.drawRightBorder = true;
                    }
                }

                rowsGroups.push({ rowType, groupLevel });
                const startNewTableWithIndent = rowsGroups.length >= 2 && rowsGroups[rowsGroups.length - 1].groupLevel !== rowsGroups[rowsGroups.length - 2].groupLevel;
                if(startNewTableWithIndent) {
                    const indent = rowsGroups[rowsGroups.length - 1].groupLevel * options.indent;
                    const prevTable = pdfGrid._currentHorizontalTables[0];
                    const firstColumnWidth = options.columnWidths[0] - indent;
                    const tableTopLeft = {
                        x: options.topLeft.x + indent,
                        y: prevTable.rect.y + prevTable.rect.h
                    };
                    pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, null, null, firstColumnWidth);
                }

                let rowHeight = null; // TODO: Default Value
                if(options.onRowExporting) {
                    const args = { drawNewTableFromThisRow: {}, rowCells: currentRow };
                    options.onRowExporting(args);
                    const { startNewTable, addPage, tableTopLeft, splitToTablesByColumns } = args.drawNewTableFromThisRow;
                    if(startNewTable === true) {
                        pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, addPage === true, splitToTablesByColumns);
                    }

                    if(isDefined(args.rowHeight)) {
                        rowHeight = args.rowHeight;
                    }
                }

                pdfGrid.addRow(currentRow, rowHeight);
            }

            pdfGrid.mergeCellsBySpanAttributes();

            pdfGrid.drawTo(doc);
            resolve();
        });
    });
}

export { exportDataGrid };
