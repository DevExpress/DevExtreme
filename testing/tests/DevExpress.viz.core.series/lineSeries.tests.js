"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    pointModule = require("viz/series/points/base_point"),
    originalPoint = pointModule.Point,
    objectUtils = require("core/utils/object"),
    vizUtils = require("viz/core/utils"),
    Series = require("viz/series/base_series").Series,
    polarTranslatorModule = require("viz/translators/polar_translator");

/* global insertMockFactory, MockTranslator */
require("../../helpers/chartMocks.js");

require("viz/chart");

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
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
        hoverStyle: {},
        selectionStyle: {},
        hoverMode: "excludePoints",
        selectionMode: "excludePoints",
        widgetType: "chart"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
        eventTrigger: $.noop,
        eventPipe: $.noop
    }, renderSettings);

    renderer.stub("g").reset();
    return new Series(renderSettings, options);
};

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
        this.renderer.stub("g").reset();
        this.renderer.stub("path").reset();
    },
    afterEach: function() {
    }
};

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
            return stub;
        });
        this.polarTranslator = stubPolarTranslator;
    },
    afterEach: function() {
        this.createPoint.restore();
    }
};
var createPoint = function() {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.isInVisibleArea.returns(true);
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
        valueAxisType: "continuous",
    });
}

function setLogarithmType(series) {
    series.updateDataType({
        argumentAxisType: "logarithmic",
        valueAxisType: "logarithmic",
    });
}

function setDiscreteType(series) {
    series.updateDataType({
        argumentAxisType: "discrete",
        valueAxisType: "discrete",
    });
}

(function LineElements() {
    QUnit.module("Draw elements. Line Series", environment);

    var checkGroups = checkThreeGroups,
        seriesType = "line";

    QUnit.test("Draw without data", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            label: { visible: false }

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
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").firstCall.args[0], this.points, false, "line element");
        assert.equal(this.renderer.stub("path").firstCall.args[1], "line", "line element");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

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
        });
        series.draw(this.translators, false);
        //act
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        var elementsGroup = series._group.children[0],
            element = elementsGroup.children[0],
            elementPoints = element._stored_settings.points;
        assert.ok(!element.stub("animate").called);

        assert.equal(element.typeOfNode, "path");
        assert.deepEqual(elementPoints.length, 2);
        assert.equal(elementPoints[0].argument, 1);
        assert.equal(elementPoints[0].value, 2);
        assert.equal(elementPoints[1].argument, 2);
        assert.equal(elementPoints[1].value, 1);
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
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);

        checkElementPoints(assert, this.renderer.stub("path").firstCall.args[0], this.points, true, "line element on creating");
        assert.equal(this.renderer.stub("path").firstCall.args[1], "line");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        var element = this.renderer.stub("path").firstCall.returnValue;

        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, element.stub("animate").lastCall.args[0].points, this.points, false, "line element on animating");
        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        //act
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[1, 10], [2, 20]], true, "first line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        var element = this.renderer.stub("path").getCall(0).returnValue;
        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, element.stub("animate").lastCall.args[0].points, [[1, 10], [2, 20]], false, "first line element on animating");
        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[4, 44]], true, "second line element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "line");
        element = this.renderer.stub("path").getCall(1).returnValue;
        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, element.stub("animate").lastCall.args[0].points, [[4, 44]], false, "second line element on animating");
        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));

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
        });
        series.draw(this.translators, true);

        //act
        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);

        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        var element = this.renderer.stub("path").getCall(0).returnValue;
        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, element.stub("animate").lastCall.args[0].points, [[1, 10], [2, 20]], false, "first line element on animating");

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[4, 44]], true, "second line element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "line");
        element = this.renderer.stub("path").getCall(1).returnValue;
        assert.equal(element.stub("append").lastCall.args[0], series._elementsGroup);
        checkElementPoints(assert, element.stub("animate").lastCall.args[0].points, [[4, 44]], false, "second line element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);

        var element1 = this.renderer.stub("path").getCall(0).returnValue,
            element2 = this.renderer.stub("path").getCall(1).returnValue;

        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 1, "second path points");
        assert.equal(this.renderer.stub("path").getCall(1).args[0][0].x, 4);
        assert.equal(this.renderer.stub("path").getCall(1).args[0][0].defaultCoords, true);

        assert.equal(element1.stub("append").lastCall.args[0], series._elementsGroup);
        assert.equal(element2.stub("append").lastCall.args[0], series._elementsGroup);
        assert.ok(element2.stub("remove").called, "second element should be removed");
        checkElementPoints(assert, element1.stub("animate").lastCall.args[0].points, this.points, false, "element on animating after update");

        checkGroups(assert, series);
    });

    QUnit.module("Line Series. Groups animation", {
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

    QUnit.module("Scatter. Preparing point styles", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Style in point group", function(assert) {
        var series = createSeries({
            type: "line",
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.draw(this.translators, false);

        assert.deepEqual(series._markersGroup._stored_settings, {
            "class": "dxc-markers",
            fill: "n-color",
            r: 2.5,
            opacity: 1,
            "clip-path": null,
            stroke: "n-b-color",
            "stroke-width": "n-b-width",
            visibility: "hidden"
        });
    });

    QUnit.test("All options defined", function(assert) {
        var series = createSeries({
            type: "line",
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("without borders", function(assert) {
        var series = createSeries({
            type: "line",
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: false,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: false,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: false,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });
        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": 0
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": 0,
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": 0
            }
        });
    });

    QUnit.test("Define only point.color", function(assert) {
        var series = createSeries({
            type: "line",
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    width: "n-b-width"
                },
                hoverStyle: {
                    size: 2,
                    border: {
                        visible: true,
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    size: 4,
                    border: {
                        visible: true,
                        width: "s-b-width"
                    }
                }
            }
        });
        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "containerColor",
                r: 1,
                stroke: "n-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "containerColor",
                r: 2,
                stroke: "n-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("Define only series color", function(assert) {
        var series = createSeries({
            type: "line",
            mainSeriesColor: "seriesColor",
            point: {
                size: 5,
                border: {
                    visible: true,
                    width: "n-b-width"
                },
                hoverStyle: {
                    size: 2,
                    border: {
                        visible: true,
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    size: 4,
                    border: {
                        visible: true,
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "containerColor",
                r: 1,
                stroke: "seriesColor",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "seriesColor",
                r: 2.5,
                stroke: "seriesColor",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "containerColor",
                r: 2,
                stroke: "seriesColor",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.module("Scatter. Customize point", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Without result", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            },
            customizePoint: function() { }
        });
        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("Empty object result", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            },
            customizePoint: function() { return {}; }
        });
        series.updateData(this.data);

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.module("LineSeries. Trackers", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.renderer.stub("g").reset();
        },
        afterEach: function() {
            environment.afterEach.call(this);
        }
    });

    QUnit.test("draw tracker. strokeWidth < default value", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 2
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.points, false, "trackerElement element");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "line");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(1).returnValue);
        assert.deepEqual(series._trackers[0].stub("attr").firstCall.args[0], {
            "stroke-width": 12,
            fill: "none"
        }, "trackerElement settings");

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("draw tracker. strokeWidth>20", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            width: 21
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.points, false, "trackerElement element");
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "line");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(1).returnValue);
        assert.deepEqual(series._trackers[0].stub("attr").firstCall.args[0], {
            "stroke-width": 21,
            fill: "none"
        }, "trackerElement settings");

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("Update tracker", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        series.drawTrackers();
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.deepEqual(this.renderer.stub("path").getCall(1).args[1], "line");
        assert.equal(series._trackers[0], this.renderer.stub("path").getCall(1).returnValue);
        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);

        var element = series._trackers[0],
            elementPoints = element._stored_settings.points;

        assert.deepEqual(elementPoints.length, 2);
        assert.equal(elementPoints[0].argument, 1);
        assert.equal(elementPoints[0].value, 2);
        assert.equal(elementPoints[1].argument, 2);
        assert.equal(elementPoints[1].value, 1);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);
        series.drawTrackers();
        var element1 = series._trackers[0],
            element2 = series._trackers[1],
            settings;

        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        series.drawTrackers();
        //assert

        assert.equal(this.renderer.stub("path").callCount, 4);

        element1 = series._trackers[0],
        settings = element1._stored_settings;

        assert.ok(element2.stub("remove").called, "second element should be removed");
        checkElementPoints(assert, settings.points, this.points, false, "tracker element");
    });

    QUnit.module("Line Series. Points animation", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.series = createSeries({
                type: seriesType,
                point: { visible: true }
            }, { renderer: this.renderer });
            this.series.updateData(this.data);
        },
        afterEach: environmentWithSinonStubPoint.afterEach
    });

    QUnit.test("Draw without animation", function(assert) {
        var series = this.series;
        //act
        series.draw(this.translators, false);
        //assert
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[2], undefined, "animation should be disabled " + i);
            assert.equal(p.draw.firstCall.args[3], undefined, "first drawing should be disabled " + i);
        });
    });

    QUnit.test("Draw with animation", function(assert) {
        var series = this.series;
        //act
        series.draw(this.translators, true);
        //assert
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[2], undefined, "animation should be disabled " + i);
            assert.equal(p.draw.firstCall.args[3], undefined, "first drawing should be disabled " + i);
        });
    });

    QUnit.module("Styles. Line Series", {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.options = {
                type: seriesType,
                width: "n width",
                color: "n color",
                dashStyle: "n dashStyle",
                opacity: "unexpected",

                selectionStyle: {
                    width: "s width",
                    color: "s color",
                    dashStyle: "s dashStyle",
                    opacity: "unexpected"
                },
                hoverStyle: {
                    width: "h width",
                    color: "h color",
                    dashStyle: "h dashStyle",
                    opacity: "unexpected"
                }
            };
        },
        afterEach: environmentWithSinonStubPoint.afterEach
    });

    QUnit.test("First draw - Normal State", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "n dashStyle",
            "stroke": "n color",
            "stroke-width": "n width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 'n width');
        });
    });

    QUnit.test("Select series before drawing", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.select();

        series.draw(this.translators, undefined, undefined, $.noop);

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "s dashStyle",
            "stroke": "s color",
            "stroke-width": "s width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 's width');
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Apply hover state", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        series.hover();

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "h dashStyle",
            "stroke": "h color",
            "stroke-width": "h width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 'h width');
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Apply normal state after hover", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        series.hover();
        series.clearHover();

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "n dashStyle",
            "stroke": "n color",
            "stroke-width": "n width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 'n width');
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Apply selection state", function(assert) {
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        series.select();

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "s dashStyle",
            "stroke": "s color",
            "stroke-width": "s width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 's width');
            assert.ok(path.sharp.called);
            assert.ok(path.sharp.lastCall.calledAfter(path.attr.lastCall));
        });
    });

    QUnit.test("Undefined dashStyle", function(assert) {
        this.options.dashStyle = undefined;
        var series = createSeries(this.options);
        series.updateData(this.data);

        series.draw(this.translators);

        assert.deepEqual(series._elementsGroup._stored_settings, {
            "class": "dxc-elements",
            "clip-path": undefined,
            "dashStyle": "solid",
            "stroke": "n color",
            "stroke-width": "n width"
        });

        $.each(series._elementsGroup.children, function(_, path) {
            assert.equal(path._stored_settings["stroke-width"], 'n width');
        });
    });

    QUnit.module("Null points", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.options = {
                type: "line"
            };
            this.createPoint = sinon.stub(pointModule, "Point", function() {
                var stub = sinon.createStubInstance(originalPoint);
                stub.argument = 1;
                stub.hasValue.returns(true);
                stub.isInVisibleArea.returns(true);
                return stub;
            });
        },
        afterEach: function() {
            this.createPoint.restore();
        }
    });

    QUnit.test("Argument is undefined", function(assert) {
        var data = [{ arg: undefined, val: 1 }],
            series = createSeries(this.options);

        series.updateData(data);

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Argument is null", function(assert) {
        var data = [{ arg: null, val: 1 }],
            series = createSeries(this.options);

        series.updateData(data);

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Value is undefined", function(assert) {
        var data = [{ arg: 1, val: undefined }],
            series = createSeries(this.options);

        series.updateData(data);

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Value is null", function(assert) {
        var data = [{ arg: 1, val: null }],
            series = createSeries(this.options);

        series.updateData(data);

        assert.equal(series._points.length, 1);
    });

    QUnit.module("Line. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "line"
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
                type: "line"
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
                type: "line"
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
                type: "line"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

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

(function StepLineElements() {
    QUnit.module("Draw elements. StepLine Series", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 20 }, { arg: 4, val: 40 }];
            this.points = [[1, 10], [2, 10], [2, 20], [3, 20], [4, 20], [4, 40]];
        },
        afterEach: environment.afterEach
    });

    var checkGroups = checkThreeGroups,
        seriesType = "stepline";

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
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");

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
        });
        series.draw(this.translators, false);
        //act
        series.updateData([{ arg: 1, val: 2 }, { arg: 2, val: 1 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);
        var element = this.renderer.stub("path").getCall(0).returnValue;

        assert.ok(!element.stub("animate").called);
        checkElementPoints(assert, element._stored_settings.points, [[1, 2], [2, 2], [2, 1]]);

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
        });
        //act

        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, true, "line element on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.points, false, "line element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Create error bar group when series is animated", function(assert) {
        var series = createSeries({
                type: seriesType,
                point: { visible: false },
                valueErrorBar: {
                    displayMode: "all",
                    lowValueField: "fieldName",
                    color: "red",
                    lineWidth: 3,
                    opacity: 0.7
                }
            }, {
                renderer: this.renderer,
                seriesGroup: this.seriesGroup
            }),
            completeAnimation,
            points;
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", false);

        //act
        series.draw(this.translators, true);
        //assert

        assert.equal(this.renderer.stub("g").callCount, 5);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series", "main series group");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-elements");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(4).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(4).returnValue;

        assert.equal(parentGroup.children.length, 3, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(2).returnValue);
        assert.equal(parentGroup.children[2], this.renderer.stub("g").getCall(4).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "wideClipId",
            "opacity": 0.001,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        points = series.getPoints();

        $.each(points, function(i, p) {
            assert.equal(p.markerRendered.group.errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
        });
        assert.ok(!errorBarGroup.animate.called);

        completeAnimation = this.renderer.stub("path").getCall(0).returnValue.stub("animate").lastCall.args[1].complete;
        completeAnimation();

        assert.deepEqual(errorBarGroup.animate.lastCall.args, [{
            opacity: 0.7
        }, { duration: 400 }]);
    });

    QUnit.test("Draw data with null values", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        //act
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[1, 10], [2, 10], [2, 20]], true, "first line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[4, 44]], true, "second line element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));
        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));
        checkElementPoints(assert, animatePoints, [[4, 44]], false, "second line element on animating");

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
        });
        series.draw(this.translators, true);

        //act
        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[4, 44]], true, "second line element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "line");
        assert.equal(this.renderer.stub("path").getCall(1).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, [[1, 10], [2, 10], [2, 20]], false, "first line element on animating");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, [[4, 44]], false, "second line element on animating");

        checkGroups(assert, series);
    });

    QUnit.test("Draw data with null values. Remove segment", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: null }, { arg: 4, val: 44 }]);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);

        var element1 = this.renderer.stub("path").getCall(0).returnValue,
            element2 = this.renderer.stub("path").getCall(1).returnValue,
            animatePoints;

        //act
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, true);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 1, "second path points");
        assert.equal(this.renderer.stub("path").getCall(1).args[0][0].x, 4);
        assert.equal(this.renderer.stub("path").getCall(1).args[0][0].defaultCoords, true);

        assert.equal(this.renderer.stub("path").getCall(1).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        element1 = this.renderer.stub("path").getCall(0).returnValue;
        animatePoints = element1.stub("animate").lastCall.args[0].points;

        assert.ok(element2.stub("remove").called, "second element should be removed");
        checkElementPoints(assert, animatePoints, this.points, false, "element on animating after update");

        checkGroups(assert, series);
    });

    QUnit.module("Step line. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "stepline"
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
                type: "stepline"
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
                type: "stepline"
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
                type: "stepline"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

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

(function SplineElements() {
    QUnit.module("Draw elements. Spline Series", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.points = [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]];
        },
        afterEach: environment.afterEach
    });

    var checkGroups = checkThreeGroups;
    var seriesType = "spline";

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
        assert.equal(this.renderer.stub("path").callCount, 1, "elements drawn");

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "line element");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier", "line element");
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

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
        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);


        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;
        assert.ok(!element.stub("animate").called);

        checkElementPoints(assert, elementPoints, [[1, 2], [1, 2], [2, 1], [2, 1]], false, "line element");

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
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, true, "line on creating");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.calledOnce);
        assert.ok(this.renderer.stub("path").getCall(0).returnValue.sharp.firstCall.calledAfter(this.renderer.stub("path").getCall(0).returnValue.attr.lastCall));

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, this.points, false, "line on animating");

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
        assert.equal(this.renderer.stub("path").callCount, 2);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[0, 5], [0, 5], [3, 5], [3, 5]], true, "first line points");
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[9, 5], [9, 5], [12, 5], [12, 5]], true, "second line points");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(1).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));
        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20]], false, "first line animate points");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        assert.ok(element.sharp.calledOnce);
        assert.ok(element.sharp.firstCall.calledAfter(element.attr.lastCall));
        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10]], false, "second line animate points");

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
        assert.equal(this.renderer.stub("path").callCount, 2);

        assert.equal(this.renderer.stub("path").getCall(0).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(0).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], [[9, 5], [9, 5], [12, 5], [12, 5]], true, "second line points");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezier", "line element");
        assert.equal(this.renderer.stub("path").getCall(1).returnValue.stub("append").lastCall.args[0], series._elementsGroup);

        var element = this.renderer.stub("path").getCall(0).returnValue,
            animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, [[0, 10], [0, 10], [3, 20], [3, 20]], false, "first line animate points");

        element = this.renderer.stub("path").getCall(1).returnValue;
        animatePoints = element.stub("animate").lastCall.args[0].points;

        checkElementPoints(assert, animatePoints, [[9, 20], [9, 20], [12, 10], [12, 10]], false, "second line animate points");

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
        assert.equal(this.renderer.stub("path").callCount, 2);

        animatePoints = element1.stub("animate").lastCall.args[0].points;

        assert.ok(element2.stub("remove").called, "second line element should be removed");

        checkElementPoints(assert, animatePoints, this.points, false, "line element after update");

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
        });
        //act
        series.draw(this.translators, false);
        //assert
        assert.equal(this.renderer.stub("path").callCount, 1);
        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], [[10, 0], [10, 0], [15, 0], [15, 0], [15, 0], [20, 0], [20, 0]], false, "spline points");
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
        });

        $.each(this.points, function(_, p) {
            p = p.reverse();
        });

        series.draw(this.translators, false);

        checkElementPoints(assert, this.renderer.stub("path").getCall(0).args[0], this.points, false, "spline points");
    });

    QUnit.test("T491401. Points with same arguments", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ arg: 0, val: 3 }, { arg: 3, val: 0 }, { arg: 0, val: -3 }]);

        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, false);
        //assert
        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;

        checkElementPoints(assert, elementPoints, [[0, 3], [0, 3], [3, 0], [3, 0], [3, 0], [0, -3], [0, -3]], false, "line element");
    });

    QUnit.test("T491401. Points with same arguments. Rotated", function(assert) {
        var series = createSeries({
            type: seriesType,
            rotated: true,
            point: { visible: false }
        }, { renderer: this.renderer });

        series.updateData([{ val: 0, arg: 3 }, { val: 3, arg: 0 }, { val: 0, arg: -3 }]);

        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minX = 0;
            pt.minY = 5;
        });
        series.draw(this.translators, false);
        //assert
        var element = this.renderer.stub("path").getCall(0).returnValue,
            elementPoints = element._stored_settings.points;

        checkElementPoints(assert, elementPoints, [[3, 0], [3, 0], [0, 3], [0, 3], [0, 3], [-3, -0], [-3, 0]], false, "line element");
    });

    QUnit.module("SplineSeries. Trackers", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: 0, val: 10 }, { arg: 3, val: 20 }, { arg: 6, val: 10 }, { arg: 9, val: 20 }, { arg: 12, val: 10 }];
            this.points = [[0, 10], [0, 10], [1.5, 20], [3, 20], [4.5, 20], [4.5, 10], [6, 10], [7.5, 10], [7.5, 20], [9, 20], [10.5, 20], [12, 10], [12, 10]];
            this.renderer.stub("g").reset();
        },
        afterEach: function() {
            environment.afterEach.call(this);
        }
    });

    QUnit.test("draw tracker. strokeWidth < default value", function(assert) {
        var series = createSeries({
            type: seriesType, point: { visible: false },
            width: 2
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.points, false, "trackerElement element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezier");
        assert.deepEqual(this.renderer.stub("path").getCall(1).returnValue.stub("attr").firstCall.args[0], {
            "stroke-width": 12,
            fill: "none",
        }, "trackerElement settings");

        assert.equal(this.renderer.stub("path").getCall(1).returnValue, series._trackers[0]);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
    });

    QUnit.test("draw tracker. strokeWidth>20", function(assert) {
        var series = createSeries({
            type: seriesType, point: { visible: false },
            width: 21
        }, {
            seriesGroup: this.seriesGroup,
            renderer: this.renderer
        });
        series.updateData(this.data);
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.draw(this.translators, false);
        //act
        series.drawTrackers();
        //assert

        assert.equal(this.renderer.stub("path").callCount, 2);
        checkElementPoints(assert, this.renderer.stub("path").getCall(1).args[0], this.points, false, "trackerElement element");
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "bezier");
        assert.deepEqual(this.renderer.stub("path").getCall(1).returnValue.stub("attr").firstCall.args[0], {
            "stroke-width": 21,
            fill: "none",
        }, "trackerElement settings");

        assert.equal(this.renderer.stub("path").getCall(1).returnValue, series._trackers[0]);

        assert.equal(series._trackers[0].stub("append").lastCall.args[0], series._trackersGroup);
        assert.deepEqual(series._trackers[0].data.lastCall.args, [{ 'chart-data-series': series }]);
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


    QUnit.module("Spline. Update animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Check label clearing", function(assert) {
        var series = createSeries({
                type: "spline"
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
                type: "spline"
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
                type: "spline"
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
                type: "spline"
            }),
            newOptions = $.extend(true, {}, series.getOptions(), { type: "bar" });

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

    QUnit.module("polar Series", {
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

    QUnit.test("draw polar line", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });
        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 362);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");

        $.each(this.renderer.stub("path").getCall(0).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });

    QUnit.test("draw polar line, closed option is false", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: false
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 3);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(0).args[0]),
            [{ x: 0, y: 0 }, { x: 179, y: 179 }, { x: 358, y: 358 }]);
    });

    QUnit.test("draw polar line. two segment", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });
        setPolarType(series);

        series.updateData([{ arg: 0, val: 10 }, { arg: 2, val: 0 }, { arg: 4, val: null }, { arg: 359, val: 5 }]);

        series.getAllPoints()[2].hasValue.returns(false);//set new segment

        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 3);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");

        assert.equal(this.renderer.stub("path").getCall(1).args[0].length, 2);
        assert.equal(this.renderer.stub("path").getCall(1).args[1], "line");

        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(0).args[0]),
            [{ x: 10, y: 10 }, { x: 5, y: 5 }, { x: 0, y: 0 }]);

        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(1).args[0]),
            [{ x: 5, y: 5 }, { x: 10, y: 10 }]);
    });

    QUnit.test("draw polar line. first point is null", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10
        }, { renderer: this.renderer });
        setPolarType(series);

        series.updateData(this.data);

        series.getAllPoints()[0].hasValue.returns(false);//first point is null

        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 4);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.deepEqual(getPositionRendererPoints(this.renderer.stub("path").getCall(0).args[0]),
            [{ x: 20, y: 20 }, { x: 30, y: 30 }, { x: 30, y: 30 }, { x: 40, y: 40 }]);
    });

    QUnit.test("draw polar line. Two point with equal angle", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10
        }, { renderer: this.renderer });
        setPolarType(series);

        series.updateData([{ arg: 0, val: 0 }, { arg: 0, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").callCount, 1);
        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 2);
        assert.equal(this.renderer.stub("path").getCall(0).args[1], "line");
        assert.deepEqual(this.renderer.stub("path").getCall(0).args[0],
            [series.getPointByPos(0), series.getPointByPos(1)]);
    });

    QUnit.test("draw polar series", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setDiscreteType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.path.getCall(0).args[0].length, 3);

        var point = objectUtils.clone(series.getPointByPos(0));
        point.x = point.y = undefined;
        point.angle = -360;
        assert.deepEqual(this.renderer.stub("path").getCall(0).args[0], series.getAllPoints().concat(point));
    });

    QUnit.test("draw polar logarithmic line.", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setLogarithmType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 2, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 362);
        $.each(this.renderer.stub("path").getCall(0).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });

    QUnit.test("draw polar line. inverted ", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: -179, val: 358 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 362);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][20].x, 40);
        $.each(this.renderer.stub("path").getCall(0).args[0], function(_, pt) {
            assert.equal(pt.x, pt.y);
        });
    });

    QUnit.test("draw polar line. difference between two last points are insignificant, not inverted", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 359.6999, val: 112 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 363);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][0].angle, 0.30009999999998627);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][362].angle, -359.6999);
    });

    QUnit.test("draw polar line. inverted (T248175)", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 359.6999, val: 112 }, { arg: -0.0005, val: 11 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 363);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][0].angle, -359.9995);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][362].angle, 0.0005);
    });

    QUnit.test("draw polar line. difference between normalize angle of the first and the last points are zero", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 360, val: 112 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 363);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][0].angle, 0);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][362].angle, -360);
    });

    QUnit.test("draw polar line. angle of last point is more than 360", function(assert) {
        var series = createSeries({
            widgetType: "polar",
            type: "line",
            width: 10,
            closed: true
        }, { renderer: this.renderer });

        setPolarType(series);
        series.updateData([{ arg: 0, val: 0 }, { arg: 700, val: 112 }]);
        series.draw(this.polarTranslator);

        assert.equal(this.renderer.stub("path").getCall(0).args[0].length, 722);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][0].angle, 0);
        assert.equal(this.renderer.stub("path").getCall(0).args[0][721].angle, -720);
    });
})();

(function StackedLine() {
    QUnit.module("Stacked line. Error bars", environmentWithSinonStubPoint);

    QUnit.test("no pass error bars in points", function(assert) {
        var series = createSeries({
                type: "stackedLine",
                errorBars: { lowErrorValueField: "lowErrorField", highErrorValueField: "highErrorField" }
            }),
            data = [{ arg: 1, val: 3, size: 5, lowErrorField: 0, highErrorField: 4 }],
            points;

        series.updateData(data);

        points = series.getPoints();
        assert.ok(points, "Points should be created");
        assert.equal(points.length, 1, "Series should have one point");
        assert.equal(this.createPoint.firstCall.args[0], series, "Series should be correct");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].value, 3, "Value should be correct");
        assert.strictEqual(this.createPoint.firstCall.args[1].lowError, undefined, "lowError not passed");
        assert.strictEqual(this.createPoint.firstCall.args[1].highError, undefined, "highError not passed");
    });
})();
