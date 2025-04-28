import $ from 'jquery';

import 'ui/html_editor';

import { openAIDialog } from '../../../helpers/aiToolbarMenu.js';
import {
    clickActionButton,
    setResultText,
    getResultTextAreaValue,
} from '../../../helpers/aiDialog.js';
import { AI_DIALOG_CLASS } from '__internal/ui/html_editor/ui/aiDialog';

const setupHtmlEditorWithAi = (config) => {
    return $('#htmlEditor').dxHtmlEditor({
        value: 'Test value',
        aiIntegration: {},
        toolbar: {
            items: [{
                name: 'ai',
                commands: ['summarize']
            }],
        },
        ...config
    }).dxHtmlEditor('instance');
};

const getAIDialog = (htmlEditor) => {
    return htmlEditor._aiDialog;
};

const getAIDialogElement = ($htmlEditor) => {
    return $htmlEditor.find(`.${AI_DIALOG_CLASS}`);
};

QUnit.module('AI dialog integration', {}, () => {
    QUnit.module('render', () => {
        ['ai', { name: 'ai' }].forEach(aiToolbarItem => {
            QUnit.test(`should be rendered if aiIntegration and ai toolbar item (as ${typeof aiToolbarItem}) are passed`, function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    aiIntegration: {},
                    toolbar: { items: [ aiToolbarItem ] },
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 1, 'dialog is rendered');
            });

            QUnit.test('should not be rendered if aiIntegration is not passed and ai toolbar item is passed', function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    toolbar: { items: [ aiToolbarItem ] },
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 0, 'dialog is not rendered');
            });

            QUnit.test('should not be rendered if ai toolbar item is not passed and aiIntegration is passed', function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    aiIntegration: {},
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 0, 'dialog is not rendered');
            });
        });
    });

    QUnit.module('aiIntegration option', () => {
        QUnit.test('process update if ai dailog was rendered before', function(assert) {
            const htmlEditor = setupHtmlEditorWithAi({});
            const dialog = getAIDialog(htmlEditor);
            const $dialog = getAIDialogElement(htmlEditor.$element());
            const updateAIIntegrationSpy = sinon.spy(dialog, 'updateAIIntegration');

            assert.strictEqual(updateAIIntegrationSpy.callCount, 0);
            assert.strictEqual($dialog.length, 1, 'dialog is rendered');

            htmlEditor.option({ aiIntegration: {} });

            assert.strictEqual(updateAIIntegrationSpy.callCount, 1, 'updateAIIntegration is called once');
        });

        QUnit.test('process update if ai dailog was not rendered before', function(assert) {
            const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: null });
            let $dialog = getAIDialogElement(htmlEditor.$element());

            assert.strictEqual($dialog.length, 0, 'dialog is not rendered');

            htmlEditor.option({ aiIntegration: {} });

            $dialog = getAIDialogElement(htmlEditor.$element());

            assert.strictEqual($dialog.length, 1, 'dialog is rendered');
        });

        QUnit.module('runtime update', () => {
            QUnit.test('update aiIntegration cancels active request and resets dialog state', function(assert) {
                const abortSpy = sinon.spy();
                const summarizeSpy1 = sinon.stub().returns(abortSpy);
                const summarizeSpy2 = sinon.stub().returns(() => {});
                const initialAIIntegration = { summarize: summarizeSpy1 };
                const newAIIntegration = { summarize: summarizeSpy2 };
                const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: initialAIIntegration });

                openAIDialog($('#htmlEditor'));

                assert.ok(summarizeSpy1.calledOnce, 'initial summarize called');

                htmlEditor.option({ aiIntegration: newAIIntegration });

                assert.ok(abortSpy.calledOnce, 'previous request aborted');
                assert.ok(summarizeSpy1.calledOnce, 'initial summarize is not called again');
                assert.ok(summarizeSpy2.calledOnce, 'new summarize invoked after update');
            });
        });

        QUnit.module('aiIntegration absence', () => {
            QUnit.test('showAIDialog should return undefined when aiIntegration is omitted', function(assert) {
                const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: null });
                const result = htmlEditor.showAIDialog({
                    currentCommand: 'summarize',
                    currentCommandOption: undefined,
                    text: '',
                    commandsMap: {},
                });

                assert.strictEqual(result, undefined, 'showAIDialog returns undefined');
            });
        });
    });

    QUnit.module('action buttons', () => {
        QUnit.test('replace without selected text should replace all text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                value: 'Old value',
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>New value</p>', 'all text is replaced');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('New value');
            clickActionButton('replace');
        });

        QUnit.test('replace should replace selected text', function(assert) {
            const done = assert.async();

            const htmlEditor = setupHtmlEditorWithAi({
                value: 'Test value',
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Inserted value value</p>', 'selected text replaced');
                    done();
                },
            });

            htmlEditor.setSelection(0, 4);

            openAIDialog(($('#htmlEditor')));
            setResultText('Inserted value');
            clickActionButton('replace');
        });

        QUnit.test('insertAbove button click should insert text from result textArea above the selected text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Inserted value</p><p>Test value</p>', 'inserted above');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertAbove');
        });

        QUnit.test('insertBelow button click should insert text from result textArea below the selected text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Test value</p><p>Inserted value</p>', 'inserted below');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertBelow');
        });
    });

    QUnit.module('TextArea', () => {
        QUnit.test('should not have any text inside it if nothing is selected', function(assert) {
            setupHtmlEditorWithAi();

            const resultText = getResultTextAreaValue();

            assert.strictEqual(resultText, '', 'textarea does not contain text');
        });

        QUnit.test('should not have any text inside it if part of the text is selected', function(assert) {
            const instance = setupHtmlEditorWithAi();

            instance.setSelection(0, 4);

            const resultText = getResultTextAreaValue();

            assert.strictEqual(resultText, '', 'textarea does not contain text');
        });
    });

    QUnit.module('onValueChanged', () => {
        QUnit.test('should receive correct event parameter if value is updated after action button click', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ event }) => {
                    const clickedText = $(event.target).text();

                    assert.strictEqual(event.type, 'dxclick', 'called with correct event type');
                    assert.strictEqual(clickedText, 'Replace', 'called on correct element');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('replace');
        });
    });
});
