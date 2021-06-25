import { isDefined } from '../../core/utils/type';

const DataGridRowExporter = {
    createRowInfo: function({ dataProvider, rowIndex, prevRowInfo }) {
        const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
        let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
        if(rowType === 'groupFooter' && prevRowInfo?.rowType === 'groupFooter') {
            indentLevel = prevRowInfo.indentLevel - 1;
        }
        const startNewTableWithIndent = (prevRowInfo?.indentLevel !== undefined) && prevRowInfo.indentLevel !== indentLevel;

        return {
            rowType: rowType,
            indentLevel: indentLevel,
            startNewTableWithIndent,
            pdfCells: []
        };
    },

    updatePdfCells: function(rowInfo) {
        if(rowInfo.rowType === 'group') {
            rowInfo.pdfCells[0].drawLeftBorder = true;

            if(rowInfo.pdfCells[0].colSpan === rowInfo.pdfCells.length - 1) {
                rowInfo.pdfCells[0].drawRightBorder = true;
            }

            const lastCell = rowInfo.pdfCells[rowInfo.pdfCells.length - 1];
            if(!isDefined(lastCell.colSpan)) {
                lastCell.drawRightBorder = true;
            }
        }
    },

    createPdfCell: function({ targetRowInfo, dataProvider, rowIndex, cellIndex, value }) {
        const pdfCell = {
            text: value
        };

        if(targetRowInfo.rowType === 'header') {
            const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
            if(cellMerging && cellMerging.rowspan > 0) {
                pdfCell.rowSpan = cellMerging.rowspan;
            }
            if(cellMerging && cellMerging.colspan > 0) {
                pdfCell.colSpan = cellMerging.colspan;
            }
        } else if(targetRowInfo.rowType === 'group') {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;

            if(cellIndex > 0) {
                const isEmptyCellsExceptFirst = targetRowInfo.pdfCells.slice(1).reduce(
                    (accumulate, pdfCell) => { return accumulate && !isDefined(pdfCell.text); },
                    true);
                if(!isDefined(pdfCell.text) && isEmptyCellsExceptFirst) {
                    for(let i = 0; i < targetRowInfo.pdfCells.length; i++) {
                        targetRowInfo.pdfCells[i].colSpan = targetRowInfo.pdfCells.length;
                    }
                    pdfCell.colSpan = targetRowInfo.pdfCells.length;
                }
            }
        }
        return pdfCell;
    },

};

export { DataGridRowExporter };
