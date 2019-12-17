import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import pointModule from 'viz/series/points/base_point';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;
const mixins = SeriesModule.mixins;
import { insertMockFactory, MockTranslator, MockAxis, restoreMockFactory } from '../../helpers/chartMocks.js';

const originalPoint = pointModule.Point;
const chartSeriesNS = mixins.chart;

var createSeries = function(options, settings) {
    settings = settings || {};
    settings.renderer = settings.renderer || new vizMocks.Renderer();
    var seriesGroup = settings.renderer.g(),
        labelsGroup = settings.renderer.g();

    options = $.extend(true, {
        type: 'mockType',
        visible: true,
        point: {
            hoverStyle: {},
            selectionStyle: {}
        },
        border: { visible: false },
        label: {
            font: {},
            connector: {},
            border: {}
        },
        style: 'normal',
        hoverStyle: {
            style: 'hover',
            border: { visible: false }
        },
        selectionStyle: {
            style: 'selection',
            border: { visible: false }
        },
        valueErrorBar: {},
        widgetType: 'chart'
    }, options);

    settings = $.extend({
        seriesGroup: seriesGroup,
        labelsGroup: labelsGroup,
        commonSeriesModes: {},
        eventPipe: commonUtils.noop,
        eventTrigger: commonUtils.noop,
        incidentOccurred: commonUtils.noop
    }, settings);

    return new Series(settings, options);
};

var environment = {
    beforeEach: function() {
        var _this = this;
        _this.pointsCreatingCount = 0;
        insertMockFactory();

        this.renderer = new vizMocks.Renderer();
        _this.realCreatePoint = pointModule.Point;
        pointModule.Point = function() {
            _this.pointsCreatingCount++;
            var point = _this.realCreatePoint.apply(null, arguments);
            point.setInvisibility = sinon.stub();
            return point;
        };

        chartSeriesNS['mocktype'] = {
            stylesHistory: [],
            _getRangeData: function() {
                return { isStub: true };
            },
            _getCreatingPointOptions: function() {

            },
            _applyTrackersClippings: commonUtils.noop,
            _generateDefaultSegments: function() { },
            _applyVisibleArea: function() { },
            _createGroups: function() {
                this._labelsGroup = _this.renderer.g();
                this.groupsCreated = true;
            },
            _prepareSeriesToDrawing: function() { },
            _endUpdateData: function() { },
            _calculateErrorBars: function() {

            },
            _setGroupsSettings: function() {
                this.groupsSetSettings = true;
            },
            _checkData: function() {
                return true;
            },
            _updateOptions: function() { },
            _appendInGroup: function() {
                this._group.append(this._extGroups.seriesGroup);
            },

            _drawPoint: function(options) {
                this.drawPointParams = this.drawPointParams || [];
                this.drawPointParams.push(options);
                this.drawnPoints = this.drawnPoints || [];
                // ok(point.translated, "point not translate before drawing"); // TO DO - move to tests
                if(options.hasAnimation) {
                    options.point.startPosition = true;
                }
                this.drawnPoints.push(options.point);
            },
            _prepareSegment: function(segment) {
                return segment;
            },
            _drawSegment: function(segment, animationEnabled, num) {
                this.drawnSegments = this.drawnSegments || [];
                this.drawnSegments.push({ segment: segment, num: num, animationEnabled: animationEnabled });
            },
            _animate: function() {
                this.animated = true;
            },
            _createPointStyles: function() {

            },
            _getPointOptions: function() {
                return {};
            },
            _preparePointOptions: function() {
                return this._options.point;
            },
            _getPointDataSelector: function() {
                return function(dataItem) {
                    return {
                        argument: dataItem.arg,
                        value: typeUtils.isDefined(dataItem.val1) ? dataItem.val1 : dataItem.val,
                        minValue: dataItem.val2,
                        highValue: dataItem.h,
                        lowValue: dataItem.l
                    };
                };
            },
            _resample: function() {
                this.resampleArgs = $.makeArray(arguments);
                return [];
            },
            _applyStyle: function(style) {
                this.stylesHistory.push(style);
            },
            _parseStyle: function(options) {
                return options.style;
            },
            _drawTrackerElement: function() {
                return _this.renderer.g();
            }
        };

        mixins.pie['mocktype'] = mixins.chart['mocktype'];
    },
    afterEach: function() {
        pointModule.Point = this.realCreatePoint;
        restoreMockFactory();
    }
};

var createPoint = function() {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.hasCoords.returns(true);
    stub.isInVisibleArea.returns(true);
    return stub;
};
var mockPoints = [createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint()];
var environmentWithSinonStubPoint = {
    beforeEach: function() {
        environment.beforeEach.call(this);
        var mockPointIndex = 0;
        this.createPoint = sinon.stub(pointModule, 'Point', function(series, data) {
            var stub = mockPoints[mockPointIndex++];
            stub.series = series;
            stub.argument = data.argument || 1;
            stub.value = data.value || 11;
            stub.fullState = 0;
            stub.hasValue.returns(true);
            stub.hasCoords.returns(true);
            stub.isInVisibleArea.returns(true);
            stub.draw.reset();
            stub.update.reset();
            stub.coordsIn.reset();
            stub.applyView.reset();
            stub.setView.reset();
            stub.resetView.reset();
            stub.animate.reset();
            stub.clearVisibility.reset();
            stub.setInvisibility.reset();
            stub.hideMarker.reset();
            stub.visibleTopMarker = true;
            stub.visibleBottomMarker = true;
            stub.hide.reset();
            stub.isHovered.returns(false);
            stub.isSelected.returns(false);
            stub.coordsIn.returns(false);
            stub._label = {
                hasText: function() { return false; },
                draw: sinon.spy()
            };
            return stub;
        });
    },
    afterEach: function() {
        this.createPoint.restore();
        environment.afterEach.call(this);
    }
};

function getTranslator(min, max, start, end, canvasLength) {
    var translator = new MockTranslator({
        minVisible: min,
        maxVisible: max
    });
    translator.canvasLength = canvasLength;
    return translator;
}

QUnit.module('Creation', environment);

QUnit.test('Empty data Series', function(assert) {
    var series = createSeries();

    assert.ok(series, 'Series should be created');
    assert.equal(series._checkData, chartSeriesNS['mocktype']._checkData, 'Series should have createPoint function');
    assert.equal(series._processPoint, chartSeriesNS['mocktype']._processPoint, 'Series should have processPoint function');
    assert.equal(series._segmentPoints, chartSeriesNS['mocktype']._segmentPoints, 'Series should have segmentPoints function');
    assert.ok(series._options, 'Series must have options');
    assert.deepEqual(series._group._stored_settings, { 'class': 'dxc-series' }, 'series has group');
    assert.equal(series.argumentAxisType, undefined);
    assert.equal(series.argumentType, undefined);
    assert.equal(series.valueAxisType, undefined);
    assert.equal(series.valueType, undefined);
    assert.ok(!series.canRenderCompleteHandle());
    assert.ok(series.groupsCreated);
});

QUnit.test('Series axis, pane passing', function(assert) {
    var series = createSeries({
        type: 'line',
        pane: 'somePane'
    }, { valueAxis: { name: 'someAxis' } });

    assert.ok(series);
    assert.equal(series.axis, 'someAxis');
    assert.equal(series.pane, 'somePane');
});

QUnit.test('Tag', function(assert) {
    var tag = {},
        series = createSeries({
            type: 'line',
            tag: tag
        });

    assert.ok(series);
    assert.deepEqual(series.tag, tag);
});

QUnit.test('Stack', function(assert) {
    var series = createSeries({ type: 'bar', stack: 's1' });

    assert.ok(series, 'series should be exist');
    assert.equal(series.stack, 's1', 'series should have a stack field');
});

QUnit.test('BarOverlapGroup', function(assert) {
    var series = createSeries({ type: 'bar', barOverlapGroup: 'g1' });

    assert.ok(series, 'series should be exist');
    assert.equal(series.barOverlapGroup, 'g1', 'series should have a barOverlapGroup field');
});

QUnit.test('isStacked. stackedline', function(assert) {
    var series = createSeries({
        type: 'stackedline'
    });

    assert.ok(series);
    assert.ok(series.isStackedSeries());
});

QUnit.test('isStacked. line', function(assert) {
    var series = createSeries({
        type: 'line'
    });

    assert.ok(series);
    assert.ok(!series.isStackedSeries());
});

QUnit.test('isFullStacked. fullstackedline', function(assert) {
    var series = createSeries({
        type: 'fullstackedline'
    });

    assert.ok(series);
    assert.ok(series.isFullStackedSeries());
});

QUnit.test('isFullStacked. stackedline', function(assert) {
    var series = createSeries({
        type: 'stackedline'
    });

    assert.ok(series);
    assert.ok(!series.isFullStackedSeries());
});

QUnit.test('isFinancial. stock', function(assert) {
    var series = createSeries({
        type: 'stock'
    });

    assert.ok(series);
    assert.ok(series.isFinancialSeries());
});

QUnit.test('isFinancial. candlestick', function(assert) {
    var series = createSeries({
        type: 'candlestick'
    });

    assert.ok(series);
    assert.ok(series.isFinancialSeries());
});

QUnit.test('isFinancial. line', function(assert) {
    var series = createSeries({
        type: 'line'
    });

    assert.ok(series);
    assert.ok(!series.isFinancialSeries());
});

QUnit.test('Creation with null type', function(assert) {
    var series = createSeries({
        type: null
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with incorrect type. String', function(assert) {
    var series = createSeries({
        type: 'abc'
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with incorrect type. Number', function(assert) {
    var series = createSeries({
        type: 6
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with incorrect type. Datetime', function(assert) {
    var series = createSeries({
        type: new Date(2011, 6, 5)
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with incorrect type with set widgetType(pieChart)', function(assert) {
    var series = createSeries({
        type: 'line',
        widgetType: 'pie'
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with incorrect type with set widgetType(chart)', function(assert) {
    var series = createSeries({
        type: 'pie',
        widgetType: 'chart'
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
    assert.ok(!series.groupsCreated);
});

QUnit.test('Creation with incorrect type with set widgetType(polar), spider bar', function(assert) {
    var series = createSeries({
        type: 'bar',
        widgetType: 'polar',
        spiderWidget: true
    });

    assert.ok(series);
    assert.ok(!series.isUpdated);
});

QUnit.test('Creation with set widgetType(polar), not spider, bar', function(assert) {
    var series = createSeries({
        type: 'bar',
        widgetType: 'polar'
    });

    assert.ok(series);
    assert.ok(series.isUpdated);
});

QUnit.test('Creation with case-insensitive type', function(assert) {
    var series = createSeries({
        type: 'LiNe'
    });

    assert.ok(series);
    assert.equal(series.type, 'line');
    assert.ok(series.isUpdated);
});

QUnit.test('Update on null type', function(assert) {
    var options = {
            type: 'line',
            visible: true,
            point: {
                hoverStyle: {},
                selectionStyle: {}
            },
            label: {
                font: {},
                connector: {},
                border: {}
            },
            style: 'normal',
            hoverStyle: {
                style: 'hover'
            },
            selectionStyle: {
                style: 'selection'
            },
            widgetType: 'chart'
        },
        series = createSeries(options);

    var disposeSpy = sinon.spy(series, 'dispose');
    var newOptions = $.extend(true, {}, options, { type: null });
    series.updateOptions(newOptions);

    assert.ok(series);
    assert.ok(!series.isUpdated);
    assert.ok(disposeSpy.calledOnce);
    assert.ok(!series.groupsCreated);
});

QUnit.test('Update on incorrect type', function(assert) {
    var options = {
            type: 'line',
            visible: true,
            point: {
                hoverStyle: {},
                selectionStyle: {}
            },
            label: {
                font: {},
                connector: {},
                border: {}
            },
            style: 'normal',
            hoverStyle: {
                style: 'hover'
            },
            selectionStyle: {
                style: 'selection'
            },
            widgetType: 'chart'
        },
        series = createSeries(options);

    var disposeSpy = sinon.spy(series, 'dispose');
    var newOptions = $.extend(true, {}, options, { type: 'abc' });
    series.updateOptions(newOptions);

    assert.ok(series);
    assert.ok(!series.isUpdated);
    assert.ok(disposeSpy.calledOnce);
    assert.ok(!series.groupsCreated);
});

QUnit.test('Options merging - title from name', function(assert) {
    // arrange
    var options = {
        name: 'title1'
    };
    // act
    var series = createSeries(options);
    // assert
    assert.strictEqual(series.name, 'title1');
});

QUnit.test('Options merging - type', function(assert) {
    // arrange
    var options = {
        type: 'mocktype'
    };
    // act
    var series = createSeries(options);
    // assert
    assert.strictEqual(series.type, 'mocktype');
});

QUnit.test('Update series when data is empty', function(assert) {
    var series = createSeries();

    series.updateData([]);

    assert.ok(series, 'Series should be created');

    assert.ok(series.getAllPoints(), 'Series points should be created');
    assert.equal(series.getAllPoints().length, 0, 'Points length should be 0');
});

QUnit.test('Update series data when points are empty', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options),
        data = [{ arg: 1, val: 10 }];

    series.updateData(data);
    series.createPoints();

    assert.ok(series.getAllPoints(), 'Series points should be created');
    assert.equal(series.getAllPoints().length, 1, 'Series should have 1 point');
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 1, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 10, 'Val');
    assert.ok(series.canRenderCompleteHandle());
});

QUnit.test('Update series data when points are not empty. Old points length = new points length', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options),
        data = [{ arg: 1, val: 10 }],
        newData = [{ arg: 3, val: 4 }];

    series.updateData(data);
    series.createPoints();
    series.updateData(newData);
    series.createPoints();

    assert.ok(series.getAllPoints(), 'Series points should be created');
    assert.equal(series.getAllPoints().length, 1, 'Series should have 1 point');
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 3, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 4, 'Val');
    assert.ok(series.canRenderCompleteHandle());
});

QUnit.test('Update series data when points are not empty. Old points length > new points length', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options),
        data = [{ arg: 1, val: 10 }, { arg: 2, val: 11 }],
        newData = [{ arg: 3, val: 4 }];

    series.updateData(data);
    series.createPoints();

    series.getAllPoints().slice();
    series._points = [];
    series.updateData(newData);
    series.createPoints();

    assert.ok(series, 'Series should be created');

    assert.equal(series.getAllPoints()[0].mockOptions.argument, 3, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 4, 'Val');
    assert.equal(series.getAllPoints().length, 1);
});

QUnit.test('Create points for dataItems with coresponding series (series template)', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', nameField: 'series', name: '1', nameFieldValue: '1', label: { visible: false } },
        series = createSeries(options),
        data = [{ arg: 1, val: 10, series: '1' }, { arg: 2, val: 20, series: '2' }];

    series.updateData(data);
    series.createPoints();

    assert.ok(series.getAllPoints(), 'Series points should be created');
    assert.equal(series.getAllPoints().length, 1, 'Series should have 1 point');
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 1, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 10, 'Val');
    assert.ok(series.canRenderCompleteHandle());
});

// T688232
QUnit.test('Create points when series\' name and value of value nameField are different', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', nameField: 'series', name: 'customName', nameFieldValue: '1', label: { visible: false } },
        series = createSeries(options);

    series.updateData([{ arg: 1, val: 10, series: '1' }]);
    series.createPoints();

    assert.equal(series.getAllPoints().length, 1, 'Series should have 1 point');
});

QUnit.test('Update series data when points are not empty. Old points length < new points length', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        }),
        data = [{ arg: 1, val: 10 }],
        newData = [{ arg: 3, val: 4 }, { arg: 4, val: 11 }];

    series.updateData(data);
    series.createPoints();

    series.updateData(newData);
    series.createPoints();

    assert.ok(series, 'Series should be created');

    assert.ok(series.getAllPoints(), 'Series points should be created');
    assert.equal(series.getAllPoints().length, 2, 'Series should have 2 points');
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 3, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 4, 'Val');
    assert.equal(series.getAllPoints()[1].mockOptions.argument, 4, 'Arg');
    assert.equal(series.getAllPoints()[1].mockOptions.value, 11, 'Val');
    assert.equal(this.pointsCreatingCount, 3);
});

QUnit.test('Update series data when points are not empty. Points with same argument should be updated', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        }),
        data = [{ arg: 1, val: 10 }],
        newData = [{ arg: 1, val: 4 }, { arg: 4, val: 11 }];

    series.updateData(data);
    series.createPoints();

    series.updateData(newData);
    series.createPoints();

    assert.equal(series.getAllPoints().length, 2, 'Series should have 1 point');
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 1, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 4, 'Val');
    assert.equal(series.getAllPoints()[1].mockOptions.argument, 4, 'Arg');
    assert.equal(series.getAllPoints()[1].mockOptions.value, 11, 'Val');
    assert.equal(this.pointsCreatingCount, 2);
});

QUnit.test('Update points when series has several points at the same argument', function(assert) {
    var options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } },
        series = createSeries(options, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        }),
        data = [{ arg: 1, val: 10 }, { arg: 1, val: 10 }],
        newData = [{ arg: 1, val: 4 }, { arg: 1, val: 5 }, { arg: 4, val: 11 }];

    series.updateData(data);
    series.createPoints();

    series.updateData(newData);
    series.createPoints();

    assert.equal(series.getAllPoints().length, 3);
    assert.equal(series.getAllPoints()[0].mockOptions.argument, 1, 'Arg');
    assert.equal(series.getAllPoints()[0].mockOptions.value, 4, 'Val');
    assert.equal(series.getAllPoints()[1].mockOptions.argument, 1, 'Arg');
    assert.equal(series.getAllPoints()[1].mockOptions.value, 5, 'Val');

    assert.equal(series.getAllPoints()[2].mockOptions.argument, 4, 'Arg');
    assert.equal(series.getAllPoints()[2].mockOptions.value, 11, 'Val');
    assert.equal(this.pointsCreatingCount, 3);
});

QUnit.test('IncidentOccurred was not called with empty data', function(assert) {
    const data = [];
    const incidentOccurred = sinon.spy();
    const options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } };
    const series = createSeries(options, {
        incidentOccurred: incidentOccurred
    });

    series.updateData(data);

    assert.strictEqual(incidentOccurred.callCount, 0);
});

QUnit.test('IncidentOccurred. Data without argument field', function(assert) {
    const data = [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }];
    const incidentOccurred = sinon.spy();
    const options = { type: 'mockType', argumentField: 'arg', valueField: 'val', label: { visible: false } };
    const series = createSeries(options, {
        incidentOccurred: incidentOccurred
    });

    series.updateData(data);

    assert.strictEqual(incidentOccurred.callCount, 1);
    assert.strictEqual(incidentOccurred.lastCall.args[0], 'W2002');
});

QUnit.module('ErrorBars', environmentWithSinonStubPoint);

QUnit.test('Pass errorBars options to point (on creation). ErrorBars are not visible', function(assert) {
    // arrange
    var series = createSeries({
            type: 'line',
            valueErrorBar: {
                someErrorBarsProperty: true
            }
        }),
        data = [{ arg: 1, val: 2 }];

    series.areErrorBarsVisible = function() { return false; };
    // act
    series.updateData(data);
    series.createPoints();
    // assert
    series.getPoints();

    assert.equal(this.createPoint.callCount, 1);
    assert.deepEqual(this.createPoint.firstCall.args[2].errorBars, undefined, 'error bars options do not passed to point');
});

QUnit.test('Pass errorBars options to point (on creation). ErrorBars are visible', function(assert) {
    // arrange
    var series = createSeries({
            type: 'line',
            valueErrorBar: {
                someErrorBarsProperty: true
            }
        }),
        data = [{ arg: 1, val: 2 }];
    series.areErrorBarsVisible = function() { return true; };
    // act
    series.updateData(data);
    series.createPoints();
    // assert
    series.getPoints();

    assert.equal(this.createPoint.callCount, 1);
    assert.deepEqual(this.createPoint.firstCall.args[2].errorBars, { someErrorBarsProperty: true }, 'error bars options passed to point');
});

QUnit.test('Pass errorBars options to point (on update). ErrorBars are not visible', function(assert) {
    // arrange
    var series = createSeries({
            type: 'line', valueErrorBar: {
                someErrorBarsProperty: true
            }
        }),
        data = [{ arg: 1, val: 2 }],
        points;
    series.areErrorBarsVisible = function() { return false; };
    series.updateData(data);
    series.createPoints();

    // act
    series.updateOptions($.extend(true, {}, series.getOptions(), { valueErrorBar: { error: true } }));
    series.updateData(data);
    series.createPoints();
    points = series.getPoints();

    // assert
    assert.equal(points[0].update.callCount, 1);
    assert.deepEqual(points[0].update.firstCall.args[1].errorBars, undefined, 'errorBars options do not passed to point');
});

QUnit.test('Pass errorBars options to point (on update). ErrorBars are visible', function(assert) {
    // arrange
    var series = createSeries({
            type: 'line', valueErrorBar: {
                someErrorBarsProperty: true
            }
        }),
        data = [{ arg: 1, val: 2 }],
        points;
    series.areErrorBarsVisible = function() { return true; };
    series.updateData(data);
    series.createPoints();

    // act
    series.updateOptions($.extend(true, {}, series.getOptions(), {
        valueErrorBar: { error: true },
        test_errorBarsVisible: true
    }));
    series.updateData(data);
    series.createPoints();
    points = series.getPoints();

    // assert
    assert.equal(points[0].update.callCount, 1);
    assert.deepEqual(points[0].update.firstCall.args[1].errorBars, { someErrorBarsProperty: true, error: true }, 'errorBars options passed to point');
});

QUnit.module('tag to points', {
    beforeEach: function() {
        this.spy = sinon.spy(pointModule, 'Point');
        this.data = [{ arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }];
    },
    afterEach: function() {
        pointModule.Point.restore();
    }
});

QUnit.test('No any tag to point.', function(assert) {
    var series = createSeries({
        type: 'line'
    });

    series.updateData(this.data);
    series.createPoints();

    assert.equal(this.spy.callCount, 3);
    assert.strictEqual(this.spy.firstCall.args[0].tag, undefined);
    assert.strictEqual(this.spy.secondCall.args[0].tag, undefined);
    assert.strictEqual(this.spy.thirdCall.args[0].tag, undefined);
});

QUnit.test('Default tag field name.', function(assert) {
    var tag1 = { a1: 1 },
        tag2 = { a2: 2 },
        tag3 = { a3: 3 },
        series = createSeries({
            type: 'line'
        });

    this.data[0].tag = tag1;
    this.data[1].tag = tag2;
    this.data[2].tag = tag3;

    series.updateData(this.data);
    series.createPoints();

    assert.equal(this.spy.callCount, 3);
    assert.deepEqual(this.spy.firstCall.args[1].tag, tag1);
    assert.deepEqual(this.spy.secondCall.args[1].tag, tag2);
    assert.deepEqual(this.spy.thirdCall.args[1].tag, tag3);
});

QUnit.test('Custom tag field name.', function(assert) {
    var tag1 = { a1: 1 },
        tag2 = { a2: 2 },
        tag3 = { a3: 3 },
        series = createSeries({
            type: 'line',
            tagField: 'tag1'
        });

    this.data[0].tag1 = tag1;
    this.data[1].tag1 = tag2;
    this.data[2].tag1 = tag3;

    series.updateData(this.data);
    series.createPoints();

    assert.equal(this.spy.callCount, 3);
    assert.deepEqual(this.spy.firstCall.args[1].tag, tag1);
    assert.deepEqual(this.spy.secondCall.args[1].tag, tag2);
    assert.deepEqual(this.spy.thirdCall.args[1].tag, tag3);
});

QUnit.module('Updating', environment);

QUnit.test('Check customize point options', function(assert) {
    var pointOptions = [],
        series = createSeries({
            name: 'Series 1',
            type: 'line',
            label: { visible: false },
            customizePoint: function(arg) {
                pointOptions.push(arg);
            }
        }),
        data = [{ arg: 1, val: 3 }, { arg: 2, val: 4 }];

    series.updateData(data);
    series.createPoints();

    assert.equal(pointOptions.length, 2);

    assert.equal(pointOptions[0].index, 0);
    assert.equal(pointOptions[0].argument, 1);
    assert.equal(pointOptions[0].value, 3);
    assert.equal(pointOptions[0].seriesName, 'Series 1');
    assert.equal(pointOptions[0].series, series);

    assert.equal(pointOptions[1].index, 1);
    assert.equal(pointOptions[1].argument, 2);
    assert.equal(pointOptions[1].value, 4);
    assert.equal(pointOptions[1].seriesName, 'Series 1');
    assert.equal(pointOptions[1].series, series);
});

QUnit.test('Check customize label options', function(assert) {
    var pointOptions = [],
        series = createSeries({
            name: 'Series 1',
            type: 'line',
            label: { visible: true },
            customizeLabel: function(arg) {
                pointOptions.push(arg);
            }
        }),
        data = [{ arg: 1, val: 3 }, { arg: 2, val: 4 }];

    series.updateData(data);
    series.createPoints();

    assert.equal(pointOptions.length, 2);

    assert.equal(pointOptions[0].index, 0);
    assert.equal(pointOptions[0].argument, 1);
    assert.equal(pointOptions[0].value, 3);
    assert.equal(pointOptions[0].seriesName, 'Series 1');
    assert.equal(pointOptions[0].series, series);

    assert.equal(pointOptions[1].index, 1);
    assert.equal(pointOptions[1].argument, 2);
    assert.equal(pointOptions[1].value, 4);
    assert.equal(pointOptions[1].seriesName, 'Series 1');
    assert.equal(pointOptions[1].series, series);
});

QUnit.test('T111893. Customize point and empty customize label result', function(assert) {
    var series = createSeries({
            name: 'Series 1',
            type: 'line',
            label: {
                visible: false,
                backgroundColor: '#123456'
            },
            customizePoint: function(arg) {
                return { color: 'red' };
            },
            customizeLabel: function() {
                return {};
            }
        }),
        data = [{ arg: 1, val: 3 }, { arg: 2, val: 4 }];

    series.updateData(data);
    series.createPoints();

    $.each(series.getAllPoints(), function(_, point) {
        assert.equal(point.updateOptions.lastCall.args[0].color, 'red');
        assert.equal(point.updateOptions.lastCall.args[0].label.background.fill, '#123456');
        assert.ok(point._label);
    });
});

QUnit.test('Update data with null values for argument', function(assert) {
    var series = createSeries({ type: 'line', label: { visible: false } });

    series.updateData([{ arg: 'A', val: 1 }, { arg: null, val: 2 }, { arg: 'C', val: 3 }]);
    series.createPoints();

    assert.equal(series.getAllPoints().length, 2, 'Series should have two points');
    assert.equal(series.getAllPoints()[0].argument, 'A', 'Argument should be correct');
    assert.equal(series.getAllPoints()[0].value, 1, 'Value should be correct');
    assert.equal(series.getAllPoints()[1].argument, 'C', 'Argument should be correct');
    assert.equal(series.getAllPoints()[1].value, 3, 'Value should be correct');
});

QUnit.test('Update data with null values for argument. Range series', function(assert) {
    var series = createSeries({ type: 'rangearea', label: { visible: false } });

    series.updateData([{ arg: 'A', val1: 1, val2: 2 }, { arg: null, val1: 2, val2: 2 }, { arg: 'C', val1: 3, val2: 2 }]);
    series.createPoints();

    var points = series.getAllPoints();

    assert.equal(points.length, 2, 'Series should have two points');

    assert.equal(points[0].argument, 'A', 'Argument should be correct');
    assert.equal(points[0].value, 2, 'Value should be correct');
    assert.equal(points[0].minValue, 1, 'Min value should be correct');

    assert.equal(points[1].argument, 'C', 'Argument should be correct');
    assert.equal(points[1].value, 2), 'Value should be correct';
    assert.equal(points[1].minValue, 3, 'Min value should be correct');
});

QUnit.test('Update data with null values for argument. Financial series', function(assert) {
    var series = createSeries({ type: 'stock', highValueField: 'h', openValueField: 'o', lowValueField: 'l', closeValueField: 'c', reduction: { level: 'close' }, label: { visible: false } });

    series.updateData([{ date: 'A', h: 10, l: 2, o: 4, c: 5 }, { date: null, h: 15, l: 2, o: 7, c: 8 }, { date: 'C', h: 20, l: 2, o: 4, c: 10 }]);
    series.createPoints();

    var points = series.getAllPoints();

    assert.equal(points.length, 2, 'Series should have two points');

    assert.equal(points[0].argument, 'A', 'Argument should be correct');
    assert.equal(points[0].value, 5, 'Value should be correct');
    assert.equal(points[0].highValue, 10, 'High value should be correct');
    assert.equal(points[0].lowValue, 2, 'Low value should be correct');
    assert.equal(points[0].openValue, 4, 'Open value should be correct');
    assert.equal(points[0].closeValue, 5, 'Close value should be correct');

    assert.equal(points[1].argument, 'C', 'Argument should be correct');
    assert.equal(points[1].value, 10, 'Value should be correct');
    assert.equal(points[1].highValue, 20, 'High value should be correct');
    assert.equal(points[1].lowValue, 2, 'Low value should be correct');
    assert.equal(points[1].openValue, 4, 'Open value should be correct');
    assert.equal(points[1].closeValue, 10, 'Close value should be correct');
});

QUnit.module('Drawing', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.seriesGroup = this.renderer.g({});

        this.argumentAxis = new MockAxis({
            renderer: this.renderer
        });

        this.series = createSeries({}, {
            seriesGroup: this.seriesGroup,
            labelsGroup: this.renderer.g(),
            argumentAxis: this.argumentAxis,
            valueAxis: new MockAxis({
                renderer: this.renderer
            })
        });
        this.renderer = this.series._renderer;
    },
    afterEach: environment.afterEach
});

QUnit.test('Draw without data', function(assert) {
    var series = this.series;

    series.draw(false);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.deepEqual(series.drawnPoints, undefined);
    assert.deepEqual(series.drawnSegments, undefined);
});

QUnit.test('Draw simple data. Without animation', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();

    series.draw(false);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.deepEqual(series.drawnPoints, series.getAllPoints());
    assert.ok(!series.getAllPoints()[0].startPosition);
    assert.deepEqual(series.drawnSegments, [{ segment: series.getAllPoints(), num: 0, animationEnabled: false }], 'drawn segments');
});

QUnit.test('Draw simple data. First drawing', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();

    series.draw(false);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.deepEqual(series.drawnPoints, series.getAllPoints());
    assert.ok(!series.getAllPoints()[0].startPosition);
    assert.deepEqual(series.drawnSegments, [{ segment: series.getAllPoints(), num: 0, animationEnabled: false }], 'drawn segments');
});

QUnit.test('Draw simple data. With animation', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }, { arg: 12, val: 1 }, { arg: 1, val: 13 }]);
    series.createPoints();

    series.draw(true);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.deepEqual(series.drawnPoints, series.getAllPoints());
    assert.ok(series.getAllPoints()[0].startPosition);
    assert.ok(series.getAllPoints()[1].startPosition);
    assert.ok(series.getAllPoints()[2].startPosition);
    assert.deepEqual(series.drawnSegments, [{ segment: series.getAllPoints(), num: 0, animationEnabled: true }]);
});

QUnit.test('Draw simple data. hide layout labels = false', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    var hideLabelsSpy = sinon.spy(series, 'hideLabels');

    series.draw(false, false);

    assert.ok(!hideLabelsSpy.called);
});

QUnit.test('Draw simple data. hide layout labels = true', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    var hideLabelsSpy = sinon.spy(series, 'hideLabels');

    series.draw(false, true);

    assert.ok(hideLabelsSpy.calledOnce);
});

QUnit.test('Draw simple data with null values', function(assert) {
    var series = this.series,
        points;

    series.updateData([{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: null }, { arg: 44, val: 2 }, { arg: 55, val: null }, { arg: 66, val: 3 }]);
    series.createPoints();
    points = series.getAllPoints();

    series.draw(true);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.deepEqual(series.drawnPoints, [points[0], points[1], points[3], points[5]]);


    assert.equal(series.drawnSegments.length, 3, 'segments count');
    assert.deepEqual(series.drawnSegments[0], {
        segment: [points[0], points[1]],
        num: 0,
        animationEnabled: true
    });

    assert.deepEqual(series.drawnSegments[1], {
        segment: [points[3]],
        num: 1,
        animationEnabled: true
    });

    assert.deepEqual(series.drawnSegments[2], {
        segment: [points[5]],
        num: 2,
        animationEnabled: true
    });

});

QUnit.test('Draw simple data with null values. Three null in row', function(assert) {
    var series = this.series,
        points;

    series.updateData([{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: null }, { arg: 44, val: null }, { arg: 55, val: null }, { arg: 66, val: 3 }]);
    series.createPoints();
    points = series.getAllPoints();

    series.draw(true);

    assert.ok(series.groupsSetSettings);
    assert.equal(series._group.parent, this.seriesGroup);
    assert.equal(series.drawnPoints.length, 3);

    assert.deepEqual(series.drawnPoints, [points[0], points[1], points[5]], 'drawn points');


    assert.equal(series.drawnSegments.length, 2, 'segments count');
    assert.deepEqual(series.drawnSegments[0], {
        segment: [points[0], points[1]],
        num: 0,
        animationEnabled: true
    }, 'first segment drawn');


    assert.deepEqual(series.drawnSegments[1], {
        segment: [points[5]],
        num: 1,
        animationEnabled: true
    }, 'second segment drawn');
});

QUnit.test('Style of marker group. Scatter', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(false);

    assert.ok(series._markersGroup);
    assert.equal(series._markersGroup._stored_settings.fill, 'red');
    assert.equal(series._markersGroup._stored_settings.stroke, 'yellow');
    assert.equal(series._markersGroup._stored_settings['stroke-width'], 2);
    assert.equal(series._markersGroup._stored_settings.visibility, 'visible');
});

QUnit.test('Style of marker group. Line', function(assert) {
    var series = this.series,
        options = {
            type: 'line',
            point: {
                visible: false,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(false);

    assert.ok(series._markersGroup);
    assert.equal(series._markersGroup._stored_settings.fill, 'red');
    assert.equal(series._markersGroup._stored_settings.stroke, 'yellow');
    assert.equal(series._markersGroup._stored_settings['stroke-width'], 2);
    assert.equal(series._markersGroup._stored_settings.visibility, 'hidden');
});

QUnit.test('Update marker group', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: false,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(true);
    series._markersGroup.stub('attr').reset();
    this.renderer.stub('g').reset();

    series.draw(true);

    assert.ok(series._markersGroup.stub('attr').calledOnce);
    assert.ok(!this.renderer.stub('g').called);
});

QUnit.test('marker group style after updating', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: false,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        },
        appliedOptions = $.extend(true, {}, series._options, options);

    series.updateOptions(appliedOptions);

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(true);

    series._markersGroup.stub('attr').reset();
    this.renderer.stub('g').reset();

    var newOptions = $.extend(true, {}, appliedOptions);
    newOptions.point.color = 'green';
    newOptions.point.border = {
        color: 'blue',
        width: 3,
        visible: true
    };
    series.updateOptions(newOptions);
    series.draw(true);

    assert.ok(series._markersGroup.stub('attr').calledOnce);
    assert.equal(series._markersGroup.stub('attr').lastCall.args[0].fill, 'green');
    assert.equal(series._markersGroup.stub('attr').lastCall.args[0].stroke, 'blue');
    assert.equal(series._markersGroup.stub('attr').lastCall.args[0]['stroke-width'], 3);
    assert.ok(!this.renderer.stub('g').called);
});

QUnit.test('Style of marker group. Financial', function(assert) {
    var series = this.series,
        options = {
            type: 'stock',
            reduction: {
                color: 'blue'
            },
            width: 2,
            color: 'red'
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(true);

    assert.ok(series._markersGroup);
    assert.equal(series._markersGroup.defaultMarkersGroup._stored_settings.fill, 'red');
    assert.equal(series._markersGroup.defaultMarkersGroup._stored_settings.stroke, 'red');
    assert.equal(series._markersGroup.defaultMarkersGroup._stored_settings['stroke-width'], 2);

    assert.equal(series._markersGroup.reductionMarkersGroup._stored_settings.fill, 'blue');
    assert.equal(series._markersGroup.reductionMarkersGroup._stored_settings.stroke, 'blue');
    assert.equal(series._markersGroup.reductionMarkersGroup._stored_settings['stroke-width'], 2);

    assert.equal(series._markersGroup.defaultPositiveMarkersGroup._stored_settings.stroke, 'red');
    assert.equal(series._markersGroup.defaultPositiveMarkersGroup._stored_settings['stroke-width'], 2);

    assert.equal(series._markersGroup.reductionPositiveMarkersGroup._stored_settings.stroke, 'blue');
    assert.equal(series._markersGroup.reductionPositiveMarkersGroup._stored_settings['stroke-width'], 2);
});

QUnit.test('Update marker group. Financial', function(assert) {
    var series = this.series,
        options = {
            type: 'stock',
            reduction: {
                color: 'blue'
            },
            width: 2,
            color: 'red'
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(true);

    series._markersGroup.defaultMarkersGroup.stub('attr').reset();
    series._markersGroup.reductionMarkersGroup.stub('attr').reset();
    series._markersGroup.defaultPositiveMarkersGroup.stub('attr').reset();
    series._markersGroup.reductionPositiveMarkersGroup.stub('attr').reset();
    this.renderer.stub('g').reset();

    series.draw(true);

    assert.ok(series._markersGroup.defaultMarkersGroup.stub('attr').calledOnce);
    assert.ok(series._markersGroup.reductionMarkersGroup.stub('attr').calledOnce);
    assert.ok(series._markersGroup.defaultPositiveMarkersGroup.stub('attr').calledOnce);
    assert.ok(series._markersGroup.reductionPositiveMarkersGroup.stub('attr').calledOnce);
    assert.ok(!this.renderer.stub('g').called);
});

QUnit.test('marker group style after updating. Financial', function(assert) {
    var series = this.series,
        options = {
            type: 'stock',
            reduction: {
                color: 'blue'
            },
            width: 2,
            color: 'red'
        },
        appliedOptions = $.extend(true, {}, series._options, options);

    series.updateOptions(appliedOptions);

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(true);

    series._markersGroup.defaultMarkersGroup.stub('attr').reset();
    series._markersGroup.reductionMarkersGroup.stub('attr').reset();
    series._markersGroup.defaultPositiveMarkersGroup.stub('attr').reset();
    series._markersGroup.reductionPositiveMarkersGroup.stub('attr').reset();
    this.renderer.stub('g').reset();

    var newOptions = $.extend(true, {}, appliedOptions);
    newOptions.color = 'green';
    newOptions.reduction.color = 'yellow';
    newOptions.width = 3;
    series.updateOptions(newOptions);
    series.draw(true);


    assert.ok(series._markersGroup.defaultMarkersGroup.stub('attr').calledOnce);
    assert.equal(series._markersGroup.defaultMarkersGroup.stub('attr').lastCall.args[0].fill, 'green');
    assert.equal(series._markersGroup.defaultMarkersGroup.stub('attr').lastCall.args[0].stroke, 'green');
    assert.equal(series._markersGroup.defaultMarkersGroup.stub('attr').lastCall.args[0]['stroke-width'], 3);

    assert.ok(series._markersGroup.reductionMarkersGroup.stub('attr').calledOnce);
    assert.equal(series._markersGroup.reductionMarkersGroup.stub('attr').lastCall.args[0].fill, 'yellow');
    assert.equal(series._markersGroup.reductionMarkersGroup.stub('attr').lastCall.args[0].stroke, 'yellow');
    assert.equal(series._markersGroup.reductionMarkersGroup.stub('attr').lastCall.args[0]['stroke-width'], 3);

    assert.ok(series._markersGroup.defaultPositiveMarkersGroup.stub('attr').calledOnce);
    assert.equal(series._markersGroup.defaultPositiveMarkersGroup.stub('attr').lastCall.args[0].stroke, 'green');
    assert.equal(series._markersGroup.defaultPositiveMarkersGroup.stub('attr').lastCall.args[0]['stroke-width'], 3);

    assert.ok(series._markersGroup.reductionPositiveMarkersGroup.stub('attr').calledOnce);
    assert.equal(series._markersGroup.reductionPositiveMarkersGroup.stub('attr').lastCall.args[0].stroke, 'yellow');
    assert.equal(series._markersGroup.reductionPositiveMarkersGroup.stub('attr').lastCall.args[0]['stroke-width'], 3);

    assert.ok(!this.renderer.stub('g').called);
});

QUnit.test('Update label group', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: false,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);

    series.draw(false);

    series._labelsGroup.stub('attr').reset();
    this.renderer.stub('g').reset();

    series.draw(false);

    assert.ok(series._labelsGroup.stub('attr').calledOnce);
    assert.ok(!this.renderer.stub('g').called);
});

QUnit.test('Dispose old points after drawing', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: false,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 1, val: 22 }, { arg: 2, val: 33 }, { arg: 3, val: 11 }]);
    series.createPoints();

    var points = series.getAllPoints();

    series.updateData([{ arg: 3, val: 11 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }, { arg: 6, val: 66 }]);
    series.createPoints();
    series.draw(false);

    assert.ok(points[0].disposed);
    assert.ok(points[1].disposed);
    assert.ok(!points[2].disposed);
});

QUnit.module('Disposing', {
    beforeEach: function() {
        var _this = this;
        environment.beforeEach.call(_this);
        _this.renderer = new vizMocks.Renderer();
        _this.seriesGroup = _this.renderer.g();

        _this.series = createSeries({
            border: {
                visible: true
            }
        }, {
            seriesGroup: _this.seriesGroup,
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });
        _this.renderer = _this.series._renderer;
    },
    afterEach: environment.afterEach
});

QUnit.test('Fields disposing', function(assert) {
    var series = this.series;

    series.updateData([{ arg: 1, val: 1 }]);
    series.draw(false);
    series.dispose();

    assert.strictEqual(series._renderer, null, 'renderer');
    assert.strictEqual(series._options, null, 'options');
    assert.strictEqual(series._styles, null, 'styles');

    assert.strictEqual(series._drawnPoints, null, 'drawn points');
    assert.strictEqual(series._pointOptions, null, 'point options');
    assert.strictEqual(series.pointsByArgument, null, 'points by argument');
    assert.strictEqual(series._segments, null, 'segments');
    assert.strictEqual(series._prevSeries, null, 'prev series (for stacked series)');
});

QUnit.test('Groups disposing when tracker not drawn', function(assert) {
    var series = this.series,
        errorBarGroup;

    series._elementsGroup = this.renderer.g();
    series._bordersGroup = this.renderer.g();
    series._labelsGroup = this.renderer.g();
    series._markersGroup = this.renderer.g();
    errorBarGroup = series._errorBarGroup = this.renderer.g();
    series._group = this.renderer.g();

    var groupDetachSpy = series._group.stub('dispose');
    var labelsDetachSpy = series._labelsGroup.stub('dispose');

    series.dispose();

    assert.ok(groupDetachSpy.calledOnce);
    assert.ok(labelsDetachSpy.calledOnce);
    assert.ok(errorBarGroup.remove.calledOnce);
    assert.strictEqual(series._group, null, 'group');
    assert.strictEqual(series._elementsGroup, null, 'elements group');
    assert.strictEqual(series._bordersGroup, null, 'borders group');
    assert.strictEqual(series._labelsGroup, null, 'labels group');
    assert.strictEqual(series._trackersGroup, null, 'labels group');
    assert.strictEqual(series._errorBarGroup, null, 'labels group');
});

QUnit.test('Groups disposing when tracker drawn', function(assert) {
    var series = this.series;

    series._elementsGroup = this.renderer.g();
    series._bordersGroup = this.renderer.g();
    series._labelsGroup = this.renderer.g();
    series._markersGroup = this.renderer.g();
    series._trackersGroup = this.renderer.g();
    series._group = this.renderer.g();
    series._segments = [[1, 2]];

    // TODO
    // series.drawTrackers();

    var groupDetachSpy = series._group.stub('dispose');
    var labelsDetachSpy = series._labelsGroup.stub('dispose');
    var trackersGroupSpy = series._trackersGroup.stub('dispose');

    series.dispose();

    assert.ok(groupDetachSpy.calledOnce);
    assert.ok(labelsDetachSpy.calledOnce);
    assert.strictEqual(series._group, null, 'group');
    assert.strictEqual(series._elementsGroup, null, 'elements group');
    assert.strictEqual(series._bordersGroup, null, 'borders group');
    assert.strictEqual(series._labelsGroup, null, 'labels group');
    assert.strictEqual(series._trackersGroup, null, 'labels group');

    assert.ok(trackersGroupSpy.called);
});

QUnit.test('Arrays disposing', function(assert) {
    var series = this.series,
        trackerElement = this.renderer.g();

    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();

    series.draw(false);

    var point = series.getAllPoints()[0];

    series._trackers = [trackerElement];

    series.dispose();

    assert.strictEqual(series._points, null, 'points');
    assert.strictEqual(series._trackers, null, 'trackers');
    assert.strictEqual(series._graphics, null, 'graphics');

    assert.ok(point.disposed, 'point');
    assert.ok(trackerElement.stub('remove').called, 'tracker');
});

QUnit.module('Apply clipping', {
    beforeEach: function() {
        var _this = this;
        environmentWithSinonStubPoint.beforeEach.call(_this);
        _this.renderer = new vizMocks.Renderer();
        _this.seriesGroup = _this.renderer.g();
        _this.series = createSeries({}, {
            renderer: _this.renderer,
            seriesGroup: _this.seriesGroup,
            labelsGroup: _this.renderer.g(),
            trackersGroup: _this.renderer.g(),
            markerTrackerGroup: _this.renderer.g(),
            valueAxis: new MockAxis({ renderer: _this.renderer }),
            argumentAxis: new MockAxis({ renderer: _this.renderer })
        });
        _this.options = {
            type: 'scatter',
            color: 'red',
            hoverStyle: {},
            selectionStyle: {},
            label: {
                font: {},
                border: {},
                connector: {}
            },
            visible: true,
            point: {
                hoverStyle: {},
                selectionStyle: {},
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            },
            valueErrorBar: {},
            widgetType: 'chart'
        };
    },
    afterEach: function() {
        environmentWithSinonStubPoint.afterEach.call(this);
        this.createPoint.restore();
    }
});

QUnit.test('ApplyClip', function(assert) {
    this.options.type = 'area';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    // act
    this.series.applyClip();

    assert.equal(this.series._group._stored_settings['clip-path'], 'baseClipId', 'elements group');
});

QUnit.test('Reset Clip', function(assert) {
    this.options.type = 'area';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    // act
    this.series.resetClip();

    assert.strictEqual(this.series._group._stored_settings['clip-path'], null, 'elements group');
});

QUnit.test('ApplyClip. Financial', function(assert) {
    this.options.type = 'stock';
    this.options.reduction = {};
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ date: 'First', low: 1, open: 1, close: 1, high: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    // act
    this.series.applyClip();

    assert.equal(this.series._group._stored_settings['clip-path'], 'baseClipId', 'elements group');
});

QUnit.test('Reset Clip. Financial', function(assert) {
    this.options.type = 'stock';
    this.options.reduction = {};
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ date: 'First', low: 1, open: 1, close: 1, high: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    // act
    this.series.resetClip();

    assert.strictEqual(this.series._group._stored_settings['clip-path'], null, 'elements group');
});

QUnit.test('Symbol. Without force', function(assert) {
    this.options.type = 'area';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.createPoints();
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);

    assert.equal(this.series._elementsGroup._stored_settings['clip-path'], 'baseClipId', 'elements group');
    assert.equal(this.series._bordersGroup._stored_settings['clip-path'], 'baseClipId', 'borders group');
    assert.strictEqual(this.series._markersGroup._stored_settings['clip-path'], null, 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Symbol. With force', function(assert) {
    this.options.type = 'area';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);
    this.series.createPoints();

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);

    assert.equal(this.series._elementsGroup._stored_settings['clip-path'], 'baseClipId', 'elements group');
    assert.equal(this.series._bordersGroup._stored_settings['clip-path'], 'baseClipId', 'borders group');
    assert.equal(this.series._markersGroup._stored_settings['clip-path'], 'baseClipId', 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Symbol. Without force. Without labels clipping', function(assert) {
    this.options.type = 'area';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.createPoints();
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false, false);
    this.series.draw(false);

    assert.notOk(this.series._labelsGroup._stored_settings['clip-path'], 'labels group');
});

QUnit.test('Symbol. Tracker. Without force', function(assert) {
    this.options.type = 'line';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    this.series._segments = [[1, 2]];

    this.series.drawTrackers();

    assert.strictEqual(this.series._trackersGroup._stored_settings['clip-path'], 'baseClipId', 'elements group');
});

QUnit.test('Symbol. Tracker. With force', function(assert) {
    this.options.type = 'line';
    this.options.border = { visible: true };
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);
    this.series._segments = [[1, 2]];

    this.series.drawTrackers();

    assert.equal(this.series._trackersGroup._stored_settings['clip-path'], 'baseClipId', 'elements group');
    assert.deepEqual(this.series._trackersGroup._stored_settings, {
        'class': 'dxc-trackers',
        'clip-path': 'baseClipId',
        'fill': 'gray',
        'opacity': 0.001,
        'stroke': 'gray'
    });
});

QUnit.test('Bar. Without force', function(assert) {
    this.options.type = 'bar';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series._visible = true;
    this.series.draw(false);

    assert.strictEqual(this.series._markersGroup._stored_settings['clip-path'], null, 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Bar. With force', function(assert) {
    this.options.type = 'bar';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);

    assert.strictEqual(this.series._markersGroup._stored_settings['clip-path'], null, 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Bubble. Without force', function(assert) {
    this.options.type = 'bubble';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], 'baseClipId', 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Bubble. With force', function(assert) {
    this.options.type = 'bubble';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], 'baseClipId', 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Pie. Without force', function(assert) {
    this.options.type = 'pie';
    this.options.widgetType = 'pie';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);
    this.series.createPoints();

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], undefined, 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], undefined, 'labels group');
});

QUnit.test('Pie. With force', function(assert) {
    this.options.type = 'pie';
    this.options.widgetType = 'pie';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);
    this.series.createPoints();

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], undefined, 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], undefined, 'labels group');
});

QUnit.test('Pie. Tracker. Without force', function(assert) {
    this.options.type = 'pie';
    this.options.widgetType = 'pie';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);
    this.series.createPoints();

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);
    this.series.drawTrackers();

    assert.equal(this.series._extGroups.trackersGroup._stored_settings['clip-path'], undefined, 'elements group');
    assert.equal(this.series._extGroups.markerTrackerGroup._stored_settings['clip-path'], undefined, 'borders group');
});

QUnit.test('Pie. Tracker. With force', function(assert) {
    this.options.type = 'pie';
    this.options.widgetType = 'pie';
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ arg: 'First', val: 1 }]);
    this.series.createPoints();

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);
    this.series.drawTrackers();

    assert.equal(this.series._extGroups.trackersGroup._stored_settings['clip-path'], undefined, 'elements group');
    assert.equal(this.series._extGroups.markerTrackerGroup._stored_settings['clip-path'], undefined, 'borders group');
});

QUnit.test('Financial. Without force', function(assert) {
    this.options.type = 'stock';
    this.options.reduction = {};
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ date: 'First', low: 1, open: 1, close: 1, high: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', false);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], 'wideClipId', 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.test('Financial. With force', function(assert) {
    this.options.type = 'stock';
    this.options.reduction = {};
    this.options.label.visible = true;

    this.series.updateOptions(this.options);
    this.series.updateData([{ date: 'First', low: 1, open: 1, close: 1, high: 1 }]);

    this.series.setClippingParams('baseClipId', 'wideClipId', true);
    this.series.draw(false);

    assert.equal(this.series._markersGroup._stored_settings['clip-path'], 'baseClipId', 'markers group');
    assert.equal(this.series._labelsGroup._stored_settings['clip-path'], 'baseClipId', 'labels group');
});

QUnit.module('Point visibility', {
    beforeEach: function() {
        var _this = this;
        environmentWithSinonStubPoint.beforeEach.call(_this);
        _this.renderer = new vizMocks.Renderer();
        _this.seriesGroup = _this.renderer.g();

        _this.series = createSeries({}, {
            seriesGroup: _this.seriesGroup,
            labelsGroup: _this.renderer.g(),
            markerTrackerGroup: _this.renderer.g(),
            argumentAxis: new MockAxis({ renderer: _this.renderer }),
            valueAxis: new MockAxis({ renderer: _this.renderer })
        });
        _this.renderer = _this.series._renderer;
    },
    afterEach: environmentWithSinonStubPoint.afterEach
});

QUnit.test('In visible area', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 'First', val: 1 }]);
    series.createPoints();

    series.draw(true);

    assert.ok(series.getAllPoints()[0].draw.calledOnce);
    assert.ok(series.getAllPoints()[0].clearVisibility.calledOnce);
    assert.ok(!series.getAllPoints()[0].hide.called);
});

QUnit.test('Not in visible area', function(assert) {
    var series = this.series,
        options = {
            type: 'scatter',
            point: {
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 'First', val: 1 }]);
    series.createPoints();

    series.getAllPoints()[0].isInVisibleArea.returns(false);
    series.draw(true);

    assert.ok(!series.getAllPoints()[0].draw.called);
    assert.ok(!series.getAllPoints()[0].clearVisibility.called);
    assert.ok(series.getAllPoints()[0].setInvisibility.calledOnce);
});

QUnit.test('Rangeseries. Top marker not in visible area', function(assert) {
    var series = this.series,
        options = {
            type: 'rangearea',
            border: {
                visible: true
            },
            point: {
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 'First', val1: 1, val2: 1 }]);
    series.createPoints();

    series.getAllPoints()[0].visibleTopMarker = false;
    series.getAllPoints()[0].visibleBottomMarker = true;
    series.draw(true);

    assert.ok(series.getAllPoints()[0].draw.calledOnce);
    assert.ok(series.getAllPoints()[0].clearVisibility.calledOnce);
    assert.ok(series.getAllPoints()[0].hideMarker.calledOnce);
    assert.ok(series.getAllPoints()[0].hideMarker.lastCall.args[0], 'top');
    assert.ok(!series.getAllPoints()[0].setInvisibility.called);
});

QUnit.test('Rangeseries. Bottom marker not in visible area', function(assert) {
    var series = this.series,
        options = {
            type: 'rangearea',
            border: {
                visible: true
            },
            point: {
                visible: true,
                color: 'red',
                border: {
                    color: 'yellow',
                    width: 2,
                    visible: true
                }
            }
        };

    series.updateOptions($.extend(true, {}, series._options, options));

    series.updateData([{ arg: 'First', val1: 1, val2: 1 }]);
    series.createPoints();
    series.getAllPoints()[0].isInVisibleArea.returns(true);
    series.getAllPoints()[0].visibleTopMarker = true;
    series.getAllPoints()[0].visibleBottomMarker = false;
    series.draw(true);

    assert.ok(series.getAllPoints()[0].draw.calledOnce);
    assert.ok(series.getAllPoints()[0].clearVisibility.calledOnce);
    assert.ok(series.getAllPoints()[0].hideMarker.calledOnce);
    assert.ok(series.getAllPoints()[0].hideMarker.lastCall.args[0], 'bottom');
    assert.ok(!series.getAllPoints()[0].setInvisibility.called);
});

QUnit.module('Labels visibility', {
    beforeEach: function() {
        this.options = {
            type: 'line',
            label: {
                visible: true
            },
            maxLabelCount: 10
        };

        this.data = [{
            arg: 1,
            val: 2
        }, {
            arg: 2,
            val: 5
        }];
    }
});

QUnit.test('Points count < maxLabelCount', function(assert) {
    var series = createSeries(this.options);

    series.updateData(this.data);
    series.createPoints();

    assert.ok(series.areLabelsVisible());
});

QUnit.test('Points count > maxLabelCount', function(assert) {
    this.options.maxLabelCount = 1;
    var series = createSeries(this.options);

    series.updateData(this.data);
    series.createPoints();

    assert.ok(!series.areLabelsVisible());
});

QUnit.module('Series states - excludePointsMode', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.createPoint = sinon.stub(pointModule, 'Point', function() {
            var stub = sinon.createStubInstance(originalPoint);
            stub.argument = 1;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            return stub;
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.createPoint.restore();
    }
});

QUnit.test('setSelectionState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    }, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'selection');
});

QUnit.test('draw selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    }, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });

    series.select();
    series.draw(false, false);

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'selection');
});

QUnit.test('draw hovered series', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    }, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });
    series.hover();
    series.draw(false, false);

    assert.ok(!series.isSelected());
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'hover');
});

QUnit.test('draw selected & hovered series', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    }, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });
    series.select();
    series.hover();
    series.draw(false, false);

    assert.ok(series.isSelected());
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'selection');
});

QUnit.test('setSelectionState when hover with includePointState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.hover('includePoints');
    series.getAllPoints()[0].setView.reset();
    series.getAllPoints()[0].resetView.reset();

    // act
    series.select();

    assert.ok(series.isSelected());
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');

    assert.strictEqual(series.getAllPoints()[0].resetView.lastCall.args[0], 'hover');
});

QUnit.test('clean hover with \'includePoints mode\' after select series', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();
    series.hover('includePoints');
    series.select();

    series.getAllPoints()[0].setView.reset();
    series.getAllPoints()[0].resetView.reset();
    // act
    series.clearHover();

    assert.strictEqual(series.stylesHistory[series.stylesHistory.length - 1], 'selection');

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 0);
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 0);
});

QUnit.test('clean selection with \'excludePoints mode\' if series is hovered', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.hover('includePoints');
    series.select();

    series.getAllPoints()[0].setView.reset();
    series.getAllPoints()[0].resetView.reset();
    // act
    series.clearSelection();

    assert.strictEqual(series.stylesHistory[series.stylesHistory.length - 1], 'hover');

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 1);
    assert.strictEqual(series.getAllPoints()[0].setView.lastCall.args[0], 'hover');
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 0);
});

QUnit.test('select series when hover with allSeriesPoints', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.hover('allSeriesPoints');
    series.getAllPoints()[0].setView.reset();
    series.getAllPoints()[0].resetView.reset();
    // act
    series.select();

    assert.ok(series.isSelected());
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');

    assert.strictEqual(series.getAllPoints()[0].resetView.lastCall.args[0], 'hover');
});


QUnit.test('setSelectionState two times', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'selection');
});

QUnit.test('releaseSelectionState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'normal');
});

QUnit.test('clearSelection two times', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.clearSelection();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'normal');
});

QUnit.test('setHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');
});

QUnit.test('setHoverState two times', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');
});

QUnit.test('setSelectedState then setHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.hover();

    assert.ok(series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'selection');
});

QUnit.test('setSelectedState then setHoverState then releaseHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.hover();
    series.clearHover();

    assert.ok(!series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[2], 'selection');
});

QUnit.test('setSelectedState then setHoverState then releaseSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.select();
    series.hover();
    series.clearSelection();

    assert.ok(series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');
});

QUnit.test('setHoverState then setSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.hover();
    series.select();

    assert.ok(series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
});

QUnit.test('setHoverState then setSelectedState then releaseSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });

    series.hover();
    series.select();
    series.clearSelection();

    assert.ok(series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');
});

QUnit.test('Add point to selected series (resample when aggregation used)', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();

    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 0);
    assert.strictEqual(series.getAllPoints()[1].setView.callCount, 0);
});

QUnit.test('setHoverState after Selected State in includePointsMode', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'excludePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.hover();
    series.select();

    // act
    series.clearSelection();
    assert.ok(series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');

    assert.strictEqual(series.getAllPoints()[0].resetView.lastCall.args[0], 'selection');
});

QUnit.module('Series states - nearestPoint Mode', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.createPoint = sinon.stub(pointModule, 'Point', function(_, data) {
            var stub = sinon.createStubInstance(originalPoint);
            stub.argument = 1;

            stub.x = data.argument;
            stub.y = data.value;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            return stub;
        });

        this.data = [{ arg: 10, val: 1 }, { arg: 20, val: 2 }, { arg: 30, val: 3 }];
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.createPoint.restore();
    }
});

QUnit.test('hover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });

    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');
});

QUnit.test('setHoverState with updateHover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);

    series.hover();

    series.updateHover(5, 20);

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');

    $.each(series.getPoints(), function(i, p) {
        assert.ok(!p.resetView.called);
        if(i === 0) {
            assert.ok(p.setView.calledOnce);
            assert.strictEqual(p.setView.lastCall.args[0], 'hover');
        }
    });
});

QUnit.test('updateHover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    series.updateHover(5, 20);
    // act
    series.updateHover(10, 20);
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');

    $.each(series.getPoints(), function(i, p) {
        if(i === 0) {
            assert.strictEqual(p.setView.callCount, 1, 'setView count for first point');
            assert.strictEqual(p.resetView.callCount, 1, 'resetView count for first point');
            assert.strictEqual(p.setView.lastCall.args[0], 'hover');
            assert.strictEqual(p.resetView.lastCall.args[0], 'hover', 'hover was reset');
        } else if(i === 1) {
            assert.ok(p.setView.calledOnce);
            assert.strictEqual(p.resetView.callCount, 0);
            assert.strictEqual(p.setView.lastCall.args[0], 'hover');
        } else {
            assert.ok(!p.setView.called);
            assert.ok(!p.resetView.called);
        }
    });
});

QUnit.test('updateHover two times', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    // act
    series.updateHover(10, 20);
    series.updateHover(10, 20);
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');

    $.each(series.getPoints(), function(i, p) {
        if(i === 1) {
            assert.ok(p.setView.calledOnce);
            assert.strictEqual(p.setView.lastCall.args[0], 'hover');
        } else {
            assert.ok(!p.setView.called);
        }
    });
});

QUnit.test('setHoverState with updateHover - release hover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);

    series.hover();

    series.updateHover(5, 20);
    // act
    series.clearHover();

    assert.ok(!series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'normal');

    $.each(series.getPoints(), function(i, p) {
        if(i === 0) {
            assert.ok(p.setView.calledOnce);
            assert.ok(p.resetView.calledOnce);
            assert.strictEqual(p.setView.getCall(0).args[0], 'hover');
            assert.strictEqual(p.resetView.getCall(0).args[0], 'hover');
        } else {
            assert.ok(!p.setView.called);
        }
    });
});

QUnit.test('updateHover when series is selected in include points mode', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.select();
    series.hover();

    // act
    series.updateHover(5, 20);
    series.updateHover(10, 20);
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[1], 'selection');


    $.each(series.getPoints(), function(i, p) {
        assert.strictEqual(p.setView.callCount, 1);
        assert.strictEqual(p.setView.getCall(0).args[0], 'selection');
    });
});

QUnit.test('select hovered series - selectionMode is excludePoints', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    series.updateHover(10, 20);
    // act
    series.select();
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');


    $.each(series.getPoints(), function(i, p) {
        if(p.resetView.called) {
            assert.strictEqual(p.resetView.lastCall.args[0], 'hover');
        }
    });
});

QUnit.test('select hovered series - selectionMode is includePoints', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    series.updateHover(10, 20);
    // act
    series.select();
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');


    $.each(series.getPoints(), function(i, p) {
        if(p.setView.called) {
            assert.strictEqual(p.setView.lastCall.args[0], 'selection');
        }
    });
});

QUnit.test('select hovered series - release selected series, update hover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    series.updateHover(10, 20);
    series.select();
    // act
    series.clearSelection();
    series.updateHover(10, 20);
    // assert
    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');

    $.each(series.getPoints(), function(i, p) {
        if(p.setView.called) {
            assert.strictEqual(p.setView.lastCall.args[0], 'hover');
        }
    });
});

QUnit.test('updateHover after release series hover', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();
    series.updateHover(10, 20);
    series.clearHover();
    $.each(series.getPoints(), function(i, p) {
        p.setView.reset();
        p.resetView.reset();
    });
    // act

    series.updateHover(10, 20);
    // assert

    assert.ok(!series.isHovered());

    $.each(series.getPoints(), function(i, p) {
        assert.ok(!p.setView.called);
        assert.ok(!p.resetView.called);
    });
});

QUnit.test('Set hover state - update - release hover - set hover update', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'nearestPoint'
    });
    series.updateData(this.data);
    series.createPoints();

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(series.getPoints()[0]);
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();

    series.updateHover(10, 20);
    series.clearHover();
    series.getPoints()[1].setView.reset();
    series.hover();
    // act

    series.updateHover(10, 20);
    // assert

    assert.ok(series.isHovered());

    assert.ok(series.getPoints()[1].setView.calledOnce);
    assert.strictEqual(series.getPoints()[1].setView.lastCall.args[0], 'hover');
});

QUnit.test('reset nearest point on select', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'nearestPoint'
    });

    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();
    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(10, 20).returns(series.getPoints()[1]);

    series.hover();
    series.updateHover(10, 20);

    series.getPoints()[1].setView.reset();
    series.getPoints()[1].resetView.reset();
    // act
    series.select();

    assert.strictEqual(series.getPoints()[0].resetView.callCount, 0);
    assert.strictEqual(series.getPoints()[1].resetView.lastCall.args[0], 'hover');
});

QUnit.module('Series states - includePointsMode', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.createPoint = sinon.stub(pointModule, 'Point', function() {
            var stub = sinon.createStubInstance(originalPoint);
            stub.argument = 1;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            return stub;
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.createPoint.restore();
    }
});

QUnit.test('setSelectionState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'selection', 'series style');

    assert.strictEqual(series.getAllPoints()[0].setView.lastCall.args[0], 'selection');
    assert.strictEqual(series.getAllPoints()[1].setView.lastCall.args[0], 'selection');
});

QUnit.test('setSelectionState allSeriesPoints', function(assert) {
    var series = createSeries({
        selectionMode: 'allSeriesPoints',
        hoverMode: 'allSeriesPoints'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'selection', 'series style');

    assert.strictEqual(series.getAllPoints()[0].setView.getCall(0).args[0], 'selection');
    assert.strictEqual(series.getAllPoints()[1].setView.getCall(0).args[0], 'selection');
});

QUnit.test('setSelectionState two times', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([]);
    series.createPoints();
    series.select();
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'selection');
});

QUnit.test('claerSelection', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.select();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'normal');
});

QUnit.test('releaseSelectionState allSeriesPoints', function(assert) {
    var series = createSeries({
        selectionMode: 'allSeriesPoints',
        hoverMode: 'allSeriesPoints'
    });

    series.updateData([]);
    series.createPoints();
    series.select();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'normal');
});

QUnit.test('releaseSelectionState two times', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();

    series.select();
    series.clearSelection();
    series.clearSelection();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[1], 'normal');
});

QUnit.test('setHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');
});

QUnit.test('setHoverState two times', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.strictEqual(series.stylesHistory[0], 'hover');
});

QUnit.test('setSelectedState then setHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([]);
    series.createPoints();
    series.select();
    series.hover();

    assert.ok(series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'selection');
});

QUnit.test('setSelectedState then setHoverState then releaseHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.select();
    series.hover();
    series.clearHover();

    assert.ok(!series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[2], 'selection');
});

QUnit.test('setSelectedState then setHoverState then releaseSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.select();
    series.hover();
    series.clearSelection();

    assert.ok(series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');
});

QUnit.test('setHoverState then setSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.hover();
    series.select();

    assert.ok(series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
});

QUnit.test('setHoverState then setSelectedState then releaseSelectedState', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });

    series.updateData([]);
    series.createPoints();
    series.hover();
    series.select();
    series.clearSelection();

    assert.ok(series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'selection');
    assert.strictEqual(series.stylesHistory[2], 'hover');
});

QUnit.test('release Hover state with selected point', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();
    series.getAllPoints()[1].isSelected.returns(true);

    series.getAllPoints()[1].isSelected.returns(true);
    series.hover();
    series.clearHover();

    assert.ok(!series.isHovered());
    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[0], 'hover');
    assert.strictEqual(series.stylesHistory[1], 'normal', 'applien normal style');
    assert.strictEqual(series.getAllPoints()[1].setView.lastCall.args[0], 'hover');
    assert.strictEqual(series.getAllPoints()[1].resetView.lastCall.args[0], 'hover');
});// last

QUnit.test('hover selected series with excludePoints mode', function(assert) {
    var series = createSeries({
        selectionMode: 'excludePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();
    series.getAllPoints()[0].setView.reset();
    series.getAllPoints()[0].resetView.reset();
    // act
    series.hover();

    assert.ok(series.isHovered());
    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.strictEqual(series.stylesHistory[1], 'selection');

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 0);
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 0);
});

QUnit.test('Add point to selected series (resample when aggregation used)', function(assert) {
    var series = createSeries({
        selectionMode: 'allSeriesPoints',
        hoverMode: 'allSeriesPoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();

    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 1);
    assert.strictEqual(series.getAllPoints()[0].setView.lastCall.args[0], 'selection');

    assert.strictEqual(series.getAllPoints()[1].setView.callCount, 1);
    assert.strictEqual(series.getAllPoints()[1].setView.lastCall.args[0], 'selection');
});

QUnit.test('Add point to selected series (resample when aggregation used). Series is not selected', function(assert) {
    var series = createSeries({
        selectionMode: 'allSeriesPoints',
        hoverMode: 'allSeriesPoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 0);
});

QUnit.test('hover selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    series.select();
    point.setView.reset();
    point.resetView.reset();
    // act
    series.hover();

    assert.strictEqual(point.setView.callCount, 0);
    assert.strictEqual(point.resetView.callCount, 0);
});

QUnit.test('clear selection hovered', function(assert) {
    var series = createSeries({
        selectionMode: 'includePoints',
        hoverMode: 'includePoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    series.select();
    series.hover();

    point.setView.reset();
    point.resetView.reset();
    // act
    series.clearSelection();

    assert.strictEqual(point.setView.callCount, 1);
    assert.strictEqual(point.setView.lastCall.args[0], 'hover');

    assert.strictEqual(point.resetView.callCount, 1);
    assert.strictEqual(point.resetView.lastCall.args[0], 'selection');
});

QUnit.module('Series states - none mode', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.createPoint = sinon.stub(pointModule, 'Point', function() {
            var stub = sinon.createStubInstance(originalPoint);
            stub.argument = 1;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            return stub;
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.createPoint.restore();
    }
});

QUnit.test('select', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'none'
    });

    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 1);
    assert.equal(series.stylesHistory[0], 'normal');
});

QUnit.test('setSelectionState on hovered series with include points mode', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'none'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    series.hover('includePoints');
    series.select();

    assert.ok(series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.equal(series.stylesHistory[0], 'hover');
    assert.equal(series.stylesHistory[1], 'hover');
    assert.ok(series.getAllPoints()[0].setView.calledOnce);
    assert.strictEqual(series.getAllPoints()[0].setView.getCall(0).args[0], 'hover');
    assert.strictEqual(series.getAllPoints()[1].setView.getCall(0).args[0], 'hover');
});

QUnit.test('clearSelection', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'none'
    });

    series.select();
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 2);
    assert.equal(series.stylesHistory[series.stylesHistory.length - 1], 'normal');
});

QUnit.test('setHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'none'
    });

    series.hover();

    assert.ok(series.isHovered());
    assert.equal(series.stylesHistory.length, 1);
    assert.equal(series.stylesHistory[series.stylesHistory.length - 1], 'normal');
});

QUnit.test('releaseHoverState', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'none'
    });

    series.hover();
    series.clearHover();

    assert.ok(!series.isHovered());
    assert.equal(series.stylesHistory.length, 2);
    assert.equal(series.stylesHistory[series.stylesHistory.length - 1], 'normal');
});

QUnit.test('hover with includePoints mode selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'includePoints'
    });

    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();
    var point = series.getAllPoints()[0];
    point.setView.reset();
    point.resetView.reset();
    // act
    series.hover();

    assert.strictEqual(point.setView.callCount, 1);
    assert.strictEqual(point.setView.lastCall.args[0], 'hover');
    assert.strictEqual(point.resetView.callCount, 0);
});

QUnit.test('Select hovered with include series mode', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'includePoints'
    });

    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    series.hover();

    point.setView.reset();
    point.resetView.reset();
    // act
    series.select();

    assert.strictEqual(point.setView.callCount, 0, 'setView should not be called');
    assert.strictEqual(point.resetView.callCount, 0, 'resetView should not be called');
});

QUnit.test('Clear selection when series is hovered with \'includePoints\' mode', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'includePoints'
    });

    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    series.hover();
    series.select();

    point.setView.reset();
    point.resetView.reset();

    // act
    series.clearSelection();

    assert.ok(!series.isSelected());
    assert.equal(series.stylesHistory.length, 3);
    assert.equal(series.stylesHistory[0], 'hover');
    assert.equal(series.stylesHistory[series.stylesHistory.length - 1], 'hover');

    assert.strictEqual(point.setView.callCount, 0, 'setView should not be called');
    assert.strictEqual(point.resetView.callCount, 0);
});

QUnit.test('Clear hover selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'includePoints'
    });

    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    series.select();
    series.hover();

    point.setView.reset();
    point.resetView.reset();
    // act
    series.clearHover();

    assert.strictEqual(point.setView.callCount, 0, 'setView should not be called');
    assert.strictEqual(point.resetView.callCount, 1);
    assert.strictEqual(point.resetView.lastCall.args[0], 'hover');
});

QUnit.test('Update hover selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'none',
        hoverMode: 'nearestPoint'
    });

    series.updateData([{ arg: 1 }]);
    series.createPoints();

    var point = series.getAllPoints()[0];

    sinon.stub(series, 'getNeighborPoint');
    series.getNeighborPoint.withArgs(5, 20).returns(point);

    series.select();
    series.hover();

    point.setView.reset();
    point.resetView.reset();
    // act
    series.updateHover(5, 20);

    assert.strictEqual(point.setView.callCount, 1, 'setView');
    assert.strictEqual(point.setView.lastCall.args[0], 'hover');
});

QUnit.module('Point States', {
    beforeEach: function() {
        environmentWithSinonStubPoint.beforeEach.call(this);

        this.series = createSeries({
            selectionMode: 'none',
            hoverMode: 'none'
        }, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });
        this.series.updateData([{ arg: 1 }, { arg: 2 }]);
        this.series.createPoints();
        this.point = this.series.getAllPoints()[0];
    },
    afterEach: environmentWithSinonStubPoint.afterEach
});

QUnit.test('Select point', function(assert) {
    // act
    this.series.selectPoint(this.point);

    assert.equal(this.point.fullState, 2, 'fullState');
    assert.equal(this.point.applyView.callCount, 1, 'Point view is updated');
});

QUnit.test('Select point - hovered point', function(assert) {
    this.series.hoverPoint(this.point);
    this.point.applyView.reset();
    // act
    this.series.selectPoint(this.point);

    assert.equal(this.point.fullState, 1 | 2, 'fullState');
    assert.equal(this.point.applyView.callCount, 1, 'Point view is updated');
});

QUnit.test('Select point - not hovered point - hovered series - not selected series', function(assert) {
    this.series.hover('includePoints');
    this.point.applyView.reset();
    // act
    this.series.selectPoint(this.point);

    assert.equal(this.point.fullState, 2, 'fullState');
    assert.equal(this.point.setView.lastCall.args[0], 'hover');
    assert.equal(this.point.applyView.callCount, 1, 'Point view is updated');
});

// T277066
QUnit.test('setPointHoverState with selected view', function(assert) {
    this.point.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    this.series.notify({
        action: 'pointSelect',
        target: this.point
    });

    this.series.hoverPoint(this.series.getAllPoints()[1]);

    assert.equal(this.series.getAllPoints()[1].setView.callCount, 1);
    assert.equal(this.series.getAllPoints()[1].resetView.callCount, 0);
    assert.deepEqual(this.series.getAllPoints()[1].setView.lastCall.args, ['selection']);
});

// T277066
QUnit.test('releasePointHoverState with selected view', function(assert) {
    this.point.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    this.series.notify({
        action: 'pointSelect',
        target: this.point
    });

    this.series.getAllPoints()[1].isHovered.returns(true);
    this.series.clearPointHover();

    assert.equal(this.series.getAllPoints()[1].setView.callCount, 1);
    assert.deepEqual(this.series.getAllPoints()[1].setView.lastCall.args, ['selection']);
    assert.ok(this.series.getAllPoints()[1].releaseHoverState.called);
});

QUnit.test('setHoverState with selected view', function(assert) {
    this.series.getAllPoints()[1].getOptions.returns({ selectionMode: 'allSeriesPoints' });
    this.series.notify({
        action: 'pointSelect',
        target: this.series.getAllPoints()[1]
    });
    this.series.hover('includePoints');

    assert.equal(this.point.setView.callCount, 2);
    assert.ok(!this.point.resetView.called);
    assert.strictEqual(this.point.setView.getCall(0).args[0], 'selection');
    assert.strictEqual(this.point.setView.getCall(1).args[0], 'hover');
});

QUnit.test('Release selected point - not hovered point - not hovered series - not selected series', function(assert) {
    this.series.selectPoint(this.point);
    this.point.isSelected.returns(true);
    this.point.applyView.reset();
    // act
    this.series.deselectPoint(this.point);

    assert.equal(this.point.fullState, 0, 'fullState');
    assert.equal(this.point.applyView.callCount, 1, 'Point should have normal style');
});

QUnit.test('Release selected point - hovered point - not hovered series - not selected series', function(assert) {
    this.series.selectPoint(this.point);
    this.point.isSelected.returns(true);
    this.series.hoverPoint(this.point);
    this.point.isHovered.returns(true);
    this.point.applyView.reset();
    // act
    this.series.deselectPoint(this.point);

    assert.equal(this.point.fullState, 1, 'fullState');
    assert.equal(this.point.applyView.callCount, 1);
});

QUnit.test('Release selected point - selected series in includePoints mode - release selection point', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();
    series.select();

    // act
    series.deselectPoint(series.getAllPoints()[0]);

    assert.equal(series.getAllPoints()[0].fullState, 0, 'fullState');
    assert.equal(series.getAllPoints()[0].resetView.callCount, 0);
    assert.equal(series.getAllPoints()[0].setView.callCount, 1);
    assert.equal(series.getAllPoints()[0].setView.lastCall.args[0], 'selection');
});

QUnit.test('hover selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints',
        hoverMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();
    series.hover();

    assert.strictEqual(series.getAllPoints()[0].setView.callCount, 1, 'setView call count');

    assert.strictEqual(series.getAllPoints()[0].setView.getCall(0).args[0], 'selection');
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 0);
});

QUnit.test('Release selected point - selected series in includePoints mode - select any point - release series selection', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints',
        hoverMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();

    // act
    series.getAllPoints()[0].isSelected.returns(true);
    series.deselectPoint(series.getAllPoints()[0]);

    assert.equal(series.getAllPoints()[0].fullState, 0, 'fullState');
    assert.strictEqual(series.getAllPoints()[0].applyView.callCount, 1, 'Point should have normal style');
});

QUnit.test('Release selected point without change state - not hovered point - not hovered series - not selected series', function(assert) {
    this.series.selectPoint(this.point);
    // act
    this.series.deselectPoint(this.point);
    // assert
    assert.equal(this.point.fullState, 2, 'fullState');
});

QUnit.test('Release selected point without change state - hovered point - not hovered series - not selected series', function(assert) {
    this.series.selectPoint(this.point);
    this.point.isSelected.returns(true);
    this.series.hoverPoint(this.point);
    this.point.isHovered.returns(true);
    this.series.getAllPoints()[1].getOptions.returns({ selectionMode: 'allSeriesPoints' });
    // act
    this.series.notify({
        action: 'pointDeselect',
        target: this.series.getAllPoints()[1]
    });
    // assert
    assert.equal(this.point.fullState, 1 | 2, 'fullState');
});

QUnit.test('Release selected point without change state - selected series in includePoints mode - release selection point', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints'
    });

    series.updateData([]);
    series.createPoints();

    series.select();

    // act
    series.clearSelection();

    // assert
    assert.equal(this.point.fullState, 0, 'fullState');
});

QUnit.test('Release selected point without change state - not hovered point - hovered series in includePoints mode - not selected series', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.selectPoint(series.getAllPoints()[0]);

    // act
    series.deselectPoint(series.getAllPoints()[0]);

    assert.equal(series.getAllPoints()[0].fullState, 2, 'fullState');
});

QUnit.test('Release selected point without change state - selected series in includePoints mode - select any point - release series selection', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    series.getAllPoints()[1].getOptions.returns({ selectionMode: 'allSeriesPoints' });
    series.select();

    // act
    series.selectPoint(series.getAllPoints()[0]);
    series.notify({ action: 'deselectPoint', target: series.getAllPoints()[1] });

    // assert
    assert.equal(series.getAllPoints()[0].fullState, 2, 'fullState');
});

QUnit.test('Set Hover point', function(assert) {
    // act
    this.series.hoverPoint(this.point);

    assert.equal(this.point.fullState, 1, 'fullState');
    assert.equal(this.point.applyView.callCount, 1, 'Point style');
});

QUnit.test('Set Hover point with series.selected. ', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.select();

    // act
    series.hoverPoint(series.getAllPoints()[0]);

    assert.equal(series.getAllPoints()[0].fullState, 1, 'fullState');
    assert.equal(series.getAllPoints()[0].applyView.callCount, 1);
});

QUnit.test('Set Hover point with point.selected. ', function(assert) {
    this.series.selectPoint(this.point);
    this.point.isSelected.returns(true);
    // act
    this.series.hoverPoint(this.point);

    assert.equal(this.point.fullState, 2 | 1, 'fullState');
    assert.strictEqual(this.point.applyView.callCount, 2, 'Point style');
});

QUnit.test('Set Hover point view without change state with point.selected. ', function(assert) {
    this.series.selectPoint(this.point);
    this.point.isSelected.returns(true);
    this.series.getAllPoints()[1].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    // act

    this.series.notify({ action: 'pointHover', target: this.series.getAllPoints()[1] });

    assert.strictEqual(this.point.setView.lastCall.args[0], 'hover', 'Point style');
});

// Release hover
QUnit.test('Release hover point with series.hover in includePoints mode ', function(assert) {
    var series = createSeries({
        selectionMode: 'excludepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();
    series.hover('includePoints');
    series.select();

    series.getAllPoints()[0].isHovered.returns(true);
    series.clearPointHover();

    assert.equal(series.getAllPoints()[0].fullState, 0, 'fullState');
    assert.equal(series.getAllPoints()[0].setView.lastCall.args[0], 'hover', 'Point style');
});

QUnit.test('Release hover point with point.selected. ', function(assert) {
    this.series.selectPoint(this.point);
    // act
    this.series.getAllPoints()[1].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    this.series.notify({
        action: 'clearPointHover',
        target: this.series.getAllPoints()[1]
    });

    assert.equal(this.point.fullState, 2, 'fullState');
    assert.strictEqual(this.point.resetView.lastCall.args[0], 'hover', 'Reset hover view');
});

QUnit.test('Release hover view point with series.hover. ', function(assert) {
    var series = createSeries({
        selectionMode: 'includepoints',
        hoverMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }]);
    series.createPoints();
    series.hover();

    // act
    series.clearPointHover();

    assert.equal(series.getAllPoints()[0].applyView.callCount, 0);
});

QUnit.test('Release hover view point with series.hover in includePoints mode', function(assert) {
    var series = createSeries({
        selectionMode: 'excludepoints',
        hoverMode: 'includepoints'
    });
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();
    series.getAllPoints()[1].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    series.hover();
    series.select();

    // act
    series.hoverPoint(series.getAllPoints()[0]);

    series.notify({ action: 'clearPointHover', target: series.getAllPoints()[1] });

    assert.equal(series.getAllPoints()[0].setView.callCount, 1);
    assert.equal(series.getAllPoints()[0].setView.lastCall.args[0], 'hover', 'setView');
    assert.equal(series.getAllPoints()[0].resetView.lastCall.args[0], 'hover');
});

QUnit.test('Release hover view point with series.selected. ', function(assert) {
    this.series.selectPoint(this.point);
    this.series.getAllPoints()[1].getOptions.returns({ hoverMode: 'allSeriesPoints' });

    // act
    this.series.notify({ action: 'clearPointHover', target: this.series.getAllPoints()[1] });

    assert.strictEqual(this.point.resetView.lastCall.args[0], 'hover', 'Reset hover view');
});

QUnit.test('Release hover view point with point.selected. ', function(assert) {
    this.series.selectPoint(this.point);
    this.series.getAllPoints()[1].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    // act
    this.series.notify({ action: 'clearPointHover', target: this.series.getAllPoints()[1] });

    assert.strictEqual(this.point.resetView.lastCall.args[0], 'hover', 'Reset hover view');
});

QUnit.test('apply point view after drawing selected series', function(assert) {
    var series = this.series,
        options = {
            selectionMode: 'includePoints'
        };

    series.updateOptions($.extend(true, {}, series._options, options));
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false);
    series.select();

    series.draw(false);

    assert.equal(series.getAllPoints()[0].setView.callCount, 1);
});

QUnit.test('apply point view after drawing hovered series', function(assert) {
    var series = this.series,
        options = {
            hoverMode: 'includePoints'
        };

    series.updateOptions($.extend(true, {}, series._options, options));
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false);
    series.hover();

    series.draw(false);

    assert.equal(series.getAllPoints()[0].setView.callCount, 1);
});

QUnit.module('Series visibility', environment);

QUnit.test('Create visible series', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy
        }, {
            seriesGroup: seriesGroup,
            markerTrackerGroup: this.renderer.g(),
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });

    series.draw();
    series._segments = [[1, 2]];

    series.drawTrackers();

    assert.equal(spy.callCount, 0);
    assert.ok(series.isVisible());
    assert.equal(series._group.stub('append').lastCall.args[0], seriesGroup);
});

QUnit.test('Create invisible series', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: false,
            visibilityChanged: spy
        }, {
            seriesGroup: seriesGroup,
            markerTrackerGroup: this.renderer.g(),
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });

    series.draw();
    series._segments = [[1, 2]];

    series.drawTrackers();

    assert.equal(spy.callCount, 0);
    assert.ok(!series.isVisible());
    assert.equal(series._group.stub('append').callCount, 0);
    assert.ok(series._group.stub('remove').called);
});

QUnit.test('Hide visible series', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy,
            point: { visible: true }
        }, {
            seriesGroup: seriesGroup,
            markerTrackerGroup: this.renderer.g(),
            trackersGroup: this.renderer.g(),
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        }),
        trigger = sinon.spy();
    series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }]);
    $(seriesGroup.element).on('hidepointtooltip', trigger);

    series.hide();

    series.draw();
    series._segments = [[1, 2]];

    series.drawTrackers();

    assert.equal(spy.callCount, 1);
    assert.ok(!series.isVisible());
    assert.equal(series._group.stub('append').callCount, 0);
    assert.ok(series._group.stub('remove').called);
    assert.ok(trigger.calledOnce);
    assert.ok(trigger.lastCall.args[0] instanceof $.Event);
    assert.strictEqual(trigger.lastCall.args[0].type, 'hidepointtooltip');
    assert.strictEqual(trigger.lastCall.args[1], undefined);

    // see T243839
    $.each(series.getAllPoints(), function(_, point) {
        assert.ok(point._options.visible !== false);
    });
});

QUnit.test('show hidden series', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy
        }, {
            seriesGroup: seriesGroup,
            markerTrackerGroup: this.renderer.g(),
            trackersGroup: this.renderer.g(),
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });


    series.draw();
    series.drawTrackers();
    series.hide();
    series.draw();
    series.drawTrackers();

    series.show();
    series.draw();
    series._segments = [[1, 2]];

    series.drawTrackers();

    assert.equal(spy.callCount, 2);
    assert.ok(series.isVisible());
    assert.equal(series._group.stub('append').lastCall.args[0], seriesGroup);
});

QUnit.test('Double hide visible series', function(assert) {
    var spy = sinon.spy(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy
        });

    series.hide();
    series.hide();

    assert.equal(spy.callCount, 1);
    assert.ok(!series.isVisible());
});

QUnit.test('Show invisible series', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: false,
            visibilityChanged: spy,
            point: { visible: false }
        }, {
            seriesGroup: seriesGroup,
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        }),
        trigger = sinon.spy();
    series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }]);
    $(seriesGroup.element).on('hidepointtooltip', trigger);

    series.show();

    assert.equal(spy.callCount, 1);
    assert.ok(series.isVisible());
    assert.ok(series.getOptions().visible);
    assert.ok(trigger.calledOnce);
    assert.ok(trigger.lastCall.args[0] instanceof $.Event);
    assert.strictEqual(trigger.lastCall.args[0].type, 'hidepointtooltip');
    assert.strictEqual(trigger.lastCall.args[1], undefined);

    // see T243839
    $.each(series.getAllPoints(), function(_, point) {
        assert.ok(point._options.visible !== true);
    });
});

QUnit.test('double showing invisible series', function(assert) {
    var spy = sinon.spy(),
        series = createSeries({
            visible: false,
            visibilityChanged: spy
        });

    series.show();
    series.show();

    assert.equal(spy.callCount, 1);
    assert.ok(series.isVisible());
    assert.ok(series.getOptions().visible);
});

QUnit.test('set visibility from options', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy
        }, {
            seriesGroup: seriesGroup,
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });

    series.updateOptions($.extend(true, {}, series._options, {
        visible: false
    }));

    series.draw();

    assert.equal(spy.callCount, 0);
    assert.ok(!series.isVisible());
    assert.ok(series._group.stub('remove').called);
});

QUnit.test('set visibility from options', function(assert) {
    var spy = sinon.spy(),
        seriesGroup = this.renderer.g(),
        series = createSeries({
            visible: true,
            visibilityChanged: spy
        }, {
            seriesGroup: seriesGroup,
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });

    series.updateOptions($.extend(true, {}, series._options, {
        visible: true
    }));

    series.draw();

    assert.equal(spy.callCount, 0);
    assert.ok(series.isVisible());
    assert.ok(series._group.parent, seriesGroup);
});

QUnit.test('get range from visible series', function(assert) {
    var series = createSeries({
        visible: true
    });

    assert.deepEqual(series.getRangeData(), { isStub: true });
});

QUnit.test('get range from invisible series', function(assert) {
    var series = createSeries({
        visible: false
    });

    assert.deepEqual(series.getRangeData(), { arg: {}, val: {} });
});

QUnit.module('API', {
    beforeEach: function() {
        environmentWithSinonStubPoint.beforeEach.call(this);
        this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }];

        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.trigger = sinon.spy();
        $(this.seriesGroup.element).on({
            'showpointtooltip': this.trigger,
            'hidepointtooltip': this.trigger
        });
        this.options = {
            selectionMode: 'seriesSelectionMode'
        };
        this.renderOptions = {
            seriesGroup: this.seriesGroup
        };
    },
    afterEach: environmentWithSinonStubPoint.afterEach
});

QUnit.test('hide labels', function(assert) {
    var series = createSeries({}, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });

    series.updateData(this.data);
    series.createPoints();
    series.draw(false);
    series.hideLabels();

    $.each(series.getAllPoints(), function(_, point) {
        assert.deepEqual(point._label.draw.lastCall.args, [false]);
    });
});

QUnit.test('getOptions', function(assert) {
    var series = createSeries({ someProp: true });

    assert.equal(series.getOptions(), series._options);
});

QUnit.test('Getting points', function(assert) {
    var series = createSeries();
    series.updateData(this.data);
    series.createPoints();

    var points = series.getPoints();

    assert.ok(points);
    assert.equal(points.length, 4);
});

QUnit.test('updateDataType', function(assert) {
    var series = createSeries({});

    series.updateDataType({ argumentType: 'argumentType', valueType: 'valueType', argumentAxisType: 'argumentAxisType', valueAxisType: 'valueAxisType', showZero: true });

    assert.equal(series.argumentAxisType, 'argumentAxisType');
    assert.equal(series.argumentType, 'argumentType');
    assert.equal(series.valueAxisType, 'valueAxisType');
    assert.equal(series.valueType, 'valueType');
    assert.ok(series.showZero);
});

QUnit.test('Get all points API', function(assert) {
    var series = createSeries({});
    series.updateData(this.data);
    series.createPoints();

    // act
    var points = series.getAllPoints();
    // assert
    assert.ok(points, 'Points were returned');
    assert.equal(points.length, 4, 'All points were returned');
    assert.equal(points[0].argument, this.data[0].arg);
    assert.equal(points[1].argument, this.data[1].arg);
    assert.equal(points[2].argument, this.data[2].arg);
    assert.equal(points[3].argument, this.data[3].arg);
});

QUnit.test('Get all points API. Before update data', function(assert) {
    var series = createSeries({});
    // act
    var points = series.getAllPoints();
    // assert
    assert.ok(points, 'Points were returned');
    assert.deepEqual(points, []);
});

QUnit.test('Get point by pos API', function(assert) {
    var series = createSeries({});
    series.updateData(this.data);
    series.createPoints();

    // act
    var point = series.getPointByPos(2);
    // assert
    assert.ok(point, 'Point was returned');
    assert.equal(point.argument, this.data[2].arg);
});
QUnit.test('get visible point - non-drawn series', function(assert) {
    var series = createSeries({});
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual(series.getVisiblePoints(), []);
});

QUnit.test('Get points by argument API', function(assert) {
    var series = createSeries({});
    series.updateData([{ arg: 'First', val: 1 }, { arg: 'Second', val: 2 }, { arg: 'Third', val: 3 }]);
    series.createPoints();

    // act
    var points = series.getPointsByArg('Second');
    // assert
    assert.ok(points, 'Points was returned');
    assert.equal(points.length, 1, 'One point');
    assert.equal(points[0].argument, 'Second');
    assert.equal(points[0].value, 2, 'Value');
});

QUnit.test('Get points by keys API', function(assert) {
    var series = createSeries({});
    series.updateData([{ arg: 'First', val: 1 }, { arg: 'Second', val: 2 }, { arg: 'Third', val: 3 }]);
    series.createPoints();

    // act
    var points = series.getPointsByArg('Second');
    // assert
    assert.ok(points, 'Points was returned');
    assert.equal(points.length, 1, 'One point');
    assert.equal(points[0].argument, 'Second');
    assert.equal(points[0].value, 2, 'Value');
});

QUnit.test('Get points by argument API. Several points', function(assert) {
    var series = createSeries({});
    series.updateData([{ arg: 'First', val: 1 }, { arg: 'Second', val: 2 }, { arg: 'Second', val: 3 }]);
    series.createPoints();

    // act
    var points = series.getPointsByArg('Second');
    // assert
    assert.ok(points, 'Points was returned');
    assert.equal(points.length, 2, 'Two points');
    assert.equal(points[0].argument, 'Second');
    assert.equal(points[0].value, 2, 'Value');
    assert.equal(points[1].argument, 'Second');
    assert.equal(points[1].value, 3, 'Value');
});

QUnit.test('Get non-existing points by argument API', function(assert) {
    var series = createSeries({});
    series.updateData([{ arg: 'First', val: 1 }, { arg: 'Second', val: 2 }, { arg: 'Third', val: 3 }]);
    series.createPoints();

    // act
    var points = series.getPointsByArg('Fifteen');
    // assert
    assert.deepEqual(points, [], 'No Points was returned');
});

QUnit.test('Get point by date argument API', function(assert) {
    var data = [{ arg: new Date(1), val: 2 }, { arg: new Date(2), val: 3 }, { arg: new Date(6), val: 1 }, { arg: new Date(7), val: 4 }],
        series = createSeries({});
    series.updateData(data);
    series.createPoints();

    // act
    var points = series.getPointsByArg(new Date(2));
    // assert
    assert.ok(points, 'Point was returned');
    assert.equal(points.length, 1, 'One point');
    assert.deepEqual(points[0].argument, data[1].arg);
    assert.equal(points[0].value, 3, 'Value');
});

QUnit.test('Get point by date argument API. Several points', function(assert) {
    var data = [{ arg: new Date(1), val: 2 }, { arg: new Date(2), val: 3 }, { arg: new Date(2), val: 1 }, { arg: new Date(7), val: 4 }],
        series = createSeries({});
    series.updateData(data);
    series.createPoints();

    // act
    var points = series.getPointsByArg(new Date(2));
    // assert
    assert.ok(points, 'Point was returned');
    assert.equal(points.length, 2, 'One point');
    assert.deepEqual(points[0].argument, data[1].arg);
    assert.equal(points[0].value, 3, 'Value');
    assert.deepEqual(points[1].argument, data[1].arg);
    assert.equal(points[1].value, 1, 'Value');
});

QUnit.test('get visible point - drawn series', function(assert) {
    var series = createSeries({});
    series.updateData(this.data);
    series.createPoints();

    series._drawnPoints = [
        series.getAllPoints()[0],
        series.getAllPoints()[2],
        series.getAllPoints()[3]
    ];

    var visiblePoints = series.getVisiblePoints();
    assert.equal(visiblePoints.length, 3);

    assert.equal(visiblePoints[0], series.getAllPoints()[0]);
    assert.equal(visiblePoints[1], series.getAllPoints()[2]);
    assert.equal(visiblePoints[2], series.getAllPoints()[3]);
});

QUnit.test('series showPointTooltip', function(assert) {
    var series = createSeries(this.options, this.renderOptions);
    series.updateData(this.data);
    series.createPoints();

    // act
    series.showPointTooltip(series.getPointByPos(0));
    // assert
    assert.ok(this.trigger.calledOnce);
    assert.ok(this.trigger.lastCall.args[0] instanceof $.Event);
    assert.equal(this.trigger.lastCall.args[0].type, 'showpointtooltip');
    assert.equal(this.trigger.lastCall.args[1], series.getPointByPos(0));
});

QUnit.test('series hidePointTooltip', function(assert) {
    var series = createSeries(this.options, this.renderOptions);
    series.updateData(this.data);
    series.createPoints();

    // act
    series.hidePointTooltip(series.getPointByPos(0));
    // assert
    assert.ok(this.trigger.calledOnce);
    assert.ok(this.trigger.lastCall.args[0] instanceof $.Event);
    assert.equal(this.trigger.lastCall.args[0].type, 'hidepointtooltip');
    assert.equal(this.trigger.lastCall.args[1], series.getPointByPos(0));
});

QUnit.test('Get tagField', function(assert) {
    var series = createSeries({ tagField: 'nameTagField' });
    // act
    var tagField = series.getTagField();
    // assert
    assert.ok(tagField);
    assert.equal(tagField, 'nameTagField');
});

QUnit.test('Get tagField default', function(assert) {
    var series = createSeries({});
    // act
    var tagField = series.getTagField();
    // assert
    assert.ok(tagField);
    assert.equal(tagField, 'tag');
});

QUnit.test('getColor', function(assert) {
    var series = createSeries({});
    series.updateOptions({
        type: 'line',
        color: 'seriesColor',
        widgetType: 'chart'
    });

    assert.strictEqual(series.getColor(), 'seriesColor', 'Color should be correct');
});

QUnit.test('getOpacity', function(assert) {
    var series = createSeries({ opacity: 'seriesOpacity' });

    assert.strictEqual(series.getOpacity(), 'seriesOpacity', 'Opacity should be correct');
});

QUnit.test('getStackName returns null', function(assert) {
    assert.equal(createSeries({ axis: 'axisName' }, this.renderOptions).getStackName(), null);
});

QUnit.test('get axes', function(assert) {
    var valueAxisStub = {},
        argumentAxisStub = {},
        series = createSeries({}, { valueAxis: valueAxisStub, argumentAxis: argumentAxisStub });

    assert.strictEqual(series.getValueAxis(), valueAxisStub);
    assert.strictEqual(series.getArgumentAxis(), argumentAxisStub);
});

QUnit.test('notification of series. allSeriesPoints mode', function(assert) {
    // arrange
    var series = createSeries(),
        target;
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    target = series.getAllPoints()[0];
    target.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    // act
    series.notify({
        action: 'pointSelect',
        target: target
    });
    // assert
    assert.strictEqual(series.getAllPoints()[1].setView.getCall(0).args[0], 'selection');
});

QUnit.test('notification of series. allSeriesPoints. apply normal style. single mode', function(assert) {
    // arrange
    var series = createSeries(),
        target;
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    target = series.getAllPoints()[0];
    target.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    series.notify({
        action: 'pointSelect',
        target: target
    });
    // act
    series.notify({
        action: 'pointDeselect',
        target: series.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series.getAllPoints()[1].resetView.lastCall.args[0], 'selection');
});

QUnit.test('notification of series. allSeriesPoints. multiply mode', function(assert) {
    // arrange
    var series = createSeries(),
        target1,
        target2;
    series.updateData([{ arg: 1 }, { arg: 2 }, { arg: 3 }]);
    series.createPoints();

    target1 = series.getAllPoints()[0];
    target2 = series.getAllPoints()[1];
    target1.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    target2.getOptions.returns({ selectionMode: 'allSeriesPoints' });
    target1.isSelected.returns(true); // emulation multiple mode
    series.notify({
        action: 'pointSelect',
        target: target1
    });
    target2.isSelected.returns(true);
    series.notify({
        action: 'pointSelect',
        target: target2
    });
    // act
    target2.isSelected.returns(false);
    series.notify({
        action: 'pointDeselect',
        target: target2
    });
    // assert
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 1);
    assert.strictEqual(series.getAllPoints()[2].resetView.callCount, 1);
    assert.strictEqual(target1.resetView.callCount, 1);
    assert.strictEqual(target2.resetView.callCount, 0);
});

QUnit.test('notification of series. allSeriesPoints. release selection multiply mode', function(assert) { // check this
    // arrange
    var series = createSeries(),
        allPoints;
    series.updateData([{ arg: 1 }, { arg: 2 }]);
    series.createPoints();

    allPoints = series.getAllPoints();
    allPoints.forEach(function(point) { point.getOptions.returns({ selectionMode: 'allSeriesPoints' }); });
    allPoints[0].isSelected.returns(true);
    series.notify({
        action: 'pointSelect',
        target: allPoints[0]
    });
    allPoints[1].isSelected.returns(true);
    series.notify({
        action: 'pointSelect',
        target: allPoints[1]
    });
    allPoints[0].isSelected.returns(false);
    series.notify({
        action: 'pointDeselect',
        target: allPoints[0]
    });
    allPoints[1].isSelected.returns(false);
    // act
    series.notify({
        action: 'pointDeselect',
        target: allPoints[1]
    });
    // assert
    assert.strictEqual(series.getAllPoints()[0].resetView.lastCall.args[0], 'selection');
    assert.strictEqual(series.getAllPoints()[1].resetView.lastCall.args[0], 'selection');
});

QUnit.test('notify other series. allSeriesPoints mode', function(assert) {
    // arrange
    var series1 = createSeries({}, {
            commonSeriesModes: {
                pointSelectionMode: 'single',
            }
        }),
        series2 = createSeries({
        }, {
            commonSeriesModes: {
                pointSelectionMode: 'single',
            }
        });
    series1.updateData([{ arg: 1 }, { arg: 2 }]);
    series2.updateData([{ arg: 1 }, { arg: 2 }]);
    series1.createPoints();
    series2.createPoints();
    series1.getAllPoints()[0].getOptions.returns({ selectionMode: 'allSeriesPoints' });
    series2.getAllPoints()[0].getOptions.returns({ selectionMode: 'allSeriesPoints' });
    series1.notify({
        action: 'pointSelect',
        target: series1.getAllPoints()[0]
    });
    // act
    series2.notify({
        action: 'pointSelect',
        target: series2.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series1.getAllPoints()[1].setView.callCount, 1);
});

QUnit.test('notification of series. allArgumentPoints', function(assert) {
    // arrange
    var series1 = createSeries({}, {
            commonSeriesModes: {
                pointSelectionMode: 'single'
            }
        }),
        series2 = createSeries({}, {
            commonSeriesModes: {
                pointSelectionMode: 'single'
            }
        });
    series1.updateData([{ arg: 1, val: 1 }]);
    series2.updateData([{ arg: 1, val: 11 }]);
    series1.createPoints();
    series2.createPoints();
    series1.getAllPoints()[0].getOptions.returns({ selectionMode: 'allArgumentPoints' });
    // act
    series2.notify({
        action: 'pointSelect',
        target: series1.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series2.getPointsByArg(1)[0].setView.callCount, 1);
    assert.strictEqual(series2.getPointsByArg(1)[0].setView.lastCall.args[0], 'selection');
});

QUnit.test('notification of series. allArgumentPoints. Deselect', function(assert) {
    // arrange
    var series = createSeries({}, {
        commonSeriesModes: {
            pointSelectionMode: 'single'
        }
    });
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();

    series.getAllPoints()[0].getOptions.returns({ selectionMode: 'allArgumentPoints' });

    series.notify({
        action: 'pointSelect',
        target: series.getAllPoints()[0]
    });
    // act
    series.notify({
        action: 'pointDeselect',
        target: series.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series.getAllPoints()[0].resetView.callCount, 0);
});

QUnit.test('notification of series. allArgumentPoints. multiple mode', function(assert) {
    // arrange
    var series1 = createSeries(),
        series2 = createSeries(),
        series1_point1,
        series2_point1;
    series1.updateData([{ arg: 1, val: 1 }]);
    series2.updateData([{ arg: 1, val: 1 }]);
    series1.createPoints();
    series2.createPoints();

    series1_point1 = series1.getAllPoints()[0];
    series2_point1 = series2.getAllPoints()[0];
    series1_point1.getOptions.returns({ selectionMode: 'allArgumentPoints' });
    series2_point1.getOptions.returns({ selectionMode: 'allArgumentPoints' });
    series1_point1.isSelected.returns(true);
    series1.notify({
        action: 'pointSelect',
        target: series1_point1
    });
    series2.notify({
        action: 'pointSelect',
        target: series1_point1
    });
    series2_point1.isSelected.returns(true);
    series1.notify({
        action: 'pointSelect',
        target: series2_point1
    });
    series2.notify({
        action: 'pointSelect',
        target: series2_point1
    });
    // act
    series2_point1.isSelected.returns(false);
    series1.notify({
        action: 'pointDeselect',
        target: series2_point1
    });
    series2.notify({
        action: 'pointDeselect',
        target: series2_point1
    });
    // assert
    assert.strictEqual(series1_point1.setView.lastCall.args[0], 'selection');
    assert.strictEqual(series2_point1.setView.lastCall.args[0], 'selection');
});

QUnit.test('allArgumentPoints & multiple modes', function(assert) {
    // arrange
    var series = [createSeries({}, {
            commonSeriesModes: {
                pointSelectionMode: 'multiple'
            }
        }), createSeries({}, {
            commonSeriesModes: {
                pointSelectionMode: 'multiple'
            }
        })],
        point1,
        point2,
        selectPoint = function(target) {
            target.isSelected.returns(true);
            series.forEach(function(currentSeries) {
                currentSeries.notify({
                    action: 'pointSelect',
                    target: target
                });
            });
        };
    series[0].updateData([{ arg: 1 }]);
    series[1].updateData([{ arg: 1 }]);
    series[0].createPoints();
    series[1].createPoints();
    point1 = series[0].getAllPoints()[0];
    point2 = series[1].getAllPoints()[0];
    point1.getOptions.returns({ selectionMode: 'allArgumentPoints' });
    point2.getOptions.returns({ selectionMode: 'allArgumentPoints' });
    selectPoint(point1);
    selectPoint(point2);
    // act
    series[0].deselectPoint(point1);
    // assert
    assert.strictEqual(point1.setView.lastCall.args[0], 'selection');
});

QUnit.test('Hover', function(assert) {
    // arrange
    var series = createSeries({ hoverMode: 'includePoints' });
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    // act
    series.hover();
    // assert
    assert.strictEqual(series.isHovered(), true);
    assert.strictEqual(series.lastHoverMode, 'includepoints');
});

QUnit.test('Hover mode with hover mode', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    // act
    series.hover('includePoints');
    // assert
    assert.strictEqual(series.getAllPoints()[0].setView.lastCall.args[0], 'hover');
});

QUnit.test('Clear hover', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.hover();
    // act
    series.clearHover();
    // assert
    assert.strictEqual(series.isHovered(), false);
});

QUnit.test('Hover point', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    // act
    series.hoverPoint(series.getAllPoints()[0]);
    // assert
    assert.strictEqual(series.getAllPoints()[0].applyView.callCount, 1);
});

QUnit.test('call event pipe on hoverPoint', function(assert) {
    // arrange
    var eventPipe = sinon.spy(),
        series = createSeries({}, { eventPipe: eventPipe });
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    // act
    series.hoverPoint(series.getAllPoints()[0]);
    // assert
    assert.deepEqual(eventPipe.lastCall.args[0], { target: series.getAllPoints()[0], action: 'pointHover' });
});

QUnit.test('call event pipe on clearHover', function(assert) {
    // arrange
    var eventPipe = sinon.spy(),
        series = createSeries({}, { eventPipe: eventPipe });
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.getAllPoints()[0].isHovered.returns(true);
    eventPipe.reset();
    // act
    series.clearPointHover();
    // assert
    assert.deepEqual(eventPipe.lastCall.args[0], { target: series.getAllPoints()[0], action: 'clearPointHover' });
});

QUnit.test('point hover. allArgumentPoints', function(assert) {
    // arrange
    var series1 = createSeries(),
        series2 = createSeries();
    series1.updateData([{ arg: 1, val: 1 }]);
    series2.updateData([{ arg: 1, val: 11 }]);
    series1.createPoints();
    series2.createPoints();

    series1.getAllPoints()[0].getOptions.returns({ hoverMode: 'allArgumentPoints' });
    // act
    series2.notify({
        action: 'pointHover',
        target: series1.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series2.getAllPoints()[0].setView.lastCall.args[0], 'hover');
    assert.equal(series2.getAllPoints()[0].isHovered(), false);
});

QUnit.test('point hover. allArgumentPoints. not apply hover style to target point', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.getAllPoints()[0].getOptions.returns({ hoverMode: 'allArgumentPoints' });
    // act
    series.notify({
        action: 'pointHover',
        target: series.getAllPoints()[0]
    });
    // assert
    assert.equal(series.getAllPoints()[0].setView.callCount, 0);
});

QUnit.test('point hover. allSeriesPoints. apply hover style only points target series', function(assert) {
    // arrange
    var series1 = createSeries(),
        series2 = createSeries();
    series1.updateData([{ arg: 1, val: 1 }]);
    series1.createPoints();
    series1.getAllPoints()[0].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    series2.updateData([{ arg: 1, val: 2 }]);
    series2.createPoints();
    series2.getAllPoints()[0].getOptions.returns({ hoverMode: 'allSeriesPoints' });
    // act
    series1.notify({
        action: 'pointHover',
        target: series2.getAllPoints()[0]
    });
    // assert
    assert.equal(series1.getAllPoints()[0].setView.callCount, 0);
});

QUnit.test('point clear hover. allArgumentPoints', function(assert) {
    // arrange
    var series1 = createSeries(),
        series2 = createSeries();
    series1.updateData([{ arg: 1, val: 1 }]);
    series2.updateData([{ arg: 1, val: 11 }]);
    series1.createPoints();
    series2.createPoints();
    series1.getAllPoints()[0].getOptions.returns({ hoverMode: 'allArgumentPoints' });
    // act
    series2.notify({
        action: 'clearPointHover',
        target: series1.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series2.getAllPoints()[0].resetView.lastCall.args[0], 'hover');
});

QUnit.test('hover point. allSeriesPoints', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    series.createPoints();
    series.getAllPoints().forEach(function(currentPoint) {
        currentPoint.getOptions.returns({ hoverMode: 'allSeriesPoints' });
    });
    // act
    series.notify({
        action: 'pointHover',
        target: series.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series.getAllPoints()[1].setView.lastCall.args[0], 'hover');
});

QUnit.test('clearPointHover. allSeriesPoints', function(assert) {
    // arrange
    var series = createSeries();

    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    series.createPoints();
    series.getAllPoints().forEach(function(currentPoint) {
        currentPoint.getOptions.returns({ hoverMode: 'allSeriesPoints' });
    });
    series.hoverPoint(series.getAllPoints()[0]);
    series.notify({
        action: 'pointHover',
        target: series.getAllPoints()[0]
    });
    // act
    series.notify({
        action: 'clearPointHover',
        target: series.getAllPoints()[0]
    });
    // assert
    assert.strictEqual(series.getAllPoints()[1].resetView.callCount, 1);
    assert.strictEqual(series.getAllPoints()[1].resetView.lastCall.args[0], 'hover');
});

QUnit.test('Series of hovered point has hovered view', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    // act
    series.hoverPoint(series.getAllPoints()[0]);
    // assert
    assert.strictEqual(series.stylesHistory[series.stylesHistory.length - 1], 'hover');
});

QUnit.test('Series has normal view after clear point hover', function(assert) {
    // arrange
    var series = createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.hoverPoint(series.getAllPoints()[0]);
    series.getAllPoints()[0].isHovered.returns(true);
    // act
    series.clearPointHover();
    // assert
    assert.strictEqual(series.stylesHistory[series.stylesHistory.length - 1], 'normal');
});

QUnit.test('Hover series in hovered state', function(assert) {
    // arrange
    var eventTrigger = sinon.spy(),
        series = createSeries({}, { eventTrigger: eventTrigger });
    series.hover();
    eventTrigger.reset();
    // act
    series.hover();
    // assert
    assert.equal(eventTrigger.callCount, 0);
});

QUnit.test('Cler hover series in normal state', function(assert) {
    // arrange
    var eventTrigger = sinon.spy(),
        series = createSeries({}, { eventTrigger: eventTrigger });
    // act
    series.clearHover();
    // assert
    assert.equal(eventTrigger.callCount, 0);
});

QUnit.test('Call pointHover twice', function(assert) {
    // arrange
    var eventTrigger = sinon.spy(),
        series = createSeries({}, { eventTrigger: eventTrigger });
    series.updateData([{ arg: 1 }]);
    series.createPoints();

    series.getAllPoints()[0].isHovered.returns(true);
    eventTrigger.reset();
    // act
    series.hoverPoint(series.getAllPoints()[0]);
    // assert
    assert.equal(eventTrigger.callCount, 0);
});

QUnit.module('Legend states', {
    createSeries: function() {
        return createSeries({}, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });
    },
    beforeEach: function() {
        this.legendCallback = sinon.stub();
        environment.beforeEach.call(this);
        sinon.stub(pointModule, 'Point', function(series) {
            var point = new vizMocks.Point();
            point.argument = 1;
            point.series = series;
            return point;
        });
    },
    afterEach: function() {
        pointModule.Point.restore();
        environment.afterEach.call(this);
    }
});

QUnit.test('Apply style', function(assert) {
    var series = this.createSeries();
    series.draw(false, false, this.legendCallback);
    series.hover();
    assert.equal(this.legendCallback.lastCall.args[0], 'applyHover');
});

QUnit.test('None mode', function(assert) {
    var series = this.createSeries();
    series.draw(false, false, this.legendCallback);
    series.hover('none');
    assert.equal(this.legendCallback.callCount, 1);
    assert.equal(this.legendCallback.lastCall.args[0], 'resetItem');
});

QUnit.test('Draw hovered series', function(assert) {
    var series = this.createSeries();
    series.hover();
    series.draw(false, false, this.legendCallback);
    assert.equal(this.legendCallback.lastCall.args[0], 'applyHover');
});

QUnit.test('Pass legendCallback to point on hover point', function(assert) {
    var series = this.createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);

    series.hoverPoint(series.getAllPoints()[0]);
    assert.strictEqual(series.getAllPoints()[0].applyView.lastCall.args[0], this.legendCallback);
});

QUnit.test('Pass legendCallback to point on clearPointHover', function(assert) {
    var series = this.createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    var point = series.getAllPoints()[0];
    point.stub('isHovered').returns(true);

    series.clearPointHover();
    assert.strictEqual(series.getAllPoints()[0].applyView.lastCall.args[0], this.legendCallback);
});

QUnit.test('Pass legendCallback to point on selectPoint', function(assert) {
    var series = this.createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    series.selectPoint(series.getAllPoints()[0]);
    assert.strictEqual(series.getAllPoints()[0].applyView.lastCall.args[0], this.legendCallback);
});


QUnit.test('Pass legendCallback to point on deselect point', function(assert) {
    var series = this.createSeries();
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    var point = series.getAllPoints()[0];
    point.stub('isSelected').returns(true);

    series.deselectPoint(point);
    assert.strictEqual(point.applyView.lastCall.args[0], this.legendCallback);
});

QUnit.test('Call legend callback on point hover argument', function(assert) {
    var series = this.createSeries(),
        target = {
            argument: 1,
            getOptions: function() {
                return {
                    hoverMode: 'allArgumentPoints'
                };
            }
        };
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    series.notify({
        action: 'pointHover',
        notifyLegend: true,
        target: target
    });
    assert.strictEqual(this.legendCallback.callCount, 1);
    assert.strictEqual(this.legendCallback.lastCall.args[0], target);
});

QUnit.test('Not call legend callback on clear point hover argument', function(assert) {
    var series = this.createSeries(),
        target = {
            argument: 1,
            getOptions: function() {
                return {
                    hoverMode: 'allArgumentPoints'
                };
            }
        };
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    series.notify({
        action: 'clearPointHover',
        target: target
    });
    assert.strictEqual(this.legendCallback.callCount, 0);
});

QUnit.test('Call legend callback on clear point hover argument', function(assert) {
    var series = this.createSeries(),
        target = {
            argument: 1,
            getOptions: function() {
                return {
                    hoverMode: 'allArgumentPoints'
                };
            }
        };
    series.updateData([{ arg: 1, val: 1 }]);
    series.createPoints();
    series.draw(false, false, this.legendCallback);
    series.notify({
        action: 'clearPointHover',
        notifyLegend: true,
        target: target
    });
    assert.strictEqual(this.legendCallback.callCount, 1);
    assert.strictEqual(this.legendCallback.lastCall.args[0], target);
});

QUnit.module('States with aggregation', {
    beforeEach: function() {
        var that = this;
        that.legendCallback = sinon.stub();
        environmentWithSinonStubPoint.beforeEach.call(that);
        chartSeriesNS['serieswithresample'] = $.extend({}, chartSeriesNS['mocktype'], {
            _resample: function() {
                return [{ argument: 1, value: 1 }, { argument: 2, value: 2 }];
            }
        });

        this.setupAggregation = function(min, max, start, end, canvasLength) {
            var translator = getTranslator(min, max, start, end, canvasLength);

            that.argumentAxis.getTranslator = function() { return translator; };
            that.argumentAxis.getViewport.returns({
                min: min,
                max: max
            });
        };

        this.argumentAxis = new MockAxis({
            renderer: this.renderer
        });

        that.series = createSeries({
            type: 'seriesWithResample',
            hoverMode: 'includePoints',
            useAggregation: true
        }, {
            commonSeriesModes: {
                pointSelectionMode: 'single'
            },
            argumentAxis: this.argumentAxis
        });
    },
    afterEach: function() {
        chartSeriesNS.seriesWithResample = null;
        environmentWithSinonStubPoint.afterEach.call(this);
    }
});

QUnit.test('hover point with aggregation', function(assert) {
    var series = this.series;
    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    this.setupAggregation(1, 2, undefined, undefined, 15);
    series.createPoints();
    series.getPointByPos(0).isHovered.returns(true);
    series.clearPointHover();
    assert.equal(series.getPointByPos(0).applyView.callCount, 1);
});

QUnit.test('hover series with aggregation', function(assert) {
    var series = this.series;
    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    this.setupAggregation(1, 2, undefined, undefined, 15);
    series.createPoints();
    series.getPointByPos(0).isHovered.returns(true);
    series.hover();
    assert.equal(series.getPointByPos(0).setView.callCount, 1);
});

QUnit.test('reset hovered series with aggregation', function(assert) {
    var series = this.series;
    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    this.setupAggregation(1, 2, undefined, undefined, 15);
    series.createPoints();
    series.getPointByPos(0).isHovered.returns(true);
    series.hover();
    series.getPointByPos(0).resetView.reset();
    series.clearHover();
    assert.equal(series.getPointByPos(0).resetView.callCount, 1);
});

QUnit.test('select points with aggregation', function(assert) {
    var series = this.series;
    series.updateData([{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);
    this.setupAggregation(1, 2, undefined, undefined, 15);
    series.createPoints();
    series.getPointByPos(0).getOptions.returns({ selectionMode: 'onlyPoint' });
    series.getPointByPos(1).isSelected.returns(true);

    series.notify({
        action: 'pointSelect',
        target: series.getPointByPos(0)
    });
    assert.equal(series.getPointByPos(1).applyView.callCount, 1);
});

QUnit.module('getMarginOptions', environment);

QUnit.test('non fullStacked series', function(assert) {
    var series = createSeries({
        type: 'stackedline'
    });

    assert.strictEqual(series.getMarginOptions().percentStick, false);
});

QUnit.test('fullStackedBar series', function(assert) {
    var series = createSeries({
        type: 'fullstackedline'
    });

    assert.strictEqual(series.getMarginOptions().percentStick, true);
});
