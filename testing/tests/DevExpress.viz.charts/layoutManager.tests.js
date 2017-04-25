"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    axisModule = require("viz/axes/base_axis"),
    labelModule = require("viz/series/points/label"),
    setCanvasValues = require("viz/core/utils").setCanvasValues,
    layoutElementModule = require("viz/core/layout_element"),
    layoutManagerModule = require("viz/chart_components/layout_manager");

var canvasTemplate = {
        width: 1000,
        height: 400,
        top: 10,
        bottom: 20,
        left: 30,
        right: 40
    },
    canvas,
    twoPanes,
    multipleAxesSpacing = 5,
    Axis = vizMocks.stubClass(axisModule.Axis),
    LayoutElement = vizMocks.stubClass(layoutElementModule.LayoutElement);

var environment = {
    beforeEach: function() {
        this.canvas = {
            left: 0, right: 10, width: 110,
            top: 0, bottom: 10, height: 110
        };
        this.commonBBox = { height: 20, width: 20 };
    },
    afterEach: function() {
    },
    createLayoutManager: function(options) {
        var layoutManager = new layoutManagerModule.LayoutManager();
        layoutManager.setOptions(options || { width: 10, height: 10 });
        return layoutManager;
    },
    createLayoutElement: function(bBox) {
        var that = this,
            options = $.extend({}, this.commonBBox, bBox),
            layoutElement = new LayoutElement(options),
            empty = $.extend({}, options, { width: 0, height: 0 });

        layoutElement.stub("getLayoutOptions").returns(options);
        layoutElement.probeDraw = sinon.stub();
        layoutElement.stub("position").returnsThis();
        layoutElement.draw = sinon.spy(function() {
            if(!that.checkLayoutElementVisibility(layoutElement)) {
                layoutElement.getLayoutOptions.returns(empty);
            }
        });

        return layoutElement;
    },
    checkLayoutElementVisibility: function(layoutElement) {
        var layoutOptions = layoutElement.ctorArgs[0];

        return layoutElement.draw.lastCall.args[0] >= layoutOptions.width
                && layoutElement.draw.lastCall.args[1] >= layoutOptions.height;
    },
    getAxesDrawer: function(axesSize) {
        var that = this;
        return sinon.spy(function(redraw) {
            if(redraw) return;
            $.each(axesSize, function(side, value) {
                that.canvas[side] += value;
            });
        });
    },
    getLayoutTargets: function() {
        return [{ canvas: this.canvas }];
    },
    createAxis: function() {
        var axis = new Axis();
        axis.stub("getBoundingRect").returns({ height: 0, width: 0 });
        return axis;
    }
};

function setupCanvas() {
    canvas = $.extend(true, {}, canvasTemplate);
}

function setupTwoVerticalPanes() {
    setupCanvas();
    var topPane = {
            name: 'topPane',
            weight: 1,
            canvas: $.extend({},
                canvas,
                {
                    bottom: 150,
                    originalTop: canvas.top,
                    originalBottom: 150,
                    originalLeft: canvas.left,
                    originalRight: canvas.right
                })
        },
        bottomPane = {
            name: 'bottomPane',
            weight: 1,
            canvas: $.extend({},
                canvas,
                {
                    top: 200,
                    originalTop: 200,
                    originalBottom: canvas.bottom,
                    originalLeft: canvas.left,
                    originalRight: canvas.right
                })
        };
    twoPanes = [topPane, bottomPane];
}

function createLayoutManager(options) {
    var layoutManager = new layoutManagerModule.LayoutManager(options);
    layoutManager.setOptions(options || { width: 160, height: 160 });
    return layoutManager;
}

function assertOriginalMargin(assert, canvas) {
    assert.equal(canvas.originalLeft, canvas.left, 'Margin Left was saved as originalMargin');
    assert.equal(canvas.originalRight, canvas.right, 'Margin Right was saved as originalMargin');
    assert.equal(canvas.originalTop, canvas.top, 'Margin Top was saved as originalMargin');
    assert.equal(canvas.originalBottom, canvas.bottom, 'Margin Bottom was saved as originalMargin');
}

var getChartOptions = function(options) {
    return $.extend(
        {
            canvas: canvas,
            panes: [{
                canvas: $.extend({
                    originalLeft: canvas.left,
                    originalRight: canvas.right,
                    originalTop: canvas.top,
                    originalBottom: canvas.bottom
                }, canvas)
            }]
        },
        options);
};
var createAxis = function(axisRect, options) {
    var stubAxis = sinon.createStubInstance(axisModule.Axis);
    stubAxis._options = options || { isHorizontal: true, position: "bottom" };
    stubAxis.getOptions = function() {
        return stubAxis._options;
    };
    stubAxis.getBoundingRect.returns(axisRect);
    stubAxis.getMultipleAxesSpacing.returns(5);
    stubAxis.setBoundingRect = function(rect) {
        axisRect = rect;
    };

    return stubAxis;
};

function assertPaneCanvas(assert, canvas, left, right, top, bottom) {
    assert.strictEqual(canvas.left - canvas.originalLeft, left, left ? 'Change should be on left margin' : 'No change should be on left margin');
    assert.strictEqual(canvas.right - canvas.originalRight, right, right ? 'Change should be on right margin' : 'No change should be on right margin');
    assert.strictEqual(canvas.top - canvas.originalTop, top, top ? 'Change should be on top margin' : 'No change should be on top margin');
    assert.strictEqual(canvas.bottom - canvas.originalBottom, bottom, bottom ? 'Change should be on bottom margin' : 'No change should be on bottom margin');
}

function getStubSeries(type, innerRadius, points) {
    var stubSeries = new vizMocks.Series();


    stubSeries.type = type;

    stubSeries.stub("getVisiblePoints").returns(points || [createFakePointsWithStubLabels({}, true, false)]);
    stubSeries.correctLabelRadius = sinon.stub();
    stubSeries.setVisibleArea = sinon.stub();
    stubSeries.innerRadius = innerRadius;
    return [stubSeries];
}

function getNStubSeries(type, innerRadius, arrPoints) {
    var stubSeries = [];
    for(var i = 0; i < arrPoints.length; i++) {
        stubSeries = stubSeries.concat(getStubSeries(type, innerRadius, arrPoints[i]));
    }
    return stubSeries;
}

function createFakePointsWithStubLabels(bBox, isVisible, hasText, options) {
    var stubLabel = sinon.createStubInstance(labelModule.Label),
        fakePoint = {
            _label: stubLabel,
        };

    stubLabel.getBoundingRect.returns(bBox || {});
    stubLabel.isVisible.returns(hasText);
    stubLabel.getLayoutOptions.returns({ position: options && options.position || "outside" });

    return fakePoint;
}

function checkLayout(assert, layout, canvas, inner, outer) {
    assert.strictEqual(layout.centerX, Math.floor((canvas.width - canvas.left - canvas.right) / 2 + canvas.left), 'centerX');
    assert.strictEqual(layout.centerY, Math.floor((canvas.height - canvas.top - canvas.bottom) / 2 + canvas.top), 'centerY');
    assert.strictEqual(layout.radiusInner, inner, 'radiusInner');
    assert.strictEqual(layout.radiusOuter, outer, 'radiusOuter');
}

QUnit.module("Lifecycle", environment);

QUnit.test("create layout manager", function(assert) {
    assert.ok(this.createLayoutManager() instanceof layoutManagerModule.LayoutManager);
});

QUnit.module("Horizontal Axes alignment", { beforeEach: setupCanvas });

QUnit.test('Bottom only', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height - canvasTemplate.bottom
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 40);
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Bottom only two axes', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height - canvasTemplate.bottom
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    var axis1 = createAxis(axisRect, { position: "bottom" });
    var chart = getChartOptions({
        _argumentAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);

    //assert

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 40 + 40 + 5);

    assert.strictEqual(axis.delta['bottom'], 45);
    assert.strictEqual(axis1.delta['bottom'], 0);
});

QUnit.test('Bottom only two axes double applying', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    var axis1 = createAxis(axisRect, { position: "bottom" });
    var chart = getChartOptions({
        _argumentAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);

    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 40 + 40 + 5);
    assert.strictEqual(axis.delta['bottom'], 40 + multipleAxesSpacing);
    assert.strictEqual(axis1.delta['bottom'], 0);
});

QUnit.test('Top only two axes', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: 10
    };
    var axis = createAxis(axisRect);
    axis._options.position = 'top';
    var axis1 = createAxis(axisRect);
    axis1._options.position = 'top';
    var chart = getChartOptions({
        _argumentAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 40 + 5 + 40, 0);
    assert.strictEqual(axis.delta['top'], -40 - multipleAxesSpacing);
    assert.strictEqual(axis1.delta['top'], 0);
});

QUnit.test('Top only two axes double applying', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: -10
    };
    var axis = createAxis(axisRect);
    axis._options.position = 'top';
    var axis1 = createAxis(axisRect);
    axis1._options.position = 'top';

    var chart = getChartOptions({
        _argumentAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);
    layoutManager.applyHorizontalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 40 + 5 + 40, 0);
    assert.strictEqual(axis.delta['top'], -40 - multipleAxesSpacing);
    assert.strictEqual(axis1.delta['top'], 0);
});

QUnit.test('Top only', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: -10
    };
    var axis = createAxis(axisRect);
    axis._options.position = 'top';

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert


    assert.ok(layoutManager.requireAxesRedraw, 'Redraw vertical axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 40, 0);
});

QUnit.test('Left', function(assert) {
    //arrange
    var axisRect = {
        width: 30,
        height: 40,
        x: 0,
        y: 370
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');
    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, 0, 40);
});

QUnit.test('Left. Empty group', function(assert) {
    //arrange
    var axisRect = {
        width: 30,
        height: 40,
        x: 0,
        y: 370,
        isEmpty: true
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 40);
});

QUnit.test('Right', function(assert) {

    //arrange
    var axisRect = {
        width: 40,
        height: 100,
        x: 960,
        y: canvasTemplate.height / 2
    };
    var axis = createAxis(axisRect, { position: "bottom" });

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw  axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 40, 0, 100);
});

QUnit.test('Right. empty group', function(assert) {

    //arrange
    var axisRect = {
        width: 40,
        height: 100,
        x: 960,
        y: canvasTemplate.height / 2,
        isEmpty: true
    };
    var axis = createAxis(axisRect, { position: "bottom" });

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw  axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 100);
});

QUnit.test('Left and Right', function(assert) {

    //arrange
    var axisRect = {
        width: canvasTemplate.width,
        height: 40,
        x: 0,
        y: canvasTemplate.height - 20
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 40, 0, 40);
});

QUnit.test('Empty axis', function(assert) {
    //arrange
    var axisRect = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    assert.ok(!axis.shifted, 'Should not be shifter');
    assert.ok(!layoutManager.requireVerticalAxesRedraw, 'No need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 0);
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Bottom only, with padding axis', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height - canvasTemplate.bottom
    };
    var axis = createAxis(axisRect);
    axis.padding = { 'top': 5, 'bottom': 10 };

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 5, 40);
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Top only, with padding axis', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height - canvasTemplate.bottom
    };
    var axis = createAxis(axisRect);
    axis._options.position = 'top';
    axis.padding = { 'top': 5, 'bottom': 10 };

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 40, 10);
    assertOriginalMargin(assert, canvas);
});

QUnit.test("exceedings set stopDrawnAxes", function(assert) {
    //arrange
    var axisRect = {
        width: 30,
        height: 500,
        x: 0,
        y: 370
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);
    assert.ok(layoutManager.stopDrawAxes, "Need stop drawAxes");
});

QUnit.module("Horizontal and vertical axes alignment", { beforeEach: setupCanvas });

QUnit.test('Single pane. Vertical axes alignment after horizontal axes alignment', function(assert) {
    //arrange

    var horizontalAxisRect = {
        width: 990,
        height: 20,
        x: -30,
        y: 390
    };

    var verticalAxis1Rect = {
        width: 70,
        height: 340,
        x: -10,
        y: 10
    };

    var horizontalAxis = createAxis(horizontalAxisRect, { position: "bottom" });
    var verticalAxis1 = createAxis(verticalAxis1Rect, { position: "left" });

    var chart = getChartOptions({
        _argumentAxes: [horizontalAxis],
        _valueAxes: [verticalAxis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    layoutManager.applyHorizontalAxesLayout([horizontalAxis], chart.panes, false);
    //act

    layoutManager.applyVerticalAxesLayout([verticalAxis1], chart.panes, false);

    assertPaneCanvas(assert, chart.panes[0].canvas, 60 + 10, 0, 0, 20);
});

QUnit.test('Single pane. Two left vertical axes alignment after horizontal axes alignment', function(assert) {
    //arrange

    var horizontalAxisRect = {
        width: 990,
        height: 20,
        x: -30,
        y: 390
    };

    var verticalAxis1Rect = {
        width: 70,
        height: 340,
        x: -10,
        y: 10
    };

    var verticalAxis2Rect = {
        width: 100,
        height: 340,
        x: -40,
        y: 10
    };

    var horizontalAxis = createAxis(horizontalAxisRect, { position: "bottom" });
    var verticalAxis1 = createAxis(verticalAxis1Rect, { position: "left" });
    var verticalAxis2 = createAxis(verticalAxis2Rect, { position: "left" });

    var chart = getChartOptions({
        _argumentAxes: [horizontalAxis],
        _valueAxes: [verticalAxis1, verticalAxis2],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    layoutManager.applyHorizontalAxesLayout([horizontalAxis], chart.panes, false);

    layoutManager.applyVerticalAxesLayout([verticalAxis1, verticalAxis2], chart.panes, false);

    assertPaneCanvas(assert, chart.panes[0].canvas, 70 + 5 + 100, 0, 0, 20);
    assert.equal(verticalAxis1.delta['left'], 0);
    assert.equal(verticalAxis2.delta['left'], -75);
    //assertOriginalMargin(assert, canvas);
});

QUnit.test('Single pane. Two right vertical axes alignment after horizontal axes alignment', function(assert) {
    //arrange

    var horizontalAxisRect = {
        width: 950,
        height: 20,
        x: 30,
        y: 390
    };

    var verticalAxis1Rect = {
        width: 70,
        height: 340,
        x: 980,
        y: 10
    };

    var verticalAxis2Rect = {
        width: 100,
        height: 340,
        x: 1010,
        y: 10
    };

    var horizontalAxis = createAxis(horizontalAxisRect);
    var verticalAxis1 = createAxis(verticalAxis1Rect);
    verticalAxis1._options.position = 'right';
    var verticalAxis2 = createAxis(verticalAxis2Rect);
    verticalAxis2._options.position = 'right';

    var chart = getChartOptions({
        _argumentAxes: [horizontalAxis],
        _valueAxes: [verticalAxis1, verticalAxis2],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyHorizontalAxesLayout([horizontalAxis], chart.panes, false);
    layoutManager.applyVerticalAxesLayout([verticalAxis1, verticalAxis2], chart.panes, false);

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 70 + 100 + 5, 0, 20);
    assert.equal(verticalAxis1.delta['right'], 0);
    assert.equal(verticalAxis2.delta['right'], 75);
    //assertOriginalMargin(assert, canvas);
});

QUnit.module("Horizontal Axes alignment - Two panes, single axis", { beforeEach: setupTwoVerticalPanes });

QUnit.test('Bottom only', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: canvasTemplate.height - 20
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    //bottom pane
    axis.pane = twoPanes[1].name;

    var chart = getChartOptions({
        panes: twoPanes,
        _argumentAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    //top pane should not change at all
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 0);
    //second pane should change bottom margin
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 0, 0, 40);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Top only', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 200,
        y: -10
    };
    var axis = createAxis(axisRect);
    axis._options.position = 'top';
    //top pane this case
    axis.pane = twoPanes[0].name;

    var chart = getChartOptions({
        _argumentAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    //top pane should not change at all
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 40, 0);
    //second pane should change bottom margin
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 0, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Left only', function(assert) {
    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: 0,
        y: canvasTemplate.height / 2
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    //bottom pane
    axis.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _argumentAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);
    var delta = canvasTemplate.left - axisRect.x;

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, delta, 0, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, delta, 0, 0, 40);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Right only', function(assert) {

    //arrange
    var axisRect = {
        width: canvasTemplate.width - 400,
        height: 40,
        x: canvasTemplate.width,
        y: canvasTemplate.height / 2
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    //bottom pane
    axis.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _argumentAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    var delta = (canvas.width - canvasTemplate.right) - (axisRect.x + axisRect.width);

    assert.ok(layoutManager.requireAxesRedraw, 'No need to redraw axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, -delta, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, -delta, 0, 40);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);

});

QUnit.test('Left and Right', function(assert) {

    //arrange
    var axisRect = {
        width: canvasTemplate.width,
        height: 40,
        x: 0,
        y: canvasTemplate.height / 2
    };
    var axis = createAxis(axisRect, { position: "bottom" });
    //bottom pane
    axis.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _argumentAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyHorizontalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(!axis.shifted, 'shifted');
    var deltaLeft = canvasTemplate.left - axisRect.x;
    var deltaRight = (canvas.width - canvasTemplate.right) - (axisRect.x + axisRect.width);

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, deltaLeft, -deltaRight, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, deltaLeft, -deltaRight, 0, 40);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
QUnit.module("Vertical Axes alignment", { beforeEach: setupCanvas });

QUnit.test('Left only', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert


    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 40, 0, 0, 0);
});

QUnit.test('Left only two axis', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" }),
        axis1 = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 40 + multipleAxesSpacing + 40, 0, 0, 0);
    assert.strictEqual(axis.delta['left'], 0);
    assert.strictEqual(axis1.delta['left'], -40 - multipleAxesSpacing);
});

//B231060
QUnit.test('Left only two axis double applying', function(assert) {
    //arrange
    var axisRect1 = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axisRect2 = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: 29,
            y: 50
        },
        axis = createAxis(axisRect1, { position: "left" }),
        axis1 = createAxis(axisRect1, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);
    axis.setBoundingRect(axisRect2);
    axis1.setBoundingRect(axisRect2);
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 40 + multipleAxesSpacing + 40, 0, 0, 0);

    assert.strictEqual(axis.delta['left'], 0);
    assert.strictEqual(axis1.delta['left'], -40 - multipleAxesSpacing);
});

QUnit.test('Right only', function(assert) {

    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        },
        axis = createAxis(axisRect);
    axis._options.position = 'right';

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 40, 0, 0);
});

QUnit.test('Right only two axis', function(assert) {
    //arrange
    var axisWidth = 40,
        axisRect = {
            width: axisWidth,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        },
        axis = createAxis(axisRect),
        axis1 = createAxis(axisRect);

    axis._options.position = 'right';
    axis1._options.position = 'right';

    var chart = getChartOptions({
        _valueAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, axisWidth + multipleAxesSpacing + axisWidth, 0, 0);
    assert.strictEqual(axis.delta['right'], 0);
    assert.strictEqual(axis1.delta['right'], axisWidth + multipleAxesSpacing);
});

QUnit.test('Right only two axis double applying', function(assert) {

    //arrange
    var axisWidth = 40;
    var axisRect = {
            width: axisWidth,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        },
        axis = createAxis(axisRect),
        axis1 = createAxis(axisRect);

    axis._options.position = 'right';
    axis1._options.position = 'right';

    var chart = getChartOptions({
        _valueAxes: [axis, axis1],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);
    layoutManager.applyVerticalAxesLayout([axis, axis1], chart.panes, false);

    //assert
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, axisWidth + multipleAxesSpacing + axisWidth, 0, 0);
    assert.strictEqual(axis.delta['right'], 0);
    assert.strictEqual(axis1.delta['right'], axisWidth + multipleAxesSpacing);
});

QUnit.test("exceedings set stopDrawnAxes", function(assert) {
    //arrange
    var axisRect = {
            width: 1000,
            height: 40,
            x: 200,
            y: canvasTemplate.height - 20
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.stopDrawAxes, "Need stop drawAxes");
});

QUnit.test('Bottom', function(assert) {
    //arrange
    var axisRect = {
            width: 30,
            height: 40,
            x: 200,
            y: canvasTemplate.height - 20
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, 0, 40);
});

QUnit.test('Bottom. empty group', function(assert) {
    //arrange
    var axisRect = {
            width: 30,
            height: 40,
            x: 200,
            y: canvasTemplate.height - 20,
            isEmpty: true
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, 0, 0);
});

QUnit.test('Top only', function(assert) {
    //arrange
    var axisRect = {
            width: 30,
            height: 40,
            x: 200,
            y: -10
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(!axis.shifted, 'shifted');
    var delta = canvasTemplate.top - axisRect.y;

    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, delta, 0);
});

QUnit.test('Top only. empty group', function(assert) {
    var axisRect = {
            width: 30,
            height: 40,
            x: 200,
            y: -10,
            isEmpty: true
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    assert.ok(!axis.shifted, 'shifted');
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, 0, 0);
});

QUnit.test('Bottom and Top', function(assert) {
    //arrange
    var axisRect = {
            width: 30,
            height: canvasTemplate.height + 10,
            x: 200,
            y: -15
        },
        axis = createAxis(axisRect, { position: "left" });

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    var deltaBottom = (canvasTemplate.height - canvasTemplate.bottom) - (axisRect.y + axisRect.height);
    var deltaTop = canvasTemplate.top - axisRect.y;

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, deltaTop, -deltaBottom);
});

QUnit.test('Empty axis', function(assert) {
    //arrange
    var axisRect = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };
    var axis = createAxis(axisRect);

    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert

    assert.ok(!axis.shifted, 'Should not be shifter');

    assert.ok(!layoutManager.requireAxesRedraw, 'No need to redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 0, 0);
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Left only, with padding axis', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" });
    axis.padding = { 'left': 5, 'right': 10 };
    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert


    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 40, 10, 0, 0);
});

QUnit.test('Right only, with padding axis', function(assert) {
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect);
    axis._options.position = 'right';
    axis.padding = { 'left': 5, 'right': 10 };
    var chart = getChartOptions({
        _valueAxes: [axis],
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert


    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 5, 40, 0, 0);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
QUnit.module("Vertical Axes alignment  - Two panes, one axis", { beforeEach: setupTwoVerticalPanes });

QUnit.test('Left only', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" });
    axis.pane = twoPanes[0].name;

    var chart = getChartOptions({
        _valueAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 40, 0, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 40, 0, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Left only. Rotated', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" });
    axis.pane = twoPanes[0].name;

    var chart = getChartOptions({
        rotated: true,
        _valueAxes: [axis],
        panes: twoPanes,
        option: function(arg) {
            return { rotated: true }[arg];
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, true);

    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    assertPaneCanvas(assert, chart.panes[0].canvas, 40, 0, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 0, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Right only', function(assert) {

    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        },
        axis = createAxis(axisRect, { position: "left" });
    axis.pane = twoPanes[0].name;
    axis._options.position = 'right';

    var chart = getChartOptions({
        _valueAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 40, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 40, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Bottom only', function(assert) {
    //arrange
    var axisRect = {
            width: 40,
            height: 40,
            x: 200,
            y: canvasTemplate.height
        },
        axis = createAxis(axisRect, { position: "left" });
    //we use bottom pane to test
    axis.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _valueAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert

    var delta = (canvasTemplate.height - canvasTemplate.bottom) - (axisRect.y + axisRect.height);

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw horizontal axes');

    //only top pane should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 40, 0, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 40, 0, 0, -delta);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Top', function(assert) {
    //arrange
    var axisRect = {
            width: 30,
            height: 40,
            x: 200,
            y: -10
        },
        axis = createAxis(axisRect, { position: "left" });
    axis.pane = twoPanes[0].name;

    var chart = getChartOptions({
        _valueAxes: [axis],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, false);

    //assert

    var delta = canvasTemplate.top - axisRect.y;

    assert.ok(layoutManager.requireAxesRedraw, 'Need to redraw axes');

    //only top pane should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 30, 0, delta, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 30, 0, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Right and Top. Rotated', function(assert) {

    //arrange
    var axisRect = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        },
        axis = createAxis(axisRect);
    axis.pane = twoPanes[1].name;
    axis._options.position = 'right';

    var chart = getChartOptions({
        _valueAxes: [axis],
        panes: twoPanes,
        option: function() {
            return true;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis], chart.panes, true);
    //assert
    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 0, 150, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 40, 150, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
QUnit.module("Vertical Axes alignment  - Two panes, two axes", { beforeEach: setupTwoVerticalPanes });

QUnit.test('Left', function(assert) {
    //arrange
    var axisRect1 = {
            width: 40,
            height: canvasTemplate.height - 200,
            x: -10,
            y: 50
        },
        axisRect2 = {
            width: 50,
            height: 50,
            //more than axisRect1
            x: -50,
            y: 250
        },
        axis1 = createAxis(axisRect1, { position: "left" }),
        axis2 = createAxis(axisRect2, { position: "left" });
    axis1.pane = twoPanes[0].name;
    axis2.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _valueAxes: [axis1, axis2],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);
    //act
    layoutManager.applyVerticalAxesLayout([axis1, axis2], chart.panes, false);

    assert.ok(layoutManager.requireAxesRedraw, 'Redraw horizontal axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 50, 0, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 50, 0, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.test('Right', function(assert) {

    //arrange
    var axisRect1 = {
            width: 50,
            height: canvasTemplate.height - 200,
            x: canvasTemplate.width - 100,
            y: 50
        }, axisRect2 = {
        //more than axis rect 1
            width: 70,
            height: 50,
            x: canvasTemplate.width - 100,
            y: 250
        },
        axis1 = createAxis(axisRect1),
        axis2 = createAxis(axisRect2);
    axis1._options.position = 'right';
    axis2._options.position = 'right';

    axis1.pane = twoPanes[0].name;
    axis2.pane = twoPanes[1].name;

    var chart = getChartOptions({
        _valueAxes: [axis1, axis2],
        panes: twoPanes,
        option: function() {
            return false;
        }
    });
    var layoutManager = createLayoutManager();
    setCanvasValues(canvas);

    //act
    layoutManager.applyVerticalAxesLayout([axis1, axis2], chart.panes, false);

    //assert

    assert.ok(layoutManager.requireAxesRedraw, 'Redraw axes');

    //both panes should change
    assertPaneCanvas(assert, chart.panes[0].canvas, 0, 70, 0, 0);
    assertPaneCanvas(assert, chart.panes[1].canvas, 0, 70, 0, 0);
    //original canvas should not change
    assertOriginalMargin(assert, canvas);
});

QUnit.module("Pie series", {
    beforeEach: setupCanvas
});

QUnit.test('Simple pie. RadiusOuter equal height of canvas', function(assert) {
    var series = getStubSeries("pie"),
        layoutManager = createLayoutManager(),
        inner = 0,
        outer = (canvas.height - canvas.top - canvas.bottom) / 2;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie. RadiusOuter equal width of canvas', function(assert) {
    var series = getStubSeries("pie"),
        layoutManager = createLayoutManager(),
        inner = 0,
        outer = (canvasTemplate.height - canvas.left - canvas.right) / 2;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie - vertical canvas. width and height odd ', function(assert) {
    var series = getStubSeries("doughnut"),
        layoutManager = createLayoutManager(),
        inner = 111,
        outer = 223;

    canvas.width = 517;
    canvas.height = 517;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius less then 0.2', function(assert) {
    var series = getStubSeries("donut", 0),
        layoutManager = createLayoutManager(),
        inner = 33,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius more then 0.8', function(assert) {
    var series = getStubSeries('donut', 10),
        layoutManager = createLayoutManager(),
        inner = 132,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is not number', function(assert) {
    var series = getStubSeries('donut', 'str'),
        layoutManager = createLayoutManager(),
        inner = 82,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is valid number', function(assert) {
    var series = getStubSeries('donut', '0.7'),
        layoutManager = createLayoutManager(),
        inner = 115,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple pie with diameter', function(assert) {
    var series = getStubSeries('pie'),
        layoutManager = createLayoutManager({ piePercentage: 0.4 }),
        inner = 0,
        outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple donut with diameter', function(assert) {
    var series = getStubSeries('donut'),
        layoutManager = createLayoutManager({ piePercentage: 0.4 }),
        inner = 40,
        outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.module("PieChart. Calculate radius charts with labels", {
    beforeEach: setupCanvas
});

QUnit.test("Nearest label topLeft", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 350, y: 100, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label topRight", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 650, y: 100, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 146;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label topCenter", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label CenterLeft", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 300, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label CenterRight", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 650, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label CenterCenter", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 490, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label BottomLeft", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 350, y: 300, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 141;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label BottomRight", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label BottomCenter", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Calculate of nearest label", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true),
            CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Calculate of visible point with label with text", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, false, true),
            CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, false),
            CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("Nearest label BottomLeft label closer then 0.7 R", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 450, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test("piePercentage was not set && hideLabels was set", function(assert) {
    var points = [createFakePointsWithStubLabels({ x: 450, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({}),
        inner = 0,
        outer = 185;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series, true), canvas, inner, outer);
});

QUnit.module("multi series pie", {
    beforeEach: setupCanvas
});

QUnit.test("2 series, labels are fit in canvas", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 129);
    assert.equal(series[0].setVisibleArea.callCount, 0);

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 154);
    assert.equal(series[1].setVisibleArea.callCount, 0);
});

QUnit.test("2 series, labels are not fit in canvas", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 60, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 65, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 80;

    canvas.width = 300;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 80);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 17.25,
        right: 87.25,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 97);
    assert.equal(series[1].setVisibleArea.callCount, 0);
});

QUnit.test("2 series, first series has lables inside", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true, { position: "inside" })],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 0);
    assert.equal(series[0].setVisibleArea.callCount, 0);

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 129);
    assert.equal(series[1].setVisibleArea.callCount, 0);
});

QUnit.test("3 series, labels one of the series have inside position", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true, { position: "inside" })],
        points3 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2, points3]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 129);
    assert.equal(series[0].setVisibleArea.callCount, 0);

    assert.equal(series[1].correctLabelRadius.callCount, 0);
    assert.equal(series[1].setVisibleArea.callCount, 0);

    assert.equal(series[2].correctLabelRadius.callCount, 1);
    assert.equal(series[2].correctLabelRadius.args[0][0], 149);
    assert.equal(series[2].setVisibleArea.callCount, 0);
});

QUnit.test("3 series, labels one of the series have inside position, not fit in canvas", function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 30, height: 10 }, true, true, { position: "inside" })],
        points3 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2, points3]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 80;

    canvas.width = 300;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 80);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 17.25,
        right: 87.25,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 0);
    assert.equal(series[1].setVisibleArea.callCount, 0);

    assert.equal(series[2].correctLabelRadius.callCount, 1);
    assert.equal(series[2].correctLabelRadius.args[0][0], 97);
    assert.equal(series[2].setVisibleArea.callCount, 0);
});

QUnit.module("Layout for equal pie charts", {
    beforeEach: setupCanvas
});

QUnit.test('Pie - inner radius is 0', function(assert) {
    var series = getStubSeries("pie"),
        layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 0,
        radiusOuter: 300
    });
});

QUnit.test('Donut - inner radius is calculated', function(assert) {
    var series = getStubSeries('donut', '0.5'),
        layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 150,
        radiusOuter: 300
    });
});

QUnit.module("check need space panes canvas");

QUnit.test("space sufficiently", function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.equal(updateSide, false);
});

QUnit.test("need width space", function(assert) {
    var panes = [{ canvas: { width: 200, left: 40, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 0,
        width: 20
    });
});

QUnit.test("need height space", function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 0
    });
});

QUnit.test("need both side space", function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test("for several panes", function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
            { canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test("for several rotated panes", function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
            { canvas: { width: 300, left: 145, right: 20, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, true);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 45
    });
});

QUnit.test("space with radius", function(assert) {
    var panes = [{ canvas: { width: 500, left: 110, right: 50, height: 500, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager({ piePercentage: 0.7 });

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, false, { width: 350, height: 350 });

    assert.deepEqual(updateSide, { height: 20, width: 10 });
});

QUnit.module("Layout elements", environment);

QUnit.test("draw elements. [Left Left]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.equal(LE1.draw.callCount, 1);
    assert.equal(LE2.draw.callCount, 1);
    assert.equal(LE1.probeDraw.callCount, 1);
    assert.equal(LE2.probeDraw.callCount, 1);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [90, 100]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [70, 100]);

    assert.deepEqual(LE1.draw.getCall(0).args, [20, 100]);
    assert.deepEqual(LE2.draw.getCall(0).args, [20, 100]);
});

QUnit.test("draw elements. [Top Top]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [100, 90]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [100, 70]);
    assert.deepEqual(LE1.draw.getCall(0).args, [100, 20]);
    assert.deepEqual(LE2.draw.getCall(0).args, [100, 20]);
});

QUnit.test("draw elements. [Top Left]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [100, 90]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [90, 80]);
    assert.deepEqual(LE1.draw.getCall(0).args, [80, 20]);
    assert.deepEqual(LE2.draw.getCall(0).args, [20, 80]);
});

QUnit.test("position elements. [Top Top]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 40, width: 100, height: 60 }),
        my: { horizontal: "center", vertical: "bottom" },
        at: { horizontal: "center", vertical: "top" },
        offset: { horizontal: 0, vertical: -20 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 40, width: 100, height: 60 }),
        my: { horizontal: "center", vertical: "bottom" },
        at: { horizontal: "center", vertical: "top" },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test("draw elements. [Left Left]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 40, y: 0, width: 60, height: 100 }),
        my: { horizontal: "right", vertical: "center" },
        at: { horizontal: "left", vertical: "center" },
        offset: { horizontal: -20, vertical: 0 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 40, y: 0, width: 60, height: 100 }),
        my: { horizontal: "right", vertical: "center" },
        at: { horizontal: "left", vertical: "center" },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test("position elements. [Top Right]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "right", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "right" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 80, height: 80 }),
        my: { horizontal: "center", vertical: "bottom" },
        at: { horizontal: "center", vertical: "top" },
        offset: { horizontal: 0, vertical: 0 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 80, height: 80 }),
        my: { horizontal: "left", vertical: "center" },
        at: { horizontal: "right", vertical: "center" },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test("position elements. [Bottom Right Bottom Right]", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "center", vertical: "bottom" }, cutSide: "vertical", cutLayoutSide: "bottom" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "right", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "right" }),
        LE3 = this.createLayoutElement({ position: { horizontal: "center", vertical: "bottom" }, cutSide: "vertical", cutLayoutSide: "bottom" }),
        LE4 = this.createLayoutElement({ position: { horizontal: "right", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "right" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2, LE3, LE4], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: "center", vertical: "top" },
        at: { horizontal: "center", vertical: "bottom" },
        offset: { horizontal: 0, vertical: 20 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: "left", vertical: "center" },
        at: { horizontal: "right", vertical: "center" },
        offset: { horizontal: 20, vertical: 0 }
    });
    assert.deepEqual(LE3.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: "center", vertical: "top" },
        at: { horizontal: "center", vertical: "bottom" },
        offset: { horizontal: 0, vertical: 0 }
    });
    assert.deepEqual(LE4.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: "left", vertical: "center" },
        at: { horizontal: "right", vertical: "center" },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test("draw elements. getLayoutOptions returns null", function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LE2 = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LM = this.createLayoutManager();

    LE1.getLayoutOptions.returns(null);
    LE2.getLayoutOptions.returns(null);
    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.equal(LE1.draw.callCount, 0);
    assert.equal(LE2.draw.callCount, 0);
    assert.equal(LE1.probeDraw.callCount, 0);
    assert.equal(LE2.probeDraw.callCount, 0);
});

QUnit.test("cut canvas. left", function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: "left", vertical: "center" }, cutSide: "horizontal", cutLayoutSide: "left" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(this.canvas, {
        bottom: 10,
        height: 110,
        left: 20,
        right: 10,
        top: 0,
        width: 110
    });
});

QUnit.test("cut canvas. top", function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: "center", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(this.canvas, {
        bottom: 10,
        height: 110,
        left: 0,
        right: 10,
        top: 20,
        width: 110
    });
});

QUnit.test("draw elements.\"[left top]\"", function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: "left", vertical: "top" }, cutSide: "vertical", cutLayoutSide: "top" }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(LE.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 100, height: 80 }),
        my: { horizontal: "left", vertical: "bottom" },
        at: { horizontal: "left", vertical: "top" },
        offset: { vertical: 0, horizontal: 0 }
    });
});

QUnit.test("call draw axis method", function(assert) {
    var LayoutManager = this.createLayoutManager(),
        spyAxisDrawer = sinon.spy();

    LayoutManager.layoutElements([], this.canvas, spyAxisDrawer, []);

    assert.ok(spyAxisDrawer.calledOnce);
});

QUnit.module("Adaptive layout. without axes", environment);

QUnit.test("Adaptive layout. without axes", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 90 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: "center", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        });

    layoutManager.layoutElements(
            [layoutElement],
        this.canvas,
        noop,
            [{ canvas: this.canvas }],
        false,
            {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
    assert.equal(this.canvas.top, 0);
    assert.equal(this.canvas.bottom, 10);
    assert.equal(this.canvas.left, 0);
    assert.equal(this.canvas.right, 10);
});

QUnit.test("Adaptive layout. Two elements in one direction", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 70 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: "center", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: "center", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        });

    layoutManager.layoutElements(
            [layoutElement1, layoutElement2],
        this.canvas,
        noop,
            [{ canvas: this.canvas }],
        false,
            {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.equal(this.canvas.top, 20);
});

QUnit.test("Adaptive layout. horizontal direction", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 90, height: 80 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "horizontal",
            cutLayoutSide: "left"
        });

    layoutManager.layoutElements(
            [layoutElement],
        this.canvas,
        noop,
            [{ canvas: this.canvas }],
        false,
            {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
});

QUnit.test("Adaptive layout. perpendicular direction", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 90 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "horizontal",
            cutLayoutSide: "left"
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        });

    layoutManager.layoutElements(
            [layoutElement1, layoutElement2],
        this.canvas,
        noop,
            [{ canvas: this.canvas }],
        false,
            {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.equal(this.canvas.left, 20);
});

QUnit.module("Adaptive layout. with axes", environment);

QUnit.test("Horizontal element", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 80 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "horizontal",
            cutLayoutSide: "left"
        }),
        axesDrawer = this.getAxesDrawer({ top: 0, bottom: 0, left: 10, right: 0 });

    layoutManager.layoutElements(
            [layoutElement],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
    assert.equal(this.canvas.left, 10);
});

QUnit.test("Two horizontal elements", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 60, height: 80 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "horizontal",
            cutLayoutSide: "left"
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "horizontal",
            cutLayoutSide: "left"
        }),
        axesDrawer = this.getAxesDrawer({ top: 0, bottom: 0, left: 10, right: 0 });

    layoutManager.layoutElements(
            [layoutElement1, layoutElement2],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.deepEqual(layoutElement1.position.lastCall.args[0].offset, { horizontal: 0, vertical: 0 });
    assert.equal(this.canvas.left, 30);
});

QUnit.test("Vertical element", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 80 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        }),
        axesDrawer = this.getAxesDrawer({ top: 10, bottom: 0, left: 0, right: 0 });

    layoutManager.layoutElements(
            [layoutElement],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
    assert.equal(this.canvas.top, 10);
});

QUnit.test("Two vertical elements", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 60 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: "left", vertical: "top" },
            cutSide: "vertical",
            cutLayoutSide: "top"
        }),
        axesDrawer = this.getAxesDrawer({ top: 10, bottom: 0, left: 0, right: 0 });

    layoutManager.layoutElements(
            [layoutElement1, layoutElement2],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.equal(this.canvas.top, 30);
});

QUnit.test("Update horizontal axes", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 100 }),
        axis = this.createAxis(),
        axesDrawer = this.getAxesDrawer({ top: 10, bottom: 0, left: 0, right: 0 });

    layoutManager.layoutElements(
            [],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            { horizontalAxes: [axis] }
    );

    assert.ok(axis.updateSize.calledTwice);
});

QUnit.test("Update vertical axes", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 100, height: 80 }),
        axis = this.createAxis(),
        axesDrawer = this.getAxesDrawer({ top: 0, bottom: 0, left: 10, right: 0 });

    layoutManager.layoutElements(
            [],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false,
            { verticalAxes: [axis] }
    );

    assert.ok(axis.updateSize.calledTwice);
});

QUnit.test("Redraw Axis", function(assert) {
    var layoutManager = this.createLayoutManager({ width: 100, height: 80 }),
        axis = this.createAxis(),
        panes = this.getLayoutTargets(),
        axesDrawer = this.getAxesDrawer({ top: 0, bottom: 0, left: 10, right: 0 });

    layoutManager.layoutElements(
            [],
        this.canvas,
        axesDrawer,
        panes,
        false,
            { verticalAxes: [axis] }
    );

    assert.ok(axesDrawer.calledTwice);
    assert.deepEqual(axesDrawer.getCall(0).args, [], "first call");
    assert.deepEqual(axesDrawer.getCall(1).args, [true], "second call");
});
