"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    commons = require("./chartParts/commons.js"),
    scrollBarClassModule = require("viz/chart_components/scroll_bar"),
    trackerModule = require("viz/chart_components/tracker");

/* global MockSeries, seriesMockData, categories, commonMethodsForTests */
require("../../helpers/chartMocks.js");

$('<div id="chartContainer">').appendTo("#qunit-fixture");

var checkTranslatorsCount = commonMethodsForTests.checkTranslatorsCount;

var OldEventsName = {
    "seriesClick": "onSeriesClick",
    "pointClick": "onPointClick",
    "argumentAxisClick": "onArgumentAxisClick",
    "legendClick": "onLegendClick",
    "pointHoverChanged": "onPointHoverChanged",
    "seriesSelectionChanged": "onSeriesSelectionChanged",
    "pointSelectionChanged": "onPointSelectionChanged",
    "seriesHoverChanged": "onSeriesHoverChanged",
    "tooltipShown": "onTooltipShown",
    "tooltipHidden": "onTooltipHidden"
};

QUnit.module("Zooming", commons.environment);

QUnit.test("chart with single value axis. Validate zoom arguments. Numeric", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart._argumentAxes[0].adjustZoomValues = function(min, max) {
        return { min: Number(min), max: Number(max) };
    };
    chart.zoomArgument("10", "50");
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].arg;

    assert.equal(range1.minVisible, 10, "Min x should be correct");
    assert.equal(range1.maxVisible, 50, "Max x should be correct");
});

QUnit.test("chart with single value axis. Zooming with all null/undefined values", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        }),
        chartRenderSpy = sinon.spy(chart, "_doRender");

    //act
    chart.zoomArgument(undefined, undefined);
    //assert
    assert.equal(chartRenderSpy.callCount, 0);
});

QUnit.test("chart with single value axis. Zooming with one null/undefined values", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        }),
        chartRenderSpy = sinon.spy(chart, "_doRender");

    //act
    chart.zoomArgument(10, null);

    //assert
    assert.equal(chartRenderSpy.callCount, 1);
});

QUnit.test("chart with single value axis. Validate zoom arguments. Rotated", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 0,
                max: 10
            },
            val: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 101,
                max: 151
            },
            val: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart._argumentAxes[0].adjustZoomValues = function(min, max) {
        return { min: Number(min), max: Number(max) };
    };
    chart.zoomArgument("10", "50");
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].arg;

    assert.equal(range1.minVisible, 10, "Min y should be correct");
    assert.equal(range1.maxVisible, 50, "Max y should be correct");
    assert.equal(range1.min, 0, "Min y should be correct");
    assert.equal(range1.max, 151, "Max y should be correct");
});

QUnit.test("chart with single value axis. Validate zoom arguments. Datetime", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        argumentAxis: {
            argumentType: "datetime"
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart._argumentAxes[0].zoom = function(min, max) {
        return { min: new Date(min), max: new Date(max) };
    };
    chart.zoomArgument("Thu Jan 01 1970 04:00:01 GMT+0400 (Russian Standard Time)", "Thu Jan 01 1970 04:00:02 GMT+0400 (Russian Standard Time)");
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].arg;

    assert.equal(range1.minVisible.toString(), (new Date("Thu Jan 01 1970 04:00:01 GMT+0400 (Russian Standard Time)")).toString(), "Min x should be correct"); //+valueMargin
    assert.equal(range1.maxVisible.toString(), (new Date("Thu Jan 01 1970 04:00:02 GMT+0400 (Russian Standard Time)")).toString(), "Max x should be correct");
});

QUnit.test("Reset zooming on dataSource Changed", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });

    chart.zoomArgument(10, 50);
    //act
    chart.option("dataSource", []);
    //assert
    assert.ok(chart.businessRanges);
    var range1 = chart.businessRanges[0].arg;
    assert.equal(range1.min, 0, "Min x should be correct");
    assert.equal(range1.max, 100, "Max x should be correct");
});

QUnit.test("No reset zooming on series changed", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }]
    });

    chart.zoomArgument(10, 50);
    //act
    chart.option({
        series: { type: "area" },
        palette: ["black", "red"]
    });
    //assert
    assert.ok(chart.businessRanges);
    var range1 = chart.businessRanges[0].arg;
    assert.equal(range1.minVisible, 10, "Min x should be correct");
    assert.equal(range1.maxVisible, 50, "Max x should be correct");
});

QUnit.test("chart with single value axis. Adjust on zoom = true", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
            adjustOnZoom: true,
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        }),
        adjustOnZoom;
    //act
    chart._populateBusinessRange = function(range) {
        adjustOnZoom = range.adjustOnZoom;
    };
    chart.zoomArgument(10, 12);
    //assert
    assert.strictEqual(adjustOnZoom, true, "Adjust on zoom is correct");
});

QUnit.test("chart with single value axis. Adjust on zoom = false", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
            adjustOnZoom: false,
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        }),
        adjustOnZoom;
    //act
    chart._populateBusinessRange = function(range) {
        adjustOnZoom = range.adjustOnZoom;
    };
    chart.zoomArgument(10, 12);
    //assert
    assert.strictEqual(adjustOnZoom, false, "Adjust on zoom is correct");
});

QUnit.test("chart with single value axis", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].arg;

    assert.equal(range1.minVisible, 10);
    assert.equal(range1.maxVisible, 50);

    var translators = chart.translators;
    checkTranslatorsCount(assert, chart.translators, 1, [1]);
    var tRange = translators["default"][chart._valueAxes[0].name].arg._businessRange;
    assert.equal(tRange.minVisible, 10);
    assert.equal(tRange.maxVisible, 50);
});

QUnit.test("chart with single value axis. Check min and max", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        valueAxis: {
            mockRange: {
                min: 10,
                max: 30
            }
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    commons.getTrackerStub().stub("update").reset();
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].val;
    assert.ok(commons.getTrackerStub().stub("update").called, "tracker update was called");
    assert.equal(range1.minVisible, 10, "Min y should be correct");
    assert.equal(range1.maxVisible, 30, "Max y should be correct");

});

QUnit.test("MultiAxis chart", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({

        series: [{
            type: "line"
        }, {
            axis: "axis1",
            type: "line"
        }],
        valueAxis: [{
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        },
        {
            name: "axis1",
            minValueMargin: 0,
            maxValueMargin: 0,
            mockRange: {
                minValueMargin: 0,
                maxValueMargin: 0,
                minValueMarginPriority: 50,
                maxValueMarginPriority: 50
            }
        }
        ]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    var range1 = chart.businessRanges[0].arg;
    assert.ok(range1);
    assert.equal(range1.minVisible, 10);
    assert.equal(range1.maxVisible, 50);

    var range2 = chart.businessRanges[1].arg;
    assert.ok(range2);
    assert.equal(range2.minVisible, 10);
    assert.equal(range2.maxVisible, 50);

    var translators = chart.translators;
    checkTranslatorsCount(assert, chart.translators, 1, [2]);
    var tRange = translators["default"][chart._valueAxes[0].name].arg._businessRange;
    assert.equal(tRange.minVisible, 10);
    assert.equal(tRange.maxVisible, 50);

    tRange = translators["default"][chart._valueAxes[1].name].arg._businessRange;
    assert.equal(tRange.minVisible, 10);
    assert.equal(tRange.maxVisible, 50);
});

QUnit.test("MultiAxis chart. Check min and max", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 101,
                max: 151
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({

        series: [{
            type: "line"
        }, {
            axis: "axis1",
            type: "line"
        }],
        valueAxis: [{
            mockRange: {
                min: 10,
                max: 30
            }
        },
        {
            name: "axis1",
            mockRange: {
                min: 20,
                max: 40
            }
        }
        ]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    var range1 = chart.businessRanges[0].val,
        range2 = chart.businessRanges[1].val;

    assert.equal(range1.minVisible, 10, "Min y should be correct");
    assert.equal(range1.maxVisible, 30, "Max y should be correct");

    assert.equal(range2.minVisible, 20, "Min y should be correct");
    assert.equal(range2.maxVisible, 40, "Max y should be correct");
});

QUnit.test("chart with single value  axis. Rotated", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 0,
                max: 10
            },
            val: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 101,
                max: 151
            },
            val: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        rotated: true,
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].arg;

    assert.equal(range1.minVisible, 10);
    assert.equal(range1.maxVisible, 50);

    var translators = chart.translators;
    checkTranslatorsCount(assert, chart.translators, 1, [1]);
    var tRange = translators["default"][chart._valueAxes[0].name].arg._businessRange;
    assert.equal(tRange.minVisible, 10);
    assert.equal(tRange.maxVisible, 50);
});

QUnit.test("chart with single value  axis. Rotated. Check min and max", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 0,
                max: 10
            }, val: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            arg: {
                min: 101,
                max: 151
            }, val: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        rotated: true,
        valueAxis: {
            mockRange: {
                min: 10,
                max: 30
            }
        },
        series: [{
            type: "line"
        }, {
            type: "line"
        }]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert
    assert.ok(chart.businessRanges);

    var range1 = chart.businessRanges[0].val;

    assert.equal(range1.minVisible, 10, "Min x should be correct");
    assert.equal(range1.maxVisible, 30, "Max x should be correct");
});

QUnit.test("chart with single value  axis with equal min & max. ", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 0,
                minVisible: 0,
                maxVisible: 0
            }
        }
    });
    //act

    //assert
    assert.ok(chart.businessRanges);

    var range = chart.businessRanges[0].val;
    assert.equal(range.min, 0);
    assert.equal(range.max, 1);
    assert.equal(range.minVisible, 0);
    assert.equal(range.maxVisible, 0);
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = true. With zooming", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        useAggregation: true,
        adjustOnZoom: true,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 0,
                maxVisible: 100
            }
        }
    });
    //act
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");

    chart.zoomArgument(10, 30);
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: true,
        minArg: 10,
        maxArg: 30,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: true,
        minArg: 10,
        maxArg: 30,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = false. With zooming", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var chart = this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 0,
                maxVisible: 100
            }
        }
    });
    //act
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");

    chart.zoomArgument(10, 30);
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 10,
        maxArg: 30,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 10,
        maxArg: 30,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = true", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));

    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");

    this.createChart({
        useAggregation: true,
        adjustOnZoom: true,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 0,
                maxVisible: 100
            }
        }
    });

    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: true,
        minArg: 0,
        maxArg: 100,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: true,
        minArg: 0,
        maxArg: 50,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = false", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");
    this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 0,
                maxVisible: 100
            }
        }
    });
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 0,
        maxArg: 100,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 0,
        maxArg: 50,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
});

QUnit.test("Aggregation with min and max on argument axis, without zooming", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");
    this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        argumentAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 20,
                maxVisible: 80
            }
        }
    });
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 20,
        maxArg: 80,
        minVal: undefined,
        maxVal: undefined,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 20,
        maxArg: 80,
        minVal: undefined,
        maxVal: undefined,
    }, "visible area");
});

QUnit.test("Aggregation with min and max on argument axis, with zooming", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                max: 100,
                min: 0
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");
    var chart = this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        argumentAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 20,
                maxVisible: 80
            }
        }
    });
    chart.zoomArgument(10, 30);
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 10,
        maxArg: 30,
        minVal: undefined,
        maxVal: undefined,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 10,
        maxArg: 30,
        minVal: undefined,
        maxVal: undefined,
    }, "visible area");
});

QUnit.test("Aggregation. First series has less range", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 1
            },
            arg: {
                min: 0,
                max: 50
            }
        }
    }));
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 0.2
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    var firstSeriesSpy = sinon.spy(seriesMockData.series[0], "getRangeData"),
        secondSeriesSpy = sinon.spy(seriesMockData.series[1], "getRangeData");
    this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }, {
            type: "line"
        }],
        valueAxis: {
            mockRange: {
                min: 0,
                max: 100,
                minVisible: 0,
                maxVisible: 100
            }
        }
    });
    //assert
    assert.deepEqual(firstSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 0,
        maxArg: 50,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
    assert.deepEqual(secondSeriesSpy.lastCall.args[0], {
        adjustOnZoom: false,
        minArg: 0,
        maxArg: 100,
        minVal: 0,
        maxVal: 100,
    }, "visible area");
});

QUnit.test("Event, zoomEnd", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    var zoomEnd = sinon.spy();
    var chart = this.createChart({
        series: { type: "line" },
        onZoomEnd: zoomEnd
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomEnd.callCount, 1);
    assert.equal(zoomEnd.getCall(0).args[0].rangeStart, 30, 'rangeStart');
    assert.equal(zoomEnd.getCall(0).args[0].rangeEnd, 80, 'rangeEnd');
});

QUnit.test("Event, zoomStart", function(assert) {
    seriesMockData.series.push(new MockSeries({
        range: {
            val: {
                min: 0,
                max: 10
            },
            arg: {
                min: 0,
                max: 100
            }
        }
    }));
    var zoomStart = sinon.spy();
    var chart = this.createChart({
        series: { type: "line" },
        onZoomStart: zoomStart
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomStart.callCount, 1);
});

//T520370
QUnit.test("zoom end event, not rendered chart", function(assert) {
    seriesMockData.series.push(new MockSeries({}));
    var zoomEnd = sinon.spy();
    var chart = this.createChart({
        series: { type: "line" },
        size: {
            height: 10
        },
        margin: {
            top: 100
        },
        onZoomEnd: zoomEnd
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomEnd.callCount, 1);
    assert.equal(zoomEnd.getCall(0).args[0].rangeStart, 30, 'rangeStart');
    assert.equal(zoomEnd.getCall(0).args[0].rangeEnd, 80, 'rangeEnd');
});

QUnit.module("MultiAxis Synchronization", commons.environment);

QUnit.test("dxChart with two Series on one pane and different value axis", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            range: { val: { min: 15, max: 80 } },
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            range: { val: { min: 1, max: 5 } },
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80, 100]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);
    var tickPositionsAxis1 = $.map(chart._valueAxes[0].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[0]._translator.translate(val);
    });
    var tickPositionsAxis2 = $.map(chart._valueAxes[1].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[1]._translator.translate(val);
    });
    assert.equal(tickPositionsAxis1.length, 5);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.deepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.test("dxChart with two Series on one pane and different value axis. synchronizeMultiAxes disabled", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        synchronizeMultiAxes: false,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            range: { val: { min: 15, max: 80 } },
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            range: { val: { min: 1, max: 5 } },
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);
    var tickPositionsAxis1 = $.map(chart._valueAxes[0].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[0]._translator.translate(val);
    });
    var tickPositionsAxis2 = $.map(chart._valueAxes[1].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[1]._translator.translate(val);
    });
    assert.equal(tickPositionsAxis1.length, 4);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.notDeepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.test("dxChart with two Series on one pane and different value axis. Rotated.", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80, 100]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);
    var tickPositionsAxis1 = $.map(chart._valueAxes[0].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[0]._translator.translate(val);
    });
    var tickPositionsAxis2 = $.map(chart._valueAxes[1].getTicksValues().majorTicksValues, function(val) {
        return chart._valueAxes[1]._translator.translate(val);
    });
    assert.equal(tickPositionsAxis1.length, 5);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.deepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.module("Pane synchronization", commons.environment);

QUnit.test("simple chart with two panes", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5, stick: true } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "top"
        },
        {
            name: "bottom"
        }
        ],
        series: [
            { pane: "top", type: "line" },
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            maxPadding: 0.3,
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    assert.equal(chart.businessRanges[0].arg.categories, chart.businessRanges[1].arg.categories);
    assert.equal(chart.businessRanges[0].arg.interval, chart.businessRanges[1].arg.interval);
    assert.equal(chart.businessRanges[0].arg.invert, chart.businessRanges[1].arg.invert);
    assert.equal(chart.businessRanges[0].arg.maxVisible, chart.businessRanges[1].arg.maxVisible);
    assert.equal(chart.businessRanges[0].arg.max, chart.businessRanges[1].arg.max);
    assert.equal(chart.businessRanges[0].arg.stick, chart.businessRanges[1].arg.stick);
});

QUnit.test("Rotated chart with two panes", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5, stick: true } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "top"
        },
        {
            name: "bottom"
        }
        ],
        series: [
            { pane: "top", type: "line" },
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    assert.equal(chart.businessRanges[0].arg.categories, chart.businessRanges[1].arg.categories);
    assert.equal(chart.businessRanges[0].arg.interval, chart.businessRanges[1].arg.interval);
    assert.equal(chart.businessRanges[0].arg.invert, chart.businessRanges[1].arg.invert);
    assert.equal(chart.businessRanges[0].arg.maxVisible, chart.businessRanges[1].arg.maxVisible);
    assert.equal(chart.businessRanges[0].arg.max, chart.businessRanges[1].arg.max);
    assert.equal(chart.businessRanges[0].arg.stick, chart.businessRanges[1].arg.stick);
});

QUnit.test("chart with one empty pane", function(assert) {
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1);
    //seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],
        series: [
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[0].arg.categories, businessRanges[1].arg.categories);
    assert.equal(businessRanges[0].arg.interval, businessRanges[1].arg.interval);
    assert.equal(businessRanges[0].arg.invert, businessRanges[1].arg.invert);
    assert.equal(businessRanges[0].arg.maxVisible, businessRanges[1].arg.maxVisible);
    assert.equal(businessRanges[0].arg.max, businessRanges[1].arg.max);
    assert.equal(businessRanges[0].arg.stick, businessRanges[1].arg.stick);
    assert.equal(businessRanges[1].arg.stubData, undefined, "empty pane should not have argument stubData");
    assert.equal(businessRanges[1].val.stubData, true, "empty pane should have value stubData");

    assert.equal(businessRanges[0].arg.stubData, undefined, "bottom pane should not have value stubData");
    assert.equal(businessRanges[0].val.stubData, undefined, "bottom pane should not have value stubData");

});

QUnit.test("chart with empty panes. Axis with argumentType", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[1].arg.stubData, true);
    assert.ok(businessRanges[1].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[1].val.stubData, true);
    assert.strictEqual(businessRanges[1].val.min, 0, "numeric stubDate");

    assert.equal(businessRanges[0].arg.stubData, true);
    assert.ok(businessRanges[0].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[0].val.stubData, true);
    assert.strictEqual(businessRanges[0].val.min, 0, "numeric stubDate");
});

QUnit.test("chart with empty panes. Axis with argumentType = numeric", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "numeric"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[1].arg.stubData, true);
    assert.strictEqual(businessRanges[1].arg.min, 0, "numeric stubDate");
    assert.equal(businessRanges[1].val.stubData, true);
    assert.strictEqual(businessRanges[1].val.min, 0, "numeric stubDate");

    assert.equal(businessRanges[0].arg.stubData, true);
    assert.strictEqual(businessRanges[0].arg.min, 0, "numeric stubDate");
    assert.equal(businessRanges[0].val.stubData, true);
    assert.strictEqual(businessRanges[0].val.min, 0, "numeric stubDate");
});

QUnit.test("chart with empty panes. valueAxis with dataType = datetime", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: {
            valueType: "datetime",
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[1].arg.stubData, true);
    assert.ok(businessRanges[1].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[1].val.stubData, true);
    assert.ok(businessRanges[1].val.min instanceof Date, "datetime stubDate");

    assert.equal(businessRanges[0].arg.stubData, true);
    assert.ok(businessRanges[0].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[0].val.stubData, true);
    assert.ok(businessRanges[0].val.min instanceof Date, "datetime stubDate");
});

QUnit.test("chart with empty panes. Two value Axis", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: [{
            valueType: "datetime",
            mockTickValues: [20, 40, 60, 80]
        },
        {
            pane: "empty",
            valueType: "numeric",
            mockTickValues: [20, 40, 60, 80]
        }
        ]
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[1].arg.stubData, true);
    assert.ok(businessRanges[1].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[1].val.stubData, true);
    assert.ok(businessRanges[1].val.min instanceof Date, "datetime stubDate");

    assert.equal(businessRanges[0].arg.stubData, true);
    assert.ok(businessRanges[0].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[0].val.stubData, true);
    assert.ok(!(businessRanges[0].val.min instanceof Date), "numeric stubDate");
});

QUnit.test("chart with empty panes. three value Axis", function(assert) {
    //act
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [20, 40, 60, 80],
        axis3Ticks = [20, 40, 60, 80];
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [{
            name: "pane1"
        }],

        valueAxis: [{
            valueType: "datetime",
            pane: "pane1",
            mockTickValues: axis1Ticks,
            mockTickInterval: 20
        },
        {
            valueType: "numeric",
            pane: "pane1",
            mockTickValues: axis2Ticks,
            mockTickInterval: 20
        },
        {
            pane: "pane1",
            mockTickValues: axis3Ticks,
            mockTickInterval: 20
        }
        ]
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 1);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 3);

    //assert
    assert.equal(businessRanges[0].arg.stubData, true);
    assert.ok(businessRanges[0].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[0].val.stubData, true);
    assert.ok((businessRanges[0].val.min instanceof Date), "datetime stubDate");

    assert.equal(businessRanges[1].arg.stubData, true);
    assert.ok(businessRanges[1].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[1].val.stubData, true);
    assert.ok(!(businessRanges[1].val.min instanceof Date), "numeric stubDate");

    assert.equal(businessRanges[2].arg.stubData, true);
    assert.ok(businessRanges[2].arg.min instanceof Date, "datetime stubDate");
    assert.equal(businessRanges[2].val.stubData, true);
    assert.ok(!(businessRanges[2].val.min instanceof Date), "numeric stubDate");
});

QUnit.test("Rotated chart with one empty pane", function(assert) {
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 }, arg: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1);
    //seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: "empty" },
            { name: "left" }
        ],
        series: [
            { pane: "left", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    var businessRanges = chart.businessRanges;
    assert.ok(chart.businessRanges);
    assert.equal(chart.businessRanges.length, 2);

    //assert
    assert.equal(businessRanges[0].arg.categories, businessRanges[1].arg.categories);
    assert.equal(businessRanges[0].arg.interval, businessRanges[1].arg.interval);
    assert.equal(businessRanges[0].arg.invert, businessRanges[1].arg.invert);
    assert.equal(businessRanges[0].arg.maxVisible, businessRanges[1].arg.maxVisible);
    assert.equal(businessRanges[0].arg.max, businessRanges[1].arg.max);
    assert.equal(businessRanges[0].arg.stick, businessRanges[1].arg.stick);
    assert.equal(businessRanges[1].arg.stubData, undefined, "empty pane should not have argument stubData");
    assert.equal(businessRanges[1].val.stubData, true, "empty pane should have value stubData");

    assert.equal(businessRanges[0].val.stubData, undefined, "bottom pane should not have value stubData");
    assert.equal(businessRanges[0].arg.stubData, undefined, "bottom pane should not have value stubData");
});

QUnit.module("scrollBar", commons.environment);

QUnit.test("chart with invisible scrollBar", function(assert) {
    var chart = this.createChart({
        margin: {
            width: 100,
            height: 500
        },
        scrollBar: {
            visible: false
        }
    });
    assert.ok(!scrollBarClassModule.ScrollBar.called);
    assert.deepEqual(chart.layoutManager.applyHorizontalAxesLayout.lastCall.args[0], chart._argumentAxes);
    assert.deepEqual(chart.layoutManager.applyVerticalAxesLayout.lastCall.args[0], chart._valueAxes);
});

QUnit.test("chart with visible scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true
    }]);

    assert.ok(scrollBar, "scroll bar");

    assert.deepEqual(chart.layoutManager.applyHorizontalAxesLayout.lastCall.args[0], chart._argumentAxes.concat([scrollBar]));
    assert.deepEqual(chart.layoutManager.applyVerticalAxesLayout.lastCall.args[0], chart._valueAxes);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [chart.businessRanges[0].arg, chart.panes[0].canvas]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
    assert.ok(scrollBar.applyLayout.calledOnce);
});

QUnit.test("chart with visible scrollBar. Rotated", function(assert) {
    var chart = this.createChart({
            rotated: true,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: true,
        visible: true
    }]);

    assert.ok(scrollBar);

    assert.equal(chart.layoutManager.applyHorizontalAxesLayout.lastCall.args[0], chart._valueAxes);
    assert.deepEqual(chart.layoutManager.applyVerticalAxesLayout.lastCall.args[0], ([scrollBar]).concat(chart._argumentAxes));

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [chart.businessRanges[0].arg, chart.panes[0].canvas]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
    assert.ok(scrollBar.applyLayout.calledOnce);
});

QUnit.test("T175767. Argument axis has min/max", function(assert) {
    this.createChart({
        argumentAxis: {
            mockRange: {
                min: 0,
                max: 20,
                minVisible: 5,
                maxVisible: 15
            }
        },
        scrollBar: {
            visible: true
        }
    });

    var scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [5, 15]);
});

QUnit.test("Discrete argument axis has min/max", function(assert) {
    this.createChart({
        dataSource: [{ arg: "A" }, { arg: "B" }, { arg: "C" }, { arg: "D" }, { arg: "E" }],
        argumentAxis: {
            mockRange: {
                min: "A",
                max: "E",
                minVisible: "C",
                maxVisible: "D"
            }
        },
        scrollBar: {
            visible: true
        }
    });

    var scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, ["C", "D"]);
});

QUnit.test("T172802. Scroll bar after zooming. One categories", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: "January" }],
            scrollBar: {
                visible: true
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    scrollBar.setPosition.reset();

    chart.zoomArgument("January", "January", true);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
});

QUnit.test("applyTheme", function(assert) {
    this.themeManager.getOptions.withArgs("scrollBar").returns({
        scrollBarThemeApplied: true,
        visible: true
    });

    var chart = this.createChart({
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        scrollBarThemeApplied: true
    }]);
});

QUnit.test("ScrollBar option changed", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true,
                color: "old"
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: true,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: true,
        color: "new"
    });

    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledTwice);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: "new"
    }]);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [chart.businessRanges[0].arg, chart.panes[0].canvas]);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
});

QUnit.test("Options changed - hide scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true,
                color: "old"
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: false,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: false,
        color: "new"
    });

    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.ok(scrollBar.dispose.calledOnce, "scrollBar disposed");

    assert.ok(chart._scrollBarGroup.linkRemove.called);
});

QUnit.test("Options changed - show scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: false,
                color: "old"
            }
        }),
        scrollBar;

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: true,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: true,
        color: "new"
    });
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: "new"
    }]);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [chart.businessRanges[0].arg, chart.panes[0].canvas]);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
});

//T207760
QUnit.test("Options changed - rotated (false->true)", function(assert) {
    //arrange
    var chart = this.createChart({
            rotated: false,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar;

    this.themeManager.getOptions.withArgs("rotated").returns(true);

    //act
    chart.option("rotated", true);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    //assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: true, visible: true }]);
});

//T207760
QUnit.test("Options changed - rotated (true->false)", function(assert) {
    //arrange
    var chart = this.createChart({
            rotated: true,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar;

    this.themeManager.getOptions.withArgs("rotated").returns(false);

    //act
    chart.option("rotated", false);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    //assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: false, visible: true }]);
});

//T382491
QUnit.test("empty categories in axis & continuous data", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: { min: 0, max: 10 }, arg: { categories: [], axisType: "continuous", min: 1, max: 3 }
        }
    }));
    var chart = this.createChart({
        dataSource: [{ x: 1, y: 3 }, { x: 3, y: 3 }],
        series: [{
            type: "bar",
            argumentField: "x",
            valueField: "y"
        }],
        argumentAxis: { categories: [] },
        scrollBar: { visible: true },
        zoomingMode: "all",
        scrollingMode: "all"
    });

    //act
    chart.zoomArgument(1, 2);

    //assert
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.returnValue.setPosition.lastCall.args, [1, 2]);
});

QUnit.module("Map events", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.call(this);
        this.addArgumentAxis = noop;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        commons.environment.afterEach.call(this);
        this.clock.restore();
    }
}));

QUnit.test("chart events", function(assert) {
    var events = {},
        chart,
        target = { isTarget: true },
        event = { isEvent: true },
        targetArg = { target: target, jQueryEvent: event, argument: "argument" };

    $.each(OldEventsName, function(oldName, newName) {
        events[newName] = sinon.stub();
    });
    chart = this.createChart(events);
    //acts
    $.each(OldEventsName, function(eventName) {
        trackerModule.ChartTracker.lastCall.args[0].eventTrigger(eventName, targetArg);
    });
    this.clock.tick(100);
    //assert
    $.each(events, function(eventName, callBack) {
        assert.strictEqual(callBack.callCount, 1, eventName + " callback called");
        assert.strictEqual(callBack.lastCall.args[0].target, target, eventName + " target is correct");
        assert.strictEqual(callBack.lastCall.args[0].jQueryEvent, event, eventName + " event is correct");
        assert.strictEqual(callBack.lastCall.args[0].argument, "argument", eventName + " argument is correct");
    });
});
