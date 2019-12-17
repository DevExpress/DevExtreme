import $ from 'jquery';

import 'ui/text_box/ui.text_editor';
import { Deferred } from 'core/utils/deferred';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';

const { test, module } = QUnit;

module('Basic markup', () => {
    test('basic init', (assert) => {
        const element = $('#texteditor').dxTextEditor();
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));
        assert.equal(element.children().length, 1);
        assert.equal(element.find(`.${PLACEHOLDER_CLASS}`).length, 1);
        assert.equal(element.find(`.${INPUT_CLASS}`).length, 1);
        assert.equal(element.find(`.${CONTAINER_CLASS}`).length, 1);
    });

    test('init with placeholder in the input container', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            placeholder: 'enter value'
        });

        const $inputContainer = element.find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`);
        assert.strictEqual($inputContainer.length, 1, 'input container is rendered');

        const placeholder = $inputContainer.find(`.${PLACEHOLDER_CLASS}`);
        assert.strictEqual(placeholder.length, 1, 'placeholder is in the input container');
        assert.notOk(placeholder.hasClass(STATE_INVISIBLE_CLASS), 'placeholder is visible when editor hasn\'t a value');
    });

    test('init with options', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            value: 'custom',
            placeholder: 'enter value',
            readOnly: true,
            tabIndex: 3
        });

        const input = element.find(`.${INPUT_CLASS}`),
            placeholder = element.find(`.${PLACEHOLDER_CLASS}`);

        assert.equal(input.val(), 'custom');
        assert.equal(input.prop('placeholder') || element.find(`.${PLACEHOLDER_CLASS}`).attr('data-dx_placeholder'), 'enter value');
        assert.ok(placeholder.hasClass(STATE_INVISIBLE_CLASS), 'placeholder is invisible when editor has a value');
        assert.equal(input.prop('readOnly'), true);
        assert.equal(input.prop('tabindex'), 3);
    });

    test('init with focusStateEnabled = false', (assert) => {
        const element = $('#texteditor').dxTextEditor({
            focusStateEnabled: false,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.prop('tabindex'), -1);
    });

    test('value === 0 should be rendered on init', (assert) => {
        const $element = $('#texteditor').dxTextEditor({
            value: 0
        });

        const input = $element.find('.' + INPUT_CLASS);
        assert.equal(input.val(), '0', 'value rendered correctly');
    });

    test('T220209 - the \'displayValueFormatter\' option', (assert) => {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            displayValueFormatter: function(value) {
                return value + ' format';
            }
        });

        assert.equal($textEditor.dxTextEditor('option', 'value'), 'First', 'value is correct');
        assert.equal($textEditor.find(`.${INPUT_CLASS}`).val(), 'First format', 'input value is correct');
    });

    test('renderValue should return a promise that resolves after render input value', (assert) => {
        assert.expect(1);

        const done = assert.async();
        const deferred = new Deferred();
        const editor = $('#texteditor').dxTextEditor({
            value: 'test'
        }).dxTextEditor('instance');
        const renderValueStub = sinon.spy(editor, '_renderValue');

        sinon.stub(editor, '_renderInputValue').returns(deferred.promise());
        editor.repaint();

        const promise = renderValueStub.getCall(0).returnValue;

        promise.then(() => {
            assert.ok('Value has been rendered');
            done();
        });

        deferred.resolve();
    });
});

module('the \'name\' option', () => {
    test('widget input should get the \'name\' attribute with a correct value', (assert) => {
        const expectedName = 'some_name',
            $element = $('#texteditor').dxTextEditor({
                name: expectedName
            }),
            $input = $element.find(`.${INPUT_CLASS}`);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

