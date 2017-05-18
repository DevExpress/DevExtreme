"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    vizUtils = require("viz/core/utils"),
    pointModule = require("viz/series/points/base_point"),
    Series = require("viz/series/base_series").Series,
    polarTranslatorModule = require("viz/translators/polar_translator");

/* global insertMockFactory, MockTranslator */
require("../../helpers/chartMocks.js");

require("viz/chart");

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        widgetType: "chart",
        containerBackgroundColor: "containerColor",
        visible: true,
        label: {
            visible: true,
            border: {},
            connector: {},
            font: {}
        },
        border: {
            visible: true
        },
        point: {
            hoverStyle: {},
            selectionStyle: {}
        },
        valueErrorBar: {
            displayMode: "none"
        },
        hoverStyle: {
            hatching: "h-hatching"
        },
        selectionStyle: {
            hatching: "s-hatching"
        },
        hoverMode: "excludePoints",
        selectionMode: "excludePoints"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
        eventTrigger: noop,
        eventPipe: sinon.spy()
    }, renderSettings);

    renderer.stub("g").reset();

    return new Series(renderSettings, options);
};

function setSeriesState(act, renderSettings) {
    var series = createSeries(this.options, renderSettings);
    series.updateData(this.data);
    series.draw(this.translators);

    series[act]();

    return series;
}

var environment = {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }];
        this.points = [[1, 10], [2, 20], [3, 30], [4, 40]];
        this.areaPoints = this.points.concat([[4, 0], [3, 0], [2, 0], [1, 0]]);
        this.translators = {
            x: new MockTranslator({
                translate: { "First": 10, "Second": 20, "Third": 30, "Fourth": 40, "canvas_position_default": "defaultX" },
                getCanvasVisibleArea: { min: 0, max: 700 }
            }),
            y: new MockTranslator({
                translate: { 1: 100, 2: 200, 3: 300, 4: 400, "canvas_position_default": "defaultY" },
                getCanvasVisibleArea: { min: 0, max: 500 }
            })
        };
    },

    afterEach: function() {

    }
};
var createPoint = function() {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.isInVisibleArea.returns(true);
    stub.getCoords.withArgs(true).returns({ x: 0, y: 0 });
    stub.getDefaultCoords.returns({ x: 0, y: 0 });
    return stub;
};

function createStubPolarTranslator() {
    var stub = sinon.createStubInstance(polarTranslatorModule.PolarTranslator);
    stub.translate.withArgs("canvas_position_start", "canvas_position_top").returns({ x: 0, y: 0 });
    stub.canvas = { left: 0, right: 0, width: 200, top: 0, bottom: 0, height: 300 };
    return stub;
}

var mockPoints = [createPoint(), createPoint(), createPoint(), createPoint()];
var stubPolarTranslator = createStubPolarTranslator();
var environmentWithSinonStubPoint = {
    beforeEach: function() {
        environment.beforeEach.call(this);
        var mockPointIndex = 0;
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data) {
            var stub = mockPoints[mockPointIndex++];
            stub.argument = 1;
            stub.angle = -data.argument;
            stub.radius = data.value;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            stub.draw.reset();
            stub.animate.reset();
            stub.getCoords.returns({ x: data.argument, y: data.value });
            return stub;
        });
        this.polarTranslator = stubPolarTranslator;
    },
    afterEach: function() {
        pointModule.Point.restore();
    }
};


function checkElementPoints(assert, elementPoints, expectedPoints, defaultCoord, comment) {
    assert.ok(elementPoints, comment);
    assert.equal(elementPoints.length, expectedPoints.length, comment + "- point length");
    $.each(elementPoints, function(i, p) {
        if(defaultCoord) {
            assert.ok(p.defaultCoords, comment + " point" + i + " default value");
        } else {
            assert.equal(p.y.toFixed(2), expectedPoints[i][1], comment + " point.y " + i);
        }
        assert.equal(p.x.toFixed(2), expectedPoints[i][0], comment + " point.x " + i);

    });
}

var checkThreeGroups = function(assert, series) {
    var parentGroup = series._group,
        renderer = series._renderer,
        labelsGroup = series._extGroups.labelsGroup;
    assert.ok(parentGroup, "series created without group");

    assert.equal(renderer.stub("g").callCount, 4);
    assert.equal(renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
    assert.equal(renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-elements");
    assert.equal(renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
    assert.equal(renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");

    assert.equal(series._elementsGroup.stub("append").lastCall.args[0], parentGroup);
    assert.equal(series._markersGroup.stub("append").lastCall.args[0], parentGroup);

    assert.ok(series._elementsGroup.stub("append").lastCall.calledBefore(series._markersGroup.stub("append").lastCall));

    assert.equal(series._labelsGroup.stub("append").lastCall.args[0], labelsGroup);
};

var checkFourGroups = function(assert, series) {
    var parentGroup = series._group,
        renderer = series._renderer,
        labelsGroup = series._extGroups.labelsGroup;
    assert.ok(parentGroup, "series created without group");

    assert.equal(renderer.stub("g").callCount, 5);
    assert.equal(renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
    assert.equal(renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-elements");
    assert.equal(renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-borders");
    assert.equal(renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
    assert.equal(renderer.stub("g").getCall(4).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");

    assert.equal(series._elementsGroup.stub("append").lastCall.args[0], parentGroup);
    assert.equal(series._bordersGroup.stub("append").lastCall.args[0], parentGroup);
    assert.equal(series._markersGroup.stub("append").lastCall.args[0], parentGroup);

    assert.ok(series._elementsGroup.stub("append").lastCall.calledBefore(series._bordersGroup.stub("append").lastCall));
    assert.ok(series._bordersGroup.stub("append").lastCall.calledBefore(series._markersGroup.stub("append").lastCall));

    assert.equal(series._labelsGroup.stub("append").lastCall.args[0], labelsGroup);
};

function getPositionRendererPoints(segment) {
    return $.map(segment, function(pt) {
        return { x: pt.x, y: pt.y };
    });
}

function setPolarType(series) {
    series.updateDataType({
        argumentAxisType: "continuous",
        valueAxisType: "continuous"
    });
}

function setDiscreteType(series) {
    series.updateDataType({
        argumentAxisType: "discrete",
        valueAxisType: "discrete"
    });
}

(function AreaElements() {
    QUnit.module("Draw elements. Area Series", environment);

    var checkGroups = checkFourGroups;
    var seriesType = "area";
    QUnit.test("Draw without data", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 0);

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        checkGroups(assert, series);
    });

    QUnit.test("Update simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, false);
        //act
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });

        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        assert.ok(!element.stub("animate").called);

        assert.deepEqual(elementPoints.length, 2, "path element points");
        assert.equal(elementPoints[0].x, 1);
        assert.equal(elementPoints[0].y, 2);
        assert.equal(elementPoints[1].x, 2);
        assert.equal(elementPoints[1].y, 1);

        element = this.renderer.stub("path").getCall(1).returnValue;
        elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        assert.deepEqual(elementPoints.length, 4, "area elements point");
        assert.equal(elementPoints[0].x, 1);
        assert.equal(elementPoints[0].y, 2);
        assert.equal(elementPoints[1].x, 2);
        assert.equal(elementPoints[1].y, 1);
        assert.equal(elementPoints[2].x, 2);
        assert.equal(elementPoints[2].y, 0);
        assert.equal(elementPoints[3].x, 1);
        assert.equal(elementPoints[3].y, 0);

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, true, "line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, true, "area on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.areaPoints, false, "areaPoints");

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data with animation without borders", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            border: { visible: false },
            hoverStyle: {
                border: { visible: false }
            },
            selectionStyle: {
                border: { visible: false }
            }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.areaPoints, true, "area on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.areaPoints, false, "areaPoints");

        checkThreeGroups(assert, series);
    });

    QUnit.test("Draw data with null values", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 3.5, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);

        var path = this.renderer.stub("path").getCall(0).returnValue;
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points.slice(0, 2), true, "first line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.points.slice(0, 2).concat([[2, 0], [1, 0]]), true, "first area element on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        path = this.renderer.stub("path").getCall(2).returnValue;
        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[3.5, 40], [4.5, 40]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "line");
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[3.5, 40], [4.5, 40], [4.5, 0], [3.5, 0]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, this.points.slice(0, 2), false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, this.points.slice(0, 2).concat([[2, 0], [1, 0]]), false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[3.5, 40], [4.5, 40]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[3.5, 40], [4.5, 40], [4.5, 0], [3.5, 0]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Add segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);

        //act
        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 3.5, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);

        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[3.5, 40], [4.5, 40]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "line");

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[3.5, 40], [4.5, 40], [4.5, 0], [3.5, 0]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, this.points.slice(0, 2), false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, this.points.slice(0, 2).concat([[2, 0], [1, 0]]), false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[3.5, 40], [4.5, 40]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[3.5, 40], [4.5, 40], [4.5, 0], [3.5, 0]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);

        var animatePoints,
            element1 = this.renderer.stub("path").getCall(0).returnValue,
            element2 = this.renderer.stub("path").getCall(1).returnValue,
            element3 = this.renderer.stub("path").getCall(2).returnValue,
            element4 = this.renderer.stub("path").getCall(3).returnValue;

        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);

        element1 = this.renderer.stub("path").getCall(0).returnValue,
        animatePoints = element1.stub("animate").lastCall.args[0].points;

        assert.ok(element3.stub("remove").called, "second element should be removed");
        assert.ok(element4.stub("remove").called, "second element should be removed");

        assert.equal(animatePoints.length, 4, "path - first segment points count");
        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        animatePoints = element2.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.areaPoints, false, "first area on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw single point. Rotated", function(assert) {
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }
        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 10 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.value;
            pt.y = pt.argument;
            pt.minX = 5;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[10, 1], [10, 2]], false, "line element");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[10, 1], [10, 2], [5, 2], [5, 1]], false, "area Element");

        checkGroups(assert, series);
    });

    QUnit.module("Area. Trackers", environment);

    QUnit.test("draw tracker.", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 2
        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert
        assert.equal(this.renderer.stub("path").callCount, 3);
        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], this.areaPoints, false, "trackerElement element");
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "area");
        assert.deepEqual(this.renderer.stub("path").getCall(2).returnValue.stub("attr").getCall(0).args[0], { "stroke-width": 0 }, "trackerElement settings");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(2).returnValue);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("draw tracker. one point", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 21
        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 3 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert
        assert.equal(this.renderer.stub("path").callCount, 3);
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "area");
        assert.deepEqual(this.renderer.stub("path").getCall(2).returnValue.stub("attr").getCall(0).args[0], { "stroke-width": 12 }, "trackerElement settings");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(2).returnValue);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.module("Area Series.Groups animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });
            this.series._updateElement = sinon.stub();
        }
    });

    QUnit.test("Draw without animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, false);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, null);
    });

    QUnit.test("Draw with animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);
    });

    QUnit.test("Draw with animation complete animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);

        series._updateElement.lastCall.args[3].complete();
        assert.strictEqual(series._labelsGroup.stub("animate").lastCall.args[0].opacity, 1);
        assert.strictEqual(series._markersGroup.stub("animate").lastCall.args[0].opacity, 1);
    });


    QUnit.test("Draw two segments with animation complete animation", function(assert) {
        var series = this.series;
        this.series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);

        assert.equal(series._updateElement.callCount, 2);
        assert.strictEqual(series._updateElement.firstCall.args[3].complete, undefined);

        series._updateElement.secondCall.args[3].complete();
        assert.strictEqual(series._labelsGroup.stub("animate").lastCall.args[0].opacity, 1);
        assert.strictEqual(series._markersGroup.stub("animate").lastCall.args[0].opacity, 1);
    });

    QUnit.module("Styles. Area Series", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.options = {
                type: seriesType,
                border: {
                    width: "b-n width",
                    color: "b-n color",
                    dashStyle: "b-n dashStyle",
                    opacity: "unexpected",
                    visible: true
                },
                opacity: "n opacity",
                color: "n color",
                selectionStyle: {
                    border: {
                        width: "b-s width",
                        color: "b-s color",
                        dashStyle: "b-s dashStyle",
                        opacity: "unexpected",
                        visible: false
                    },
                    opacity: "s opacity",
                    color: "s color"
                },
                hoverStyle: {
                    border: {
                        width: "b-h width",
                        color: "b-h color",
                        dashStyle: "b-h dashStyle",
                        opacity: "unexpected",
                        visible: true
                    },
                    opacity: "h opacity",
                    color: "h color"
                }
            };
        },
        afterEach: environmentWithSinonStubPoint.afterEach
    });

    QUnit.test("Series without borders", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "area");
    });

    QUnit.test("Series without borders. Remove element", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });
        series.updateData(this.data);
        series.draw(this.translators);
        //act
        series.updateData([]);
        series.draw(this.translators);

        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "area");
        assert.ok(this.renderer.stub("path").firstCall.returnValue.stub("remove").called, "area");
    });

    QUnit.test("Series without border on normal Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: true }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });

    QUnit.test("Series without border on selection Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: true } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });

    QUnit.test("Series without border on hover Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: true } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });

    QUnit.test("First draw - Normal State", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "fill": "n color",
            "opacity": "n opacity",
            "stroke": "none"
        });

        assert.deepEqual(series._bordersGroup._stored_settings, {
            "class": "dxc-borders",
            "clip-path": undefined
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings["dashStyle"], "b-n dashStyle");
            assert.equal(path._stored_settings["stroke"], "b-n color");
            assert.equal(path._stored_settings["stroke-width"], "b-n width");
        });
    });

    QUnit.test("Second draw - Normal State for border elements", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);
        series.draw(this.translators);

        $.each(series._bordersGroup.children, function(_, path) {
            assert.deepEqual(path.attr.lastCall.args, [{
                dashStyle: "b-n dashStyle",
                stroke: "b-n color",
                "stroke-width": "b-n width"
            }]);
        });
    });

    QUnit.test("Apply hover state", function(assert) {
        this.options.hoverStyle.hatching = {
            direction: "h-h direction",
            width: "h-h width",
            opacity: "h-h opacity"
        };
        var series = setSeriesState.call(this, 'hover');

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            "fill": "h color",
            "opacity": "h opacity",
            "stroke": "none",
            "hatching": {
                direction: "h-h direction",
                width: "h-h width",
                opacity: "h-h opacity"
            }
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings["dashStyle"], "b-h dashStyle");
            assert.equal(path._stored_settings["stroke"], "b-h color");
            assert.equal(path._stored_settings["stroke-width"], "b-h width");
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Apply normal state after hover", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        series.hover(true);
        series.clearHover(false);

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            "fill": "n color",
            "opacity": "n opacity",
            "stroke": "none",
            hatching: undefined
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings["dashStyle"], "b-n dashStyle");
            assert.equal(path._stored_settings["stroke"], "b-n color");
            assert.equal(path._stored_settings["stroke-width"], "b-n width");
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Apply selection state", function(assert) {
        this.options.selectionStyle.hatching = {
            direction: "s-h direction",
            width: "s-h width",
            opacity: "s-h opacity"
        };
        var series = setSeriesState.call(this, 'select');

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            "fill": "s color",
            "opacity": "s opacity",
            "stroke": "none",
            "hatching": {
                direction: "s-h direction",
                width: "s-h width",
                opacity: "s-h opacity"
            }
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings["dashStyle"], "b-s dashStyle");
            assert.equal(path._stored_settings["stroke"], "none");
            assert.equal(path._stored_settings["stroke-width"], "b-s width");
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Select series before drawing", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.select();

        series.draw(this.translators, undefined, undefined, noop);

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            "fill": "s color",
            "opacity": "s opacity",
            "stroke": "none",
            "hatching": "s-hatching"
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings["dashStyle"], "b-s dashStyle");
            assert.equal(path._stored_settings["stroke"], "none");
            assert.equal(path._stored_settings["stroke-width"], "b-s width");
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.module("Area Series. LegendStyles", environment);

    QUnit.test("default LegendStyles", function(assert) {
        var series = createSeries({
            type: seriesType,
            opacity: 0.5,
            mainSeriesColor: "mainSeriesColor"
        });

        assert.deepEqual(series.getLegendStyles(), {
            "hover": {
                "fill": "mainSeriesColor",
                "hatching": "h-hatching",
                opacity: undefined
            },
            "normal": {
                "fill": "mainSeriesColor",
                opacity: 0.5,
                hatching: undefined
            },
            "selection": {
                "fill": "mainSeriesColor",
                "hatching": "s-hatching",
                opacity: undefined
            }
        });
    });

    QUnit.test("styles colors defined", function(assert) {
        var series = createSeries({
            type: seriesType,
            color: "n-color",
            opacity: "opacity",
            hoverStyle: {
                color: "h-color"
            },
            selectionStyle: {
                color: "s-color"
            }
        });

        assert.deepEqual(series.getLegendStyles(), {
            "hover": {
                "fill": "h-color",
                "hatching": "h-hatching",
                opacity: undefined
            },
            "normal": {
                "fill": "n-color",
                opacity: "opacity",
                hatching: undefined
            },
            "selection": {
                "fill": "s-color",
                "hatching": "s-hatching",
                opacity: undefined
            }
        });
    });

    QUnit.module("Area. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "area"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "area"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check marker clearing", function(assert) {
        var series = createSeries({
                type: "area"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        var markerSpy = series._markersGroup.stub("animate");
        series._labelsGroup.stub("animate").lastCall.args[2]();

        assert.ok(markerSpy.calledOnce);
        assert.equal(markerSpy.lastCall.args.length, 3);
        assert.deepEqual(markerSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(markerSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(markerSpy.lastCall.args[2]);
    });

    QUnit.test("Check segment clearing", function(assert) {
        var series = createSeries({
                type: "area"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "line" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        series._labelsGroup.stub("animate").lastCall.args[2]();
        var updateSpy = sinon.spy(series, "_oldUpdateElement");
        series._markersGroup.stub("animate").lastCall.args[2]();

        assert.ok(updateSpy.calledOnce);
        assert.equal(updateSpy.lastCall.args.length, 5);
        assert.ok(updateSpy.lastCall.args[0]);
        assert.ok(updateSpy.lastCall.args[1]);
        assert.ok(updateSpy.lastCall.args[2]);
        assert.ok(updateSpy.lastCall.args[4]);
        assert.equal(updateSpy.lastCall.args[3].partitionDuration, 0.5);
    });
})();

(function StepAreaElements() {
    QUnit.module("Draw elements. StepArea Series", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 20 }, { arg: 4, val: 40 }];
            this.points = [[1, 10], [2, 10], [2, 20], [3, 20], [4, 20], [4, 40]];
            this.areaPoints = this.points.concat([[4, 0], [4, 0], [3, 0], [2, 0], [2, 0], [1, 0]]);
        },
        afterEach: environment.afterEach
    });

    var checkGroups = checkFourGroups;
    var seriesType = "steparea";

    QUnit.test("Draw without data", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 0);

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        checkGroups(assert, series);
    });

    QUnit.test("Update simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, false);
        //act
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });

        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        assert.ok(!element.stub("animate").called);
        checkElementPoints(assert, elementPoints, [[1, 2], [2, 2], [2, 1]], false, "line points");

        element = this.renderer.stub("path").getCall(1).returnValue;
        elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        assert.ok(!element.stub("animate").called);
        checkElementPoints(assert, elementPoints, [[1, 2], [2, 2], [2, 1], [2, 0], [2, 0], [1, 0]], false, "areaElement");

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, true, "line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, true, "area on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, this.areaPoints, false, "areaPoints");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[1, 10], [2, 10], [2, 20]], true, "first line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        var path = this.renderer.stub("path").getCall(0).returnValue;
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[1, 10], [2, 10], [2, 20], [2, 0], [2, 0], [1, 0]], true, "first area element on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[4, 40], [5, 40]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "line");
        path = this.renderer.stub("path").getCall(2).returnValue;
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[4, 40], [5, 40], [5, 0], [4, 0]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20], [2, 0], [2, 0], [1, 0]], false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[4, 40], [5, 40]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[4, 40], [5, 40], [5, 0], [4, 0]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Add segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);

        //act
        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[4, 40], [5, 40]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "line");

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[4, 40], [5, 40], [5, 0], [4, 0]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "area");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20], [2, 0], [2, 0], [1, 0]], false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[4, 40], [5, 40]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[4, 40], [5, 40], [5, 0], [4, 0]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 40 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);

        var element1 = this.renderer.stub("path").getCall(0).returnValue,
            element2 = this.renderer.stub("path").getCall(1).returnValue,
            element3 = this.renderer.stub("path").getCall(2).returnValue,
            element4 = this.renderer.stub("path").getCall(3).returnValue,
            animatePoints;

        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);

        element1 = this.renderer.stub("path").getCall(0).returnValue;
        animatePoints = element1.stub("animate").lastCall.args[0].points;

        assert.ok(element3.stub("remove"), "second line element should be removed");
        assert.ok(element4.stub("remove"), "second element should be removed");

        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        animatePoints = element2.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.areaPoints, false, "first area on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw single point. Rotated", function(assert) {
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 10 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.value;
            pt.y = pt.argument;
            pt.minX = 5;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[10, 1], [10, 1], [10, 2]], false, "line element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[10, 1], [10, 1], [10, 2], [5, 2], [5, 1], [5, 1]], false, "area Element");

        checkGroups(assert, series);
    });

    QUnit.module("Steparea. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "steparea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "steparea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check marker clearing", function(assert) {
        var series = createSeries({
                type: "steparea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        var markerSpy = series._markersGroup.stub("animate");
        series._labelsGroup.stub("animate").lastCall.args[2]();

        assert.ok(markerSpy.calledOnce);
        assert.equal(markerSpy.lastCall.args.length, 3);
        assert.deepEqual(markerSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(markerSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(markerSpy.lastCall.args[2]);
    });

    QUnit.test("Check segment clearing", function(assert) {
        var series = createSeries({
                type: "steparea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "line" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        series._labelsGroup.stub("animate").lastCall.args[2]();
        var updateSpy = sinon.spy(series, "_oldUpdateElement");
        series._markersGroup.stub("animate").lastCall.args[2]();

        assert.ok(updateSpy.calledOnce);
        assert.equal(updateSpy.lastCall.args.length, 5);
        assert.ok(updateSpy.lastCall.args[0]);
        assert.ok(updateSpy.lastCall.args[1]);
        assert.ok(updateSpy.lastCall.args[2]);
        assert.ok(updateSpy.lastCall.args[4]);
        assert.equal(updateSpy.lastCall.args[3].partitionDuration, 0.5);
    });

    QUnit.module("Styles. StepArea Series", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.options = {
                type: seriesType,
                border: {
                    width: "b-n width",
                    color: "b-n color",
                    dashStyle: "b-n dashStyle",
                    opacity: "unexpected",
                    visible: true
                },
                opacity: "n opacity",
                color: "n color",
                selectionStyle: {
                    border: {
                        width: "b-s width",
                        color: "b-s color",
                        dashStyle: "b-s dashStyle",
                        opacity: "unexpected",
                        visible: false
                    },
                    opacity: "s opacity",
                    color: "s color"
                },
                hoverStyle: {
                    border: {
                        width: "b-h width",
                        color: "b-h color",
                        dashStyle: "b-h dashStyle",
                        opacity: "unexpected",
                        visible: true
                    },
                    opacity: "h opacity",
                    color: "h color"
                }
            };

        },
        afterEach: environmentWithSinonStubPoint.afterEach
    });

    QUnit.test("Series without borders", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "area");
    });

    QUnit.test("Series without borders. Remove element", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });
        series.updateData(this.data);
        series.draw(this.translators);
        //act
        series.updateData([]);
        series.draw(this.translators);

        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "area");
        assert.ok(this.renderer.stub("path").firstCall.returnValue.stub("remove").called, "area");
    });

    QUnit.test("Series without border on normal Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: true }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });

    QUnit.test("Series without border on selection Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: true } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });

    QUnit.test("Series without border on hover Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: true } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");
    });
})();

(function SplineAreaElements() {
    QUnit.module("Draw elements. SplineArea Series", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.points = [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]];
            this.areaPoints = this.points.concat([[12, 10], [12, 5], [12, 5], [12, 5], [10.5, 5], [9, 5], [7.5, 5], [7.5, 5], [6, 5], [4.5, 5], [4.5, 5], [3, 5], [1.5, 5], [0, 5], [0, 5]]);
        },
        afterEach: environment.afterEach
    });

    var checkGroups = checkFourGroups;
    var seriesType = "splinearea";

    QUnit.test("Draw without data", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 0);

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkGroups(assert, series);
    });

    QUnit.test("Update simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, false);
        //act
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 0;
        });

        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        assert.ok(!element.stub("animate").called);
        checkElementPoints(assert, elementPoints, [[1, 2], [1, 2], [2, 1], [2, 1]], false, "line points");

        element = this.renderer.stub("path").getCall(1).returnValue;
        elementPoints = element._stored_settings.points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        assert.ok(!element.stub("animate").called);
        checkElementPoints(assert, elementPoints, [[1, 2], [1, 2], [2, 1], [2, 1], [2, 1], [2, 0], [2, 0], [2, 0], [1, 0], [1, 0]], false, "areaElement");

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, true, "line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, true, "area on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, this.areaPoints, false, "areaPoints");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        this.data.splice(2, 1, { arg: 2, val: null });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[0, 5], [0, 5], [3, 5], [3, 5]], true, "first line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        var path = this.renderer.stub("path").getCall(0).returnValue;
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[0, 5], [0, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [0, 5], [0, 5]], true, "first area element on creating");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[9, 5], [9, 5], [12, 5], [12, 5]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "bezier");
        path = this.renderer.stub("path").getCall(2).returnValue;
        assert.ok(path.sharp.calledOnce);
        assert.ok(path.sharp.firstCall.calledAfter(path.attr.getCall(path.attr.callCount - 2)));

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[9, 5], [9, 5], [12, 5], [12, 5], [12, 5], [12, 5], [12, 5], [12, 5], [9, 5], [9, 5]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "bezierarea");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20], [3, 20], [3, 5], [3, 5], [3, 5], [0, 5], [0, 5]], false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10], [12, 10], [12, 5], [12, 5], [12, 5], [9, 5], [9, 5]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Add segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, true);
        this.data.splice(2, 1, { arg: 2, val: null });
        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], [[9, 5], [9, 5], [12, 5], [12, 5]], true, "second line element on creating");
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], [[9, 5], [9, 5], [12, 5], [12, 5], [12, 5], [12, 5], [12, 5], [12, 5], [9, 5], [9, 5]], true, "second area element on creating");
        assert.equal(this.renderer.stub("path").getCall(3).args[1], "bezierarea");

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20], [3, 20], [3, 5], [3, 5], [3, 5], [0, 5], [0, 5]], false, "first area element on animating");

        element = this.renderer.stub("path").getCall(2).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._bordersGroup);
        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10]], false, "second line element on animating");

        element = this.renderer.stub("path").getCall(3).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10], [12, 10], [12, 5], [12, 5], [12, 5], [9, 5], [9, 5]], false, "second area element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            data = this.data.slice();
        this.data.splice(2, 1, { arg: 2, val: null });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, true);

        var element1 = this.renderer.stub("path").getCall(0).returnValue,
            element2 = this.renderer.stub("path").getCall(1).returnValue,
            element3 = this.renderer.stub("path").getCall(2).returnValue,
            element4 = this.renderer.stub("path").getCall(3).returnValue,
            animatePoints;

        //act
        series.updateData(data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, true);

        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);

        element1 = this.renderer.stub("path").getCall(0).returnValue;
        animatePoints = element1.stub("animate").lastCall.args[0].points;

        assert.ok(element3.stub("remove"), "second line element should be removed");
        assert.ok(element4.stub("remove"), "second area segment should be removed");

        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        animatePoints = element2.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.areaPoints, false, "first area on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Points preparation - horizontal line rotated", function(assert) {
        var data = [{ arg: 0, val: 10 }, { arg: 0, val: 15 }, { arg: 0, val: 20 }];
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData(data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.value;
            pt.y = pt.argument;
            pt.minX = 0;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[10, 0], [10, 0], [15, 0], [15, 0], [15, 0], [20, 0], [20, 0]], false, "spline points");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[10, 0], [10, 0], [15, 0], [15, 0], [15, 0], [20, 0], [20, 0], [20, 0],
                                                            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], false, "area points");

    });

    QUnit.test("Points preparation (rotated)", function(assert) {
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.value;
            pt.y = pt.argument;
            pt.minX = 5;
        });

        $.each(this.points, function(_, p) {
            p.splice().reverse();
        });
        $.each(this.areaPoints, function(_, p) {
            p.reverse();
        });

        series.draw(this.translators, false);

        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "spline points");

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area points");
    });

    QUnit.test("Draw single point", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 10 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[1, 10], [1, 10], [2, 10], [2, 10]], false, "line element");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[1, 10], [1, 10], [2, 10], [2, 10], [2, 10], [2, 5], [2, 5], [2, 5], [1, 5], [1, 5]], false, "area Element");

        checkGroups(assert, series);
    });

    QUnit.test("Draw single point. Rotated", function(assert) {
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }

        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 10 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.value;
            pt.y = pt.argument;
            pt.minX = 5;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[10, 1], [10, 1], [10, 2], [10, 2]], false, "line element");
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[10, 1], [10, 1], [10, 2], [10, 2], [10, 2], [5, 2], [5, 2], [5, 2], [5, 1], [5, 1]], false, "area Element");

        checkGroups(assert, series);
    });

    QUnit.module("BezierArea. Trackers", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.points = [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]];
            this.areaPoints = this.points.concat([[12, 10], [12, 5], [12, 5], [12, 5], [10.5, 5], [9, 5], [7.5, 5], [7.5, 5], [6, 5], [4.5, 5], [4.5, 5], [3, 5], [1.5, 5], [0, 5], [0, 5]]);
        },
        afterEach: function() {
            environment.afterEach.call(this);
        }
    });

    QUnit.test("draw tracker.", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 2
        }, { renderer: this.renderer });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 5;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert
        assert.equal(this.renderer.stub("path").callCount, 3);
        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], this.areaPoints, false, "trackerElement element");
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "bezierarea");
        assert.deepEqual(this.renderer.stub("path").getCall(2).returnValue.stub("attr").getCall(0).args[0], { "stroke-width": 0 }, "trackerElement settings");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(2).returnValue);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("draw tracker. one point", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 21
        }, { renderer: this.renderer });
        series.updateData([{ arg: 1, val: 3 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert
        assert.equal(this.renderer.stub("path").callCount, 3);
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "bezierarea");
        assert.deepEqual(this.renderer.stub("path").getCall(2).returnValue.stub("attr").getCall(0).args[0], { "stroke-width": 12 }, "trackerElement settings");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(2).returnValue);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });


    QUnit.module("Styles. SplineArea Series", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.options = {
                type: seriesType,
                border: {
                    width: "b-n width",
                    color: "b-n color",
                    dashStyle: "b-n dashStyle",
                    opacity: "unexpected",
                    visible: true
                },
                opacity: "n opacity",
                color: "n color",
                selectionStyle: {
                    border: {
                        width: "b-s width",
                        color: "b-s color",
                        dashStyle: "b-s dashStyle",
                        opacity: "unexpected",
                        visible: false
                    },
                    opacity: "s opacity",
                    color: "s color"
                },
                hoverStyle: {
                    border: {
                        width: "b-h width",
                        color: "b-h color",
                        dashStyle: "b-h dashStyle",
                        opacity: "unexpected",
                        visible: true
                    },
                    opacity: "h opacity",
                    color: "h color"
                }
            };

        },
        afterEach: environmentWithSinonStubPoint.afterEach
    });

    QUnit.test("Series without borders", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "bezierarea");
    });

    QUnit.test("Series without borders. Remove element", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });
        series.updateData(this.data);
        series.draw(this.translators);
        //act
        series.updateData([{}]);
        series.draw(this.translators);

        checkThreeGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").firstCall.args[1], "bezierarea");
        assert.ok(this.renderer.stub("path").firstCall.returnValue.stub("remove").called, "area");
    });

    QUnit.test("Series without border on normal Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: true }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");
    });

    QUnit.test("Series without border on selection Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: true } }, hoverStyle: { border: { visible: false } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");
    });

    QUnit.test("Series without border on hover Style", function(assert) {
        var series = createSeries({ type: seriesType, border: { visible: false }, selectionStyle: { border: { visible: false } }, hoverStyle: { border: { visible: true } } }, { renderer: this.renderer });

        series.updateData(this.data);

        series.draw(this.translators);
        checkGroups(assert, series);
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezierarea");
    });

    QUnit.module("Groups animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });
            this.series._updateElement = sinon.stub();
        }
    });

    QUnit.test("Draw without animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, false);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, null);
    });

    QUnit.test("Draw with animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);
    });

    QUnit.test("Draw with animation complete animation", function(assert) {
        var series = this.series;
        this.series.updateData(this.data);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);

        series._updateElement.lastCall.args[3].complete();
        assert.strictEqual(series._labelsGroup.stub("animate").lastCall.args[0].opacity, 1);
        assert.strictEqual(series._markersGroup.stub("animate").lastCall.args[0].opacity, 1);
    });


    QUnit.test("Draw two segments with animation complete animation", function(assert) {
        var series = this.series;
        this.series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        //act
        series.draw(this.translators, true);
        //assert
        assert.strictEqual(series._labelsGroup._stored_settings.opacity, 0.001);
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 0.001);

        assert.equal(series._updateElement.callCount, 2);
        assert.strictEqual(series._updateElement.firstCall.args[3].complete, undefined);

        series._updateElement.secondCall.args[3].complete();
        assert.strictEqual(series._labelsGroup.stub("animate").lastCall.args[0].opacity, 1);
        assert.strictEqual(series._markersGroup.stub("animate").lastCall.args[0].opacity, 1);
    });

    QUnit.module("Spline area. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "splinearea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "splinearea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        var clearingSpy = sinon.spy(series, "_oldClearingAnimation"),
            labelSpy = series._labelsGroup.stub("animate");
        series.draw(this.translators, true);

        assert.ok(clearingSpy.calledOnce);

        assert.ok(labelSpy.calledOnce);
        assert.equal(labelSpy.lastCall.args.length, 3);
        assert.deepEqual(labelSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(labelSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(labelSpy.lastCall.args[2]);
    });

    QUnit.test("Check marker clearing", function(assert) {
        var series = createSeries({
                type: "splinearea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        var markerSpy = series._markersGroup.stub("animate");
        series._labelsGroup.stub("animate").lastCall.args[2]();

        assert.ok(markerSpy.calledOnce);
        assert.equal(markerSpy.lastCall.args.length, 3);
        assert.deepEqual(markerSpy.lastCall.args[0], { opacity: 0.001 });
        assert.deepEqual(markerSpy.lastCall.args[1], { duration: 400, partitionDuration: 0.5 });
        assert.ok(markerSpy.lastCall.args[2]);
    });

    QUnit.test("Check segment clearing", function(assert) {
        var series = createSeries({
                type: "splinearea"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "line" });

        series.updateData(this.data);
        series.draw(this.translators, false);
        series.updateOptions(newOptions);

        series.draw(this.translators, true);
        series._labelsGroup.stub("animate").lastCall.args[2]();
        var updateSpy = sinon.spy(series, "_oldUpdateElement");
        series._markersGroup.stub("animate").lastCall.args[2]();

        assert.ok(updateSpy.calledOnce);
        assert.equal(updateSpy.lastCall.args.length, 5);
        assert.ok(updateSpy.lastCall.args[0]);
        assert.ok(updateSpy.lastCall.args[1]);
        assert.ok(updateSpy.lastCall.args[2]);
        assert.ok(updateSpy.lastCall.args[4]);
        assert.equal(updateSpy.lastCall.args[3].partitionDuration, 0.5);
    });
})();



(function StackedSplineAreaElements() {
    QUnit.module("Draw elements. StackedSpline Series", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.data1 = [{ arg: 0, val: 20 }, { arg: 3, val: 40 }, { arg: 6, val: 20 }, { arg: 9, val: 40 }, { arg: 12, val: 20 }];
            this.points = [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]];
            this.points1 = [[0, 20], [0, 20], [1.5, 40], [3, 40], [4.5, 40], [4.5, 20], [6, 20], [7.5, 20], [7.5, 40], [9, 40], [10.5, 40], [12, 20], [12, 20]];
            this.areaPoints = this.points.concat([[12, 10], [12, 5], [12, 5], [12, 5], [10.5, 5], [9, 5], [7.5, 5], [7.5, 5], [6, 5], [4.5, 5], [4.5, 5], [3, 5], [1.5, 5], [0, 5], [0, 5]]);
            this.areaPoints1 = this.points1.concat([this.points1[this.points1.length - 1], this.points[this.points.length - 1]]).concat(this.points.slice().reverse());
        },
        afterEach: environment.afterEach
    });

    var seriesType = "stackedsplinearea";

    QUnit.test("Draw simple data", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val;
        });
        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);

        //assert
        assert.equal(this.renderer.stub("path").callCount, 4);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.deepEqual(this.renderer.stub("path").getCall(0).args[1], "bezier");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area element");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], this.points1, false, "line1 element");
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "bezier");
        assert.ok(this.renderer.stub("path").getCall(2).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(2).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(2).returnValue.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], this.areaPoints1, false, "area2 element");
        assert.deepEqual(this.renderer.stub("path").getCall(3).args[1], "bezierarea");
    });

    QUnit.test("Draw data with null value in bottom series", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        this.data[2].val = null;

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val || 0;
        });
        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        //assert
        var path1 = [this.points[0], this.points[0], this.points[3], this.points[3]],
            path2 = [this.points[9], this.points[9]].concat(this.points.slice(11));

        assert.equal(this.renderer.stub("path").callCount, 6);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], path1, false, "line element");
        assert.deepEqual(this.renderer.stub("path").getCall(0).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], path1.concat([this.points[3], [3, 5]]).concat([[3, 5], [3, 5], [0, 5], [0, 5]]), false, "area element");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], path2, false, "line1 element");
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], path2.concat([this.points[this.points.length - 1], [12, 5]]).concat([[12, 5], [12, 5], [9, 5], [9, 5]]), false, "area1 element");
        assert.deepEqual(this.renderer.stub("path").getCall(3).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(4).args[0], this.points1, false, "line2 element");
        assert.deepEqual(this.renderer.stub("path").getCall(4).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(5).args[0], this.areaPoints1.slice(0, 17).concat([[9, 20], [9, 20], [9, 20], [7.5, 0], [6, 0], [4.5, 0], [3, 20]]).concat(path1.slice().reverse()), false, "area2 element");
        assert.deepEqual(this.renderer.stub("path").getCall(5).args[1], "bezierarea");
    });

    QUnit.test("Draw data with null value in top series", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        this.data1[2].val = null;

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val || 0;
        });
        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        //assert
        var path1 = [this.points1[0], this.points1[0], this.points1[3], this.points1[3]],
            path2 = [this.points1[9], this.points1[9]].concat(this.points1.slice(11));

        assert.equal(this.renderer.stub("path").callCount, 6);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.deepEqual(this.renderer.stub("path").getCall(0).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.areaPoints, false, "area element");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(2).args[0], path1, false, "line1 element");
        assert.deepEqual(this.renderer.stub("path").getCall(2).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(3).args[0], path1.concat([this.points1[3], [3, 20]]).concat([[3, 20], [1.5, 20], [0, 10], [0, 10]]), false, "area1 element");
        assert.deepEqual(this.renderer.stub("path").getCall(3).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.stub("path").getCall(4).args[0], path2, false, "line2 element");
        assert.deepEqual(this.renderer.stub("path").getCall(4).args[1], "bezier");

        checkElementPoints(assert, this.renderer.stub("path").getCall(5).args[0], path2.concat([this.points1[this.points1.length - 1], [12, 10]]).concat([[12, 10], [12, 10], [10.5, 20], [9, 20]]), false, "area2 element");
        assert.deepEqual(this.renderer.stub("path").getCall(5).args[1], "bezierarea");
    });

    QUnit.test("Draw data with null value in bottom series with holes", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        this.data[2].val = null;

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val || 0;
        });

        series1.getAllPoints()[1].leftHole = 29;
        series1.getAllPoints()[1].minLeftHole = 9;

        series1.getAllPoints()[3].leftHole = 13;
        series1.getAllPoints()[3].minLeftHole = 7;

        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.path.callCount, 6, "elements drawn");

        var path1 = [this.points[0], this.points[0], this.points[3], this.points[3]],
            path2 = [this.points[9], this.points[9]].concat(this.points.slice(11));

        checkElementPoints(assert, this.renderer.path.getCall(0).args[0], path1, false, "line element");
        assert.equal(this.renderer.path.getCall(0).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(1).args[0], path1.concat([this.points[3], [3, 5]]).concat([[3, 5], [3, 5], [0, 5], [0, 5]]), false, "area Element");
        assert.equal(this.renderer.path.getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.path.getCall(2).args[0], path2, false, "line1 element");
        assert.equal(this.renderer.path.getCall(2).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(3).args[0], path2.concat([this.points[this.points.length - 1], [12, 5]]).concat([[12, 5], [12, 5], [9, 5], [9, 5]]), false, "area1 Element");
        assert.equal(this.renderer.path.getCall(3).args[1], "bezierarea");

        path2 = this.points1.slice(0, 3).concat([[3, 40], [3, 40], [3, 40]]).concat(this.points1.slice(3, 9)).concat([[9, 40], [9, 40], [9, 40]]).concat(this.points1.slice(9, 19));
        checkElementPoints(assert, this.renderer.path.getCall(4).args[0], path2, false, "line2 element");
        assert.equal(this.renderer.path.getCall(4).args[1], "bezier");

        checkElementPoints(assert, this.renderer.path.getCall(5).args[0], [[0, 20], [0, 20], [1.5, 40], [3, 40], [3, 40], [3, 40], [3, 40], [4.5, 40], [4.5, 20], [6, 20], [7.5, 20],
            [7.5, 40], [9, 40], [9, 40], [9, 40], [9, 40], [10.5, 40], [12, 20], [12, 20], [12, 20], [12, 10], [12, 10], [12, 10], [9, 20], [9, 20], [9, 20], [9, 20],
            [9, 20], [7.5, 20], [7.5, 0], [6, 0], [4.5, 0], [3, 20], [3, 20], [3, 20], [3, 20], [3, 20], [1.5, 20], [0, 10], [0, 10]], false, "area2 Element");
        assert.equal(this.renderer.path.getCall(5).args[1], "bezierarea");

        this.areaPoints1.slice(0, 17).concat([[9, 20], [9, 20], [9, 20], [7.5, 0], [6, 0], [4.5, 0], [3, 20]]).concat(path1.slice().reverse());
    });

    QUnit.test("Draw three series with holes", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series2 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        this.data1[2].val = null;

        series.updateData(this.data);
        series1.updateData(this.data1);
        var data = [{ arg: 0, val: 70 }, { arg: 3, val: 90 }, { arg: 6, val: 40 }, { arg: 9, val: 140 }, { arg: 12, val: 220 }];
        series2.updateData(data);
        series1._prevSeries = series;
        series2._prevSeries = series1;
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val || 0;
        });

        $.each(series2._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val || 0;
        });


        series1.getAllPoints()[1].leftHole = 29;
        series1.getAllPoints()[1].minLeftHole = 9;

        series1.getAllPoints()[3].leftHole = 13;
        series1.getAllPoints()[3].minLeftHole = 7;

        series2.getAllPoints()[1].leftHole = 29;
        series2.getAllPoints()[1].minLeftHole = 9;

        series2.getAllPoints()[3].leftHole = 13;
        series2.getAllPoints()[3].minLeftHole = 7;

        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        series2.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.path.callCount, 8, "elements drawn");

        checkElementPoints(assert, this.renderer.path.getCall(0).args[0], [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]], false, "line element");
        assert.equal(this.renderer.path.getCall(0).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(1).args[0], [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10], [12, 10], [12, 5], [12, 5], [12, 5], [10.5, 5], [9, 5], [7.5, 5], [7.5, 5], [6, 5], [4.5, 5], [4.5, 5], [3, 5], [1.5, 5], [0, 5], [0, 5]], false, "area2 Element");
        assert.equal(this.renderer.path.getCall(1).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.path.getCall(2).args[0], [[0, 20], [0, 20], [1.5, 40], [3, 40], [3, 40], [3, 40], [3, 40]], false, "line1 element");
        assert.equal(this.renderer.path.getCall(2).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(3).args[0], [[0, 20], [0, 20], [1.5, 40], [3, 40], [3, 40], [3, 40], [3, 40], [3, 40], [3, 20], [3, 20], [1.5, 20], [3, 20], [3, 20], [1.5, 20], [0, 10], [0, 10]], false, "area2 Element");
        assert.equal(this.renderer.path.getCall(3).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.path.getCall(4).args[0], [[9, 40], [9, 40], [9, 40], [9, 40], [10.5, 40], [12, 20], [12, 20]], false, "line1 element");
        assert.equal(this.renderer.path.getCall(4).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(5).args[0], [[9, 40], [9, 40], [9, 40], [9, 40], [10.5, 40], [12, 20], [12, 20], [12, 20], [12, 10], [12, 10], [12, 10], [10.5, 20], [9, 20], [7.5, 20], [9, 20], [9, 20]], false, "area22 Element");
        assert.equal(this.renderer.path.getCall(5).args[1], "bezierarea");

        checkElementPoints(assert, this.renderer.path.getCall(6).args[0], [[0, 70], [0, 70], [1.5, 90], [3, 90], [3, 90], [3, 90], [3, 90], [4.5, 90], [4.5, 40], [6, 40], [7.5, 40], [7.5, 140], [9, 140], [9, 140], [9, 140], [9, 140], [10.5, 140], [12, 220], [12, 220]], false, "line2 element");
        assert.equal(this.renderer.path.getCall(6).args[1], "bezier");
        checkElementPoints(assert, this.renderer.path.getCall(7).args[0], [[0, 70], [0, 70], [1.5, 90], [3, 90], [3, 90], [3, 90], [3, 90], [4.5, 90], [4.5, 40], [6, 40], [7.5, 40], [7.5, 140], [9, 140], [9, 140], [9, 140], [9, 140], [10.5, 140], [12, 220], [12, 220], [12, 220], [12, 10], [12, 10], [12, 20], [10.5, 40], [9, 20], [9, 40], [9, 20], [9, 20], [9, 40], [7.5, 10], [6, 10], [4.5, 10], [3, 20], [3, 20], [3, 40], [3, 40],
            [3, 20], [1.5, 40], [0, 10], [0, 10]], false, "area2 Element");
        assert.equal(this.renderer.path.getCall(7).args[1], "bezierarea");
    });

    //T398875
    QUnit.test("Series should be brought to background on draw", function(assert) {
        var seriesGroup = this.renderer.g(),
            series = createSeries({
                type: seriesType
            }, { renderer: this.renderer, seriesGroup: seriesGroup });

        series.updateData(this.data);
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(seriesGroup.children.length, 1);
        assert.equal(seriesGroup.children[0].toBackground.callCount, 1);
    });

    //T398875
    QUnit.test("Series should be brought to background on draw, fullstackedsplinearea", function(assert) {
        var seriesGroup = this.renderer.g(),
            series = createSeries({
                type: "fullstackedsplinearea"
            }, { renderer: this.renderer, seriesGroup: seriesGroup });

        series.updateData(this.data);
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(seriesGroup.children.length, 1);
        assert.equal(seriesGroup.children[0].toBackground.callCount, 1);
    });
})();

(function StackedArea() {
    QUnit.module("stacked Area", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.data1 = [{ arg: 0, val: 20 }, { arg: 3, val: 40 }, { arg: 6, val: 20 }, { arg: 9, val: 40 }, { arg: 12, val: 20 }];
            this.points = [[0, 10], [3, 20], [6, 10], [9, 20], [12, 10]];
            this.points1 = [[0, 20], [3, 40], [6, 20], [9, 40], [12, 20]];
            this.areaPoints = this.points.concat([[12, 5], [9, 5], [6, 5], [3, 5], [0, 5]]);
            this.areaPoints1 = this.points1.concat(this.points.slice().reverse());
        },
        afterEach: environment.afterEach
    });

    var seriesType = "stackedarea";

    QUnit.test("Draw simple data - first series in stack", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }

        }, { renderer: this.renderer });

        series.updateData(this.data);
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.path.callCount, 2, "elements drawn");

        checkElementPoints(assert, this.renderer.path.getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.path.getCall(0).args[1], "line");
        checkElementPoints(assert, this.renderer.path.getCall(1).args[0], this.areaPoints, false, "area Element");
        assert.equal(this.renderer.path.getCall(1).args[1], "area");
    });

    QUnit.test("Draw simple data", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        $.each(series1.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val;
        });
        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.path.callCount, 4, "elements drawn");

        checkElementPoints(assert, this.renderer.path.getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.path.getCall(0).args[1], "line");
        checkElementPoints(assert, this.renderer.path.getCall(1).args[0], this.areaPoints, false, "area Element");
        assert.equal(this.renderer.path.getCall(1).args[1], "area");

        checkElementPoints(assert, this.renderer.path.getCall(2).args[0], this.points1, false, "line1 element");
        assert.equal(this.renderer.path.getCall(2).args[1], "line");
        checkElementPoints(assert, this.renderer.path.getCall(3).args[0], this.areaPoints1, false, "area1 Element");
        assert.equal(this.renderer.path.getCall(3).args[1], "area");
    });

    QUnit.test("Draw data if first series in stack has null points and holes", function(assert) {
        var that = this,
            series = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer }),
            series1 = createSeries({
                type: seriesType,
                point: { visible: false }

            }, { renderer: this.renderer });

        series.updateData(this.data);
        series1.updateData(this.data1);
        series1._prevSeries = series;
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minValue = 0;
            pt.minX = 0;
            pt.minY = 5;
        });

        series.getAllPoints()[2].value = null;

        series1.getAllPoints()[1].leftHole = 29;
        series1.getAllPoints()[1].minLeftHole = 9;

        series1.getAllPoints()[3].leftHole = 13;
        series1.getAllPoints()[3].minLeftHole = 7;

        $.each(series1.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = that.data[i].val;
            pt.minValue = that.data[i].val;
            sinon.spy(pt, "translate");
        });
        //act
        series.draw(this.translators, false);
        series1.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.path.callCount, 6, "elements drawn");

        checkElementPoints(assert, this.renderer.path.getCall(0).args[0], this.points.slice(0, 2), false, "line element");
        assert.equal(this.renderer.path.getCall(0).args[1], "line");
        checkElementPoints(assert, this.renderer.path.getCall(1).args[0], this.points.slice(0, 2).concat(this.areaPoints.slice(8, 10)), false, "area Element");
        assert.equal(this.renderer.path.getCall(1).args[1], "area");

        checkElementPoints(assert, this.renderer.path.getCall(2).args[0], this.points.slice(3, 5), false, "line1 element");
        assert.equal(this.renderer.path.getCall(2).args[1], "line");
        checkElementPoints(assert, this.renderer.path.getCall(3).args[0], this.areaPoints.slice(3, 7), false, "area1 Element");
        assert.equal(this.renderer.path.getCall(3).args[1], "area");

        checkElementPoints(assert, this.renderer.path.getCall(4).args[0], this.points1.slice(0, 2).concat([[3, 40], this.points1[2], [9, 40]]).concat(this.points1.slice(3, 5)), false, "line2 element");
        assert.equal(this.renderer.path.getCall(4).args[1], "line");
        assert.strictEqual(this.renderer.path.getCall(4).args[0][1].value, 29);
        assert.strictEqual(this.renderer.path.getCall(4).args[0][1].minValue, 9);
        assert.strictEqual(this.renderer.path.getCall(4).args[0][1].argument, "3left");
        assert.strictEqual(this.renderer.path.getCall(4).args[0][1].translate.callCount, 2);
        assert.strictEqual(this.renderer.path.getCall(4).args[0][4].value, 13);
        assert.strictEqual(this.renderer.path.getCall(4).args[0][4].minValue, 7);
        assert.strictEqual(this.renderer.path.getCall(4).args[0][4].argument, "9left");
        assert.strictEqual(this.renderer.path.getCall(4).args[0][4].translate.callCount, 2);
        checkElementPoints(assert, this.renderer.path.getCall(5).args[0], this.points1.slice(0, 2).concat([[3, 40], this.points1[2], [9, 40]]).concat(this.points1.slice(3, 5)).
            concat([[12, 10], [9, 20], [9, 20], [6, 10], [3, 20], [3, 20], [0, 10]]), false, "area2 Element");
        assert.equal(this.renderer.path.getCall(5).args[1], "area");
    });

    //T398875
    QUnit.test("Series should be brought to background on draw", function(assert) {
        var seriesGroup = this.renderer.g(),
            series = createSeries({
                type: seriesType
            }, { renderer: this.renderer, seriesGroup: seriesGroup });

        series.updateData(this.data);
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(seriesGroup.children.length, 1);
        assert.equal(seriesGroup.children[0].toBackground.callCount, 1);
    });

    //T398875
    QUnit.test("Series should be brought to background on draw, fullstackedarea", function(assert) {
        var seriesGroup = this.renderer.g(),
            series = createSeries({
                type: "fullstackedarea"
            }, { renderer: this.renderer, seriesGroup: seriesGroup });

        series.updateData(this.data);
        $.each(series.getAllPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(seriesGroup.children.length, 1);
        assert.equal(seriesGroup.children[0].toBackground.callCount, 1);
    });
})();


(function PolarSeries() {
    QUnit.module("Polar Series", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            sinon.stub(vizUtils, "getCosAndSin");
            vizUtils.getCosAndSin.returns({ cos: 1, sin: -1 });
        },
        afterEach: function() {
            environmentWithSinonStubPoint.afterEach.call(this);
            vizUtils.getCosAndSin.restore();
        }
    });

    QUnit.test("draw polar area", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "area",
            width: 10,
            closed: true
        }, { renderer: this.renderer });
        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 2 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 2);

        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 724);
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "area");
        $.each(this.renderer.stub("path").getCall(1).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });

    QUnit.test("draw polar area, closed option is false", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "area",
            width: 10,
            closed: false
        }, { renderer: this.renderer });
        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 2 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 6);
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "area");
        $.each(this.renderer.stub("path").getCall(1).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });

    QUnit.test("draw polar area. two segment", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "area",
            width: 10,
            closed: true
        }, { renderer: this.renderer });
        setPolarType(series);
        series.updateData([{ arg: 0, val: 10 }, { arg: 2, val: 0 }, { arg: 4, val: null }, { arg: 359, val: 5 }]);

        series.getAllPoints()[2].hasValue.returns(false);//set new segment

        series.draw(this.polarTranslator);

        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(0).args[0]),
            [{ x: 10, y: 10 }, { x: 5, y: 5 }, { x: 0, y: 0 }]);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");

        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 6);
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "area");

        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(2).args[0]),
            [{ x: 5, y: 5 }, { x: 10, y: 10 }]);
        assert.equal(this.renderer.stub("path").getCall(2).args[1], "line");

        assert.equal(this.renderer.stub("path").getCall(3).args[0].length, 4);
        assert.deepEqual(this.renderer.stub("path").getCall(3).args[1], "area");
    });

    QUnit.test("draw polar series", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "area",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setDiscreteType(series);

        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 6);
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "area");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[0],
            [{ x: 0, y: 0 }, { x: 2, y: 358 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
    });

    QUnit.test("draw polar area, single point", function(assert) { //T174220
        var series = createSeries({
            widgetType: "polar",
            type: "area",
            width: 10,
            closed: true
        }, { renderer: this.renderer });
        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 2);
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "area");
        $.each(this.renderer.stub("path").getCall(1).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });
})();
