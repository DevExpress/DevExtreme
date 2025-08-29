import 'generic_light.css!';
import $ from 'jquery';
import 'ui/form';
import { FORM_LOAD_PANEL_CLASS } from '__internal/ui/form/constants';

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
            assert.deepEqual(smartPaste.getCall(0).args[0].fields, fields, 'smartPaste command called with correct fields data');
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

        QUnit.test('update aiIntegration cancels active request and calls new one with same params', function(assert) {
            const abortSpy = sinon.spy();
            const smartPaste = sinon.stub().returns(abortSpy);
            const aiIntegration = { smartPaste: smartPaste };

            const form = setupFormWithAi({ aiIntegration });
            form.smartPaste('test');

            assert.strictEqual(smartPaste.calledOnce, true, 'smartPaste called');

            form.smartPaste('second test');

            assert.strictEqual(abortSpy.calledOnce, true, 'previous request aborted');
            assert.strictEqual(smartPaste.getCalls().length, 2, 'smartPaste is called again');
            assert.deepEqual(smartPaste.getCall(1).args[0].text, 'second test', 'smartPaste invoked with new text');
        });
    });

    QUnit.module('LoadPanel Integration', {
        beforeEach: function() {
            this.clipboardStub = null;

            this.createClipboardStub = function(text = 'test text') {
                if(navigator.clipboard && navigator.clipboard.readText && navigator.clipboard.readText.restore) {
                    navigator.clipboard.readText.restore();
                }

                if(!navigator.clipboard) {
                    Object.defineProperty(navigator, 'clipboard', {
                        value: { readText: sinon.stub().resolves(text) },
                        configurable: true,
                        writable: true
                    });
                    return navigator.clipboard.readText;
                }

                if(!navigator.clipboard.readText) {
                    navigator.clipboard.readText = sinon.stub().resolves(text);
                    return navigator.clipboard.readText;
                }

                if(navigator.clipboard.readText.isSinonProxy) {
                    navigator.clipboard.readText.resolves(text);
                    return navigator.clipboard.readText;
                }

                return sinon.stub(navigator.clipboard, 'readText').resolves(text);
            };

            this.restoreClipboardStub = function(stub) {
                if(stub && typeof stub.restore === 'function') {
                    stub.restore();
                } else if(navigator.clipboard && navigator.clipboard.readText && navigator.clipboard.readText.restore) {
                    navigator.clipboard.readText.restore();
                }
            };
        },
        afterEach: function() {
            if(this.clipboardStub) {
                this.restoreClipboardStub(this.clipboardStub);
                this.clipboardStub = null;
            }
        }
    }, () => {
        QUnit.test('LoadPanel is shown during smartPaste operation and hidden on completion', function(assert) {
            const done = assert.async();
            let completionCallback;

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                completionCallback = () => callbacks.onComplete([]);
                return () => {};
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 0, 'LoadPanel is not present initially');
            assert.strictEqual(form.option('disabled'), false, 'Form is not disabled initially');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is shown during operation');
                    assert.strictEqual(form.option('disabled'), true, 'Form is disabled during operation');

                    completionCallback();

                    setTimeout(() => {
                        assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is still present but hidden');
                        assert.strictEqual(form._loadPanel.option('visible'), false, 'LoadPanel is hidden after completion');
                        assert.strictEqual(form.option('disabled'), false, 'Form is not disabled after completion');

                        done();
                    }, 10);
                }, 10);
            });
        });

        QUnit.test('LoadPanel is hidden on smartPaste error', function(assert) {
            const done = assert.async();
            let errorCallback;

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                errorCallback = () => callbacks.onError(new Error('Test error'));
                return () => {};
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 0, 'LoadPanel is not present initially');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is shown during operation');
                    assert.strictEqual(form.option('disabled'), true, 'Form is disabled during operation');

                    errorCallback();

                    setTimeout(() => {
                        assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is still present but hidden');
                        assert.strictEqual(form._loadPanel.option('visible'), false, 'LoadPanel is hidden after error');
                        assert.strictEqual(form.option('disabled'), false, 'Form is not disabled after error');

                        done();
                    }, 10);
                }, 10);
            });
        });

        QUnit.test('LoadPanel is hidden when smartPaste operation is aborted', function(assert) {
            const done = assert.async();
            let abortCallback;

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                abortCallback = sinon.spy();
                return abortCallback;
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is shown during operation');
                    assert.strictEqual(form.option('disabled'), true, 'Form is disabled during operation');
                    assert.ok(abortCallback, 'Abort callback was created');

                    form.option('aiIntegration', { smartPaste: sinon.stub().callsFake(() => () => {}) });

                    setTimeout(() => {
                        assert.strictEqual(abortCallback.calledOnce, true, 'Previous operation was aborted');
                        assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is still present but hidden');
                        assert.strictEqual(form._loadPanel.option('visible'), false, 'LoadPanel is hidden after abort');
                        assert.strictEqual(form.option('disabled'), false, 'Form is not disabled after abort');

                        done();
                    }, 10);
                }, 10);
            });
        });

        QUnit.test('Multiple LoadPanel calls during smartPaste do not create multiple panels', function(assert) {
            const done = assert.async();
            const completionCallbacks = [];

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                completionCallbacks.push(() => callbacks.onComplete([]));
                return () => {};
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            form.smartPaste();
            form.smartPaste();
            form.smartPaste();

            setTimeout(() => {
                assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'Only one LoadPanel is present');
                assert.strictEqual(form.option('disabled'), true, 'Form remains disabled');

                if(completionCallbacks.length > 0) {
                    completionCallbacks[completionCallbacks.length - 1]();
                }

                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is still present but hidden');
                    assert.strictEqual(form._loadPanel.option('visible'), false, 'LoadPanel is hidden after completion');
                    assert.strictEqual(form.option('disabled'), false, 'Form is not disabled after completion');

                    done();
                }, 10);
            }, 10);
        });

        QUnit.test('smartPaste handles empty clipboard text', function(assert) {
            const done = assert.async();
            let completionCallback;

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                completionCallback = () => callbacks.onComplete([]);
                return () => {};
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(smartPaste.called, true, 'AI operation should be called with empty text');
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel DOM element should be created for empty text');
                    assert.notStrictEqual(form._loadPanel, undefined, 'LoadPanel should be created for empty text');
                    assert.strictEqual(form.option('disabled'), true, 'Form should be disabled during operation');

                    completionCallback();

                    setTimeout(() => {
                        assert.strictEqual(form._loadPanel.option('visible'), false, 'LoadPanel should be hidden after completion');
                        assert.strictEqual(form.option('disabled'), false, 'Form should not be disabled after completion');

                        done();
                    }, 10);
                }, 10);
            });
        });

        QUnit.test('LoadPanel reuses existing instance on subsequent calls', function(assert) {
            const done = assert.async();
            let completionCallback;

            const smartPaste = sinon.stub().callsFake((params, callbacks) => {
                completionCallback = () => callbacks.onComplete([]);
                return () => {};
            });
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is shown for first operation');
                    completionCallback();

                    setTimeout(() => {
                        form.smartPaste().then(() => {
                            setTimeout(() => {
                                assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'Only one LoadPanel exists');

                                completionCallback();

                                setTimeout(() => {
                                    done();
                                }, 10);
                            }, 10);
                        });
                    }, 10);
                }, 10);
            });
        });

        QUnit.test('Form dispose during active operation cleans up properly', function(assert) {
            const done = assert.async();
            const abortSpy = sinon.spy();

            const smartPaste = sinon.stub().returns(abortSpy);
            const aiIntegration = { smartPaste: smartPaste };
            const form = setupFormWithAi({ aiIntegration });

            this.clipboardStub = this.createClipboardStub('test text');

            form.smartPaste().then(() => {
                setTimeout(() => {
                    assert.strictEqual(form.$element().find(`.${FORM_LOAD_PANEL_CLASS}`).length, 1, 'LoadPanel is shown');

                    form.dispose();

                    assert.strictEqual(abortSpy.calledOnce, true, 'Operation should be aborted on dispose');

                    done();
                }, 10);
            });
        });
    });

    QUnit.module('Events', {
        beforeEach: function() {
            this.aiResult = [{
                name: 'fieldName',
                value: 'fieldValue',
            }];

            this.smartPasteResult = {
                fieldName: 'fieldValue',
            };

            this.smartPaste = (_, callbacks) => {
                callbacks.onComplete([this.aiResult[0]]);
            };

            this.aiIntegration = { smartPaste: this.smartPaste };
        }
    }, () => {
        QUnit.module('onSmartPasting', () => {
            QUnit.test('should be called after getting a response from AI integration module', function(assert) {
                const onSmartPasting = sinon.spy();

                const form = setupFormWithAi({
                    aiIntegration: this.aiIntegration,
                    onSmartPasting,
                });

                form.smartPaste('text');

                assert.strictEqual(onSmartPasting.calledOnce, true, 'onSmartPasting event has been invoked');
            });

            QUnit.test('should pass correct arguments to the event', function(assert) {
                const form = setupFormWithAi({
                    aiIntegration: this.aiIntegration,
                    onSmartPasting: (e) => {
                        const { component, element, aiResult, cancel } = e;

                        assert.strictEqual(component, form, 'e.component is correct');
                        assert.strictEqual($(element).is(form.element()), true, 'e.element is correct');
                        assert.strictEqual(cancel, false, 'e.cancel is correct');
                        assert.deepEqual(aiResult, this.smartPasteResult, 'e.data is correct');
                    },
                });

                form.smartPaste('text');
            });

            [false, true].forEach((isPromise) => {
                [false, true].forEach((cancel) => {
                    QUnit.test(`should be possible to cancel the aiResult processing based on event cancel property: isPromise=${isPromise} cancel=${cancel}`, function(assert) {
                        const done = assert.async();

                        const onSmartPasted = sinon.spy();

                        const form = setupFormWithAi({
                            aiIntegration: this.aiIntegration,
                            onSmartPasting: (e) => { e.cancel = isPromise ? Promise.resolve(cancel) : cancel; },
                            onSmartPasted,
                        });

                        form.smartPaste('text');

                        setTimeout(() => {
                            assert.strictEqual(onSmartPasted.called, !cancel, `processing has ${cancel ? '' : 'not '}been cancelled`);
                            done();
                        });
                    });
                });
            });

            QUnit.test('should process Promise.reject correctly', function(assert) {
                const done = assert.async();

                const onSmartPasted = sinon.spy();

                const form = setupFormWithAi({
                    aiIntegration: this.aiIntegration,
                    onSmartPasting: (e) => { e.cancel = Promise.reject(); },
                    onSmartPasted,
                });

                form.smartPaste('text');

                setTimeout(() => {
                    assert.strictEqual(onSmartPasted.called, true, 'processing has not been cancelled');
                    done();
                });
            });

            QUnit.test('should allow updating onSmartPasting handler at runtime', function(assert) {
                const form = setupFormWithAi({ aiIntegration: this.aiIntegration });

                const onSmartPasting = sinon.spy();
                form.option({ onSmartPasting });

                form.smartPaste('text');

                assert.strictEqual(onSmartPasting.calledOnce, true, 'onSmartPasting event has been invoked after its change at runtime');
            });
        });

        QUnit.module('onSmartPasted', () => {
            QUnit.test('should be called after processing a response from AI integration module', function(assert) {
                const onSmartPasted = sinon.spy();

                const form = setupFormWithAi({
                    aiIntegration: this.aiIntegration,
                    onSmartPasted,
                });

                form.smartPaste('text');

                assert.strictEqual(onSmartPasted.calledOnce, true, 'onSmartPasted event has been invoked');
            });

            QUnit.test('should pass correct arguments to the event', function(assert) {
                const form = setupFormWithAi({
                    aiIntegration: this.aiIntegration,
                    onSmartPasted: (e) => {
                        const { component, element, aiResult } = e;

                        assert.strictEqual(component, form, 'e.component is correct');
                        assert.strictEqual($(element).is(form.element()), true, 'e.element is correct');
                        assert.deepEqual(aiResult, this.smartPasteResult, 'e.data is correct');
                    },
                });

                form.smartPaste('text');
            });

            QUnit.test('should allow updating onSmartPasted handler at runtime', function(assert) {
                const form = setupFormWithAi({ aiIntegration: this.aiIntegration });

                const onSmartPasted = sinon.spy();
                form.option({ onSmartPasted });

                form.smartPaste('text');

                assert.strictEqual(onSmartPasted.calledOnce, true, 'onSmartPasted event has been invoked after its change at runtime');
            });
        });
    });

    QUnit.module('aiOptions', {
        beforeEach: function() {
            this.smartPaste = (_, callbacks) => {
                callbacks.onComplete([{}]);
            };
        }
    }, () => {
        QUnit.test('should be possible to change aiOptions at runtime', function(assert) {
            const form = setupFormWithAi({
                items: [{
                    dataField: 'test',
                    aiOptions: {
                        disabled: true,
                        instruction: 'custom instruction',
                    },
                }]
            });

            let aiOptions = form.itemOption('test').aiOptions;

            assert.deepEqual(aiOptions, { disabled: true, instruction: 'custom instruction' });

            form.itemOption('test', 'aiOptions', { disabled: false, instruction: 'new instruction' });
            aiOptions = form.itemOption('test').aiOptions;

            assert.deepEqual(aiOptions, { disabled: false, instruction: 'new instruction' });
        });

        [undefined, null, {}].forEach((aiOptions) => {
            const aiOptionsLabel = JSON.stringify(aiOptions) ? JSON.stringify(aiOptions) : String(aiOptions);
            QUnit.test(`items with aiOptions=${aiOptionsLabel} should be processed by AI module`, function(assert) {
                const aiIntegration = {
                    smartPaste: (params) => {
                        assert.strictEqual(params.fields.length, 2, 'items are processed as usual');
                    },
                };

                const form = setupFormWithAi({
                    aiIntegration,
                    items: [{
                        dataField: 'test',
                        aiOptions,
                    }, {
                        dataField: 'test',
                        aiOptions,
                    }],
                });

                form.smartPaste('text');
            });
        });
    });
});
