import $ from 'jquery';
import config from 'core/config';
import localization from 'localization';
import NumberBox from 'ui/number_box';

import keyboardMock from '../../helpers/keyboardMock.js';

import 'ui/validator';
import 'ui/text_box/ui.text_editor';

const TEXTEDITOR_INPUT_CLASS = '.dx-texteditor-input';

const cloneNumberFormat = (value) => {
    if(value === undefined) {
        return undefined;
    }

    if(typeof value === 'string') {
        return value;
    }

    return JSON.parse(JSON.stringify(value));
};

const restoreGlobalNumberFormat = (savedNumberFormat) => {
    const currentConfig = config();

    if(savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
    } else {
        currentConfig.numberFormat = cloneNumberFormat(savedNumberFormat);
    }
};

const saveNumberBoxCustomRules = () => (
    NumberBox._classCustomRules ? [...NumberBox._classCustomRules] : []
);

const restoreNumberBoxCustomRules = (savedRules) => {
    NumberBox._classCustomRules = savedRules ? [...savedRules] : [];
};

const saveLocalizationState = () => ({
    locale: localization.locale(),
    numberFormat: cloneNumberFormat(config().numberFormat),
    numberBoxCustomRules: saveNumberBoxCustomRules(),
});

const restoreLocalizationState = (savedState) => {
    localization.locale(savedState.locale);
    restoreGlobalNumberFormat(savedState.numberFormat);
    restoreNumberBoxCustomRules(savedState.numberBoxCustomRules);
};

const localizationModuleHooks = {
    beforeEach: function() {
        this.savedLocalizationState = saveLocalizationState();
        delete config().numberFormat;
        localization.locale('en');
    },

    afterEach: function() {
        restoreLocalizationState(this.savedLocalizationState);
    },
};

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        localizationModuleHooks.beforeEach.call(this);

        this.$element = $('#numberbox').dxNumberBox({
            format: '#0.##',
            value: '',
            useMaskBehavior: true,
        });
        this.input = this.$element.find(TEXTEDITOR_INPUT_CLASS);
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.input, true);
    },

    afterEach: function() {
        localizationModuleHooks.afterEach.call(this);
    },
};

QUnit.module('localization: separator keys', moduleConfig, () => {
    QUnit.test('pressing "." should clear selected text if it contains a decimal separator (T1199553)', function(assert) {
        localization.locale('en');

        this.instance.option({
            format: '0#.00',
            value: 123.45,
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .type('.');

        assert.strictEqual(this.input.val(), '0.00', 'mask value is cleared');
    });

    QUnit.test('pressing the "." key on the numpad should clear the selected text regardless of the char produced (T1199553)', function(assert) {
        const NUMPAD_DOT_KEY_CODE = 110;

        localization.locale('fr-ca');

        this.instance.option({
            format: '0#.00',
            value: 123.45,
        });

        this.keyboard
            .caret({ start: 0, end: 6 })
            .type('.', { which: NUMPAD_DOT_KEY_CODE });

        assert.strictEqual(this.input.val(), '0,00', 'mask value is cleared');
    });
});

QUnit.module('localization: global number format', localizationModuleHooks, () => {
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

QUnit.module('localization: global number format locale', localizationModuleHooks, () => {
    QUnit.test('uses format locale from global numberFormat map with de message locale', function(assert) {
        localization.locale('de');
        config({
            ...config(),
            numberFormat: {
                default: {
                    locale: 'en-US',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                },
            },
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.56,
            useMaskBehavior: true,
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,234.56', 'display uses en-US separators');
    });

    QUnit.test('parses value using effective format locale separators', function(assert) {
        localization.locale('de');
        config({
            ...config(),
            numberFormat: {
                default: {
                    locale: 'en-US',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                },
            },
        });

        const $element = $('#numberbox').dxNumberBox({
            value: null,
            useMaskBehavior: true,
        });
        const instance = $element.dxNumberBox('instance');
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input, true);

        keyboard
            .caret({ start: 0, end: 0 })
            .type('1234.56')
            .change();

        assert.strictEqual(instance.option('value'), 1234.56, 'parses en-US decimal separator');
    });

    QUnit.test('dynamic format locale function is applied in NumberBox', function(assert) {
        let dynamicLocale = 'en-US';

        localization.locale('de');
        config({
            ...config(),
            numberFormat: {
                default: {
                    locale: () => dynamicLocale,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                },
            },
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.56,
            useMaskBehavior: true,
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,234.56');

        dynamicLocale = 'de-DE';
        $element.dxNumberBox('instance').option('value', 1234.56);

        assert.strictEqual($input.val(), '1.234,56');
    });

    QUnit.test('local format option keeps type; global numberFormat locale applies to culture', function(assert) {
        localization.locale('de');
        config({
            ...config(),
            numberFormat: {
                default: {
                    locale: 'en-US',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                },
            },
        });

        const $element = $('#numberbox').dxNumberBox({
            value: 1234.56,
            useMaskBehavior: true,
            format: {
                type: 'fixedPoint',
                precision: 0,
            },
        });
        const $input = $element.find(TEXTEDITOR_INPUT_CLASS);

        assert.strictEqual($input.val(), '1,235', 'precision from local format; en-US from global numberFormat');
    });
});
