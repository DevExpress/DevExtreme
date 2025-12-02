import { Range } from 'viz/translators/range';

QUnit.module('Life cycle');

QUnit.test('Create empty', function(assert) {
    const range = new Range();

    assert.ok(range);
    assert.strictEqual(range.min, undefined);
    assert.strictEqual(range.max, undefined);
    assert.strictEqual(range.minVisible, undefined);
    assert.strictEqual(range.maxVisible, undefined);
    assert.strictEqual(range.startCategories, undefined);
    assert.strictEqual(range.endCategories, undefined);
    assert.strictEqual(range.containsConstantLine, undefined);
});

QUnit.test('Create with range', function(assert) {
    const range = new Range({
        min: 0,
        max: 100,
        minVisible: 10,
        maxVisible: 90,
        isValueRange: true,
        alwaysCorrectMin: false
    });

    assert.ok(range);
    assert.strictEqual(range.min, 0);
    assert.strictEqual(range.max, 100);
    assert.strictEqual(range.minVisible, 10);
    assert.strictEqual(range.maxVisible, 90);
    assert.strictEqual(range.isValueRange, true);
    assert.strictEqual(range.alwaysCorrectMin, false);
});

QUnit.module('Add range. Numeric', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };
    }
});

QUnit.test('Merge invert', function(assert) {
    const that = this;

    const checkRules = function(rangeInverted, otherRangeInverted, expected) {
        that.createRange({ invert: rangeInverted });

        const returnValue = that.range.addRange({ invert: otherRangeInverted });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.invert, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge containsConstantLine', function(assert) {
    const that = this;

    const checkRules = function(value, otherValue, expected) {
        that.createRange({ containsConstantLine: value });

        const returnValue = that.range.addRange({ containsConstantLine: otherValue });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.containsConstantLine, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge axis type', function(assert) {
    const that = this;

    const checkRules = function(rangeAxisType, otherRangeAxisType, expected) {
        that.createRange({ axisType: rangeAxisType });

        const returnValue = that.range.addRange({ axisType: otherRangeAxisType });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.axisType, expected);
    };

    checkRules('continuous', 'discrete', 'continuous');
    checkRules(undefined, 'discrete', 'discrete');
    checkRules('continuous', undefined, 'continuous');
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge data type', function(assert) {
    const that = this;

    const checkRules = function(rangeDataType, otherRangeDataType, expected) {
        that.createRange({ dataType: rangeDataType });

        const returnValue = that.range.addRange({ dataType: otherRangeDataType });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.dataType, expected);
    };

    checkRules('numeric', 'numeric', 'numeric');
    checkRules(undefined, 'datetime', 'datetime');
    checkRules('string', undefined, 'string');
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge isSpacedMargin', function(assert) {
    const that = this;

    const checkRules = function(isSpacedMargin, otherIsSpacedMargin, expected) {
        that.createRange({ isSpacedMargin: isSpacedMargin });

        const returnValue = that.range.addRange({ isSpacedMargin: otherIsSpacedMargin });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.isSpacedMargin, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge base', function(assert) {
    const that = this;

    const checkRules = function(rangeAxisType, rangeBase, otherRangeBase, expected) {
        that.createRange({
            axisType: rangeAxisType,
            base: rangeBase
        });

        const returnValue = that.range.addRange({ base: otherRangeBase });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.base, expected);
    };

    checkRules('logarithmic', 10, 2, 10);
    checkRules('logarithmic', undefined, 2, 2);
    checkRules('logarithmic', 10, undefined, 10);
    checkRules('logarithmic', undefined, undefined, undefined);
    checkRules('continuous', 10, 2, undefined);
});

QUnit.test('Merge min', function(assert) {
    const that = this;

    const checkRules = function(rangeMin, otherRangeMin, expected) {
        that.createRange({ min: rangeMin });

        const returnValue = that.range.addRange({ min: otherRangeMin });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.min, expected);
    };

    checkRules(10, 2, 2);
    checkRules(10, 20, 10);
    checkRules(10, undefined, 10);
    checkRules(undefined, 2, 2);
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge minVisible', function(assert) {
    const that = this;

    const checkRules = function(rangeMinVisible, otherRangeMinVisible, expected) {
        that.createRange({ minVisible: rangeMinVisible });

        const returnValue = that.range.addRange({ minVisible: otherRangeMinVisible });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.minVisible, expected);
    };

    checkRules(10, 2, 2);
    checkRules(10, 20, 10);
    checkRules(10, undefined, 10);
    checkRules(undefined, 2, 2);
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge max', function(assert) {
    const that = this;

    const checkRules = function(rangeMax, otherRangeMax, expected) {
        that.createRange({ max: rangeMax });

        const returnValue = that.range.addRange({ max: otherRangeMax });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.max, expected);
    };

    checkRules(10, 2, 10);
    checkRules(10, 20, 20);
    checkRules(10, undefined, 10);
    checkRules(undefined, 2, 2);
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge maxVisible', function(assert) {
    const that = this;

    const checkRules = function(rangeMaxVisible, otherRangeMaxVisible, expected) {
        that.createRange({ maxVisible: rangeMaxVisible });

        const returnValue = that.range.addRange({ maxVisible: otherRangeMaxVisible });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.maxVisible, expected);
    };

    checkRules(10, 2, 10);
    checkRules(10, 20, 20);
    checkRules(10, undefined, 10);
    checkRules(undefined, 2, 2);
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge interval', function(assert) {
    const that = this;

    const checkRules = function(rangeInterval, otherRangeInterval, expected) {
        that.createRange({ interval: rangeInterval });

        const returnValue = that.range.addRange({ interval: otherRangeInterval });

        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.interval, expected);
    };

    checkRules(10, 2, 2);
    checkRules(10, 20, 10);
    checkRules(10, undefined, 10);
    checkRules(undefined, 2, 2);
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge categories', function(assert) {
    const that = this;

    const checkRules = function(rangeCategories, otherRangeCategories, expected, message) {
        that.createRange({ categories: rangeCategories });

        const returnValue = that.range.addRange({ categories: otherRangeCategories });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.categories, expected, message);
    };

    checkRules(['a', 'b'], undefined, ['a', 'b'], 'No other');
    checkRules(undefined, ['a', 'b'], ['a', 'b'], 'From scratch');
    checkRules(['a', 'b'], ['a', 'b'], ['a', 'b'], 'Nothing new');
    checkRules(['a', 'b'], ['c', 'd'], ['a', 'b', 'c', 'd'], 'Add all new');
    checkRules(['a', 'b', 'c'], ['d', 'b', 'e'], ['a', 'b', 'c', 'd', 'e'], 'Add some new');
});

QUnit.module('Add range. DateTime', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };
    }
});

QUnit.test('Merge min', function(assert) {
    const that = this;

    const checkRules = function(rangeMin, otherRangeMin, expected) {
        that.createRange({ min: rangeMin });

        const returnValue = that.range.addRange({ min: otherRangeMin });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.min, expected);
    };

    checkRules(new Date(2010, 0), new Date(2002, 0), new Date(2002, 0));
    checkRules(new Date(2010, 0), new Date(2020, 0), new Date(2010, 0));
    checkRules(new Date(2010, 0), undefined, new Date(2010, 0));
    checkRules(undefined, new Date(2002, 0), new Date(2002, 0));
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge minVisible', function(assert) {
    const that = this;

    const checkRules = function(rangeMinVisible, otherRangeMinVisible, expected) {
        that.createRange({ minVisible: rangeMinVisible });

        const returnValue = that.range.addRange({ minVisible: otherRangeMinVisible });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.minVisible, expected);
    };

    checkRules(new Date(2010, 0), new Date(2002, 0), new Date(2002, 0));
    checkRules(new Date(2010, 0), new Date(2020, 0), new Date(2010, 0));
    checkRules(new Date(2010, 0), undefined, new Date(2010, 0));
    checkRules(undefined, new Date(2002, 0), new Date(2002, 0));
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge max', function(assert) {
    const that = this;

    const checkRules = function(rangeMax, otherRangeMax, expected) {
        that.createRange({ max: rangeMax });

        const returnValue = that.range.addRange({ max: otherRangeMax });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.max, expected);
    };

    checkRules(new Date(2010, 0), new Date(2002, 0), new Date(2010, 0));
    checkRules(new Date(2010, 0), new Date(2020, 0), new Date(2020, 0));
    checkRules(new Date(2010, 0), undefined, new Date(2010, 0));
    checkRules(undefined, new Date(2002, 0), new Date(2002, 0));
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge maxVisible', function(assert) {
    const that = this;

    const checkRules = function(rangeMaxVisible, otherRangeMaxVisible, expected) {
        that.createRange({ maxVisible: rangeMaxVisible });

        const returnValue = that.range.addRange({ maxVisible: otherRangeMaxVisible });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.maxVisible, expected);
    };

    checkRules(new Date(2010, 0), new Date(2002, 0), new Date(2010, 0));
    checkRules(new Date(2010, 0), new Date(2020, 0), new Date(2020, 0));
    checkRules(new Date(2010, 0), undefined, new Date(2010, 0));
    checkRules(undefined, new Date(2002, 0), new Date(2002, 0));
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge categories', function(assert) {
    const that = this;

    const checkRules = function(rangeCategories, otherRangeCategories, expected, message) {
        that.createRange({ categories: rangeCategories, dataType: 'datetime' });

        const returnValue = that.range.addRange({ categories: otherRangeCategories });

        assert.strictEqual(that.range, returnValue);
        assert.deepEqual(that.range.categories, expected, message);
    };

    checkRules([new Date(2007, 0), new Date(2008, 0)], undefined, [new Date(2007, 0), new Date(2008, 0)], 'No other');
    checkRules(undefined, [new Date(2007, 0), new Date(2008, 0)], [new Date(2007, 0), new Date(2008, 0)], 'From scratch');
    checkRules([new Date(2007, 0), new Date(2008, 0)], [new Date(2007, 0), new Date(2008, 0)], [new Date(2007, 0), new Date(2008, 0)], 'Nothing new');
    checkRules([new Date(2007, 0), new Date(2008, 0)], [new Date(2009, 0), new Date(2010, 0)], [new Date(2007, 0), new Date(2008, 0), new Date(2009, 0), new Date(2010, 0)], 'Add all new');
    checkRules([new Date(2007, 0), new Date(2008, 0), new Date(2009, 0)], [new Date(2010, 0), new Date(2008, 0), new Date(2011, 0)], [new Date(2007, 0), new Date(2008, 0), new Date(2009, 0), new Date(2010, 0), new Date(2011, 0)], 'Add some new');
});

QUnit.module('Add range. Extend by visible range. Numeric', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };

        this.checkRanges = function(assert, expected) {
            assert.strictEqual(this.range.min, expected.min, 'Min');
            assert.strictEqual(this.range.minVisible, expected.minVisible, 'MinVisible');
            assert.strictEqual(this.range.maxVisible, expected.maxVisible, 'MaxVisible');
            assert.strictEqual(this.range.max, expected.max, 'Max');

            this.checkRangeBounds(assert);
        };

        this.checkRangeBounds = function(assert) {
            assert.ok(this.range.min <= this.range.max, 'Min should be less than Max');
            assert.ok((this.range.maxVisible === undefined) || (this.range.maxVisible !== undefined && this.range.maxVisible <= this.range.max), 'MaxVisible should be less than Max (or undefined)');
            assert.ok((this.range.minVisible === undefined) || (this.range.minVisible !== undefined && this.range.minVisible >= this.range.min), 'MinVisible should be greater than Min (or undefined)');
        };
    }
});

QUnit.test('min < minVisible, maxVisible < max', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 80
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 20,
        maxVisible: 80,
        max: 100
    });
});

QUnit.test('minVisible < min, maxVisible < max', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 5,
        maxVisible: 80
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 5,
        minVisible: 5,
        maxVisible: 80,
        max: 100
    });
});

QUnit.test('min < minVisible, max < maxVisible', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 110
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 20,
        maxVisible: 110,
        max: 110
    });
});

QUnit.test('minVisible < min, max < maxVisible', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 5,
        maxVisible: 110
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 5,
        minVisible: 5,
        maxVisible: 110,
        max: 110
    });
});

QUnit.test('min < max < minVisible < maxVisible', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 110,
        maxVisible: 130
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 110,
        maxVisible: 130,
        max: 130
    });
});

QUnit.test('min < max < minVisible, maxVisible = undefined', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 110
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 110,
        max: 110
    });
});

QUnit.test('minVisible < maxVisible < min < max', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 1,
        maxVisible: 5
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 1,
        minVisible: 1,
        maxVisible: 5,
        max: 100
    });
});

QUnit.test('minVisible = undefined, maxVisible < min < max', function(assert) {
    this.createRange({
        min: 10,
        max: 100
    });

    const returnValue = this.range.addRange({
        maxVisible: 5
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 5,
        maxVisible: 5,
        max: 100
    });
});

QUnit.module('Add range. Extend by visible range. DateTime', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };

        this.checkRanges = function(assert, expected) {
            assert.deepEqual(this.range.min, expected.min, 'Min');
            assert.deepEqual(this.range.minVisible, expected.minVisible, 'MinVisible');
            assert.deepEqual(this.range.maxVisible, expected.maxVisible, 'MaxVisible');
            assert.deepEqual(this.range.max, expected.max, 'Max');

            this.checkRangeBounds(assert);
        };

        this.checkRangeBounds = function(assert) {
            assert.ok(this.range.min <= this.range.max, 'Min should be less than Max');
            assert.ok((this.range.maxVisible === undefined) || (this.range.maxVisible !== undefined && this.range.maxVisible <= this.range.max), 'MaxVisible should be less than Max (or undefined)');
            assert.ok((this.range.minVisible === undefined) || (this.range.minVisible !== undefined && this.range.minVisible >= this.range.min), 'MinVisible should be greater than Min (or undefined)');
        };
    }
});

QUnit.test('min < minVisible, maxVisible < max', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(80000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(20000),
        maxVisible: new Date(80000),
        max: new Date(100000)
    });
});

QUnit.test('minVisible < min, maxVisible < max', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(5000),
        maxVisible: new Date(80000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(5000),
        minVisible: new Date(5000),
        maxVisible: new Date(80000),
        max: new Date(100000)
    });
});

QUnit.test('min < minVisible, max < maxVisible', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(110000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(20000),
        maxVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('minVisible < min, max < maxVisible', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(5000),
        maxVisible: new Date(110000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(5000),
        minVisible: new Date(5000),
        maxVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('min < max < minVisible < maxVisible', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(110000),
        maxVisible: new Date(130000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(110000),
        maxVisible: new Date(130000),
        max: new Date(130000)
    });
});

QUnit.test('min < max < minVisible, maxVisible = undefined', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(110000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('minVisible < maxVisible < min < max', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(1000),
        maxVisible: new Date(5000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(1000),
        minVisible: new Date(1000),
        maxVisible: new Date(5000),
        max: new Date(100000)
    });
});

QUnit.test('minVisible = undefined, maxVisible < min < max', function(assert) {
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        maxVisible: new Date(5000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(5000),
        maxVisible: new Date(5000),
        max: new Date(100000)
    });
});

QUnit.module('Add range. Extend by visible range. Special cases for RS. Min/max undefined. Numeric', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };

        this.checkRanges = function(assert, expected) {
            assert.strictEqual(this.range.min, expected.min, 'Min');
            assert.strictEqual(this.range.minVisible, expected.minVisible, 'MinVisible');
            assert.strictEqual(this.range.maxVisible, expected.maxVisible, 'MaxVisible');
            assert.strictEqual(this.range.max, expected.max, 'Max');

            this.checkRangeBounds(assert);
        };

        this.checkRangeBounds = function(assert) {
            assert.ok(this.range.min === undefined || this.range.max === undefined, 'Min or max should be undefined');
            assert.ok((this.range.max === undefined) || (this.range.max !== undefined && this.range.maxVisible <= this.range.max), 'MaxVisible should be less than Max (or undefined)');
            assert.ok((this.range.min === undefined) || (this.range.min !== undefined && this.range.minVisible >= this.range.min), 'MinVisible should be greater than Min (or undefined)');
        };
    }
});

QUnit.test('min = undefined, minVisible/max/maxVisible != undefined', function(assert) {
    this.createRange({
        max: 100
    });

    const returnValue = this.range.addRange({
        minVisible: 10,
        maxVisible: 100
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        minVisible: 10,
        maxVisible: 100,
        max: 100
    });
});

QUnit.test('min/minVisible/maxVisible != undefined, max = undefined', function(assert) {
    this.createRange({
        min: 10
    });

    const returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 100
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 20,
        maxVisible: 100
    });
});

QUnit.module('Add range. Extend by visible range. Special cases for RS. Min/max undefined. DateTime', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };

        this.checkRanges = function(assert, expected) {
            assert.deepEqual(this.range.min, expected.min, 'Min');
            assert.deepEqual(this.range.minVisible, expected.minVisible, 'MinVisible');
            assert.deepEqual(this.range.maxVisible, expected.maxVisible, 'MaxVisible');
            assert.deepEqual(this.range.max, expected.max, 'Max');

            this.checkRangeBounds(assert);
        };

        this.checkRangeBounds = function(assert) {
            assert.ok(this.range.min === undefined || this.range.max === undefined, 'Min or max should be undefined');
            assert.ok((this.range.max === undefined) || (this.range.max !== undefined && this.range.maxVisible <= this.range.max), 'MaxVisible should be less than Max (or undefined)');
            assert.ok((this.range.min === undefined) || (this.range.min !== undefined && this.range.minVisible >= this.range.min), 'MinVisible should be greater than Min (or undefined)');
        };
    }
});

QUnit.test('min = undefined, minVisible/max/maxVisible != undefined', function(assert) {
    this.createRange({
        max: new Date(100000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(10000),
        maxVisible: new Date(100000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        minVisible: new Date(10000),
        maxVisible: new Date(100000),
        max: new Date(100000)
    });
});

QUnit.test('min/minVisible/maxVisible != undefined, max = undefined', function(assert) {
    this.createRange({
        min: new Date(10000)
    });

    const returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(100000)
    });

    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(20000),
        maxVisible: new Date(100000)
    });
});

QUnit.module('isEmpty functionality', {
    beforeEach: function() {
        this.createRange = function(rangeData) {
            this.range = new Range(rangeData);
        };
    }
});

QUnit.test('Empty', function(assert) {
    this.createRange();

    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('With min and without max', function(assert) {
    this.createRange({ min: 0 });

    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('Without min and with max', function(assert) {
    this.createRange({ max: 10 });

    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('With min and max', function(assert) {
    this.createRange({ min: 0, max: 10 });

    assert.equal(this.range.isEmpty(), false);
});

QUnit.test('With categories', function(assert) {
    this.createRange({});

    this.range.addRange({ categories: ['a', 'b'] });

    assert.equal(this.range.isEmpty(), false);
});

QUnit.test('With categories that is empty', function(assert) {
    this.createRange({ categories: [] });

    assert.equal(this.range.isEmpty(), true);
});

QUnit.module('Correct Zero level functionality', {
    beforeEach: function() {
        function createRange(rangeData) {
            return new Range(rangeData);
        }

        function checkRangeBounds(assert, range, originalRange) {
            assert.ok(range.minVisible <= range.maxVisible, 'MinVisible should be less than MaxVisible');
            assert.ok(range.min <= range.minVisible, 'Min should be less than MinVisible');
            assert.ok(range.maxVisible <= range.max, 'MaxVisible should be less than Max');

            assert.ok(range.min <= originalRange.min, 'Min should be less than or equal to Original Min');
            assert.ok(range.max >= originalRange.max, 'Max should be greater than or equal to Original Max');
        }

        this.checkRanges = function(assert, template, expected) {
            const range = createRange(template);

            range.correctValueZeroLevel();

            assert.equal(range.min.valueOf(), expected.min, 'min');
            assert.equal(range.max.valueOf(), expected.max, 'max');
            assert.equal(range.minVisible.valueOf(), expected.minVisible, 'minVisible');
            assert.equal(range.maxVisible.valueOf(), expected.maxVisible, 'maxVisible');
            checkRangeBounds(assert, range, template);
        };
    }
});

QUnit.test('min > 0, max > 0, minVisible > 0, maxVisible > 0', function(assert) {
    this.checkRanges(assert, {
        min: 10,
        max: 100,
        minVisible: 20,
        maxVisible: 80
    }, {
        min: 0,
        max: 100,
        minVisible: 0,
        maxVisible: 80
    });
});

QUnit.test('min < 0, max < 0, minVisible < 0, maxVisible < 0', function(assert) {
    this.checkRanges(assert, {
        min: -100,
        max: -10,
        minVisible: -80,
        maxVisible: -20
    }, {
        min: -100,
        max: 0,
        minVisible: -80,
        maxVisible: 0
    });
});

QUnit.test('min < 0, max = 0, minVisible < 0, maxVisible = 0', function(assert) {
    this.checkRanges(assert, {
        min: -100,
        max: 0,
        minVisible: -80,
        maxVisible: 0
    }, {
        min: -100,
        max: 0,
        minVisible: -80,
        maxVisible: 0
    });
});

QUnit.test('min = 0, max > 0, minVisible = 0, maxVisible > 0', function(assert) {
    this.checkRanges(assert, {
        min: 0,
        max: 100,
        minVisible: 0,
        maxVisible: 80
    }, {
        min: 0,
        max: 100,
        minVisible: 0,
        maxVisible: 80
    });
});

QUnit.test('min < 0, max > 0, minVisible < 0, maxVisible > 0', function(assert) {
    this.checkRanges(assert, {
        min: -100,
        max: 100,
        minVisible: -80,
        maxVisible: 80
    }, {
        min: -100,
        max: 100,
        minVisible: -80,
        maxVisible: 80
    });
});

QUnit.module('discrete zooming');

QUnit.test('min/max categories after create range with min and max categories', function(assert) {
    const range = new Range({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories', axisType: 'discrete' });

    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});

QUnit.test('min/max categories after call add range (create without min/max categories)', function(assert) {
    const range = new Range({ axisType: 'discrete' });

    range.addRange({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories' });

    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});

QUnit.test('min/max categories after call add range (create with min/max categories)', function(assert) {
    const range = new Range({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories', axisType: 'discrete' });

    range.addRange({ minVisible: 'anotherStartCategories', maxVisible: 'someEndCategories' });

    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});

// T888028
QUnit.test('Ignote minVisible/maxVisible for discrete scale', function(assert) {
    const range = new Range({ minVisible: 'a2', min: 'a2', maxVisible: '', max: '', axisType: 'discrete', categories: ['a1', 'a2', 'a3', '', 'a5', ] });

    range.addRange({});

    assert.strictEqual(range.minVisible, 'a2');
    assert.strictEqual(range.maxVisible, undefined);
    assert.strictEqual(range.min, 'a2');
    assert.strictEqual(range.max, '');
});
