import dateLocalization from 'localization/date';
import numberLocalization from 'localization/number';
import { locale } from 'localization/core';

import $ from 'jquery';
import 'ui/date_box';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

const ROUNDING_BUG_NUMBERS = [4.645, -4.645, 35.855, -35.855];
const ROUNDING_CORRECTION = {
    '4.64': '4.65',
    '-4.64': '-4.65',
    '35.85': '35.86',
    '-35.85': '-35.86'
};

const commonEnvironment = {
    beforeEach: function() {
        const markup = '<div id="dateBox"></div>';

        $('#qunit').append(markup);
    },

    // afterEach: function() {
    //     $('#qunit-fixture').empty();
    // }
};

const patchPolyfillResults = () => {
    dateLocalization.inject({
        format: function(value, format) {
            // NOTE: IntlPolyfill uses CLDR data, so it formats this format with ` at `, but real browser`s Intl uses `, ` separator.
            let result = this.callBase.apply(this, arguments);
            if(typeof result === 'string') {
                result = result && result.replace(' at ', ', ');
            }
            return result;
        }
    });

    numberLocalization.inject({
        format: function(value, format) {
            // NOTE: IntlPolifill rounding bug. In real Intl it works OK.
            let result = this.callBase.apply(this, arguments);
            if(ROUNDING_BUG_NUMBERS.indexOf(value) !== -1 && format.type === 'fixedPoint' && format.precision === 2 && !!ROUNDING_CORRECTION[result]) {
                result = ROUNDING_CORRECTION[result];
            }
            return result;
        }
    });
};

QUnit.module('Intl localization', {
    before: patchPolyfillResults
}, () => {
    QUnit.module('DateBox', commonEnvironment, () => {
        QUnit.test('DateBox should not raise error when digits are not default arabic digits', function(assert) {
            try {
                locale('ar-u-nu-arab');

                const $dateBox = $('#dateBox').dxDateBox({
                    value: new Date(2015, 10, 10),
                    type: 'date',
                    pickerType: 'calendar',
                    useMaskBehavior: true
                });

                const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
                assert.equal(date, '١٠/١١/٢٠١٥', 'date is localized');
            } catch(e) {
                assert.ok(false, 'Error occured: ' + e.message);
            } finally {
                // locale('en');
            }
        });
    });
});
