import dateLocalization from 'localization/date';
import numberLocalization from 'localization/number';
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

QUnit.module('Localization number', () => {
    QUnit.test('format currency with sign (T1076906)', function(assert) {
        assert.equal(numberLocalization.format(-1.2, { style: 'currency', currency: 'USD', currencySign: 'accounting' }), '($1.20)');
        assert.equal(numberLocalization.format(-1.2, { type: 'currency', currency: 'USD', useCurrencyAccountingStyle: true }), '($1)');
        assert.equal(numberLocalization.format(-12, { style: 'currency', currency: 'USD', currencySign: 'standard' }), '-$12.00');
        assert.equal(numberLocalization.format(-12, { type: 'currency', currency: 'USD', useCurrencyAccountingStyle: false }), '-$12');
    });
});
