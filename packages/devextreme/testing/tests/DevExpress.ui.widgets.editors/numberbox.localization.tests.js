import $ from 'jquery';
import config from 'core/config';
import localization from 'localization';
import NumberBox from 'ui/number_box';

import keyboardMock from '../../helpers/keyboardMock.js';

import 'ui/validator';
import 'ui/text_box/ui.text_editor';

const TEXTEDITOR_INPUT_CLASS = '.dx-texteditor-input';

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
        this.input = this.$element.find(TEXTEDITOR_INPUT_CLASS);
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.input, true);
    }
};

QUnit.module('localization: separator keys', moduleConfig, () => {
    QUnit.test('pressing "." should clear selected text if it contains a decimal separator (T1199553)', function(assert) {
        this.instance.option({
            format: '0#.00',
            value: 123.45
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .type('.');

        assert.strictEqual(this.input.val(), '0.00', 'mask value is cleared');
    });

    QUnit.test('pressing the "." key on the numpad should clear the selected text regardless of the char produced (T1199553)', function(assert) {
        const currentLocale = localization.locale();
        const NUMPAD_DOT_KEY_CODE = 110;

        try {
            localization.locale('fr-ca');
            this.instance.option({
                format: '0#.00',
                value: 123.45
            });

            this.keyboard
                .caret({ start: 0, end: 6 })
                .type('.', { which: NUMPAD_DOT_KEY_CODE });

            assert.strictEqual(this.input.val(), '0,00', 'mask value is cleared');
        } finally {
            localization.locale(currentLocale);
        }
    });
});

QUnit.module('localization: global number format', {
    beforeEach: function() {
        this.savedConfig = { ...config() };
        this.savedLocale = localization.locale();
        localization.locale('en');
    },

    afterEach: function() {
        localization.locale(this.savedLocale);
        config(this.savedConfig);
        NumberBox.defaultOptions([]);
    },
}, () => {
    QUnit.test('uses global numberFormat when local format is not set', function(assert) {
        config({
            ...config(),
            numberFormat: '#,##0.00',
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.5,
            useMaskBehavior: true,
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,234.50', 'text uses global format');
    });

    QUnit.test('local format option has priority over global numberFormat', function(assert) {
        config({
            ...config(),
            numberFormat: '#,##0.00',
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.5,
            useMaskBehavior: true,
            format: {
                type: 'fixedPoint',
                precision: 0,
            },
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,235', 'local format wins over global');
    });

    QUnit.test('defaultOptions format has priority over global numberFormat', function(assert) {
        config({
            ...config(),
            numberFormat: '#,##0.00',
        });
        NumberBox.defaultOptions({
            options: {
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.5,
            useMaskBehavior: true,
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,235', 'defaultOptions format wins over global');
    });
});
