import 'generic_light.css!';
import $ from 'jquery';
import 'ui/form';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

const setupFormWithAi = (config) => {
    return $('#form').dxForm({
        aiIntegration: {},
        items: [{ itemType: 'simple', dataField: 'name' }],
        ...config,
    }).dxForm('instance');
};

QUnit.module('aiIntegration option', () => {
    QUnit.test('update aiIntegration cancels active request and calls new one with same params', function(assert) {
        const abortSpy = sinon.spy();
        const smartPaste1 = sinon.stub().returns(abortSpy);
        const smartPaste2 = sinon.stub().returns(() => {});
        const initialAIIntegration = { smartPaste: smartPaste1 };
        const newAIIntegration = { smartPaste: smartPaste2 };

        const form = setupFormWithAi({ aiIntegration: initialAIIntegration });
        form.smartPaste('test');

        assert.strictEqual(smartPaste1.calledOnce, true, 'initial smartPaste called');

        form.option({ aiIntegration: newAIIntegration });

        assert.strictEqual(abortSpy.calledOnce, true, 'previous request aborted');
        assert.strictEqual(smartPaste1.calledOnce, true, 'initial smartPaste is not called again');
        assert.strictEqual(smartPaste2.calledOnce, true, 'new smartPaste invoked after update');
        assert.deepEqual(smartPaste1.getCall(0).args, smartPaste1.getCall(0).args, 'new smartPaste invoked with same text and fields data');
    });
});

QUnit.module('SmartPaste', () => {
    QUnit.module('ItemsRuntimeInfo.getItemsForDataExtraction method', () => {
        QUnit.test('Returns empty array when no items exist', function(assert) {
            const form = setupFormWithAi({ items: [] });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            assert.deepEqual(dataItems, [], 'Should return empty array when no items are present');
        });

        QUnit.test('Returns only simple items with defined dataField option', function(assert) {
            const items = [
                { dataField: 'name' },
                { itemType: 'group', items: [{ itemType: 'simple', dataField: 'email' }] },
                { itemType: 'tabbed', tabs: [{ items: [{ itemType: 'simple', dataField: 'age' }] }] },
                { itemType: 'empty' },
                { itemType: 'simple' },
                { itemType: 'button' },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { itemType: 'simple', dataField: 'email' },
                { itemType: 'simple', dataField: 'age' },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should return only simple items with defined dataField');
        });

        QUnit.test('Excludes items inside inactive tab items', function(assert) {
            const items = [{
                itemType: 'tabbed',
                tabs: [
                    { items: [{ itemType: 'simple', dataField: 'email' }] },
                    { items: [{ itemType: 'simple', dataField: 'phone' }] },
                ],
            }];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { itemType: 'simple', dataField: 'email' },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items inside inactive tab items');
        });

        QUnit.test('Excludes items inside nested inactive tab items', function(assert) {
            const items = [{
                itemType: 'tabbed',
                tabs: [{
                    items: [
                        { dataField: 'test' },
                        {
                            itemType: 'tabbed',
                            tabs: [
                                { items: [{ dataField: 'Mobile Phone' }] },
                                { items: [{ dataField: 'Work Phone' }] }],
                        }],
                }, {
                    items: [{ dataField: 'Email' }],
                }],
            }];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'test' },
                { dataField: 'Mobile Phone' },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items inside nested inactive tab items');
        });

        QUnit.test('Excludes items with visible=false', function(assert) {
            const items = [
                { dataField: 'name' },
                { dataField: 'nonVisibleItem', visible: false },
                {
                    itemType: 'group',
                    items: [
                        { itemType: 'simple', dataField: 'email' },
                        { itemType: 'simple', dataField: 'phone', visible: false },
                    ] },
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [
                            { itemType: 'simple', dataField: 'age' },
                            { itemType: 'simple', dataField: 'birthdate', visible: false },
                        ]
                    }]
                },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { itemType: 'simple', dataField: 'email' },
                { itemType: 'simple', dataField: 'age' },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude invisible items');
        });

        QUnit.test('Excludes items inside groups with visible=false', function(assert) {
            const items = [
                { dataField: 'name' },
                {
                    itemType: 'group',
                    visible: false,
                    items: [{ itemType: 'simple', dataField: 'email' }]
                },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [{ dataField: 'name' }];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items inside invisible groups');
        });

        QUnit.test('Excludes items inside tabs with visible=false', function(assert) {
            const items = [
                { dataField: 'name' },
                {
                    itemType: 'tabbed',
                    visible: false,
                    tabs: [{ items: [{ itemType: 'simple', dataField: 'age' }] }]
                },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [{ dataField: 'name' }];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items inside invisible tab items');
        });

        QUnit.test('Excludes items with editorOptions.visible=false', function(assert) {
            const items = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { visible: true } },
                { dataField: 'birthdate', editorOptions: { visible: false } },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { visible: true } },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items items with editorOptions.visible=false');
        });

        QUnit.test('Excludes items with editorOptions.readOnly=true', function(assert) {
            const items = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { readOnly: false } },
                { dataField: 'birthdate', editorOptions: { readOnly: true } },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { readOnly: false } },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items items with editorOptions.visible=false');
        });

        QUnit.test('Excludes items with editorOptions.disabled=true', function(assert) {
            const items = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { disabled: false } },
                { dataField: 'birthdate', editorOptions: { disabled: true } },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { dataField: 'surname', editorOptions: { disabled: false } },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items items with editorOptions.visible=false');
        });

        QUnit.test('Excludes items with aiOptions.disabled=true', function(assert) {
            const items = [
                { dataField: 'name' },
                { dataField: 'surname', aiOptions: { disabled: false } },
                { dataField: 'birthdate', aiOptions: { disabled: true } },
            ];
            const form = setupFormWithAi({ items });
            const dataItems = form._itemsRunTimeInfo.getItemsForDataExtraction();

            const expectedDataItems = [
                { dataField: 'name' },
                { dataField: 'surname', aiOptions: { disabled: false } },
            ];

            assert.deepEqual(dataItems, expectedDataItems, 'Should exclude items items with editorOptions.visible=false');
        });
    });

    QUnit.module('Command execution', () => {
        QUnit.test('should call smartPaste command with correct field data', function(assert) {
            const smartPaste = sinon.stub().returns(() => {});
            const aiIntegration = { smartPaste: smartPaste };
            const items = [
                { itemType: 'simple', dataField: 'name' },
                { itemType: 'simple', dataField: 'orderCount', editorType: 'dxNumberBox' },
                { itemType: 'simple', dataField: 'date', editorType: 'dxDateBox', aiOptions: { instruction: 'custom instruction' } },
            ];

            const form = setupFormWithAi({ aiIntegration, items });

            form.smartPaste('test');
            const fields = [
                { name: 'name', format: 'text', instruction: undefined },
                { name: 'orderCount', format: 'numeric value', instruction: undefined },
                { name: 'date', format: 'date in ISO format', instruction: 'custom instruction' },
            ];

            assert.strictEqual(smartPaste.calledOnce, true, 'smartPaste command called');
            assert.deepEqual(smartPaste.getCall(0).args[0].fields, fields, 'smartPaste command called with passed text');
        });

        QUnit.test('should call smartPaste command with passed text', function(assert) {
            const smartPaste = sinon.stub().returns(() => {});
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            form.smartPaste('test');

            assert.strictEqual(smartPaste.calledOnce, true, 'smartPaste command called');
            assert.strictEqual(smartPaste.getCall(0).args[0].text, 'test', 'smartPaste command called with passed text');
        });

        QUnit.test('should call smartPaste command clipboard text if no argument passed', function(assert) {
            if(!navigator.clipboard) {
                assert.ok(true, 'clipboard not supported in this environment');
                return;
            }

            const done = assert.async();
            const expectedClipboardText = 'mocked clipboard content';
            const clipboardReadStub = sinon.stub(navigator.clipboard, 'readText').resolves(expectedClipboardText);

            const smartPaste = sinon.stub().returns(() => {});
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            form.smartPaste().then(() => {
                assert.strictEqual(smartPaste.calledOnce, true, 'smartPaste command called');
                assert.strictEqual(smartPaste.getCall(0).args[0].text, expectedClipboardText, 'smartPaste command called with clipboard text');
                assert.strictEqual(clipboardReadStub.calledOnce, true, 'clipboard.readText was called');

                clipboardReadStub.restore();
                done();
            }).catch((error) => {
                clipboardReadStub.restore();
                assert.ok(false, 'smartPaste failed: ' + error.message);
                done();
            });
        });

        QUnit.test('should handle clipboard read errors gracefully', async function(assert) {
            if(!navigator.clipboard) {
                assert.ok(true, 'clipboard not supported in this environment');
                return;
            }

            const clipboardReadStub = sinon.stub(navigator.clipboard, 'readText').rejects(new Error('Clipboard access denied'));

            const smartPaste = sinon.stub().returns(() => {});
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            try {
                await form.smartPaste();
                assert.ok(false, 'Expected smartPaste to throw an error');
            } catch(error) {
                assert.ok(true, 'smartPaste correctly threw an error when clipboard access failed');
                assert.strictEqual(clipboardReadStub.calledOnce, true, 'clipboard.readText was attempted');
            } finally {
                clipboardReadStub.restore();
            }
        });
    });
});
