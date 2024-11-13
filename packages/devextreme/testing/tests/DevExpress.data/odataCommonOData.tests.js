const $ = require('jquery');
const converters = require('common/data/odata/utils').keyConverters;
const interpretJsonFormat = require('common/data/odata/utils').OData__internals.interpretJsonFormat;
const Guid = require('core/guid');

QUnit.module('OData 2');
QUnit.test('key converters', function(assert) {
    assert.equal(converters.String(1), '1', 'string');
    assert.equal(converters.String('foo'), 'foo', 'string');
    assert.equal(converters.Int32(1), 1, 'Int32');
    assert.equal(converters.Int32(1.1), 1, 'Int32');
    assert.equal(converters.Int64(1).valueOf(), '1L', 'Int64');
    assert.equal(converters.Int64('1').valueOf(), '1L', 'Int64');
    assert.equal(converters.Guid('00000000000000000000000000000000').valueOf(), '00000000-0000-0000-0000-000000000000', 'Guid');
    assert.equal(converters.Boolean(), false, 'Boolean');
    assert.equal(converters.Boolean(1), true, 'Boolean');
    assert.equal(converters.Boolean(0), false, 'Boolean');
    assert.equal(converters.Boolean(true), true, 'Boolean');
    assert.equal(converters.Boolean(false), false, 'Boolean');
    assert.equal(converters.Single(1).valueOf(), '1f', 'Single');
    assert.equal(converters.Single(1.1).valueOf(), '1.1f', 'Single');
    assert.equal(converters.Single(-1.1).valueOf(), '-1.1f', 'Single');
    assert.equal(converters.Decimal(1).valueOf(), '1m', 'Decimal');
    assert.equal(converters.Decimal(1.1).valueOf(), '1.1m', 'Decimal');
    assert.equal(converters.Decimal(-1.1).valueOf(), '-1.1m', 'Decimal');
});

QUnit.test('error', function(assert) {
    const e = {
        error: {
            message: 'Something goes wrong'
        }
    };

    const r = interpretJsonFormat(e, 'success');

    assert.ok(r.error);
    assert.equal(r.error.message, 'Something goes wrong');
});

QUnit.test('list', function(assert) {
    const a = {
        d: {
            results: [1, 2, 3]
        }
    };

    const r = interpretJsonFormat(a, 'success');

    assert.ok(r.data);
    assert.deepEqual(r.data, [1, 2, 3]);
});

QUnit.test('single', function(assert) {
    const a = {
        d: { foo: 'bar' }
    };

    const r = interpretJsonFormat(a, 'success');

    assert.ok(r.data);
    assert.deepEqual(r.data, { foo: 'bar' });
});

QUnit.test('count', function(assert) {
    const a1 = {
        d: { results: [1, 2, 4], __count: '3' }
    };
    const a2 = {
        d: { results: [1, 2, 4], __count: 3 }
    };
    const a3 = {
        d: { results: [1, 2, 4], __count: 'StringValue' }
    };
    const a4 = {
        d: { results: [1, 2, 4] }
    };

    const t1 = interpretJsonFormat(a1, 'success');
    const t2 = interpretJsonFormat(a2, 'success');
    const t3 = interpretJsonFormat(a3, 'success');
    const t4 = interpretJsonFormat(a4, 'success');

    assert.equal(t1.count, 3);
    assert.equal($.type(t1.count), 'number');

    assert.equal(t2.count, 3);
    assert.equal($.type(t2.count), 'number');

    assert.ok(!t3.count);
    assert.ok(!t4.count);
});

QUnit.module('OData 3');
QUnit.test('error', function(assert) {
    const e = {
        'odata.error': {
            message: 'Something goes wrong'
        }
    };

    const r = interpretJsonFormat(e, 'success');

    assert.ok(r.error);
    assert.equal(r.error.message, 'Something goes wrong');
});

QUnit.module('OData 4');
QUnit.test('key converters', function(assert) {
    assert.equal(converters.String(1), '1', 'string');
    assert.equal(converters.String('foo'), 'foo', 'string');
    assert.equal(converters.Int32(1), 1, 'Int32');
    assert.equal(converters.Int32(1.1), 1, 'Int32');
    assert.equal(converters.Int64(1).valueOf(), '1L', 'Int64');
    assert.equal(converters.Int64('1').valueOf(), '1L', 'Int64');
    assert.equal(converters.Guid('00000000000000000000000000000000').valueOf(), '00000000-0000-0000-0000-000000000000', 'Guid');
    assert.equal(converters.Boolean(), false, 'Boolean');
    assert.equal(converters.Boolean(1), true, 'Boolean');
    assert.equal(converters.Boolean(0), false, 'Boolean');
    assert.equal(converters.Boolean(true), true, 'Boolean');
    assert.equal(converters.Boolean(false), false, 'Boolean');
    assert.equal(converters.Single(1).valueOf(), '1f', 'Single');
    assert.equal(converters.Single(1.1).valueOf(), '1.1f', 'Single');
    assert.equal(converters.Single(-1.1).valueOf(), '-1.1f', 'Single');
    assert.equal(converters.Decimal(1).valueOf(), '1m', 'Decimal');
    assert.equal(converters.Decimal(1.1).valueOf(), '1.1m', 'Decimal');
    assert.equal(converters.Decimal(-1.1).valueOf(), '-1.1m', 'Decimal');
});

QUnit.test('error', function(assert) {
    const e = {
        '@odata.error': {
            message: 'Something goes wrong'
        }
    };

    const r = interpretJsonFormat(e, 'success');

    assert.ok(r.error);
    assert.equal(r.error.message, 'Something goes wrong');
});

QUnit.test('list', function(assert) {
    const a = {
        value: [1, 2, 3]
    };

    const r = interpretJsonFormat(a, 'success');

    assert.ok(r.data);
    assert.deepEqual(r.data, [1, 2, 3]);
});

QUnit.test('single', function(assert) {
    const a = { foo: 'bar' };

    const r = interpretJsonFormat(a, 'success');

    assert.ok(r.data);
    assert.deepEqual(r.data, { foo: 'bar' });
});

QUnit.test('count', function(assert) {
    const a1 = { value: [1, 2, 4], '@odata.count': '3' };
    const a2 = { value: [1, 2, 4], '@odata.count': 3 };
    const a3 = { value: [1, 2, 4], '@odata.count': 'StringValue' };
    const a4 = { value: [1, 2, 4] };

    const t1 = interpretJsonFormat(a1, 'success');
    const t2 = interpretJsonFormat(a2, 'success');
    const t3 = interpretJsonFormat(a3, 'success');
    const t4 = interpretJsonFormat(a4, 'success');

    assert.equal(t1.count, 3);
    assert.equal($.type(t1.count), 'number');

    assert.equal(t2.count, 3);
    assert.equal($.type(t2.count), 'number');

    assert.ok(!t3.count);
    assert.ok(!t4.count);
});

QUnit.module('Guids');
QUnit.test('Should parse guids', function(assert) {
    const guid1 = '6fd3d2c5-904d-4e6f-a302-3e277ef36630';
    const guid2 = '27309478-e811-4205-a23f-cfc0e63b4daf';

    const r = interpretJsonFormat({
        'value': {
            key: guid1,
            property: new Guid(guid2).valueOf()
        }
    }, 'success');

    assert.ok(r.data.key instanceof Guid);
    assert.ok(r.data.property instanceof Guid);

    assert.equal(r.data.key.valueOf(), guid1);
    assert.equal(r.data.property.valueOf(), guid2);
});

QUnit.module('Primitives');
QUnit.test('OData 2 & 3', function(assert) {
    // NOTE: http://www.odata.org/documentation/odata-version-2-0/json-format/#RepresentingPrimitiveProperties

    function interpret(value) {
        const result = interpretJsonFormat({ d: { results: value } }, 'success');
        return result.data;
    }

    assert.strictEqual(interpret(0), 0, 'Zero');

    assert.strictEqual(interpret(1), 1, 'Positive integer');
    assert.strictEqual(interpret(-1), -1, 'Negative integer');

    assert.strictEqual(interpret(1.1), 1.1, 'Positive float');
    assert.strictEqual(interpret(-1.1), -1.1, 'Negative float');

    assert.strictEqual(interpret(true), true, 'true');
    assert.strictEqual(interpret(false), false, 'false');

    assert.strictEqual(interpret(''), '', 'Empty string');
    assert.strictEqual(interpret('string'), 'string', 'Non-empty string');
});

QUnit.test('OData 4', function(assert) {
    function interpret(value) {
        const result = interpretJsonFormat({ value: value }, 'success');
        return result.data;
    }

    assert.strictEqual(interpret(0), 0, 'Zero');

    assert.strictEqual(interpret(1), 1, 'Positive integer');
    assert.strictEqual(interpret(-1), -1, 'Negative integer');

    assert.strictEqual(interpret(1.1), 1.1, 'Positive float');
    assert.strictEqual(interpret(-1.1), -1.1, 'Negative float');

    assert.strictEqual(interpret(true), true, 'true');
    assert.strictEqual(interpret(false), false, 'false');

    assert.strictEqual(interpret(''), '', 'Empty string');
    assert.strictEqual(interpret('string'), 'string', 'Non-empty string');
});

QUnit.module('Dates');
QUnit.test('All formats', function(assert) {
    function parseDate(date) {
        return interpretJsonFormat({ d: date }, 'success').data.d.getTime();
    }

    assert.equal(parseDate('/Date(-777807300000)/'), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());
    assert.equal(parseDate('/Date(-777807300000-10)/'), new Date(1945, 4, 9, 14, 15, 0, 0).getTime());
    assert.equal(parseDate('/Date(-777807300000+10)/'), new Date(1945, 4, 9, 14, 35, 0, 0).getTime());

    assert.equal(parseDate('1945-05-09T14:25:12'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.1'), new Date(1945, 4, 9, 14, 25, 12, 100).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.12'), new Date(1945, 4, 9, 14, 25, 12, 120).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.1234567'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());

    assert.equal(parseDate('1945-05-09T14:25:12Z'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.1Z'), new Date(1945, 4, 9, 14, 25, 12, 100).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.12Z'), new Date(1945, 4, 9, 14, 25, 12, 120).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123Z'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.1234567Z'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());

    assert.equal(parseDate('1945-05-09T14:25:12-01'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12+01'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12-0110'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12+0110'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12-01:10'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12+01:10'), new Date(1945, 4, 9, 14, 25, 12, 0).getTime());

    assert.equal(parseDate('1945-05-09T14:25:12.123-01'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123+01'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123-0110'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123+0110'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123-01:10'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
    assert.equal(parseDate('1945-05-09T14:25:12.123+01:10'), new Date(1945, 4, 9, 14, 25, 12, 123).getTime());
});

QUnit.test('OData 2', function(assert) {
    // arrange
    const scalarResponse = { d: { results: '/Date(-777807300000)/' } };
    const singleResponse = { d: { date: '/Date(-777807300000)/' } };
    const collectionResponse = {
        d: [
            { date: '/Date(-777807300000)/' },
            { date: '/Date(-777807300000+10)/' },
            { date: '/Date(-777807300000-10)/' }
        ]
    };

    // act
    const scalarResult = interpretJsonFormat(scalarResponse, 'success');
    const singleResult = interpretJsonFormat(singleResponse, 'success');
    const collectionResult = interpretJsonFormat(collectionResponse, 'success');

    // assert
    assert.equal(scalarResult.data.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(singleResult.data.date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(collectionResult.data[0].date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());
    assert.equal(collectionResult.data[1].date.getTime(), new Date(1945, 4, 9, 14, 35, 0, 0).getTime(), 'with positive offset');
    assert.equal(collectionResult.data[2].date.getTime(), new Date(1945, 4, 9, 14, 15, 0, 0).getTime(), 'with negative offset');
});

QUnit.test('OData 3', function(assert) {
    // arrange
    const scalarResponse = { value: '1945-05-09T14:25:00' };
    const singleResponse = { value: { date: '1945-05-09T14:25:00' } };
    const collectionResponse = {
        value: [
            { date: '1945-05-09T14:25:00' },
            { date: '1945-05-09T14:25:00.73' }
        ]
    };

    // act
    const scalarResult = interpretJsonFormat(scalarResponse, 'success');
    const singleResult = interpretJsonFormat(singleResponse, 'success');
    const collectionResult = interpretJsonFormat(collectionResponse, 'success');

    // assert
    assert.equal(scalarResult.data.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(singleResult.data.date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(collectionResult.data[0].date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());
    assert.equal(collectionResult.data[1].date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 730).getTime(), 'with ms');
});

QUnit.test('OData 4', function(assert) {
    // arrange
    const scalarResponse = { value: '1945-05-09T14:25:00Z' };
    const singleResponse = { value: { date: '1945-05-09T14:25:00Z' } };
    const collectionResponse = {
        value: [
            { date: '1945-05-09T14:25:00Z' },
            { date: '1945-05-09T14:25:00.73Z' }
        ]
    };

    // act
    const scalarResult = interpretJsonFormat(scalarResponse, 'success');
    const singleResult = interpretJsonFormat(singleResponse, 'success');
    const collectionResult = interpretJsonFormat(collectionResponse, 'success');

    // assert
    assert.equal(scalarResult.data.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(singleResult.data.date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());

    assert.equal(collectionResult.data[0].date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 0).getTime());
    assert.equal(collectionResult.data[1].date.getTime(), new Date(1945, 4, 9, 14, 25, 0, 730).getTime(), 'with ms');
});

QUnit.test('T211239: ODataStore doesn\'t parse second fraction properly', function(assert) {
    const interpret = function(dateStr) { return interpretJsonFormat({ value: [{ date: dateStr }] }, 'success'); };

    const r1 = interpret('2015-01-30T08:35:46.1686789Z');
    assert.equal(r1.data[0].date.getTime(), new Date(2015, 0, 30, 8, 35, 46, 168).getTime());

    const r2 = interpret('2015-01-30T08:35:46.1Z');
    assert.equal(r2.data[0].date.getTime(), new Date(2015, 0, 30, 8, 35, 46, 100).getTime());

    const r3 = interpret('2015-01-30T08:35:46.01Z');
    assert.equal(r3.data[0].date.getTime(), new Date(2015, 0, 30, 8, 35, 46, 10).getTime());

    const r4 = interpret('2015-01-30T08:35:46.011Z');
    assert.equal(r4.data[0].date.getTime(), new Date(2015, 0, 30, 8, 35, 46, 11).getTime());

    const r5 = interpret('2015-01-30T08:35:46.001Z');
    assert.equal(r5.data[0].date.getTime(), new Date(2015, 0, 30, 8, 35, 46, 1).getTime());
});

QUnit.test('T345624: The parseISO8601 function returns incorrect data for February 29 in a leap year', function(assert) {
    const r = interpretJsonFormat({
        value: [{ date: '2016-02-29T23:59:59.999Z' }]
    }, 'success');

    assert.equal(r.data[0].date.getTime(), new Date(2016, 1, 29, 23, 59, 59, 999).getTime());
});
