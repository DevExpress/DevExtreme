const Translator1D = require('viz/translators/translator1d').Translator1D;

const EPSILON = 1E-8;

QUnit.module('Translator1D');

QUnit.test('Instance type', function(assert) {
    const translator = new Translator1D();
    assert.ok(translator instanceof Translator1D);
});

QUnit.test('construction', function(assert) {
    const translator = new Translator1D();
    assert.deepEqual(translator.getDomain(), [NaN, NaN], 'domain');
    assert.deepEqual(translator.getCodomain(), [NaN, NaN], 'codomain');
});

QUnit.test('setDomain', function(assert) {
    const translator = new Translator1D();

    translator.setDomain();
    assert.deepEqual(translator.getDomain(), [NaN, NaN], 'no arguments');

    translator.setDomain('test', {});
    assert.deepEqual(translator.getDomain(), [NaN, NaN], 'not valid arguments');

    translator.setDomain('20', '30');
    assert.deepEqual(translator.getDomain(), [20, 30], 'string-like arguments');

    translator.setDomain(1, 2);
    assert.deepEqual(translator.getDomain(), [1, 2], 'arguments');
});

QUnit.test('setCodomain', function(assert) {
    const translator = new Translator1D();

    translator.setCodomain();
    assert.deepEqual(translator.getCodomain(), [NaN, NaN], 'no arguments');

    translator.setCodomain('test', {});
    assert.deepEqual(translator.getCodomain(), [NaN, NaN], 'not valid arguments');

    translator.setCodomain('20', '30');
    assert.deepEqual(translator.getCodomain(), [20, 30], 'string-like arguments');

    translator.setCodomain(1, 2);
    assert.deepEqual(translator.getCodomain(), [1, 2], 'arguments');
});

QUnit.test('State getters', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(1, 2).setCodomain(10, 20);

    assert.strictEqual(translator.getDomainStart(), 1, 'domain start');
    assert.strictEqual(translator.getDomainEnd(), 2, 'domain end');
    assert.strictEqual(translator.getCodomainStart(), 10, 'codomain start');
    assert.strictEqual(translator.getCodomainEnd(), 20, 'codomain end');
    assert.strictEqual(translator.getDomainRange(), 1, 'domain range');
    assert.strictEqual(translator.getCodomainRange(), 10, 'codomain range');
});

QUnit.test('translate', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(0, 100).setCodomain(180, 0);

    assert.roughEqual(translator.translate(0), 180, EPSILON, '0');
    assert.roughEqual(translator.translate('25'), 135, EPSILON, '25');
    assert.roughEqual(translator.translate(50), 90, EPSILON, '50');
    assert.roughEqual(translator.translate('75'), 45, EPSILON, '75');
    assert.roughEqual(translator.translate(100), 0, EPSILON, '100');
    assert.roughEqual(translator.translate(100 / 180), 179, EPSILON, '100 / 180');
    assert.roughEqual(translator.translate(17900 / 180), 1, EPSILON, '17900 / 180');
});

QUnit.test('translate - out of ranges', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(0, 100).setCodomain(180, 0);

    assert.ok(isNaN(translator.translate(-1)), '-1');
    assert.ok(isNaN(translator.translate(101)), '101');
    assert.ok(isNaN(translator.translate(1000)), '1000');
});

QUnit.test('translate - not numbers', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(0, 100).setCodomain(180, 0);

    assert.ok(isNaN(translator.translate(undefined)), 'undefined');
    assert.ok(isNaN(translator.translate(NaN)), 'NaN');
    assert.ok(isNaN(translator.translate('A')), 'A');
    assert.ok(isNaN(translator.translate({})), '{}');
});

QUnit.test('adjust', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(0, 100).setCodomain(180, 0);

    assert.strictEqual(translator.adjust(0), 0, '0');
    assert.strictEqual(translator.adjust(50), 50, '50');
    assert.strictEqual(translator.adjust(100), 100, '100');
    assert.strictEqual(translator.adjust(-1), 0, '-1');
    assert.strictEqual(translator.adjust(101), 100, '101');
    assert.strictEqual(translator.adjust(-10), 0, '-10');
    assert.strictEqual(translator.adjust(1000), 100, '1000');
});

QUnit.test('adjust - not numbers', function(assert) {
    const translator = new Translator1D();
    translator.setDomain(0, 100).setCodomain(180, 0);

    assert.ok(isNaN(translator.adjust('A')), 'A');
    assert.ok(isNaN(translator.adjust({})), '{}');
    assert.ok(isNaN(translator.adjust(undefined)), 'undefined');
    assert.ok(isNaN(translator.adjust(NaN)), 'NaN');
});
