import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { setCellWidth, calculateHeights, calculateCoordinates } from './row_utils';
import { generateRows } from './rows_generator';
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
            const rows = generateRows(dataProvider, dataGrid);

            if(options.customizeCell) {
                rows.forEach(row => row.cells.forEach(cell =>
                    // if(!cell.isIndentCell) ?
                    options.customizeCell(cell)
                ));
            }

            setCellWidth(rows, options.columnWidths);

            // TODO setColSpanRowSpan(rows);

            calculateHeights(doc, rows, options);

            // TODO setBorders(rows);

            calculateCoordinates(doc, rows, options);

            const pdfCells = rows.map(row => row.cells.map(cell => cell.pdfCell));
            drawPdfCells(doc, pdfCells);
            resolve();
        });
    });
}

export { exportDataGrid };
