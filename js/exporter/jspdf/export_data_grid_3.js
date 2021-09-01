import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getRows } from './pdf_rows';
import { drawPDF } from './draw_pdf';

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
            const rows = getRows(doc, dataProvider, dataGrid, options);
            drawPDF(doc, rows, options);
            resolve();
        });
    });
}

export { exportDataGrid };
