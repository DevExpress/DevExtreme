import $ from 'jquery';
import TextBox from 'ui/text_box';
import devices from '__internal/core/m_devices';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import { getWidth, getOuterWidth } from 'core/utils/size';
import keyboardMock from '../../helpers/keyboardMock.js';

import { TextEditorLabel } from '__internal/ui/text_box/m_text_editor.label';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="qunit-fixture">\
            <div id="textbox"></div>\
            <div id="widthRootStyle"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

const TEXTBOX_CLASS = 'dx-textbox';
const INPUT_CLASS = 'dx-texteditor-input';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const SEARCHBOX_CLASS = 'dx-searchbox';
const SEARCH_ICON_CLASS = 'dx-icon-search';
const CLEAR_BUTTON_AREA_CLASS = 'dx-clear-button-area';

const BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';

QUnit.module('common', {}, () => {
    QUnit.test('should not generate any error if inputAttr is undefined', function(assert) {
        try {
            $('#textbox').dxTextBox({
                inputAttr: undefined
            });
            assert.ok(true, 'Encountered no errors');
        } catch(e) {
            assert.ok(false, `The error is thrown: ${e.message}`);
        }
    });

    QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(1);

        $('#textbox').dxTextBox({
            onContentReady(e) {
                assert.ok($(e.element).hasClass(TEXTBOX_CLASS));
            }
        });
    });

    QUnit.test('changing mode to \'search\' should render search icon', function(assert) {
        const element = $('#textbox').dxTextBox();
        const textBox = element.dxTextBox('instance');

        textBox.option('mode', 'search');

        assert.ok(element.has(SEARCHBOX_CLASS));
        assert.equal(element.find('.' + SEARCH_ICON_CLASS).length, 1);
    });

    QUnit.test('call focus() method', function(assert) {
        executeAsyncMock.setup();
        try {
            let inFocus;

            const onFocusIn = () => {
                inFocus = !inFocus;
            };

            const element = $('#textbox').dxTextBox({ onFocusIn });
            const instance = $('#textbox').dxTextBox('instance');

            inFocus = element.find('.dx-texteditor-input').is(':focus');
            assert.ok(!inFocus, 'at start input has not focused');

            instance.focus();
            assert.ok(inFocus, 'when call \'focus\' method, then focus on input');
        } finally {
            executeAsyncMock.teardown();
        }
    });

    QUnit.test('reset should clear invalid state even when reset value is invalid', function(assert) {
        const editor = $('#textbox').dxTextBox({
            mask: '+1 (000) 000-0000'
        }).dxTextBox('instance');

        editor.option('value', 'invalidValue');

        assert.strictEqual(editor.option('isValid'), false, 'editor state is invalid before reset');

        editor.reset('otherInvalidValue');

        assert.strictEqual(editor.option('isValid'), true, 'editor state is valid after reset');
    });

    QUnit.test('reset should clear input value if value was not changed', function(assert) {
        const instance = $('#textbox').dxTextBox().dxTextBox('instance');
        const $input = $(`.${INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('123').press('enter');

        assert.strictEqual($input.val(), '123', 'input value is pressent before reset');

        instance.reset();

        assert.strictEqual($input.val(), '', 'input value is absent after reset');
    });

    QUnit.test('T218573 - clearButton should be hidden if mode is \'search\' and the \'showClearButton\' option is false', function(assert) {
        const $element = $('#textbox').dxTextBox({
            showClearButton: false,
            mode: 'search',
            value: 'Text'
        });

        const instance = $element.dxTextBox('instance');

        assert.ok(!instance.option('showClearButton'), 'the \'showClearButton\' options is correct');
        assert.equal($(`.${CLEAR_BUTTON_AREA_CLASS}`).length, 0, 'clear button is not rendered');
    });

    QUnit.test('should have no errors if textBox has custom buttons and "visible" option is false (T998843)', function(assert) {
        try {
            $('#textbox').dxTextBox({
                visible: false,
                buttons: [
                    {
                        name: 'password',
                        options: {
                            type: 'default',
                        },
                    },
                ],
            });
            assert.ok(true);
        } catch(e) {
            assert.ok(false, `the error is thrown: ${e.message}`);
        }
    });
});

QUnit.module('options changing', {
    beforeEach: function() {
        this.element = $('#textbox').dxTextBox({});
        this.input = this.element.find('.' + INPUT_CLASS);
        this.instance = this.element.dxTextBox('instance');
    }
}, () => {
    QUnit.test('mode', function(assert) {
        assert.expect(1);

        this.instance.option('mode', 'search');
        assert.equal(this.element.find('.' + INPUT_CLASS).attr('type'), 'text');
    });

    QUnit.test('value', function(assert) {
        assert.expect(2);

        this.instance.option('value', '123');
        assert.equal(this.input.val(), '123');

        this.instance.option('value', '321');
        assert.equal(this.input.val(), '321');
    });

    QUnit.test('disabled', function(assert) {
        assert.expect(2);

        this.instance.option('disabled', true);
        assert.ok(this.input.prop('disabled'));

        this.instance.option('disabled', false);
        assert.ok(!this.input.prop('disabled'));
    });

    QUnit.test('placeholder', function(assert) {
        assert.expect(2);

        this.instance.option('placeholder', 'John Doe');
        assert.equal(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Doe');

        this.instance.option('placeholder', 'John Jr. Doe');
        assert.equal(this.element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Jr. Doe');
    });

    QUnit.test('\'maxLength\' option', function(assert) {
        const originalDevices = devices.real();
        devices.real({
            platform: 'not android and not IE',
            version: ['24']
        });

        try {
            this.instance.option('maxLength', 5);
            assert.equal(this.input.attr('maxLength'), 5);

            this.instance.option('maxLength', null);
            assert.equal(this.input.attr('maxLength'), null);

            this.instance.option('maxLength', 3);
            assert.equal(this.input.attr('maxLength'), 3);
        } finally {
            devices.real(originalDevices);
        }
    });

    QUnit.test('\'maxLength\' should be ignored if mask is specified', function(assert) {
        const originalDevices = devices.real();
        devices.real({
            platform: 'not android and not IE',
            version: ['24']
        });

        try {
            this.instance.option('maxLength', 4);
            this.instance.option('mask', '00:00');
            assert.equal(this.input.attr('maxLength'), null);

            this.instance.option('mask', '');
            assert.equal(this.input.attr('maxLength'), 4);
        } finally {
            devices.real(originalDevices);
        }
    });

    QUnit.test('readOnly', function(assert) {
        assert.expect(2);

        this.instance.option('readOnly', true);
        assert.ok(this.input.prop('readOnly'));

        this.instance.option('readOnly', false);
        assert.equal(this.input.prop('readOnly'), false);
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.instance.option('onValueChanged', () => {
            assert.ok(true);
        });
        this.instance.option('value', true);
    });

    QUnit.test('options \'height\' and \'width\'', function(assert) {
        let h = 500;
        let w = 400;
        this.instance.option({
            height: h,
            width: w,
            value: 'qwertyQWERTY'
        });

        assert.equal(this.element.outerHeight(), h, 'widget\'s height set');
        assert.equal(this.element.outerWidth(), w, 'widget\'s width set');
        assert.equal(this.input.outerHeight(), this.element.height(), 'input outer height should be equal widget height');
        assert.equal(this.input.outerWidth(), this.element.width(), 'input outer width should be equal widget width');

        h = 300;
        w = 500;
        this.instance.option({
            height: h,
            width: w
        });

        assert.equal(this.element.outerHeight(), h, 'widget\'s height set');
        assert.equal(this.element.outerWidth(), w, 'widget\'s width set');
        assert.equal(this.input.outerHeight(), this.element.height(), 'input outer height should be equal widget height');
        assert.equal(this.input.outerWidth(), this.element.width(), 'input outer width should be equal widget width');
    });
});

QUnit.module('widget sizing render', {}, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#textbox').dxTextBox();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#textbox').dxTextBox({ width: 400 });
        const instance = $element.dxTextBox('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxTextBox();
        const instance = $element.dxTextBox('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#textbox').dxTextBox();
        const instance = $element.dxTextBox('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('valueChanged should receive correct event parameter', {
    beforeEach: function() {
        this.valueChangedHandler = sinon.stub();
        this.$element = $('#textbox').dxTextBox({
            onValueChanged: this.valueChangedHandler
        });
        this.instance = this.$element.dxTextBox('instance');

        this.testProgramChange = (assert) => {
            this.instance.option('value', 'custom text');

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };
    }
}, () => {
    QUnit.test('on click on clear button', function(assert) {
        this.instance.option({ showClearButton: true, value: 'text' });

        const $clearButton = this.$element.find(`.${CLEAR_BUTTON_AREA_CLASS}`);
        $clearButton.trigger('dxclick');

        const event = this.valueChangedHandler.getCall(1).args[0].event;
        assert.strictEqual(event.type, 'dxclick', 'event type is correct');
        assert.strictEqual(event.target, $clearButton.get(0), 'event target is correct');

        this.testProgramChange(assert);
    });
});

QUnit.module('label integration', {
    beforeEach: function() {
        const initialOptions = {
            label: 'some'
        };
        this.init = (options = {}) => {
            this.$textBox = $('#textbox').dxTextBox($.extend(initialOptions, options));
            this.textBox = this.$textBox.dxTextBox('instance');
        };

        const that = this;

        class TextEditorLabelMock extends TextEditorLabel {
            constructor(args) {
                super(args);
                that.labelArgs = args;
                that.labelMock = this;
            }

            updateMaxWidth = sinon.stub();
            updateBeforeWidth = sinon.stub();
        }

        TextBox.mockTextEditorLabel(TextEditorLabelMock);
    },
    afterEach: function() {
        Object.values(this.labelMock, (stub) => {
            stub.reset();
        });

        TextBox.restoreTextEditorLabel();
    }
},
() => {
    QUnit.test('editor should pass beforeWidth equal to buttons container width + search icon outer width', function(assert) {
        this.init({
            buttons: [{
                name: 'button',
                location: 'before'
            }],
            mode: 'search'
        });

        const buttonsContainerWidth = getWidth($(`.${BUTTONS_CONTAINER_CLASS}`));
        const searchIconOuterWidth = getOuterWidth($(`.${SEARCH_ICON_CLASS}`));
        const expectedBeforeWidth = buttonsContainerWidth + searchIconOuterWidth;

        assert.strictEqual(this.labelArgs.getBeforeWidth(), expectedBeforeWidth);
    });

    QUnit.test('editor should pass containerWidth equal to input container width - buttons container width - search icon outer width', function(assert) {
        this.init({
            buttons: [{
                name: 'button',
                location: 'before'
            }],
            mode: 'search'
        });

        const inputContainerWidth = getWidth(this.$textBox.find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`));
        const buttonsContainerWidth = getWidth($(`.${BUTTONS_CONTAINER_CLASS}`));
        const searchIconOuterWidth = getOuterWidth($(`.${SEARCH_ICON_CLASS}`));
        const expectedContainerWidth = inputContainerWidth - buttonsContainerWidth - searchIconOuterWidth;

        assert.strictEqual(this.labelArgs.getContainerWidth(), expectedContainerWidth);
    });

    QUnit.test('mode option change should call label updateMaxWidth and updateBeforeWidth methods with correct parameters', function(assert) {
        this.init();
        this.textBox.option('mode', 'search');

        const inputContainerWidth = getWidth(this.$textBox.find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`));
        const buttonsContainerWidth = getWidth($(`.${BUTTONS_CONTAINER_CLASS}`));
        const searchIconOuterWidth = getOuterWidth($(`.${SEARCH_ICON_CLASS}`));

        const newLabelMaxWidth = inputContainerWidth - buttonsContainerWidth - searchIconOuterWidth;
        const newLabelBeforeWidth = buttonsContainerWidth + searchIconOuterWidth;

        assert.strictEqual(this.labelMock.updateMaxWidth.getCall(0).args[0], newLabelMaxWidth, 'updateMaxWidth parameter is correct');
        assert.strictEqual(this.labelMock.updateBeforeWidth.getCall(0).args[0], newLabelBeforeWidth, 'updateBeforeWidth parameter is correct');
    });
});
