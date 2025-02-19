import $ from 'jquery';
import SpinButton from '__internal/ui/number_box/m_number_box.spin';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import eventsEngine from 'common/core/events/core/events_engine';
import keyboardMock from '../../../helpers/keyboardMock.js';
import pointerMock from '../../../helpers/pointerMock.js';
import { normalizeKeyName } from 'common/core/events/utils/index';

import 'ui/number_box';
import 'ui/validator';

const NUMBERBOX_CLASS = 'dx-numberbox';
const INVALID_CLASS = 'dx-invalid';
const SPIN_CLASS = 'dx-numberbox-spin';
const SPIN_CONTAINER_CLASS = 'dx-numberbox-spin-container';
const SPIN_UP_CLASS = 'dx-numberbox-spin-up';
const SPIN_DOWN_CLASS = 'dx-numberbox-spin-down';
const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const SPIN_TOUCH_FRIENDLY_CLASS = 'dx-numberbox-spin-touch-friendly';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const CLEAR_BUTTON_CLASS = 'dx-clear-button-area';

const INVALID_MESSAGE_POPUP_CONTENT_SELECTOR = '.dx-invalid-message .dx-overlay-content';

QUnit.module('basics', {}, () => {
    QUnit.test('markup init', function(assert) {
        const element = $('#numberbox').dxNumberBox();

        assert.ok(element.hasClass(NUMBERBOX_CLASS));
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));

        assert.equal(element.find('.' + INPUT_CLASS).length, 1);
        assert.equal(element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('input should have correct type', function(assert) {
        const $element = $('#numberbox').dxNumberBox();
        const instance = $element.dxNumberBox('instance');

        function checkInput(type) {
            let result = false;

            const input = $('<input>')
                .appendTo($('body'));

            try {
                input.prop('type', type);
                result = input.prop('type') === type;
            } catch(e) {
                result = false;
            }

            $(input).remove();

            return result;
        }

        assert.equal($element.find('.' + INPUT_CLASS).prop('type'), checkInput('number') ? instance.option('mode') : 'text');
    });

    QUnit.test('input should have inputmode attribute for numeric keyboard on mobile devices', function(assert) {
        const $element = $('#numberbox').dxNumberBox();
        assert.equal($element.find('.' + INPUT_CLASS).attr('inputmode'), 'decimal', 'inputmode is correct');
    });

    QUnit.module('Tabindex', () => {
        [false, true].forEach((initialFocusStateEnabled) => {
            QUnit.test(`should be ${initialFocusStateEnabled ? 0 : -1} if focusStateEnabled = ${initialFocusStateEnabled} on init (T1275314)`, function(assert) {
                const $element = $('#numberbox').dxNumberBox({ focusStateEnabled: initialFocusStateEnabled });
                const $input = $element.find(`.${INPUT_CLASS}`);

                assert.strictEqual($input.prop('tabindex'), initialFocusStateEnabled ? 0 : -1);
            });

            QUnit.test(`should be updated when focusStateEnabled changes from ${initialFocusStateEnabled} to ${!initialFocusStateEnabled}`, function(assert) {
                const $element = $('#numberbox').dxNumberBox({ focusStateEnabled: initialFocusStateEnabled });
                const instance = $element.dxNumberBox('instance');
                const $input = $element.find(`.${INPUT_CLASS}`);

                instance.option('focusStateEnabled', !initialFocusStateEnabled);

                assert.strictEqual($input.prop('tabindex'), initialFocusStateEnabled ? -1 : 0, 'Updated tabindex is correct');
            });
        });
    });

    QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(2);

        $('#numberbox').dxNumberBox({
            value: 25,
            onContentReady(e) {
                assert.equal($(e.element).find('input').val(), 25);
                assert.ok($(e.element).hasClass(NUMBERBOX_CLASS));
            }
        });
    });

    QUnit.test('init with options', function(assert) {
        assert.expect(2);

        const element = $('#numberbox').dxNumberBox({
            min: 0,
            max: 100
        });

        const $input = element.find('.' + INPUT_CLASS);

        assert.equal($input.prop('min'), 0);
        assert.equal($input.prop('max'), 100);
    });

    QUnit.test('typing value by keyboard update \'value\' option', function(assert) {
        assert.expect(2);

        const element = $('#numberbox').dxNumberBox({
            value: 100,
            valueChangeEvent: 'change'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option('value'), 100);

        keyboard
            .caret(3)
            .type('200')
            .change();

        assert.strictEqual(instance.option('value'), 100200);
    });

    QUnit.test('validate value on focusout', function(assert) {
        assert.expect(2);

        const element = $('#numberbox').dxNumberBox({
            value: 100,
            valueChangeEvent: 'change'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option('value'), 100);

        keyboard
            .caret(3)
            .type('..200');

        instance.blur();

        assert.strictEqual(instance.option('value'), 100, 'validate value on focusout');
    });

    QUnit.test('trigger invalid event', function(assert) {
        assert.expect(2);

        const element = $('#numberbox').dxNumberBox({
            value: 100,
            valueChangeEvent: 'change'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option('value'), 100);

        keyboard
            .caret(3)
            .type('..200');

        $input.trigger('invalid');

        assert.strictEqual(instance.option('value'), 100, 'validate value on invalid event');
    });

    QUnit.test('validate value on keyup', function(assert) {
        const element = $('#numberbox').dxNumberBox({
            value: 100,
            valueChangeEvent: 'keyup'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option('value'), 100);

        keyboard
            .type('1')
            .type('.');

        const expectedResult = 1.1;

        assert.strictEqual(instance.option('value'), expectedResult, 'value is correct');
    });

    QUnit.test('Validate value on keyup when 0 typing after a comma', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: null,
            valueChangeEvent: 'keyup',
            mode: 'text'
        });

        const instance = $element.dxNumberBox('instance');

        const $input = $element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type('1')
            .type(',')
            .type('0');

        let expectedValue = '1,0';

        assert.strictEqual($input.val(), expectedValue, 'comma has not disappear');

        keyboard
            .type('2');

        expectedValue = '1.02';

        assert.strictEqual(instance.option('value'), expectedValue++, 'value is correct');
    });

    QUnit.test('validate \'plus\' char typing', function(assert) {
        const element = $('#numberbox').dxNumberBox({
            value: 1,
            valueChangeEvent: 'change'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type('1')
            .type('+')
            .type('1')
            .change();

        assert.strictEqual(instance.option('value'), 1, 'value is correct');

        instance.option('value', null);

        keyboard
            .type('+')
            .type('1')
            .change();

        assert.strictEqual(instance.option('value'), 1, 'value is correct');
    });

    QUnit.test('validate \'minus\' char typing', function(assert) {
        const element = $('#numberbox').dxNumberBox({
            value: 1,
            valueChangeEvent: 'change'
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type('1')
            .type('-')
            .type('1')
            .change();

        assert.strictEqual(instance.option('value'), 1, 'value is correct');

        instance.option('value', null);

        $input
            .focus()
            .val('-11')
            .trigger('change');

        assert.strictEqual(instance.option('value'), -11, 'value is correct');
    });

    QUnit.test('regression test. Change value used option', function(assert) {
        assert.expect(1);

        const element = $('#numberbox').dxNumberBox({
            value: 100
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        instance.option('value', 200);

        assert.equal($input.val(), 200);
    });

    QUnit.test('\'text\' option should be correct', function(assert) {
        assert.expect(2);

        const element = $('#numberbox').dxNumberBox({
            value: 100
        });

        const instance = element.dxNumberBox('instance');
        assert.equal(instance.option('text'), '100', 'Text is OK');

        instance.option('value', 200);

        assert.equal(instance.option('text'), '200', 'Text is OK');
    });

    QUnit.test('placeholder is visible when value is invalid', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            placeholder: 'Placeholder',
            value: ''
        });

        const instance = $element.dxNumberBox('instance');
        const $placeholder = $element.find('.' + PLACEHOLDER_CLASS);

        assert.ok($placeholder.is(':visible'), 'placeholder is visible');
        instance.option('value', '10');
        assert.ok(!$placeholder.is(':visible'), 'placeholder is not visible with valid value');
        instance.option('value', 'sdg');
        assert.ok($element.find('.' + PLACEHOLDER_CLASS).is(':visible'), 'placeholder is visible with invalid value');
    });

    QUnit.test('init with option useLargeSpinButtons', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        assert.ok($element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has touchFriendly class');
    });

    QUnit.test('widget\'s width does not increase after buttons hover in FF (T806555)', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        const startHeight = $element.height();
        const $spinButton = $element.find(`.${SPIN_UP_CLASS}`);
        eventsEngine.trigger($spinButton, 'dxhoverstart');

        assert.strictEqual($element.height(), startHeight, 'widget\'s width does not change');
    });

    QUnit.testInActiveWindow('input is focused when spin buttons are clicked if useLargeSpinButtons = false', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: false
        });

        const $input = $element.find(`.${INPUT_CLASS}`);
        const $spinButton = $element.find('.dx-numberbox-spin-up');

        assert.ok(!$input.is(':focus'), 'input is not focused before click on spin button');
        $element.css('display'); // NOTE: FF test does not work without relayout

        $spinButton.trigger('dxpointerdown');
        assert.ok($input.is(':focus'), 'input is focused after click on spin button');
    });

    QUnit.test('spin button should have feedback after click on it', function(assert) {
        const FEEDBACK_SHOW_TIMEOUT = 30;
        this.clock = sinon.useFakeTimers();

        try {
            const $element = $('#numberbox').dxNumberBox({
                showSpinButtons: true
            });

            const $spinButton = $element.find('.dx-numberbox-spin-up');
            const mouse = pointerMock($spinButton).start();

            mouse.down();

            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.ok($spinButton.hasClass('dx-state-active'), 'spin button has active-state class');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('spin button should change value after long click on it', function(assert) {
        const FEEDBACK_SHOW_TIMEOUT = 500;
        this.clock = sinon.useFakeTimers();

        try {
            const $element = $('#numberbox').dxNumberBox({
                showSpinButtons: true,
                value: 100
            });

            const $spinButton = $element.find('.dx-numberbox-spin-up');
            const mouse = pointerMock($spinButton).start();

            mouse.down();

            const instance = $element.dxNumberBox('instance');

            assert.equal(instance.option('value'), 101, 'value is correct');
            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.equal(instance.option('value'), 101, 'value is correct');
            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.ok(instance.option('value') > 101, 'value is correct');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('hoverStateEnabled option', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            hoverStateEnabled: true
        });

        $element.trigger('dxhoverstart');
        assert.ok($element.hasClass('dx-state-hover'), 'dxNumberBox has hover class');

        $element.trigger('dxhoverend');
        assert.ok(!$element.hasClass('dx-state-hover'), 'dxNumberBox has not hover class');
    });

    QUnit.test('hoverStateEnabled option for spinButton', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            hoverStateEnabled: true,
            showSpinButtons: true
        });

        const $spinButton = $element.find('.dx-numberbox-spin-button');

        $spinButton.trigger('dxhoverstart');
        assert.ok($spinButton.hasClass('dx-state-hover'), 'Spin button has hover class after mouse enter on it');

        $spinButton.trigger('dxhoverend');
        assert.ok(!$spinButton.hasClass('dx-state-hover'), 'Spin button has not hover class after mouse enter on it');
    });

    QUnit.testInActiveWindow('input value is greeter or less after mousewheel action', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 100.6
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $numberBoxInput = $numberBox.find(`.${INPUT_CLASS}`);
        const mouse = pointerMock($numberBoxInput);

        $numberBoxInput.focus();
        $numberBoxInput.focus();

        mouse.wheel(10);
        assert.equal(numberBox.option('value'), 101.6, 'value is greeter after mousewheel up');

        mouse.wheel(-20);
        assert.equal(numberBox.option('value'), 100.6, 'value is less after mousewheel down');

        $numberBoxInput.blur();
        mouse.wheel(-20);
        assert.roughEqual(numberBox.option('value'), 100.6, 1.001);
    });

    QUnit.test('mousewheel action should not work in disabled state', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 100.6,
            disabled: true
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $numberBoxInput = $(`.${INPUT_CLASS}`, $numberBox);
        const mouse = pointerMock($numberBoxInput).start();

        $numberBoxInput.get(0).focus();

        mouse.wheel(10);
        assert.equal(numberBox.option('value'), 100.6, 'value is not changed');
    });

    QUnit.test('mousewheel action should not work if widget is not focused', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({ value: 100 });
        const numberBox = $numberBox.dxNumberBox('instance');
        const input = $(`.${INPUT_CLASS}`, $numberBox).get(0);
        const mouse = pointerMock(input).start();

        mouse.wheel(10);
        assert.strictEqual(numberBox.option('value'), 100);

        input.focus();

        mouse.wheel(10);
        assert.notStrictEqual(numberBox.option('value'), 100);
    });

    ['ctrlKey', 'metaKey'].forEach((commandKey) => {
        QUnit.test(`mousewheel action should not work for zooming (${commandKey} pressed)`, function(assert) {
            const $numberBox = $('#numberbox').dxNumberBox({
                value: 100.6
            });

            const numberBox = $numberBox.dxNumberBox('instance');
            const $numberBoxInput = $(`.${INPUT_CLASS}`, $numberBox);
            const mouse = pointerMock($numberBoxInput).start();

            $numberBoxInput.get(0).focus();

            mouse.wheel(10, { [commandKey]: true });
            assert.equal(numberBox.option('value'), 100.6, `value is not changed, ${commandKey} pressed`);
        });
    });

    QUnit.testInActiveWindow('input is not focused when spin buttons are clicked if useLargeSpinButtons = true', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        const $input = $element.find(`.${INPUT_CLASS}`);
        const $spinButton = $element.find('.dx-numberbox-spin-up');

        assert.ok(!$input.is(':focus'), 'input is not focused before click on spin button');
        $element.css('display'); // NOTE: FF test does not work without relayout

        $spinButton.trigger('dxpointerdown');

        assert.ok(!$input.is(':focus'), 'input is not focused after click on spin button');

        $element.css('display'); // NOTE: FF test does not work without relayout
        $input.focus();
        assert.ok($input.is(':focus'), 'input is focused');
        $spinButton.trigger('dxpointerdown');

        assert.ok($input.is(':focus'), 'input is still focused');
    });

    QUnit.test('correct order of buttons when widget is rendered', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true,
            showClearButton: true
        });
        const $buttons = $element.find('.dx-texteditor-buttons-container').children();

        assert.ok($buttons.eq(0).hasClass(CLEAR_BUTTON_CLASS), 'clear button is the first');
        assert.ok($buttons.eq(1).hasClass('dx-numberbox-spin-container'), 'spin buttons are the second');
    });

    QUnit.test('correct order of buttons when clear button option is set after rendering', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showSpinButtons: true
        });

        const instance = $element.dxNumberBox('instance');

        instance.option('showClearButton', true);

        const $buttons = $element.find('.dx-texteditor-buttons-container').children();

        assert.ok($buttons.eq(0).hasClass(CLEAR_BUTTON_CLASS), 'clear button is the first');
        assert.ok($buttons.eq(1).hasClass('dx-numberbox-spin-container'), 'spin buttons are the second');
    });

    QUnit.test('correct order of buttons when spin buttons option is set after rendering', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showClearButton: true
        });

        const instance = $element.dxNumberBox('instance');

        instance.option('showSpinButtons', true);

        const $buttons = $element.find('.dx-texteditor-buttons-container').children();
        assert.ok($buttons.eq(0).hasClass(CLEAR_BUTTON_CLASS), 'clear button is the first');
        assert.ok($buttons.eq(1).hasClass('dx-numberbox-spin-container'), 'spin buttons are the second');
    });

    QUnit.test('clearButton should clear the text even if the value was not changed', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showClearButton: true,
            value: null
        });

        const $input = $element.find(`.${INPUT_CLASS}`);
        const kb = keyboardMock($input);

        assert.strictEqual($input.val(), '', 'value was cleared');

        kb.type('123');
        const $clearButton = $element.find(`.${CLEAR_BUTTON_CLASS}`);
        $clearButton.trigger('dxclick');

        assert.strictEqual($input.val(), '', 'value is still cleared');
    });

    QUnit.test('clearButton should clear the text and reset incorrect value (T818673)', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            showClearButton: true,
            value: null
        });
        const instance = $element.dxNumberBox('instance');
        const $input = $element.find(`.${INPUT_CLASS}`);
        const kb = keyboardMock($input);

        kb.type('11');

        sinon.stub(instance, '_inputIsInvalid').callsFake(() => true);

        try {
            const $clearButton = $element.find(`.${CLEAR_BUTTON_CLASS}`);
            $clearButton.trigger('dxclick');
            assert.strictEqual($input.val(), '', 'value is still cleared');
        } finally {
            instance._inputIsInvalid.restore();
        }
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 5,
            displayValueFormatter(value) {
                return (value < 10 ? '0' : '') + value;
            }
        });

        assert.equal($numberBox.dxNumberBox('option', 'value'), 5, 'value is correct');
        assert.equal($numberBox.find(`.${INPUT_CLASS}`).val(), '05', 'input value is correct');
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option when value is changed using keyboard', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'this test is actual only for desktop ');
            return;
        }

        const $numberBox = $('#numberbox').dxNumberBox({
            value: 5,
            displayValueFormatter(value) {
                return (value < 10 ? '0' : '') + value;
            }
        });
        const instance = $numberBox.dxNumberBox('instance');

        const $input = $numberBox.find(`.${INPUT_CLASS}`);

        keyboardMock($input)
            .press('end')
            .type('0');

        $input.trigger('change');
        instance.blur();

        assert.equal(instance.option('value'), 50, 'value is correct');
        assert.equal($numberBox.find(`.${INPUT_CLASS}`).val(), '50', 'input value is correct');
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option when value is changed using spin buttons', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 5,
            displayValueFormatter(value) {
                return (value < 10 ? '0' : '') + value;
            },
            showSpinButtons: true
        });

        const $spinUpButton = $numberBox.find('.dx-numberbox-spin-up');

        $spinUpButton.trigger('dxpointerdown');

        assert.equal($numberBox.dxNumberBox('option', 'value'), 6, 'value is correct');
        assert.equal($numberBox.find(`.${INPUT_CLASS}`).val(), '06', 'input value is correct');
    });

    QUnit.test('T351846 - the value should not be changed after the \'change\' input event is fired if value is null', function(assert) {
        let valueChangedCount = 0;

        const $numberBox = $('#numberbox').dxNumberBox({
            value: null,
            onValueChanged() {
                valueChangedCount++;
            }
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);

        keyboardMock($input)
            .focus()
            .change();

        assert.equal(valueChangedCount, 0, 'the \'onValueChanged\' action is not fired');
        assert.equal($numberBox.dxNumberBox('option', 'value'), null, 'value is correct');
    });

    QUnit.test('T351846 - the value should be reset to null if input is cleared', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 0
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);

        keyboardMock($input)
            .focus()
            .press('end')
            .press('backspace')
            .change();

        assert.equal($numberBox.dxNumberBox('option', 'value'), null, 'value is correct');
    });

    QUnit.test('the value should be cleared to null if clear method called', function(assert) {
        const numberBox = $('#numberbox').dxNumberBox({
            value: 0
        }).dxNumberBox('instance');

        numberBox.clear();

        assert.equal(numberBox.option('value'), null, 'value is correct');
    });

    QUnit.test('The value option should not be changed if it is invalid', function(assert) {
        const value = 'any invalid value';

        const $numberBox = $('#numberbox').dxNumberBox({
            value
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);

        assert.equal(numberBox.option('value'), value, 'value is not changed');
        assert.ok(!numberBox.option('isValid'), 'the \'isValid\' option is false');
        assert.equal($input.val(), '', 'input value is cleared');
    });

    QUnit.test('The value option should not be reset if it is invalid', function(assert) {
        const value = 'any invalid value';

        const $numberBox = $('#numberbox').dxNumberBox({
            value: 5
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);

        numberBox.option('value', value);
        assert.equal(numberBox.option('value'), value, 'value is not reset');
        assert.ok(!numberBox.option('isValid'), 'the \'isValid\' option is false');
        assert.equal($input.val(), '', 'input value is cleared');
    });

    QUnit.test('The widget should be valid if the value option is undefined', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: undefined
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);

        assert.ok(numberBox.option('isValid'), 'widget is valid');
        assert.equal($input.val(), '', 'input value is correct');
    });

    QUnit.test('The widget should be invalid if isValid option is false on init but value format is correct', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 0,
            isValid: false
        });

        assert.ok($numberBox.hasClass(INVALID_CLASS), 'widget is invalid');
    });

    QUnit.test('It should be possible to set negative value via scroll when min is null', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            min: null,
            value: 0,
            showSpinButtons: true
        });

        const instance = $numberBox.dxNumberBox('instance');
        const $spinDown = $numberBox.find('.' + SPIN_DOWN_CLASS);

        $spinDown.trigger('dxpointerdown');

        assert.strictEqual(instance.option('value'), -1, 'value is not set to negative number');
    });
});

QUnit.module('submit element', {}, () => {
    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#numberbox').dxNumberBox();
        const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal($hiddenInput.length, 1, 'a hidden input is created');
    });

    QUnit.test('the hidden input should get correct value on init', function(assert) {
        const expectedValue = 24.8;

        const $element = $('#numberbox').dxNumberBox({
            value: expectedValue
        });

        const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal(parseFloat($hiddenInput.val()), expectedValue, 'the hidden input has correct value after init');
    });

    QUnit.test('the hidden input gets correct value after widget value is changed', function(assert) {
        const expectedValue = 13;

        const $element = $('#numberbox').dxNumberBox({
            value: 24.6
        });

        const instance = $element.dxNumberBox('instance');
        const $hiddenInput = $element.find('input[type=\'hidden\']');

        instance.option('value', expectedValue);
        assert.equal(parseInt($hiddenInput.val()), expectedValue, 'the hidden input value is correct');
    });

    QUnit.test('the hidden input should use the decimal separator specified in DevExpress.config', function(assert) {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: '|' });

            const $element = $('#numberbox').dxNumberBox({
                value: 12.25
            });

            const $hiddenInput = $element.find('input[type=\'hidden\']');

            assert.equal($hiddenInput.val(), '12|25', 'the correct decimal separator is used');
        } finally {
            config(originalConfig);
        }
    });
});

QUnit.module('the \'name\' option', {}, () => {
    QUnit.test('hidden input should get the \'name\' attribute', function(assert) {
        const expectedName = 'name';

        $('#numberbox').dxNumberBox({
            name: expectedName
        });

        const $hiddenInput = $('input[type=\'hidden\']');

        assert.equal($hiddenInput.attr('name'), expectedName, 'hidden input has correct \'name\' attribute');
    });

    QUnit.test('editor input should not get the \'name\' attribute', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            name: 'name'
        });

        const input = $element.find('.' + INPUT_CLASS).get(0);

        assert.notOk(input.hasAttribute('name'), 'edior input does not have the \'name\' attribute');
    });
});

QUnit.module('input value updating', {}, () => {
    QUnit.test('value should not be redrawn if it equals previous value', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: 0
        });

        const $input = $element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .press('del')
            .type('00')
            .change();
        $input.trigger('change');
        assert.equal($input.val(), '00');
    });

    QUnit.test('value should not be redrawn if it does not equals previous value', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: 1
        });

        const $input = $element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .press('del')
            .type('00')
            .change();
        $input.trigger('change');
        assert.equal($input.val(), '00');
    });

    QUnit.test('value should not be redrawn if it is incomplete and valueChangeEvent is set to keyup', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: null,
            valueChangeEvent: 'keyup',
            mode: 'text'
        });

        const instance = $element.dxNumberBox('instance');
        const $input = $element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.val('');
        keyboard
            .type('-');
        assert.equal($input.val(), '-');
        instance.blur();

        $input.val('');
        keyboard
            .type('2e');
        assert.equal($input.val(), '2e');
        instance.blur();

        $input.val('');
        keyboard
            .type('.5');

        assert.equal($input.val(), '.5');
        instance.blur();
        assert.equal(instance.option('value'), 0.5);

        $input.val('1');
        keyboard
            .caret(1)
            .type('.')
            .triggerEvent('keyup');

        keyboard
            .type('5')
            .triggerEvent('keyup');

        assert.equal($input.val(), '1.5');
        instance.blur();

        $input.val('');
        keyboard
            .type('-')
            .triggerEvent('keyup');

        keyboard
            .type('5')
            .triggerEvent('keyup');

        assert.equal($input.val(), '-5');
        instance.blur();
    });

    QUnit.test('T378082 - value should be null if the incorrect value is entered', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: null,
            mode: 'text'
        });

        const $input = $element.find('.' + INPUT_CLASS);

        keyboardMock($input)
            .type('..')
            .change();

        assert.equal($element.dxNumberBox('option', 'value'), null, 'value is correct');
    });

    QUnit.test('value should be updated when it was incomplete', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: null,
            mode: 'text'
        });

        const instance = $element.dxNumberBox('instance');
        const $input = $element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type('7.').change();

        assert.equal(instance.option('value'), 7, 'value is correct');
        assert.equal($input.val(), '7.', 'input is not cleaned yet');

        instance.blur();
        assert.equal(instance.option('value'), 7, 'value is correct');
        assert.equal($input.val(), '7', 'input is cleaned');
    });
});

QUnit.module('options changed callbacks', {
    beforeEach: function() {
        this.element = $('#numberbox');
        this.instance = this.element.dxNumberBox().dxNumberBox('instance');
    }
}, () => {
    QUnit.test('min/max', function(assert) {
        assert.expect(2);

        this.instance.option('min', 123);
        assert.equal(this.element.find('.' + INPUT_CLASS).prop('min'), '123');

        this.instance.option('max', 321);
        assert.equal(this.element.find('.' + INPUT_CLASS).prop('max'), '321');
    });

    QUnit.test('step', function(assert) {
        assert.expect(1);

        this.instance.option('step', 123);
        assert.equal(this.element.find('.' + INPUT_CLASS).prop('step'), '123');
    });

    QUnit.test('min/max: value changes to limited value', function(assert) {
        assert.expect(4);

        const $input = this.element.find('.' + INPUT_CLASS);

        this.instance.option('min', 100);
        this.instance.option('max', 200);

        $input
            .focus()
            .val('99')
            .trigger('change');

        assert.equal($input.val(), 100);

        $input
            .focus()
            .val('201')
            .trigger('change');
        assert.equal($input.val(), 200);

        this.instance.option('value', 90);
        assert.equal($input.val(), 90, 'set value less than min with option');

        this.instance.option('value', 203);
        assert.equal($input.val(), 203, 'set value more than min with option');
    });

    QUnit.test('min/max: value changes when max wasn\'t set', function(assert) {
        const $input = this.element.find('.' + INPUT_CLASS);

        this.instance.option('min', 100);

        $input
            .focus()
            .val('99')
            .trigger('change');

        assert.equal($input.val(), 100);
    });

    QUnit.test('min/max: value changes when min wasn\'t set', function(assert) {
        const $input = this.element.find('.' + INPUT_CLASS);

        this.instance.option('min', undefined);
        this.instance.option('max', 100);

        $input
            .focus()
            .val('101')
            .trigger('change');

        assert.equal($input.val(), 100);
    });

    QUnit.test('changing min limit should lead to value change in base numberbox', function(assert) {
        this.instance.option({
            value: 5,
            min: 1
        });

        this.instance.option('min', 6);
        assert.equal(this.instance.option('value'), 6, 'value has been updated');
    });

    QUnit.test('changing max limit should lead to value change in base numberbox', function(assert) {
        this.instance.option({
            value: 5,
            max: 6
        });

        this.instance.option('max', 4);
        assert.equal(this.instance.option('value'), 4, 'value has been updated');
    });

    QUnit.test('min/max: value changes to limited value with number mode', function(assert) {
        this.instance.option({
            mode: 'number',
            valueChangeEvent: 'keyup',
            min: 10,
            max: 20
        });

        const $input = this.element.find('.' + INPUT_CLASS);
        const kb = keyboardMock($input);

        $input.val('');
        kb.type('9');

        assert.equal($input.val(), 10, 'input value was changed to the minimum after changing via input');
        assert.equal(this.instance.option('value'), 10, 'widget\'s value was changed to the minimum after changing via input');

        $input.val('');
        kb.type('219');

        assert.equal($input.val(), 20, 'input value was changed to the maximum after changing via input');
        assert.equal(this.instance.option('value'), 20, 'widget\'s value was changed to the maximum after changing via input');
    });

    QUnit.test('min/max: value changes if value is negative', function(assert) {
        const $input = this.element.find('.' + INPUT_CLASS);

        this.instance.option('min', -30);
        this.instance.option('max', -10);

        $input
            .focus()
            .val('-100')
            .trigger('change');

        assert.equal($input.val(), -30);

        $input
            .focus()
            .val('-5')
            .trigger('change');

        assert.equal($input.val(), -10);

        this.instance.option('value', -50);
        assert.equal($input.val(), -50, 'set value less than min with option');

        this.instance.option('value', -5);
        assert.equal($input.val(), -5, 'set value more than min with option');
    });

    QUnit.test('value starts from decimal', function(assert) {
        assert.expect(1);

        const $input = this.element.find('.' + INPUT_CLASS);

        $input.get(0)
            .focus();

        $input
            .focus()
            .val('.1')
            .trigger('change');

        assert.equal(this.instance.option('value'), 0.1, 'value is right');
    });

    QUnit.test('showSpinButtons', function(assert) {
        assert.expect(5);

        assert.ok(!this.element.hasClass(SPIN_CLASS), 'on default spin classes aren\'t applied');
        let $spinContainer = this.element.find('.' + SPIN_CONTAINER_CLASS);
        assert.ok(!$spinContainer.length, 'on default spins aren\'t added');

        this.instance.option('showSpinButtons', true);
        assert.ok(this.element.hasClass(SPIN_CLASS), 'spin classes are applied');
        $spinContainer = this.element.find('.' + SPIN_CONTAINER_CLASS);
        assert.ok($spinContainer.length, 'spins are added');

        this.instance.option('showSpinButtons', false);
        assert.ok(!this.element.hasClass(SPIN_CLASS), 'spin classes aren\'t applied');
        $spinContainer = this.element.find('.' + SPIN_CONTAINER_CLASS);
    });

    QUnit.test('spin edit handling', function(assert) {
        assert.expect(3);

        this.instance.option('showSpinButtons', true);
        this.instance.option('value', 100);

        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '101');

        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '100');

        $input.val('');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '-1');
    });

    QUnit.test('interactions with spin buttons do not change value if the readOnly option was set to true', function(assert) {
        this.instance.option('showSpinButtons', true);
        this.instance.option('value', 100);
        this.instance.option('readOnly', true);

        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const mouse = pointerMock($spinUp).start();

        mouse.click();

        assert.equal($input.val(), '100');
    });

    QUnit.test('correct round value with integer step', function(assert) {
        this.instance.option('showSpinButtons', true);
        this.instance.option('value', 0.2);
        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '1.2');

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '2.2');
        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '3.2');

        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '2.2');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '1.2');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '0.2');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '-0.8');
    });

    QUnit.test('correct round value with float step', function(assert) {
        this.instance.option('showSpinButtons', true);
        this.instance.option('value', 1.4);
        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);
        this.instance.option('step', 1.81);

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '3.21');

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '5.02');

        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '3.21');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '1.4');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '-0.41');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '-2.22');
    });

    QUnit.test('keep null value with 0 step', function(assert) {
        this.instance.option('showSpinButtons', true);
        this.instance.option('value', null);
        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);
        this.instance.option('step', 0);

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '');

        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '');
    });

    QUnit.test('spin edit min/max', function(assert) {
        assert.expect(2);

        this.instance.option({
            showSpinButtons: true,
            value: 1,
            min: 0,
            max: 1
        });

        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);

        $spinUp.trigger('dxpointerdown');
        assert.equal($input.val(), '1', 'max value is right');

        $spinDown.trigger('dxpointerdown');
        $spinDown.trigger('dxpointerdown');
        assert.equal($input.val(), '0', 'min value is right');
    });

    QUnit.test('valueChanged event should not be raised after click on spinDown if current value is minimum', function(assert) {
        assert.expect(1);

        this.instance.option({
            showSpinButtons: true,
            value: 1,
            min: 0,
            onValueChanged() {
                assert.ok(true);
            }
        });

        const $spinDown = this.element.find(`.${SPIN_DOWN_CLASS}`);

        $spinDown.trigger('dxpointerdown');
        $spinDown.trigger('dxpointerdown');
    });

    QUnit.test('valueChanged event should not be raised after click on spinUp if current value is maximum', function(assert) {
        assert.expect(1);

        this.instance.option({
            showSpinButtons: true,
            value: 1,
            max: 2,
            onValueChanged() {
                assert.ok(true);
            }
        });

        const $spinUp = this.element.find(`.${SPIN_UP_CLASS}`);

        $spinUp.trigger('dxpointerdown');
        $spinUp.trigger('dxpointerdown');
    });

    QUnit.test('spin edit long click handling', function(assert) {
        assert.expect(1);

        this.clock = sinon.useFakeTimers();
        try {
            this.instance.option('showSpinButtons', true);
            this.instance.option('value', 100);

            const $input = this.element.find('.' + INPUT_CLASS);
            const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
            const mouse = pointerMock($spinUp).start();

            mouse.down();

            this.clock.tick(800);

            mouse.up();

            assert.equal($input.val(), '102', 'long click is handled');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('spin edit very long click handling', function(assert) {
        assert.expect(2);

        this.clock = sinon.useFakeTimers();
        try {
            this.instance.option('showSpinButtons', true);
            this.instance.option('value', 100);

            const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
            const pointer = pointerMock($spinUp).start();

            pointer.down();
            this.clock.tick(1800);
            assert.ok($spinUp.hasClass(ACTIVE_STATE_CLASS), 'active class present during hold');

            pointer.up();
            assert.ok(!$spinUp.hasClass(ACTIVE_STATE_CLASS), 'active class not present during hold');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('spin button should not catch dxhold event from parent dom elements', function(assert) {
        this.instance.option('showSpinButtons', true);
        this.instance.option('value', 100);

        this.clock = sinon.useFakeTimers();
        try {
            const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
            const pointer = pointerMock($spinUp).start();

            pointer.down();
            $spinUp.trigger('dxhold');
            this.element.trigger('dxhold');
            this.clock.tick(500);

            assert.equal(this.instance.option('value'), 107, 'value is correct');
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test('spin edit immediately after keyboard input', function(assert) {
        this.instance.option('showSpinButtons', true);

        const $input = this.element.find('.' + INPUT_CLASS);
        const $spinUp = this.element.find('.' + SPIN_UP_CLASS);
        const $spinDown = this.element.find('.' + SPIN_DOWN_CLASS);

        this.instance.option('value', '10');
        $input.val('30');
        $spinUp.trigger('dxpointerdown');
        assert.equal(this.instance.option('value'), 31, 'widget has correct value after spinUp click');
        assert.equal($input.val(), 31, 'displayed value is correct after spinUp click');

        this.instance.option('value', '10');
        $input.val('30');
        $spinDown.trigger('dxpointerdown');
        assert.equal(this.instance.option('value'), 29, 'widget has correct value after spinDown click');
        assert.equal($input.val(), 29, 'displayed value is correct after spinDown click');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.instance.option({
            onValueChanged() {
                assert.ok(true);
            }
        });
        this.instance.option('value', true);
    });

    QUnit.test('Placeholder must not be visible after setting value by option', function(assert) {
        this.instance.option({ placeholder: '1', value: '' });
        assert.ok(this.element.find('.dx-placeholder').is(':visible'), 'placeholder is visible');

        this.instance.option('value', '23');
        assert.ok(this.element.find('.dx-placeholder').is(':hidden'), 'placeholder is hidden');
    });

    QUnit.test('useLargeSpinButtons option changed', function(assert) {
        this.instance.option({
            showSpinButtons: true,
            useLargeSpinButtons: false
        });

        assert.ok(!this.element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has not touchFriendly class');

        this.instance.option({ useLargeSpinButtons: true });
        assert.ok(this.element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has touchFriendly class');
    });
});

QUnit.module('regressions', {
    beforeEach: function() {
        this.element = $('#numberbox').dxNumberBox();
        this.instance = this.element.dxNumberBox('instance');
    }
}, () => {
    QUnit.test('B230398', function(assert) {
        assert.expect(3);

        const element = $('#numberbox').dxNumberBox({ value: '', placeholder: 'auto' });
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = element.dxNumberBox('instance');

        assert.equal(instance.option('value'), '');

        keyboard
            .type('10')
            .change();

        assert.equal(instance.option('value'), 10);

        keyboard
            .press('backspace')
            .press('backspace')
            .change();

        assert.equal(instance.option('value'), null);
    });

    QUnit.test('B234644 - break value update handler in google chrome at desktop and android', function(assert) {
        if(!/chrome/i.test(navigator.userAgent)) {
            assert.ok(true);
            return;
        }

        const $input = this.element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        this.instance.option('value', '1');

        keyboard
            .type('.1.1')
            .change();

        this.instance.blur();

        if(this.instance.option('mode') === 'text') {
            assert.equal(this.instance.option('value'), 0.1, 'check that incorrect input handling is work');
            assert.equal($input.val(), 0.1, 'check input value');
        } else {
            assert.equal(this.instance.option('value'), 1, 'check that incorrect input handling is work');
            assert.equal($input.val(), 1, 'check input value');
        }

        keyboard
            .type('1...')
            .change();

        this.instance.blur();
        assert.equal(this.instance.option('value') || '', $input.val(), 'check that input value equal option value after incorrect value');
    });

    QUnit.test('B233615 dxNumberbox UI value reset after \'type\' option changing in Opera', function(assert) {
        assert.expect(3);

        this.instance.option('value', 100);
        assert.equal(this.instance.option('value'), 100, 'check that we init value option');
        this.instance.option('type', 'number');
        assert.equal(this.instance.option('value'), 100, 'check that value option is ok');
        assert.equal(this.element.find('.' + INPUT_CLASS).val(), 100, 'find and check that value from jQuery is ok too');
    });

    QUnit.test('B235175 - add additional test cases for various numbers', function(assert) {
        assert.expect(10);

        const $input = this.element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;
        const isTextMode = instance.option('mode') === 'text';
        let expectedInputValue;

        instance.option('value', '1');

        $input.focus()
            .val('1e2')
            .trigger('change');
        assert.strictEqual(instance.option('value'), 100, 'check widgets option value 100');
        instance.blur();
        expectedInputValue = isTextMode ? '100' : '1e2';
        assert.strictEqual($input.val(), expectedInputValue, 'check input value 100');

        $input.focus()
            .val('2e+3')
            .trigger('change');
        assert.strictEqual(instance.option('value'), 2000, 'check widgets option value 2000');
        instance.blur();
        expectedInputValue = isTextMode ? '2000' : '2e+3';
        assert.strictEqual($input.val(), expectedInputValue, 'check input value 2000');

        $input.focus()
            .val('1e-2')
            .trigger('change');
        assert.strictEqual(instance.option('value'), 0.01, 'check widgets option value 0.01');
        instance.blur();
        expectedInputValue = isTextMode ? '0.01' : '1e-2';
        assert.strictEqual($input.val(), expectedInputValue, 'check input value 0.01');

        instance.option('value', '');

        keyboard
            .focus()
            .type(' 2')
            .change();
        assert.equal(instance.option('value'), 2, 'check widgets option value 2');
        instance.blur();
        assert.equal($input.val(), '2', 'check input value 2');

        instance.option('value', '1');
        keyboard
            .focus()
            .type(' 1')
            .change();
        assert.equal(instance.option('value'), 11, 'check widgets option value 1');
        instance.blur();
        assert.equal($input.val(), '11', 'check input value 1');
    });

    QUnit.test('B235175 - one case for minmax numberbox', function(assert) {
        assert.expect(4);

        const $input = this.element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;

        instance.option('value', '6');
        instance.option('max', 50);

        keyboard
            .type('9')
            .change();

        assert.equal(instance.option('value'), 50, 'check widgets option value 50');
        assert.equal($input.val(), '50', 'check input value 50');

        instance.option('value', '6');
        keyboard
            .type('9')
            .change();
        assert.equal(instance.option('value'), 50, 'check widgets option value 50');
        assert.equal($input.val(), '50', 'check input value 50');
    });

    QUnit.test('numberbox should correctly process \'undefined\' value', function(assert) {
        const instance = this.instance;

        instance.option('value', undefined);

        assert.equal(instance.option('value'), null, 'value was reset correctly');
    });

    QUnit.test('B236651 - when we try set zero value that do not change', function(assert) {
        assert.expect(4);

        const $input = this.element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;
        instance.option('value', '');

        keyboard
            .focus()
            .type('69')
            .change();
        assert.equal(instance.option('value'), 69, 'check widgets option value 69');
        assert.equal($input.val(), '69', 'check input value 69');

        keyboard
            .focus()
            .press('backspace')
            .press('backspace')
            .type('0')
            .change();

        assert.equal(instance.option('value'), 0, 'check widgets option value 0');
        assert.equal($input.val(), '0', 'check input value 0');
    });

    QUnit.test('Both comma and dot can be used as float separator (Q561267)', function(assert) {
        assert.expect(4);

        const $input = this.element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;

        instance.option('value', null);

        $input.attr('type', 'text');
        keyboard
            .focus()
            .type('1.1')
            .change();

        assert.equal(instance.option('value'), 1.1);
        instance.blur();
        assert.equal($input.val(), '1.1');

        instance.option('value', '');

        keyboard
            .focus()
            .type('1,2')
            .change();

        assert.equal(instance.option('value'), 1.2);
        instance.blur();
        assert.equal($input.val(), '1.2');
    });

    QUnit.test('Complete dispose dxNumberBox', function(assert) {
        this.instance._dispose();
        assert.ok(!this.element.children().length);
    });

    QUnit.test('widget disabled state change should lead to spin buttons disabled state change (T282446)', function(assert) {
        const $element = $('#widget').dxNumberBox({
            disabled: true,
            showSpinButtons: true
        });

        const instance = $element.dxNumberBox('instance');
        const $spinButton = $element.find('.dx-numberbox-spin-button');

        instance.option('disabled', false);

        assert.ok(!SpinButton.getInstance($spinButton).option('disabled'), 'spin button disabled state is correct');
    });

    QUnit.test('tabindex attribute should be rendered after initialization', function(assert) {
        const instance = $('#widget').dxNumberBox({
            tabIndex: 3,
            value: 1,
            min: 1
        }).dxNumberBox('instance');

        const $input = instance.$element().find(`.${INPUT_CLASS}`);
        assert.strictEqual($input.attr('tabIndex'), '3', 'tabIndex is correct after initializing');
    });

    ['min', 'max', 'step'].forEach(optionName => {
        QUnit.test(`tabindex attribute shouldn't be removed after change of ${optionName} option (T1090255)`, function(assert) {
            const instance = $('#widget').dxNumberBox({
                tabIndex: 3,
                value: 1,
                min: 1
            }).dxNumberBox('instance');

            instance.option(optionName, 4);

            const $input = instance.$element().find(`.${INPUT_CLASS}`);
            assert.strictEqual($input.attr('tabIndex'), '3', 'tabIndex is correct after option changed');
        });
    });
});

QUnit.module('widget sizing render', {}, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxNumberBox();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxNumberBox({ width: 400 });
        const instance = $element.dxNumberBox('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxNumberBox();
        const instance = $element.dxNumberBox('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxNumberBox();
        const instance = $element.dxNumberBox('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', {}, () => {
    QUnit.test('control keys test', function(assert) {
        const element = $('#numberbox').dxNumberBox({
            focusStateEnabled: true,
            value: 100
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.equal(instance.option('value'), 100);

        keyboard.keyDown('up');
        assert.equal(instance.option('value'), 101, 'value is correct after upArrow press');

        keyboard.keyDown('down');
        assert.equal(instance.option('value'), 100, 'value is correct after downArrow press');

        instance.option('step', 2);

        keyboard.keyDown('down');
        assert.equal(instance.option('value'), 98, 'value is correct after downArrow press');

        keyboard.keyDown('up');
        assert.equal(instance.option('value'), 100, 'value is correct after upArrow press');
    });

    QUnit.test('it is impossible to change value by keyboard in readonly editor', function(assert) {
        const element = $('#numberbox').dxNumberBox({
            focusStateEnabled: true,
            readOnly: true,
            value: 100
        });

        const instance = element.dxNumberBox('instance');
        const $input = element.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.equal(instance.option('value'), 100);

        keyboard.keyDown('up');
        assert.equal(instance.option('value'), 100, 'value is correct after upArrow press');

        keyboard.keyDown('down');
        assert.equal(instance.option('value'), 100, 'value is correct after downArrow press');
    });

    QUnit.test('keypress with meta key should not be prevented', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        let isKeyPressPrevented = false;
        $input.on('keypress', e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });
        keyboard.triggerEvent('keypress', { key: '0', metaKey: true });
        assert.equal(isKeyPressPrevented, false, 'keypress with meta is not prevented');
    });

    QUnit.test('keypress with ctrl key should not be prevented', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        let isKeyPressPrevented = false;
        $input.on('keypress', e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });
        keyboard.triggerEvent('keypress', { key: '0', ctrlKey: true });
        assert.equal(isKeyPressPrevented, false, 'keypress with meta is not prevented');
    });

    QUnit.test('control keys should not be prevented', function(assert) {
        const controlKeys = ['Tab', 'Del', 'Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        let isKeyPressPrevented = false;
        const $numberBox = $('#numberbox').dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.on('keypress', e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });

        $.each(controlKeys, (_, key) => {
            isKeyPressPrevented = false;
            keyboard.triggerEvent('keypress', { key });
            assert.equal(isKeyPressPrevented, false, key + ' is not prevented');
        });
    });

    [
        { key: 'ArrowUp', ctrlKey: true },
        { key: 'ArrowDown', ctrlKey: true },
        { key: 'ArrowUp', metaKey: true },
        { key: 'ArrowDown', metaKey: true }
    ].forEach((keyDownConfig) => {
        const commandKey = keyDownConfig.ctrlKey ? 'ctrl' : 'command';
        QUnit.test(`default behavior of ${keyDownConfig.key} arrow key with ${commandKey} key should not be prevented`, function(assert) {
            const initialValue = 1;
            const $numberBox = $('#numberbox').dxNumberBox({
                focusStateEnabled: true,
                value: initialValue
            });
            const $input = $numberBox.find(`.${INPUT_CLASS}`);
            const keyboard = keyboardMock($input);

            keyboard.keyDown(keyDownConfig.key, keyDownConfig);

            assert.strictEqual($input.val(), initialValue.toString(), 'input value still same');
            assert.notOk(keyboard.event.isDefaultPrevented(), 'event is not prevented');
            assert.notOk(keyboard.event.isPropagationStopped(), 'propogation is not stopped');
        });
    });
});

QUnit.module('number validation', {}, () => {
    QUnit.test('decimal is not removed on valueChangeEvent', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            valueChangeEvent: 'keyup'
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);
        $input.val('1').trigger('keyup');
        $input.val('1.').trigger('keyup');

        const inputValue = $input.val();

        $input.trigger('keyup');

        assert.equal($input.val(), inputValue, 'decimal not removed');
    });

    QUnit.test('T277051 - the \'e\' letter entered in the center of text should not be ignored', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 95
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find(`.${INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .caret(1)
            .type('e0');

        $input
            .change();

        assert.equal(numberBox.option('value'), 900000, 'value is correct');
    });

    QUnit.test('T303827: Delete last number in scientific notation with valueChangeEvent:\'keyup\'', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            valueChangeEvent: 'keyup'
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        const isTextMode = numberBox.option('mode') === 'text';

        const initialValue = '888888888888888888888888888888';

        keyboard
            .type(initialValue);

        numberBox.blur();
        numberBox.focus();

        keyboard
            .caret(30)
            .press('backspace');

        $input.trigger('keyup');

        const expectedInputValue = isTextMode ? '8.888888888888888e+3' : '888888888888888888888888888880';
        assert.equal($input.val(), expectedInputValue, 'last digit was deleted');

        const expectedOptionValue = isTextMode ? '8.888888888888888e+3' : '8.888888888888888e+29';
        assert.equal(numberBox.option('value'), expectedOptionValue, 'value vas changed');
    });

    QUnit.test('Value shouldn\'t be reset after point remove', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            valueChangeEvent: 'keyup',
            value: 55.3
        });

        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.prop('type', 'text');

        keyboard
            .caret(7)
            .press('backspace')
            .press('backspace');

        assert.equal($input.val(), '55', 'value is correct');
    });

    QUnit.test('When is type \'number\' set entered characters should be saved', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            valueChangeEvent: 'keyup',
            value: null
        });

        const numberBox = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);

        $input.prop('type', 'text');
        $input
            .val('.')
            .trigger('keyup');

        assert.equal(numberBox.option('value'), null, 'value is correct');

        $input
            .val('.5')
            .trigger('keyup');

        const validityState = $input.get(0).validity;
        const isBadInputDefined = validityState && validityState.badInput !== undefined;
        if(isBadInputDefined) {
            assert.equal(validityState.badInput, false, 'validity is valid');
        }
        assert.equal(numberBox.option('value'), '0.5', 'value is correct');
    });

    QUnit.test('the validation message should be shown if value is invalid', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 'abc'
        });

        const instance = $numberBox.dxNumberBox('instance');

        assert.equal($numberBox.find(INVALID_MESSAGE_POPUP_CONTENT_SELECTOR).text(), instance.option('invalidValueMessage'), 'validation message is rendered');
    });

    QUnit.test('custom validation message can be changed at runtime', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 'abc'
        });
        const instance = $numberBox.dxNumberBox('instance');

        instance.option('invalidValueMessage', 'test message');
        instance.option('value', 'ab');

        assert.strictEqual($numberBox.find(INVALID_MESSAGE_POPUP_CONTENT_SELECTOR).text(), 'test message', 'new validation message is applyed after the value change');
    });

    QUnit.test('the validation message should be shown if value is invalid after \'enter\' key was pressed', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            valueChangeEvent: 'input'
        }).dxValidator({
            validationRules: [
                {
                    type: 'range',
                    min: 3,
                    max: 10,
                    message: 'Value is not in range'
                }
            ]
        });

        const instance = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find('.' + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type('2');
        keyboard.change();
        assert.equal($numberBox.find(INVALID_MESSAGE_POPUP_CONTENT_SELECTOR).text(), instance.option('validationError').message, 'validation message is rendered');

        keyboard.press('enter');

        assert.equal($numberBox.find(INVALID_MESSAGE_POPUP_CONTENT_SELECTOR).text(), 'Value is not in range', 'validation message is not empty');
    });
});

QUnit.module('aria accessibility', {}, () => {
    QUnit.test('default render', function(assert) {
        const $element = $('#numberbox').dxNumberBox({});
        const $input = $element.find(`.${INPUT_CLASS}`);
        const inputElement = $input.get(0);

        assert.equal($input.attr('role'), 'spinbutton', 'aria role is correct');
        assert.equal($input.attr('aria-valuenow'), '0', 'required \'aria-valuenow\' attribute is defined');
        assert.notOk(inputElement.hasAttribute('aria-valuetext'), '\'aria-valuetext\' attribute isn\'t defined');
        assert.ok(inputElement.hasAttribute('aria-valuemin'), 'required \'aria-valuemin\' attribute is defined');
        assert.ok(inputElement.hasAttribute('aria-valuemax'), 'required \'aria-valuemax\' attribute is defined');
    });

    QUnit.test('aria-valuenow is defined for numberBox with null value (T801129)', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            value: null
        });

        const $input = $element.find(`.${INPUT_CLASS}`);
        assert.strictEqual($input.attr('aria-valuenow'), '', 'attribute is defined');
        assert.strictEqual($input.attr('aria-valuetext'), 'No data', '\'aria-valuetext\' attribute is defined when the value isn\'t defined');
    });

    QUnit.test('\'aria-valuetext\' attribute must be correctly updated after changing the value', function(assert) {
        const $element = $('#numberbox').dxNumberBox({});
        const instance = $element.dxNumberBox('instance');
        const $input = $element.find(`.${INPUT_CLASS}`);

        instance.option('value', null);

        assert.strictEqual($input.attr('aria-valuenow'), '', 'attribute is defined');
        assert.strictEqual($input.attr('aria-valuetext'), 'No data', '\'aria-valuetext\' attribute is defined when the value isn\'t defined');

        instance.option('value', 5);

        assert.strictEqual($input.attr('aria-valuenow'), '5', 'attribute is defined');
        assert.notOk($input.get(0).hasAttribute('aria-valuetext'), '\'aria-valuetext\' attribute isn\'t defined');
    });

    QUnit.test('aria properties', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            min: 12,
            max: 30,
            value: 25
        });

        const $input = $element.find(`.${INPUT_CLASS}`);

        assert.equal($input.attr('aria-valuemin'), 12, 'aria min is correct');
        assert.equal($input.attr('aria-valuemax'), 30, 'aria max is correct');
        assert.equal($input.attr('aria-valuenow'), 25, 'aria now is correct');
    });

    QUnit.test('aria-valuemin and valuemax attributes should be set when min/max option is 0', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            min: 0,
            max: 0
        });

        const $input = $element.find(`.${INPUT_CLASS}`);

        assert.strictEqual($input.attr('aria-valuemin'), '0', 'aria min is correct');
        assert.strictEqual($input.attr('aria-valuemax'), '0', 'aria max is correct');
    });

    QUnit.test('the dxNumberBox should have value[min/max] when max or min only is specified', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            max: 30,
            value: 25
        });
        const numberBox = $element.dxNumberBox('instance');
        const $input = $element.find(`.${INPUT_CLASS}`).get(0);

        assert.ok($input.hasAttribute('aria-valuemin'), 'there is valuemin');

        numberBox.option({
            min: 4,
            max: undefined
        });
        assert.ok($input.hasAttribute('aria-valuemax'), 'there is valuemax');
        assert.strictEqual($($input).attr('aria-valuemin'), '4', 'valuemin is correct');

        numberBox.option({
            min: undefined,
            max: undefined
        });
        assert.ok($input.hasAttribute('aria-valuemax'), 'there is valuemin');
        assert.ok($input.hasAttribute('aria-valuemax'), 'there is valuemax');
    });
});

QUnit.module('valueChanged should receive correct event parameter', {
    beforeEach: function() {
        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            onValueChanged: this.valueChangedHandler,
            showSpinButtons: true
        };

        this.init = (options) => {
            this.$element = $('#numberbox').dxNumberBox(options);
            this.instance = this.$element.dxNumberBox('instance');
            this.$input = this.$element.find(`.${INPUT_CLASS}`);
            this.keyboard = keyboardMock(this.$input);
            this.mouse = pointerMock(this.$input);
            this.$spinUp = this.$element.find(`.${SPIN_UP_CLASS}`);
            this.$spinDown = this.$element.find(`.${SPIN_DOWN_CLASS}`);
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };
        this.testProgramChange = (assert) => {
            this.instance.option('value', 27);

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };
        this.checkEvent = (assert, type, target, key) => {
            const event = this.valueChangedHandler.getCall(0).args[0].event;
            assert.strictEqual(event.type, type, 'event type is correct');
            assert.strictEqual(event.target, target.get(0), 'event target is correct');
            if(type === 'keydown') {
                assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
            }
        };

        this.init(initialOptions);
    }
}, () => {
    QUnit.test('on program change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on change', function(assert) {
        this.keyboard
            .type('1')
            .change();

        this.checkEvent(assert, 'change', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on change when value is not valid', function(assert) {
        this.reinit({ valueChangeEvent: 'keyup', value: 1 });

        this.keyboard
            .press('end')
            .press('backspace')
            .keyUp('backspace');

        this.checkEvent(assert, 'keyup', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on clear button', function(assert) {
        this.instance.option('showClearButton', true);

        const $clearButton = this.$element.find(`.${CLEAR_BUTTON_CLASS}`);
        $clearButton.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $clearButton);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on up spin button', function(assert) {
        this.$spinUp.trigger('dxpointerdown');

        this.checkEvent(assert, 'dxpointerdown', this.$spinUp);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on down spin button', function(assert) {
        this.$spinDown.trigger('dxpointerdown');

        this.checkEvent(assert, 'dxpointerdown', this.$spinDown);
        this.testProgramChange(assert);
    });

    [['up', 10], ['down', -10]].forEach(([direction, delta]) => {
        QUnit.testInActiveWindow(`on mouse wheel ${direction}`, function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'this test is actual only for desktop');
                return;
            }

            this.$input.focus();
            this.mouse.wheel(delta);

            this.checkEvent(assert, 'dxmousewheel', this.$input);
            this.testProgramChange(assert);
        });
    });

    ['arrowdown', 'arrowup'].forEach(arrow => {
        QUnit.test(`on ${arrow} press`, function(assert) {
            this.keyboard.press(arrow);

            this.checkEvent(assert, 'keydown', this.$input, arrow);
            this.testProgramChange(assert);
        });
    });

    QUnit.test('on enter key press', function(assert) {
        this.keyboard
            .type('2')
            .press('enter')
            .change();

        assert.ok(this.valueChangedHandler.calledOnce, 'valueChanged is raised');

        this.testProgramChange(assert);
    });
});

QUnit.module('ShadowDOM ', {}, () => {
    QUnit.test('should change value on mouse wheel', function(assert) {
        const $numberBox = $('#numberbox').dxNumberBox({
            value: 100.6
        });

        const instance = $numberBox.dxNumberBox('instance');
        const $input = $numberBox.find(`.${INPUT_CLASS}`);
        const mouse = pointerMock($input);

        $input.focus();

        mouse.wheel(10);

        assert.strictEqual(instance.option('value'), 101.6, 'value is increased after mousewheel up');

        mouse.wheel(-20);
        assert.strictEqual(instance.option('value'), 100.6, 'value is decreased after mousewheel down');
    });
});
