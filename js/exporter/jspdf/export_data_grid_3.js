import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getRowsInitialData } from './row_initial_data';
import { getRowsSizedData } from './row_sized_data';
import { getPdfTableData } from './pdf_table_data';
import { getPdfPageData } from './pdf_page_data';

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
            const rowsInitialData = getRowsInitialData(dataProvider, dataGrid, options);
            const rowsSizedInfo = getRowsSizedData(rowsInitialData, options);
            const pdfTables = getPdfTableData(rowsSizedInfo, options);
            const pdfPages = getPdfPageData(pdfTables, options);

            pdfPages.forEach(page => {
                page.draw(doc);
            });
            resolve();
        });
    });
}

export { exportDataGrid };
