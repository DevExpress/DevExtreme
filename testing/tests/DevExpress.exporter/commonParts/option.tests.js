import DataGrid from 'ui/data_grid/ui.data_grid';

export function runCommonOptionTests(_getFullOptions, getComponent) {
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
                _getFullOptions({ component, worksheet: this.worksheet });
            } catch(e) {
                errorMessage = e.message;
            }
            assert.strictEqual(errorMessage, `The "component" field must contain a ${getComponent().NAME.substring(2)} instance.`, 'Exception was thrown');
        });
    });

    QUnit.test('selectedRowsOnly', function(assert) {
        if(getComponent() instanceof DataGrid) {
            const component = getComponent();

            assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument }).selectedRowsOnly, false, 'no member');
            assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, selectedRowsOnly: undefined }).selectedRowsOnly, false, 'undefined');
            assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, selectedRowsOnly: null }).selectedRowsOnly, false, 'null');

            assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, selectedRowsOnly: false }).selectedRowsOnly, false, 'false');
            assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, selectedRowsOnly: true }).selectedRowsOnly, true, 'true');
        }
    });

    QUnit.test('keepColumnWidths', function(assert) {
        const component = getComponent();

        assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument }).keepColumnWidths, true, 'no member');
        assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, keepColumnWidths: undefined }).keepColumnWidths, true, 'undefined');
        assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, keepColumnWidths: null }).keepColumnWidths, true, 'null');

        assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, keepColumnWidths: false }).keepColumnWidths, false, 'false');
        assert.deepEqual(_getFullOptions({ component, jsPDFDocument: this.jsPDFDocument, keepColumnWidths: true }).keepColumnWidths, true, 'true');
    });
}
