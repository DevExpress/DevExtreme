const stringUtils = require('core/utils/string');

QUnit.module('String utils');

QUnit.test('replace all case insensitive', function(assert) {
    assert.strictEqual(stringUtils.replaceAll('test sentence', 'test', '<b>test</b>'), '<b>test</b> sentence', 'simplest case');
    assert.strictEqual(stringUtils.replaceAll('test sentence', 'test', '<b>$1</b>'), '<b>test</b> sentence', 'replacement token $1');
    assert.strictEqual(stringUtils.replaceAll('Test sentence', 'test', '<b>$1</b>'), '<b>Test</b> sentence', 'Replacement for different case');
    assert.strictEqual(stringUtils.replaceAll('Test sentence test', 'test', '<b>$1</b>'), '<b>Test</b> sentence <b>test</b>', 'Multiple replacements');
});

QUnit.test('stringFormat', function(assert) {
    assert.equal(stringUtils.format('{0} - {1} - {2}', 'test1', 'test2', 'test3'), 'test1 - test2 - test3');
});

QUnit.test('stringFormat for $0 value (T185036)', function(assert) {
    assert.equal(stringUtils.format('{0}', null), 'null');
    assert.equal(stringUtils.format('{0}', '$0'), '$0');
    assert.equal(stringUtils.format('{0}', '$0.00'), '$0.00');
});

QUnit.test('isEmpty', function(assert) {
    assert.ok(stringUtils.isEmpty(''));
    assert.ok(stringUtils.isEmpty(undefined));
    assert.ok(stringUtils.isEmpty(' '));
    assert.ok(stringUtils.isEmpty('  '));
    assert.ok(stringUtils.isEmpty(null));

    assert.ok(!stringUtils.isEmpty('1'));
    assert.ok(!stringUtils.isEmpty('1 '));
    assert.ok(!stringUtils.isEmpty(' 1'));
    assert.ok(!stringUtils.isEmpty('text'));
});

QUnit.test('stringFormat with more than two "$" in argument', function(assert) {
    assert.equal(stringUtils.format('{0}', '$$$'), '$$$');
});
