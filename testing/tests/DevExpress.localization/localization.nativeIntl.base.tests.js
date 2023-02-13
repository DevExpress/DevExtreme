import dateLocalization from 'localization/date';
import { locale } from 'localization/core';

locale('en');

const NARROW_NO_BREAK_SPACE = ' ';

QUnit.module('Localization date', () => {
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
