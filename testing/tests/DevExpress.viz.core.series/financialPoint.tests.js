import vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import { MockTranslator, MockSeries } from '../../helpers/chartMocks.js';
import tooltipModule from 'viz/core/tooltip';

const originalLabel = labelModule.Label;

const createPoint = function(series, data, options) {
    options = options || {};
    options.type = options.type || 'stock';
    return new pointModule.Point(series, data, options);
};

QUnit.module('Point coordinates translation. Financial', {
    beforeEach: function() {
        const that = this;
        this.series = new MockSeries({
            valueAxis: { getTranslator: function() { return that.translators.val; } },
            argumentAxis: { getTranslator: function() { return that.translators.arg; } }
        });
        this.series.getVisibleArea = sinon.stub().returns({ minX: 0, maxX: 200, minY: 0, maxY: 210 });

        this.opt = {
            widgetType: 'chart',
            type: 'stock',
            reduction: {
            },
            styles: {
                normal: {
                    'stroke-width': 2
                },
                reduction: {
                    normal: {
                        'stroke-width': 2
                    }
                },
                positive: {
                    normal: {
                        'stroke-width': 2
                    }
                },
                reductionPositive: {
                    normal: {
                        'stroke-width': 2
                    }
                }

            },
            label: {
                visible: false
            }
        };

    },
    translateXData: { 1: 110, 2: 220, 3: 330, 4: 440, 5: 550 },
    translateYData: { 1: 111, 2: 222, 3: 333, 4: 444, 5: 555 },
    setTranslators: function() {
        const xTranslator = new MockTranslator({
            translate: this.translateXData,
            failOnWrongData: true
        });
        const yTranslator = new MockTranslator({
            translate: this.translateYData,
            failOnWrongData: true
        });

        this.translators = this.opt.rotated ? {
            arg: yTranslator,
            val: xTranslator
        } : {
            arg: xTranslator,
            val: yTranslator
        };
    }
});

QUnit.test('Translation', function(assert) {
    this.setTranslators();
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();

    assert.equal(point.x, 110);
    assert.equal(point.openY, 333);
    assert.equal(point.closeY, 222);
    assert.equal(point.highY, 444);
    assert.equal(point.lowY, 111);
});

QUnit.test('hasCoords returns true if point has x, lowY, highY', function(assert) {
    this.setTranslators();

    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();

    assert.ok(point.hasCoords());
});

QUnit.test('hasCoords returns false if point does not have x', function(assert) {
    this.setTranslators();
    this.translators.arg = new MockTranslator({
        translate: { 1: null }
    });
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();
    assert.ok(!point.hasCoords());
});

QUnit.test('hasCoords returns false if point does not have lowY', function(assert) {
    this.setTranslators();
    this.translators.val = new MockTranslator({
        translate: { 1: null, 2: 2, 3: 3, 4: 4 }
    });
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();
    assert.ok(!point.hasCoords());
});

QUnit.test('hasCoords returns false if point does not have highY', function(assert) {
    this.setTranslators();
    this.translators.val = new MockTranslator({
        translate: { 1: 1, 2: 2, 3: 3, 4: null }
    });
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();
    assert.ok(!point.hasCoords());
});

QUnit.test('hasCoords returns true if point does not have closeY or openY', function(assert) {
    this.setTranslators();
    this.translators.val = new MockTranslator({
        translate: { 1: 1, 2: null, 3: null, 4: 4 }
    });
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();
    assert.ok(point.hasCoords());
});

QUnit.test('getCrosshairData', function(assert) {
    this.series.axis = 'valueAxisName';
    this.setTranslators();
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();

    assert.equal(point.x, 110);
    assert.equal(point.openY, 333);
    assert.equal(point.closeY, 222);
    assert.equal(point.highY, 444);
    assert.equal(point.lowY, 111);

    assert.deepEqual(point.getCrosshairData(100, 100), { x: 110, y: 111, xValue: 1, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 180), { x: 110, y: 222, xValue: 1, yValue: 2, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 250), { x: 110, y: 222, xValue: 1, yValue: 2, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 300), { x: 110, y: 333, xValue: 1, yValue: 3, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 370), { x: 110, y: 333, xValue: 1, yValue: 3, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 400), { x: 110, y: 444, xValue: 1, yValue: 4, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(100, 900), { x: 110, y: 444, xValue: 1, yValue: 4, axis: 'valueAxisName' });
});

QUnit.test('getCrosshairData. Rotate', function(assert) {
    this.opt.rotated = true;
    this.series.axis = 'valueAxisName';
    this.setTranslators();
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1 }, this.opt);

    point.translate();

    assert.equal(point.x, 111);
    assert.equal(point.openY, 330);
    assert.equal(point.closeY, 220);
    assert.equal(point.highY, 440);
    assert.equal(point.lowY, 110);

    assert.deepEqual(point.getCrosshairData(100, 100), { x: 110, y: 111, xValue: 1, yValue: 1, axis: 'valueAxisName' }, '1');
    assert.deepEqual(point.getCrosshairData(180, 100), { x: 220, y: 111, xValue: 2, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(250, 100), { x: 220, y: 111, xValue: 2, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(300, 100), { x: 330, y: 111, xValue: 3, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(370, 100), { x: 330, y: 111, xValue: 3, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(400, 100), { x: 440, y: 111, xValue: 4, yValue: 1, axis: 'valueAxisName' });
    assert.deepEqual(point.getCrosshairData(900, 100), { x: 440, y: 111, xValue: 4, yValue: 1, axis: 'valueAxisName' });
});

QUnit.module('Point coordinates correction. Candlestick', {
    beforeEach: function() {
        this.point = createPoint(
            {
                name: 'series',
                isFullStackedSeries: function() { return false; },
                getLabelVisibility: function() { return false; }
            },
            { argument: 5, openValue: 33, closeValue: 22, highValue: 44, lowValue: 11 },
            {
                widgetType: 'chart',
                reduction: {
                },
                styles: {
                    normal: {
                        'stroke-width': 2
                    },
                    reduction: {
                        normal: {
                            'stroke-width': 2
                        }
                    },
                    positive: {
                        normal: {
                            'stroke-width': 2
                        }
                    },
                    reductionPositive: {
                        normal: {
                            'stroke-width': 2
                        }
                    }

                },
                type: 'candlestick',
                label: { visible: false }
            }
        );

        this.point._options.rotated = false;
        this.point.x = 50;
        this.point._options.attributes = { lineWidth: 2 };
    }
});

QUnit.test('Odd width', function(assert) {
    const correction = {
        offset: -10,
        width: 19
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, -10);
});

QUnit.test('Negative offset', function(assert) {
    const correction = {
        offset: -10,
        width: 20
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, -10);
});

QUnit.test('Positive offset', function(assert) {
    const correction = {
        offset: 10,
        width: 8
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 8);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.test('Width more than max width', function(assert) {
    const correction = {
        offset: 10,
        width: 20
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.test('Width less than min width', function(assert) {
    const correction = {
        offset: 10,
        width: 2
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 6);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.module('Point coordinates correction. Stock', {
    beforeEach: function() {
        this.point = createPoint(
            {
                name: 'series',
                isFullStackedSeries: function() { return false; },
                getLabelVisibility: function() { return false; }
            },
            { argument: 5, openValue: 33, closeValue: 22, highValue: 44, lowValue: 11 },
            {
                widgetType: 'chart',
                reduction: {
                },
                styles: {
                    normal: {
                        'stroke-width': 3
                    },
                    reduction: {
                        normal: {
                            'stroke-width': 2
                        }
                    },
                    positive: {
                        normal: {
                            'stroke-width': 2
                        }
                    },
                    reductionPositive: {
                        normal: {
                            'stroke-width': 2
                        }
                    }

                },
                type: 'stock',
                label: { visible: false }
            }
        );
        this.point._options.rotated = false;
        this.point.x = 50;
    }
});

QUnit.test('Odd width', function(assert) {
    const correction = {
        offset: -10,
        width: 19
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, -10);
});

QUnit.test('Negative offset', function(assert) {
    const correction = {
        offset: -10,
        width: 20
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, -10);
});

QUnit.test('Positive offset', function(assert) {
    const correction = {
        offset: 10,
        width: 8
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 8);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.test('Width more than max width', function(assert) {
    const correction = {
        offset: 10,
        width: 20
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 10);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.test('Width less than min width', function(assert) {
    const correction = {
        offset: 10,
        width: 2
    };

    this.point.correctCoordinates(correction);

    assert.equal(this.point.width, 6);
    assert.equal(this.point.xCorrection, 10);
});

QUnit.module('Has value method', {
    beforeEach: function() {
        this.opt = {
            reduction: {
            },
            widgetType: 'chart',
            label: { visible: false },
            styles: {
                normal: { style: 'normal' },
                hover: { style: 'hover' },
                selection: { style: 'selection' },
                reduction: {
                    normal: { style: { reduction: 'Normal' } }
                },
                positive: {
                    normal: {
                        style: { positive: 'Normal' }
                    }
                },
                reductionPositive: {
                    normal: { reduction: 'PositiveNormal' }
                }
            }
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; }
        };
    }
});

QUnit.test('Positive', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: 1, reductionValue: 3 }, this.opt);
    let result;

    result = point.hasValue();

    assert.strictEqual(result, true);
});

QUnit.test('Negative. OpenValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: null, closeValue: 2, highValue: 4, lowValue: 1, reductionValue: 5 }, this.opt);
    let result;

    result = point.hasValue();

    assert.strictEqual(result, true);
});

QUnit.test('Negative. CloseValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: null, highValue: 4, lowValue: 1, reductionValue: 3 }, this.opt);
    let result;

    result = point.hasValue();

    assert.strictEqual(result, true);
});

QUnit.test('Negative. HighValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: null, lowValue: 1, reductionValue: 3 }, this.opt);
    let result;

    result = point.hasValue();

    assert.strictEqual(result, false);
});

QUnit.test('Negative. LowValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 2, highValue: 4, lowValue: null, reductionValue: 3 }, this.opt);
    let result;

    result = point.hasValue();

    assert.strictEqual(result, false);
});

QUnit.module('Check object in visible area', {
    beforeEach: function() {
        const that = this;
        const translateXData = { 1: -10, 2: 0, 3: 50, 4: 100, 5: 110 };
        const translateYData = { 1: 990, 2: 1000, 3: 1010, 4: 1040, 5: 1050, 6: 1090, 7: 1100, 8: 1110 };

        this.options = {
            widgetType: 'chart',
            reduction: {
            },
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 1000, maxY: 1100 }; }
        };

        this.translators = {
            arg: new MockTranslator({
                translate: translateXData,
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: translateYData,
                failOnWrongData: true
            })
        };

        this.point = createPoint(this.series, { argument: 1, openValue: 1, closeValue: 1, highValue: 1, lowValue: 1 }, this.options);
        this.point.width = 20;
    }
});

QUnit.test('Point is visible inside area', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the left', function(assert) {
    this.point.argument = 1;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the left border', function(assert) {
    this.point.argument = 2;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the right', function(assert) {
    this.point.argument = 5;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the right border', function(assert) {
    this.point.argument = 4;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the top', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 7;
    this.point.highValue = 8;
    this.point.lowValue = 7;
    this.point.closeValue = 8;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the top border', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 6;
    this.point.highValue = 8;
    this.point.lowValue = 6;
    this.point.closeValue = 8;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the bottom', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 1;
    this.point.highValue = 2;
    this.point.lowValue = 1;
    this.point.closeValue = 2;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the bottom border', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 1;
    this.point.highValue = 3;
    this.point.lowValue = 1;
    this.point.closeValue = 3;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.module('Check object in visible area. Rotated.', {
    beforeEach: function() {
        const that = this;
        const translateXData = { 1: -10, 2: 0, 3: 10, 4: 40, 5: 50, 6: 90, 7: 100, 8: 110 };
        const translateYData = { 1: -10, 2: 0, 3: 50, 4: 100, 5: 110 };

        this.options = {
            reduction: {
            },
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 100 }; }
        };

        this.translators = {
            val: new MockTranslator({
                translate: translateXData,
                failOnWrongData: true
            }),
            arg: new MockTranslator({
                translate: translateYData,
                failOnWrongData: true
            })
        };

        this.point = createPoint(this.series, { argument: 1, openValue: 1, closeValue: 1, highValue: 1, lowValue: 1 }, this.options);
        this.point.width = 20;
        this.point._options.rotated = true;
    }
});

QUnit.test('Point is visible inside area', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the left', function(assert) {
    this.point.argument = 1;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the left border', function(assert) {
    this.point.argument = 2;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the right', function(assert) {
    this.point.argument = 5;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the right border', function(assert) {
    this.point.argument = 4;
    this.point.openValue = 4;
    this.point.highValue = 5;
    this.point.lowValue = 4;
    this.point.closeValue = 5;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the top', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 7;
    this.point.highValue = 8;
    this.point.lowValue = 7;
    this.point.closeValue = 8;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the top border', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 6;
    this.point.highValue = 8;
    this.point.lowValue = 6;
    this.point.closeValue = 8;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is invisible on the bottom', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 1;
    this.point.highValue = 2;
    this.point.lowValue = 1;
    this.point.closeValue = 2;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Point is visible on the bottom border', function(assert) {
    this.point.argument = 3;
    this.point.openValue = 1;
    this.point.highValue = 3;
    this.point.lowValue = 1;
    this.point.closeValue = 3;
    this.point.translate();

    const isInVisibleArea = this.point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.module('Draw point. Candlestick', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.group = this.renderer.g();
        this.group.defaultMarkersGroup = this.renderer.g();
        this.group.reductionMarkersGroup = this.renderer.g();
        this.group.defaultPositiveMarkersGroup = this.renderer.g();
        this.group.reductionPositiveMarkersGroup = this.renderer.g();

        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11 },
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: { 1: 50, 2: 33, 3: 10, 4: 5 },
                failOnWrongData: true
            })
        };
        this.options = {
            widgetType: 'chart',
            reduction: { color: 'red' },
            visible: true,
            styles: {
                normal: { style: 'normal' },
                hover: { style: 'hover' },
                selection: { style: 'selection' },
                reduction: {
                    normal: { style: { reduction: 'Normal' } }
                },
                positive: {
                    normal: {
                        style: { positive: 'Normal' }
                    }
                },
                reductionPositive: {
                    normal: { style: { reduction: 'PositiveNormal' } }
                }
            },
            type: 'candlestick',
            label: {
                visible: false
            }
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 100 }; }
        };

        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Marker (openValue < closeValue)', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 10, 16, 10, 16, 33, 11, 33, 11, 50, 11, 33, 6, 33, 6, 10, 11, 10]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker without close value', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: null, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 50, 11, 33, 6, 33, 16, 33, 11, 33]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});
QUnit.test('Marker without open value', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: null, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 50, 11, 10, 6, 10, 16, 10, 11, 10]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker without open&close values', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: null, closeValue: null, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 50]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue < closeValue). Rotated', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point._options.rotated = true;
    point.width = 10;

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [5, 11, 10, 11, 10, 16, 33, 16, 33, 11, 50, 11, 33, 11, 33, 6, 10, 6, 10, 11]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue > closeValue). Rotated', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 4, closeValue: 2, highValue: 4, lowValue: 1 }, this.options);

    point._options.rotated = true;
    point.width = 10;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [5, 11, 5, 11, 5, 16, 33, 16, 33, 11, 50, 11, 33, 11, 33, 6, 5, 6, 5, 11]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue > closeValue)', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 4, closeValue: 2, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 5, 16, 5, 16, 33, 11, 33, 11, 50, 11, 33, 6, 33, 6, 5, 11, 5]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue = closeValue)', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 50, 11, 10, 6, 10, 16, 10, 11, 10]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue = closeValue). Rotated', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point._options.rotated = true;
    point.width = 10;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [5, 11, 50, 11, 10, 11, 10, 6, 10, 16, 10, 11]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker (openValue = closeValue).', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 50, 11, 10, 6, 10, 16, 10, 11, 10]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker, reduction point', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1, isReduction: true }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.reductionMarkersGroup);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, positive point', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, reduction & positive', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1, isReduction: true }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.reductionPositiveMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, default', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
});

QUnit.test('Update marker', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);
    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].fill, 'red');
});

QUnit.test('Update marker group', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    point.translate();
    point.width = 10;

    point._isReduction = true;
    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group.reductionMarkersGroup);
});

QUnit.test('Update marker location', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    point.x = 5;
    point.lowY = 10;
    point.openY = 20;
    point.closeY = 30;
    point.highY = 40;
    point.graphic.stub('attr').reset();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].points, [5, 40, 5, 30, 10, 30, 10, 20, 5, 20, 5, 10, 5, 20, 0, 20, 0, 30, 5, 30]);
    assert.ok(point.graphic.sharp.called);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.stub('attr').firstCall));
});

QUnit.test('Marker without state', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], this.options.styles.normal);
});

QUnit.module('Draw point. Stock', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.group.defaultMarkersGroup = this.renderer.g();
        this.group.reductionMarkersGroup = this.renderer.g();
        this.group.defaultPositiveMarkersGroup = this.renderer.g();
        this.group.reductionPositiveMarkersGroup = this.renderer.g();

        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11 },
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: { 1: 52, 2: 35, 3: 10, 4: 5 },
                failOnWrongData: true
            })
        };
        this.options = {
            widgetType: 'chart',
            reduction: { color: 'black' },
            visible: true,
            styles: {
                normal: { style: 'normal' },
                hover: { style: 'hover' },
                selection: { style: 'selection' },
                reduction: {
                    normal: { style: { reduction: 'Normal' } }
                },
                positive: {
                    normal: {
                        style: { positive: 'Normal' }
                    }
                },
                reductionPositive: {
                    normal: { reduction: 'PositiveNormal' }
                }
            },
            type: 'stock',
            label: {
                visible: false
            }
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 100 }; }
        };

        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Marker', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 35, 6, 35, 11, 35, 11, 10, 16, 10, 11, 10, 11, 52]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'line');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker without openValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: null, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 10, 16, 10, 11, 10, 11, 52]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'line');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker without closeValue', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: null, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [11, 5, 11, 35, 6, 35, 11, 35, 11, 52]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'line');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: 'normal' });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker. Rotated', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point._options.rotated = true;
    point.width = 10;

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], [5, 11, 35, 11, 35, 6, 35, 11, 10, 11, 10, 16, 10, 11, 52, 11]);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'line');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], { 'stroke-linecap': 'square' });
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { style: { positive: 'Normal' } });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Marker, reduction point', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1, isReduction: true }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.reductionMarkersGroup);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, positive point', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultPositiveMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, reduction & positive', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1, isReduction: true }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.reductionPositiveMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultMarkersGroup.children.length, 0);
});

QUnit.test('Marker, default', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group.defaultMarkersGroup);
    assert.equal(this.group.reductionMarkersGroup.children.length, 0);
    assert.equal(this.group.defaultPositiveMarkersGroup.children.length, 0);
    assert.equal(this.group.reductionPositiveMarkersGroup.children.length, 0);
});

QUnit.test('Update marker', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);
    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].fill, 'red');
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group.defaultMarkersGroup);
});

QUnit.test('Update marker location', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, highValue: 4, lowValue: 1 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);

    point.x = 10;
    point.lowY = 20;
    point.openY = 30;
    point.closeY = 40;
    point.highY = 50;
    point.graphic.stub('attr').reset();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].points, [10, 50, 10, 30, 5, 30, 10, 30, 10, 40, 15, 40, 10, 40, 10, 20]);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group.defaultPositiveMarkersGroup);

    assert.ok(point.graphic.sharp.called);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.stub('attr').firstCall));
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        const that = this;
        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11 },
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: { 1: 52, 2: 35, 3: 10, 4: 5 },
                failOnWrongData: true
            })
        };
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.group.defaultMarkersGroup = this.renderer.g();
        this.group.reductionMarkersGroup = this.renderer.g();
        this.group.defaultPositiveMarkersGroup = this.renderer.g();
        this.group.reductionPositiveMarkersGroup = this.renderer.g();
        this.data = {
            argument: 25,
            openValue: 33,
            closeValue: 15,
            highValue: 45,
            lowValue: 10,
            reductionValue: 15,
        };
        this.options = {
            widgetType: 'chart',
            reduction: { color: 'yellow' },
            visible: true,
            seriesName: 'series',
            styles: { normal: {}, selection: {}, hover: {} },
            label: {
                horizontalOffset: 0,
                verticalOffset: 0,
                background: {
                    fill: 'none',
                    'stroke-width': 0,
                    stroke: 'none'
                }
            }
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 10, maxX: 600, minY: 5, maxY: 810 }; }
        };
        const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
            formatValue: function(value, specialFormat) {
                return value || value === 0 ? value + ':' + specialFormat : value || '';
            }
        });
        this.tooltip = new StubTooltip();
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Get tooltip coordinates, highY < lowY. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 43;
    point.lowY = 69;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 44, y: 56, offset: 0 });
});

QUnit.test('Get tooltip coordinates, highY < lowY. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 43;
    point.lowY = 69;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 44, y: 43, offset: 0 });
});

QUnit.test('Get tooltip coordinates, highY > lowY. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 69;
    point.lowY = 43;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 44, y: 56, offset: 0 });
});

QUnit.test('Get tooltip coordinates, highY > lowY. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 69;
    point.lowY = 43;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 44, y: 43, offset: 0 });
});

QUnit.test('Get tooltip coordinates, point is abroad on the top. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = -20;
    point.lowY = 69;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 44, y: 37, offset: 0 });
});

QUnit.test('Get tooltip coordinates, point is abroad on the top. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = -20;
    point.lowY = 69;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 44, y: 5, offset: 0 });
});

QUnit.test('Get tooltip coordinates, point is abroad on the bottom. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 552;
    point.closeY = 558;
    point.highY = 542;
    point.lowY = 820;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 44, y: 676, offset: 0 });
});

QUnit.test('Get tooltip coordinates, point is abroad on the bottom. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 552;
    point.closeY = 558;
    point.highY = 542;
    point.lowY = 820;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 44, y: 542, offset: 0 });
});

QUnit.test('Get tooltip coordinates, rotated, point is abroad on the left. Location is center', function(assert) {
    this.options.rotated = true;
    const at = this.translators.arg;
    this.translators.arg = this.translators.val;
    this.translators.val = at;
    this.series.getVisibleArea = function() { return { minX: 5, maxX: 810, minY: 10, maxY: 600 }; };
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 70;
    point.lowY = -20;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 37.5, y: 44, offset: 0 });
});

QUnit.test('Get tooltip coordinates, rotated, point is abroad on the left. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._options.rotated = true;

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 70;
    point.lowY = -20;
    point.draw(this.renderer, this.groups);
    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 70, y: 44, offset: 0 });
});

QUnit.test('Get tooltip coordinates, rotated, point is abroad on the right. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._options.rotated = true;

    point.x = 44;
    point.openY = 552;
    point.closeY = 558;
    point.highY = 600;
    point.lowY = 542;
    point.width = 10;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 571, y: 44, offset: 0 });
});

QUnit.test('Get tooltip coordinates, rotated, point is abroad on the right. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._options.rotated = true;

    point.x = 44;
    point.openY = 552;
    point.closeY = 558;
    point.highY = 600;
    point.lowY = 542;
    point.width = 10;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 600, y: 44, offset: 0 });
});

QUnit.test('Get tooltip coordinates, highY < lowY. Location is invalid', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 44;
    point.openY = 52;
    point.closeY = 58;
    point.highY = 43;
    point.lowY = 69;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams('abs');

    assert.deepEqual(cc, { x: 44, y: 56, offset: 0 });
});

QUnit.test('Get tooltip format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    const cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 25);
    assert.equal(cc.argumentText, '25:argument');
    assert.equal(cc.valueText, 'h: 45:undefined o: 33:undefined c: 15:undefined l: 10:undefined');
    assert.equal(cc.seriesName, 'series');
    assert.equal(cc.highValue, 45);
    assert.equal(cc.openValue, 33);
    assert.equal(cc.closeValue, 15);
    assert.equal(cc.lowValue, 10);
    assert.equal(cc.highValueText, '45:undefined');
    assert.equal(cc.openValueText, '33:undefined');
    assert.equal(cc.closeValueText, '15:undefined');
    assert.equal(cc.lowValueText, '10:undefined');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 25);
    assert.equal(cc.originalHighValue, 45);
    assert.equal(cc.originalOpenValue, 33);
    assert.equal(cc.originalCloseValue, 15);
    assert.equal(cc.originalLowValue, 10);
});

QUnit.test('Get tooltip format object with null values', function(assert) {
    this.data.openValue = null;
    this.data.closeValue = null;
    this.data.originalCloseValue = null;
    this.data.originalOpenValue = null;
    const point = createPoint(this.series, this.data, this.options);

    const cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 25);
    assert.equal(cc.valueText, 'h: 45:undefined l: 10:undefined');
    assert.equal(cc.seriesName, 'series');
    assert.equal(cc.highValue, 45);
    assert.equal(cc.openValue, null);
    assert.equal(cc.closeValue, null);
    assert.equal(cc.lowValue, 10);
    assert.equal(cc.highValueText, '45:undefined');
    assert.equal(cc.openValueText, '');
    assert.equal(cc.closeValueText, '');
    assert.equal(cc.lowValueText, '10:undefined');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 25);
    assert.equal(cc.originalHighValue, 45);
    assert.equal(cc.originalOpenValue, null);
    assert.equal(cc.originalCloseValue, null);
    assert.equal(cc.originalLowValue, 10);
});

QUnit.module('Styles', {
    beforeEach: function() {
        this.options = {
            widgetType: 'chart',
            reduction: {
                color: '#333333'
            },
            type: 'candlestick', label: { visible: false },
            styles: {
                normal: {
                    fill: '#111111',
                    stroke: '#222222'
                },
                positive: { isPositive: true },
                reductionStyle: { isReduction: true },
                reductionPositive: { isReduction: true, isPositive: true }
            },
            visible: true,
            rotated: false
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return new MockTranslator({ translate: {} }); } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return new MockTranslator({ translate: {} }); } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 100 }; }
        };
        this.renderer = new vizMocks.Renderer();
        this.group = {
            defaultMarkersGroup: this.renderer.g(),
            reductionMarkersGroup: this.renderer.g(),
            defaultPositiveMarkersGroup: this.renderer.g(),
            reductionPositiveMarkersGroup: this.renderer.g()
        };

        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Default Style', function(assert) {
    const point = createPoint(this.series, { argument: 5, openValue: 33, closeValue: 22, highValue: 44, lowValue: 11 }, this.options);

    assert.deepEqual(point._styles, this.options.styles);
});

QUnit.test('positive Style', function(assert) {
    const point = createPoint(this.series, { argument: 5, openValue: 11, closeValue: 22, highValue: 44, lowValue: 11 }, this.options);

    assert.deepEqual(point._styles, this.options.styles.positive);
});

QUnit.test('Default reduction Style', function(assert) {
    const point = createPoint(this.series, { argument: 5, openValue: 33, closeValue: 22, highValue: 44, lowValue: 11, isReduction: true }, this.options);

    assert.deepEqual(point._styles, this.options.styles.reduction);
});

QUnit.test('Positive reduction Style', function(assert) {
    const point = createPoint(this.series, { argument: 5, openValue: 11, closeValue: 22, highValue: 44, lowValue: 11, isReduction: true }, this.options);

    assert.deepEqual(point._styles, this.options.styles.reductionPositive);
});

QUnit.test('Update marker group', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    point.translate();
    point.width = 10;
    point.draw(this.renderer, this.groups);
    point.graphic.stub('append').reset();

    point.fullState = 1;
    point.applyView();

    assert.ok(!point.graphic.stub('append').called);
});

QUnit.test('T111849. Get color', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);

    assert.equal(point.getColor(), '#222222');
});

QUnit.test('T111849. Get color from reduction point', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 3, closeValue: 3, lowValue: 1, highValue: 4, isReduction: true }, this.options);

    assert.equal(point.getColor(), '#333333');
});

QUnit.module('Draw label', {
    beforeEach: function() {
        const that = this;
        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11 },
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: { 1: 52, 2: 35, 3: 10, 4: 5 },
                failOnWrongData: true
            })
        };
        this.sinonFactory = sinon.stub(labelModule, 'Label', function() {
            return sinon.createStubInstance(originalLabel);
        });
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = { x: 55, y: 40, height: 10, width: 20 };
        this.group = this.renderer.g();
        this.group.defaultMarkersGroup = this.renderer.g();
        this.group.reductionMarkersGroup = this.renderer.g();
        this.group.defaultPositiveMarkersGroup = this.renderer.g();
        this.group.reductionPositiveMarkersGroup = this.renderer.g();
        this.data = {
            argument: 25,
            reductionValue: 15,
            lowValue: 10,
            openValue: 11,
            closeValue: 12,
            highValue: 20
        };
        this.options = {
            widgetType: 'chart',
            reduction: { color: 'pink' },
            styles: { normal: { r: 0 }, hover: {}, positive: { normal: {} }, reductionPositive: {} },
            label: {
                visible: true,
                horizontalOffset: 0,
                verticalOffset: 0,
                background: {},
                position: 'outside'
            }
        };
        this.series = {
            name: 'series',
            _options: {},
            isFullStackedSeries: function() { return false; },
            areLabelsVisible: function() { return true; },
            getLabelVisibility: function() { return true; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; }
        };
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('Get label format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const result = point._getLabelFormatObject();

    assert.equal(result.openValue, 11);
    assert.equal(result.closeValue, 12);
    assert.equal(result.lowValue, 10);
    assert.equal(result.highValue, 20);
    assert.equal(result.argument, 25);
    assert.equal(result.reductionValue, 15);
    assert.equal(result.value, 15);
    assert.equal(result.seriesName, 'series');
    assert.equal(result.originalOpenValue, 11);
    assert.equal(result.originalCloseValue, 12);
    assert.equal(result.originalLowValue, 10);
    assert.equal(result.originalHighValue, 20);
    assert.equal(result.originalArgument, 25);
    assert.deepEqual(result.point, point);
});

QUnit.test('Check customize text object', function(assert) {
    this.series.seriesName = 'series';
    this.options.label.format = 'fixedPoint';
    this.options.label.argumentFormat = 'fixedPoint';
    this.options.label.precision = 2;
    this.options.label.argumentPrecision = 2;
    const pt = createPoint(this.series, this.data, this.options);

    pt.x = 30;
    pt.y = 30;
    pt._drawLabel(this.renderer, this.group);

    assert.deepEqual(pt._label.setData.args[0][0], {
        argument: 25,
        closeValue: 12,
        highValue: 20,
        lowValue: 10,
        openValue: 11,
        originalArgument: 25,
        originalCloseValue: 12,
        originalHighValue: 20,
        originalLowValue: 10,
        originalOpenValue: 11,
        reductionValue: 15,
        seriesName: 'series',
        value: 15,
        point: pt
    });
});

QUnit.test('high value = null', function(assert) {
    this.data.highValue = null;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 60;
    point.lowY = 90;
    point.width = 20;

    point._drawLabel(this.renderer, this.group);

    assert.ok(!point._label._insideGroup);
});

QUnit.test('low value = null', function(assert) {
    this.data.lowValue = null;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 60;
    point.lowY = 90;
    point.width = 20;

    point._drawLabel(this.renderer, this.group);

    assert.ok(!point._label._insideGroup);
});

QUnit.test('Get graphic bbox. Not rotated', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 60;
    point.lowY = 90;
    point.width = 20;

    const bBox = point._getGraphicBBox();

    assert.equal(bBox.x, 40);
    assert.equal(bBox.y, 60);
    assert.equal(bBox.width, 20);
    assert.equal(bBox.height, 30);
});

QUnit.test('Get graphic bbox. Rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;

    const bBox = point._getGraphicBBox();

    assert.equal(bBox.x, 60);
    assert.equal(bBox.y, 40);
    assert.equal(bBox.width, 30);
    assert.equal(bBox.height, 20);
});

QUnit.test('Draw label if point isn\'t reduction', function(assert) {
    this.options.type = 'stock';
    this.options.label.background.fill = 'red';
    this.options.label.connector = { visible: true, stroke: 'red', 'stroke-width': 2 };
    this.options.reduction = { color: 'blue' };
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;
    point._isReduction = false;

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
    assert.ok(!point._label.setColor.called);
});

QUnit.test('Draw label if point is reduction', function(assert) {
    this.options.type = 'stock';
    this.options.label.background.fill = 'red';
    this.options.label.connector = { visible: true, stroke: 'red', 'stroke-width': 2 };
    this.options.reduction = { color: 'blue' };
    this.data.isReduction = true;
    const point = createPoint(this.series, this.data, this.options);
    this.data.isReduction = false;

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
    assert.ok(point._label.setColor.args[0][0], 'red');
});

QUnit.test('Update label from reduction to non-reduction', function(assert) {
    this.options.type = 'stock';
    this.options.label.background.fill = 'red';
    this.options.label.connector = { visible: true, stroke: 'red', 'stroke-width': 2 };
    this.options.reduction = { color: 'blue' };
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;
    point._isReduction = true;

    point._drawLabel(this.renderer, this.group);

    point._isReduction = false;
    point.updateOptions(this.options);
    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
    assert.ok(!point._label.setColor.called);
});

QUnit.test('Draw label. Stock', function(assert) {
    this.options.type = 'stock';
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
});

QUnit.test('Draw label. Candlestick', function(assert) {
    this.options.type = 'candlestick';
    const point = createPoint(this.series, this.data, this.options);

    point.x = 50;
    point.highY = 90;
    point.lowY = 60;
    point.width = 20;

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
});

QUnit.module('get point radius', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.options = {
            widgetType: 'chart',
            reduction: { color: 'red' },
            visible: true,
            styles: {
                positive: {
                    normal: {
                        style: { positive: 'Normal' }
                    }
                }
            },
            type: 'candlestick'
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; }
        };

        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('get radius', function(assert) {
    const point = createPoint(this.series, { argument: 1, openValue: 2, closeValue: 3, lowValue: 1, highValue: 4 }, this.options);
    assert.equal(point.getPointRadius(), 0);
});
