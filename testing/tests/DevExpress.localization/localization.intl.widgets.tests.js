import 'intl';
import 'localization/date';
import 'localization/number';
import { locale } from 'localization/core';

import $ from 'jquery';
import 'ui/date_box';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

const commonEnvironment = {
    beforeEach: function() {
        const markup = '<div id="dateBox"></div>';

        $('#qunit-fixture').append(markup);
    },

    afterEach: function() {
        $('#qunit-fixture').empty();
    }
};


QUnit.module('Intl localization', () => {
    QUnit.module('DateBox', commonEnvironment, () => {
        QUnit.test('DateBox should not raise error when digits are not default arabic digits', function(assert) {
            const currentLocale = locale();
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
                locale(currentLocale);
            }
        });
    });
});
