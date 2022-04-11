import numberLocalization from 'localization/number';
import { locale } from 'localization/core';

locale('en');

QUnit.module('Localization number', () => {
    QUnit.test('format currency with sign (T1076906)', function(assert) {
        assert.equal(numberLocalization.format(-1.2, { style: 'currency', currency: 'USD', currencySign: 'accounting' }), '($1.20)');
        assert.equal(numberLocalization.format(-1.2, { type: 'currency', currency: 'USD', currencySign: 'accounting' }), '($1)');
        assert.equal(numberLocalization.format(-12, { style: 'currency', currency: 'USD', currencySign: 'standard' }), '-$12.00');
        assert.equal(numberLocalization.format(-12, { type: 'currency', currency: 'USD', currencySign: 'standard' }), '-$12');
    });
});
