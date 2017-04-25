"use strict";

var $ = require("jquery"),
    commons = require("./chartParts/commons.js"),
    vizUtils = require("viz/core/utils");

/* global MockSeries, seriesMockData, commonMethodsForTests */
require("../../helpers/chartMocks.js");

$('<div id="chartContainer">').appendTo("#qunit-fixture");

QUnit.module("dxChart Business Ranges", commons.environment);

QUnit.test("Pass rotation info to Business range (rotated = true)", function(assert) {
    var chart = this.createChart({
        rotated: true,
        argumentAxis: { mockRange: {} }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].val.rotated, true);
    assert.strictEqual(chart.businessRanges[0].arg.rotated, true);
});

QUnit.test("Pass rotation info to Business range (rotated = false)", function(assert) {
    var chart = this.createChart({
        argumentAxis: { mockRange: {} }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].val.rotated, false);
    assert.strictEqual(chart.businessRanges[0].arg.rotated, false);
});

QUnit.test("Pass stick info to Business range (axis is discrete)", function(assert) {
    var chart = this.createChart({
        argumentAxis: { mockRange: { axisType: "discrete" } }
    });

    chart.zoomArgument(0, 5, true);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].arg.stick, undefined);
});

QUnit.test("Pass min/max info to Business range (gesturesUsed = true && axis is not discrete)", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            mockRange: {}
        }
    });

    chart._argumentAxes[0].getTranslator = sinon.stub().returns({ getBusinessRange: sinon.stub().returns({ min: -5, max: 15 }) });

    chart.zoomArgument(2, 5, true);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].arg.min, -5);
    assert.strictEqual(chart.businessRanges[0].arg.max, 15);
});

QUnit.test("Pass min/max info to business range (range less then default values for empty axis and gesturesUsed = true), numeric", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            mockRange: {}
        }
    });

    chart._argumentAxes[0].getTranslator = sinon.stub().returns({ getBusinessRange: sinon.stub().returns({ min: 3, max: 5 }) });
    chart.zoomArgument(3, 5, true);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.equal(chart.businessRanges[0].arg.min, 3);
    assert.equal(chart.businessRanges[0].arg.max, 5);
});

QUnit.test("Pass min/max info to business range (range less then default values for empty axis and gesturesUsed = true), datetime", function(assert) {
    var chart = this.createChart({
            argumentAxis: {
                argumentType: "datetime",
                mockRange: {}
            }
        }),
        date1 = new Date(2015, 2, 1),
        date2 = new Date(2015, 2, 9);

    chart._argumentAxes[0].getTranslator = sinon.stub().returns({ getBusinessRange: sinon.stub().returns({ min: date1, max: date2 }) });
    chart.zoomArgument(date1, date2, true);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.equal(chart.businessRanges[0].arg.min, date1);
    assert.equal(chart.businessRanges[0].arg.max, date2);
});

QUnit.test("Pass min/max info to business range (gesturesUsed = false)", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            mockRange: {}
        }
    });

    chart._argumentAxes[0].getTranslator = sinon.stub().returns({ getBusinessRange: sinon.stub().returns({ min: 2, max: 6 }) });
    chart.zoomArgument(3, 5);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.equal(chart.businessRanges[0].arg.min, 2);
    assert.equal(chart.businessRanges[0].arg.max, 6);
});

QUnit.test("Pass stick info to Business range (gesturesUsed = true)", function(assert) {
    var chart = this.createChart({
        argumentAxis: { mockRange: {} }
    });

    chart.zoomArgument(0, 5, true);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].arg.stick, true);
});

QUnit.test("Pass stick info to Business range (gesturesUsed = false)", function(assert) {
    var chart = this.createChart({
        argumentAxis: { mockRange: {} }
    });
    chart.zoomArgument(0, 5);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.strictEqual(chart.businessRanges[0].arg.stick, undefined);
});

QUnit.test("T178921. Pass min/max info to Business range (gesturesUsed = true)", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 15
            }
        }
    }));
    var chart = this.createChart({
            series: [{ type: "line" }],
            argumentAxis: {
                mockRange: {
                    min: 5,
                    max: 10,
                    minVisible: 5,
                    maxVisible: 10
                }
            }
        }),
        seriesSpy = sinon.spy(chart.getAllSeries()[0], "getRangeData"),
        adjustZoomValuesSpy = sinon.spy(chart._argumentAxes[0], "zoom");

    chart.zoomArgument(2, 12, true);

    assert.equal(seriesSpy.lastCall.args[0].minArg, adjustZoomValuesSpy.lastCall.returnValue.min, "minArg to series");
    assert.equal(seriesSpy.lastCall.args[0].maxArg, adjustZoomValuesSpy.lastCall.returnValue.max, "maxArg to series");
    assert.ok(adjustZoomValuesSpy.calledOnce);
    assert.deepEqual(adjustZoomValuesSpy.lastCall.args, [2, 12, true]);
});

QUnit.test("pass calcInterval callback", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            }
        }
    }));
    //act
    var chart = this.createChart({
        series: [{
            pane: "topPane",
            type: "line"
        }, {
            pane: "otherPane",
            type: "line"
        }],
        valueAxis: {
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        },
        panes: [
            {
                name: "topPane",
                position: "top"
            }, {
                name: "otherPane"
            }
        ]
    });
    chart._argumentAxes[0].calcInterval = "calc interval";
    chart._argumentAxes[1].calcInterval = "calc interval";
    chart._populateBusinessRange();
    //assert
    assert.equal(chart.series[0].calcInterval, "calc interval", "valid calc interval");
    assert.equal(chart.series[1].calcInterval, "calc interval", "valid calc interval");
});

QUnit.test("Calculate business range for continuous without indent", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            }
        }
    }));
    var chart = this.createChart({
        series: {
            type: "line"
        },
        valueAxis: {
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.ok(!chart.businessRanges[0].arg.categories);
    assert.ok(!chart.businessRanges[0].val.categories);
    assert.equal(chart.businessRanges[0].val.min, 0);
    assert.equal(chart.businessRanges[0].val.max, 10);
});

QUnit.test("Calculate business range for continuous with default indent", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: -1,
                max: 9
            }
        }
    }));
    var chart = this.createChart({
        series: {
            type: "line"
        }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    var range = chart.businessRanges[0].val;
    assert.ok(!chart.businessRanges[0].arg.categories);
    assert.ok(!chart.businessRanges[0].val.categories);
    assert.equal(range.min, -1);
    assert.equal(range.max, 9);
});

QUnit.test("Calculate business range for categories from Axis and continuous values from Series", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: -1,
                max: 9
            }
        }
    }));
    var chart = this.createChart({
        series: {
            type: "line"
        }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    assert.equal(chart.businessRanges[0].val.min, -1);
    assert.equal(chart.businessRanges[0].val.max, 9);
});

QUnit.test("Calculate business range merged with Value Axis range (no indent)", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            }
        }
    }));
    var chart = this.createChart({
        valueAxis: {
            min: -2,
            max: 12,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                min: -2,
                max: 12,
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        },
        series: { type: "line" }
    });
    assert.equal(chart.businessRanges.length, 1);
    assert.equal(chart.businessRanges[0].val.min, -2);
    assert.equal(chart.businessRanges[0].val.max, 12);
});

QUnit.test("Calculate business range merged with Argument Axis range (no indent)", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 0,
                max: 10
            }
        }
    }));
    var chart = this.createChart({
        argumentAxis: {
            min: -2,
            max: 12,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                min: -2,
                max: 12,
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        },
        series: {
            type: "line"
        }
    });
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 1);
    var range = chart.businessRanges[0].arg;
    assert.equal(range.min, -2);
    assert.equal(range.max, 12);
});

QUnit.test("Two ranges for two panes - data from series, indents from common axis", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            }
        }
    }));
    //act
    var chart = this.createChart({
        series: [{
            //doesn't matter as range goes from predefined series above
            pane: "topPane",
            type: "line"
        }, {
            //doesn't matter as range goes from predefined series above
            pane: "otherPane",
            type: "line"
        }],
        valueAxis: {
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        },
        panes: [
            {
                name: "topPane",
                position: "top"
            }, {
                name: "otherPane"
            }
        ]

    });
    //assert
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    var range1 = chart.businessRanges[0].val;
    assertRange(assert, range1, {
        pane: "topPane",
        min: 0,
        max: 10
    });

    var range2 = chart.businessRanges[1].val;
    assertRange(assert, range2, {
        pane: "otherPane",
        min: 101,
        max: 151
    });
});

QUnit.test("Two ranges for two panes. One axis with showZero = true, another one with showZero = false", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 10,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: -100,
                max: -10
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 20,
                max: 200
            }
        }
    }));
    //act
    var chart = this.createChart({
        series: [{
            //doesn't matter as range goes from predefined series above
            pane: "topPane",
            axis: "a1",
            type: "line"
        }, {
            //doesn't matter as range goes from predefined series above
            pane: "otherPane",
            axis: "a1",
            type: "line"
        }, {
            //doesn't matter as range goes from predefined series above
            pane: "otherPane",
            axis: "a2",
            type: "line"
        }],
        valueAxis: [{
            name: "a1",
            showZero: true,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }, {
            name: "a2",
            showZero: false,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }],
        panes: [{ name: "topPane", position: "top" },
            { name: "otherPane" }]
    });
    //assert
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 3);

    assertRange(assert, chart.businessRanges[0].val, {
        pane: "topPane",
        min: 0,
        max: 100
    });

    assertRange(assert, chart.businessRanges[1].val, {
        pane: "otherPane",
        min: -100,
        max: 0
    });

    assertRange(assert, chart.businessRanges[2].val, {
        pane: "otherPane",
        min: 20,
        max: 200
    });
});

QUnit.test("Two ranges for two panes. One axis with showZero = true, another one with showZero = false. Rotated chart", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 10, max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: -100, max: -10
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 20, max: 200
            }
        }
    }));
    //act
    var chart = this.createChart({
        rotated: true,
        series: [{
            //doesn't matter as range goes from predefined series above
            pane: "topPane",
            axis: "a1",
            type: "line"
        }, {
            //doesn't matter as range goes from predefined series above
            pane: "otherPane",
            axis: "a1",
            type: "line"
        }, {
            //doesn't matter as range goes from predefined series above
            pane: "otherPane",
            axis: "a2",
            type: "line"
        }],
        valueAxis: [{
            name: "a1",
            showZero: true,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }, {
            name: "a2",
            showZero: false,
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }],
        panes: [{ name: "topPane", position: "top" },
            { name: "otherPane" }]
    });
    //assert
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 3);

    assertRange(assert, chart.businessRanges[0].val, {
        pane: "topPane",
        min: 0,
        max: 100
    });

    assertRange(assert, chart.businessRanges[1].val, {
        pane: "otherPane",
        min: -100,
        max: 0
    });

    assertRange(assert, chart.businessRanges[2].val, {
        pane: "otherPane",
        min: 20,
        max: 200
    });
});

QUnit.test("Two Series, one of them is not visible", function(assert) {
    seriesMockData.series.push(new MockSeries({ visible: false, range: { arg: { categories: ["A", "B", "C"] } } }));
    seriesMockData.series.push(new MockSeries({ range: { arg: { categories: ["D", "E", "F"] } } }));

    var chart = this.createChart({
        dataSource: [{ arg: "A", val: 1 }, { arg: "B", val: 2 }, { arg: "C", val: 3 }, { arg: "D", val: 1 }, { arg: "E", val: 2 }, { arg: "F", val: 3 }],
        series: [{ type: "line" }, { type: "line" }]
    });

    assert.deepEqual(chart.businessRanges[0].arg.categories, ["D", "E", "F"]);
});

QUnit.test("Categories in series is not sort", function(assert) {
    seriesMockData.series.push(new MockSeries({ range: { arg: { categories: ["A", "D", "E", "C", "F"] } } }));

    var chart = this.createChart({
        dataSource: [{ arg: "A", val: 1 }, { arg: "B", val: 2 }, { arg: "C", val: 3 }, { arg: "D", val: 1 }, { arg: "E", val: 2 }, { arg: "F", val: 3 }],
        series: [{ type: "line" }]
    });

    assert.deepEqual(chart.businessRanges[0].arg.categories, ["A", "C", "D", "E", "F"]);
});

//T474125
QUnit.test("Sort categories in series, dateTime", function(assert) {
    seriesMockData.series.push(new MockSeries({ range: { arg: { categories: [new Date(2017, 6, 2), new Date(2017, 2, 2), new Date(2017, 1, 2), new Date(2017, 8, 2)] } } }));

    var chart = this.createChart({
        dataSource: [{ arg: new Date(2017, 1, 2), val: 1 }, { arg: new Date(2017, 2, 2), val: 2 }, { arg: new Date(2017, 6, 2), val: 3 }, { arg: new Date(2017, 8, 2), val: 1 }],
        series: [{ type: "line" }],
        argumentAxis: {
            mockRange: { dataType: "datetime" }
        }
    });

    assert.deepEqual(chart.businessRanges[0].arg.categories, [new Date(2017, 1, 2), new Date(2017, 2, 2), new Date(2017, 6, 2), new Date(2017, 8, 2)]);
});

QUnit.test("Series is not discrete, argument axis has empty categories, category filtering should be successful", function(assert) {
    seriesMockData.series.push(new MockSeries({ range: { arg: { } } }));

    var chart = this.createChart({
        argumentAxis: { mockRange: { categories: [] } },
        series: [{ type: "line" }]
    });

    assert.deepEqual(chart.businessRanges[0].arg.categories, []);
});

var assertRange = commonMethodsForTests.assertRange;

///////////////////////////////////////////////////////
//////      Canvas creation
///////////////////////////////////////////////////////
QUnit.module("dxChart Canvas", commons.environment);

QUnit.test("Canvas creation from options", function(assert) {

    var chartOptions = {
        left: 80,
        right: 90,
        top: 4,
        bottom: 80
    };
    var stubSeries = new MockSeries();
    seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        series: [{ type: "line" }]
    });

    assert.ok(chart._canvas);
    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 150);
    assert.equal(chart._canvas.left, 80);
    assert.equal(chart._canvas.right, 90);
    assert.equal(chart._canvas.top, 4);
    assert.equal(chart._canvas.bottom, 80);
});

QUnit.test("Canvas creation from default", function(assert) {
    var chart = this.createChart({
    });

    assert.ok(chart._canvas);
    //get it from container"s width and height
    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 150, "True height of container");
    //get it from default canvas" settings

    //assert.ok(chart.canvas.marginsThemeApplied);
});

QUnit.test("Canvas creation, default container size", function(assert) {
    var css = { width: this.$container.width(), height: this.$container.height() };
    this.$container.css("height", 0);
    var chart = this.createChart({
    });

    assert.ok(chart._canvas);
    assert.equal(chart._canvas.width, css.width);
    assert.equal(chart._canvas.height, 400);
});

QUnit.test("Canvas creation, zero container width", function(assert) {
    this.$container.css({ width: "0px", height: "100px" });
    var chart = this.createChart({
    });

    assert.ok(chart._canvas);
    assert.equal(chart._canvas.width, 400);
    assert.equal(chart._canvas.height, 100);
});

QUnit.test("Canvas creation, zero container size", function(assert) {
    this.$container.css({ width: "0px", height: "0px" });
    var chart = this.createChart({
    });

    //assert.ok(chart.canvas);
    assert.ok(chart._canvas);
});

QUnit.test("Canvas creation, custom container size", function(assert) {
    var css = { width: this.$container.width(), height: this.$container.height() };

    var chart = this.createChart({
        size: { width: 555, height: 445 }
    });

    assert.ok(chart._canvas);
    assert.equal(chart._canvas.width, 555);
    assert.equal(chart._canvas.height, 445);
    assert.equal(this.$container.width(), css.width);
    assert.equal(this.$container.height(), css.height);
});

QUnit.test("Canvas creation, custom negative width option", function(assert) {
    var css = { width: this.$container.width(), height: this.$container.height() };

    var chart = this.createChart({
        size: { width: -100, height: 445 }
    });

    //assert.ok(chart.canvas);
    //assert.equal(chart.canvas.width, 0);
    //assert.equal(chart.canvas.height, 445);
    assert.ok(chart._canvas);
    assert.equal(this.$container.width(), css.width);
    assert.equal(this.$container.height(), css.height);
});

QUnit.test("Canvas creation, custom negative height option", function(assert) {
    var css = { width: this.$container.width(), height: this.$container.height() };

    var chart = this.createChart({
        size: { width: 555, height: -445 }
    });

    //assert.ok(chart.canvas);
    //assert.equal(chart.canvas.width, 555);
    //assert.equal(chart.canvas.height, 0);
    assert.ok(chart._canvas);
    assert.equal(this.$container.width(), css.width);
    assert.equal(this.$container.height(), css.height);
});

QUnit.test("Canvas creation, custom container size with zero width and height", function(assert) {
    var chart = this.createChart({
        size: { width: 0, height: 0 }
    });

    assert.ok(chart._canvas);
});

QUnit.test("Canvas creation from options merged with default", function(assert) {

    var chartOptions = {
        //width: 800,
        //height: 800,
        left: 80,
        right: 0,
        top: 0,
        bottom: 0
    };
    var chart = this.createChart({
        margin: chartOptions
    });

    assert.ok(chart._canvas);
    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 150);
    assert.equal(chart._canvas.left, 80);
    assert.equal(chart._canvas.right, 0);
    assert.equal(chart._canvas.top, 0);
    assert.equal(chart._canvas.bottom, 0);
});

QUnit.test("Single pane canvas creation from default", function(assert) {
    var chart = this.createChart({
    });

    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 1, "Two panes exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");

    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "default", "Default pane was created with no options");
});

QUnit.test("Two panes canvas creation", function(assert) {
    var chart = this.createChart({
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }
        ]
    });

    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "topPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "bottomPane", "Bottom pane from user options");
    //assert.ok(chart.canvas.marginsThemeApplied);
});

QUnit.test("Two panes canvas creation. All Border visible", function(assert) {
    var chart = this.createChart({
        commonPaneSettings: {
            border: {
                visible: true
            }
        },
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }
        ]
    });
    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "topPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "bottomPane", "Bottom pane from user options");

});

QUnit.test("Two panes canvas creation. Top Border visible", function(assert) {
    var chart = this.createChart({
        panes: [{
            name: "topPane",
            border: {
                visible: true
            }
        }, {
            name: "bottomPane"
        }
        ]
    });
    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "topPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "bottomPane", "Bottom pane from user options");
});

QUnit.test("Two panes canvas creation. Bottom Border visible", function(assert) {
    var chart = this.createChart({
        panes: [{
            name: "topPane"

        }, {
            name: "bottomPane",
            border: {
                visible: true
            }
        }
        ]
    });
    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "topPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "bottomPane", "Bottom pane from user options");
});

QUnit.test("Two panes canvas creation. Top Border visible. Rotated", function(assert) {
    var chart = this.createChart({
        rotated: true,
        panes: [{
            name: "topPane",
            border: {
                visible: true
            }
        }, {
            name: "bottomPane"
        }
        ]
    });
    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "bottomPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "topPane", "Bottom pane from user options");
});

QUnit.test("Two panes canvas creation. Bottom Border visible. Rotated", function(assert) {
    var chart = this.createChart({
        rotated: true,
        panes: [{
            name: "topPane"

        }, {
            name: "bottomPane",
            border: {
                visible: true
            }
        }
        ]
    });
    assert.ok(chart.panes);
    assert.strictEqual(chart.panes.length, 2, "Single pane exists");
    assert.ok(chart.layoutManager, "layoutManager created");
    assert.ok(vizUtils.updatePanesCanvases.called, "Panes were created");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][0].name, "bottomPane", "Top pane from user options");
    assert.strictEqual(vizUtils.updatePanesCanvases.lastCall.args[0][1].name, "topPane", "Bottom pane from user options");

});
///////////////////////////////////////////////////////
//////      Panes creation
///////////////////////////////////////////////////////
QUnit.module("Panes creation", commons.environment);

QUnit.test("by default - default pane created", function(assert) {
    var chart = this.createChart({});

    assert.equal(chart.panes.length, 1);
    assert.equal(chart.panes[0].name, "default");
});

QUnit.test("panes is empty object - default pane created", function(assert) {
    var chart = this.createChart({
        panes: {}
    });

    assert.equal(chart.panes.length, 1);
    assert.equal(chart.panes[0].name, "default0");
});

QUnit.test("panes is object - pane created", function(assert) {
    var chart = this.createChart({
        panes: { name: "my new pane" }
    });

    assert.equal(chart.panes.length, 1);
    assert.equal(chart.panes[0].name, "my new pane");
});

QUnit.test("panes is empty array - default pane created", function(assert) {
    var chart = this.createChart({
        panes: []
    });

    assert.equal(chart.panes.length, 1);
    assert.equal(chart.panes[0].name, "default");
});

QUnit.test("panes is array with one object - pane created", function(assert) {
    var chart = this.createChart({
        panes: [{ name: "my new pane" }]
    });

    assert.equal(chart.panes.length, 1);
    assert.equal(chart.panes[0].name, "my new pane");
});

QUnit.test("panes is array with two object - two panes created", function(assert) {
    var chart = this.createChart({
        panes: [
            { name: "my new pane 1" },
            { name: "my new pane 2" }
        ]
    });

    assert.equal(chart.panes.length, 2);
    assert.equal(chart.panes[0].name, "my new pane 1");
    assert.equal(chart.panes[1].name, "my new pane 2");
});

QUnit.test("panes specified without names - panes created with default names", function(assert) {
    var chart = this.createChart({
        panes: [
            { someOption: "some value" },
            { someOption: "some value" }
        ]
    });

    assert.equal(chart.panes.length, 2);
    assert.equal(chart.panes[0].name, "default0");
    assert.equal(chart.panes[1].name, "default1");
});

QUnit.module("Panes creation. defaultPane", commons.environment);

QUnit.test("single pane - defaultPane is only pane", function(assert) {
    var chart = this.createChart({});

    assert.strictEqual(chart.defaultPane, "default");
});

QUnit.test("multiple panes - defaultPane is the last pane", function(assert) {
    var chart = this.createChart({
        panes: [{ name: "pane 1" }, { name: "pane 2" }]
    });

    assert.strictEqual(chart.defaultPane, "pane 2");
});

QUnit.test("defaultPane specified, there is pane with givenName - defaultPane is that pane", function(assert) {
    var chart = this.createChart({
        defaultPane: "pane 1",
        panes: [{ name: "pane 1" }, { name: "pane 2" }]
    });

    assert.strictEqual(chart.defaultPane, "pane 1");
});

QUnit.test("defaultPane specified, no panes with givenName - defaultPane is the last pane", function(assert) {
    var chart = this.createChart({
        defaultPane: "some pane name",
        panes: [{ name: "pane 1" }, { name: "pane 2" }]
    });

    assert.strictEqual(chart.defaultPane, "pane 2");
});
