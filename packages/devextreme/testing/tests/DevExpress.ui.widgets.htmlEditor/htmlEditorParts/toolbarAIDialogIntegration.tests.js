import $ from 'jquery';

import 'ui/html_editor';

import { openAIDialog } from '../../../helpers/aiToolbarMenu.js';
import { clickActionButton, setResultText, getResultText } from '../../../helpers/aiDialog.js';

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

QUnit.module('Toolbar AI dialog integration', {}, () => {
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

    QUnit.test('onValueChanged should receive correct event parameter if value is updated after action button click', function(assert) {
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
