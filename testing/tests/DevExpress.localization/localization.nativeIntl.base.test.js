import dateLocalization from 'localization/date';
import { locale } from 'localization/core';

locale('en');

QUnit.module('Localization date', () => {
    QUnit.test('object syntax, fractionalSecondDigits is set in format (T1079944)', function(assert) {
        const date = new Date(Date.UTC(2010, 0, 1, 0, 1, 2, 345));
        const options = { minute: '2-digit', second: '2-digit' };

        assert.equal(dateLocalization.format(date, options), '01:02');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '3' }), '01:02.345');
        assert.equal(dateLocalization.format(date, { ...options, fractionalSecondDigits: '1' }), '01:02.3');
    });
});
