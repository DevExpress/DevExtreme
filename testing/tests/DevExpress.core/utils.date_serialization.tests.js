var dateSerialization = require('core/utils/date_serialization');
var config = require('core/config');

QUnit.module('date serialization tests', {
    beforeEach: function() {
        this.defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
    },
    afterEach: function() {
        config().forceIsoDateParsing = this.defaultForceIsoDateParsing;
    }
});

QUnit.test('serialization/deserialization', function(assert) {
    var date = new Date(2015, 7, 16);
    var assertData = [
        {
            value: date,
            serializedValue: date.valueOf()
        }, {
            value: date,
            serializedValue: '2015/08/16'
        }, {
            value: date,
            serializedValue: '2015/08/16 00:00:00'
        }, {
            value: date,
            serializedValue: '2015-08-16'
        }, {
            value: date,
            serializedValue: '2015-08-16T00:00:00',
            format: 'yyyy-MM-ddTHH:mm:ss'
        }, {
            value: new Date(21015, 7, 16, 0, 0, 0),
            serializedValue: '21015-08-16T00:00:00',
            format: 'yyyy-MM-ddTHH:mm:ss'
        }, {
            value: new Date(Date.UTC(2015, 7, 16)),
            serializedValue: '2015-08-16T00:00:00Z',
            format: 'yyyy-MM-ddTHH:mm:ssZ'
        },
        {
            value: new Date(Date.UTC(2015, 7, 16, 12, 13, 14, 345)),
            serializedValue: '2015-08-16T12:13:14.345Z',
            format: 'yyyy-MM-ddTHH:mm:ss.SSSZ'
        },
        {
            value: new Date(0, 0, 0, 13, 20),
            serializedValue: '13:20'
        }, {
            value: new Date(0, 0, 0, 13, 20, 15),
            serializedValue: '13:20:15'
        }, {
            value: new Date(2015, 7, 16, 15, 45, 30),
            serializedValue: '20150816T154530',
            format: 'yyyyMMddTHHmmss'
        },
        {
            value: new Date(2015, 7, 16, 15, 45, 30, 345),
            serializedValue: '20150816T154530.345',
            format: 'yyyyMMddTHHmmss.SSS'
        }
    ];

    assertData.forEach(function(data, index) {
        if(!data.format) {
            data.format = dateSerialization.getDateSerializationFormat(data.serializedValue);
        }

        var serializedDate = dateSerialization.serializeDate(data.value, data.format);
        var parsedDate = dateSerialization.deserializeDate(data.serializedValue);

        assert.equal(serializedDate, data.serializedValue, data.format);
        assert.equal(parsedDate.getTime(), data.value.getTime(), data.format);
    });
});

QUnit.test('serialization/deserialization when value is null (T420231)', function(assert) {
    var serializationFormat = dateSerialization.getDateSerializationFormat(null);
    var serializedDate = dateSerialization.serializeDate(null, serializationFormat);
    var parsedDate = dateSerialization.deserializeDate(null);

    assert.equal(serializedDate, null, 'value returned if no serialized value is specified');
    assert.equal(parsedDate, null, 'value returned if no deserialized value is specified');
});

QUnit.test('serialization when serializationFormat is not defined', function(assert) {
    assert.equal(dateSerialization.serializeDate(null), null, 'null value is not serialized when serializationFormat is not defined');
    assert.equal(dateSerialization.serializeDate(undefined), undefined, 'undefined value is not serialized when serializationFormat is not defined');
    assert.equal(dateSerialization.serializeDate('test'), 'test', 'string value is not serialized when serializationFormat is not defined');
    assert.equal(dateSerialization.serializeDate(undefined, ''), undefined, 'undefined value is not serialized when serializationFormat is empty string');
});

QUnit.test('deserializing first date (serialization format is string)', function(assert) {
    var date = new Date(1970, 0, 1);
    var value = '1970-01-01';

    var result = dateSerialization.deserializeDate(value);

    assert.deepEqual(result, date, 'date is returned');
});

QUnit.test('serialization ISO8601 dates', function(assert) {
    var date = new Date(2015, 3, 5, 6, 7, 25, 125);

    var timezoneOffset = -180;

    sinon.stub(date, 'getTimezoneOffset', function() {
        return timezoneOffset;
    });

    assert.equal(dateSerialization.serializeDate(null, 'yyyy-MM-dd'), null, 'null date');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy-MM-dd'), '2015-04-05', '(+3:00) yyyy-MM-dd');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy-MM-ddTHH:mm:ss'), '2015-04-05T06:07:25', '(+3:00) yyyy-MM-ddTHH:mm:ss');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy-MM-ddTHH:mm:ss.S'), '2015-04-05T06:07:25.1', '(+3:00) yyyy-MM-ddTHH:mm:ss.S');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy-MM-ddTHH:mm:ss.SSS'), '2015-04-05T06:07:25.125', '(+3:00) yyyy-MM-ddTHH:mm:ss.SSS');
    assert.equal(dateSerialization.serializeDate(date, 'yy-M-dTH:m:s'), '15-4-5T6:7:25', '(+3:00) yy-M-dTH:m:s');
    assert.equal(dateSerialization.serializeDate(date, 'y \'year\' M \'month\' d \'day\''), '2015 year 4 month 5 day', '(+3:00) y \'year\' M \'month\'d \'day\'');

    assert.equal(dateSerialization.serializeDate(new Date(Date.UTC(2015, 3, 5, 6, 7, 25, 125)), 'yyyy-MM-ddTHH:mm:ssZ'), '2015-04-05T06:07:25Z', '(+3:00) yyyy-MM-ddTHH:mm:ssZ');
    assert.equal(dateSerialization.serializeDate(date, 'Z'), 'Z', '(+3:00) Z');
    assert.equal(dateSerialization.serializeDate(date, 'ZZZZZ'), 'Z', '(+3:00) ZZZZZ');
    assert.equal(dateSerialization.serializeDate(date, 'x'), '+03', '(+3:00) x');
    assert.equal(dateSerialization.serializeDate(date, 'X'), '+03', '(+3:00) X');
    assert.equal(dateSerialization.serializeDate(date, 'xx'), '+0300', '(+3:00) xx');
    assert.equal(dateSerialization.serializeDate(date, 'XX'), '+0300', '(+3:00) XX');
    assert.equal(dateSerialization.serializeDate(date, 'xxx'), '+03:00', '(+3:00) xxx');
    assert.equal(dateSerialization.serializeDate(date, 'XXX'), '+03:00', '(+3:00) XXX');

    timezoneOffset = 210;

    assert.equal(dateSerialization.serializeDate(date, 'Z'), 'Z', '(-3:30) Z');
    assert.equal(dateSerialization.serializeDate(date, 'X'), '-0330', '(-3:30) X');
    assert.equal(dateSerialization.serializeDate(date, 'XX'), '-0330', '(-3:30) XX');
    assert.equal(dateSerialization.serializeDate(date, 'XXX'), '-03:30', '(-3:30) XXX');

    timezoneOffset = 0;

    assert.equal(dateSerialization.serializeDate(date, 'Z'), 'Z', '(0) Z');
    assert.equal(dateSerialization.serializeDate(date, 'x'), '+00', '(0) x');
    assert.equal(dateSerialization.serializeDate(date, 'X'), 'Z', '(0) X');
    assert.equal(dateSerialization.serializeDate(date, 'xx'), '+0000', '(0) xx');
    assert.equal(dateSerialization.serializeDate(date, 'XX'), 'Z', '(0) XX');
    assert.equal(dateSerialization.serializeDate(date, 'xxx'), '+00:00', '(0) xxx');
    assert.equal(dateSerialization.serializeDate(date, 'XXX'), 'Z', '(0) XXX');
});

QUnit.test('serialization LDML dates', function(assert) {
    var date = new Date(2015, 3, 5, 6, 7, 25, 125);
    var datePm = new Date(2015, 3, 5, 18, 7, 25, 125);
    var dateMidday = new Date(2015, 3, 5, 12);

    assert.equal(dateSerialization.serializeDate(date, 'd/M/yyyy'), '5/4/2015', 'date with numeric one letter month and date');
    assert.equal(dateSerialization.serializeDate(date, 'dd/MM/yyyy'), '05/04/2015', 'date with numeric two letter month and date');
    assert.equal(dateSerialization.serializeDate(date, 'd MMM yyyy'), '5 Apr 2015', 'date with short month');
    assert.equal(dateSerialization.serializeDate(date, 'd MMMM yyyy'), '5 April 2015', 'date with long month');
    assert.equal(dateSerialization.serializeDate(date, 'E d MMM yyyy'), 'Sun 5 Apr 2015', 'date with day of week');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy Q'), '2015 2', 'date with numeric quarter');
    assert.equal(dateSerialization.serializeDate(date, 'yyyy QQQ'), '2015 Q2', 'date with short quarter');

    assert.equal(dateSerialization.serializeDate(date, 'H:mm'), '6:07', 'time with one letter hours');
    assert.equal(dateSerialization.serializeDate(date, 'HH:mm'), '06:07', 'time with two letter hours AM');
    assert.equal(dateSerialization.serializeDate(datePm, 'HH:mm'), '18:07', 'time with two letter hours PM');
    assert.equal(dateSerialization.serializeDate(date, 'h:mm a'), '6:07 AM', 'time with 12 hours format AM');
    assert.equal(dateSerialization.serializeDate(datePm, 'h:mm a'), '6:07 PM', 'time with 12 hours format PM');
    assert.equal(dateSerialization.serializeDate(dateMidday, 'h:mm a'), '12:00 PM', 'time with 12 hours format Midday');

    assert.equal(dateSerialization.serializeDate(date, 'H:mm:ss.SSS'), '6:07:25.125', 'time with seconds and millisecond');
});

QUnit.test('get serialization format for ISO8601 dates', function(assert) {
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05'), 'yyyy-MM-dd');
    assert.equal(dateSerialization.getDateSerializationFormat('20150405'), 'yyyyMMdd');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07'), 'yyyy-MM-ddTHH:mm');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25'), 'yyyy-MM-ddTHH:mm:ss');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25.125'), 'yyyy-MM-ddTHH:mm:ss.SSS', '(+3:00) yyyy-MM-ddTHH:mm:ss.SSS');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25Z'), 'yyyy-MM-ddTHH:mm:ss\'Z\'');
    assert.equal(dateSerialization.getDateSerializationFormat('20150405T060725'), 'yyyyMMddTHHmmss');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25+03'), 'yyyy-MM-ddTHH:mm:ssx');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25+0330'), 'yyyy-MM-ddTHH:mm:ssxx');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25+03:30'), 'yyyy-MM-ddTHH:mm:ssxxx');
    assert.equal(dateSerialization.getDateSerializationFormat('12:13'), 'HH:mm');
    assert.equal(dateSerialization.getDateSerializationFormat('12:13:14'), 'HH:mm:ss');
});

QUnit.test('get serialization format for ISO8601 dates when forceIsoDateParsing disabled', function(assert) {
    config().forceIsoDateParsing = false;

    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05'), 'yyyy/MM/dd');
    assert.equal(dateSerialization.getDateSerializationFormat('20150405'), 'yyyy/MM/dd');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07'), 'yyyy/MM/dd HH:mm:ss');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25'), 'yyyy/MM/dd HH:mm:ss');
    assert.equal(dateSerialization.getDateSerializationFormat('2015-04-05T06:07:25Z'), 'yyyy/MM/dd HH:mm:ss');
});
