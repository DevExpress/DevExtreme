var dateSerialization = require('core/utils/date_serialization');
var config = require('core/config');

QUnit.module('Default DX Formats');

QUnit.test('date parsing with number format', function(assert) {
    var value = new Date(2017, 0, 20),
        numberValue = value.getTime();

    var parsedDate = dateSerialization.dateParser(numberValue);

    assert.equal(parsedDate, numberValue);
});

QUnit.test('date parsing with yyyy/MM/dd format', function(assert) {
    var value = new Date(2017, 0, 20),
        stringValue = '2017/01/20';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy/MM/dd HH:mm:ss format', function(assert) {
    var value = new Date(2017, 0, 20, 11, 26),
        stringValue = '2017/01/20 11:26:00';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('ISO8601 Time Formats');

QUnit.test('date parsing with yyyy-MM-dd', function(assert) {
    var value = new Date(2017, 0, 20),
        stringValue = '2017-01-20';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh', function(assert) {
    var value = new Date(2017, 0, 20, 11),
        stringValue = '2017-01-20T11';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});


QUnit.test('date parsing with yyyy-MM-ddThh:mm', function(assert) {
    var value = new Date(2017, 0, 20, 11, 12),
        stringValue = '2017-01-20T11:12';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss', function(assert) {
    var value = new Date(2017, 0, 20, 11, 12, 13),
        stringValue = '2017-01-20T11:12:13';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSS', function(assert) {
    var value = new Date(2017, 0, 20, 11, 12, 13, 789),
        stringValue = '2017-01-20T11:12:13.789';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSSSSS', function(assert) {
    var value = new Date(2017, 0, 20, 11, 12, 13, 123),
        stringValue = '2017-01-20T11:12:13.123456';

    var parsedDate = dateSerialization.dateParser(stringValue);

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
    var value = new Date(0, 0, 0, 11, 12),
        stringValue = '11:12';

    var parsedDate = dateSerialization.deserializeDate(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with hh:mm:ss', function(assert) {
    var value = new Date(0, 0, 0, 11, 12, 13),
        stringValue = '11:12:13';

    var parsedDate = dateSerialization.deserializeDate(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('UTC Time Formats with designator(Z)');

QUnit.test('date parsing with yyyy-MM-ddThhZ', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 11)),
        stringValue = '2017-01-20T11Z';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mmZ', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 11, 12)),
        stringValue = '2017-01-20T11:12Z';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ssZ', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 11, 12, 13)),
        stringValue = '2017-01-20T11:12:13Z';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss.SSSZ', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 11, 12, 13, 100)),
        stringValue = '2017-01-20T11:12:13.1Z';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
    assert.equal(parsedDate.toISOString(), value.toISOString());
});

QUnit.module('UTC Time Formats with plus(-) timezone');

QUnit.test('date parsing with yyyy-MM-ddThh-hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12)),
        stringValue = '2017-01-20T11-01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThhZ-hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12, 30)),
        stringValue = '2017-01-20T11-01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm-hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12, 12)),
        stringValue = '2017-01-20T11:12-01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm-hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12, 42)),
        stringValue = '2017-01-20T11:12-01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss-hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12, 12, 13)),
        stringValue = '2017-01-20T11:12:13-01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss-hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 12, 42, 13)),
        stringValue = '2017-01-20T11:12:13-01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.module('UTC Time Formats with minus(+) timezone');

QUnit.test('date parsing with yyyy-MM-ddThh+hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 10)),
        stringValue = '2017-01-20T11+01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh+hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 9, 30)),
        stringValue = '2017-01-20T11+01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm+hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 10, 12)),
        stringValue = '2017-01-20T11:12+01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm+hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 9, 42)),
        stringValue = '2017-01-20T11:12+01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss+hh', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 10, 12, 13)),
        stringValue = '2017-01-20T11:12:13+01';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});

QUnit.test('date parsing with yyyy-MM-ddThh:mm:ss+hh:mm', function(assert) {
    var value = new Date(Date.UTC(2017, 0, 20, 9, 42, 13)),
        stringValue = '2017-01-20T11:12:13+01:30';

    var parsedDate = dateSerialization.dateParser(stringValue);

    assert.equal(parsedDate.toString(), value.toString());
});
