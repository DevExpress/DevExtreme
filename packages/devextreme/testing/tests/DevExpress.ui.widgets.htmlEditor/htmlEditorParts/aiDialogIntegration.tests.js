import $ from 'jquery';

import 'ui/html_editor';

import { openAIDialog } from '../../../helpers/aiToolbarMenu.js';
import {
    clickActionButton,
    setResultText,
    getResultText,
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
    });

    QUnit.module('action buttons', () => {
        QUnit.test('replace button click should replace selected text with a text in result textArea', function(assert) {
            const done = assert.async();

            const instance = setupHtmlEditorWithAi({
                onValueChanged: () => {
                    const value = instance.option('value');
                    assert.strictEqual(value, '<p>Inserted value</p>', 'value replaced');
                    done();
                }
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('replace');
        });

        QUnit.test('insertAbove button click should insert text from result textArea above the selected text', function(assert) {
            const done = assert.async();

            const instance = setupHtmlEditorWithAi({
                onValueChanged: () => {
                    const value = instance.option('value');
                    assert.strictEqual(value, '<p>Inserted value</p><p>Test value</p>', 'inserted above');
                    done();
                }
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertAbove');
        });

        QUnit.test('insertBelow button click should insert text from result textArea below the selected text', function(assert) {
            const done = assert.async();

            const instance = setupHtmlEditorWithAi({
                onValueChanged: () => {
                    const value = instance.option('value');
                    assert.strictEqual(value, '<p>Test value</p><p>Inserted value</p>', 'inserted below');
                    done();
                }
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertBelow');
        });
    });

    QUnit.module('input source based on selection', () => {
        QUnit.test('Should use selected text as input', function(assert) {
            const instance = setupHtmlEditorWithAi();

            instance.setSelection(0, 4);

            openAIDialog($('#htmlEditor'));
            clickActionButton('replace');

            const resultText = getResultText();

            assert.strictEqual(resultText, 'Test', 'selected text used in resultTextArea');
        });

        QUnit.test('Should use all text as input if nothing is selected', function(assert) {
            const instance = setupHtmlEditorWithAi();

            instance.setSelection(0, 0);

            openAIDialog($('#htmlEditor'));
            clickActionButton('replace');

            const resultText = getResultText();

            assert.strictEqual(resultText, 'Test value\n', 'all text used in resultTextArea');
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
                }
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('replace');
        });
    });
});
