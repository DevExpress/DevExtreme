import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import errors from 'core/errors';
import { extend } from 'core/utils/extend';
import { moduleConfig, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('_getFullOptions', moduleConfig, () => {

    [
        [], '1', 1, undefined, null
    ].forEach((jsPDFDocument) => {
        QUnit.test(`jsPDFDocument: ${JSON.stringify(jsPDFDocument)}`, function(assert) {
            let errorMessage;
            try {
                exportDataGrid.__internals._getFullOptions({ component: createDataGrid({}), jsPDFDocument });
            } catch(e) {
                errorMessage = e.message;
            } finally {
                assert.strictEqual(errorMessage, 'The "jsPDFDocument" field must contain a jsPDF instance.', 'Exception was thrown');
            }
        });
    });

    [
        [], '1', 1, {}, undefined, null,
    ].forEach((autoTableOptions) => {
        QUnit.test(`autoTableOptions: ${JSON.stringify(autoTableOptions)}`, function(assert) {
            const stub = sinon.stub(errors, 'log').callsFake(() => {
                assert.deepEqual(errors.log.lastCall.args, [
                    'W0001',
                    'Export',
                    'autoTableOptions',
                    '22.1',
                    'You can migrate from exporting to PDF with the AutoTable plugin to a new export system. See the following topic for more information: https://supportcenter.devexpress.com/ticket/details/t1077554'
                ], 'args of the log method');
            });
            const jsPDFDocument = {
                internal: {
                    scaleFactor: 1
                }
            };

            exportDataGrid.__internals._getFullOptions({ component: createDataGrid({}), jsPDFDocument, autoTableOptions });

            assert.strictEqual(stub.callCount, autoTableOptions === undefined || autoTableOptions === null ? 0 : 1, 'error.log.callCount');
            stub.restore();
        });
    });

    QUnit.test('columnWidths', function(assert) {
        const jsPDFDocument = {
            internal: {
                scaleFactor: 1
            }
        };

        const initialConfig = { jsPDFDocument: jsPDFDocument, component: createDataGrid({}) };
        initialConfig[document] = this[document];

        assert.deepEqual(exportDataGrid.__internals._getFullOptions(initialConfig).columnWidths, [], 'no member');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: undefined })).columnWidths, [], 'undefined');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: null })).columnWidths, [], 'null');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: false })).columnWidths, [], 'false');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: true })).columnWidths, [], 'true');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: '1' })).columnWidths, [], '1');
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: 1 })).columnWidths, [], 1);
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: {} })).columnWidths, [], {});
        assert.deepEqual(exportDataGrid.__internals._getFullOptions(extend(initialConfig, { columnWidths: [123, 456] })).columnWidths, [123, 456], [123, 456]);
    });
});
