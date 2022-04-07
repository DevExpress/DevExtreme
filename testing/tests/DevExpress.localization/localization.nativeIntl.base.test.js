import dateLocalization from 'localization/date';
import { locale } from 'localization/core';

locale('en');

QUnit.module('Localization date', () => {
    QUnit.test('object syntax, fractionalSecondDigits is set in format (T1079944)', function(assert) {
        const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0, 123));
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

        assert.equal(dateLocalization.format(date, options), '12/20/2012, 07:00:00 AM');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '3' }), '12/20/2012, 07:00:00.123 AM');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '1' }), '12/20/2012, 07:00:00.1 AM');
    });
});
