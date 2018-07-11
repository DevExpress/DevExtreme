"use strict";

var $ = require("jquery"),
    commons = require("./chartParts/commons.js"),
    vizUtils = require("viz/core/utils"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockSeries = chartMocks.MockSeries,
    commonMethodsForTests = chartMocks.commonMethodsForTests;

require("../../helpers/chartMocks.js");

$('<div id="chartContainer">').appendTo("#qunit-fixture");

QUnit.module("dxChart Business Ranges", commons.environment);

QUnit.test("Pass rotation info to Business range (rotated = true)", function(assert) {
    var chart = this.createChart({
        rotated: true,
        argumentAxis: { mockRange: {} }
    });
    assert.strictEqual(chart.getValueAxis().setBusinessRange.lastCall.args[0].rotated, true);
    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].rotated, true);
});

QUnit.test("Pass rotation info to Business range (rotated = false)", function(assert) {
    var chart = this.createChart({
        argumentAxis: { mockRange: {} }
    });

    assert.strictEqual(chart.getValueAxis().setBusinessRange.lastCall.args[0].rotated, false);
    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].rotated, false);
});

QUnit.test("Calculate business range for continuous without indent", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
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
    assert.ok(!chart._argumentAxes[0].setBusinessRange.lastCall.args[0].categories);
    assert.ok(!chart.getValueAxis().setBusinessRange.lastCall.args[0].categories);
    assert.equal(chart.getValueAxis().setBusinessRange.lastCall.args[0].min, 0);
    assert.equal(chart.getValueAxis().setBusinessRange.lastCall.args[0].max, 10);
});

QUnit.test("Calculate business range for continuous with default indent", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
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

    var range = chart.getValueAxis().setBusinessRange.lastCall.args[0];
    assert.ok(!chart._argumentAxes[0].setBusinessRange.lastCall.args[0].categories);
    assert.ok(!range.categories);
    assert.equal(range.min, -1);
    assert.equal(range.max, 9);
});

QUnit.test("Calculate business range for categories from Axis and continuous values from Series", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
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

    assert.equal(chart.getValueAxis().setBusinessRange.lastCall.args[0].min, -1);
    assert.equal(chart.getValueAxis().setBusinessRange.lastCall.args[0].max, 9);
});

QUnit.test("Two ranges for two panes - data from series, indents from common axis", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            }
        }
    }));
    chartMocks.seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            }
        }
    }));
    // act
    var chart = this.createChart({
        series: [{
            // doesn't matter as range goes from predefined series above
            pane: "topPane",
            type: "line"
        }, {
            // doesn't matter as range goes from predefined series above
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
    // assert

    var range1 = chart._valueAxes[0].setBusinessRange.lastCall.args[0];
    assertRange(assert, range1, {
        pane: "topPane",
        min: 0,
        max: 10
    });

    var range2 = chart._valueAxes[1].setBusinessRange.lastCall.args[0];
    assertRange(assert, range2, {
        pane: "otherPane",
        min: 101,
        max: 151
    });
});

QUnit.test("Two Series, one of them is not visible", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({ visible: false, range: { arg: { categories: ["A", "B", "C"] } } }));
    chartMocks.seriesMockData.series.push(new MockSeries({ range: { arg: { categories: ["D", "E", "F"] } } }));

    var chart = this.createChart({
        dataSource: [{ arg: "A", val: 1 }, { arg: "B", val: 2 }, { arg: "C", val: 3 }, { arg: "D", val: 1 }, { arg: "E", val: 2 }, { arg: "F", val: 3 }],
        series: [{ type: "line" }, { type: "line" }]
    });

    assert.deepEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].categories, ["D", "E", "F"]);
});

QUnit.test("Pass groupData categories to axis.setBusinesRange", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({ range: { arg: { categories: ["A", "D", "E", "C", "F"] } } }));

    var chart = this.createChart({
        dataSource: [{ arg: "A", val: 1 }, { arg: "B", val: 2 }, { arg: "C", val: 3 }, { arg: "D", val: 1 }, { arg: "E", val: 2 }, { arg: "F", val: 3 }],
        series: [{ type: "line" }]
    });

    assert.deepEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].categories, ["A", "D", "E", "C", "F"]);
    assert.deepEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[1], ["A", "B", "C", "D", "E", "F"]);
});

var assertRange = commonMethodsForTests.assertRange;

// /////////////////////////////////////////////////////
// ////      Canvas creation
// /////////////////////////////////////////////////////
QUnit.module("dxChart Canvas", commons.environment);

QUnit.test("Canvas creation from options", function(assert) {

    var chartOptions = {
        left: 80,
        right: 90,
        top: 4,
        bottom: 80
    };
    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
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
    // get it from container"s width and height
    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 150, "True height of container");
    // get it from default canvas" settings

    // assert.ok(chart.canvas.marginsThemeApplied);
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

    // assert.ok(chart.canvas);
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

    // assert.ok(chart.canvas);
    // assert.equal(chart.canvas.width, 0);
    // assert.equal(chart.canvas.height, 445);
    assert.ok(chart._canvas);
    assert.equal(this.$container.width(), css.width);
    assert.equal(this.$container.height(), css.height);
});

QUnit.test("Canvas creation, custom negative height option", function(assert) {
    var css = { width: this.$container.width(), height: this.$container.height() };

    var chart = this.createChart({
        size: { width: 555, height: -445 }
    });

    // assert.ok(chart.canvas);
    // assert.equal(chart.canvas.width, 555);
    // assert.equal(chart.canvas.height, 0);
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
        // width: 800,
        // height: 800,
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
    // assert.ok(chart.canvas.marginsThemeApplied);
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
// /////////////////////////////////////////////////////
// ////      Panes creation
// /////////////////////////////////////////////////////
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

QUnit.module("Merge marginOptions", commons.environment);

QUnit.test("Pass merged marginOptions to axes", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: false,
            size: 8,
            percentStick: true
        }
    }));

    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: true,
            size: 5,
            percentStick: false
        }
    }));

    var chart = this.createChart({
        series: [{}, {}]
    });

    assert.deepEqual(chart.getValueAxis().setMarginOptions.lastCall.args[0], {
        size: 8,
        checkInterval: true,
        percentStick: true,
        sizePointNormalState: 0
    });

    assert.deepEqual(chart._argumentAxes[0].setMarginOptions.lastCall.args[0], {
        size: 8,
        checkInterval: true,
        percentStick: true,
        sizePointNormalState: 0
    });
});

QUnit.test("Merge options witout size", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({}));

    var chart = this.createChart({
        series: [{}]
    });

    assert.deepEqual(chart.getValueAxis().setMarginOptions.lastCall.args[0].size, 0);
});

QUnit.test("Pass merged marginOptions to axes when two value axis", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: false,
            size: 8,
            percentStick: false
        }
    }));

    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: true,
            size: 5,
            percentStick: true
        }
    }));

    var chart = this.createChart({
        series: [{
            axis: "axis1"
        }, {
            axis: "axis2"
        }],
        valueAxis: [{
            name: "axis1"
        }, {
            name: "axis2"
        }]
    });

    assert.deepEqual(chart.getValueAxis("axis1").setMarginOptions.lastCall.args[0], {
        checkInterval: false,
        size: 8,
        percentStick: false,
        sizePointNormalState: 0
    });

    assert.deepEqual(chart.getValueAxis("axis2").setMarginOptions.lastCall.args[0], {
        checkInterval: true,
        size: 5,
        percentStick: true,
        sizePointNormalState: 0
    });

    assert.deepEqual(chart.getArgumentAxis().setMarginOptions.lastCall.args[0], {
        size: 8,
        checkInterval: true,
        percentStick: true,
        sizePointNormalState: 0
    });
});

QUnit.test("Process margin for bubble", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            processBubbleSize: true
        }
    }));

    var chart = this.createChart({
        series: [{}],
        panes: [{
            name: "pane1"
        },
        {
            name: "pane2"
        }],
        maxBubbleSize: 0.2,
        size: {
            width: 1000,
            height: 800
        }
    });

    assert.deepEqual(chart.getValueAxis().setMarginOptions.lastCall.args[0].size, 80);
});

QUnit.test("Process margin for bubble. Rotated chart", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            processBubbleSize: true
        }
    }));

    var chart = this.createChart({
        series: [{}],
        rotated: true,
        panes: [{
            name: "pane1"
        },
        {
            name: "pane2"
        }],
        maxBubbleSize: 0.2,
        size: {
            width: 1000,
            height: 800
        }
    });

    assert.deepEqual(chart.getValueAxis().setMarginOptions.lastCall.args[0].size, 100);
});

QUnit.test("pointSize merging", function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: false,
            size: 8,
            percentStick: true,
            sizePointNormalState: 8
        }
    }));

    chartMocks.seriesMockData.series.push(new MockSeries({
        marginOptions: {
            checkInterval: true,
            size: 5,
            percentStick: false,
            sizePointNormalState: 5
        }
    }));

    var chart = this.createChart({
        series: [{}, {}]
    });

    assert.deepEqual(chart._argumentAxes[0].setMarginOptions.lastCall.args[0], {
        size: 8,
        checkInterval: true,
        percentStick: true,
        sizePointNormalState: 8
    });
});
