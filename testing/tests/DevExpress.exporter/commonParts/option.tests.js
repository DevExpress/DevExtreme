import DataGrid from 'ui/data_grid/ui.data_grid';
import { extend } from 'core/utils/extend';

export function runCommonOptionTests(_getFullOptions, getComponent, document) {
    [[], '1', 1, undefined, null].forEach((options) => {
        QUnit.test(`options: ${JSON.stringify(options)}`, function(assert) {
            let errorMessage;
            try {
                _getFullOptions(options);
            } catch(e) {
                errorMessage = e.message;
            } finally {
                assert.strictEqual(errorMessage, `The "export${getComponent().NAME.substring(2)}" method requires a configuration object.`, 'Exception was thrown');
            }
        });
    });

    [{}, [], '1', 1, undefined, null].forEach((component) => {
        QUnit.test(`component: ${JSON.stringify(component)}`, function(assert) {
            let errorMessage;
            try {
                const initialConfig = { component };
                initialConfig[document] = this[document];

                _getFullOptions(initialConfig);
            } catch(e) {
                errorMessage = e.message;
            }
            assert.strictEqual(errorMessage, `The "component" field must contain a ${getComponent().NAME.substring(2)} instance.`, 'Exception was thrown');
        });
    });

    QUnit.test('selectedRowsOnly', function(assert) {
        if(!(getComponent() instanceof DataGrid)) {
            assert.ok(true, 'The test relevant for DataGrid widget only');
            return;
        }

        const initialConfig = { component: getComponent() };
        initialConfig[document] = this[document];

        assert.deepEqual(_getFullOptions(initialConfig).selectedRowsOnly, false, 'no member');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { selectedRowsOnly: undefined })).selectedRowsOnly, false, 'undefined');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { selectedRowsOnly: null })).selectedRowsOnly, false, 'null');

        assert.deepEqual(_getFullOptions(extend(initialConfig, { selectedRowsOnly: false })).selectedRowsOnly, false, 'false');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { selectedRowsOnly: true })).selectedRowsOnly, true, 'true');
    });

    QUnit.test('keepColumnWidths', function(assert) {
        const initialConfig = { component: getComponent() };
        initialConfig[document] = this[document];

        assert.deepEqual(_getFullOptions(initialConfig).keepColumnWidths, true, 'no member');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { keepColumnWidths: undefined })).keepColumnWidths, true, 'undefined');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { keepColumnWidths: null })).keepColumnWidths, true, 'null');

        assert.deepEqual(_getFullOptions(extend(initialConfig, { keepColumnWidths: false })).keepColumnWidths, false, 'false');
        assert.deepEqual(_getFullOptions(extend(initialConfig, { keepColumnWidths: true })).keepColumnWidths, true, 'true');
    });
}
