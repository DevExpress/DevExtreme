var rangeModule = require('viz/translators/range');

QUnit.module('Life cycle');

QUnit.test('Create empty', function(assert) {
    // act
    var range = new rangeModule.Range();

    // assert
    assert.ok(range);
    assert.strictEqual(range.min, undefined);
    assert.strictEqual(range.max, undefined);
    assert.strictEqual(range.minVisible, undefined);
    assert.strictEqual(range.maxVisible, undefined);
    assert.strictEqual(range.startCategories, undefined);
    assert.strictEqual(range.endCategories, undefined);
});

QUnit.test('Create with range', function(assert) {
    // act
    var range = new rangeModule.Range({
        min: 0,
        max: 100,
        minVisible: 10,
        maxVisible: 90,
        isValueRange: true,
        alwaysCorrectMin: false
    });

    // assert
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
            this.range = new rangeModule.Range(rangeData);
        };
    }
});

QUnit.test('Merge invert', function(assert) {
    var that = this;

    var checkRules = function(rangeInverted, otherRangeInverted, expected) {
        // arrange
        that.createRange({ invert: rangeInverted });

        // act
        var returnValue = that.range.addRange({ invert: otherRangeInverted });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.invert, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge axis type', function(assert) {
    var that = this;

    var checkRules = function(rangeAxisType, otherRangeAxisType, expected) {
        // arrange
        that.createRange({ axisType: rangeAxisType });

        // act
        var returnValue = that.range.addRange({ axisType: otherRangeAxisType });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.axisType, expected);
    };

    checkRules('continuous', 'discrete', 'continuous');
    checkRules(undefined, 'discrete', 'discrete');
    checkRules('continuous', undefined, 'continuous');
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge data type', function(assert) {
    var that = this;

    var checkRules = function(rangeDataType, otherRangeDataType, expected) {
        // arrange
        that.createRange({ dataType: rangeDataType });

        // act
        var returnValue = that.range.addRange({ dataType: otherRangeDataType });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.dataType, expected);
    };

    checkRules('numeric', 'numeric', 'numeric');
    checkRules(undefined, 'datetime', 'datetime');
    checkRules('string', undefined, 'string');
    checkRules(undefined, undefined, undefined);
});

QUnit.test('Merge isSpacedMargin', function(assert) {
    var that = this;

    var checkRules = function(isSpacedMargin, otherIsSpacedMargin, expected) {
        // arrange
        that.createRange({ isSpacedMargin: isSpacedMargin });

        // act
        var returnValue = that.range.addRange({ isSpacedMargin: otherIsSpacedMargin });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.isSpacedMargin, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge checkMinDataVisibility', function(assert) {
    var that = this;

    var checkRules = function(checkMinDataVisibility, otherCheckMinDataVisibility, expected) {
        // arrange
        that.createRange({ checkMinDataVisibility: checkMinDataVisibility });

        // act
        var returnValue = that.range.addRange({ checkMinDataVisibility: otherCheckMinDataVisibility });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.checkMinDataVisibility, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge checkMaxDataVisibility', function(assert) {
    var that = this;

    var checkRules = function(checkMaxDataVisibility, otherCheckMaxDataVisibility, expected) {
        // arrange
        that.createRange({ checkMaxDataVisibility: checkMaxDataVisibility });

        // act
        var returnValue = that.range.addRange({ checkMaxDataVisibility: otherCheckMaxDataVisibility });

        // assert
        assert.strictEqual(that.range, returnValue);
        assert.strictEqual(that.range.checkMaxDataVisibility, expected);
    };

    checkRules(true, true, true);
    checkRules(false, true, true);
    checkRules(true, false, true);
    checkRules(false, false, false);
});

QUnit.test('Merge base', function(assert) {
    var that = this;

    var checkRules = function(rangeAxisType, rangeBase, otherRangeBase, expected) {
        // arrange
        that.createRange({
            axisType: rangeAxisType,
            base: rangeBase
        });

        // act
        var returnValue = that.range.addRange({ base: otherRangeBase });

        // assert
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
    var that = this;

    var checkRules = function(rangeMin, otherRangeMin, expected) {
        // arrange
        that.createRange({ min: rangeMin });

        // act
        var returnValue = that.range.addRange({ min: otherRangeMin });

        // assert
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
    var that = this;

    var checkRules = function(rangeMinVisible, otherRangeMinVisible, expected) {
        // arrange
        that.createRange({ minVisible: rangeMinVisible });

        // act
        var returnValue = that.range.addRange({ minVisible: otherRangeMinVisible });

        // assert
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
    var that = this;

    var checkRules = function(rangeMax, otherRangeMax, expected) {
        // arrange
        that.createRange({ max: rangeMax });

        // act
        var returnValue = that.range.addRange({ max: otherRangeMax });

        // assert
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
    var that = this;

    var checkRules = function(rangeMaxVisible, otherRangeMaxVisible, expected) {
        // arrange
        that.createRange({ maxVisible: rangeMaxVisible });

        // act
        var returnValue = that.range.addRange({ maxVisible: otherRangeMaxVisible });

        // assert
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
    var that = this;

    var checkRules = function(rangeInterval, otherRangeInterval, expected) {
        // arrange
        that.createRange({ interval: rangeInterval });

        // act
        var returnValue = that.range.addRange({ interval: otherRangeInterval });

        // assert
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
    var that = this;

    var checkRules = function(rangeCategories, otherRangeCategories, expected, message) {
    // arrange
        that.createRange({ categories: rangeCategories });

        // act
        var returnValue = that.range.addRange({ categories: otherRangeCategories });

        // assert
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
            this.range = new rangeModule.Range(rangeData);
        };
    }
});

QUnit.test('Merge min', function(assert) {
    var that = this;

    var checkRules = function(rangeMin, otherRangeMin, expected) {
        // arrange
        that.createRange({ min: rangeMin });

        // act
        var returnValue = that.range.addRange({ min: otherRangeMin });

        // assert
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
    var that = this;

    var checkRules = function(rangeMinVisible, otherRangeMinVisible, expected) {
        // arrange
        that.createRange({ minVisible: rangeMinVisible });

        // act
        var returnValue = that.range.addRange({ minVisible: otherRangeMinVisible });

        // assert
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
    var that = this;

    var checkRules = function(rangeMax, otherRangeMax, expected) {
        // arrange
        that.createRange({ max: rangeMax });

        // act
        var returnValue = that.range.addRange({ max: otherRangeMax });

        // assert
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
    var that = this;

    var checkRules = function(rangeMaxVisible, otherRangeMaxVisible, expected) {
        // arrange
        that.createRange({ maxVisible: rangeMaxVisible });

        // act
        var returnValue = that.range.addRange({ maxVisible: otherRangeMaxVisible });

        // assert
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
    var that = this;

    var checkRules = function(rangeCategories, otherRangeCategories, expected, message) {
    // arrange
        that.createRange({ categories: rangeCategories, dataType: 'datetime' });

        // act
        var returnValue = that.range.addRange({ categories: otherRangeCategories });

        // assert
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
            this.range = new rangeModule.Range(rangeData);
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
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 80
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 20,
        maxVisible: 80,
        max: 100
    });
});

QUnit.test('minVisible < min, maxVisible < max', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 5,
        maxVisible: 80
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 5,
        minVisible: 5,
        maxVisible: 80,
        max: 100
    });
});

QUnit.test('min < minVisible, max < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 110
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 20,
        maxVisible: 110,
        max: 110
    });
});

QUnit.test('minVisible < min, max < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 5,
        maxVisible: 110
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 5,
        minVisible: 5,
        maxVisible: 110,
        max: 110
    });
});

QUnit.test('min < max < minVisible < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 110,
        maxVisible: 130
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 110,
        maxVisible: 130,
        max: 130
    });
});

QUnit.test('min < max < minVisible, maxVisible = undefined', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 110
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 10,
        minVisible: 110,
        max: 110
    });
});

QUnit.test('minVisible < maxVisible < min < max', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 1,
        maxVisible: 5
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: 1,
        minVisible: 1,
        maxVisible: 5,
        max: 100
    });
});

QUnit.test('minVisible = undefined, maxVisible < min < max', function(assert) {
    // arrange
    this.createRange({
        min: 10,
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        maxVisible: 5
    });

    // assert
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
            this.range = new rangeModule.Range(rangeData);
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
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(80000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(20000),
        maxVisible: new Date(80000),
        max: new Date(100000)
    });
});

QUnit.test('minVisible < min, maxVisible < max', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(5000),
        maxVisible: new Date(80000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(5000),
        minVisible: new Date(5000),
        maxVisible: new Date(80000),
        max: new Date(100000)
    });
});

QUnit.test('min < minVisible, max < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(110000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(20000),
        maxVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('minVisible < min, max < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(5000),
        maxVisible: new Date(110000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(5000),
        minVisible: new Date(5000),
        maxVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('min < max < minVisible < maxVisible', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(110000),
        maxVisible: new Date(130000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(110000),
        maxVisible: new Date(130000),
        max: new Date(130000)
    });
});

QUnit.test('min < max < minVisible, maxVisible = undefined', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(110000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(10000),
        minVisible: new Date(110000),
        max: new Date(110000)
    });
});

QUnit.test('minVisible < maxVisible < min < max', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(1000),
        maxVisible: new Date(5000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        min: new Date(1000),
        minVisible: new Date(1000),
        maxVisible: new Date(5000),
        max: new Date(100000)
    });
});

QUnit.test('minVisible = undefined, maxVisible < min < max', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000),
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        maxVisible: new Date(5000)
    });

    // assert
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
            this.range = new rangeModule.Range(rangeData);
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
    // arrange
    this.createRange({
        max: 100
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 10,
        maxVisible: 100
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        minVisible: 10,
        maxVisible: 100,
        max: 100
    });
});

QUnit.test('min/minVisible/maxVisible != undefined, max = undefined', function(assert) {
    // arrange
    this.createRange({
        min: 10
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: 20,
        maxVisible: 100
    });

    // assert
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
            this.range = new rangeModule.Range(rangeData);
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
    // arrange
    this.createRange({
        max: new Date(100000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(10000),
        maxVisible: new Date(100000)
    });

    // assert
    assert.strictEqual(this.range, returnValue);
    this.checkRanges(assert, {
        minVisible: new Date(10000),
        maxVisible: new Date(100000),
        max: new Date(100000)
    });
});

QUnit.test('min/minVisible/maxVisible != undefined, max = undefined', function(assert) {
    // arrange
    this.createRange({
        min: new Date(10000)
    });

    // act
    var returnValue = this.range.addRange({
        minVisible: new Date(20000),
        maxVisible: new Date(100000)
    });

    // assert
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
            this.range = new rangeModule.Range(rangeData);
        };
    }
});

QUnit.test('Empty', function(assert) {
    // arrange
    this.createRange();

    // act/assert
    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('With min and without max', function(assert) {
    // arrange
    this.createRange({ min: 0 });

    // act/assert
    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('Without min and with max', function(assert) {
    // arrange
    this.createRange({ max: 10 });

    // act/assert
    assert.equal(this.range.isEmpty(), true);
});

QUnit.test('With min and max', function(assert) {
    // arrange
    this.createRange({ min: 0, max: 10 });

    // act/assert
    assert.equal(this.range.isEmpty(), false);
});

QUnit.test('With categories', function(assert) {
    // arrange
    this.createRange({});

    // act
    this.range.addRange({ categories: ['a', 'b'] });

    // assert
    assert.equal(this.range.isEmpty(), false);
});

QUnit.test('With categories that is empty', function(assert) {
    // arrange
    this.createRange({ categories: [] });

    // act/assert
    assert.equal(this.range.isEmpty(), true);
});

QUnit.module('Correct Zero level functionality', {
    beforeEach: function() {
        function createRange(rangeData) {
            return new rangeModule.Range(rangeData);
        }

        function checkRangeBounds(assert, range, originalRange) {
            assert.ok(range.minVisible <= range.maxVisible, 'MinVisible should be less than MaxVisible');
            assert.ok(range.min <= range.minVisible, 'Min should be less than MinVisible');
            assert.ok(range.maxVisible <= range.max, 'MaxVisible should be less than Max');

            assert.ok(range.min <= originalRange.min, 'Min should be less than or equal to Original Min');
            assert.ok(range.max >= originalRange.max, 'Max should be greater than or equal to Original Max');
        }

        this.checkRanges = function(assert, template, expected) {
            // arrange
            var range = createRange(template);

            // act
            range.correctValueZeroLevel();

            // assert
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

QUnit.test('min > 0, max > 0, minVisible > 0, maxVisible > 0. Logarithmic axis', function(assert) {
    this.checkRanges(assert, {
        min: 10,
        max: 100,
        minVisible: 20,
        maxVisible: 80,
        axisType: 'logarithmic'
    }, {
        min: 10,
        max: 100,
        minVisible: 20,
        maxVisible: 80
    });
});

QUnit.test('min < 0, max < 0, minVisible < 0, maxVisible < 0. Logarithmic axis', function(assert) {
    this.checkRanges(assert, {
        min: -100,
        max: -10,
        minVisible: -80,
        maxVisible: -20,
        axisType: 'logarithmic'
    }, {
        min: -100,
        max: -10,
        minVisible: -80,
        maxVisible: -20
    });
});

QUnit.module('discrete zooming');

QUnit.test('min/max categories after create range with min and max categories', function(assert) {
    // arrange,act
    var range = new rangeModule.Range({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories', axisType: 'discrete' });

    // arrange
    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});

QUnit.test('min/max categories after call add range (create without min/max categories)', function(assert) {
    // arrange
    var range = new rangeModule.Range({ axisType: 'discrete' });

    // act
    range.addRange({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories' });

    // assert
    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});

QUnit.test('min/max categories after call add range (create with min/max categories)', function(assert) {
    // arrange
    var range = new rangeModule.Range({ minVisible: 'someStartCategories', maxVisible: 'someEndCategories', axisType: 'discrete' });

    // act
    range.addRange({ minVisible: 'anotherStartCategories', maxVisible: 'someEndCategories' });

    // assert
    assert.strictEqual(range.minVisible, 'someStartCategories');
    assert.strictEqual(range.maxVisible, 'someEndCategories');
});
