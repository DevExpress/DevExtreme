const noop = require('core/utils/common').noop;
const config = require('core/config');
const parseUtils = require('viz/components/parse_utils');

QUnit.module('valueType');

QUnit.test('check type = "numeric"', function(assert) {
    const result = parseUtils.correctValueType('numeric');

    assert.equal(result, 'numeric');
});

QUnit.test('check type = "datetime"', function(assert) {
    const result = parseUtils.correctValueType('datetime');

    assert.equal(result, 'datetime');
});

QUnit.test('check type = "datetime"', function(assert) {
    const result = parseUtils.correctValueType('datetime');

    assert.equal(result, 'datetime');
});

QUnit.test('check invalid type', function(assert) {
    const result = parseUtils.correctValueType('asfa');

    assert.equal(result, '');
});

QUnit.module('parsers');

QUnit.test('can get string parser', function(assert) {
    const parser = parseUtils.getParser('string');

    assert.ok(parser);
    assert.strictEqual(parser, parseUtils.parsers.string);
});

QUnit.test('string parser', function(assert) {
    const parser = parseUtils.getParser('string');

    const result = parser(10);

    assert.ok(parser);
    assert.strictEqual(result, '10');
});

QUnit.test('string parser - invalid argument = "undefined"', function(assert) {
    // Arrange
    const parser = parseUtils.getParser('string');
    // Act
    const result = parser();
    // Assert
    assert.strictEqual(result, undefined);
});

QUnit.test('string parser - argument = "null"', function(assert) {
    // Arrange
    const parser = parseUtils.getParser('string');
    // Act
    const result = parser(null);
    // Assert
    assert.strictEqual(result, null);
});

QUnit.test('can get numeric parser', function(assert) {
    const parser = parseUtils.getParser('numeric');

    assert.ok(parser);
    assert.strictEqual(parser, parseUtils.parsers.numeric);
});

QUnit.test('numeric parser', function(assert) {
    const parser = parseUtils.getParser('numeric');

    const result29 = parser('29');
    const result0 = parser('0');

    assert.ok(parser);
    assert.strictEqual(result29, 29);
    assert.strictEqual(result0, 0);
});

QUnit.test('numeric parser - invalid argument', function(assert) {
    // Arrange
    const parser = parseUtils.getParser('numeric');
    // Act
    const result = parser('f4956');
    // Assert
    assert.strictEqual(result, undefined);
});

QUnit.test('numeric parser - invalid argument="undefined"', function(assert) {
    // Arrange
    const parser = parseUtils.getParser('numeric');
    // Act
    const result = parser();
    // Assert
    assert.strictEqual(result, undefined);
});

QUnit.test('numeric parser - argument="null"', function(assert) {
    // Arrange
    const parser = parseUtils.getParser('numeric');
    // Act
    const result = parser(null);
    // Assert
    assert.strictEqual(result, null);
});

QUnit.test('can get datetime parser', function(assert) {
    const parser = parseUtils.getParser('datetime');

    assert.ok(parser);
    assert.strictEqual(parser, parseUtils.parsers.datetime);
});

QUnit.test('datetime parser', function(assert) {
    const parser = parseUtils.getParser('datetime');
    const date = new Date();
    const stringDate = date.toDateString();

    const result = parser(stringDate);

    assert.ok(parser);
    assert.ok(result instanceof Date);
});

QUnit.test('datetime parser with ISO8601 without forceIsoDateParsing', function(assert) {
    const defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = false;

    try {
        const parser = parseUtils.getParser('datetime');
        const stringDate = '2017-03-02T11:12:30';

        const result = parser(stringDate);

        assert.ok(parser);
        assert.deepEqual(result, new Date(stringDate));
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test('datetime parser with ISO8601 with forceIsoDateParsing', function(assert) {
    const defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;

    try {
        const parser = parseUtils.getParser('datetime');
        const stringDate = '2017-03-02T11:12:30';

        const result = parser(stringDate);

        assert.ok(parser);
        assert.deepEqual(result, new Date(2017, 2, 2, 11, 12, 30));
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test('datetime parser - invalid argument', function(assert) {
    const parser = parseUtils.getParser('datetime');

    const result = parser({});

    assert.strictEqual(result, undefined);
});

QUnit.test('datetime parser - invalid argument = "undefined"', function(assert) {
    const parser = parseUtils.getParser('datetime');

    const result = parser();

    assert.strictEqual(result, undefined);
});

QUnit.test('datetime parser - argument = "null"', function(assert) {
    const parser = parseUtils.getParser('datetime');

    const result = parser(null);

    assert.strictEqual(result, null);
});

QUnit.test('getParser with invalid value of argument', function(assert) {
    const parser = parseUtils.getParser('1');

    assert.ok(parser);
    assert.equal(parser, noop);
});

QUnit.test('getParser with invalid value of argument and entity', function(assert) {
    const parser = parseUtils.getParser('1', 'argumentAxis');

    assert.ok(parser);
    assert.equal(parser, noop);
});
