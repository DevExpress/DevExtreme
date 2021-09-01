import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getRows, calculateWidths, calculateHeights, calculateCoordinates } from './row_utils';
import { drawRows } from './draw_utils';

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
            calculateWidths(doc, rows, options);
            calculateHeights(doc, rows, options);
            calculateCoordinates(doc, rows, options);

            drawRows(doc, rows, options);
            resolve();
        });
    });
}

export { exportDataGrid };
