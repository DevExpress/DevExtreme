const dateSerialization = require('core/utils/date_serialization');
const config = require('core/config');

QUnit.module('Default DX Formats');

QUnit.test('date parsing with number format', function(assert) {
    const value = new Date(2017, 0, 20);
    const numberValue = value.getTime();

    const parsedDate = dateSerialization.dateParser(numberValue);

    assert.equal(parsedDate, numberValue);
});

QUnit.test('date parsing with yyyy/MM/dd format', function(assert) {
    const value = new Date(2017, 0, 20);
    const stringValue = '2017/01/20';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy/MM/dd HH:mm:ss format', function(assert) {
    const value = new Date(2017, 0, 20, 11, 26);
    const stringValue = '2017/01/20 11:26:00';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('ISO8601 Time Formats');

QUnit.test('date parsing with yyyy-MM-dd', function(assert) {
    const value = new Date(2017, 0, 20);
    const stringValue = '2017-01-20';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh', function(assert) {
    const value = new Date(2017, 0, 20, 11);
    const stringValue = '2017-01-20T11';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});


QUnit.test('date parsing with yyyy-MM-ddThh:mm', function(assert) {
    const value = new Date(2017, 0, 20, 11, 12);
    const stringValue = '2017-01-20T11:12';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss', function(assert) {
    const value = new Date(2017, 0, 20, 11, 12, 13);
    const stringValue = '2017-01-20T11:12:13';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSS', function(assert) {
    const value = new Date(2017, 0, 20, 11, 12, 13, 789);
    const stringValue = '2017-01-20T11:12:13.789';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSSSSS', function(assert) {
    const value = new Date(2017, 0, 20, 11, 12, 13, 123);
    const stringValue = '2017-01-20T11:12:13.123456';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.getTime(), value.getTime());
});

QUnit.module('ISO8601 Time Only Formats', {
    beforeEach: function() {
        this.defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
    },
    afterEach: function() {
        config().forceIsoDateParsing = this.defaultForceIsoDateParsing;
    }
});

QUnit.test('date parsing with hh:mm', function(assert) {
    const value = new Date(0, 0, 0, 11, 12);
    const stringValue = '11:12';

    const parsedDate = dateSerialization.deserializeDate(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with hh:mm:ss', function(assert) {
    const value = new Date(0, 0, 0, 11, 12, 13);
    const stringValue = '11:12:13';

    const parsedDate = dateSerialization.deserializeDate(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('UTC Time Formats with designator(Z)');

QUnit.test('date parsing with yyyy-MM-ddThhZ', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 11));
    const stringValue = '2017-01-20T11Z';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mmZ', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 11, 12));
    const stringValue = '2017-01-20T11:12Z';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ssZ', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 11, 12, 13));
    const stringValue = '2017-01-20T11:12:13Z';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSSZ', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 11, 12, 13, 100));
    const stringValue = '2017-01-20T11:12:13.1Z';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
    assert.equal(parsedDate.toISOString(), value.toISOString());
});

QUnit.module('UTC Time Formats with plus(-) timezone');

QUnit.test('date parsing with yyyy-MM-ddThh-hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12));
    const stringValue = '2017-01-20T11-01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThhZ-hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12, 30));
    const stringValue = '2017-01-20T11-01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm-hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12, 12));
    const stringValue = '2017-01-20T11:12-01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm-hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12, 42));
    const stringValue = '2017-01-20T11:12-01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss-hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12, 12, 13));
    const stringValue = '2017-01-20T11:12:13-01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss-hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 12, 42, 13));
    const stringValue = '2017-01-20T11:12:13-01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('UTC Time Formats with minus(+) timezone');

QUnit.test('date parsing with yyyy-MM-ddThh+hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 10));
    const stringValue = '2017-01-20T11+01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh+hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 9, 30));
    const stringValue = '2017-01-20T11+01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm+hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 10, 12));
    const stringValue = '2017-01-20T11:12+01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm+hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 9, 42));
    const stringValue = '2017-01-20T11:12+01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss+hh', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 10, 12, 13));
    const stringValue = '2017-01-20T11:12:13+01';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss+hh:mm', function(assert) {
    const value = new Date(Date.UTC(2017, 0, 20, 9, 42, 13));
    const stringValue = '2017-01-20T11:12:13+01:30';

    const parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});
