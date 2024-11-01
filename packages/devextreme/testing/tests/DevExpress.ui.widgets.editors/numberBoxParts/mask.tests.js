import $ from 'jquery';
import browser from 'core/utils/browser';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import keyboardMock from '../../../helpers/keyboardMock.js';
import numberLocalization from 'common/core/localization/number';
import errors from 'core/errors';

import 'ui/text_box/ui.text_editor';

const INPUT_CLASS = 'dx-texteditor-input';
const PLACEHOLDER_CLASS = 'dx-placeholder';
const CARET_TIMEOUT_DURATION = 0;
const CARET_NO_DBLCLICK_DURATION = 300;

const DROP_EVENT_NAME = 'drop';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#numberbox').dxNumberBox({
            format: '#0.##',
            value: '',
            useMaskBehavior: true
        });
        this.clock = sinon.useFakeTimers();
        this.input = this.$element.find('.dx-texteditor-input');
        this.inputElement = this.input.get(0);
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.input, true);
    },

    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('format: api value changing', moduleConfig, () => {
    QUnit.test('zero should be typed as another digits (T997851)', function(assert) {
        this.instance.option({
            format: '#,##0.##',
            value: 100000
        });

        this.input.focus();
        this.keyboard.caret(1);

        this.keyboard.type('000');
        assert.strictEqual(this.input.val(), '100,000,000', 'input text is correct');
    });

    QUnit.test('number type of input should be converted to tel on mobile device when inputMode is unsupported', function(assert) {
        const realDeviceMock = sinon.stub(devices, 'real').returns({ deviceType: 'mobile' });
        const realBrowser = browser;
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            browser.chrome = true;
            browser.version = '50.0';
            browser.chrome = false;
            browser.safari = false;

            const instance = $element.dxNumberBox({
                useMaskBehavior: true,
                format: '#',
                mode: 'number'
            }).dxNumberBox('instance');

            assert.equal($element.find('.' + INPUT_CLASS).prop('type'), 'tel', 'input has tel type on mobile device');

            instance.option('mode', 'number');
            assert.equal($element.find('.' + INPUT_CLASS).prop('type'), 'tel', 'user can not set number type with mask');
        } finally {
            browser.chrome = realBrowser.chrome;
            browser.safari = realBrowser.safari;
            browser.version = realBrowser.version;
            realDeviceMock.restore();
            $element.remove();
        }
    });

    QUnit.test('number type of input should be converted to text on desktop device', function(assert) {
        const realDeviceMock = sinon.stub(devices, 'real').returns({ deviceType: 'desktop' });
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            const instance = $element.dxNumberBox({
                useMaskBehavior: true,
                format: '#',
                mode: 'number'
            }).dxNumberBox('instance');

            assert.equal($element.find('.' + INPUT_CLASS).prop('type'), 'text', 'input has text type on desktop device');

            instance.option('mode', 'number');
            assert.equal($element.find('.' + INPUT_CLASS).prop('type'), 'text', 'user can not set number type with mask');
        } finally {
            realDeviceMock.restore();
            $element.remove();
        }
    });

    QUnit.test('empty value should not be formatted', function(assert) {
        this.instance.option('value', '');
        assert.equal(this.input.val(), '', 'value is empty');
    });

    QUnit.test('placeholder should disappear when an empty value has been changed', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: null,
            placeholder: 'Test'
        });

        this.keyboard.press('up');
        assert.equal(this.input.val(), '1.00', 'text is correct');
        assert.notOk(this.$element.find('.dx-placeholder').is(':visible'), 'placeholder is hidden');
    });

    QUnit.test('format should be applied on value change', function(assert) {
        this.instance.option('value', 12.34);
        assert.equal(this.input.val(), '12.34', 'value is correct');
    });

    QUnit.test('value should be reformatted when format option changed', function(assert) {
        this.instance.option('value', 123);
        assert.equal(this.input.val(), '123', 'value is correct');

        this.instance.option('format', '#.00');
        assert.equal(this.input.val(), '123.00', 'value was reformatted');
    });

    QUnit.test('setting value to undefined should work correctly', function(assert) {
        this.instance.option({
            format: '#0',
            value: 667
        });

        this.instance.option('value', '');
        this.instance.option('value', undefined);

        assert.strictEqual(this.input.val(), '', 'value is correct');
        assert.strictEqual(this.instance.option('value'), undefined, 'value is correct');
    });

    QUnit.test('widget should not crash when it is disposing on change (T578115)', function(assert) {
        this.instance.option({
            value: 1,
            onValueChanged(e) {
                e.component.dispose();
            }
        });

        this.keyboard.type('2').change();

        assert.ok(true, 'there was no exceptions');
    });

    QUnit.test('api value changing should hide a placeholder', function(assert) {
        this.instance.option({
            format: '$ #0',
            placeholder: 'Enter number'
        });

        const $placeholder = this.$element.find('.' + PLACEHOLDER_CLASS);

        assert.ok($placeholder.is(':visible'), 'placeholder is visible');

        this.instance.option('value', 1);

        assert.equal(this.input.val(), '$ 1', 'text is correct');
        assert.notOk($placeholder.is(':visible'), 'placeholder is hidden');
    });

    QUnit.test('text option should be changed after format option change', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1.23
        });

        assert.equal(this.instance.option('text'), '1.23', 'text is correct');

        this.instance.option('format', '#0');
        assert.equal(this.instance.option('text'), '1', 'text has been changed');
    });

    QUnit.test('should not update value if the formated text has not been changed', function(assert) {
        const done = assert.async();

        this.instance.option({
            value: 1.129,
            format: '0.009',
            onFocusIn(e) {
                assert.equal(e.component.option('value'), '1.129', 'value is correct');
                e.component.option('format', '0.00');
            },
            onFocusOut(e) {
                assert.equal(e.component.option('value'), '1.129', 'value is correct');
                e.component.option('format', '0.009');
                done();
            }
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .blur();
    });
});

QUnit.module('format: sign and minus button', moduleConfig, () => {
    QUnit.test('pressing \'-\' button should revert the number', function(assert) {
        this.instance.option({
            format: '#.000',
            value: 123.456
        });

        this.keyboard.caret(3).keyDown('-').input('-');
        assert.equal(this.input.val(), '-123.456', 'value is correct');
        assert.equal(this.instance.option('value'), 123.456, 'value should not be changed before valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, 'caret is correct');
        this.keyboard.change();
        assert.equal(this.instance.option('value'), -123.456, 'value has been changed after valueChange event');

        this.keyboard.keyDown('-').input('-');
        assert.equal(this.input.val(), '123.456', 'value is correct');
        assert.equal(this.instance.option('value'), -123.456, 'value should not be changed before valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret is correct');
        this.keyboard.change();
        assert.equal(this.instance.option('value'), 123.456, 'value has been changed after valueChange event');

        this.keyboard.caret(3).keyDown('-').input('-');
        assert.equal(this.input.val(), '-123.456', 'value is correct');
        assert.equal(this.instance.option('value'), 123.456, 'value should not be changed before valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, 'caret is correct');
        this.keyboard.change();
        assert.equal(this.instance.option('value'), -123.456, 'value has been changed after valueChange event');

        this.keyboard.keyDown('-').input('-');
        assert.equal(this.input.val(), '123.456', 'value is correct');
        assert.equal(this.instance.option('value'), -123.456, 'value should not be changed before valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret is correct');
        this.keyboard.change();
        assert.equal(this.instance.option('value'), 123.456, 'value has been changed after valueChange event');
    });

    QUnit.test('incorrect input should not reset the sign if minus is specific character (T920936)', function(assert) {
        this.instance.option({
            format: '#0.00;M#0.00',
            value: -14500.55
        });

        this.keyboard.caret(6).type('a').change();
        assert.strictEqual(this.input.val(), 'M14500.55', 'value is correct');
        assert.strictEqual(this.instance.option('value'), -14500.55, 'value is correct');
    });

    QUnit.test('incorrect input should not reset the sign if minus consists of several characters (T920936)', function(assert) {
        this.instance.option({
            format: '#0.00;$ (#0.00)',
            value: -14500.55
        });

        this.keyboard.caret(6).type('a').change();
        assert.strictEqual(this.input.val(), '$ (14500.55)', 'value is correct');
        assert.strictEqual(this.instance.option('value'), -14500.55, 'value is correct');
    });

    QUnit.test('incorrect input should not reset the sign if minus consists of several specific characters (T920936)', function(assert) {
        this.instance.option({
            format: '#0.00;$*/\\?||(?)^   & [({#0.00])}',
            value: -14500.55
        });

        this.keyboard.caret(20).type('a').change();
        assert.strictEqual(this.input.val(), '$*/\\?||(?)^   & [({14500.55])}', 'value is correct');
        assert.strictEqual(this.instance.option('value'), -14500.55, 'value is correct');
    });

    QUnit.test('correct input should not reset the sign if minus is specific character (T920936)', function(assert) {
        this.instance.option({
            format: '#0.00;M#0.00',
            value: -14500.55
        });

        this.keyboard.caret(6).type('1').change();
        assert.strictEqual(this.input.val(), 'M145001.55', 'value is correct');
        assert.strictEqual(this.instance.option('value'), -145001.55, 'value is correct');
    });

    QUnit.test('pressing numpad minus button should revert the number', function(assert) {
        const keyName = '-';

        this.instance.option({
            format: '#.000',
            value: 123.456
        });

        this.keyboard
            .caret(3)
            .keyDown(keyName)
            .keyPress(keyName)
            .keyUp(keyName)
            .input();

        assert.equal(this.input.val(), '-123.456', 'value is correct');
        assert.equal(this.instance.option('value'), 123.456, 'value should not be changed before valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, 'caret is correct');
        this.keyboard.change();
        assert.equal(this.instance.option('value'), -123.456, 'value has been changed after valueChange event');
    });

    QUnit.test('pressing minus with fireFox keyCode should revert the number', function(assert) {
        this.instance.option({
            format: '#.000',
            value: 123.456
        });

        this.keyboard.keyDown(173, { key: '-' }).input();
        assert.equal(this.input.val(), '-123.456', 'value is correct');
    });

    QUnit.test('pressing \'-\' button should revert zero number', function(assert) {
        this.instance.option({
            format: '#0',
            value: 0
        });

        this.keyboard.keyDown('-').input('-').change();
        assert.equal(this.input.val(), '-0', 'text is correct');
        assert.equal(1 / this.instance.option('value'), -Infinity, 'value is negative');

        this.keyboard.keyDown('-').input('-').change();
        assert.equal(this.input.val(), '0', 'text is correct');
        assert.equal(1 / this.instance.option('value'), Infinity, 'value is positive');
    });

    QUnit.test('pressing \'-\' with different positive and negative parts', function(assert) {
        this.instance.option({
            format: '$ #0;($ #0)',
            value: 123
        });

        this.keyboard.keyDown('-').input('-').change();
        assert.equal(this.input.val(), '($ 123)', 'text is correct');
        assert.equal(this.instance.option('value'), -123, 'value is negative');

        this.keyboard.keyDown('-').input('-').change();
        assert.equal(this.input.val(), '$ 123', 'text is correct');
        assert.equal(this.instance.option('value'), 123, 'value is positive');
    });

    QUnit.test('focusout after inverting sign should not lead to value changing', function(assert) {
        this.instance.option('value', -123);

        // note: keyboard mock keyDown send wrong key for '-' and can not be used here
        this.input.trigger($.Event('keydown', { key: '-' }));
        this.keyboard.caret(3).input('-');
        this.keyboard.blur().change();

        assert.equal(this.input.val(), '123', 'text is correct');
        assert.equal(this.instance.option('value'), 123, 'value is correct');
    });

    QUnit.test('pressing minus button should revert selected number', function(assert) {
        this.clock.restore();

        this.instance.option({
            format: '$ #0.00',
            value: 0
        });

        this.keyboard.caret({ start: 0, end: 5 }).keyDown('-');
        this.clock.tick(10);
        assert.equal(this.input.val(), '-$ 0.00', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 6 }, 'caret is good');
    });

    QUnit.test('pressing \'-\' should keep selection', function(assert) {
        this.instance.option({
            format: '#0.#',
            value: 123.456
        });

        this.keyboard.caret({ start: 0, end: 5 }).keyDown('-');
        this.clock.tick(10);
        assert.equal(this.input.val(), '-123.5', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 6 }, 'caret is good');

        this.keyboard
            .type('5')
            .change();
        assert.equal(this.instance.option('value'), -5, 'value has been changed after valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret is good');

        this.keyboard.caret({ start: 0, end: 2 }).keyDown('-');
        this.clock.tick(10);
        assert.equal(this.input.val(), '5', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 1 }, 'caret is good');

        this.keyboard
            .type('6')
            .change();
        assert.equal(this.instance.option('value'), 6, 'value has been changed after valueChange event');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is good');
    });

    QUnit.test('pressing \'-\' correctly remove the selected part of previous value', function(assert) {
        this.instance.option({
            format: '#0.#',
            value: 123.4
        });

        this.keyboard.caret({ start: 1, end: 3 }).keyDown('-');
        this.clock.tick(10);
        assert.equal(this.input.val(), '-123.4', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 4 }, 'caret is good');

        this.keyboard.change();
        assert.equal(this.instance.option('value'), -123.4, 'value has been changed after valueChange event');
    });

    QUnit.test('NumberBox keeps correct selection after revert the sign', function(assert) {
        this.instance.option({
            format: '#0.#;<<#0.#>>',
            value: 123.4
        });

        this.keyboard.caret({ start: 1, end: 2 }).keyDown('-');
        this.clock.tick(10);

        assert.equal(this.input.val(), '<<123.4>>', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 4 }, 'caret is good');
    });

    QUnit.test('NumberBox should keep selected range after the ValueChange event', function(assert) {
        this.instance.option({
            format: '#0.#;<<#0.#>>',
            value: 123.4
        });

        this.keyboard.caret({ start: 1, end: 2 }).press('-').change();
        this.clock.tick(10);

        assert.equal(this.input.val(), '<<123.4>>', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 4 }, 'caret preserved');
    });

    [
        { format: 'b,##0.###b', text: '-b5b', expectedCaretPosition: { start: 3, end: 3 } },
        { format: '0000', text: '-0005', expectedCaretPosition: { start: 5, end: 5 } },
        { format: '0.00', text: '-5.00', expectedCaretPosition: { start: 2, end: 2 } },
        { format: '-0.00', text: '--5.00', expectedCaretPosition: { start: 3, end: 3 } },
        { format: '00.00', text: '-05.00', expectedCaretPosition: { start: 3, end: 3 } },
        { format: '$0.##', text: '-$5', expectedCaretPosition: { start: 3, end: 3 } },
        { format: '\'123\'000.#\'123\'', text: '-123005.123', expectedCaretPosition: { start: 7, end: 7 } },
        { format: '$ 000.000 \'0\'', text: '-$ 005.000 0', expectedCaretPosition: { start: 6, end: 6 } },
    ].forEach(({ format, text, expectedCaretPosition }) => {
        QUnit.test(`NumberBox should not reset the negativ value after valueChange event, format: ${format} (T1092593)`, function(assert) {
            this.instance.option({
                format,
            });

            this.input.focus();
            this.keyboard
                .type('5')
                .type('-')
                .change();

            assert.strictEqual(this.input.val(), text, 'value is correct');
            assert.deepEqual(this.keyboard.caret(), expectedCaretPosition, 'caret');
        });
    });

    QUnit.test('typing zero-based value should not revert negative sign', function(assert) {
        this.instance.option({
            format: '0.00',
            value: -1.1
        });

        this.keyboard
            .caret({ start: 1, end: 5 })
            .type('0.51')
            .change();

        this.clock.tick(10);
        assert.strictEqual(this.input.val(), '-0.51', 'text is correct');
        assert.strictEqual(this.instance.option('value'), -0.51, 'value is correct');
    });
});

QUnit.module('format: fixed point format', moduleConfig, () => {
    QUnit.test('value should be formatted on first input', function(assert) {
        this.instance.option('format', '#0.00');

        this.keyboard.type('1');
        assert.equal(this.input.val(), '1.00', 'required digits was added on first input');
    });

    QUnit.test('Value should be formatted after change on focusout if mask behavior is used (T942114)', function(assert) {
        this.instance.option('format', '#,##0.00\'0\'');

        this.keyboard
            .type('1.111')
            .change();
        assert.strictEqual(this.instance.option('value'), 1.11, 'value is formatted');
    });

    QUnit.test('value option should have right value after typing when format is enabled (T829935)', function(assert) {
        this.instance.option('format', '000.00');

        this.keyboard.type('1234').change();
        assert.equal(this.input.val(), '234.00', 'input value is right');
        assert.equal(this.instance.option('value'), 234, 'value option is right');
    });

    QUnit.test('value option should have right value after inserting when format is enabled (T829935)', function(assert) {
        this.instance.option('format', '000.00');

        this.keyboard.caret({ start: 0, end: 6 }).type('12345678').change();
        assert.equal(this.input.val(), '678.00', 'input value is right');
        assert.equal(this.instance.option('value'), 678, 'value option is right');
    });

    QUnit.test('extra decimal points should be ignored', function(assert) {
        this.instance.option('format', '#0.00');

        this.keyboard.type('2..05');
        assert.equal(this.input.val(), '2.05', 'text is correct');

        this.keyboard.caret(3).type('.');
        assert.equal(this.input.val(), '2.05', 'extra point should be prevented');
    });

    QUnit.test('value should be rounded to the low digit on input an extra float digits', function(assert) {
        this.instance.option('format', '#0.00');

        this.keyboard.type('2.057').change();
        assert.equal(this.input.val(), '2.05', 'text is correct');
        assert.equal(this.instance.option('value'), 2.05, 'value is correct');
    });

    QUnit.test('required digits should be replaced on input', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1.23
        });

        this.keyboard.caret(2).type('45');
        assert.equal(this.input.val(), '1.45', 'text is correct');
    });

    QUnit.test('should ignore backspace/delete key down when the caret in the start/end of input (T713045)', function(assert) {
        this.instance.option({
            valueChangeEvent: 'keyup',
            format: '#,##0',
            value: 1234
        });

        assert.strictEqual(this.input.val(), '1,234');

        this.keyboard
            .caret(5)
            .press('delete');
        assert.strictEqual(this.input.val(), '1,234');

        this.keyboard
            .caret(0)
            .press('backspace');
        assert.strictEqual(this.input.val(), '1,234');
    });

    QUnit.test('removing required value should replace it to 0', function(assert) {
        this.instance.option({
            format: '#0.000',
            value: 1.234
        });

        this.keyboard.caret(3).press('backspace');
        assert.equal(this.input.val(), '1.340', 'backspace works');

        this.keyboard.press('del');
        assert.equal(this.input.val(), '1.400', 'delete works');
    });

    QUnit.test('removing decimal point should move the caret', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1.23
        });

        this.keyboard.caret(2).press('backspace');
        assert.deepEqual(this.keyboard.caret().start, 1, 'caret was moved');
    });

    QUnit.test('removing last integer should replace it to 0', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1.23
        });

        this.keyboard.caret(1).press('backspace');
        assert.equal(this.input.val(), '0.23', 'integer was replaced to 0');
    });

    QUnit.test('input with non-required digit', function(assert) {
        this.instance.option('format', '#0.##');

        this.keyboard.type('1');
        assert.equal(this.input.val(), '1', 'extra digits should not be shown');

        this.keyboard.type('..');
        assert.equal(this.input.val(), '1', 'extra point should reformat the value');

        this.keyboard.type('.0');
        assert.equal(this.input.val(), '1.0', 'zero should not be rounded');

        this.keyboard.type('56');
        assert.equal(this.input.val(), '1.05', 'extra digit should be rounded');
    });

    QUnit.test('extra zeros in the end should be prevented from input', function(assert) {
        this.instance.option({
            format: '#.##',
            value: 1.52
        });

        this.keyboard.caret(4).type('0');

        assert.equal(this.input.val(), '1.52', 'extra zero input has been prevented');
    });

    QUnit.test('removed digits should not be replaced to 0 when they are not required', function(assert) {
        this.instance.option({
            format: '#0.##',
            value: 1.23
        });

        this.keyboard.caret(3).press('backspace');
        assert.equal(this.input.val(), '1.3', 'digit was removed');

        this.keyboard.press('del').change();
        assert.equal(this.input.val(), '1', 'decimal point was removed together with last float digit');
    });

    QUnit.test('value is not changed when using the big float part', function(assert) {
        this.instance.option({
            format: '#,##0.##############################',
            value: ''
        });

        this.keyboard.caret(0)
            .type('3.4')
            .press('enter')
            .change();

        assert.equal(this.instance.option('value'), '3.4');
    });

    QUnit.test('precision should correctly round the value', function(assert) {
        this.instance.option({
            format: {
                type: 'fixedPoint',
                precision: 2
            },
            value: 4.645
        });

        assert.strictEqual(this.instance.option('text'), '4.65');
    });
});

QUnit.module('format: minimum and maximum', moduleConfig, () => {
    QUnit.test('value should be fitted into min and max range on change', function(assert) {
        this.instance.option({
            format: '#0.0',
            min: 10,
            max: 20,
            value: 10
        });

        this.keyboard.caret(2).type('5');
        assert.equal(this.input.val(), '105.0', 'value is not fitted before the change event');

        this.keyboard.change();
        assert.equal(this.input.val(), '20.0', 'value is fitted after the change event');
    });

    QUnit.test('value removing should be possible when min is specified and stubs are in the format', function(assert) {
        this.instance.option({
            format: '#,##0 d',
            min: 5,
            value: 6,
            max: 10
        });

        this.keyboard
            .caret(1)
            .press('backspace')
            .type('7')
            .press('enter');

        assert.strictEqual(this.input.val(), '7 d', 'text is correct');
        assert.strictEqual(this.instance.option('value'), 7, 'value is correct');
    });

    QUnit.test('changing min limit should lead to value change in masked numberbox', function(assert) {
        this.instance.option({
            format: '$ #0',
            value: 5,
            min: 1
        });

        this.instance.option('min', 6);
        assert.equal(this.instance.option('value'), 6, 'value has been updated');
        assert.equal(this.input.val(), '$ 6', 'text has been updated');
    });

    QUnit.test('changing max limit should lead to value change in masked numberbox', function(assert) {
        this.instance.option({
            format: '$ #0',
            value: 5,
            max: 6
        });

        this.instance.option('max', 4);
        assert.equal(this.instance.option('value'), 4, 'value has been updated');
        assert.equal(this.input.val(), '$ 4', 'text has been updated');
    });

    QUnit.test('invert sign should be prevented if minimum is larger than 0', function(assert) {
        this.instance.option({
            min: 0,
            value: 4
        });

        this.keyboard.keyDown('-');
        assert.equal(this.input.val(), '4', 'reverting was prevented');
    });

    QUnit.test('integer should not be longer than 15 digit', function(assert) {
        this.instance.option('value', 999999999999999);
        this.keyboard.caret(15).type('5');

        assert.equal(this.input.val(), '999999999999999', 'input was prevented');
    });

    QUnit.test('trailing zeros should not affect 15 digits limit', function(assert) {
        this.instance.option('format', '#,##0.000000');
        this.instance.option('value', 222222222.120000);
        this.keyboard.caret(12).type('8');

        assert.equal(this.input.val(), '222,222,222.812000', 'input was not prevented');
    });

    QUnit.test('leading zeros should not affect 15 digits limit', function(assert) {
        this.instance.option('format', '000000000000000#.00');
        this.instance.option('value', 1);
        this.keyboard.caret(12).type('8');

        assert.equal(this.input.val(), '000000000008001.00', 'input was not prevented');
    });

    QUnit.test('negative integer should not be longer than 15 digit', function(assert) {
        this.instance.option('value', -999999999999999);
        this.keyboard.caret(16).type('5');

        assert.equal(this.input.val(), '-999999999999999', 'input was prevented');
    });

    QUnit.test('15-digit value with decimal part should be parsed', function(assert) {
        this.instance.option('format', '#0.####');
        this.instance.option('value', 9999999999.999);
        this.keyboard.caret(14).type('9');

        assert.equal(this.input.val(), '9999999999.9999', 'input was not prevented');
    });

    QUnit.test('boundary value should correctly apply after second try to set overflow value', function(assert) {
        this.instance.option({
            min: 1,
            max: 4,
            value: 2
        });

        this.input.val('');
        this.keyboard
            .type('6')
            .press('enter')
            .change();

        assert.equal(this.input.val(), '4', 'text is adjusted to max');
        assert.equal(this.instance.option('value'), 4, 'value is adjusted to max');

        this.input.val('');
        this.keyboard
            .type('7')
            .press('enter')
            .change();

        assert.equal(this.input.val(), '4', 'text is adjusted to max second time');
        assert.equal(this.instance.option('value'), 4, 'value is adjusted to max second time');

        this.input.val('');
        this.keyboard
            .type('0')
            .press('enter')
            .change();

        assert.equal(this.input.val(), '1', 'text is adjusted to min');
        assert.equal(this.instance.option('value'), 1, 'value is adjusted to min');
    });

    [0, '', null, undefined].forEach(value => {
        QUnit.test(`minus sign can be entered if max is negative: value=${value} (T1122681)`, function(assert) {
            this.instance.option({
                max: -1,
                format: '###',
                value,
            });

            this.keyboard.type('-');
            assert.strictEqual(this.input.val(), '-', 'minus sign was entered');
        });
    });
});

QUnit.module('format: arabic digit shaping', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);

        const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
        const arabicSeparator = '٫';
        const standardToArabicMock = text => {
            return text.split('').map(sign => {
                if(sign === '.') {
                    return arabicSeparator;
                }
                return arabicDigits[sign] || sign;
            }).join('');
        };

        const arabicToStandardMock = text => {
            return text.split('').map(sign => {
                if(sign === arabicSeparator) {
                    return '.';
                }
                const standardSign = arabicDigits.indexOf(sign);
                return standardSign < 0 ? sign : standardSign;
            }).join('');
        };

        numberLocalization.inject({
            format(number) {
                return !isNaN(number) && standardToArabicMock(String(number));
            },
            parse(text) {
                return text && parseFloat(arabicToStandardMock(text));
            }
        });
    },

    afterEach: function() {
        moduleConfig.afterEach.call(this);
        numberLocalization.resetInjection();
    }
}, () => {
    QUnit.test('mask should work with arabic digit shaping', function(assert) {
        this.keyboard
            .type('١٢٣٤٥')
            .press('backspace')
            .change();

        assert.equal(this.input.val(), '١٢٣٤');
        assert.equal(this.instance.option('value'), 1234);

        this.keyboard.type('-');

        assert.equal(this.input.val(), '-١٢٣٤', 'arabic minus should work');
    });

    QUnit.test('getFormatPattern should return correct format with arabic digit shaping', function(assert) {
        this.instance.option('format', 'currency');
        assert.equal(this.instance._getFormatPattern(), '#0.##############');
    });
});

QUnit.module('format: text input', moduleConfig, () => {
    QUnit.test('clearing numberbox via keyboard should be possible if non required format is used', function(assert) {
        this.instance.option({
            format: '$ #.##',
            value: 1
        });

        this.keyboard
            .caret(3)
            .press('backspace')
            .change();

        assert.equal(this.input.val(), '', 'text was cleared');
        assert.equal(this.instance.option('value'), null, 'value is correct');
    });

    QUnit.test('invalid chars should be prevented on keydown', function(assert) {
        this.keyboard.type('12e*3.456');
        assert.equal(this.input.val(), '123.45', 'value is correct');
    });

    QUnit.test('input should be correct with group separators', function(assert) {
        this.instance.option('format', '$ #,##0.00 d');

        this.keyboard.type('1234567.894');
        assert.equal(this.input.val(), '$ 1,234,567.89 d', 'input is correct');
    });

    QUnit.test('select and replace all text', function(assert) {
        this.instance.option({
            format: '$ #.000 d',
            value: 123
        });

        this.keyboard
            .caret({ start: 0, end: 11 })
            .type('4');

        assert.equal(this.input.val(), '$ 4.000 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret position is correct');
    });

    QUnit.test('It should be possible to set negative value when min is null and format is defined (T876378)', function(assert) {
        this.instance.option({
            min: null,
            format: '#,##0.##',
            valueChangeEvent: 'keyup',
            value: 2
        });

        this.input.focus();
        this.clock.tick(CARET_TIMEOUT_DURATION);
        this.keyboard.caret(1);
        this.clock.tick(CARET_TIMEOUT_DURATION);
        this.keyboard.type('-');

        assert.strictEqual(this.instance.option('value'), -2, 'value is set to negative number');
    });

    QUnit.test('don\'t replace selected text after enter pressed', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 123.45
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .press('enter');

        assert.equal(this.instance.option('value'), 123.45);
        assert.equal(this.input.val(), '123.45');
    });

    QUnit.test('don\'t replace selected text after focusOut', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 123.45
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .blur();

        assert.equal(this.instance.option('value'), 123.45);
        assert.equal(this.input.val(), '123.45');
    });

    QUnit.test('decimal point should move the caret before float part only', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 123.45
        });
        this.keyboard.caret(2).type('.');

        assert.equal(this.input.val(), '123.45', 'value is right');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret was not moved');

        this.keyboard.caret(3).type('.');
        assert.equal(this.input.val(), '123.45', 'value is right');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, 'caret was moved to the float part');
    });

    QUnit.test('input after 0 should not move caret to float part', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 0
        });

        this.keyboard.caret(1).type('1');

        assert.equal(this.keyboard.caret().start, 1, 'caret is good');
    });

    QUnit.test('ctrl+v should not be prevented', function(assert) {
        this.keyboard.keyDown('v', { ctrlKey: true });
        assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false, 'keydown event is not prevented');
    });

    QUnit.test('command+v should not be prevented (T988724)', function(assert) {
        this.keyboard.keyDown('v', { metaKey: true });
        assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false, 'keydown event is not prevented');
    });

    QUnit.test('decimal point input should be prevented when it is restricted by the format', function(assert) {
        this.instance.option({
            format: '#0',
            value: 123
        });

        this.keyboard.caret(1).type('.');

        assert.equal(this.input.val(), '123', 'value is correct');
        assert.equal(this.keyboard.caret().start, 1, 'caret should not be moved');
    });

    QUnit.test('leading zeros should be replaced on input', function(assert) {
        this.instance.option('format', '$ #0 d');
        this.instance.option('value', 0);

        assert.equal(this.input.val(), '$ 0 d', 'value is correct');

        this.keyboard.caret(3).type('12');

        assert.equal(this.input.val(), '$ 12 d', 'value is correct');
    });

    QUnit.test('leading zeros should not be replaced if input is before them', function(assert) {
        this.instance.option('format', '#0 d');
        this.instance.option('value', 0);

        assert.equal(this.input.val(), '0 d', 'value is correct');

        this.keyboard.caret(0).type('12');

        assert.equal(this.input.val(), '120 d', 'value is correct');
    });

    QUnit.test('it should be possible to input decimal point when valueChangeEvent is input (T580162)', function(assert) {
        this.instance.option('valueChangeEvent', 'input');
        this.keyboard.type('1.5');

        assert.equal(this.input.val(), '1.5', 'value is correct');
    });

    QUnit.test('onValueChanged should have change event as a parameter', function(assert) {
        const valueChangedHandler = sinon.spy();
        this.instance.option('onValueChanged', valueChangedHandler);

        this.keyboard.type('123').press('enter');
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'change', 'event is correct');
    });

    QUnit.test('onValueChanged should have input event as a parameter if valueChangeEvent="input"', function(assert) {
        const valueChangedHandler = sinon.spy();
        this.instance.option({
            onValueChanged: valueChangedHandler,
            valueChangeEvent: 'input'
        });

        this.keyboard.type('1');

        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'input');
    });

    QUnit.test('onValueChanged should have focusout event as a parameter if valueChangeEvent="focusout"', function(assert) {
        const valueChangedHandler = sinon.spy();
        this.instance.option({
            onValueChanged: valueChangedHandler,
            valueChangeEvent: 'focusout'
        });

        this.keyboard.type('1');
        this.input.trigger('focusout');

        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'focusout');
    });

    QUnit.testInActiveWindow('caret position is not changed when the focus out event has occurred', function(assert) {
        const _caret = this.instance._caret;
        let caretIsUpdatedOnFocusOut;
        const $input = $(this.instance.element()).find('.dx-texteditor-input');

        this.instance._caret = newCaret => {
            const result = _caret.apply(this.instance, newCaret);
            if(!$input.is(':focus') && newCaret) {
                caretIsUpdatedOnFocusOut = true;
            }
            return result;
        };
        this.keyboard.type('.').blur();

        this.instance._caret = _caret;

        assert.notOk(caretIsUpdatedOnFocusOut);
    });

    QUnit.testInActiveWindow('caret position should be updated correctly after setting the "format" options runtime and "valueChangeEvent" is "input"', function(assert) {
        const $element = $('#widget');
        const instance = $element.dxNumberBox({
            valueChangeEvent: 'input'
        }).dxNumberBox('instance');

        instance.option('format', '$###,##0');

        const keyboard = keyboardMock($element.find(`.${INPUT_CLASS}`), true);

        keyboard
            .caret(2) // $0|
            .type('123456'); // $123,456
        assert.deepEqual(keyboard.caret(), { start: 8, end: 8 }, 'caret position is OK');
        assert.strictEqual(instance.option('value'), 123456, 'Widget has the expected value');
    });
});

QUnit.module('format: incomplete value', moduleConfig, () => {
    QUnit.test('incomplete values should not be reformatted on input', function(assert) {
        this.instance.option({
            format: '#0.####',
            value: null
        });

        this.keyboard.type('0.0005');
        assert.equal(this.input.val(), '0.0005', 'value was typed');
    });

    QUnit.test('incomplete values with stubs should not be reformatted on input', function(assert) {
        this.instance.option({
            format: '$ #0.#### kg',
            value: null
        });

        this.keyboard.type('0.0005');
        assert.equal(this.input.val(), '$ 0.0005 kg', 'value was typed');
    });

    QUnit.test('incomplete values should not be reformatted on paste', function(assert) {
        this.instance.option({
            format: '$ #0.#### kg',
            value: null
        });

        this.input.val('0.00');
        this.keyboard.caret(4).input();
        assert.equal(this.input.val(), '0.00', 'walue has not been reformatted');

        this.keyboard.type('0');
        assert.equal(this.input.val(), '0.000', 'walue has not been reformatted yet');

        this.keyboard.type('5');
        assert.equal(this.input.val(), '$ 0.0005 kg', 'walue has been reformatted');
    });

    QUnit.test('paste of value should call valueChanged event on keyup', function(assert) {
        const valueChangedStub = sinon.stub();
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            $element.dxNumberBox({
                valueChangeEvent: 'keyup',
                format: '#,##0.00',
                value: null,
                onValueChanged: valueChangedStub
            });

            const $input = $element.find('.' + INPUT_CLASS);
            const kb = keyboardMock($input);

            $input.val('1.00');
            kb.input('1.00', 'insertFromPaste');
            kb.keyUp('v');

            assert.ok(valueChangedStub.calledOnce, 'valueChanged event was called');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('incomplete values should be limited by max precision', function(assert) {
        this.instance.option({
            format: '$ #0.### kg',
            value: null
        });

        this.keyboard.type('0.000');
        assert.equal(this.input.val(), '$ 0.000 kg', 'value is incomplete');

        this.keyboard.press('enter');
        assert.equal(this.input.val(), '$ 0 kg', 'value was reformatted on enter');
    });

    QUnit.test('value can be incomplete after removing via backspace', function(assert) {
        this.instance.option({
            format: '$ #0.### kg',
            value: 1.2
        });

        this.keyboard.caret(5).press('backspace');
        assert.equal(this.input.val(), '$ 1. kg', 'value has not been reformatted');
    });

    QUnit.test('value can be incomplete after removing via delete', function(assert) {
        this.instance.option({
            format: '$ #0.### kg',
            value: 1.2
        });

        this.keyboard.caret(4).press('del');
        assert.equal(this.input.val(), '$ 1. kg', 'value has not been reformatted');
    });

    QUnit.test('value without float part should never be incomplete', function(assert) {
        this.instance.option({
            format: '$ #0.####',
            value: null
        });

        this.input.val('10');
        this.keyboard.input();
        assert.equal(this.input.val(), '$ 10', 'value has been reformatted');
    });

    QUnit.test('zero should not be incomplete', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 12.34
        });

        this.keyboard.caret({ start: 0, end: 5 }).type('0');

        assert.equal(this.input.val(), '0.00', 'zero has been formatted');
    });

    QUnit.test('value without an integer part is supported', function(assert) {
        this.instance.option({
            format: '$ #.#',
            value: null
        });

        this.keyboard.type('.5');
        assert.equal(this.input.val(), '$ .5', 'point should be prevented');
    });

    QUnit.test('value with more than one point should not be incomplete', function(assert) {
        this.instance.option({
            format: '$ #0.###',
            value: null
        });

        this.keyboard.type('1.0.');
        assert.equal(this.input.val(), '$ 1', 'value was reformatted');
    });

    QUnit.test('entering any stub in incomplete value should reformat the value', function(assert) {
        this.instance.option({
            format: '$ #0.###',
            value: null
        });

        this.keyboard.type('$ 1.0r');
        assert.equal(this.input.val(), '$ 1.0', 'stub was prevented');
    });

    QUnit.test('incomplete value should be limited by min precision', function(assert) {
        this.instance.option({
            format: '#0.0##',
            value: 1
        });

        this.keyboard.caret(3).press('backspace');
        assert.equal(this.input.val(), '1.0', 'zero has not been removed');
    });

    QUnit.test('NumberBox should not accept entering letters if mask is "#0.0#" (T1211093)', function(assert) {
        this.instance.option({
            format: '#0.0#',
            value: '14.30',
        });

        this.keyboard
            .caret(4)
            .press('backspace')
            .type('b');

        assert.strictEqual(this.input.val(), '14.0', 'letter is not accepted');
    });

    QUnit.test('incomplete values should be reformatted on enter', function(assert) {
        this.keyboard.type('123.').press('enter');
        assert.equal(this.input.val(), '123', 'input was reformatted');
    });

    QUnit.test('incomplete value should be reformatted on enter after paste', function(assert) {
        this.instance.option('value', null);
        this.input.val('123.');
        this.keyboard.press('enter');
        assert.equal(this.input.val(), '123', 'input was reformatted');
    });

    QUnit.testInActiveWindow('incomplete values should be reformatted on focusout', function(assert) {
        this.instance.option('value', 123);
        this.keyboard.caret(3).type('.').blur();
        assert.equal(this.input.val(), '123', 'input was reformatted');
    });

    QUnit.test('incomplete value should be reformatted on focusout after paste', function(assert) {
        this.instance.option('value', null);
        this.instance.focus();
        this.input.val('123.');
        this.instance.blur();

        assert.equal(this.input.val(), '123', 'input was reformatted');
    });

    QUnit.test('minus sign typed to the end of the incomplete value should revert sign', function(assert) {
        this.instance.option({
            format: '#0.##',
            value: 0
        });

        this.keyboard
            .caret(1)
            .type('.0')
            .type('-');

        assert.equal(this.input.val(), '-0', 'value has been reformatted after incorrect sign');
    });
});

QUnit.module('format: percent format', moduleConfig, () => {
    QUnit.test('percent format should work properly on value change', function(assert) {
        this.instance.option('format', '#0%');
        this.keyboard.type('45').change();

        assert.equal(this.input.val(), '45%', 'text is correct');
        assert.equal(this.instance.option('value'), 0.45, 'value is correct');
    });

    QUnit.test('escaped percent should be parsed correctly', function(assert) {
        this.instance.option('format', '#0\'%\'');
        this.keyboard.type('123').change();

        assert.equal(this.input.val(), '123%', 'text is correct');
        assert.equal(this.instance.option('value'), 123, 'value is correct');
    });

    QUnit.test('non-ldml percent format should work properly on value change', function(assert) {
        this.instance.option('value', '');
        this.instance.option('format', 'percent');
        this.keyboard.type('45').change();

        assert.equal(this.input.val(), '45%', 'text is correct');
        assert.equal(this.instance.option('value'), 0.45, 'value is correct');
    });

    QUnit.test('input before leading zero in percent format', function(assert) {
        this.instance.option('format', '#0%');
        this.instance.option('value', 0);

        this.keyboard.caret(0).type('45');

        assert.equal(this.input.val(), '450%', 'text is correct');
    });

    [
        { text: '14.55', value: 0.1455 },
        { text: '20.2', value: 0.202 },
        { text: '1.0154', value: 0.010154, format: '#0.####%' }
    ].forEach(({ text, value, format }) => {
        QUnit.test(`percent format should correctly handle float values, value is ${value}`, function(assert) {
            this.instance.option('format', format ? format : '#0.##%');
            this.keyboard.type(text).change();

            assert.strictEqual(this.input.val(), `${text}%`, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });

    [
        { text: '0.04', value: 0.00035, format: '#0.00%' },
        { text: '0.0350', value: 0.00035, format: '#0.0000%' },
        { text: '0.14', value: 0.00135, format: '#0.00%' },
        { text: '0.4', value: 0.0035, format: '#0.0%' },
        { text: '0.35', value: 0.0035, format: '#0.00%' },
        { text: '1.4', value: 0.0135, format: '#0.0%' },
        { text: '0.005', value: 0.000049999, format: '#0.000%' },
        { text: '0.004', value: 0.0000444999, format: '#0.000%' },
        { text: '1.2962', value: 0.01296249, format: '#0.0000%' },
        { text: '1.2963', value: 0.0129625, format: '#0.0000%' },
        { text: '1.2962', value: 0.01296249999, format: '#0.0000%' },
        { text: '4.654', value: 0.046544999, format: '#0.000%' },
        { text: '-4.65', value: -0.04645, format: '#0.00%' },
        { text: '-35.86', value: -0.35855, format: '#0.00%' },
        { text: '-1.2962', value: -0.01296249, format: '#0.0000%' },
        { text: '10.004', value: 0.100035, format: '#0.000%' },
        { text: '43.104', value: 0.431035, format: '#0.000%' },
        { text: '43.105', value: 0.431045, format: '#0.000%' },
        { text: '0.004', value: 0.000035, format: '#0.000%' },
    ].forEach(({ text, value, format }) => {
        QUnit.test(`percent format should correctly handle float values, value: ${value}, format: ${format} (T1093736)`, function(assert) {
            this.instance.option({
                format,
                value
            });

            assert.strictEqual(this.input.val(), `${text}%`, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });
});

QUnit.module('format: removing', moduleConfig, () => {
    QUnit.test('delete key', function(assert) {
        this.instance.option({
            format: '$ #0.00 d',
            value: 123.45
        });

        this.keyboard.caret(0).keyDown('del');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'delete should not remove a stub');

        this.keyboard.caret(2).keyDown('del');
        assert.notOk(this.keyboard.event.isDefaultPrevented(), 'delete should not be prevented');
        this.keyboard.input('del');
        assert.equal(this.input.val(), '$ 23.45 d', 'value is correct');

        this.keyboard.caret(4).keyDown('del');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, 'caret should be moved throug the point');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'delete should not remove a point');

        this.keyboard.caret(5).keyDown('del');
        assert.notOk(this.keyboard.event.isDefaultPrevented(), 'delete should not be prevented');
        this.keyboard.input('del');
        assert.equal(this.input.val(), '$ 23.50 d', 'required digit should be replaced to 0 after removing');
    });

    QUnit.test('backspace key', function(assert) {
        this.instance.option({
            format: '$ #0.00 d',
            value: 123.45
        });

        this.keyboard.caret(1).keyDown('backspace');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'delete should not remove a stub');

        this.keyboard.caret(3).keyDown('backspace');
        assert.notOk(this.keyboard.event.isDefaultPrevented(), 'delete should not be prevented');
        this.keyboard.input('backspace');
        assert.equal(this.input.val(), '$ 23.45 d', 'value is correct');

        this.keyboard.caret(5).keyDown('backspace');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, 'caret should be moved throug the point');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'delete should not remove a point');

        this.keyboard.caret(6).keyDown('backspace');
        assert.notOk(this.keyboard.event.isDefaultPrevented(), 'delete should not be prevented');
        this.keyboard.input('backspace');
        assert.equal(this.input.val(), '$ 23.50 d', 'required digit should be replaced to 0 after removing');
    });

    QUnit.test('removing non required char with negative value', function(assert) {
        this.instance.option('value', -123.45);

        this.keyboard.caret(6).press('del');
        assert.equal(this.input.val(), '-123.4', 'value is correct');

        this.keyboard.press('backspace').change();
        assert.equal(this.input.val(), '-123', 'value is correct');
    });

    QUnit.test('last non required zero should not be typed', function(assert) {
        this.instance.option('format', '#.##');
        this.keyboard.type('1.50');

        assert.equal(this.input.val(), '1.50', 'zero type was not prevented');

        this.keyboard.press('enter');
        assert.equal(this.input.val(), '1.5', 'value was reformatted on value change');
    });

    QUnit.test('removing with group separators using delete key', function(assert) {
        this.instance.option({
            format: '$ #,##0.## d',
            value: 1234567890
        });

        assert.equal(this.input.val(), '$ 1,234,567,890 d', 'value is correct');

        this.keyboard.caret(2).press('del');
        assert.equal(this.input.val(), '$ 234,567,890 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret is good');

        this.keyboard.caret(5).press('del');
        assert.equal(this.input.val(), '$ 234,567,890 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 6, end: 6 }, 'caret is good');

        this.keyboard.caret({ start: 4, end: 11 }).press('del');
        assert.equal(this.input.val(), '$ 2,390 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, 'caret is good after selection removing');
    });

    QUnit.test('removing with group separators using backspace key', function(assert) {
        this.instance.option({
            format: '$ #,##0.## d',
            value: 1234567890
        });

        assert.equal(this.input.val(), '$ 1,234,567,890 d', 'value is correct');

        this.keyboard.caret(3).press('backspace');

        assert.equal(this.input.val(), '$ 234,567,890 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret is good');

        this.keyboard.caret(6).press('backspace');
        assert.equal(this.input.val(), '$ 234,567,890 d', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, 'caret is good');

        this.keyboard.caret({ start: 4, end: 11 }).press('backspace');
        assert.equal(this.input.val(), '$ 2,390 d', 'value is correct');
    });

    QUnit.test('removing required last char should replace it to 0', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1
        });
        this.keyboard.caret(1).press('backspace');

        assert.equal(this.input.val(), '0.00', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is good');
    });

    QUnit.test('removing required last char should replace it to 0 if there are stubs before', function(assert) {
        this.instance.option({
            format: '$#0.00',
            value: 1
        });
        this.keyboard.caret(2).press('backspace');

        assert.equal(this.input.val(), '$0.00', 'value is correct');
        assert.equal(this.keyboard.caret().start, 2, 'caret is good');
    });

    QUnit.test('removing required last char should replace it to 0 if percent format', function(assert) {
        this.instance.option('format', '#0%');
        this.instance.option('value', 0.01);
        this.keyboard.caret(1).press('backspace');

        assert.equal(this.input.val(), '0%', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret position is correct');
    });

    QUnit.test('removing required decimal digit should replace it to 0 and move caret', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1.23
        });

        this.keyboard.caret(4).press('backspace');

        assert.equal(this.input.val(), '1.20', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret position is correct');

        this.keyboard.press('backspace');
        assert.equal(this.input.val(), '1.00', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret position is correct');
    });

    QUnit.test('removing integer digit using backspace if group separator is hiding', function(assert) {
        this.instance.option({
            format: '#,##0',
            value: 1234
        });
        this.keyboard.caret(4).press('backspace');

        assert.equal(this.input.val(), '124', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret position is correct');
    });

    QUnit.test('removing all characters should change value to 0', function(assert) {
        this.instance.option({
            format: '$#0',
            value: 1
        });

        this.keyboard.caret({ start: 0, end: 2 }).press('backspace').change();

        assert.strictEqual(this.input.val(), '$0', 'value is correct');
        assert.strictEqual(this.instance.option('value'), 0, 'value is reseted');
    });

    QUnit.test('removing all digits but not all characters should change value to 0', function(assert) {
        this.instance.option({
            format: '#0.0 kg',
            value: 1
        });

        this.keyboard.caret({ start: 0, end: 4 }).press('backspace').change();

        assert.strictEqual(this.input.val(), '0.0 kg', 'value is correct');
        assert.strictEqual(this.instance.option('value'), 0, 'value is reseted');
    });

    QUnit.test('removing all digits with backspace should be possible when required zeros are in the end', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1
        });

        this.keyboard.caret(5)
            .press('backspace')
            .press('backspace')
            .press('backspace')
            .press('backspace');

        assert.equal(this.input.val(), '0.00', 'value is correct');
    });

    QUnit.test('removing all digits should change value to 0 even if it\'s negative (T892552)', function(assert) {
        this.instance.option({
            format: '#,##0.## ₽',
            value: -1
        });

        this.keyboard
            .caret({ start: 0, end: 4 })
            .press('backspace')
            .input('backspace')
            .change();

        assert.strictEqual(this.input.val(), '0 ₽', 'text is correct');
        assert.strictEqual(this.instance.option('value'), 0, 'value is reseted');
    });

    QUnit.test('removing last digit should change value to 0 even if it\'s negative (T892552)', function(assert) {
        this.instance.option({
            format: '#,##0.## ₽',
            value: -1
        });

        this.keyboard
            .caret({ start: 2, end: 2 })
            .press('backspace')
            .input('backspace')
            .change();

        assert.strictEqual(this.input.val(), '0 ₽', 'text is correct');
        assert.strictEqual(this.instance.option('value'), 0, 'value is reseted');
    });

    QUnit.test('removing digit if decimal format', function(assert) {
        this.instance.option({
            format: '00000',
            value: 1234
        });

        assert.equal(this.input.val(), '01234', 'value is correct');

        this.keyboard.caret(5).press('backspace');
        assert.equal(this.input.val(), '00123', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, 'caret is correct');
    });

    QUnit.test('removing digit if decimal format with prefix', function(assert) {
        this.instance.option({
            format: '$00000',
            value: 1234
        });

        assert.equal(this.input.val(), '$01234', 'value is correct');

        this.keyboard.caret(6).press('backspace');
        assert.equal(this.input.val(), '$00123', 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 6, end: 6 }, 'caret is correct');
    });

    QUnit.test('removing decimal separator should be possible if float part is not required', function(assert) {
        this.instance.option({
            format: '#0.## kg',
            value: '12.3'
        });

        this.keyboard.caret(4)
            .press('backspace')
            .press('backspace');

        assert.equal(this.input.val(), '12 kg', 'decimal separator has been removed');
    });

    [',', '.'].forEach((separator) => {
        QUnit.test(`caret should be moved to the float part by "${separator}"`, function(assert) {
            this.instance.option({
                format: {
                    type: 'fixedPoint',
                    precision: 2
                },
                value: 0
            });

            this.keyboard
                .caret({ start: 0, end: 4 })
                .type(`${separator}45`)
                .change();

            assert.strictEqual(this.instance.option('value'), 0.45, 'Value is correct');
        });
    });

    QUnit.test('removing a stub in the end or begin of the text should lead to remove minus sign', function(assert) {
        this.instance.option({
            format: '$ #0.00;<<$ #0.00>>',
            value: -5
        });

        this.keyboard.caret(4).press('backspace');
        assert.equal(this.input.val(), '$ 5.00', 'value has been inverted');

        this.keyboard.caret(2).press('backspace');
        assert.equal(this.input.val(), '$ 5.00', 'value has not been inverted after second removing');

        this.instance.option('value', -6);
        this.keyboard.caret(9).press('del');
        assert.equal(this.input.val(), '$ 6.00', 'value has been inverted');

        this.keyboard.caret(6).press('del');
        assert.equal(this.input.val(), '$ 6.00', 'value has not been inverted after second removing');
    });

    QUnit.test('minus zero should be reverted after removing minus via backspace', function(assert) {
        this.instance.option({
            format: '#0.00 kg',
            value: -0
        });

        this.keyboard.caret(1).press('backspace');
        assert.equal(this.input.val(), '0.00 kg', 'value has been reverted');

        this.keyboard.caret(4).press('del');
        assert.equal(this.input.val(), '0.00 kg', 'value has not been reverted again');
    });

    QUnit.test('removing a stub should be prevented when it leads to revert sign', function(assert) {
        this.instance.option({
            format: '#0.00 kg',
            value: -0
        });

        this.keyboard.caret(5).press('del');
        assert.equal(this.input.val(), '0.00 kg', 'value has been reverted');
    });

    QUnit.test('change event should be fired after stub removed and sign reverted', function(assert) {
        const changeHandler = sinon.spy();

        this.instance.option({
            format: '#0.00 kg',
            value: -5,
            onChange: changeHandler
        });

        this.keyboard.caret(5).press('del').press('enter');
        assert.equal(changeHandler.callCount, 1, 'change event has been fired after enter pressed');

        this.instance.option('value', -5);
        this.keyboard.caret(5).press('backspace').press('enter');
        assert.equal(changeHandler.callCount, 1, 'change event has not been fired if value is not changed');
    });

    QUnit.module('valueChanged event on minus sign remove', () => {
        QUnit.test('should be triggered when valueChangeEvent has several events', function(assert) {
            const valueChangedStub = sinon.stub();
            this.instance.option({
                valueChangeEvent: 'focusout input',
                value: -123459,
                onValueChanged: valueChangedStub,
            });

            this.keyboard.caret(1).press('backspace');

            assert.ok(valueChangedStub.calledOnce);
        });

        QUnit.test('should be triggered and sign reverted', function(assert) {
            const valueChangedStub = sinon.stub();
            this.instance.option({
                valueChangeEvent: 'input',
                value: -123459,
                onValueChanged: valueChangedStub,
            });

            this.keyboard.caret(1).press('backspace');

            assert.strictEqual(this.input.val(), '123459');
            assert.ok(valueChangedStub.calledOnce);
        });

        QUnit.test('should be triggered and sign reverted when format is specified (T1170374)', function(assert) {
            const valueChangedStub = sinon.stub();
            this.instance.option({
                format: '#,##0',
                valueChangeEvent: 'input',
                value: -1323,
                onValueChanged: valueChangedStub,
            });

            this.keyboard.caret(1).press('backspace');

            assert.strictEqual(this.input.val(), '1,323');
            assert.ok(valueChangedStub.calledOnce);
        });

        QUnit.test('should be triggered on keyup when valueChangeEvent="keyup"', function(assert) {
            const valueChangedStub = sinon.stub();
            this.instance.option({
                format: '#,##0',
                valueChangeEvent: 'keyup',
                value: -1323,
                onValueChanged: valueChangedStub,
            });

            this.keyboard.caret(1).press('backspace');

            assert.ok(valueChangedStub.notCalled);

            this.keyboard.keyUp('backspace');

            assert.ok(valueChangedStub.calledOnce);
        });

        QUnit.test('should be triggered on change when valueChangeEvent="change"', function(assert) {
            const valueChangedStub = sinon.stub();
            this.instance.option({
                format: '#,##0',
                valueChangeEvent: 'change',
                value: -1323,
                onValueChanged: valueChangedStub,
            });

            this.keyboard.caret(1).press('backspace');

            assert.ok(valueChangedStub.notCalled);

            this.keyboard.press('enter');

            assert.ok(valueChangedStub.calledOnce);
        });

        ['blur', 'focusout'].forEach((valueChangeEvent) => {
            QUnit.test(`should be triggered on ${valueChangeEvent} when valueChangeEvent="${valueChangeEvent}"`, function(assert) {
                const valueChangedStub = sinon.stub();
                this.instance.option({
                    format: '#,##0',
                    valueChangeEvent,
                    value: -1323,
                    onValueChanged: valueChangedStub,
                });

                this.keyboard.caret(1).press('backspace');
                assert.ok(valueChangedStub.notCalled);

                this.input.trigger(valueChangeEvent);
                assert.ok(valueChangedStub.calledOnce);
            });
        });
    });

    QUnit.test('change event should be fired after extra digits have been entered', function(assert) {
        const changeHandler = sinon.spy();

        this.instance.option({
            format: '#0.00 kg',
            value: 0,
            onChange: changeHandler
        });

        this.keyboard.caret(1).type('123.456').press('enter');
        assert.equal(changeHandler.callCount, 1, 'change event has been fired after enter pressed');
        assert.equal(this.instance.option('value'), 123.45, 'value is correct');
    });

    QUnit.test('change event should not be rised when value has not been changed', function(assert) {
        const changeHandler = sinon.spy();

        this.instance.option('value', null);
        this.instance.on('change', changeHandler);
        this.input.trigger('focusout');

        assert.equal(changeHandler.callCount, 0, 'change event has not been rised');

        this.instance.option('value', 1);
        this.input.trigger('focusout');
        assert.equal(changeHandler.callCount, 0, 'change event has not been rised second time');
    });
});

QUnit.module('format: caret boundaries', moduleConfig, () => {
    QUnit.test('right arrow limitation', function(assert) {
        this.instance.option({
            format: '#d',
            value: 1
        });

        assert.equal(this.input.val(), '1d', 'text is correct');

        this.keyboard.caret(1).keyDown('right');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'event is prevented');
    });

    QUnit.test('right arrow after select all', function(assert) {
        this.instance.option({
            format: '# d',
            value: 1
        });

        assert.equal(this.input.val(), '1 d', 'text is correct');

        this.keyboard.caret({ start: 0, end: 3 }).keyDown('right');

        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is after last digit');
    });

    QUnit.test('left arrow limitation', function(assert) {
        this.instance.option({
            format: '$#',
            value: 1
        });

        assert.equal(this.input.val(), '$1', 'text is correct');

        this.keyboard.caret(1).keyDown('left');
        assert.ok(this.keyboard.event.isDefaultPrevented(), 'event is prevented');
    });

    QUnit.test('left arrow after select all', function(assert) {
        this.instance.option({
            format: '$ #0',
            value: 1
        });

        assert.equal(this.input.val(), '$ 1', 'text is correct');

        this.keyboard.caret({ start: 0, end: 3 }).keyDown('left');

        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret is before first digit');
    });

    QUnit.test('home button limitation', function(assert) {
        this.instance.option({
            format: '$#',
            value: 1
        });

        assert.equal(this.input.val(), '$1', 'text is correct');

        this.keyboard.caret(2).keyDown('home');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is on the boundary');
    });

    QUnit.test('end button limitation', function(assert) {
        this.instance.option({
            format: '#d',
            value: 1
        });

        assert.equal(this.input.val(), '1d', 'text is correct');

        this.keyboard.caret(0).keyDown('end');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is on the boundary');
    });

    QUnit.test('shift+home and shift+end should have default behavior', function(assert) {
        this.keyboard.keyDown('home', { shiftKey: true });
        assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false);

        this.keyboard.keyDown('end', { shiftKey: true });
        assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false);
    });

    QUnit.test('ctrl+a should have default behavior', function(assert) {
        this.keyboard.keyDown('a', { ctrlKey: true });
        assert.deepEqual(this.keyboard.event.isDefaultPrevented(), false);
    });

    QUnit.test('moving caret to closest non stub on click - forward direction', function(assert) {
        this.instance.option({
            format: '$ #',
            value: 1
        });

        this.input.focus();
        this.clock.tick(CARET_TIMEOUT_DURATION);

        this.keyboard.caret(0);
        this.input.trigger('dxclick');

        this.clock.tick(CARET_TIMEOUT_DURATION);
        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret was adjusted');
    });

    QUnit.test('moving caret to closest non stub on click - backward direction', function(assert) {
        this.instance.option({
            format: '#d',
            value: 1
        });

        this.keyboard.caret(2);
        this.input.trigger('dxclick');
        this.clock.tick(CARET_TIMEOUT_DURATION);

        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret was adjusted');
    });

    QUnit.test('move caret to the end when only stubs remain in the input', function(assert) {
        this.instance.option({
            format: '$ #',
            value: 1
        });

        this.keyboard.caret(3)
            .press('backspace');

        assert.equal(this.input.val(), '$ ', 'text is correct');

        this.input.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, 'caret was adjusted');
    });

    QUnit.test('move caret to the start when only stubs remain in the input', function(assert) {
        this.instance.option({
            format: '# p',
            value: 1
        });

        this.keyboard.caret(1)
            .press('backspace');

        assert.equal(this.input.val(), ' p', 'text is correct');

        this.input.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 0 }, 'caret was adjusted');
    });

    QUnit.test('caret should not move out of the boundaries when decimal separator was typed in percent format', function(assert) {
        this.instance.option({
            format: '#0%',
            value: 0.01
        });

        this.keyboard.caret(1).type('.');

        assert.equal(this.keyboard.caret().start, 1, 'caret should not move when decimal part is disabled');
    });

    QUnit.test('caret should not move out of the boundaries when non-available digit was typed', function(assert) {
        this.instance.option({
            format: '#0.00 kg',
            value: 1.23
        });

        this.keyboard.caret(4).type('1');

        assert.equal(this.keyboard.caret().start, 4, 'caret should not move');
    });

    QUnit.testInActiveWindow('caret should be before decimal separator on focusin', function(assert) {
        this.instance.option({
            format: '$ #0.## kg',
            value: 1.23
        });

        this.input.focus();

        this.clock.tick(CARET_TIMEOUT_DURATION);
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret is just before decimal separator');
    });

    QUnit.test('caret should be moved to the integer part end on input click if format contains stub in the end (T996477)', function(assert) {
        this.instance.option({
            format: '#0 \'9\'',
            value: 0
        });

        this.input.focus();
        this.clock.tick(CARET_TIMEOUT_DURATION);

        for(let i = 0; i < 2; ++i) {
            this.keyboard.caret(3);
            this.input.trigger('dxclick');
            this.clock.tick(CARET_NO_DBLCLICK_DURATION);
        }

        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is on integer part end');
    });
});

QUnit.module('format: custom parser and formatter', moduleConfig, () => {
    QUnit.test('custom parser and formatter should work', function(assert) {
        this.instance.option({
            value: null,
            format: {
                formatter(value) {
                    return '$ ' + value;
                },

                parser(text) {
                    return parseFloat(text.replace(/[^0-9.]/g, ''));
                }
            }
        });

        this.keyboard.type('1234.56').press('enter');

        assert.equal(this.input.val(), '$ 1234.56', 'text is correct');
        assert.equal(this.instance.option('value'), 1234.56, 'value is correct');
    });

    QUnit.test('editor should create a related LDML pattern for custom formatter only once', function(assert) {
        let counter = 0;
        this.instance.option({
            value: null,
            format: {
                formatter: (val) => {
                    counter++;
                    return String(val);
                }
            }
        });

        const callCountAfterCreateLdmlPattern = counter;
        this.keyboard.type('1');
        assert.strictEqual(counter, callCountAfterCreateLdmlPattern + 1, 'initial formatting + 1 -> format after typing');

        this.keyboard.type('1');
        assert.strictEqual(counter, callCountAfterCreateLdmlPattern + 1 + 1, '+ 1 -> format after typing');
    });

    QUnit.test('custom formatter can be passed right to "format" property (T1010539)', function(assert) {
        let callCount = 0;
        this.instance.option({
            format: () => {
                callCount++;
                return '';
            }
        });
        const callCountAfterCreateLdmlPattern = callCount;

        this.keyboard.type('1');

        assert.strictEqual(callCount, callCountAfterCreateLdmlPattern + 1, 'formatter is called after typing');
    });

    QUnit.test('editor should create a new LDML pattern for custom formatter after "format" option change', function(assert) {
        let counter = 0;
        const formatter = (val) => {
            counter++;
            return String(val);
        };
        this.instance.option({
            value: null,
            format: {
                formatter
            }
        });

        const callCountAfterCreateLdmlPattern = counter;
        this.keyboard.type('1');
        assert.strictEqual(counter, callCountAfterCreateLdmlPattern + 1, 'initial formatting + 1 -> format after typing');

        counter = 0;
        this.instance.option('format', { formatter: formatter.bind(this) });
        assert.strictEqual(counter, callCountAfterCreateLdmlPattern, 'LDML pattern recalculated');
    });

    QUnit.test('editor should not try to create a related LDML pattern for custom formatter and parser', function(assert) {
        let counter = 0;
        this.instance.option({
            value: 1,
            format: {
                formatter: (val) => {
                    counter++;
                    return String(val);
                },
                parser: (text) => parseFloat(text.replace(/[^0-9.-]/g, ''))
            }
        });

        this.keyboard.type('1');
        assert.strictEqual(counter, 4, '1 -> initial formatting + 3 -> format after typing');

        this.keyboard.type('1');
        assert.strictEqual(counter, 7, '+ 3 -> format after typing');
    });
});

QUnit.module('stubs', moduleConfig, function() {
    [
        { format: '123a 0,###.##', expectedText: '123a 1,234.56', expectedValue: 1234.56 },
        { format: '123a 0,###.##', expectedText: '-123a 1,234.56', expectedValue: -1234.56 },
        { format: '0,###.## 456b', expectedText: '1,234.56 456b', expectedValue: 1234.56 },
        { format: '0,###.## 456b', expectedText: '-1,234.56 456b', expectedValue: -1234.56 },
        { format: '\'0\'1 0,###.##', expectedText: '01 1,234.56', expectedValue: 1234.56 },
        { format: '\'0\'1 0,###.##', expectedText: '-01 1,234.56', expectedValue: -1234.56 },
        { format: '0,###.## \'#\'1', expectedText: '1,234.56 #1', expectedValue: 1234.56 },
        { format: '0,###.## \'#\'1', expectedText: '-1,234.56 #1', expectedValue: -1234.56 },
        { format: '0,###.##;abc(0,###.##)', expectedText: 'abc(1,234.56)', expectedValue: -1234.56 },
        { format: '#,##0\'.\'\'0\'\'0\'', expectedText: '1,234.00', expectedValue: 1234 },
        { format: '\'-\'#,###.00', expectedText: '-1.00', expectedValue: 1 },
        { format: '\'-\'#,###.00', expectedText: '--1.00', expectedValue: -1 },
        { format: '\'--\'#,###.00', expectedText: '--1.00', expectedValue: 1 },
        { format: '\'--\'#,###.00', expectedText: '---1.00', expectedValue: -1 },
        { format: '#', expectedText: '1', expectedValue: 1 },
        { format: '#', expectedText: '-1', expectedValue: -1 },
        { format: '#', expectedText: '', typedText: '-', expectedValue: null },
        { format: '#', expectedText: '-1', typedText: '1-', expectedValue: -1 },
        { format: '\'-\'#', expectedText: '--1', typedText: '-1', expectedValue: -1 },
        { format: '\'--\'#', expectedText: '---1', typedText: '-1', expectedValue: -1 },
        { format: '#;-#', expectedText: '-1', typedText: '1-', expectedValue: -1 },
        { format: '#;-#', expectedText: '1', typedText: '1--', expectedValue: 1 },
        { format: '0;<0', expectedText: '<1', typedText: '-1', expectedValue: -1 },
        { format: '0;<0', expectedText: '<1', typedText: '1-', expectedValue: -1 },
        { format: '0;<0', expectedText: '1', typedText: '1--', expectedValue: 1 },
        { format: '\'plus\' 0;\'minus\' 0', expectedText: 'minus 1', typedText: '1-', expectedValue: -1 },
        { format: '\'plus\' 0;\'minus\' 0', expectedText: 'plus 1', typedText: '1--', expectedValue: 1 },
    ].forEach(({ format, expectedText, typedText, expectedValue }) => {
        QUnit.test(`widget should correctly apply format="${format}", value="${typedText || expectedValue}"`, function(assert) {
            this.instance.option({
                value: null,
                format
            });

            this.keyboard
                .type(typedText || expectedValue.toString())
                .press('enter');

            assert.equal(this.input.val(), expectedText, 'text is correct');
            assert.equal(this.instance.option('value'), expectedValue, 'value is correct');
        });
    });
});

QUnit.module('symbol with dot in format', {
    beforeEach: function() {
        this.$element = $('#numberbox').dxNumberBox({
            useMaskBehavior: true,
            value: 1.5,
            format: '\'.\' 0.00'
        });
        this.clock = sinon.useFakeTimers();
        this.$input = this.$element.find(`.${INPUT_CLASS}`);
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.$input, true);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('should not change max precision (T972648)', function(assert) {
        this.keyboard
            .caret(4)
            .type('89')
            .change();

        assert.strictEqual(this.keyboard.caret().start, 6, 'caret position is correct');
        assert.strictEqual(this.instance.option('value'), 1.89, 'value is correct');
    });

    QUnit.test('should not affect caret position on focusin', function(assert) {
        this.keyboard
            .caret(6)
            .focus();
        this.clock.tick(CARET_TIMEOUT_DURATION);

        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, 'caret position is correct');
    });

    QUnit.test('should not affect integer part length calculation', function(assert) {
        this.instance.option('format', '\'.\' 00.0');

        this.keyboard
            .caret(4)
            .type('22')
            .change();

        assert.strictEqual(this.instance.option('value'), 22.5, 'value is correct');
    });

    QUnit.test('should not prevent value formatting on every input', function(assert) {
        this.instance.option({
            format: '\'.\' 00.00'
        });

        this.keyboard
            .caret(4)
            .type('2233445567');

        assert.strictEqual(this.$input.val(), '. 67.50', 'value is correct');
    });
});

QUnit.module('ShadowDOM', {}, function() {
    QUnit.test('should move caret', function(assert) {
        const $element = $('#numberbox').dxNumberBox({
            format: '#0.##',
            value: '',
            useMaskBehavior: true
        });

        const clock = sinon.useFakeTimers();
        const input = $element.find('.dx-texteditor-input');
        const instance = $element.dxNumberBox('instance');
        const keyboard = keyboardMock(input, true);

        instance.option({
            format: '#0 \'9\'',
            value: 0
        });

        input.focus();
        clock.tick(CARET_TIMEOUT_DURATION);
        for(let i = 0; i < 2; ++i) {
            keyboard.caret(3);
            input.trigger('dxclick');
            clock.tick(CARET_NO_DBLCLICK_DURATION);
        }

        assert.deepEqual(keyboard.caret(), { start: 1, end: 1 }, 'caret is on integer part end');
        clock.restore();
    });
});

QUnit.module('drag text', moduleConfig, () => {
    QUnit.test('drop event should be prevented in a masked number box (T1188135)', function(assert) {
        this.instance.option({
            format: '#.##',
            useMaskBehavior: true,
        });

        const event = $.Event(DROP_EVENT_NAME);

        this.input.trigger(event);

        assert.strictEqual(event.isDefaultPrevented(), true, `the ${DROP_EVENT_NAME} event is prevented`);
    });
});

QUnit.module('format: "," as a decimal separator', {
    executeActionWithSuppressErrors: function(action) {
        const logErrorsStub = sinon.stub(errors, 'log');
        action();
        logErrorsStub.restore();
    },
    beforeEach: function(data) {
        this.$element = $('#numberbox').dxNumberBox({
            format: '#0.##',
            value: '',
            useMaskBehavior: true
        });
        this.input = this.$element.find('.dx-texteditor-input');
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.input, true);

        data.oldDecimalSeparator = config().decimalSeparator;
        this.executeActionWithSuppressErrors(() => config({ decimalSeparator: ',' }));
    },
    afterEach: function(data) {
        this.executeActionWithSuppressErrors(() => config({ decimalSeparator: data.oldDecimalSeparator }));
    },
}, () => {
    QUnit.test('value option should have right value after inserting when format is enabled and decimalSeparator is \',\' (T829935)', function(assert) {
        this.instance.option('format', '000.00');

        this.keyboard.caret({ start: 0, end: 6 }).type('12345678').change();

        assert.equal(this.input.val(), '678,00', 'input value is right');
        assert.equal(this.instance.option('value'), 678, 'value option is right');
    });

    QUnit.test('dot should not be ignored in percent format when the value has been parsed correctly', function(assert) {
        this.instance.option('format', '#0.00%');
        this.instance.option('value', 0.256);

        this.keyboard.caret(2).type('.5');

        assert.equal(this.input.val(), '25,56%', 'text is correct');
    });

    QUnit.test('removing decimal separator if decimal separator is not default', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: 1
        });

        this.keyboard.caret(2).press('backspace');

        assert.equal(this.input.val(), '1,00', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, 'caret is moved');
    });

    QUnit.test('caret should be moved to the float part by \'.\' even when decimal separator is not \'.\'', function(assert) {
        this.instance.option({
            format: '#0.00',
            value: null
        });

        this.keyboard.type('123.45');

        assert.equal(this.input.val(), '123,45', 'text is correct');
    });

    QUnit.test('should parse float numbers with the \',\' separator', function(assert) {
        this.instance.option({ format: '#.##' });

        this.keyboard.type('2,333');

        assert.strictEqual(this.input.val(), '2,33');

        this.keyboard.caret({ start: 0, end: 4 }).press('backspace');

        this.keyboard.type('2,666');

        assert.strictEqual(this.input.val(), '2,66');
    });
});

QUnit.module('deprecation error logging', () => {
    QUnit.test('deprecated separator warning should be logged on config change', function(assert) {
        const originalConfig = config();
        const logErrorsStub = sinon.stub(errors, 'log');

        try {
            config({ decimalSeparator: ',' });

            const message = 'Now, the decimalSeparator is selected based on the specified locale.';
            assert.ok(logErrorsStub.calledWith('W0003', 'config', 'decimalSeparator', '19.2', message), 'Message was logged correctly');
        } finally {
            config(originalConfig);
            logErrorsStub.restore();
        }
    });
});
