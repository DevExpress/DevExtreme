import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import { MockTranslator, MockSeries, MockPoint } from '../../helpers/chartMocks.js';
import { SeriesFamily } from 'viz/core/series_family';

const ZERO = 0;

document.title = 'Series Family ' + document.title;
var createPoint = function(value) {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.initialValue = value;
    stub.value = value;
    stub.argument = 1;
    return stub;
};

var pointsForStacking = {
    points1: function() {
        return [
            new MockPoint({ argument: 'First', value: 10 }),
            new MockPoint({ argument: 'Second', value: 11 }),
            new MockPoint({ argument: 'Third', value: 12 })
        ];
    },
    points2: function() {
        return [
            new MockPoint({ argument: 'First', value: 20 }),
            new MockPoint({ argument: 'Second', value: 21 }),
            new MockPoint({ argument: 'Third', value: 22 })
        ];
    },
    points3: function() {
        return [
            new MockPoint({ argument: 'First', value: 30 }),
            new MockPoint({ argument: 'Second', value: 31 }),
            new MockPoint({ argument: 'Third', value: 32 })
        ];
    },
    points4: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 40 }),
            new MockPoint({ argument: 'Second', value: 41 }),
            new MockPoint({ argument: 'Third', value: 42 })
        ]);
    },
    points5: function() {
        return [
            new MockPoint({ argument: 'First', value: 50 }),
            new MockPoint({ argument: 'Second', value: 51 }),
            new MockPoint({ argument: 'Third', value: 52 })
        ];
    },

    minHeightPoints1: function() {
        return [
            new MockPoint({ argument: 'First', value: 5 }),
            new MockPoint({ argument: 'Second', value: 6 }),
            new MockPoint({ argument: 'Third', value: 7 })
        ];
    },
    minHeightPoints2: function() {
        return [
            new MockPoint({ argument: 'First', value: 2 }),
            new MockPoint({ argument: 'Second', value: 3 }),
            new MockPoint({ argument: 'Third', value: 4 })
        ];
    },
    minHeightPoints3: function() {
        return [
            new MockPoint({ argument: 'First', value: 4 }),
            new MockPoint({ argument: 'Second', value: 9 }),
            new MockPoint({ argument: 'Third', value: 8 })
        ];
    },

    minHeightPoints4: function() {
        return [
            new MockPoint({ argument: 'First', value: 0 }),
            new MockPoint({ argument: 'Second', value: 0 }),
            new MockPoint({ argument: 'Third', value: 0 })
        ];
    },

    minHeightPoints5: function() {
        return [
            new MockPoint({ argument: 'First', value: 1 }),
            new MockPoint({ argument: 'Second', value: -2 }),
            new MockPoint({ argument: 'Third', value: -3 })
        ];
    },

    minHeightPoints6: function() {
        return [
            new MockPoint({ argument: 'First', value: 2 }),
            new MockPoint({ argument: 'Second', value: -1 }),
            new MockPoint({ argument: 'Third', value: -4 })
        ];
    },

    minHeightPoints7: function() {
        return [
            new MockPoint({ argument: 'First', value: -2 }),
            new MockPoint({ argument: 'Second', value: 1 }),
            new MockPoint({ argument: 'Third', value: 5 })
        ];
    },

    minHeightPoints8: function() {
        return [
            new MockPoint({ argument: 'First', value: -2 }),
            new MockPoint({ argument: 'Second', value: null }),
            new MockPoint({ argument: 'Third', value: 5 })
        ];
    },

    minHeightPoints9: function() {
        return [
            new MockPoint({ argument: 'First', value: null }),
            new MockPoint({ argument: 'Second', value: 1 }),
            new MockPoint({ argument: 'Third', value: 5 })
        ];
    },

    minHeightPoints10: function() {
        return [
            new MockPoint({ argument: 'First', value: 2 }),
            new MockPoint({ argument: 'Second', value: -1 }),
            new MockPoint({ argument: 'Third', value: null })
        ];
    },

    minHeightPoints11: function() {
        return [
            new MockPoint({ argument: 'First', value: 2 }),
            new MockPoint({ argument: 'Second', value: null }),
            new MockPoint({ argument: 'Third', value: 5 })
        ];
    },

    minHeightPoints12: function() {
        return [
            new MockPoint({ argument: 'First', value: 2 }),
            new MockPoint({ argument: 'Second', value: 1 }),
            new MockPoint({ argument: 'Third', value: null })
        ];
    },

    negativePoints1: function() {
        return [
            new MockPoint({ argument: 'First', value: -10 }),
            new MockPoint({ argument: 'Second', value: -20 }),
            new MockPoint({ argument: 'Third', value: -30 })
        ];
    },
    negativePoints2: function() {
        return [
            new MockPoint({ argument: 'First', value: -20 }),
            new MockPoint({ argument: 'Second', value: -40 }),
            new MockPoint({ argument: 'Third', value: -60 })
        ];
    },
    negativePoints3: function() {
        return [
            new MockPoint({ argument: 'First', value: -30 }),
            new MockPoint({ argument: 'Second', value: -60 }),
            new MockPoint({ argument: 'Third', value: -90 })
        ];
    },
    negativePoints4: function() {
        return [
            new MockPoint({ argument: 'First', value: -40 }),
            new MockPoint({ argument: 'Second', value: -80 }),
            new MockPoint({ argument: 'Third', value: -120 })
        ];
    },

    mixedPoints1: function() {
        return [
            new MockPoint({ argument: 'First', value: -10 }),
            new MockPoint({ argument: 'Second', value: 20 }),
            new MockPoint({ argument: 'Third', value: -30 })
        ];
    },
    mixedPoints2: function() {
        return [
            new MockPoint({ argument: 'First', value: 20 }),
            new MockPoint({ argument: 'Second', value: -40 }),
            new MockPoint({ argument: 'Third', value: -60 })
        ];
    },
    mixedPoints3: function() {
        return [
            new MockPoint({ argument: 'First', value: -30 }),
            new MockPoint({ argument: 'Second', value: 60 }),
            new MockPoint({ argument: 'Third', value: -90 })
        ];
    },
    mixedPoints4: function() {
        return [
            new MockPoint({ argument: 'First', value: 40 }),
            new MockPoint({ argument: 'Second', value: -80 }),
            new MockPoint({ argument: 'Third', value: 120 })
        ];
    },

    points1FirstOnly: function() {
        return [
            new MockPoint({ argument: 'First', value: 10 })
        ];
    },
    points2FirstAndSecondOnly: function() {
        return [
            new MockPoint({ argument: 'First', value: 20 }),
            new MockPoint({ argument: 'Second', value: 21 })
        ];
    },
    points1FirstGoodAndSecondZero: function() {
        return [
            new MockPoint({ argument: 'First', value: 20 }),
            new MockPoint({ argument: 'Second', value: 0 })
        ];
    },

    points1DateArgument: function() {
        return [
            new MockPoint({ argument: new Date(0), value: 13 }),
            new MockPoint({ argument: new Date(2), value: 17 }),
            new MockPoint({ argument: new Date(4), value: 29 })
        ];
    },
    points1DateValue: function() {
        return [
            new MockPoint({ argument: 'First', value: new Date(10) }),
            new MockPoint({ argument: 'Second', value: new Date(11) }),
            new MockPoint({ argument: 'Third', value: new Date(12) })
        ];
    },
    points2DateValue: function() {
        return [
            new MockPoint({ argument: 'First', value: new Date(20) }),
            new MockPoint({ argument: 'Second', value: new Date(21) }),
            new MockPoint({ argument: 'Third', value: new Date(22) })
        ];
    },
    points3DateValue: function() {
        return [
            new MockPoint({ argument: 'First', value: new Date(30) }),
            new MockPoint({ argument: 'Second', value: new Date(31) }),
            new MockPoint({ argument: 'Third', value: new Date(32) })
        ];
    },

    points1WithSameArguments: function() {
        return [
            new MockPoint({ argument: 'A', value: 13 }),
            new MockPoint({ argument: 'B', value: 15 }),
            new MockPoint({ argument: 'A', value: 26 })
        ];
    },
    points2WithSameArguments: function() {
        return [
            new MockPoint({ argument: 'B', value: 10 }),
            new MockPoint({ argument: 'A', value: 12 }),
            new MockPoint({ argument: 'B', value: 15 })
        ];
    },
    points3WithSameArguments: function() {
        return [
            new MockPoint({ argument: 'A', value: 13 }),
            new MockPoint({ argument: 'B', value: 15 }),
            new MockPoint({ argument: 'A', value: null })
        ];
    },
    points4WithSameArguments: function() {
        return [
            new MockPoint({ argument: 'B', value: 10 }),
            new MockPoint({ argument: 'A', value: 12 }),
            new MockPoint({ argument: 'B', value: null })
        ];
    },
    barWidthPoints1: function() {
        return [
            new MockPoint({ argument: 'First', value: 10 }),
            new MockPoint({ argument: 'Second', value: null }),
            new MockPoint({ argument: 'Third', value: 2 })
        ];
    },
    barWidthPoints2: function() {
        return [
            new MockPoint({ argument: 'First', value: 11 }),
            new MockPoint({ argument: 'Second', value: null }),
            new MockPoint({ argument: 'Third', value: null })
        ];
    },
    barWidthPoints3: function() {
        return [
            new MockPoint({ argument: 'First', value: 13 }),
            new MockPoint({ argument: 'Second', value: 12 }),
            new MockPoint({ argument: 'Third', value: 5 })
        ];
    }
};

var pointsForBubble = {
    points1: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 10, size: 90 }),
            new MockPoint({ argument: 'Second', value: 11, size: 70 }),
            new MockPoint({ argument: 'Third', value: 12, size: 96 })
        ]);
    },
    points2: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 20, size: 20 }),
            new MockPoint({ argument: 'Second', value: 21, size: -50 }),
            new MockPoint({ argument: 'Third', value: 22, size: 44 })
        ]);
    },
    points3: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 30, size: 2 }),
            new MockPoint({ argument: 'Second', value: 31, size: 95 }),
            new MockPoint({ argument: 'Third', value: 32, size: 73 })
        ]);
    },
    points4: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 10, size: 90 }),
            new MockPoint({ argument: 'Second', value: 11, size: 88 }),
            new MockPoint({ argument: 'Third', value: 12, size: 89 })
        ]);
    },
    points5: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 20, size: 87 }),
            new MockPoint({ argument: 'Second', value: 21, size: 91 }),
            new MockPoint({ argument: 'Third', value: 22, size: 90 })
        ]);
    },
    points6: function() {
        return $.extend([], [
            new MockPoint({ argument: 'First', value: 20, size: 87 })
        ]);
    }
};

function checkStackedPoints(assert, points1, points2, points3) {
    var bound = {
        positive: [],
        negative: []
    };

    $.each(points1, function(i, point) {
        var value = point.originalValue,
            valueType = (value >= 0) ? 'positive' : 'negative',
            currentBound = bound[valueType][i];

        assert.strictEqual(point.correctedValue, undefined, 'Value should not be corrected');

        bound[valueType][i] = (currentBound) ? currentBound.valueOf() + value.valueOf() : value.valueOf();
    });

    if(points2) {
        $.each(points2, function(i, point) {
            var value = point.originalValue,
                valueType = (value >= 0) ? 'positive' : 'negative',
                currentBound = bound[valueType][i];

            assert.strictEqual(points2[i].correctedValue && points2[i].correctedValue.valueOf(), point.value !== null ? currentBound : undefined, 'Value should be corrected with first series values');

            bound[valueType][i] = (currentBound) ? currentBound.valueOf() + value.valueOf() : value.valueOf();
        });
    }
    if(points3) {
        $.each(points3, function(i, point) {
            var value = point.originalValue,
                valueType = (value >= 0) ? 'positive' : 'negative',
                currentBound = bound[valueType][i];

            assert.strictEqual(points3[i].correctedValue && points3[i].correctedValue.valueOf(), point.value !== null ? currentBound : undefined, 'Value should be corrected with first series values');

            bound[valueType][i] = (currentBound) ? currentBound.valueOf() + value.valueOf() : value.valueOf();
        });
    }
}

function checkFullStackedPoints(assert, points1, points2, points3) {
    var i,
        maxValues = {
            positive: 0,
            negative: 0
        },
        originalValues = {
            positive: 0,
            negative: 0
        },
        length = 0,
        pointsList = [];

    var findAllPoints = function() {
        pointsList = [points1];

        length = points1.length;

        if(points2) {
            pointsList.push(points2);
            length = Math.max(length, points2.length);
        }

        if(points3) {
            pointsList.push(points3);
            length = Math.max(length, points3.length);
        }
    };

    checkStackedPoints(assert, points1, points2, points3);
    findAllPoints();

    var j,
        point,
        value,
        valueType;

    for(i = 0; i < length; i++) {
        maxValues.positive = 0;
        maxValues.negative = 0;
        originalValues.positive = 0;
        originalValues.negative = 0;

        for(j = 0; j < pointsList[0].length; j++) {
            point = pointsList[0][j];
            if(point[i]) {
                value = point[i].originalValue;
                valueType = (value >= 0) ? 'positive' : 'negative';

                originalValues[valueType] += value;
                maxValues[valueType] = Math.max(value, maxValues[valueType]);
            }
        }

        if(maxValues.positive !== 0) {
            assert.strictEqual(maxValues.positive, 1, 'Max value must be 1');
        }
        if(maxValues.negative !== 0) {
            assert.strictEqual(maxValues.negative, 1, 'Max value must be 1');
        }

        for(j = 0; j < pointsList[0].length; j++) {
            point = pointsList[0][j];
            if(point[i]) {
                valueType = (point[i].originalValue >= 0) ? 'positive' : 'negative';
                assert.strictEqual(point.total, originalValues[valueType], 'Normalize value');
            }
        }
    }
}

function checkStackedPointHeight(assert, series, val1, val2, val3, minVal1, minVal2, minVal3) {
    var points = series.getPoints();
    assert.equal(points[0].value, val1);
    assert.equal(points[1].value, val2);
    assert.equal(points[2].value, val3);
    assert.equal(points[0].minValue, minVal1);
    assert.equal(points[1].minValue, minVal2);
    assert.equal(points[2].minValue, minVal3);
}

var setCommonSeriesType = function(series, type) {
    var s;

    for(var i = 0; i < series.length; i++) {
        s = series[i];
        s && (s.type = type);
    }
};

function checkPercentValue(assert, point, total) {
    assert.equal(point.total, total);
    assert.equal(point.percent, point.value / total);
}

function getArgAxis(visibleArea, interval) {
    const translator = new MockTranslator({
        interval: interval || 100,
        translate: { 10: 311, 11: 312, 12: 313, 20: 222, 21: 310, 22: 223, 30: 114, 31: 112, 32: 218, 0: 315 },
        from: { 0: 0, 10: 10 }
    });
    return {
        getTranslator: function() {
            return translator;
        },
        getVisibleArea() {
            return visibleArea && [visibleArea.min, visibleArea.max] || [];
        }
    };
}

function getValAxes(name, visibleArea) {
    var val1Trans = new MockTranslator({
            interval: 100,
            translate: { 10: 311, 11: 312, 12: 313, 20: 222, 21: 310, 22: 223, 30: 114, 31: 112, 32: 218, 0: 315 },
            from: { 0: 0, 10: 10 }
        }),
        val2Trans = new MockTranslator({
            interval: 200,
            translate: { 20: 311, 21: 312, 22: 313, 30: 222, 31: 310, 32: 223, 40: 114, 41: 112, 42: 218, 0: 315 },
            from: { 0: 0, 10: 20 }
        });

    val1Trans.getMinBarSize && (val1Trans.getMinBarSize = function() { return arguments[0]; });
    val2Trans.getMinBarSize && (val2Trans.getMinBarSize = function() { return arguments[0] * 2; });

    return {
        axis1: {
            getTranslator: function() {
                return val1Trans;
            },
            getVisibleArea() {
                return visibleArea && [visibleArea.min, visibleArea.max] || [];
            }
        },
        axis2: {
            getTranslator: function() {
                return val2Trans;
            },
            getVisibleArea() {
                return visibleArea && [visibleArea.min, visibleArea.max] || [];
            }
        }
    }[name || 'axis1'];
}

function createSeries(options, valAxis, visibleArea, interval) {
    return new MockSeries($.extend({
        argumentAxis: getArgAxis(visibleArea && visibleArea.arg, interval),
        valueAxis: getValAxes(valAxis, visibleArea && visibleArea.val)
    }, options));
}

function createSeriesFamily(type, series, options) {
    var family = new SeriesFamily($.extend({ type: type, barGroupPadding: 0.3 }, options));
    setCommonSeriesType(series, type);
    family.add(series);

    family.adjustSeriesValues();
    family.updateSeriesValues();
    family.adjustSeriesDimensions();

    return family;
}

var checkSeries = function(assert, series, expectedWidth, expectedOffset) {
    var points = series.getPoints();
    assert.ok(points, 'Points were passed');
    assert.ok(points.length, 'There are some points');
    $.each(points, function(i, point) {
        assert.ok(point.coordinatesCorrected, 'Point [' + i.toString() + '] has mark about corrected coordinates');
        assert.ok(point.coordinatesCorrection, 'Point [' + i.toString() + '] has right coordinates');

        assert.roughEqual(point.coordinatesCorrection.width, expectedWidth, 0.01, 'Correct width was calculated');
        assert.roughEqual(point.coordinatesCorrection.offset, expectedOffset, 0.01, 'Correct offset was set');

    });
};

QUnit.module('Family creation');

QUnit.test('creation params', function(assert) {
    var family = new SeriesFamily({
        type: 'bar',
        pane: 'pane-option',
        equalBarWidth: 'equalBarWidth-option',
        minBubbleSize: 'minBubbleSize-option',
        maxBubbleSize: 'maxBubbleSize-option'
    });

    assert.ok(family);
    assert.ok(family._options);
    assert.equal(family.type, 'bar');
    assert.equal(family.pane, 'pane-option');
    assert.equal(family._options.equalBarWidth, 'equalBarWidth-option', 'equalBarWidth');
    assert.equal(family._options.minBubbleSize, 'minBubbleSize-option', 'minBubbleSize');
    assert.equal(family._options.maxBubbleSize, 'maxBubbleSize-option', 'maxBubbleSize');
});

QUnit.test('update API method', function(assert) {
    var type = 'bar',
        family = new SeriesFamily({
            type: type
        });

    family.updateOptions({
        equalBarWidth: 'equalBarWidth',
        minBubbleSize: 'minBubbleSize',
        maxBubbleSize: 'maxBubbleSize',
        barWidth: 'barWidth'
    });

    assert.ok(family);
    assert.ok(family._options);
    assert.equal(family._options.equalBarWidth, 'equalBarWidth', 'equalBarWidth');
    assert.equal(family._options.minBubbleSize, 'minBubbleSize', 'minBubbleSize');
    assert.equal(family._options.maxBubbleSize, 'maxBubbleSize', 'maxBubbleSize');
    assert.equal(family._options.barWidth, 'barWidth', 'barWidth');
});

QUnit.test('update old options', function(assert) {
    var type = 'bar',
        family = new SeriesFamily({
            type: type,
            equalBarWidth: 'oldEqualBarWidth',
            minBubbleSize: 'oldMinBubbleSize',
            maxBubbleSize: 'oldMaxBubbleSize',
            barWidth: 'oldBarWidth'
        });

    family.updateOptions({
        equalBarWidth: 'equalBarWidth',
        minBubbleSize: 'minBubbleSize',
        maxBubbleSize: 'maxBubbleSize',
        barWidth: 'barWidth'
    });

    assert.ok(family);
    assert.ok(family._options);
    assert.equal(family._options.equalBarWidth, 'equalBarWidth', 'equalBarWidth');
    assert.equal(family._options.minBubbleSize, 'minBubbleSize', 'minBubbleSize');
    assert.equal(family._options.maxBubbleSize, 'maxBubbleSize', 'maxBubbleSize');
    assert.equal(family._options.barWidth, 'barWidth', 'barWidth');
});

QUnit.module('Added series to Family');

QUnit.test('Add array of correct series', function(assert) {
    // arrange
    var type = 'bar',
        series1 = new MockSeries(),
        series2 = new MockSeries(),
        series3 = new MockSeries(),
        series = [series1, series2, series3],
        family = new SeriesFamily({
            type: type
        });
    series1.type = 'bar';
    series2.type = 'bar';
    series3.type = 'bar';
    // act
    family.add(series);
    // assert
    assert.equal(family.series.length, 3);
    assert.equal(family.series[0], series1);
    assert.equal(family.series[1], series2);
    assert.equal(family.series[2], series3);
});

QUnit.test('Add array of different series', function(assert) {
    // arrange
    var type = 'bar',
        series1 = new MockSeries(),
        series2 = new MockSeries(),
        series3 = new MockSeries(),
        series = [series1, series2, series3],
        family = new SeriesFamily({
            type: type
        });
    series1.type = 'bar';
    series2.type = 'line';
    series3.type = 'bar';
    // act
    family.add(series);
    // assert
    assert.equal(family.series.length, 2);
    assert.equal(family.series[0], series1);
    assert.equal(family.series[1], series3);
});

QUnit.module('Bar series - side-by-side width calculation');

QUnit.test('Set single series', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }),
        expectedWidth = 42;

    createSeriesFamily('bar', [series], { equalBarWidth: true, barWidth: 0.6 });

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.test('Set single series, bar width is specify', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }),
        expectedWidth = 70;

    createSeriesFamily('bar', [series], { equalBarWidth: true });

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.test('Set single series, bar width is specify', function(assert) {
    const series = createSeries({ points: pointsForStacking.points1() });
    sinon.spy(series, 'getPointsByArg');

    createSeriesFamily('bar', [series], { equalBarWidth: true });

    series.getPointsByArg.getCalls().forEach(call => {
        assert.strictEqual(call.args[1], true);
    });
});

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series = [series1, series2],
        expectedSpacing = 7,
        expectedWidth = 32;

    createSeriesFamily('bar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, ZERO - expectedWidth / 2 - expectedSpacing / 2);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing / 2);
});

QUnit.test('Set two series with invisible series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series = [series1, series2],
        expectedWidth = 70;

    series2.isVisible = function() {
        return false;
    };
    createSeriesFamily('bar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    $.each(series2.getPoints(), function(i, point) {
        assert.ok(!point.coordinatesCorrected, 'Point [' + i.toString() + '] has no mark about corrected coordinates');
    });
});

QUnit.test('Set five series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('bar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series, width is specified', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 14,
        expectedWidth = 3;

    createSeriesFamily('bar', series, { equalBarWidth: true, barWidth: 0.2 });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series, barGroupWidth is specified', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 2,
        expectedWidth = 10;

    createSeriesFamily('bar', series, { barGroupWidth: 60 });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series, barGroupWidth > interval - group width should be equal to interval', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 4,
        expectedWidth = 17;

    createSeriesFamily('bar', series, { barGroupWidth: 200 });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series, barGroupWidth = 0 - group width ignor barGroupWidth option', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('bar', series, { barGroupWidth: 0 });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set three series, barPadding is specified', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barPadding: 0.2 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barPadding: 0.5 }),
        series3 = createSeries({ points: pointsForStacking.points3(), barPadding: 0 }),
        series = [series1, series2, series3];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 19, -26);
    checkSeries(assert, series2, 12, 0);
    checkSeries(assert, series3, 23, 23);
});

QUnit.test('Set two series, barPadding more than 1', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barPadding: 2 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barPadding: 2 }),
        series = [series1, series2];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 32, -19.5);
    checkSeries(assert, series2, 32, 19.5);
});

QUnit.test('Set two series, barPadding less than 0', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barPadding: -10 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barPadding: -10 }),
        series = [series1, series2];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 32, -19.5);
    checkSeries(assert, series2, 32, 19.5);
});

QUnit.test('Set two series, barPadding is 1', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barPadding: 1 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barPadding: 1 }),
        series = [series1, series2];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 1, -35.5);
    checkSeries(assert, series2, 1, 35.5);
});

QUnit.test('Set three series, barWidth is specified', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barWidth: 5 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barWidth: 10 }),
        series3 = createSeries({ points: pointsForStacking.points3(), barWidth: 15 }),
        series = [series1, series2, series3];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 5, -33);
    checkSeries(assert, series2, 10, 0);
    checkSeries(assert, series3, 15, 28);
});

QUnit.test('Set three series, all of them in one group', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints3(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            barOverlapGroup: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            barOverlapGroup: 'first'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            barOverlapGroup: 'first'
        }),
        series = [series1, series2, series3],
        expectedWidth = 70,
        expectedOffset = 0;

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);

    checkStackedPoints(assert, mixedPoints1);
    checkStackedPoints(assert, mixedPoints2);
    checkStackedPoints(assert, mixedPoints3);
});


QUnit.test('Set three series, two of them in one group, and last in another group', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints3(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            barOverlapGroup: 'g1'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            barOverlapGroup: 'g1'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            barOverlapGroup: 'g2'
        }),
        series = [series1, series2, series3];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 32, -19.5);
    checkSeries(assert, series2, 32, -19.5);
    checkSeries(assert, series3, 32, 19.5);

    checkStackedPoints(assert, mixedPoints1);
    checkStackedPoints(assert, mixedPoints2);
    checkStackedPoints(assert, mixedPoints3);
});

QUnit.test('Check bars order when barOverlapGroup is set', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            barOverlapGroup: 'g1'
        }),
        series2 = createSeries({
            points: mixedPoints2
        }),
        series3 = createSeries({
            points: mixedPoints3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 20, -25);
    checkSeries(assert, series2, 20, 0);
    checkSeries(assert, series3, 20, 25);
});

QUnit.test('Set four series, two of them in one group, and last in another group, and one series have custom barWidth', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        mixedPoints4 = pointsForStacking.mixedPoints4(),
        series1 = createSeries({
            points: mixedPoints1,
        }),
        series2 = createSeries({
            points: mixedPoints2,
            barOverlapGroup: 'g1',
            barWidth: 10
        }),
        series3 = createSeries({
            points: mixedPoints3,
            barOverlapGroup: 'g1'
        }),
        series4 = createSeries({
            points: mixedPoints4,
            barOverlapGroup: 'g2'
        }),
        series = [series1, series2, series3, series4];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 20, -25);
    checkSeries(assert, series2, 10, 0);
    checkSeries(assert, series3, 20, 0);
    checkSeries(assert, series4, 20, 25);

    checkStackedPoints(assert, mixedPoints1);
    checkStackedPoints(assert, mixedPoints2);
    checkStackedPoints(assert, mixedPoints3);
    checkStackedPoints(assert, mixedPoints4);
});

QUnit.test('Set three series, barWidth more than maximum possible width - should be equal to maximum possible width', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), barWidth: 50 }),
        series2 = createSeries({ points: pointsForStacking.points2(), barWidth: 100 }),
        series3 = createSeries({ points: pointsForStacking.points3(), barWidth: 150 }),
        series = [series1, series2, series3];

    createSeriesFamily('bar', series);

    checkSeries(assert, series1, 23, -24);
    checkSeries(assert, series2, 23, 0);
    checkSeries(assert, series3, 23, 24);
});

QUnit.test('Set one series, barGroupPadding less than 0, bars width should be 70% from interval', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series = [series1];

    createSeriesFamily('bar', series, { barGroupPadding: -10 });

    checkSeries(assert, series1, 70, 0);
});

QUnit.test('Set one series, barGroupPadding more than 1, bars width should be 70% from interval', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series = [series1];

    createSeriesFamily('bar', series, { barGroupPadding: 2 });

    checkSeries(assert, series1, 70, 0);
});

QUnit.test('Set five series, only width is specified, negative value', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('bar', series, { equalBarWidth: { width: -10 } });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series. inverted', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    series.forEach(s => {
        s.getArgumentAxis().getTranslator().isInverted = function() {
            return true;
        };
    });

    createSeriesFamily('bar', series, { equalBarWidth: true });

    checkSeries(assert, series5, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series1, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

// Q560976
QUnit.test('Stackedbar with negative values', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        mixedPoints = pointsForStacking.mixedPoints2(),
        series1 = createSeries({ points: negativePoints1 }),
        series2 = createSeries({ points: mixedPoints }),
        series = [series1, series2];

    createSeriesFamily('stackedbar', series);

    checkStackedPointHeight(assert, series1, -10, -20, -30, 0, 0, 0);
    checkStackedPointHeight(assert, series2, 20, -60, -90, 0, -20, -30);
});

QUnit.module('Bar series - side-by-side with equalBarWidth calculation');

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1FirstOnly() }),
        series2 = createSeries({ points: pointsForStacking.points2FirstAndSecondOnly() }),
        series = [series1, series2],
        expectedSpacing = 7,
        expectedWidthTwoBars = 32;

    createSeriesFamily('bar', series, { equalBarWidth: true });

    // first argument - both bars exists
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, point 1 - both bars exist');
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.offset,
        0 - expectedWidthTwoBars / 2 - expectedSpacing / 2,
        'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.offset,
        ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2,
        'Series 2, point 1 - both bars exist');

    // first argument - both bars exists
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, point 2 - width - single bar exists');
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.offset,
        ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2,
        'Series 2, point 2 - offset - single bar exists');
});

QUnit.module('Bar series - side-by-side width different width calculation');

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1FirstOnly() }),
        series2 = createSeries({ points: pointsForStacking.points2FirstAndSecondOnly() }),
        series = [series1, series2],
        expectedWidthOneBar = 70,
        expectedWidthTwoBars = 32,
        expectedSpacing = 7;

    createSeriesFamily('bar', series, { equalBarWidth: false });

    // first argument - both bars exists
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, point 1 - both bars exist');
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.offset,
        0 - expectedWidthTwoBars / 2 - expectedSpacing / 2,
        'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.offset,
        ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2,
        'Series 2, point 1 - both bars exist');

    // first argument - both bars exists
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.width, expectedWidthOneBar, 'Series 2, point 2 - single bar exists');
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.offset,
        0,
        'Series 2, point 2 - single bar exists');
});

QUnit.test('Set two series with points with the same arguments', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1WithSameArguments() }),
        series2 = createSeries({ points: pointsForStacking.points2WithSameArguments() }),
        series = [series1, series2],
        expectedWidthTwoBars = 32,
        expectedSpacing = 7;

    createSeriesFamily('bar', series, { equalBarWidth: false });

    // first series
    assert.strictEqual(series1.getPointsByArg('A')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument A, first point');
    assert.strictEqual(series1.getPointsByArg('A')[0].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument A, first point');

    assert.strictEqual(series1.getPointsByArg('A')[1].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument A, second point');
    assert.strictEqual(series1.getPointsByArg('A')[1].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument A, second point');

    assert.strictEqual(series1.getPointsByArg('B')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument B, first point');
    assert.strictEqual(series1.getPointsByArg('B')[0].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument B, first point');

    // second series
    assert.strictEqual(series2.getPointsByArg('B')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument B, first point');
    assert.strictEqual(series2.getPointsByArg('B')[0].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument B, first point');

    assert.strictEqual(series2.getPointsByArg('B')[1].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument B, second point');
    assert.strictEqual(series2.getPointsByArg('B')[1].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument B, second point');

    assert.strictEqual(series2.getPointsByArg('A')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument A, first point');
    assert.strictEqual(series2.getPointsByArg('A')[0].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument A, first point');
});

QUnit.test('Set two series with points with the same arguments. With null points', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points3WithSameArguments() }),
        series2 = createSeries({ points: pointsForStacking.points4WithSameArguments() }),
        series = [series1, series2],
        expectedWidthTwoBars = 32,
        expectedSpacing = 7;

    createSeriesFamily('bar', series, { equalBarWidth: false });

    // first series
    assert.strictEqual(series1.getPointsByArg('A')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument A, first point');
    assert.strictEqual(series1.getPointsByArg('A')[0].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument A, first point');

    assert.strictEqual(series1.getPointsByArg('A')[1].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument A, second point');
    assert.strictEqual(series1.getPointsByArg('A')[1].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument A, second point');

    assert.strictEqual(series1.getPointsByArg('B')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, argument B, first point');
    assert.strictEqual(series1.getPointsByArg('B')[0].coordinatesCorrection.offset, 0 - expectedWidthTwoBars / 2 - expectedSpacing / 2, 'Series 1, argument B, first point');

    // second series
    assert.strictEqual(series2.getPointsByArg('B')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument B, first point');
    assert.strictEqual(series2.getPointsByArg('B')[0].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument B, first point');

    assert.strictEqual(series2.getPointsByArg('B')[1].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument B, second point');
    assert.strictEqual(series2.getPointsByArg('B')[1].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument B, second point');

    assert.strictEqual(series2.getPointsByArg('A')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, argument A, first point');
    assert.strictEqual(series2.getPointsByArg('A')[0].coordinatesCorrection.offset, ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, argument A, first point');
});

QUnit.test('Set two series, first series is invisible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({ points: points1 }),
        series2 = createSeries({ points: points2 }),
        series = [series1, series2];
    series1.isVisible = function() {
        return false;
    };
    createSeriesFamily('bar', series, { equalBarWidth: true });

    assert.ok(!points1[0].correctCoordinates.called);
    assert.ok(points2[0].correctCoordinates.called);
});

QUnit.test('Set one series with datetime argument', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1DateArgument() }),
        expectedWidthOneBar = 70;

    createSeriesFamily('bar', [series1], { equalBarWidth: false });

    assert.strictEqual(series1.getPointsByArg(new Date(0))[0].coordinatesCorrection.width, expectedWidthOneBar);
});

QUnit.test('Set two series with datetime argument', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1DateArgument() }),
        series2 = createSeries({ points: pointsForStacking.points1DateArgument() }),
        series = [series1, series2],
        expectedWidthTwoBars = 32;

    createSeriesFamily('bar', series, { equalBarWidth: false });

    assert.strictEqual(series1.getPointsByArg(new Date(0))[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1');
    assert.strictEqual(series2.getPointsByArg(new Date(0))[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2');
});

QUnit.test('Set two series with zero values', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1FirstGoodAndSecondZero() }),
        series2 = createSeries({ points: pointsForStacking.points2FirstAndSecondOnly() }),
        series = [series1, series2],
        expectedWidthTwoBars = 32,
        expectedSpacing = 7;

    createSeriesFamily('bar', series, { equalBarWidth: false });

    // first argument - both bars exists
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, point 1 - both bars exist');
    assert.strictEqual(series1.getPointsByArg('First')[0].coordinatesCorrection.offset,
        0 - expectedWidthTwoBars / 2 - expectedSpacing / 2,
        'Series 1, point 1 - both bars exist');
    assert.strictEqual(series2.getPointsByArg('First')[0].coordinatesCorrection.offset,
        ZERO + expectedWidthTwoBars / 2 + expectedSpacing / 2,
        'Series 2, point 1 - both bars exist');

    // first argument - both bars exists
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.width, expectedWidthTwoBars, 'Series 2, point 2 - single bar exists');
    assert.strictEqual(series2.getPointsByArg('Second')[0].coordinatesCorrection.offset, expectedWidthTwoBars / 2 + expectedSpacing / 2, 'Series 2, point 2 - single bar exists');
});

QUnit.test('null values. ignoreEmptyPoints for all series is true and equalBarWidth is true - bars have different width', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.barWidthPoints1(), ignoreEmptyPoints: true }),
        series2 = createSeries({ points: pointsForStacking.barWidthPoints2(), ignoreEmptyPoints: true }),
        series3 = createSeries({ points: pointsForStacking.barWidthPoints3(), ignoreEmptyPoints: true }),
        series = [series1, series2, series3],
        series1Points,
        series2Points,
        series3Points;

    createSeriesFamily('bar', series, { equalBarWidth: true });

    series1Points = series1.getPoints();
    series2Points = series2.getPoints();
    series3Points = series3.getPoints();

    assert.deepEqual(series1Points[0].coordinatesCorrection, { width: 20, offset: -25 }, 'Width and offset, Series 1, point 1');
    assert.ok(!series1Points[1].coordinatesCorrection, 'Width and offset, Series 1, point 2');
    assert.deepEqual(series1Points[2].coordinatesCorrection, { width: 32, offset: -19.5 }, 'Width and offset, Series 1, point 3');

    assert.deepEqual(series2Points[0].coordinatesCorrection, { width: 20, offset: 0 }, 'Width and offset, Series 2, point 1');
    assert.ok(!series2Points[1].coordinatesCorrection, 'Width and offset, Series 2, point 2');
    assert.ok(!series2Points[2].coordinatesCorrection, 'Width and offset, Series 2, point 3');

    assert.deepEqual(series3Points[0].coordinatesCorrection, { width: 20, offset: 25 }, 'Width and offset, Series 3, point 1');
    assert.deepEqual(series3Points[1].coordinatesCorrection, { width: 70, offset: 0 }, 'Width and offset, Series 3, point 2');
    assert.deepEqual(series3Points[2].coordinatesCorrection, { width: 32, offset: 19.5 }, 'Width and offset, Series 3, point 3');
});

QUnit.test('null values. ignoreEmptyPoints is set for the second series - null value from the first series is displayed and have width', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.barWidthPoints1() }),
        series2 = createSeries({ points: pointsForStacking.barWidthPoints2(), ignoreEmptyPoints: true }),
        series3 = createSeries({ points: pointsForStacking.barWidthPoints3() }),
        series = [series1, series2, series3],
        series1Points,
        series2Points,
        series3Points;

    createSeriesFamily('bar', series, { equalBarWidth: true });

    series1Points = series1.getPoints();
    series2Points = series2.getPoints();
    series3Points = series3.getPoints();

    assert.deepEqual(series1Points[0].coordinatesCorrection, { width: 20, offset: -25 }, 'Width and offset, Series 1, point 1');
    assert.deepEqual(series1Points[1].coordinatesCorrection, { width: 32, offset: -19.5 }, 'Width and offset, Series 1, point 2');
    assert.deepEqual(series1Points[2].coordinatesCorrection, { width: 32, offset: -19.5 }, 'Width and offset, Series 1, point 3');

    assert.deepEqual(series2Points[0].coordinatesCorrection, { width: 20, offset: 0 }, 'Width and offset, Series 2, point 1');
    assert.ok(!series2Points[1].coordinatesCorrection, 'Width and offset, Series 2, point 2');
    assert.ok(!series2Points[2].coordinatesCorrection, 'Width and offset, Series 2, point 3');

    assert.deepEqual(series3Points[0].coordinatesCorrection, { width: 20, offset: 25 }, 'Width and offset, Series 3, point 1');
    assert.deepEqual(series3Points[1].coordinatesCorrection, { width: 32, offset: 19.5 }, 'Width and offset, Series 3, point 2');
    assert.deepEqual(series3Points[2].coordinatesCorrection, { width: 32, offset: 19.5 }, 'Width and offset, Series 3, point 3');
});

QUnit.module('Bar series - custom min size');

QUnit.test('Set three series', function(assert) {
    var points1 = pointsForStacking.minHeightPoints5(),
        points2 = pointsForStacking.minHeightPoints6(),
        points3 = pointsForStacking.minHeightPoints7(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('bar', series);

    checkStackedPointHeight(assert, family.series[0], 10, -10, -10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 10, -10, -10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[2], -10, 10, 10, 0, 0, 0);
});

QUnit.test('Set three series, zero values', function(assert) {
    var points1 = pointsForStacking.minHeightPoints5(),
        points2 = pointsForStacking.minHeightPoints4(),
        points3 = pointsForStacking.minHeightPoints7(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('bar', series);

    checkStackedPointHeight(assert, family.series[0], 10, -10, -10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 10, 10, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[2], -10, 10, 10, 0, 0, 0);
});

QUnit.test('Update minBarSize', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints4(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),

        series = [series1, series2],
        family = createSeriesFamily('bar', series);

    series1.getOptions = sinon.stub().returns({ minBarSize: 8 });

    family.updateSeriesValues();

    checkStackedPointHeight(assert, family.series[0], 8, 8, 8, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 10, 10, 10, 0, 0, 0);
});

QUnit.test('Set three series, null values', function(assert) {
    var points1 = pointsForStacking.minHeightPoints8(),
        points2 = pointsForStacking.minHeightPoints9(),
        points3 = pointsForStacking.minHeightPoints10(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('bar', series);

    checkStackedPointHeight(assert, family.series[0], -10, null, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], null, 10, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[2], 10, -10, null, 0, 0, 0);
});

QUnit.test('Set three series - custom min size is not specify ', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    [points1, points2, points3].forEach(points => points.forEach(point => point.series = { type: 'bar' }));

    var family = createSeriesFamily('bar', series);

    checkStackedPointHeight(assert, family.series[0], 5, 6, 7, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 2, 3, 4, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[2], 4, 9, 8, 0, 0, 0);
});

QUnit.test('Set three series. one series in different axis', function(assert) {
    var points1 = pointsForStacking.minHeightPoints5(),
        points2 = pointsForStacking.minHeightPoints6(),
        points3 = pointsForStacking.minHeightPoints7(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10,
            axis: 'axis1'
        }, 'axis1'),
        series2 = createSeries({
            points: points2,
            minBarSize: 10,
            axis: 'axis1'
        }, 'axis1'),
        series3 = createSeries({
            points: points3,
            minBarSize: 10,
            axis: 'axis2'
        }, 'axis2'),
        series = [series1, series2, series3],
        family = createSeriesFamily('bar', series);

    checkStackedPointHeight(assert, family.series[0], 10, -10, -10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 10, -10, -10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[2], -20, 20, 20, 0, 0, 0);
});

QUnit.module('Range Bar series - side-by-side width calculation');

QUnit.test('Set single series', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }),
        expectedWidth = 70;

    createSeriesFamily('rangebar', [series], { equalBarWidth: true });

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series = [series1, series2],
        expectedSpacing = 7,
        expectedWidth = 32;

    createSeriesFamily('rangebar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing / 2);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing / 2);
});

QUnit.test('Set three series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series = [series1, series2, series3],
        expectedSpacing = 5,
        expectedWidth = 20;

    createSeriesFamily('rangebar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set four series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series = [series1, series2, series3, series4],
        expectedSpacing = 4,
        expectedWidth = 15;

    createSeriesFamily('rangebar', series, { equalBarWidth: true });

    // looking from center to border...
    checkSeries(assert, series1, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('rangebar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series. inverted', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;

    createSeriesFamily('rangebar', series, { equalBarWidth: true });

    checkSeries(assert, series5, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series1, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.module('Stacked Bar series - single column. Positive values');

QUnit.test('Set single series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        series1 = createSeries({
            points: points1
        }),
        expectedWidth = 70;

    createSeriesFamily('stackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkStackedPoints(assert, points1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkStackedPoints(assert, points1, points2);

    $.each(points1, function(_, p) {
        assert.ok(p.correctionWasReset);
    });

    $.each(points2, function(_, p) {
        assert.ok(!p.correctionWasReset);
    });
});

QUnit.test('Set two series - matching points. Points with null values', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2();

    points2[2].value = null;

    var series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2],
        family = createSeriesFamily('stackedbar', series, { equalBarWidth: true }),
        expectedWidth = 70;

    family.updateSeriesValues();

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkStackedPoints(assert, points1, points2);

    $.each(points1, function(_, p) {
        assert.ok(p.correctionWasReset);
    });

    $.each(points2, function(_, p) {
        assert.ok(!p.correctionWasReset);
    });
});

QUnit.test('Set two series - matching points. all series are visible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2];

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    assert.ok(points1[0].resetCorrection.calledOnce);
    assert.ok(!points2[0].resetCorrection.calledOnce);
    assert.ok(!points1[0].correctValue.called);
    assert.ok(points2[0].correctValue.calledOnce);
    assert.equal(points2[0].correctValue.lastCall.args[0], 1);
});

QUnit.test('Set two series with invisible series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1(), stack: '0' }),
        series2 = createSeries({ points: pointsForStacking.points2(), stack: '0' }),
        series = [series1, series2];

    series2.isVisible = function() {
        return false;
    };
    var expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    $.each(series2.getPoints(), function(i, point) {
        assert.ok(!point.coordinatesCorrected, 'Point [' + i.toString() + '] has no mark about corrected coordinates');
    });
});

QUnit.test('Set two series with invisible series. different stack', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2(), stack: 'second' }),
        series = [series1, series2];

    series2.isVisible = function() {
        return false;
    };
    var expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    $.each(series2.getPoints(), function(i, point) {
        assert.ok(!point.coordinatesCorrected, 'Point [' + i.toString() + '] has no mark about corrected coordinates');
    });
});

QUnit.test('Set two series - matching points. first series is invisible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2];
    series1.isVisible = function() {
        return false;
    };

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    assert.ok(!points1[0].resetCorrection.called);
    assert.ok(points2[0].resetCorrection.calledOnce);
    assert.ok(!points1[0].correctValue.called);
    assert.ok(!points2[0].correctValue.called);
});

QUnit.test('Set two series - matching points. second series is invisible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2];
    series2.isVisible = function() {
        return false;
    };

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    assert.ok(points1[0].resetCorrection.calledOnce);
    assert.ok(!points2[0].resetCorrection.calledOnce);
    assert.ok(!points1[0].correctValue.called);
    assert.ok(!points2[0].correctValue.called);
});

QUnit.test('Set three series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series3 = createSeries({
            points: points3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);
    checkStackedPoints(assert, points1, points2, points3);
});

QUnit.test('Set three series - set percent values', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series3 = createSeries({
            points: points3,
            stack: '0'
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedbar', series);

    checkPercentValue(assert, series1.getPoints()[0], 60);
    checkPercentValue(assert, series1.getPoints()[1], 63);
    checkPercentValue(assert, series1.getPoints()[2], 66);

    checkPercentValue(assert, series2.getPoints()[0], 60);
    checkPercentValue(assert, series2.getPoints()[1], 63);
    checkPercentValue(assert, series2.getPoints()[2], 66);

    checkPercentValue(assert, series3.getPoints()[0], 60);
    checkPercentValue(assert, series3.getPoints()[1], 63);
    checkPercentValue(assert, series3.getPoints()[2], 66);
});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, points1, points2);
    checkStackedPoints(assert, points3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        points4 = pointsForStacking.points4(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: points4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkStackedPoints(assert, points1, points3);
    checkStackedPoints(assert, points2, points4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, points1);
    checkStackedPoints(assert, points2);
    checkStackedPoints(assert, points3);
});

QUnit.test('Set three series - custom min size', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('stackedbar', series);

    checkStackedPointHeight(assert, family.series[0], 10, 10, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 20, 20, 20, 10, 10, 10);
    checkStackedPointHeight(assert, family.series[2], 30, 30, 30, 20, 20, 20);
});

QUnit.test('Set three series - custom min size. One series in different axis', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10,
            axis: 'axis1'
        }, 'axis1'),
        series2 = createSeries({
            points: points2,
            minBarSize: 10,
            axis: 'axis1'
        }, 'axis1'),
        series3 = createSeries({
            points: points3,
            minBarSize: 10,
            axis: 'axis2'
        }, 'axis2'),
        series = [series1, series2, series3],
        family = createSeriesFamily('stackedbar', series);

    checkStackedPointHeight(assert, family.series[0], 10, 10, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 20, 20, 20, 10, 10, 10);
    checkStackedPointHeight(assert, family.series[2], 40, 40, 40, 20, 20, 20);
});

QUnit.test('Set three series - custom min size, zero values', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints4(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('stackedbar', series);

    checkStackedPointHeight(assert, family.series[0], 10, 10, 10, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 20, 20, 20, 10, 10, 10);
    checkStackedPointHeight(assert, family.series[2], 30, 30, 30, 20, 20, 20);
});

QUnit.test('Update minBarSize', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints4(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),

        series = [series1, series2],
        family = createSeriesFamily('stackedbar', series);

    series1.getOptions = sinon.stub().returns({ minBarSize: 8 });

    family.updateSeriesValues();

    checkStackedPointHeight(assert, family.series[0], 8, 8, 8, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 18, 18, 18, 8, 8, 8);
});

QUnit.test('Set three series - custom min size is not specify', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('stackedbar', series);

    checkStackedPointHeight(assert, family.series[0], 5, 6, 7, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 7, 9, 11, 5, 6, 7);
    checkStackedPointHeight(assert, family.series[2], 11, 18, 19, 7, 9, 11);
});

QUnit.test('Set single series date argument - matching points', function(assert) {
    var points1 = pointsForStacking.points1DateArgument(),
        series1 = createSeries({
            points: points1
        }),
        expectedWidth = 70;

    createSeriesFamily('stackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkStackedPoints(assert, points1);
});

QUnit.test('Set three series - 2 groups. inverted', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;
    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series1, expectedWidth, expectedOffset);
    checkStackedPoints(assert, points1, points2);
    checkStackedPoints(assert, points3);
});

QUnit.test('Set three series. inverted', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series1, expectedWidth, expectedOffset);
    checkStackedPoints(assert, points1);
    checkStackedPoints(assert, points2);
    checkStackedPoints(assert, points3);
});

QUnit.test('Set three series - datetime value', function(assert) {
    var points1 = pointsForStacking.points1DateValue(),
        points2 = pointsForStacking.points2DateValue(),
        points3 = pointsForStacking.points3DateValue(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series3 = createSeries({
            points: points3,
            stack: '0'
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkStackedPoints(assert, points1, points2, points3);
});

QUnit.module('Stacked Bar series - single column. Negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        series1 = createSeries({
            points: negativePoints1
        }),
        expectedWidth = 70;

    createSeriesFamily('stackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkStackedPoints(assert, negativePoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        series1 = createSeries({
            points: negativePoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkStackedPoints(assert, negativePoints1, negativePoints2);
});

QUnit.test('Set three series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: '0'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);
    checkStackedPoints(assert, negativePoints1, negativePoints2, negativePoints3);
});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, negativePoints1, negativePoints2);
    checkStackedPoints(assert, negativePoints3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        negativePoints4 = pointsForStacking.negativePoints4(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: negativePoints4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkStackedPoints(assert, negativePoints1, negativePoints3);
    checkStackedPoints(assert, negativePoints2, negativePoints4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, negativePoints1);
    checkStackedPoints(assert, negativePoints2);
    checkStackedPoints(assert, negativePoints3);
});

QUnit.module('Stacked Bar series - single column. Positive and negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        expectedWidth = 70;

    createSeriesFamily('stackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);

    checkStackedPoints(assert, mixedPoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkStackedPoints(assert, mixedPoints1, mixedPoints2);

});

QUnit.test('Set three series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: '0'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('stackedbar', series, { equalBarWidth: true }),
        expectedWidth = 70;

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);

    checkStackedPointHeight(assert, family.series[0], -10, 20, -30, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 20, -40, -90, 0, 0, -30);
    checkStackedPointHeight(assert, family.series[2], -40, 80, -180, -10, 20, -90);


});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, mixedPoints1, mixedPoints2);
    checkStackedPoints(assert, mixedPoints3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        mixedPoints4 = pointsForStacking.mixedPoints4(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: mixedPoints4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkStackedPoints(assert, mixedPoints1, mixedPoints3);
    checkStackedPoints(assert, mixedPoints2, mixedPoints4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints3(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('stackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkStackedPoints(assert, mixedPoints1);
    checkStackedPoints(assert, mixedPoints2);
    checkStackedPoints(assert, mixedPoints3);
});

QUnit.module('Full Stacked Bar series. Positive values');

QUnit.test('Set single series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        series1 = createSeries({
            points: points1
        }),
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkFullStackedPoints(assert, points1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkFullStackedPoints(assert, points1, points2);

});

QUnit.test('Set three series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: '0'
        }),
        series2 = createSeries({
            points: points2,
            stack: '0'
        }),
        series3 = createSeries({
            points: points3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);
    checkFullStackedPoints(assert, points1, points2, points3);
});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, points1, points2);
    checkFullStackedPoints(assert, points3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        points4 = pointsForStacking.points4(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: points4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, points1, points3);
    checkFullStackedPoints(assert, points2, points4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, points1);
    checkFullStackedPoints(assert, points2);
    checkFullStackedPoints(assert, points3);
});

QUnit.test('Set single series date argument- matching points', function(assert) {
    var points1 = pointsForStacking.points1DateArgument(),
        series1 = createSeries({
            points: points1
        }),
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkFullStackedPoints(assert, points1);
});

QUnit.test('Set three series - custom min size', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('fullstackedbar', series),
        expectedValue1 = 10 / 30,
        expectedValue2 = 20 / 30;

    checkStackedPointHeight(assert, family.series[0], expectedValue1, expectedValue1, expectedValue1, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], expectedValue2, expectedValue2, expectedValue2, expectedValue1, expectedValue1, expectedValue1);
    checkStackedPointHeight(assert, family.series[2], 1, 1, 1, expectedValue2, expectedValue2, expectedValue2);
});

QUnit.test('Set three series - custom min size, zero values', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints4(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('fullstackedbar', series),
        expectedValue1 = 10 / 30;

    checkStackedPointHeight(assert, family.series[0], expectedValue1, expectedValue1, expectedValue1, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 2 * expectedValue1, 2 * expectedValue1, 2 * expectedValue1, expectedValue1, expectedValue1, expectedValue1);
    checkStackedPointHeight(assert, family.series[2], 1, 1, 1, 2 * expectedValue1, 2 * expectedValue1, 2 * expectedValue1);
});

QUnit.test('Set three series - custom min size, zero values', function(assert) {
    var points1 = pointsForStacking.minHeightPoints9(),
        points2 = pointsForStacking.minHeightPoints11(),
        points3 = pointsForStacking.minHeightPoints12(),
        series1 = createSeries({
            points: points1,
            minBarSize: 10
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 10
        }),
        series3 = createSeries({
            points: points3,
            minBarSize: 10
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('fullstackedbar', series);

    checkStackedPointHeight(assert, family.series[0], 0, 0.5, 0.5, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 0.5, 0, 1, 0, 0, 0.5);
    checkStackedPointHeight(assert, family.series[2], 1, 1, 0, 0.5, 0.5, 0);
});

QUnit.test('Update minBarSize', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints4(),
        series1 = createSeries({
            points: points1,
            minBarSize: 30
        }),
        series2 = createSeries({
            points: points2,
            minBarSize: 1
        }),

        series = [series1, series2],
        family = createSeriesFamily('fullstackedbar', series);

    series1.getOptions = sinon.stub().returns({ minBarSize: 1 });
    family.updateSeriesValues();

    checkStackedPointHeight(assert, family.series[0], 0.5, 0.5, 0.5, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 1, 1, 1, 0.5, 0.5, 0.5);
});

QUnit.test('Set three series - custom min size is not specify', function(assert) {
    var points1 = pointsForStacking.minHeightPoints1(),
        points2 = pointsForStacking.minHeightPoints2(),
        points3 = pointsForStacking.minHeightPoints3(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('fullstackedbar', series),
        val1 = 5 / 11,
        val2 = 6 / 18,
        val3 = 7 / 19,
        val4 = 7 / 11,
        val5 = 9 / 18,
        val6 = 11 / 19;

    checkStackedPointHeight(assert, family.series[0], val1, val2, val3, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], val4, val5, val6, val1, val2, val3);
    checkStackedPointHeight(assert, family.series[2], 1, 1, 1, val4, val5, val6);
});

QUnit.test('Set three series. inverted', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: points2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: points3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series1, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, points1, points2);
    checkFullStackedPoints(assert, points3);
});

QUnit.module('Full Stacked Bar series. Negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        series1 = createSeries({
            points: negativePoints1
        }),
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkFullStackedPoints(assert, negativePoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        series1 = createSeries({
            points: negativePoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkFullStackedPoints(assert, negativePoints1, negativePoints2);

});

QUnit.test('Set three series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: '0'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);
    checkFullStackedPoints(assert, negativePoints1, negativePoints2, negativePoints3);
});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, negativePoints1, negativePoints2);
    checkFullStackedPoints(assert, negativePoints3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        negativePoints4 = pointsForStacking.negativePoints4(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: negativePoints4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, negativePoints1, negativePoints3);
    checkFullStackedPoints(assert, negativePoints2, negativePoints4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: negativePoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: negativePoints3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, negativePoints1);
    checkFullStackedPoints(assert, negativePoints2);
    checkFullStackedPoints(assert, negativePoints2);
});

QUnit.module('Full Stacked Bar series. Positive and negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', [series1], { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkFullStackedPoints(assert, mixedPoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: '0'
        }),
        series = [series1, series2],
        expectedWidth = 70;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);

    checkFullStackedPoints(assert, mixedPoints1, mixedPoints2);

});

QUnit.test('Set three series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        arg1Stack = 10 + 20 + 30,
        arg2Stack = 20 + 40 + 60,
        arg3Stack = 30 + 60 + 90,
        series1 = createSeries({
            points: mixedPoints1,
            stack: '0'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: '0'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: '0'
        }),
        series = [series1, series2, series3],
        family = createSeriesFamily('fullstackedbar', series, { equalBarWidth: true }),
        expectedWidth = 70;

    checkSeries(assert, series1, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, 0);

    checkStackedPointHeight(assert, family.series[0], -10 / arg1Stack, 20 / arg2Stack, -30 / arg3Stack, 0, 0, 0);
    checkStackedPointHeight(assert, family.series[1], 20 / arg1Stack, -40 / arg2Stack, -60 / arg3Stack + mixedPoints1[2].value, 0, 0, mixedPoints1[2].value);
    checkStackedPointHeight(assert, family.series[2], -30 / arg1Stack + mixedPoints1[0].value, 60 / arg2Stack + mixedPoints1[1].value, -90 / arg3Stack + mixedPoints2[2].value, mixedPoints1[0].value, mixedPoints1[1].value, mixedPoints2[2].value);
});

QUnit.test('Set three series in two groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'first'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'second'
        }),
        series = [series1, series2, series3],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, -expectedOffset);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, mixedPoints1, mixedPoints2);
    checkFullStackedPoints(assert, mixedPoints3);
});

QUnit.test('Set four series in two groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        mixedPoints4 = pointsForStacking.mixedPoints4(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'first'
        }),
        series4 = createSeries({
            points: mixedPoints4,
            stack: 'second'
        }),
        series = [series1, series2, series3, series4],
        expectedWidth = 32,
        expectedOffset = 19.5;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, expectedOffset);
    checkSeries(assert, series3, expectedWidth, -expectedOffset);
    checkSeries(assert, series4, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, mixedPoints1, mixedPoints3);
    checkFullStackedPoints(assert, mixedPoints2, mixedPoints4);
});

QUnit.test('Set three series in three groups - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1,
            stack: 'first'
        }),
        series2 = createSeries({
            points: mixedPoints2,
            stack: 'second'
        }),
        series3 = createSeries({
            points: mixedPoints3,
            stack: 'third'
        }),
        series = [series1, series2, series3],
        expectedWidth = 20,
        expectedOffset = 25;

    createSeriesFamily('fullstackedbar', series, { equalBarWidth: true });

    checkSeries(assert, series1, expectedWidth, -expectedOffset);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, expectedOffset);
    checkFullStackedPoints(assert, mixedPoints1);
    checkFullStackedPoints(assert, mixedPoints2);
    checkFullStackedPoints(assert, mixedPoints3);
});

QUnit.test('Pass correct tatal and absTotal values to setPercentValue', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        series2 = createSeries({
            points: mixedPoints2
        });

    mixedPoints1.forEach(function(p) {
        sinon.spy(p, 'setPercentValue');
    });

    createSeriesFamily('fullstackedbar', [series1, series2], { equalBarWidth: true });

    assert.strictEqual(mixedPoints1[0].setPercentValue.lastCall.args[0], 30);
    assert.strictEqual(mixedPoints1[0].setPercentValue.lastCall.args[1], 10);
});

QUnit.module('Bar series common');

QUnit.test('Translator interval is too small - bar width is 1px', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }, undefined, undefined, 2),
        expectedWidth = 1;

    createSeriesFamily('bar', [series], { equalBarWidth: true, barWidth: 0.3 });

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.module('Stacked Area series. Positive values');

QUnit.test('Set single series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        series1 = createSeries({
            points: points1
        });

    createSeriesFamily('stackedarea', [series1], { equalBarWidth: true });

    checkStackedPoints(assert, points1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series = [series1, series2];

    createSeriesFamily('stackedarea', series, { equalBarWidth: true });

    checkStackedPoints(assert, points1, points2);

});

QUnit.test('Set three series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series, { equalBarWidth: true });

    checkStackedPoints(assert, points1, points2, points3);
});

QUnit.test('Set three series. null point in the middle of first series', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3();


    points1[1] = new MockPoint({ argument: 'Second', value: null });

    $.each(points1.concat(points2).concat(points3), function(_, p) {
        p.setHole = sinon.stub();
        p.resetHoles = sinon.stub();
    });

    var series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    assert.strictEqual(points1[0].setHole.callCount, 1, 'point10');
    assert.deepEqual(points1[0].setHole.lastCall.args, [undefined, 'left']);
    assert.ok(points1[1].setHole.callCount, 'point11');
    assert.deepEqual(points1[1].setHole.lastCall.args, [undefined, 'right']);
    assert.ok(points1[2].setHole.calledOnce, 'point12');
    assert.deepEqual(points1[2].setHole.lastCall.args, [undefined, 'right']);

    assert.strictEqual(points2[0].setHole.callCount, 2, 'point20');
    assert.deepEqual(points2[0].setHole.firstCall.args, [undefined, 'left'], 'point20 firstCall');
    assert.deepEqual(points2[0].setHole.secondCall.args, [10, 'right'], 'point20 secondCall');

    assert.strictEqual(points2[1].setHole.callCount, 2, 'point21');
    assert.deepEqual(points2[1].setHole.firstCall.args, [undefined, 'left'], 'point21 firstCall');
    assert.deepEqual(points2[1].setHole.secondCall.args, [undefined, 'right'], 'point21 secondCall');

    assert.strictEqual(points2[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points2[2].setHole.firstCall.args, [12, 'left'], 'point32 firstCall');
    assert.deepEqual(points2[2].setHole.secondCall.args, [undefined, 'right'], 'point32 secondCall');

    assert.strictEqual(points3[0].setHole.callCount, 2, 'point30');
    assert.deepEqual(points3[0].setHole.firstCall.args, [undefined, 'left'], 'point30 firstCall');
    assert.deepEqual(points3[0].setHole.secondCall.args, [10, 'right'], 'point30 secondCall');

    assert.strictEqual(points3[1].setHole.callCount, 2, 'point31');
    assert.deepEqual(points3[1].setHole.firstCall.args, [undefined, 'left'], 'point31 firstCall');
    assert.deepEqual(points3[1].setHole.secondCall.args, [undefined, 'right'], 'point31 secondCall');

    assert.strictEqual(points3[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points3[2].setHole.firstCall.args, [12, 'left'], 'point32 firstCall');
    assert.deepEqual(points3[2].setHole.secondCall.args, [undefined, 'right'], 'point32 secondCall');

    $.each(points1.concat(points2).concat(points3), function(_, p) {
        assert.ok(p.resetHoles.calledOnce, 'resetHoles');
        if(p.setHole.called) {
            assert.ok(p.resetHoles.calledBefore(p.setHole));
        }
    });

});

QUnit.test('Set three series. first point has null value', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3();

    points1[0] = new MockPoint({ argument: 'First', value: null });

    $.each(points1.concat(points2).concat(points3), function(_, p) {
        p.setHole = sinon.stub();
    });

    var series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    assert.strictEqual(points1[0].setHole.callCount, 2, 'point10');
    assert.deepEqual(points1[0].setHole.firstCall.args, [undefined, 'left'], 'point10 firstCall');
    assert.deepEqual(points1[0].setHole.secondCall.args, [undefined, 'right'], 'point10 secondCall');
    assert.strictEqual(points1[1].setHole.callCount, 1, 'point11');
    assert.deepEqual(points1[1].setHole.firstCall.args, [undefined, 'right'], 'point11 firstCall');
    assert.strictEqual(points1[2].setHole.callCount, 2, 'point12');

    assert.deepEqual(points1[2].setHole.firstCall.args, [undefined, 'left'], 'point12 firstCall');
    assert.deepEqual(points1[2].setHole.secondCall.args, [undefined, 'right'], 'point12 secondCall');

    assert.strictEqual(points2[0].setHole.callCount, 2, 'point20');
    assert.deepEqual(points2[0].setHole.firstCall.args, [undefined, 'left'], 'point20 firstCall');
    assert.deepEqual(points2[0].setHole.secondCall.args, [undefined, 'right'], 'point20 secondCall');

    assert.strictEqual(points2[1].setHole.callCount, 2, 'point21');
    assert.deepEqual(points2[1].setHole.firstCall.args, [11, 'left'], 'point21 firstCall');
    assert.deepEqual(points2[1].setHole.secondCall.args, [undefined, 'right'], 'point21 secondCall');

    assert.strictEqual(points2[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points2[2].setHole.firstCall.args, [undefined, 'left'], 'point22 firstCall');
    assert.deepEqual(points2[2].setHole.secondCall.args, [undefined, 'right'], 'point22 secondCall');

    assert.strictEqual(points3[0].setHole.callCount, 2, 'point30');
    assert.deepEqual(points3[0].setHole.firstCall.args, [undefined, 'left'], 'point30 firstCall');
    assert.deepEqual(points3[0].setHole.secondCall.args, [undefined, 'right'], 'point30 secondCall');

    assert.strictEqual(points3[1].setHole.callCount, 2, 'point31');
    assert.deepEqual(points3[1].setHole.firstCall.args, [11, 'left'], 'point31 firstCall');
    assert.deepEqual(points3[1].setHole.secondCall.args, [undefined, 'right'], 'point31 secondCall');

    assert.strictEqual(points3[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points3[2].setHole.firstCall.args, [undefined, 'left'], 'point32 firstCall');
    assert.deepEqual(points3[2].setHole.secondCall.args, [undefined, 'right'], 'point32 secondCall');
});

QUnit.test('Set three series. last point has null value', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3();

    points1[2] = new MockPoint({ argument: 'Third', value: null });

    $.each(points1.concat(points2).concat(points3), function(_, p) {
        p.setHole = sinon.stub();
    });

    var series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    assert.strictEqual(points1[0].setHole.callCount, 2, 'point10');
    assert.deepEqual(points1[0].setHole.firstCall.args, [undefined, 'left'], 'point10 firstCall');
    assert.deepEqual(points1[0].setHole.secondCall.args, [undefined, 'right'], 'point10 secondCall');
    assert.strictEqual(points1[1].setHole.callCount, 1, 'point11');
    assert.deepEqual(points1[1].setHole.firstCall.args, [undefined, 'left'], 'point11 firstCall');
    assert.strictEqual(points1[2].setHole.callCount, 2, 'point12');

    assert.deepEqual(points1[2].setHole.firstCall.args, [undefined, 'left'], 'point12 firstCall');
    assert.deepEqual(points1[2].setHole.secondCall.args, [undefined, 'right'], 'point12 secondCall');

    assert.strictEqual(points2[0].setHole.callCount, 2, 'point20');
    assert.deepEqual(points2[0].setHole.firstCall.args, [undefined, 'left'], 'point20 firstCall');
    assert.deepEqual(points2[0].setHole.secondCall.args, [undefined, 'right'], 'point20 secondCall');

    assert.strictEqual(points2[1].setHole.callCount, 2, 'point21');
    assert.deepEqual(points2[1].setHole.firstCall.args, [undefined, 'left'], 'point21 firstCall');
    assert.deepEqual(points2[1].setHole.secondCall.args, [11, 'right'], 'point21 secondCall');

    assert.strictEqual(points2[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points2[2].setHole.firstCall.args, [undefined, 'left'], 'point22 firstCall');
    assert.deepEqual(points2[2].setHole.secondCall.args, [undefined, 'right'], 'point22 secondCall');

    assert.strictEqual(points3[0].setHole.callCount, 2, 'point30');
    assert.deepEqual(points3[0].setHole.firstCall.args, [undefined, 'left'], 'point30 firstCall');
    assert.deepEqual(points3[0].setHole.secondCall.args, [undefined, 'right'], 'point30 secondCall');

    assert.strictEqual(points3[1].setHole.callCount, 2, 'point31');
    assert.deepEqual(points3[1].setHole.firstCall.args, [undefined, 'left'], 'point31 firstCall');
    assert.deepEqual(points3[1].setHole.secondCall.args, [11, 'right'], 'point31 secondCall');

    assert.strictEqual(points3[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points3[2].setHole.firstCall.args, [undefined, 'left'], 'point32 firstCall');
    assert.deepEqual(points3[2].setHole.secondCall.args, [undefined, 'right'], 'point32 secondCall');
});

QUnit.test('Set three series. null point in the middle of first and second series', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3();

    points1[1] = new MockPoint({ argument: 'Second', value: null });
    points2[1] = new MockPoint({ argument: 'Second', value: null });
    $.each(points1.concat(points2).concat(points3), function(_, p) {
        p.setHole = sinon.stub();
    });

    var series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    assert.strictEqual(points1[0].setHole.callCount, 1, 'point10');
    assert.deepEqual(points1[0].setHole.firstCall.args, [undefined, 'left'], 'point10 firstCall');
    assert.strictEqual(points1[1].setHole.callCount, 2, 'point11');
    assert.deepEqual(points1[1].setHole.firstCall.args, [undefined, 'left'], 'point11 firstCall');
    assert.deepEqual(points1[1].setHole.secondCall.args, [undefined, 'right'], 'point11 secondCall');

    assert.strictEqual(points1[2].setHole.callCount, 1, 'point12');

    assert.deepEqual(points1[2].setHole.firstCall.args, [undefined, 'right'], 'point12 firstCall');

    assert.strictEqual(points2[0].setHole.callCount, 1, 'point20');
    assert.deepEqual(points2[0].setHole.firstCall.args, [undefined, 'left'], 'point20 firstCall');

    assert.strictEqual(points2[1].setHole.callCount, 2, 'point21');
    assert.deepEqual(points2[1].setHole.firstCall.args, [undefined, 'left'], 'point21 firstCall');
    assert.deepEqual(points2[1].setHole.secondCall.args, [undefined, 'right'], 'point21 secondCall');

    assert.strictEqual(points2[2].setHole.callCount, 1, 'point22');
    assert.deepEqual(points2[2].setHole.firstCall.args, [undefined, 'right'], 'point22 firstCall');

    assert.strictEqual(points3[0].setHole.callCount, 2, 'point30');
    assert.deepEqual(points3[0].setHole.firstCall.args, [undefined, 'left'], 'point30 firstCall');
    assert.deepEqual(points3[0].setHole.secondCall.args, [30, 'right'], 'point30 secondCall');

    assert.strictEqual(points3[1].setHole.callCount, 2, 'point31');
    assert.deepEqual(points3[1].setHole.firstCall.args, [undefined, 'left'], 'point31 firstCall');
    assert.deepEqual(points3[1].setHole.secondCall.args, [undefined, 'right'], 'point31 secondCall');

    assert.strictEqual(points3[2].setHole.callCount, 2, 'point32');
    assert.deepEqual(points3[2].setHole.firstCall.args, [34, 'left'], 'point32 firstCall');
    assert.deepEqual(points3[2].setHole.secondCall.args, [undefined, 'right'], 'point32 secondCall');
});

QUnit.module('Stacked Area series. Negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        series1 = createSeries({
            points: negativePoints1
        });

    createSeriesFamily('stackedarea', [series1]);

    checkStackedPoints(assert, negativePoints1);
    assert.strictEqual(series1._prevSeries, undefined);
});

QUnit.test('Set two series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        series1 = createSeries({
            points: negativePoints1
        }),
        series2 = createSeries({
            points: negativePoints2
        }),
        series = [series1, series2];

    createSeriesFamily('stackedarea', series);

    checkStackedPoints(assert, negativePoints1, negativePoints2);
    assert.strictEqual(series1._prevSeries, undefined);
    assert.strictEqual(series2._prevSeries, series1);
});

QUnit.test('Set three series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1
        }),
        series2 = createSeries({
            points: negativePoints2
        }),
        series3 = createSeries({
            points: negativePoints3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    checkStackedPoints(assert, negativePoints1, negativePoints2, negativePoints3);
});

QUnit.module('Stacked Area series. Positive and negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        series1 = createSeries({
            points: mixedPoints1
        });

    createSeriesFamily('stackedarea', [series1]);

    checkStackedPoints(assert, mixedPoints1);
});

QUnit.module('Stacked Area series. misc');

QUnit.test('Set three series in two groups - check prev series links and points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1,
            axis: 'axis1',
            stack: 'axis1_stack'
        }, 'axis1'),
        series2 = createSeries({
            points: negativePoints2,
            axis: 'axis1',
            stack: 'axis1_stack'
        }, 'axis1'),
        series3 = createSeries({
            points: negativePoints3,
            axis: 'axis2',
            stack: 'axis2_stack'
        }, 'axis2'),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    checkStackedPoints(assert, negativePoints1, negativePoints2);
    checkStackedPoints(assert, negativePoints3);
    assert.strictEqual(series1._prevSeries, undefined);
    assert.strictEqual(series2._prevSeries, series1);
    assert.strictEqual(series3._prevSeries, undefined);
});

QUnit.test('Set two series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        series2 = createSeries({
            points: mixedPoints2
        }),
        series = [series1, series2];

    createSeriesFamily('stackedarea', series);

    checkStackedPoints(assert, mixedPoints1, mixedPoints2);
});

QUnit.test('Mixed series with negative and positive values', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.negativePoints1(),
        points3 = pointsForStacking.points2(),
        points4 = pointsForStacking.negativePoints2();

    points1[0].initialValue = 0;
    points1[1].initialValue = undefined;

    points2[0].initialValue = null;
    points2[1].initialValue = 0;

    var series1 = createSeries({
            points: points1,
        }),
        series2 = createSeries({
            points: points2,
        }),
        series3 = createSeries({
            points: points3,
        }),
        series4 = createSeries({
            points: points4,
        }),
        series = [series1, series2, series3, series4];

    createSeriesFamily('fullstackedarea', series);

    assert.strictEqual(series1._prevSeries, undefined);
    assert.strictEqual(series2._prevSeries, undefined);
    assert.strictEqual(series3._prevSeries, series1);
    assert.strictEqual(series4._prevSeries, series2);
});

QUnit.test('Set three series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        series2 = createSeries({
            points: mixedPoints2
        }),
        series3 = createSeries({
            points: mixedPoints3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('stackedarea', series);

    checkStackedPoints(assert, mixedPoints1, mixedPoints2, mixedPoints3);
});

QUnit.module('Full Stacked Area series. Positive values');

QUnit.test('Set single series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        series1 = createSeries({
            points: points1
        });

    createSeriesFamily('fullstackedarea', [series1]);

    checkFullStackedPoints(assert, points1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series = [series1, series2];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, points1, points2);
});

QUnit.test('Set three series - matching points', function(assert) {
    var points1 = pointsForStacking.points1(),
        points2 = pointsForStacking.points2(),
        points3 = pointsForStacking.points3(),
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series3 = createSeries({
            points: points3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, points1, points2, points3);
});

QUnit.module('Full Stacked Area series. Negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        series1 = createSeries({
            points: negativePoints1
        });

    createSeriesFamily('fullstackedarea', [series1]);

    checkFullStackedPoints(assert, negativePoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        series1 = createSeries({
            points: negativePoints1
        }),
        series2 = createSeries({
            points: negativePoints2
        }),
        series = [series1, series2];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, negativePoints1, negativePoints2);
});

QUnit.test('Set three series - matching points', function(assert) {
    var negativePoints1 = pointsForStacking.negativePoints1(),
        negativePoints2 = pointsForStacking.negativePoints2(),
        negativePoints3 = pointsForStacking.negativePoints3(),
        series1 = createSeries({
            points: negativePoints1
        }),
        series2 = createSeries({
            points: negativePoints2
        }),
        series3 = createSeries({
            points: negativePoints3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, negativePoints1, negativePoints2, negativePoints3);
});

QUnit.module('Full Stacked Area series. Positive and negative values');

QUnit.test('Set single series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        series1 = createSeries({
            points: mixedPoints1
        });

    createSeriesFamily('fullstackedarea', [series1]);

    checkFullStackedPoints(assert, mixedPoints1);
});

QUnit.test('Set two series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        series2 = createSeries({
            points: mixedPoints2
        }),
        series = [series1, series2];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, mixedPoints1, mixedPoints2);
});

QUnit.test('Set three series - matching points', function(assert) {
    var mixedPoints1 = pointsForStacking.mixedPoints1(),
        mixedPoints2 = pointsForStacking.mixedPoints2(),
        mixedPoints3 = pointsForStacking.mixedPoints3(),
        series1 = createSeries({
            points: mixedPoints1
        }),
        series2 = createSeries({
            points: mixedPoints2
        }),
        series3 = createSeries({
            points: mixedPoints3
        }),
        series = [series1, series2, series3];

    createSeriesFamily('fullstackedarea', series);

    checkFullStackedPoints(assert, mixedPoints1, mixedPoints2, mixedPoints3);
});


QUnit.module('Stacked series. Negatives as zeroes');

QUnit.test('When negativesAsZeroes true - all negative values treated as zeroes', function(assert) {
    function createPoint(arg, val) {
        var p = new vizMocks.Point();
        p.argument = arg;
        p.initialValue = val;
        return p;
    }

    var points1 = [createPoint(1, -10), createPoint(2, 20), createPoint(3, -30)],
        points2 = [createPoint(1, 20), createPoint(2, 40), createPoint(3, -60)],
        points3 = [createPoint(1, -30), createPoint(2, -60), createPoint(3, -90)],
        series = [createSeries({ points: points1 }),
            createSeries({ points: points2 }),
            createSeries({ points: points3 })];

    createSeriesFamily('stackedarea', series, { negativesAsZeroes: true });

    assert.equal(points1[0].resetCorrection.called, true);
    assert.equal(points1[0].resetValue.called, true);
    assert.equal(points1[1].resetCorrection.called, true);
    assert.equal(points1[1].stub('resetValue').called, false);
    assert.equal(points1[2].resetCorrection.called, true);
    assert.equal(points1[2].resetValue.called, true);

    assert.equal(points2[0].resetCorrection.called, true);
    assert.equal(points2[0].stub('resetValue').called, false);
    assert.deepEqual(points2[1].correctValue.lastCall.args, [20]);
    assert.equal(points2[1].stub('resetCorrection').called, false);
    assert.equal(points2[1].stub('resetValue').called, false);
    assert.equal(points2[2].resetCorrection.called, true);
    assert.equal(points2[2].resetValue.called, true);

    assert.deepEqual(points3[0].correctValue.lastCall.args, [20]);
    assert.equal(points3[0].stub('resetCorrection').called, false);
    assert.equal(points3[0].resetValue.called, true);
    assert.deepEqual(points3[1].correctValue.lastCall.args, [60]);
    assert.equal(points3[1].stub('resetCorrection').called, false);
    assert.equal(points3[1].resetValue.called, true);
    assert.equal(points3[2].resetCorrection.called, true);
    assert.equal(points3[2].resetValue.called, true);
});

QUnit.module('Candlestick series - side-by-side width calculation');

QUnit.test('Set single series', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }),
        expectedWidth = 70;

    createSeriesFamily('candlestick', [series]);

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series = [series1, series2],
        expectedSpacing = 7,
        expectedWidth = 32;

    createSeriesFamily('candlestick', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing / 2);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing / 2);
});

QUnit.test('Set two series, first series is invisible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series = [series1, series2];

    series1.isVisible = function() {
        return false;
    };

    createSeriesFamily('candlestick', series, { equalBarWidth: true });

    assert.ok(!points1[0].correctCoordinates.called);
    assert.ok(points2[0].correctCoordinates.called);
});

QUnit.test('Set three series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series = [series1, series2, series3],
        expectedSpacing = 5,
        expectedWidth = 20;

    createSeriesFamily('candlestick', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set four series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series = [series1, series2, series3, series4],
        expectedSpacing = 4,
        expectedWidth = 15;

    createSeriesFamily('candlestick', series);

    // looking from center to border...
    checkSeries(assert, series1, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('candlestick', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series. inverted', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;

    createSeriesFamily('candlestick', series, { });

    checkSeries(assert, series5, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series1, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.module('Stock series - side-by-side width calculation');

QUnit.test('Set single series', function(assert) {
    var series = createSeries({ points: pointsForStacking.points1() }),
        expectedWidth = 70;

    createSeriesFamily('stock', [series]);

    checkSeries(assert, series, expectedWidth, 0);
});

QUnit.test('Set two series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series = [series1, series2],
        expectedSpacing = 7,
        expectedWidth = 32;

    createSeriesFamily('stock', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing / 2);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing / 2);
});

QUnit.test('Set two series, first series is invisible', function(assert) {
    var points1 = [createPoint(1)],
        points2 = [createPoint(2)],
        series1 = createSeries({
            points: points1
        }),
        series2 = createSeries({
            points: points2
        }),
        series = [series1, series2];
    series1.isVisible = function() {
        return false;
    };

    createSeriesFamily('stock', series, { equalBarWidth: true });

    assert.ok(!points1[0].correctCoordinates.called);
    assert.ok(points2[0].correctCoordinates.called);
});

QUnit.test('Set three series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series = [series1, series2, series3],
        expectedSpacing = 5,
        expectedWidth = 20;

    createSeriesFamily('stock', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set four series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series = [series1, series2, series3, series4],
        expectedSpacing = 4,
        expectedWidth = 15;

    createSeriesFamily('stock', series);

    // looking from center to border...
    checkSeries(assert, series1, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedSpacing / 2 - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedSpacing / 2 + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    createSeriesFamily('stock', series);

    checkSeries(assert, series1, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series2, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series4, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series5, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.test('Set five series. inverted', function(assert) {
    var series1 = createSeries({ points: pointsForStacking.points1() }),
        series2 = createSeries({ points: pointsForStacking.points2() }),
        series3 = createSeries({ points: pointsForStacking.points3() }),
        series4 = createSeries({ points: pointsForStacking.points4() }),
        series5 = createSeries({ points: pointsForStacking.points5() }),
        series = [series1, series2, series3, series4, series5],
        expectedSpacing = 3,
        expectedWidth = 12;

    series1.getArgumentAxis().getTranslator().isInverted = () => true;
    createSeriesFamily('stock', series, { });

    checkSeries(assert, series5, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series4, expectedWidth, 0 - expectedWidth / 2 - expectedSpacing - expectedWidth / 2);
    checkSeries(assert, series3, expectedWidth, 0);
    checkSeries(assert, series2, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth / 2);
    checkSeries(assert, series1, expectedWidth, ZERO + expectedWidth / 2 + expectedSpacing + expectedWidth + expectedSpacing + expectedWidth / 2);
});

QUnit.module('Bubble Series');

QUnit.test('Set series', function(assert) {
    var series1 = createSeries({ points: pointsForBubble.points1() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series2 = createSeries({ points: pointsForBubble.points2() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series3 = createSeries({ points: pointsForBubble.points3() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series = [series1, series2, series3];

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 2, maxBubbleSize: 0.1 });

    assert.equal(series1.getPoints()[0].coordinatesCorrection, 10);
    assert.equal(series1.getPoints()[1].coordinatesCorrection, 9);
    assert.equal(series1.getPoints()[2].coordinatesCorrection, 10);

    assert.equal(series2.getPoints()[0].coordinatesCorrection, 7);
    assert.equal(series2.getPoints()[1].coordinatesCorrection, 2);
    assert.equal(series2.getPoints()[2].coordinatesCorrection, 8);

    assert.equal(series3.getPoints()[0].coordinatesCorrection, 6);
    assert.equal(series3.getPoints()[1].coordinatesCorrection, 10);
    assert.equal(series3.getPoints()[2].coordinatesCorrection, 9);
});

QUnit.test('Set series, points size are not much different', function(assert) {
    var series1 = createSeries({ points: pointsForBubble.points4() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series2 = createSeries({ points: pointsForBubble.points5() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series = [series1, series2];

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 2, maxBubbleSize: 0.1 });

    assert.equal(series1.getPoints()[0].coordinatesCorrection, 9);
    assert.equal(series1.getPoints()[1].coordinatesCorrection, 5);
    assert.equal(series1.getPoints()[2].coordinatesCorrection, 7);

    assert.equal(series2.getPoints()[0].coordinatesCorrection, 2);
    assert.equal(series2.getPoints()[1].coordinatesCorrection, 10);
    assert.equal(series2.getPoints()[2].coordinatesCorrection, 9);
});

QUnit.test('Set series, one point', function(assert) {
    var series1 = createSeries({ points: pointsForBubble.points6() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } });

    createSeriesFamily('bubble', [series1], { equalBarWidth: null, minBubbleSize: 2, maxBubbleSize: 0.1 });

    assert.equal(series1.getPoints()[0].coordinatesCorrection, 6);
});

QUnit.test('set minBubbleSize option', function(assert) {
    var series = [createSeries({ points: pointsForBubble.points3() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } })];

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 20, maxBubbleSize: 0.1 });

    assert.ok(series[0].getPoints()[0].coordinatesCorrection >= 20, 'size > minSize');
    assert.ok(series[0].getPoints()[1].coordinatesCorrection >= 20, 'size > minSize');
    assert.ok(series[0].getPoints()[2].coordinatesCorrection >= 20, 'size > minSize');
});

QUnit.test('set maxBubbleSize option', function(assert) {
    var series = [createSeries({ points: pointsForBubble.points3() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } })];

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 5, maxBubbleSize: 0.1 });

    assert.ok(series[0].getPoints()[0].coordinatesCorrection <= 10, 'size < maxSize');
    assert.ok(series[0].getPoints()[1].coordinatesCorrection <= 10, 'size < maxSize');
    assert.ok(series[0].getPoints()[2].coordinatesCorrection <= 10, 'size < maxSize');
});

QUnit.test('maxBubbleSize === minBubbleSize', function(assert) {
    var series = [createSeries({
        points: [
            new MockPoint({ argument: 'First', value: 30, size: 10 }),
            new MockPoint({ argument: 'Second', value: 31, size: 10 }),
            new MockPoint({ argument: 'Third', value: 32, size: 10 })
        ]
    }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } })];

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 6, maxBubbleSize: 0.1 });

    assert.equal(series[0].getPoints()[0].coordinatesCorrection, 8, 'size < maxSize');
    assert.equal(series[0].getPoints()[1].coordinatesCorrection, 8, 'size < maxSize');
    assert.equal(series[0].getPoints()[2].coordinatesCorrection, 8, 'size < maxSize');
});

// T129206
QUnit.test('Set two series with invisible series. Bubble', function(assert) {
    var series1 = createSeries({ points: pointsForBubble.points1() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series2 = createSeries({ points: pointsForBubble.points2() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } }),
        series = [series1, series2];
    series2.isVisible = function() {
        return false;
    };

    createSeriesFamily('bubble', series, { equalBarWidth: null, minBubbleSize: 2, maxBubbleSize: 0.1 });

    assert.equal(series1.getPoints()[0].coordinatesCorrection, 9);
    assert.equal(series1.getPoints()[1].coordinatesCorrection, 2);
    assert.equal(series1.getPoints()[2].coordinatesCorrection, 10);

    $.each(series2.getPoints(), function(i, point) {
        assert.ok(!point.coordinatesCorrected, 'Point [' + i.toString() + '] has no mark about corrected coordinates');
    });
});

QUnit.test('All series are invisible. Bubble', function(assert) {
    var series = createSeries({ points: pointsForBubble.points1() }, undefined, { arg: { min: 0, max: 100 }, val: { min: 10, max: 200 } });

    series.isVisible = function() {
        return false;
    };

    createSeriesFamily('bubble', [series], { equalBarWidth: null, minBubbleSize: 2, maxBubbleSize: 0.1 });

    $.each(series.getPoints(), function(i, point) {
        assert.ok(!point.coordinatesCorrected, 'Point [' + i.toString() + '] has no mark about corrected coordinates');
    });
});

QUnit.module('Life cycle', {
    beforeEach: function() {
        this.options = {
            type: 'stackedbar'
        };
        this.series = [];
    },
    createSeriesFamily: function() {
        var family = new SeriesFamily(this.options);
        family.add(this.series);
        return family;
    }
});

QUnit.test('Creation', function(assert) {
    assert.ok(this.createSeriesFamily());
});

QUnit.test('Disposing', function(assert) {
    var family = this.createSeriesFamily();

    family.dispose();

    assert.equal(family.series, null);
});
