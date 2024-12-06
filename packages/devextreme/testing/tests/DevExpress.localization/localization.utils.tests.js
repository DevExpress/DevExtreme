import { toFixed } from 'common/core/localization/utils';

const { module: testModule, test } = QUnit;

testModule('Localization utils', () => {
    test('toFixed', function(assert) {
        assert.strictEqual(toFixed(4.645, 2), '4.65');
        assert.strictEqual(toFixed(4.645, 1), '4.6');
        assert.strictEqual(toFixed(4.645, 0), '5');
        assert.strictEqual(toFixed(4.465, 0), '4');
        assert.strictEqual(toFixed(4.64, 2), '4.64');
        assert.strictEqual(toFixed(35.855, 2), '35.86');
        assert.strictEqual(toFixed(35.855, 5), '35.85500');
        assert.strictEqual(toFixed(-4.645, 2), '-4.65');
        assert.strictEqual(toFixed(-4.645, 1), '-4.6');
        assert.strictEqual(toFixed(-4.645, 0), '-5');
        assert.strictEqual(toFixed(-4.465, 0), '-4');
        assert.strictEqual(toFixed(-4.64, 2), '-4.64');
        assert.strictEqual(toFixed(-35.855, 2), '-35.86');
        assert.strictEqual(toFixed(-35.855, 5), '-35.85500');
        assert.strictEqual(toFixed(4.645, 2), '4.65', '4.65');
        assert.strictEqual(toFixed(1.296249, 4), '1.2962', 'T848392');
        assert.strictEqual(toFixed(-1.296249, 4), '-1.2962', 'T848392');
        assert.strictEqual(toFixed(43.1035, 3), '43.104', 'T1093544');
        assert.strictEqual(toFixed(-43.1035, 3), '-43.104', 'T1093544');
        assert.strictEqual(toFixed(43.1045, 3), '43.105', 'T1093544');
        assert.strictEqual(toFixed(0.035, 2), '0.04', 'T1093544');
        assert.strictEqual(toFixed(-0.035, 2), '-0.04', 'T1093544');
        assert.strictEqual(toFixed(0.0349999, 2), '0.03', 'T1093544');
        assert.strictEqual(toFixed(-0.0349999, 2), '-0.03', 'T1093544');
        assert.strictEqual(toFixed(10.0035, 3), '10.004', 'T1093544');
        assert.strictEqual(toFixed(4.465), '4', 'precision omitted -> precision is 0');
    });
});
