import dateLocalization from 'common/core/localization/date';
import numberLocalization from 'common/core/localization/number';
import { locale } from 'common/core/localization/core';

locale('en');

const NARROW_NO_BREAK_SPACE = ' ';

QUnit.module('Localization date', () => {
    QUnit.test('object syntax, fractionalSecondDigits is set in format (T1079944)', function(assert) {
        const date = new Date(Date.UTC(2010, 0, 1, 0, 1, 2, 345));
        const options = { minute: '2-digit', second: '2-digit' };

        assert.equal(dateLocalization.format(date, options), '01:02');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '3' }), '01:02.345');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '1' }), '01:02.3');
    });

    const locales = [ 'de', 'en', 'ja', 'ru', 'zh', 'ar', 'hr', 'el', 'ca' ];
    locales.forEach((localeId) => {
        QUnit.test(`Formatted value via Intl.DateTimeFormat shouldn't have any narrow no-break spaces (T1146346)(${localeId} locale)`, function(assert) {
            const testData = [
                { format: 'shortDate' },
                { format: 'shortTime' },
                { format: 'shortDateshortTime' },
                { format: 'longtime' },
                { format: 'longDate' },
                { format: 'longDateLongTime' },
                { format: 'monthAndYear' },
                { format: 'monthAndDay' },
                { format: 'year' },
                { format: 'shortyear' },
                { format: 'month' },
                { format: 'day' },
                { format: 'hour' },
                { format: 'minute' },
            ];

            try {
                locale(localeId);

                testData.forEach(config => {
                    const { format } = config;

                    const formattedDate = dateLocalization.format(new Date(2021, 9, 17, 16, 6), format);

                    const hasNarrowNoBreakSpaces = formattedDate.indexOf(NARROW_NO_BREAK_SPACE) !== -1;

                    assert.strictEqual(hasNarrowNoBreakSpaces, false, `formatted date with ${format} locale has no any narrow no-break spaces`);
                });
            } finally {
                locale('en');
            }
        });
    });
});

QUnit.module('Localization number', () => {
    QUnit.test('format currency with sign (T1076906)', function(assert) {
        assert.equal(numberLocalization.format(-1.2, { style: 'currency', currency: 'USD', currencySign: 'accounting' }), '($1.20)');
        assert.equal(numberLocalization.format(-1.2, { type: 'currency', currency: 'USD', useCurrencyAccountingStyle: true }), '($1)');
        assert.equal(numberLocalization.format(-12, { style: 'currency', currency: 'USD', currencySign: 'standard' }), '-$12.00');
        assert.equal(numberLocalization.format(-12, { type: 'currency', currency: 'USD', useCurrencyAccountingStyle: false }), '-$12');
    });
});
