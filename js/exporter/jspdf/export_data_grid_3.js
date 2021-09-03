import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { setCellWidth, calculateHeights, calculateCoordinates } from './row_utils';
import { generateRowsInfo } from './rows_generator';
import { drawPdfCells } from './draw_utils';

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
            const rowsInfo = generateRowsInfo(dataProvider, dataGrid);

            if(options.customizeCell) {
                rowsInfo.forEach(rowInfo => rowInfo.cellsInfo.forEach(cellInfo =>
                    // In 'customizeCell' callback you can change values of these properties:
                    // - e.pdfCell.height - will be used instead of a calculated height
                    // - e.pdfCell.text - the text that will be printed
                    // - e.pdfCell.customDrawContent - will be called at the drawing stage
                    //     you can introduce new properties to 'e.pdfCell' and use them in your callback
                    //     TODO: e.pdfRow + e.gridCell ???
                    // - e.pdfCell.wordWrapEnabled - will be used to split cell text by the width of its cell
                    //
                    // And, you can read values of these properties ('readonly'):
                    // - e.gridCell (TODO: list of properties)
                    // - e.pdfRowInfo (TODO: list of properties)
                    options.customizeCell(cellInfo)
                ));
            }

            setCellWidth(rowsInfo, options.columnWidths);

            // TODO setColSpanRowSpan(rows);

            calculateHeights(doc, rowsInfo, options);

            // TODO setBorders(rows);

            calculateCoordinates(doc, rowsInfo, options);

            const pdfCellsInfo = [].concat.apply([],
                rowsInfo.map(rowInfo => {
                    return rowInfo.cells.map(cellInfo => {
                        return { ...cellInfo.pdfCell, gridCell: cellInfo.gridCell, pdfRowInfo: cellInfo.pdfRowInfo };
                    });
                })
            );
            drawPdfCells(doc, pdfCellsInfo);
            // drawGrid();???
            resolve();
        });
    });
}

export { exportDataGrid };
