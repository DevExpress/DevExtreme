import 'intl';
import 'localization/date';
import 'localization/number';
import { locale } from 'localization/core';

import $ from 'jquery';
import 'ui/date_box';
import { excel as excelCreator } from 'exporter';
import dateLocalization from 'localization/date';
import keyboardMock from '../../helpers/keyboardMock.js';

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
        QUnit.test('DateBox should not raise error when digits are true arabic digits (T851630)', function(assert) {
            const currentLocale = locale();
            try {
                locale('ar-u-nu-arab');
                const $dateBox = $('#dateBox').dxDateBox({
                    value: new Date(2015, 10, 10),
                    type: 'date',
                    pickerType: 'calendar',
                    useMaskBehavior: true,
                    opened: true
                });

                const $input = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR);
                const keyboard = keyboardMock($input);

                keyboard
                    .press('right')
                    .press('enter');
                const date = $input.val();

                assert.equal(date, '١١/١١/٢٠١٥', 'date is localized');
            } catch(e) {
                assert.ok(false, 'Error occured: ' + e.message);
            } finally {
                locale(currentLocale);
            }
        });

        QUnit.test('DateBox should not raise error when digits are Farsi digits (T867867)', function(assert) {
            const currentLocale = locale();
            try {
                locale('fa-u-ca-gregory');
                const $dateBox = $('#dateBox').dxDateBox({
                    value: new Date(2015, 10, 10),
                    type: 'date',
                    pickerType: 'calendar',
                    useMaskBehavior: true
                });

                const $input = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR);
                const keyboard = keyboardMock($input);

                keyboard
                    .press('up')
                    .press('enter');
                const date = $input.val();

                assert.strictEqual(date, '۲۰۱۶/۱۱/۱۰', 'date is localized');
            } catch(e) {
                assert.ok(false, 'Error occured: ' + e.message);
            } finally {
                locale(currentLocale);
            }
        });

        QUnit.test('DateBox should not raise error when digits are Marathi digits (T867867)', function(assert) {
            const currentLocale = locale();
            try {
                locale('mr');
                const $dateBox = $('#dateBox').dxDateBox({
                    value: new Date(2015, 10, 10),
                    type: 'date',
                    pickerType: 'calendar',
                    useMaskBehavior: true,
                    opened: true
                });

                const $input = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR);
                const keyboard = keyboardMock($input);

                keyboard
                    .press('right')
                    .press('enter');
                const date = $input.val();

                assert.equal(date, '११/११/२०१५', 'date is localized');
            } catch(e) {
                assert.ok(false, 'Error occured: ' + e.message);
            } finally {
                locale(currentLocale);
            }
        });
    });
});

QUnit.module('Excel creator', commonEnvironment, () => {
    QUnit.test('Arabic data convert', function(assert) {
        const originalCulture = locale();

        try {
            locale('ar-u-nu-arab');

            const convertDate = function(formatter) {
                return excelCreator.formatConverter.convertFormat(formatter, null, 'date');
            };

            const pattern = '[$-2010000]d\\/M\\/yyyy';
            const formatter = function(value) {
                return dateLocalization.format(value, 'shortdate');
            };

            assert.strictEqual(convertDate(formatter), pattern, `Pattern: "${pattern}" Example:"${formatter(new Date())}"`);
        } finally {
            locale(originalCulture);
        }
    });
});
