const numberLocalization = require('common/core/localization/number');
const dateLocalization = require('common/core/localization/date');

QUnit.module('Custom date names', {
    beforeEach: function() {
        dateLocalization.inject({
            getMonthNames: function(format, type) {
                if(format === 'wide' && type === 'standalone') {
                    return ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
                }
                if(format === 'wide' && type === 'format') {
                    return ['января', 'февраля', 'марта', 'апреля', 'май', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                }
                return this.callBase(format, type);
            },
            getPeriodNames: function() {
                return ['a. m.', 'p. m.'];
            }
        });
    },
    afterEach: function() {
        dateLocalization.resetInjection();
    }
});

QUnit.test('format LDML pattern with month name', function(assert) {
    assert.equal(dateLocalization.format(new Date(2015, 2, 1), 'd MMMM'), '1 марта');
    assert.equal(dateLocalization.format(new Date(2015, 2, 1), 'LLLL y'), 'март 2015');
});

QUnit.test('parse LDML pattern with month name', function(assert) {
    assert.deepEqual(dateLocalization.parse('1 марта 2015', 'd MMMM y'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('1 марта 2015', 'd MMM y'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('март 2015', 'LLLL y'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('март 2015', 'LLL y'), new Date(2015, 2, 1));
});

QUnit.test('parse predefined formats with month name', function(assert) {
    assert.deepEqual(dateLocalization.parse('Sunday, марта 1, 2015', 'longdate'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('Wrongday, марта 1, 2015', 'longdate'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('март 2015', 'monthAndYear'), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse('марта 8', 'monthAndDay'), new Date(new Date().getFullYear(), 2, 8));
    assert.deepEqual(dateLocalization.parse('март 8', 'monthAndDay'), new Date(new Date().getFullYear(), 2, 8));
    assert.deepEqual(dateLocalization.parse('март', 'month').getMonth(), 2);
    assert.deepEqual(dateLocalization.parse('марта', 'month').getMonth(), 2);
});

QUnit.test('parse predefined formats with period name', function(assert) {
    assert.deepEqual(dateLocalization.parse('1:23 p. m.', 'shortTime').getHours(), 13);
    assert.deepEqual(dateLocalization.parse('11/11/2015, 1:23 p. m.', 'shortDateShortTime').getHours(), 13);
});

QUnit.module('Custom digits', {
    beforeEach: function() {
        numberLocalization.inject({
            format: function(value, format) {
                if(format === 'decimal' && value === 90) {
                    return '٩٠';
                }
                return this.callBase.apply(this, arguments);
            }
        });
    },
    afterEach: function() {
        numberLocalization.resetInjection();
    }
});

QUnit.test('format date by LDML pattern', function(assert) {
    const date = new Date(2015, 2, 3, 4, 5, 6, 789);
    assert.equal(dateLocalization.format(date, 'dd/MM/yyyy'), '٠٣/٠٣/٢٠١٥');
    assert.equal(dateLocalization.format(date, 'HH:mm:ss'), '٠٤:٠٥:٠٦');
    assert.equal(dateLocalization.format(date, 'SSS'), '٧٨٩');
});

QUnit.test('format date by predefined format', function(assert) {
    const date = new Date(2015, 2, 3, 4, 5, 6, 789);
    assert.equal(dateLocalization.format(date, 'shortDate'), '٣/٣/٢٠١٥');
    assert.equal(dateLocalization.format(date, 'millisecond'), '٧٨٩');
});

QUnit.test('parse date by LDML pattern', function(assert) {
    assert.deepEqual(dateLocalization.parse('٠٣/٠٥/٢٠١٥', 'dd/MM/yyyy'), new Date(2015, 4, 3));
    assert.deepEqual(dateLocalization.parse('٧٨٩', 'SSS').getMilliseconds(), 789);
});

QUnit.test('parse date by predefined format', function(assert) {
    assert.deepEqual(dateLocalization.parse('٠٥/٠٣/٢٠١٥', 'shortDate'), new Date(2015, 4, 3));
    assert.deepEqual(dateLocalization.parse('٧٨٩', 'millisecond').getMilliseconds(), 789);
});

QUnit.test('format number by LDML pattern', function(assert) {
    assert.equal(numberLocalization.format(1234.5, '#,##0.00'), '١,٢٣٤.٥٠');
});

QUnit.test('parse number by LDML pattern', function(assert) {
    assert.equal(numberLocalization.parse('١,٢٣٤.٥٠', '#,#0.00'), 1234.5);
});

QUnit.test('parse negative number in rtl mode', function(assert) {
    assert.equal(numberLocalization.parse('\u061C-١٢٣'), -123);
});

QUnit.module('Custom minimumGroupingDigits', {
    beforeEach: function() {
        numberLocalization.inject({
            format: function(value, format) {
                if(format === 'fixedPoint') {
                    if(value === 1000) {
                        return '1000';
                    }
                    if(value === 10000) {
                        return '10 000';
                    }
                }
                return this.callBase.apply(this, arguments);
            }
        });
    },
    afterEach: function() {
        numberLocalization.resetInjection();
    }
});

QUnit.test('getThousandsSeparator', function(assert) {
    assert.equal(numberLocalization.getThousandsSeparator(), ' ');
});

QUnit.test('format number', function(assert) {
    assert.equal(numberLocalization.format(1234.5, '#,##0.00'), '1 234.50');
});

QUnit.test('format number with unlimitedIntegerDigits flag (for dashbords)', function(assert) {
    assert.equal(numberLocalization.format(0, { type: '0', unlimitedIntegerDigits: true }), '0');
    assert.equal(numberLocalization.format(12345.6, { type: '0', unlimitedIntegerDigits: true }), '12346');
});
