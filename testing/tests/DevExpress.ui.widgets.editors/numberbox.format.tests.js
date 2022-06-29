import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';
import numberLocalization from 'localization/number';
import localization from 'localization';

import 'ui/number_box';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#numberbox').dxNumberBox({
            format: '#0.##',
            value: '',
            useMaskBehavior: true
        });
        this.clock = sinon.useFakeTimers();
        this.input = this.$element.find('.dx-texteditor-input');
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.input, true);
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

            QUnit.test(`caret position after type '${separator}' key, locale(${locale}) with ${expectedSeparator === '.' ? 'point' : 'comma'} separator, format: '#,##0.00' (T1091149)`, function(assert) {
                const currentLocale = localization.locale();

                try {
                    localization.locale(locale);
                    assert.strictEqual(numberLocalization.getDecimalSeparator(), expectedSeparator, 'separator');

                    this.instance.option({
                        format: '#,##0.00',
                        value: 0
                    });

                    this.input.focus();

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
