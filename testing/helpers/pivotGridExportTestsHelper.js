import 'ui/pivot_grid/ui.pivot_grid';

import $ from 'jquery';
import { isDefined } from '../../../js/core/utils/type.js';
import { excel as excelCreator } from 'exporter';
import exportTestsHelper from './exportTestsHelper.js';

const pivotGridExportTestsHelper = Object.create(exportTestsHelper);

pivotGridExportTestsHelper.runGeneralTest = function(assert, options, { styles = undefined, worksheet = undefined, sharedStrings = undefined, data = undefined } = {}) {
    const that = this;
    const done = assert.async();

    options.loadingTimeout = undefined;
    options.export = options.export || {};
    options.export.ignoreExcelErrors = false;
    if(!isDefined(styles)) {
        options.export.customizeExcelCell = e => e.clearStyle();
    }

    options.onFileSaving = e => {
        const zipMock = that.getLastCreatedJSZipInstance();

        if(styles !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.STYLE_FILE_NAME).content, styles, 'styles');
        }
        if(worksheet !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).folder(excelCreator.__internals.WORKSHEETS_FOLDER).file(excelCreator.__internals.WORKSHEET_FILE_NAME).content, worksheet, 'worksheet');
        }
        if(sharedStrings !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.SHAREDSTRING_FILE_NAME).content, sharedStrings, 'sharedStrings');
        }
        if(data !== undefined) {
            assert.deepEqual(e.data, data, 'onFileSaving event data');
        }

        done();
        e.cancel = true;
    };
    const pivot = $('#pivotGrid').dxPivotGrid(options).dxPivotGrid('instance');
    pivot.exportToExcel();
};

export default pivotGridExportTestsHelper;
