import $ from 'jquery';

import 'ui/text_box/ui.text_editor';
import { Deferred } from 'core/utils/deferred';
import devices from 'core/devices';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';

const { test, module } = QUnit;

module('Basic markup', () => {
    test('basic init', function(assert) {
        const element = $('#texteditor').dxTextEditor();
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));
        assert.equal(element.children().length, 1);
        assert.equal(element.find(`.${PLACEHOLDER_CLASS}`).length, 1);
        assert.equal(element.find(`.${INPUT_CLASS}`).length, 1);
        assert.equal(element.find(`.${CONTAINER_CLASS}`).length, 1);
    });

    test('init with placeholder in the input container', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            placeholder: 'enter value'
        });

        const $inputContainer = element.find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`);
        assert.strictEqual($inputContainer.length, 1, 'input container is rendered');

        const placeholder = $inputContainer.find(`.${PLACEHOLDER_CLASS}`);
        assert.strictEqual(placeholder.length, 1, 'placeholder is in the input container');
        assert.notOk(placeholder.hasClass(STATE_INVISIBLE_CLASS), 'placeholder is visible when editor hasn\'t a value');
    });

    test('init with options', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            value: 'custom',
            placeholder: 'enter value',
            readOnly: true,
            tabIndex: 3
        });

        const input = element.find(`.${INPUT_CLASS}`);
        const placeholder = element.find(`.${PLACEHOLDER_CLASS}`);

        assert.equal(input.val(), 'custom');
        assert.equal(element.find(`.${PLACEHOLDER_CLASS}`).attr('data-dx_placeholder'), 'enter value');
        assert.ok(placeholder.hasClass(STATE_INVISIBLE_CLASS), 'placeholder is invisible when editor has a value');
        assert.equal(input.prop('readOnly'), true);
        assert.equal(input.prop('tabindex'), 3);
    });

    test('init with focusStateEnabled = false', function(assert) {
        const element = $('#texteditor').dxTextEditor({
            focusStateEnabled: false,
            tabIndex: 3
        });

        const input = element.find('.' + INPUT_CLASS);

        assert.equal(input.prop('tabindex'), -1);
    });

    test('value === 0 should be rendered on init', function(assert) {
        const $element = $('#texteditor').dxTextEditor({
            value: 0
        });

        const input = $element.find('.' + INPUT_CLASS);
        assert.equal(input.val(), '0', 'value rendered correctly');
    });

    test('T220209 - the \'displayValueFormatter\' option', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({
            value: 'First',
            displayValueFormatter: function(value) {
                return value + ' format';
            }
        });

        assert.equal($textEditor.dxTextEditor('option', 'value'), 'First', 'value is correct');
        assert.equal($textEditor.find(`.${INPUT_CLASS}`).val(), 'First format', 'input value is correct');
    });

    test('renderValue should return a promise that resolves after render input value', function(assert) {
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

    test('"placeholder" attribute should be defined for iOS device (T898735)', function(assert) {
        const $editor = $('#texteditor').dxTextEditor();
        const { ios: isIos } = devices.real();
        const expectedPlaceholder = isIos ? ' ' : '';
        const placeholder = $editor.find(`.${INPUT_CLASS}`).attr('placeholder') || '';

        assert.strictEqual(placeholder, expectedPlaceholder, 'input has placeholder with space at iOS device');
    });
});

module('the \'name\' option', () => {
    test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#texteditor').dxTextEditor({
            name: expectedName
        });
        const $input = $element.find(`.${INPUT_CLASS}`);

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

module('basic options changing', {
    beforeEach: function() {
        this.element = $('#texteditor').dxTextEditor({});
        this.input = this.element.find('.' + INPUT_CLASS);
        this.instance = this.element.dxTextEditor('instance');
    }
}, function() {
    test('value', function(assert) {
        this.instance.option('value', '123');
        assert.strictEqual(this.input.val(), '123');

        this.instance.option('value', '321');
        assert.strictEqual(this.input.val(), '321');
    });

    test('the "inputAttr" option', function(assert) {
        const $element1 = $('<div>', { id: 'testDiv1' }).appendTo('#qunit-fixture');
        const $element2 = $('<div>', { id: 'testDiv1' }).appendTo('#qunit-fixture');

        const instance1 = $element1.dxTextEditor({ inputAttr: { 'data-test': 'test' } }).dxTextEditor('instance');
        const instance2 = $element2.dxTextEditor().dxTextEditor('instance');
        const $input1 = $element1.find('input');

        assert.ok(typeof (instance2.option('inputAttr')) === 'object' && $.isEmptyObject(instance2.option('inputAttr')), 'Option is {} by default');
        assert.strictEqual(instance1.option('inputAttr')['data-test'], 'test', 'Option sets to the widget on init');
        assert.strictEqual($input1.attr('data-test'), 'test', 'Option sets to the widget input on init');

        instance1.option('inputAttr', { 'data-test': 'changedValue', 'data-anyattr': 'anyvalue' });

        assert.strictEqual($input1.attr('data-test'), 'changedValue', 'Attr was changed by API');
        assert.strictEqual($input1.attr('data-anyattr'), 'anyvalue', 'New attr was set by API');
    });

    test('update "name" option with predefined inputAttr', function(assert) {
        this.instance.option('inputAttr', { name: 'some_name' });
        this.instance.option('name', 'new_name');

        assert.strictEqual(this.input.attr('name'), 'new_name', 'inputAttr should be redefined by name');
    });

    test('in case "name" option becomes an empty string, editor should use the inputAttr value', function(assert) {
        this.instance.option('inputAttr', { name: 'some_name' });
        this.instance.option('name', 'new_name');
        this.instance.option('name', '');
        assert.strictEqual(this.input.attr('name'), 'some_name', 'inputAttr should be restored');

        this.instance.option('inputAttr', { name: null });
        assert.notOk(this.input.get(0).hasAttribute('name'), 'name attribute has been removed');

        this.instance.option('name', 'test_name');
        assert.strictEqual(this.input.attr('name'), 'test_name', 'name should be applied');

        this.instance.option('name', '');
        assert.notOk(this.input.get(0).hasAttribute('name'), 'name attribute has been removed');
    });

    test('the "name" attribute should be removed when the "name" option is an empty string', function(assert) {
        this.instance.option('name', 'test_name');
        this.instance.option('name', '');

        assert.notOk(this.input.get(0).hasAttribute('name'), 'name attribute has been removed');
    });

    test('the "inputAttr" option should preserve widget specific classes', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');

        $element.dxTextEditor({ inputAttr: { class: 'some-class' } });
        assert.strictEqual($element.find('.' + INPUT_CLASS).length, 1, 'widget specific class is preserved');
    });

    test('the "inputAttr" option should affect only custom classes on change', function(assert) {
        const firstClassName = 'first';
        const secondClassName = 'second';

        this.instance.option('inputAttr', { class: firstClassName });

        const $input = this.element.find('.' + INPUT_CLASS);
        assert.strictEqual($input.length, 1, 'widget specific class is preserved');
        assert.ok($input.hasClass(firstClassName), 'first custom class is added');

        this.instance.option('inputAttr', { class: secondClassName });
        assert.strictEqual($input.length, 1, 'widget specific class is preserved');
        assert.ok($input.hasClass(secondClassName), 'second custom class is added');
        assert.notOk($input.hasClass(firstClassName), 'first custom class is removed');
    });

    test('inputAttr should corretly handle partial update', function(assert) {
        try {
            this.instance.option('inputAttr.title', 'new title');
            assert.strictEqual(this.input.attr('title'), 'new title', 'inputAttr should be applied');
        } catch(e) {
            assert.ok(false, 'Could not update the option');
        }
    });

    test('partial update of the "inputAttr" option should not replace other attibutes', function(assert) {
        try {
            this.instance.option('inputAttr', { autocomplete: 'on', id: 'test-id-attr' });
            this.instance.option('inputAttr.title', 'new title');
            assert.strictEqual(this.input.attr('title'), 'new title', 'inputAttr should be applied');
            assert.strictEqual(this.input.attr('id'), 'test-id-attr', '"id" attribute value is the same');
            assert.strictEqual(this.input.attr('autocomplete'), 'on', '"autocomplete" attribute value is the same');
        } catch(e) {
            assert.ok(false, 'Could not update the option');
        }
    });

    test('partial update of the "inputAttr" option after setting the null value', function(assert) {
        try {
            this.instance.option('inputAttr', null);
            this.instance.option('inputAttr.title', 'new title');
            assert.strictEqual(this.input.attr('title'), 'new title', 'inputAttr should be applied');
        } catch(e) {
            assert.ok(false, 'Could not update the option');
        }
    });

    test('autocomplete is disabled by default', function(assert) {
        const $textEditor = $('#texteditor').dxTextEditor({});

        assert.strictEqual($textEditor.find('input').attr('autocomplete'), 'off', 'autocomplete prop is disabled by default');

        $textEditor.dxTextEditor('option', 'inputAttr', { 'autocomplete': 'on' });

        assert.strictEqual($textEditor.find('input').attr('autocomplete'), 'on', 'autocomplete attr overwritten');
    });

    test('disabled', function(assert) {
        this.instance.option('disabled', true);
        assert.ok(this.input.prop('disabled'));

        this.instance.option('disabled', false);
        assert.ok(!this.input.prop('disabled'));
    });

    test('focusStateEnabled', function(assert) {
        this.instance.option('focusStateEnabled', false);
        assert.strictEqual(this.input.prop('tabIndex'), -1);

        this.instance.option('focusStateEnabled', true);
        assert.ok(!this.input.prop('tabIndex'));
    });

    test('spellcheck', function(assert) {
        this.instance.option('spellcheck', true);
        assert.ok(this.input.prop('spellcheck'));

        this.instance.option('spellcheck', false);
        assert.ok(!this.input.prop('spellcheck'));
    });

    test('placeholder', function(assert) {
        this.instance.option('placeholder', 'John Doe');
        assert.strictEqual(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Doe');

        this.instance.option('placeholder', 'John Jr. Doe');
        assert.strictEqual(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Jr. Doe');
    });

    test('readOnly', function(assert) {
        this.instance.option('readOnly', true);
        assert.ok(this.input.prop('readOnly'));

        this.instance.option('readOnly', false);
        assert.strictEqual(this.input.prop('readOnly'), false);
    });

    test('texteditor is clear when option \'value\' changed to null', function(assert) {
        const instance = $('#texteditor').dxTextEditor({
            value: 'test'
        }).dxTextEditor('instance');

        instance.option('value', null);
        assert.strictEqual($('.dx-texteditor-empty').length, 1, 'texteditor is empty');
    });

    test('texteditor "stylingMode" option: runtime change', function(assert) {
        this.element = $('#texteditor');
        assert.strictEqual(this.element.hasClass('dx-editor-outlined'), true, 'initial value is right');

        this.instance.option('stylingMode', 'underlined');
        assert.strictEqual(this.element.hasClass('dx-editor-underlined'), true, 'right class after option change present');
        assert.strictEqual(this.element.hasClass('dx-editor-outlined'), false, 'old class after option change was removed');
    });
});
