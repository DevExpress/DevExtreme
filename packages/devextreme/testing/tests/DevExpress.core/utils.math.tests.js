const mathUtils = require('core/utils/math');
const adjust = mathUtils.adjust;

QUnit.test('fitIntoRange', function(assert) {
    const value = 10;
    const min = 5;
    const max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 10, 'Returned value is right');
});

QUnit.test('fitIntoRange, when value < min', function(assert) {
    const value = 3;
    const min = 5;
    const max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 5, 'Returned value is right');
});

QUnit.test('fitIntoRange, when value > max', function(assert) {
    const value = 20;
    const min = 5;
    const max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 15, 'Returned value is right');
});

QUnit.test('fitIntoRange, when value < min, max = undefined', function(assert) {
    const value = 3;
    const min = 5;

    assert.equal(mathUtils.fitIntoRange(value, min, undefined), 5, 'Returned value is right');
});

QUnit.test('fitIntoRange, when value > max, min = undefined', function(assert) {
    const value = 15;
    const max = 10;

    assert.equal(mathUtils.fitIntoRange(value, undefined, max), 10, 'Returned value is right');
});

QUnit.test('fitIntoRange, when min = 0', function(assert) {
    const value = -5;
    const min = 0;
    const max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 0, 'Returned value is right');
});

QUnit.test('fitIntoRange, when max = 0', function(assert) {
    const value = 5;
    const min = -10;
    const max = 0;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 0, 'Returned value is right');
});

QUnit.test('adjust', function(assert) {
    assert.strictEqual(adjust(1.1 + 0.1, 0.1), 1.2, 'adjusting numbers with floating point');
    assert.strictEqual(adjust(1.1 + 1e-4, 1e-4), 1.1001, 'adjusting numbers in exponential notation');
    assert.strictEqual(adjust(1.1e-8 + 1.23456789e-8, 1.23456789e-8), 2.33456789e-8, 'adjusting numbers with precision above 7');
    assert.strictEqual(adjust(3e-8), 3e-8, 'checking adjust numbers in exponential notation (Edge, precision=0)');
    assert.strictEqual(adjust(1.1e-8), 1.1e-8, 'checking adjust numbers in exponential notation (Edge, precision=1)');
    assert.strictEqual(adjust(1.03e-8), 1.03e-8, 'checking adjust numbers in exponential notation (Edge, precision=2)');
    assert.strictEqual(adjust(1.211e-7), 1.211e-7, 'checking adjust numbers in exponential notation (Edge, precision=3)');
    assert.strictEqual(adjust(1.3e-16 - 1.1e-16), 2e-17, 'checking adjust numbers in exponential notation (Edge, exponent < -15)');
    assert.strictEqual(adjust(1.182667 + 5e-7, 5e-7), 1.1826675, 'number in non exponential notation & tickInterval in exponential notation');
    assert.strictEqual(adjust(5000000070121.669), 5000000070121.669, 'adjusting big numbers');
    assert.strictEqual(adjust(10000000000.1 + 0.2), 10000000000.3);
    assert.strictEqual(adjust(1.000001, 0.000001), 1.000001);
});
