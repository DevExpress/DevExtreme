import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import fields from '../../../helpers/filterBuilderTestData.js';

import 'ui/filter_builder/filter_builder';

import {
    FILTER_BUILDER_ITEM_OPERATION_CLASS,
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS
} from './constants.js';

const TAB_KEY = 'Tab';
const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';
const DOWN_ARROW_KEY = 'ArrowDown';

QUnit.module('Keyboard navigation', {
    beforeEach: function() {
        this.container = $('#container');

        this.instance = this.container.dxFilterBuilder({
            value: [['State', '=', '']],
            fields: fields
        }).dxFilterBuilder('instance');

        this.getValueButtonElement = function() {
            return this.container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        };

        this.getOperationButtonElement = function() {
            return this.container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        };

        this.getMenuElement = function() {
            return $('.dx-treeview');
        };

        this.getTextEditorElement = function() {
            return this.container.find('.dx-texteditor');
        };

        this.changeValueAndPressKey = function(key, eventType) {
            this.getValueButtonElement().trigger('dxclick');

            const textEditorElement = this.getTextEditorElement();
            textEditorElement.dxTextBox('instance').option('value', 'Test');

            keyboardMock(this.getTextEditorElement()).keyUp(key);
        };

        this.showTextEditor = function() {
            keyboardMock(this.getValueButtonElement()).keyUp(ENTER_KEY);
        };

        this.setFocusToBody = function() {
            if(document.activeElement && document.activeElement.nodeName.toLowerCase() !== 'body') {
                document.activeElement.blur();
            }
        };
    }
}, function() {
    QUnit.test('show editor on keyup event', function(assert) {
        this.instance.option('value', ['Zipcode', '<>', 123]);

        this.showTextEditor();

        assert.notOk(this.getValueButtonElement().length);
        assert.ok(this.getTextEditorElement().length);
    });

    // T697525
    QUnit.test('keyup for enter key should not fired between compositionstart & compositionend events', function(assert) {
        this.instance.option('value', ['State', '<>', 'State']);
        this.showTextEditor();
        const textEditorElement = this.getTextEditorElement();
        textEditorElement.find('input').trigger('compositionstart');

        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.ok(this.getTextEditorElement().length, 'skip keyup while composition');

        textEditorElement.find('input').trigger('compositionend');
        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.ok(this.getTextEditorElement().length, 'skip first keyup after composition');

        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.notOk(this.getTextEditorElement().length, 'keyup fired');
    });

    // T697525
    QUnit.test('keyup for enter key shouled fired after compositionend on safari', function(assert) {
        this.instance.option('value', ['State', '<>', 'State']);
        this.showTextEditor();
        const textEditorElement = this.getTextEditorElement();
        textEditorElement.find('input').trigger('compositionstart');

        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.ok(this.getTextEditorElement().length, 'skip keyup while composition');

        textEditorElement.find('input').trigger('compositionend');
        keyboardMock(textEditorElement).keyDown(229);
        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.ok(this.getTextEditorElement().length, 'wait for keydown != 229 after composition');

        keyboardMock(textEditorElement).keyUp(ENTER_KEY);
        assert.notOk(this.getTextEditorElement().length, 'keyup fired');
    });

    QUnit.test('enter keyup for value button and editor', function(assert) {
        this.instance.option('value', ['Zipcode', '<>', 123]);

        this.showTextEditor();

        assert.ok(this.getTextEditorElement().length);

        keyboardMock(this.getTextEditorElement()).keyUp(ENTER_KEY);

        assert.notOk(this.getTextEditorElement().length);
        assert.ok(this.getValueButtonElement().length);
    });

    QUnit.test('condition isn\'t changed after escape key press', function(assert) {
        const value = this.instance.option('value');

        this.changeValueAndPressKey(ESCAPE_KEY, 'keyup');

        assert.equal(this.instance.option('value'), value);
        assert.equal(this.getValueButtonElement().length, 1);
    });

    QUnit.test('change condition value after tab press', function(assert) {
        this.getValueButtonElement().trigger('dxclick');

        const textEditorElement = this.getTextEditorElement();
        textEditorElement.dxTextBox('instance').option('value', 'Test');
        this.setFocusToBody();

        keyboardMock(this.getTextEditorElement()).keyUp(TAB_KEY);

        assert.equal(this.getValueButtonElement().text(), 'Test');
    });

    QUnit.test('tab press without change a condition', function(assert) {
        this.getValueButtonElement().trigger('dxclick');

        this.setFocusToBody();
        keyboardMock(this.getTextEditorElement().find('input')).keyUp(TAB_KEY);

        assert.equal(this.getValueButtonElement().text(), '<enter a value>');
    });

    QUnit.test('change condition value after enter key press', function(assert) {
        let value = this.instance.option('value');

        this.changeValueAndPressKey(ENTER_KEY);

        assert.notEqual(this.instance.option('value'), value);
        assert.equal(this.getValueButtonElement().length, 1);

        value = this.instance.option('value');

        this.changeValueAndPressKey(ENTER_KEY);

        assert.equal(this.instance.option('value'), value);
        assert.equal(this.getValueButtonElement().length, 1);
    });

    QUnit.testInActiveWindow('value button gets focus after enter key press', function(assert) {
        this.changeValueAndPressKey(ENTER_KEY);

        assert.ok(this.getValueButtonElement().is(':focus'));
    });

    QUnit.testInActiveWindow('value button gets focus after escape key press', function(assert) {
        this.changeValueAndPressKey(ESCAPE_KEY);

        assert.ok(this.getValueButtonElement().is(':focus'));
    });

    // T591055
    QUnit.testInActiveWindow('menu has focus after open by enter key press', function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        assert.ok(this.getMenuElement().is(':focus'));
    });

    QUnit.testInActiveWindow('close menu after escape key press', function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        assert.ok(this.getMenuElement().is(':focus'));

        keyboardMock(this.getMenuElement()).keyUp(ESCAPE_KEY);

        assert.notOk(this.getMenuElement().length);
        assert.ok(this.getOperationButtonElement().is(':focus'));
    });

    QUnit.testInActiveWindow('select item in menu', function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        const menuKeyboard = keyboardMock(this.getMenuElement());

        menuKeyboard.keyDown(DOWN_ARROW_KEY);

        assert.equal($('.dx-treeview-node.dx-state-focused').text(), 'Contains');

        menuKeyboard.keyDown(ENTER_KEY);
        menuKeyboard.keyUp(ENTER_KEY);

        assert.ok(this.getOperationButtonElement().is(':focus'));
        assert.equal(this.getOperationButtonElement().text(), 'Contains');
    });

    // T653968
    QUnit.testInActiveWindow('editor.value is changed after \'keyup\' and saved in filterBulder.value by outer click (T653968)', function(assert) {
        this.showTextEditor();

        const textEditorElement = this.getTextEditorElement();
        const textEditorInput = textEditorElement.find('input');
        const textEditorInstance = textEditorElement.dxTextBox('instance');

        textEditorInput.focus();
        textEditorInput.val('Test');
        assert.equal(textEditorInput.val(), 'Test');
        assert.equal(textEditorInstance.option('value'), '');

        $('body').trigger('dxpointerdown');

        assert.deepEqual(this.instance.option('value'), ['State', '=', 'Test']);
        assert.equal(textEditorInstance.option('value'), 'Test');
        assert.equal(textEditorInput.val(), 'Test');
    });
});
