import $ from 'jquery';

import 'ui/html_editor';

import { openAiDialog } from '../../../helpers/aiToolbarMenu.js';
import { clickActionButton, setResultText, getResultText } from '../../../helpers/aiDialog.js';

const setupHtmlEditorWithAi = (config) => {
    return $('#htmlEditor').dxHtmlEditor({
        value: 'Test value',
        ai: {},
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
    QUnit.test('Should replace result text', function(assert) {
        const done = assert.async();

        const instance = setupHtmlEditorWithAi({
            onValueChanged: () => {
                const value = instance.option('value');
                assert.strictEqual(value, '<p>Inserted value</p>', 'value replaced');
                done();
            }
        });

        openAiDialog($('#htmlEditor'));
        setResultText('Inserted value');
        clickActionButton('replace');
    });

    QUnit.test('Should insert above result text', function(assert) {
        const done = assert.async();

        const instance = setupHtmlEditorWithAi({
            onValueChanged: () => {
                const value = instance.option('value');
                assert.strictEqual(value, '<p>Inserted value</p><p>Test value</p>', 'inserted above');
                done();
            }
        });

        openAiDialog($('#htmlEditor'));
        setResultText('Inserted value');
        clickActionButton('insertAbove');
    });

    QUnit.test('Should insert below result text', function(assert) {
        const done = assert.async();

        const instance = setupHtmlEditorWithAi({
            onValueChanged: () => {
                const value = instance.option('value');
                assert.strictEqual(value, '<p>Test value</p><p>Inserted value</p>', 'inserted below');
                done();
            }
        });

        openAiDialog($('#htmlEditor'));
        setResultText('Inserted value');
        clickActionButton('insertBelow');
    });

    QUnit.test('Should use selected text as input', function(assert) {
        const instance = setupHtmlEditorWithAi();

        instance.setSelection(0, 4);

        openAiDialog($('#htmlEditor'));
        clickActionButton('replace');

        const resultText = getResultText();

        assert.strictEqual(resultText, 'Test', 'selected text used in resultTextArea');
    });

    QUnit.test('Should use all text as input if nothing is selected', function(assert) {
        const instance = setupHtmlEditorWithAi();

        instance.setSelection(0, 0);

        openAiDialog($('#htmlEditor'));
        clickActionButton('replace');

        const resultText = getResultText();

        assert.strictEqual(resultText, 'Test value\n', 'all text used in resultTextArea');
    });

    QUnit.test('Should call saveValueChangeEvent with correct event', function(assert) {
        const done = assert.async();

        setupHtmlEditorWithAi({
            onValueChanged: ({ event }) => {
                const clickedText = $(event.target).text();

                assert.strictEqual(event.type, 'dxclick', 'called with correct event type');
                assert.strictEqual(clickedText, 'Replace', 'called on correct element');
                done();
            }
        });

        openAiDialog($('#htmlEditor'));
        setResultText('Inserted value');
        clickActionButton('replace');
    });
});
