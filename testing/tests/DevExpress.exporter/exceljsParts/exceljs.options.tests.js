import messageLocalization from 'localization/message';
import { runCommonOptionTests } from '../commonParts/options.tests.js';
import DataGrid from 'ui/data_grid/ui.data_grid';

const ExcelJSOptionTests = {
    runTests(moduleConfig, _getFullOptions, getComponent) {
        QUnit.module('_getFullOptions', moduleConfig, () => {
            runCommonOptionTests(_getFullOptions, getComponent, 'worksheet');

            [[], '1', 1, undefined, null].forEach((worksheet) => {
                QUnit.test(`worksheet: ${JSON.stringify(worksheet)}`, function(assert) {
                    let errorMessage;
                    try {
                        _getFullOptions({ component: getComponent(), worksheet: worksheet });
                    } catch(e) {
                        errorMessage = e.message;
                    } finally {
                        assert.strictEqual(errorMessage, 'The "worksheet" field must contain an object.', 'Exception was thrown');
                    }
                });
            });

            QUnit.test('topLeftCell', function(assert) {
                const component = getComponent();

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet }).topLeftCell, { row: 1, column: 1 }, 'no member');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: undefined }).topLeftCell, { row: 1, column: 1 }, 'undefined');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: null }).topLeftCell, { row: 1, column: 1 }, 'null');

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: { row: 2, column: 3 } }).topLeftCell, { row: 2, column: 3 }, '{ row: 2, column: 3 }');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: 'A1' }).topLeftCell, { row: 1, column: 1 }, 'A1');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: 'D38' }).topLeftCell, { row: 38, column: 4 }, 'D38');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, topLeftCell: 'AD8' }).topLeftCell, { row: 8, column: 30 }, 'AD8');

                let errorMessage;
                try {
                    _getFullOptions({ component, worksheet: this.worksheet, topLeftCell: 'AA' });
                } catch(e) {
                    errorMessage = e.message;
                } finally {
                    assert.strictEqual(errorMessage, 'Invalid Address: AA', 'Exception was thrown');
                }
            });

            QUnit.test('loadPanel', function(assert) {
                const component = getComponent();
                const defaultLoadPanel = { enabled: true, text: messageLocalization.format('dxDataGrid-exporting') };

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet }).loadPanel, defaultLoadPanel, 'no member');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: undefined }).loadPanel, defaultLoadPanel, 'undefined');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: null }).loadPanel, defaultLoadPanel, 'null');

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: {} }).loadPanel, { enabled: true, text: defaultLoadPanel.text }, 'loadPanel: {}');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: { enabled: true } }).loadPanel, { enabled: true, text: defaultLoadPanel.text }, '{ enabled: true } }');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: { text: 'my text' } }).loadPanel, { enabled: true, text: 'my text' }, '{ text: my text }');

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: { enabled: false } }).loadPanel, { enabled: false, text: defaultLoadPanel.text }, '{ enabled: false } }');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, loadPanel: { enabled: false, text: 'my text' } }).loadPanel, { enabled: false, text: 'my text' }, '{ enabled: false, text: my text } }');
            });

            QUnit.test('autoFilterEnabled', function(assert) {
                if(!(getComponent() instanceof DataGrid)) {
                    assert.ok(true, 'The test relevant for DataGrid widget only');
                    return;
                }

                const component = getComponent();

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet }).autoFilterEnabled, false, 'no member');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, autoFilterEnabled: undefined }).autoFilterEnabled, false, 'undefined');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, autoFilterEnabled: null }).autoFilterEnabled, false, 'null');

                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, autoFilterEnabled: false }).autoFilterEnabled, false, 'false');
                assert.deepEqual(_getFullOptions({ component, worksheet: this.worksheet, autoFilterEnabled: true }).autoFilterEnabled, true, 'true');
            });
        });
    }
};

export { ExcelJSOptionTests };
