import { runCommonOptionTests } from '../commonParts/options.tests.js';

const JSPdfOptionTests = {
    runTests(moduleConfig, _getFullOptions, getComponent) {
        QUnit.module('_getFullOptions', moduleConfig, () => {
            runCommonOptionTests(_getFullOptions, getComponent, 'jsPDFDocument');

            [[], '1', 1, undefined, null].forEach((jsPDFDocument) => {
                QUnit.test(`jsPDFDocument: ${JSON.stringify(jsPDFDocument)}`, function(assert) {
                    let errorMessage;
                    try {
                        _getFullOptions({ component: getComponent(), jsPDFDocument });
                    } catch(e) {
                        errorMessage = e.message;
                    } finally {
                        assert.strictEqual(errorMessage, 'The "jsPDFDocument" field must contain a jsPDF instance.', 'Exception was thrown');
                    }
                });
            });

            QUnit.test('jsPDFDocument.autoTable: {}', function(assert) {
                let errorMessage;
                try {
                    _getFullOptions({ component: getComponent(), jsPDFDocument: {} });
                } catch(e) {
                    errorMessage = e.message;
                } finally {
                    assert.strictEqual(errorMessage, `The "export${getComponent().NAME.substring(2)}" method requires a autoTable plugin for jsPDF object.`);
                }
            });

            [[], '1', 1].forEach((autoTableOptions) => {
                QUnit.test(`autoTableOptions: ${JSON.stringify(autoTableOptions)}`, function(assert) {
                    let errorMessage;
                    try {
                        _getFullOptions({ component: getComponent(), jsPDFDocument: this.jsPDFDocument, autoTableOptions });
                    } catch(e) {
                        errorMessage = e.message;
                    } finally {
                        assert.strictEqual(errorMessage, 'The "autoTableOptions" option must be of object type.');
                    }
                });
            });

            [undefined, null].forEach((autoTableOptions) => {
                QUnit.test(`Get defaultAutoTableOptions, autoTableOptions: ${JSON.stringify(autoTableOptions)}`, function(assert) {
                    const defaultAutoTableOptions = {
                        theme: 'plain',
                        tableLineColor: 149,
                        tableLineWidth: 0.1,
                        styles: {
                            textColor: 51,
                            lineColor: 149,
                            lineWidth: 0
                        },
                        columnStyles: {},
                        headStyles: {
                            fontStyle: 'normal',
                            textColor: 149,
                            lineWidth: 0.1
                        },
                        bodyStyles: {
                            lineWidth: 0.1
                        },
                        head: [],
                        body: []
                    };

                    const { autoTableOptions } = _getFullOptions({ component: getComponent(), jsPDFDocument: this.jsPDFDocument, autoTableOptions });

                    assert.deepEqual(autoTableOptions, defaultAutoTableOptions, 'autoTableOptions');
                });
            });

            QUnit.test('Extend customer autoTableOptions, autoTableOptions: { tableWidth: 250, columnStyles: { 0: { cellWidth: 100 } } }', function(assert) {
                const expectedAutoTableOptions = {
                    tableWidth: 250,
                    columnStyles: { 0: { cellWidth: 100 } },
                    theme: 'plain',
                    tableLineColor: 149,
                    tableLineWidth: 0.1,
                    styles: {
                        textColor: 51,
                        lineColor: 149,
                        lineWidth: 0
                    },
                    headStyles: {
                        fontStyle: 'normal',
                        textColor: 149,
                        lineWidth: 0.1
                    },
                    bodyStyles: {
                        lineWidth: 0.1
                    },
                    head: [],
                    body: []
                };

                const { autoTableOptions } = _getFullOptions({ component: getComponent(), jsPDFDocument: this.jsPDFDocument, autoTableOptions: { tableWidth: 250, columnStyles: { 0: { cellWidth: 100 } } } });

                assert.deepEqual(autoTableOptions, expectedAutoTableOptions, 'autoTableOptions');
            });
        });
    }
};

export { JSPdfOptionTests };
