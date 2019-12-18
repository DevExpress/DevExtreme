import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;
import { MockTranslator } from '../../helpers/chartMocks.js';

const originalLabel = labelModule.Label;

var createPoint = function(series, data, options) {
    options = options || {};
    options.type = options.type || 'line';
    return new pointModule.Point(series, data, options);
};

QUnit.module('Creation', {
    beforeEach: function() {
        this.options = {
            widgetType: 'chart',
            reduction: {},
            styles: {},
            label: {
                visible: false
            }
        };

        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };

        this.simpleData = { argument: 1, value: 10 };
        this.rangeData = { argument: 1, value: 10, minValue: 5 };
        this.bubbleData = { argument: 1, value: 10, size: 5 };
        this.financialData = { argument: 1, lowValue: 1, highValue: 10, openValue: 2, closeValue: 8, reductionValue: 5 };
    }
});

QUnit.test('Create with empty data', function(assert) {
    this.options.rotated = 'rotated';
    this.options.style = 'style';
    var point = createPoint(this.series, {}, this.options);

    assert.ok(point, 'Point should be created');

    assert.ok(!point.argument, 'Argument should be undefined');
    assert.ok(!point.value, 'Value should be undefined');
    assert.strictEqual(point.minValue, 'canvas_position_default', 'Min value should be undefined');
    assert.ok(!point.size, 'Size should be undefined');
    assert.ok(!point.lowValue, 'Low value should be undefined');
    assert.ok(!point.highValue, 'High value should be undefined');
    assert.ok(!point.closeValue, 'Close value should be undefined');
    assert.ok(!point.openValue, 'Open value should be undefined');
    assert.ok(!point.tag, 'Tag should be undefined');

    assert.strictEqual(point.lowError, undefined, 'lowError should be undefined');
    assert.strictEqual(point.highError, undefined, 'highError should be undefined');


    assert.ok(point._options, 'Options should be created');
    assert.equal(point.series.name, 'series', 'Series option should be correct');
    assert.equal(point._options.rotated, 'rotated', 'Rotated options should be correct');
    assert.equal(point._options.style, 'style', 'Style option should be correct');

    assert.equal(point.getOptions(), this.options);
});

QUnit.test('Tag', function(assert) {
    var point = createPoint(this.series, { tag: 'tag' }, this.options);

    assert.ok(point, 'Point should be created');

    assert.equal(point.tag, 'tag', 'Tag should be correct');
});

QUnit.test('Create simple point', function(assert) {
    var aggregationInfo = this.simpleData.aggregationInfo = {};
    this.simpleData.data = { data: true };

    var point = createPoint(this.series, this.simpleData, this.options);

    assert.ok(point, 'Point should be created');

    assert.equal(point.argument, 1, 'Argument should be correct');
    assert.equal(point.initialArgument, 1, 'Argument should be correct');
    assert.equal(point.originalArgument, 1, 'Argument should be correct');

    assert.equal(point.value, 10, 'Value should be correct');
    assert.equal(point.initialValue, 10, 'Value should be correct');
    assert.equal(point.originalValue, 10, 'Value should be correct');

    assert.strictEqual(point.lowError, undefined, 'lowError should be undefined');
    assert.strictEqual(point.highError, undefined, 'highError should be undefined');

    assert.strictEqual(point.aggregationInfo, aggregationInfo, 'aggregationInfo should be object');
    assert.strictEqual(point.data, this.simpleData.data, 'data is passed to point');
});

QUnit.test('CretePoint with errorBar', function(assert) {
    var point = createPoint(this.series, { lowError: 12, highError: 25 }, this.options);

    assert.strictEqual(point.lowError, 12, 'lowError should be undefined');
    assert.strictEqual(point.highError, 25, 'highError should be undefined');
});

QUnit.test('Create range point', function(assert) {
    var point = createPoint(this.series, this.rangeData, this.options);

    assert.ok(point, 'Point should be created');

    assert.equal(point.argument, 1, 'Argument should be correct');
    assert.equal(point.initialArgument, 1, 'Argument should be correct');
    assert.equal(point.originalArgument, 1, 'Argument should be correct');

    assert.equal(point.value, 10, 'Value should be correct');
    assert.equal(point.initialValue, 10, 'Value should be correct');
    assert.equal(point.originalValue, 10, 'Value should be correct');

    assert.equal(point.minValue, 5, 'Min value should be correct');
    assert.equal(point.initialMinValue, 5, 'Min value should be correct');
    assert.equal(point.originalMinValue, 5, 'Min value should be correct');
});

QUnit.test('Create bubble point', function(assert) {
    this.options.type = 'bubble';
    var point = createPoint(this.series, this.bubbleData, this.options);

    assert.ok(point, 'Point should be created');

    assert.equal(point.argument, 1, 'Argument should be correct');
    assert.equal(point.initialArgument, 1, 'Argument should be correct');
    assert.equal(point.originalArgument, 1, 'Argument should be correct');

    assert.equal(point.value, 10, 'Value should be correct');
    assert.equal(point.initialValue, 10, 'Value should be correct');
    assert.equal(point.originalValue, 10, 'Value should be correct');

    assert.equal(point.size, 5, 'Size should be correct');
    assert.equal(point.initialSize, 5, 'Size should be correct');
});

QUnit.test('Create financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, this.financialData, this.options);

    assert.ok(point, 'Point should be created');

    assert.equal(point.argument, 1, 'Argument should be correct');
    assert.equal(point.initialArgument, 1, 'Argument should be correct');
    assert.equal(point.originalArgument, 1, 'Argument should be correct');

    assert.equal(point.value, 5, 'Value should be correct');
    assert.equal(point.initialValue, 5, 'Value should be correct');

    assert.equal(point.lowValue, 1, 'Low value should be correct');
    assert.equal(point.originalLowValue, 1, 'Low value should be correct');

    assert.equal(point.highValue, 10, 'High value should be correct');
    assert.equal(point.originalHighValue, 10, 'High value should be correct');

    assert.equal(point.openValue, 2, 'Open value should be correct');
    assert.equal(point.originalOpenValue, 2, 'Open value should be correct');

    assert.equal(point.closeValue, 8, 'Close value should be correct');
    assert.equal(point.originalCloseValue, 8, 'Close value should be correct');
});

QUnit.module('Updating', {
    beforeEach: function() {
        this.options = {
            reduction: {},
            widgetType: 'chart',
            label: {
                visible: false
            },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Update argument of simple point', function(assert) {
    var point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    this.options.type = 'line';
    point.update({ argument: 2, value: 1 }, this.options);

    assert.equal(point.argument, 2, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
});

QUnit.test('Update value of simple point', function(assert) {
    var point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    this.options.type = 'line';
    point.update({ argument: 1, value: 2 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 2, 'Point value should be correct');
});

QUnit.test('Update argument of range point', function(assert) {
    this.options.type = 'rangearea';
    var point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);

    point.update({ argument: 2, value: 1, minValue: 1 }, this.options);

    assert.equal(point.argument, 2, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.minValue, 1, 'Point min value should be correct');
});

QUnit.test('Update value of range point', function(assert) {
    this.options.type = 'rangearea';
    var point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);

    point.update({ argument: 1, value: 2, minValue: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 2, 'Point value should be correct');
    assert.equal(point.minValue, 1, 'Point min value should be correct');
});

QUnit.test('Update min value of range point', function(assert) {
    this.options.type = 'rangearea';
    var point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);

    point.update({ argument: 1, value: 1, minValue: 2 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.minValue, 2, 'Point min value should be correct');
});

QUnit.test('Update argument of bubble point', function(assert) {
    this.options.type = 'bubble';
    var point = createPoint(this.series, { argument: 1, value: 1, size: 1 }, this.options);

    point.update({ argument: 2, value: 1, size: 1 }, this.options);

    assert.equal(point.argument, 2, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.size, 1, 'Point size should be correct');
});

QUnit.test('Update value of bubble point', function(assert) {
    this.options.type = 'bubble';
    var point = createPoint(this.series, { argument: 1, value: 1, size: 1 }, this.options);

    point.update({ argument: 1, value: 2, size: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 2, 'Point value should be correct');
    assert.equal(point.size, 1, 'Point size should be correct');
});

QUnit.test('Update size of bubble point', function(assert) {
    this.options.type = 'bubble';
    var point = createPoint(this.series, { argument: 1, value: 1, size: 1 }, this.options);

    point.update({ argument: 1, value: 1, size: 2 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.size, 2, 'Point size should be correct');
});

QUnit.test('Update argument of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 2, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    assert.equal(point.argument, 2, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.lowValue, 1, 'Point low value should be correct');
    assert.equal(point.highValue, 1, 'Point high value should be correct');
    assert.equal(point.openValue, 1, 'Point open value should be correct');
    assert.equal(point.closeValue, 1, 'Point close value should be correct');
});

QUnit.test('Update value of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 1, reductionValue: 2, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 2, 'Point value should be correct');
    assert.equal(point.lowValue, 1, 'Point low value should be correct');
    assert.equal(point.highValue, 1, 'Point high value should be correct');
    assert.equal(point.openValue, 1, 'Point open value should be correct');
    assert.equal(point.closeValue, 1, 'Point close value should be correct');
});

QUnit.test('Update low value of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 1, reductionValue: 1, lowValue: 2, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.lowValue, 2, 'Point low value should be correct');
    assert.equal(point.highValue, 1, 'Point high value should be correct');
    assert.equal(point.openValue, 1, 'Point open value should be correct');
    assert.equal(point.closeValue, 1, 'Point close value should be correct');
});

QUnit.test('Update high value of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 1, reductionValue: 1, lowValue: 1, highValue: 2, closeValue: 1, openValue: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.lowValue, 1, 'Point low value should be correct');
    assert.equal(point.highValue, 2, 'Point high value should be correct');
    assert.equal(point.openValue, 1, 'Point open value should be correct');
    assert.equal(point.closeValue, 1, 'Point close value should be correct');
});

QUnit.test('Update open value of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 2 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.lowValue, 1, 'Point low value should be correct');
    assert.equal(point.highValue, 1, 'Point high value should be correct');
    assert.equal(point.openValue, 2, 'Point open value should be correct');
    assert.equal(point.closeValue, 1, 'Point close value should be correct');
});

QUnit.test('Update close value of financial point', function(assert) {
    this.options.type = 'stock';
    var point = createPoint(this.series, { argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 1, openValue: 1 }, this.options);

    point.update({ argument: 1, reductionValue: 1, lowValue: 1, highValue: 1, closeValue: 2, openValue: 1 }, this.options);

    assert.equal(point.argument, 1, 'Point argument should be correct');
    assert.equal(point.value, 1, 'Point value should be correct');
    assert.equal(point.lowValue, 1, 'Point low value should be correct');
    assert.equal(point.highValue, 1, 'Point high value should be correct');
    assert.equal(point.openValue, 1, 'Point open value should be correct');
    assert.equal(point.closeValue, 2, 'Point close value should be correct');
});

QUnit.module('Update type of point', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            label: {
                visible: false
            },
            widgetType: 'chart',
            attributes: { r: 6 },
            symbol: 'circle'
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _options: {},
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; },
            getVisibleArea: function() { return { minX: 0, maxX: 700, minY: 0, maxY: 700 }; },
            getValueAxis: function() {
                return {
                    getVisibleArea() {
                        return [];
                    },
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 'null': 0, 1: 22 },
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getVisibleArea() {
                        return [];
                    },
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 'null': 0, 1: 11 },
                        });
                    }
                };
            }
        };
    }
});

QUnit.test('Update simple to simple without data', function(assert) {
    this.options.type = 'line';
    var data = { argument: 1, value: 1 },
        point = createPoint(this.series, data, this.options),
        drawMarkerCalled = 0;

    point.translate();
    point.draw(this.renderer, this.group);

    point.drawMarker = function() {
        drawMarkerCalled++;
    };
    // act
    var newOptions = $.extend(true, {}, this.options, { type: 'area' });
    point.update(data, newOptions);
    point.translate();
    point.draw(this.renderer, this.group);

    assert.equal(drawMarkerCalled, 0);
});

QUnit.test('Update simple to simple with data', function(assert) {
    this.options.type = 'line';
    var data = { argument: 1, value: 1 },
        point = createPoint(this.series, data, this.options),
        drawMarkerCalled = 0;

    point.translate();
    point.draw(this.renderer, this.group);

    point.drawMarker = function() {
        drawMarkerCalled++;
    };
    // act
    data = { argument: 2, value: 2 };
    point.update(data, this.options);
    point.translate();
    point.draw(this.renderer, this.group);

    assert.equal(drawMarkerCalled, 0);
});

QUnit.test('Update simple to range', function(assert) {
    this.options.type = 'line';
    var data = { argument: 1, value: 1, minValue: 1 },
        point = createPoint(this.series, data, this.options);

    point.translate();
    point.draw(this.renderer, this.group);

    var deleteMarkerSpy = sinon.spy(point, 'deleteMarker'),
        deleteLabelSpy = sinon.spy(point, 'deleteLabel');

    var newOptions = $.extend(true, {}, this.options, { type: 'rangearea' });
    point.update(data, newOptions);
    point.translate();
    point.draw(this.renderer, this.group);

    assert.ok(deleteMarkerSpy.calledOnce);
    assert.ok(deleteLabelSpy.calledOnce);

    assert.ok(!point._label);
    assert.ok(point._topLabel);
    assert.ok(point._bottomLabel);
});

QUnit.test('Update range to simple', function(assert) {
    this.options.type = 'rangearea';
    var data = { argument: 1, value: 1, minValue: 1 },
        point = createPoint(this.series, data, this.options);

    point.translate();
    point.draw(this.renderer, this.group);

    var deleteMarkerSpy = sinon.spy(point, 'deleteMarker'),
        deleteLabelSpy = sinon.spy(point, 'deleteLabel');

    var newOptions = $.extend(true, {}, this.options, { type: 'line' });
    point.update(data, newOptions);
    point.translate();
    point.draw(this.renderer, this.group);

    assert.ok(deleteMarkerSpy.calledOnce);
    assert.ok(deleteLabelSpy.calledOnce);

    assert.ok(point._label);
    assert.ok(!point._topLabel);
    assert.ok(!point._bottomLabel);
});

QUnit.test('Update range to range', function(assert) {
    this.options.type = 'rangearea';
    var data = { argument: 1, value: 1, minValue: 1 },
        point = createPoint(this.series, data, this.options);

    point.translate();
    point.draw(this.renderer, this.group);

    var deleteMarkerSpy = sinon.spy(point, 'deleteMarker'),
        deleteLabelSpy = sinon.spy(point, 'deleteLabel');

    var newOptions = $.extend(true, {}, this.options, { type: 'rangebar' });
    point.update(data, newOptions);
    point.translate();
    point.draw(this.renderer, this.group);

    assert.ok(deleteMarkerSpy.calledOnce);
    assert.ok(!deleteLabelSpy.called);

    assert.ok(!point._label);
    assert.ok(point._topLabel);
    assert.ok(point._bottomLabel);
});

QUnit.module('Draw', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.labelsGroup = this.renderer.g();
        this.data = { argument: 5, value: 5 };
        this.options = {
            widgetType: 'chart',
            visible: true,
            label: {
                visible: false,
                background: { fill: 'black' },
                connector: { 'stroke-width': 2 }
            },
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            attributes: { r: 6 },
            symbol: 'circle'
        };
        this.sinonFactory = sinon.stub(labelModule, 'Label', function() {
            return sinon.createStubInstance(originalLabel);
        });
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return true; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; },
            getVisibleArea: function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
            getValueAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 100 }
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 50 }
                        });
                    }
                };
            }
        };

        this.groups = {
            markers: this.group,
            labels: this.labelsGroup
        };
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('Point is not visible', function(assert) {
    this.options.visible = false;
    var point = createPoint(this.series, this.data, this.options);

    point.translate();
    var spy = sinon.spy(point, '_drawMarker');
    point.draw(this.renderer, this.groups);

    assert.ok(!spy.called);
});

QUnit.test('Point is visible', function(assert) {
    this.options.visible = true;
    var point = createPoint(this.series, this.data, this.options);

    point.translate();
    var spy = sinon.spy(point, '_drawMarker');
    point.draw(this.renderer, this.groups);

    assert.ok(spy.calledOnce);
});

QUnit.module('Label', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.sinonFactory = sinon.stub(labelModule, 'Label', function() {
            return sinon.createStubInstance(originalLabel);
        });
        this.labelsGroup = {};

        this.groups = {
            markers: this.group,
            labels: this.labelsGroup
        };

        this.data = { argument: 5, value: 5 };
        this.options = {
            widgetType: 'chart',
            visible: true,
            label: {
                visible: true,
                background: { fill: 'black' },
                connector: { 'stroke-width': 2 }
            },
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            attributes: { r: 6 },
            symbol: 'circle'
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return true; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; },
            getVisibleArea: function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
            getValueAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 100 },
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 50 },
                        });
                    }
                };
            }
        };
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('Draw label. Visible', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point._label.getBoundingRect.returns({});
    point._label.getLayoutOptions.returns({});
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point._label);
    assert.ok(point._label.draw.calledOnce);
    assert.deepEqual(point._label.draw.lastCall.args, [true]);
});

QUnit.test('Draw label. Common visible = false', function(assert) {
    this.series.getLabelVisibility = function() { return false; };
    var point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point._label);
    assert.deepEqual(point._label.draw.lastCall.args, [false]);
});

QUnit.test('Draw label. Invisible', function(assert) {
    this.options.label.visible = false;
    this.series.getLabelVisibility = function() { return false; };
    var point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point._label);
    assert.deepEqual(point._label.draw.lastCall.args, [false]);
});

QUnit.test('Update label. Visible', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point._label.getBoundingRect.returns({});
    point._label.getLayoutOptions.returns({});

    point.translate();
    point.draw(this.renderer, this.groups);
    point.update(this.data, this.options);

    assert.ok(point._label);
    assert.ok(point._label.setData.calledTwice);
    assert.equal(point._label.setData.lastCall.args.length, 1);

    assert.ok(point._label.setOptions.calledTwice);
    assert.equal(point._label.setOptions.lastCall.args.length, 1);

    assert.deepEqual(point._label.setOptions.lastCall.args[0], this.options.label);
});

QUnit.test('Update data with null value after data with value', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point._label.getBoundingRect.returns({});
    point._label.getLayoutOptions.returns({});

    point.translate();
    point.draw(this.renderer, this.groups);

    sinon.spy(point, 'setInvisibility');

    point.update({ argument: 4, value: null }, this.options);

    assert.ok(point._label);

    assert.deepEqual(point._label.setOptions.lastCall.args[0], this.options.label);
    assert.strictEqual(point.graphic._stored_settings.visibility, 'hidden');
    assert.deepEqual(point._label.draw.lastCall.args, [false]);
    assert.ok(point.setInvisibility.calledOnce);
});

QUnit.module('Deleting', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            label: {},
            widgetType: 'chart',
            symbol: 'circle'
        };

        this.groups = {
            markers: this.group
        };

        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; },
            getVisibleArea: function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
            getValueAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 'null': 0, 1: 22 }
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 'null': 0, 1: 11 }
                        });
                    }
                };
            }
        };
    }
});

QUnit.test('Delete marker', function(assert) {
    this.options.type = 'line';
    var data = { argument: 1, value: 1 },
        point = createPoint(this.series, data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    point.deleteMarker();

    assert.ok(!point.graphic, 'point graphic should be deleted');
});

QUnit.module('Point views', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.series = sinon.createStubInstance(Series);
        this.series.isVisible.returns(true);
        this.options = {
            styles: { normal: { style: 'normal' }, hover: { style: 'hover' }, selection: { style: 'selection' } },
            label: {},
            visible: true,
            widgetType: 'chart',
            symbol: 'circle'
        };
        this.data = { argument: 1, value: 1, lowError: 2, highError: 4 };
        this.series.getVisibleArea = function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
        this.series.getValueAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 22, 2: 23, 3: 24, 4: 25 }
                });
            }
        });
        this.series.getArgumentAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 11, 2: 12, 3: 13, 4: 14 }
                });
            }
        });

        this.groups = {
            markers: this.group,
            errorBars: this.renderer.g()
        };

        var point = createPoint(this.series, this.data, this.options);
        point.translate();
        point.draw(this.renderer, this.groups);
        point.graphic.stub('attr').reset();

        this.point = point;

        this.getCurrentStyle = function() {
            return point.graphic.stub('attr').lastCall.args[0].style;
        };
    }
});

QUnit.test('apply view', function(assert) {
    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'normal');

    assert.ok(!this.point.graphic.stub('toForeground').called);
    // TO-DO rework it and delete test
    assert.deepEqual(this.point.graphic.stub('attr').firstCall.args[0], {
        fill: null,
        stroke: null,
        dashStyle: null
    });
});

// hover view
QUnit.test('apply view/ hovered point', function(assert) {
    this.point.fullState = 1;
    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'hover');
    assert.ok(this.point.graphic.stub('toForeground').calledOnce);
});

QUnit.test('set view hover view. normal point', function(assert) {
    this.point.setView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'hover');
});

QUnit.test('reset view for point with hover view', function(assert) {
    this.point.setView('hover');

    this.point.resetView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});

QUnit.test('set hover view n times, reset hover view n-1 times', function(assert) {
    this.point.setView('hover');
    this.point.setView('hover');
    this.point.setView('hover');

    this.point.resetView('hover');
    this.point.resetView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'hover');
});

QUnit.test('set hover view n times, reset hover view n times', function(assert) {
    this.point.setView('hover');
    this.point.setView('hover');
    this.point.setView('hover');

    this.point.resetView('hover');
    this.point.resetView('hover');
    this.point.resetView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});

// selection view
QUnit.test('apply view. selected point', function(assert) {
    this.point.fullState = 2;
    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'selection');
    assert.ok(this.point.graphic.stub('toForeground').calledOnce);
});

QUnit.test('set view selection view. normal point', function(assert) {
    this.point.setView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('reset view for point with selection view', function(assert) {
    this.point.setView('selection');

    this.point.resetView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});

QUnit.test('set selection view n times, reset selection view n-1 times', function(assert) {
    this.point.setView('selection');
    this.point.setView('selection');
    this.point.setView('selection');

    this.point.resetView('selection');
    this.point.resetView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('set selection view n times, reset selection view n times', function(assert) {
    this.point.setView('selection');
    this.point.setView('selection');
    this.point.setView('selection');

    this.point.resetView('selection');
    this.point.resetView('selection');
    this.point.resetView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});
// hover & selection
QUnit.test('apply view. hovered and selected point', function(assert) {
    this.point.fullState = 3;
    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('set hover view. point with selection view', function(assert) {
    this.point.setView('selection');

    this.point.setView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('reset hover view. point with selection view', function(assert) {
    this.point.setView('selection');
    this.point.setView('hover');

    this.point.resetView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('reset selection view. point with hover view', function(assert) {
    this.point.setView('selection');
    this.point.setView('hover');

    this.point.resetView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'hover');
});

QUnit.test('reset hover view. selected point', function(assert) {
    this.point.fullState = 2;
    this.point.setView('hover');

    this.point.resetView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

// T661080
QUnit.test('Point has hover view after call resetView + setView', function(assert) {
    this.point.resetView('hover');

    this.point.setView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'hover');
});

QUnit.test('apply hover view in \'none\' mode', function(assert) {
    this.options.hoverMode = 'none';
    this.point.update(this.options);
    this.point.setView('hover');

    assert.strictEqual(this.getCurrentStyle(), 'hover');
});

QUnit.test('apply view with hovered state in \'none\' mode', function(assert) {
    this.options.hoverMode = 'none';
    this.point.update(this.options);
    this.point.fullState = 1;
    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});

QUnit.test('apply selection view in \'none\' mode', function(assert) {
    this.options.selectionMode = 'none';
    this.point.update(this.options);

    this.point.setView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('apply selection view in \'none\' mode. point is selected', function(assert) {
    this.options.selectionMode = 'None';
    this.point.update(this.options);
    this.point.fullState = 2;

    this.point.setView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.test('apply view with selected state in \'none\' mode', function(assert) {
    this.options.selectionMode = 'None';
    this.point.update(this.options);
    this.point.fullState = 2;

    this.point.applyView();

    assert.strictEqual(this.getCurrentStyle(), 'normal');
});

QUnit.test('apply view with selected state in \'none\' mode', function(assert) {
    this.options.selectionMode = 'none';
    this.point.update(this.options);
    this.point.fullState = 1;

    this.point.setView('selection');

    assert.strictEqual(this.getCurrentStyle(), 'selection');
});

QUnit.module('states and styles', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.series = sinon.createStubInstance(Series);
        this.series.isVisible.returns(true);
        this.options = {
            styles: { normal: { style: 'normal' }, hover: { style: 'hover' }, selection: { style: 'selection' } },
            label: {},
            visible: true,
            widgetType: 'chart',
            symbol: 'circle'
        };
        this.data = { argument: 1, value: 1, lowError: 2, highError: 4 };
        this.series.getVisibleArea = function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
        this.series.getValueAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 22, 2: 23, 3: 24, 4: 25 }
                });
            }
        });
        this.series.getArgumentAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 11, 2: 12, 3: 13, 4: 14 }
                });
            }
        });

        this.groups = {
            markers: this.group,
            errorBars: this.renderer.g()
        };
    }
});

QUnit.test('Draw point with some style, point in the visible area after it was in invisible area and wasn\'t drawn', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.fullState = 2;
    point.applyView();
    point.draw(this.renderer, this.groups);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].style, 'selection');
});

QUnit.test('T333557', function(assert) {
    this.options.styles.normal = { style: 'normal', fill: 'red' };
    var point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    // act
    point.fullState = 1;
    point.applyView();
    point.fullState = 0;
    point.applyView();
    this.options.styles.normal = { style: 'newStyle', fill: 'green' };

    point.update(this.data, this.options);
    point.draw(this.renderer, this.groups);

    // assert
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].style, 'newStyle');
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].fill, 'green');
});

QUnit.test('Draw point without state', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    // assert
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].style, 'normal');
});

QUnit.test('Release hover state', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.draw(this.renderer, this.groups);
    // act
    point.releaseHoverState();
    // assert
    assert.ok(point.graphic.stub('toBackground').calledOnce);
});

QUnit.test('Release hover state check background when state is selected', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.draw(this.renderer, this.groups);
    point.fullState = 2;

    point.releaseHoverState();

    assert.ok(!point.graphic.stub('toBackground').called);
});

QUnit.module('Event binding', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.series = sinon.createStubInstance(Series);
        this.options = {
            styles: { normal: { style: 'normal' }, hover: { style: 'hover' }, selection: { style: 'selection' } },
            label: {},
            widgetType: 'chart',
            visible: true,
            symbol: 'circle'
        };
        this.data = { argument: 1, value: 1 };
        this.series.getValueAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 22 }
                });
            }
        });
        this.series.getArgumentAxis.returns({
            getTranslator: function() {
                return new MockTranslator({
                    translate: { 'null': 0, 1: 11 }
                });
            }
        });
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Point selection event passed to series', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    // act
    point.select();

    // assert
    assert.ok(this.series.selectPoint.calledOnce);
    assert.strictEqual(this.series.selectPoint.lastCall.args[0], point, 'Point should be selectied on series level');
});

QUnit.test('Point clear selection event passed to series', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    // act
    point.clearSelection();

    // assert
    assert.ok(this.series.deselectPoint.calledOnce);
    assert.strictEqual(this.series.deselectPoint.lastCall.args[0], point, 'Point selection should be cleared on series level');
});

QUnit.test('Point clear hover passed to series', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    // act
    point.clearHover();

    // assert
    assert.ok(this.series.clearPointHover.calledOnce);
});

QUnit.test('Point showTooltip event passed to series', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    // act
    point.showTooltip();

    // assert
    assert.ok(this.series.showPointTooltip.calledOnce);
    assert.strictEqual(this.series.showPointTooltip.lastCall.args[0], point, 'Point should be selection on series level');
});

QUnit.test('Point hideTooltip selection event passed to series', function(assert) {
    var point = createPoint(this.series, this.data, this.options);
    // act
    point.hideTooltip();

    // assert
    assert.ok(this.series.hidePointTooltip.calledOnce);
    assert.strictEqual(this.series.hidePointTooltip.lastCall.args[0], point, 'Point selected should be cleared on series level');
});

QUnit.module('Dispose', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.labelsGroup = this.renderer.g();

        this.data = { argument: 5, value: 5, lowError: 5, highError: 5 };
        this.options = {
            widgetType: 'chart',
            visible: true,
            errorBars: {
                visible: true
            },
            label: {
                visible: false,
                background: { fill: 'black' },
                connector: { 'stroke-width': 2 }
            },
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            attributes: { r: 6 },
            symbol: 'circle'
        };
        this.sinonFactory = sinon.stub(labelModule, 'Label', function() {
            return sinon.createStubInstance(originalLabel);
        });
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return true; },
            getVisibleArea: function() { return { minX: 1, maxX: 100, minY: 2, maxY: 210 }; },
            getValueAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 100 },
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 50 },
                        });
                    }
                };
            },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };

        this.groups = {
            markers: this.group,
            labels: this.labelsGroup,
            errorBars: this.renderer.g()

        };
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('Dispose', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    var graphic = point.graphic,
        errorBarSpy = sinon.spy(point._errorBar, 'remove');

    point.dispose();

    assert.strictEqual(point._options, null, 'options');
    assert.strictEqual(point._styles, null, 'styles');
    assert.strictEqual(point.series, null, 'series');

    assert.strictEqual(point._label, null, 'label');
    assert.strictEqual(point.graphic, null, 'graphic');

    assert.strictEqual(point._errorBar, null, 'errorBar graphic');

    assert.ok(graphic.stub('dispose').calledOnce);
    assert.ok(errorBarSpy.calledOnce);
});

QUnit.module('API', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.labelsGroup = {};
        this.data = { argument: 5, value: 5 };
        this.options = {
            visible: true,
            widgetType: 'chart',
            label: {
                visible: false,
                background: { fill: 'black' },
                connector: { 'stroke-width': 2 }
            },
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            symbol: 'circle'
        };
        this.series = {
            getColor: function() { return 'blue'; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return true; },
            customizePoint: sinon.stub(),
            getVisibleArea: function() { return { minX: 0, maxX: 700, minY: 0, maxY: 700 }; },
            getValueAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: {
                                5: 100,
                                'canvas_position_default': 'default_position'
                            }
                        });
                    }
                };
            },
            getArgumentAxis: function() {
                return {
                    getTranslator: function() {
                        return new MockTranslator({
                            translate: { 5: 50 }
                        });
                    }
                };
            },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        sinon.spy(labelModule, 'Label');
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('Get color without customize point', function(assert) {
    var point = createPoint(this.series, this.data, this.options),
        color = point.getColor();

    assert.equal(color, 'blue');
});

QUnit.test('Get color with customize point', function(assert) {
    this.options.styles.normal.fill = 'red';
    var point = createPoint(this.series, this.data, this.options),
        color = point.getColor();

    assert.equal(color, 'red');
    assert.strictEqual(this.series.customizePoint.callCount, 0);
});

QUnit.test('Get color with customize point point hasn\'t value', function(assert) {
    this.data.value = null;

    var point = createPoint(this.series, this.data, this.options);
    // act
    point.getColor();

    assert.strictEqual(this.series.customizePoint.callCount, 1);
    assert.strictEqual(this.series.customizePoint.lastCall.args[0], point);
    assert.deepEqual(this.series.customizePoint.lastCall.args[1], this.data);
});

QUnit.test('Get color with customize point point hasn\'t value and has customized style', function(assert) {
    this.data.value = null;
    this.options.styles.usePointCustomOptions = true;

    var point = createPoint(this.series, this.data, this.options);
    // act
    point.getColor();

    assert.strictEqual(this.series.customizePoint.callCount, 0);
});

QUnit.test('setHole left hole', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(0.3, 'left');

    assert.strictEqual(point.leftHole, 4.7),
    assert.strictEqual(point.minLeftHole, -0.3);
});

QUnit.test('setHole right hole', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(0.3, 'right');

    assert.strictEqual(point.rightHole, 4.7),
    assert.strictEqual(point.minRightHole, -0.3);
});

QUnit.test('set not defined hole - null', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(null, 'right');

    assert.strictEqual(point.rightHole, undefined),
    assert.strictEqual(point.minRightHole, undefined);
});

QUnit.test('reset holes', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(0.3, 'left');
    point.setHole(3, 'right');

    point.resetHoles();

    assert.strictEqual(point.leftHole, null),
    assert.strictEqual(point.minLeftHole, null);
    assert.strictEqual(point.rightHole, null),
    assert.strictEqual(point.minRightHole, null);
});

QUnit.test('set not defined hole - undefined', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(undefined, 'right');

    assert.strictEqual(point.rightHole, undefined),
    assert.strictEqual(point.minRightHole, undefined);
});

QUnit.test('set defined hole - 0', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    point.setHole(0, 'right');

    assert.strictEqual(point.rightHole, 5),
    assert.strictEqual(point.minRightHole, 0);
});

QUnit.test('getLabel', function(assert) {
    var point = createPoint(this.series, this.data, this.options);

    assert.equal(point.getLabel(), labelModule.Label.returnValues[0]);
});

QUnit.test('Point translation', function(assert) {
    let point = createPoint(this.series, this.data, this.options);

    point.translate();

    assert.strictEqual(point.translated, true);
});

QUnit.test('Set default coords', function(assert) {
    let point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.setDefaultCoords();

    assert.strictEqual(point.y, 'default_position', 'Y');
    assert.strictEqual(point.x, 50, 'X');
});

QUnit.test('Set default coords. Rotated', function(assert) {
    this.options.rotated = true;
    let point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.setDefaultCoords();

    assert.strictEqual(point.x, 'default_position', 'X');
    assert.strictEqual(point.y, 50, 'Y');
});

QUnit.test('getCenterCoord', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.translate();

    assert.deepEqual(point.getCenterCoord(), { x: 50, y: 100 });
});

QUnit.module('getBoundingRect', {});

QUnit.test('getBoundingRect', function(assert) {
    assert.deepEqual(createSimplePoint({ x: 8, y: 8 }).getBoundingRect(), {
        height: 12,
        width: 12,
        x: 2,
        y: 2
    });
});

// Helpers
function createSimplePoint(coord) {
    var point = createPoint({
        _argumentChecker: function() { return true; },
        _valueChecker: function() { return true; }
    }, [{}], { widgetType: 'chart', visible: true, styles: { normal: { r: 6 }, hover: { r: 6 } } });
    point.x = coord.x;
    point.y = coord.y;
    return point;
}
