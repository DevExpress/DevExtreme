import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';
import numberLocalization from 'common/core/localization/number';
import localization from 'localization';

import 'ui/number_box';
import 'ui/text_box/ui.text_editor';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const CARET_TIMEOUT_DURATION = 0;

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#numberbox').dxNumberBox({
            useMaskBehavior: true,
        });
        this.clock = sinon.useFakeTimers();
        this.$input = this.$element.find('.dx-texteditor-input');
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.$input, true);
    },

    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('format: point and comma button', moduleConfig, () => {
    [
        { locale: 'en', expectedSeparator: '.' },
        { locale: 'de', expectedSeparator: ',' },
        { locale: 'ja', expectedSeparator: '.' },
        { locale: 'ru', expectedSeparator: ',' },
        { locale: 'zh', expectedSeparator: '.' },
        { locale: 'hr', expectedSeparator: ',' },
        { locale: 'el', expectedSeparator: ',' },
        { locale: 'ca', expectedSeparator: ',' },
        { locale: 'it', expectedSeparator: ',' },
    ].forEach(({ locale, expectedSeparator }) => {
        [',', '.'].forEach((separator) => {

            QUnit.testInActiveWindow(`caret position after type '${separator}' key, locale(${locale}) with ${expectedSeparator === '.' ? 'point' : 'comma'} separator, format: '#,##0.00' (T1091149)`, function(assert) {
                const currentLocale = localization.locale();

                try {
                    localization.locale(locale);
                    assert.strictEqual(numberLocalization.getDecimalSeparator(), expectedSeparator, 'separator');

                    this.instance.option({
                        format: '#,##0.00',
                        value: 0,
                    });

                    this.$input.focus();
                    this.clock.tick(CARET_TIMEOUT_DURATION);

                    this.keyboard
                        .type('15');

                    assert.deepEqual(this.keyboard.caret(), { end: 2, start: 2 }, 'caret position after type integer part');

                    this.keyboard
                        .type(separator);

                    assert.deepEqual(this.keyboard.caret(), { end: 3, start: 3 }, 'caret position after type decimal separator');

                    this.keyboard
                        .type('20');

                    assert.deepEqual(this.keyboard.caret(), { end: 5, start: 5 }, 'caret position after type float part');
                } finally {
                    localization.locale(currentLocale);
                }
            });
        });
    });
});

QUnit.module('percent', moduleConfig, () => {
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
        { text: '-4.654', value: -0.046544999, format: '#0.000%' },
        { text: '4.65', value: 0.04645, format: '#0.00%' },
        { text: '-4.65', value: -0.04645, format: '#0.00%' },
        { text: '4.6', value: 0.04645, format: '#0.0%' },
        { text: '5', value: 0.04645, format: '#0%' },
        { text: '-35.86', value: -0.35855, format: '#0.00%' },
        { text: '1.2962', value: 0.01296249, format: '#0.0000%' },
        { text: '-1.2962', value: -0.01296249, format: '#0.0000%' },
        { text: '10.004', value: 0.100035, format: '#0.000%' },
        { text: '43.104', value: 0.431035, format: '#0.000%' },
        { text: '43.105', value: 0.431045, format: '#0.000%' },
        { text: '0.004', value: 0.000035, format: '#0.000%' },
        { text: '-0.004', value: -0.000035, format: '#0.000%' },
        { text: '0.0036', value: 0.000035521, format: '#0.0000%' },
        { text: '0.00356', value: 0.000035559, format: '#0.00000%' },
        { text: '0.0035', value: 0.000035499, format: '#0.0000%' },
    ].forEach(({ text, value, format }) => {
        QUnit.test(`percent format should correctly handle float values, value: ${value}, format: ${format} (T1093736)`, function(assert) {
            this.instance.option({
                format,
                value
            });

            assert.strictEqual(this.$input.val(), `${text}%`, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });
});

QUnit.module('exponential format', moduleConfig, () => {
    [
        { value: 1, text: '1.0E+0' },
        { value: 0, text: '0.0E+0' },
        { value: 11, text: '1.1E+1' },
        { value: 11111111111, text: '1.1E+10' },
        { value: 10000000000, text: '1.0E+10' },
        { value: -10000000000, text: '-1.0E+10' },
        { value: 0.0000000001, text: '1.0E-10' },
        { value: -0.0000000001, text: '-1.0E-10' },
    ].forEach(({ text, value }) => {
        QUnit.test(`should correctly handle value, value: ${value} (T1105915)`, function(assert) {
            this.instance.option({
                value,
                format: 'exponential'
            });

            assert.strictEqual(this.$input.val(), text, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });

    [
        { value: 1, text: '1.00000E+0', precision: 5 },
        { value: 12345000000, text: '1.23450E+10', precision: 5 },
        { value: -12345000000, text: '-1.23E+10', precision: 2 },
        { value: 0.00000000012345, text: '1.23450E-10', precision: 5 },
        { value: -0.00000000012345, text: '-1E-10', precision: 0 },
    ].forEach(({ text, value, precision }) => {
        QUnit.test(`should correctly handle value if precision is specified, value: ${value}, precision: ${precision}`, function(assert) {
            this.instance.option({
                value,
                format: {
                    type: 'exponential',
                    precision
                }
            });

            assert.strictEqual(this.$input.val(), text, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });
});
