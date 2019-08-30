var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    axisModule = require("viz/axes/base_axis"),
    Crosshair = require("viz/chart_components/crosshair").Crosshair,
    Axis = vizMocks.stubClass(axisModule.Axis),
    environment = {
        beforeEach: function() {
            this.renderer = new vizMocks.Renderer();
            this.renderer.bBoxTemplate = { y: 10, height: 20, x: 30, width: 40 };
            this.canvas = {
                width: 800,
                height: 800,
                left: 80,
                right: 90,
                top: 10,
                bottom: 80
            };
            this.crosshairGroup = this.renderer.g();
            this.renderer.g.reset();
            this.panes = [{
                coords: {
                    width: 800,
                    height: 800,
                    left: 80,
                    right: 720,
                    top: 10,
                    bottom: 790
                },
                clipRect: { id: "clipRect" }
            }];
        },
        createAxis: function(axisOptions) {
            var axis = new Axis();

            axis.stub("getOptions").returns({ position: axisOptions.position });
            axis.stub("getTranslator").returns({ getBusinessRange: function() { return { isEmpty: function() { return axisOptions.emptyRange; } }; } });
            this.getFormattedValue = sinon.spy(function(value, format) {
                return value + "_formatted";
            });

            axis.getFormattedValue = this.getFormattedValue;
            axis.stub("getLabelsPosition").returns(30);
            return axis;
        },
        createCrosshair: function(options, axisOptions) {
            var valAxis = this.createAxis(axisOptions),
                argAxis = this.createAxis(axisOptions);

            valAxis.name = "defaultAxisName";
            this.axes = [[argAxis], [valAxis]];

            this.options = $.extend(true, {
                enabled: true,
                width: 1,
                color: 'yellow',
                opacity: 1,
                dashStyle: 'solid',
                horizontalLine: {
                    visible: true
                },
                verticalLine: {
                    visible: true
                }
            }, options);
            return new Crosshair(this.renderer, this.options, { canvas: this.canvas, axes: this.axes, panes: this.panes }, this.crosshairGroup);
        }
    };

function checkLine(assert, createLine, x1, y1, x2, y2, attributes) {
    assert.equal(createLine.args[0][0], x1, "x1");
    assert.equal(createLine.args[0][1], y1, "y1");
    assert.equal(createLine.args[0][2], x2, "x2");
    assert.equal(createLine.args[0][3], y2, "y2");
    assert.equal(createLine.args[1], "line");
    assert.deepEqual(createLine.returnValue.attr.getCall(0).args[0], attributes, "attributes");
    assert.equal(createLine.returnValue.sharp.callCount, 1);
    assert.ok(createLine.returnValue.sharp.lastCall.calledAfter(createLine.returnValue.attr.lastCall));
}

function checkText(assert, createLabel, text, x, y, attributes, fontStyles) {
    assert.ok(createLabel.calledOnce, "text was created");
    assert.equal(createLabel.lastCall.args[0], text, "text");
    assert.equal(createLabel.lastCall.args[1], x, "x");
    assert.equal(createLabel.lastCall.args[2], y, "y");
    assert.deepEqual(createLabel.lastCall.returnValue.attr.firstCall.args[0], attributes, "attributes");
    assert.deepEqual(createLabel.lastCall.returnValue.css.firstCall.args[0], fontStyles, "font styles");
}

function checkRect(assert, createRect, x, y, width, height, attributes) {
    assert.ok(createRect.calledOnce, "rect was created");
    assert.equal(createRect.lastCall.args[0], x, "x");
    assert.equal(createRect.lastCall.args[1], y, "y");
    assert.equal(createRect.lastCall.args[2], width, "width");
    assert.equal(createRect.lastCall.args[3], height, "height");
    assert.deepEqual(createRect.lastCall.returnValue.attr.firstCall.args[0], attributes, "attributes");
}

function checkCanvas(assert, crosshair, canvas) {
    assert.equal(crosshair._canvas.top, canvas.top);
    assert.equal(crosshair._canvas.left, canvas.left);
    assert.equal(crosshair._canvas.right, canvas.width - canvas.right);
    assert.equal(crosshair._canvas.bottom, canvas.height - canvas.bottom);
}

function getDataForShowCrosshair(pointData, pointRadius) {
    return {
        point: {
            getCrosshairData: sinon.spy(function() {
                return pointData;
            }),
            getPointRadius: sinon.spy(function() {
                return pointRadius;
            })
        }
    };
}

QUnit.module("Crosshair", environment);

QUnit.test("Create", function(assert) {
    var crosshair = this.createCrosshair({}, {});

    assert.ok(crosshair);
    assert.deepEqual(this.renderer, this.renderer);
    assert.deepEqual(crosshair._crosshairGroup, this.crosshairGroup);
    assert.deepEqual(crosshair._options.horizontal, {
        visible: true,
        line: {
            "stroke-width": 1,
            stroke: "yellow",
            opacity: 1,
            dashStyle: 'solid',
            "stroke-linecap": "butt"
        },
        label: {}
    });
    assert.deepEqual(crosshair._options.vertical, {
        visible: true,
        line: {
            "stroke-width": 1,
            stroke: "yellow",
            opacity: 1,
            dashStyle: 'solid',
            "stroke-linecap": "butt"
        },
        label: {}
    });
    checkCanvas(assert, crosshair, this.canvas);
    assert.deepEqual(crosshair._axes, this.axes);
    assert.deepEqual(crosshair._panes, this.panes);
});

QUnit.test("update", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    this.options.color = "blue";
    var canvas = { width: 400, height: 300, left: 11, right: 12, top: 13, bottom: 14 },
        panes = "new panes",
        axes = "new axes";

    crosshair.update(this.options, { canvas: canvas, axes: axes, panes: panes });

    assert.ok(crosshair);
    assert.deepEqual(this.renderer, this.renderer);
    assert.deepEqual(crosshair._crosshairGroup, this.crosshairGroup);
    assert.deepEqual(crosshair._options.horizontal, {
        visible: true,
        line: {
            "stroke-width": 1,
            stroke: "blue",
            opacity: 1,
            dashStyle: 'solid',
            "stroke-linecap": "butt"
        },
        label: {}
    });
    assert.deepEqual(crosshair._options.vertical, {
        visible: true,
        line: {
            "stroke-width": 1,
            stroke: "blue",
            opacity: 1,
            dashStyle: 'solid',
            "stroke-linecap": "butt"
        },
        label: {}
    });
    checkCanvas(assert, crosshair, canvas);
    assert.deepEqual(crosshair._axes, axes);
    assert.deepEqual(crosshair._panes, panes);
});

QUnit.test("render", function(assert) {
    var crosshair = this.createCrosshair({}, {}),
        attributes = { stroke: 'yellow', "stroke-width": 1, opacity: 1, dashStyle: 'solid', "stroke-linecap": "butt" /* "square" */ },
        circleOptions = { stroke: attributes.stroke, "stroke-width": attributes["stroke-width"], dashStyle: attributes.dashStyle, opacity: attributes.opacity };

    // act
    crosshair.render();
    // assert
    assert.ok(crosshair);
    assert.equal(crosshair._horizontal.lines.length, 2);
    assert.equal(crosshair._vertical.lines.length, 2);
    assert.ok(crosshair._verticalGroup);
    assert.ok(crosshair._horizontalGroup);
    assert.ok(crosshair._circle);

    assert.equal(this.renderer.path.callCount, 4, "lines ware created");

    checkLine(assert, this.renderer.path.firstCall, 80, 10, 80, 10, attributes);
    checkLine(assert, this.renderer.path.secondCall, 80, 10, 80, 10, attributes);
    checkLine(assert, this.renderer.path.thirdCall, 80, 10, 80, 10, attributes);
    checkLine(assert, this.renderer.path.lastCall, 80, 10, 80, 10, attributes);

    assert.equal(this.renderer.circle.lastCall.args[0], 80);
    assert.equal(this.renderer.circle.lastCall.args[1], 10);
    assert.equal(this.renderer.circle.lastCall.args[2], 0);
    assert.ok(this.renderer.circle.lastCall.returnValue.append.calledBefore(this.renderer.g.lastCall.returnValue.append));
    assert.deepEqual(this.renderer.circle.lastCall.returnValue.attr.getCall(0).args[0], circleOptions);
    assert.equal(this.crosshairGroup.attr.callCount, 1);
    assert.equal(this.crosshairGroup.attr.firstCall.args[0].visibility, "hidden");
});

QUnit.test("render label", function(assert) {
    var options = { horizontalLine: { label: { visible: true, font: { size: 14, color: "red" }, backgroundColor: "blue", cssClass: "crosshair_class" } } };
    var crosshair = this.createCrosshair(options, {});
    // act
    crosshair.render();
    // assert
    checkText(assert, this.renderer.text, "0", 0, 0, { align: "right", "class": "crosshair_class" }, { 'font-size': 14, fill: "red" });
    checkRect(assert, this.renderer.rect, 0, 0, 0, 0, { fill: "blue" });

    assert.ok(this.renderer.text.lastCall.returnValue.attr.called);
    assert.ok(this.renderer.text.lastCall.returnValue.append.calledAfter(this.renderer.rect.lastCall.returnValue.append));
    assert.ok(this.renderer.rect.lastCall.returnValue.append.calledAfter(this.renderer.path.lastCall.returnValue.append));
});

QUnit.test("render label, position of axis is right", function(assert) {
    var options = { horizontalLine: { label: { visible: true, font: { size: 14, color: "red" }, backgroundColor: "blue" } } };
    var crosshair = this.createCrosshair(options, { position: "right" });

    // act
    crosshair.render();
    // assert
    assert.ok(crosshair);
    checkText(assert, this.renderer.text, "0", 0, 0, { align: "left", "class": undefined }, { 'font-size': 14, fill: "red" });
    checkRect(assert, this.renderer.rect, 0, 0, 0, 0, { fill: "blue" });
});

QUnit.test("render with label, emptyRange", function(assert) {
    var options = { horizontalLine: { label: { visible: true, font: { size: 14, color: "red" }, backgroundColor: "blue" } } };
    var crosshair = this.createCrosshair(options, { emptyRange: true });

    // act
    crosshair.render();
    // assert
    assert.ok(crosshair);
    assert.ok(!this.renderer.stub("text").called);
    assert.ok(!this.renderer.stub("rect").called);
    assert.ok(!crosshair._horizontal.labels[0]);
    assert.ok(!crosshair._horizontal.labels[0]);
});

QUnit.test("show", function(assert) {
    var crosshair = this.createCrosshair({}, {}),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 720, xValue: "x100", yValue: "y30", axis: "defaultAxisName" }, 6);

    dataForShow.x = "someX";
    dataForShow.y = "someY";
    // act
    crosshair.render();
    crosshair.show(dataForShow);
    // assert
    assert.equal(dataForShow.point.getCrosshairData.callCount, 1);
    assert.equal(dataForShow.point.getPointRadius.callCount, 1);
    assert.deepEqual(dataForShow.point.getCrosshairData.firstCall.args, ["someX", "someY"]);
    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });

    assert.equal(crosshair._circle.attr.callCount, 2);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].r, 9);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cx, 100);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cy, 720);
    assert.equal(crosshair._circle.attr.getCall(1).args[0]["clip-path"], "clipRect");

    assert.equal(crosshair._horizontal.lines[0].attr.callCount, 2);
    assert.deepEqual(crosshair._horizontal.lines[0].attr.getCall(1).args[0].points, [80, 10, 91, 10]);
    assert.deepEqual(crosshair._horizontal.lines[1].attr.getCall(1).args[0].points, [109, 10, 710, 10]);

    assert.equal(crosshair._vertical.lines[0].attr.callCount, 2);
    assert.deepEqual(crosshair._vertical.lines[0].attr.getCall(1).args[0].points, [80, 10, 80, 711]);
    assert.deepEqual(crosshair._vertical.lines[1].attr.getCall(1).args[0].points, [80, 729, 80, 729]);

    assert.equal(this.renderer.path.getCall(0).returnValue.sharp.callCount, 2);
    assert.equal(this.renderer.path.getCall(2).returnValue.sharp.callCount, 2);
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.sharp.secondCall.args, ["h", 1]);
    assert.deepEqual(this.renderer.path.getCall(1).returnValue.sharp.secondCall.args, ["h", 1]);
    assert.deepEqual(this.renderer.path.getCall(2).returnValue.sharp.secondCall.args, ["v", -1]);
    assert.deepEqual(this.renderer.path.getCall(3).returnValue.sharp.secondCall.args, ["v", -1]);
});

QUnit.test("T255239. Show when vertical and horizontal lines are invisible", function(assert) {
    var crosshair = this.createCrosshair({
        horizontalLine: { visible: false },
        verticalLine: { visible: false }
    }, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 100, y: 30, xValue: "x100", yValue: "y30", axis: "defaultAxisName" }, 6));
    // assert
    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });

    assert.equal(crosshair._circle.attr.callCount, 2);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].r, 9);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cx, 100);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cy, 30);
    assert.equal(crosshair._circle.attr.getCall(1).args[0]["clip-path"], "clipRect");
});

QUnit.test("show, coordinates out of the pane", function(assert) {
    this.panes[0].coords = { left: 150, right: 720, top: 10, bottom: 790 };
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 100, y: 30, xValue: "x100", yValue: "y30", axis: "defaultAxisName" }, 6));
    // assert
    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });

    assert.equal(crosshair._circle.attr.callCount, 2);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].r, 9);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cx, 100);
    assert.equal(crosshair._circle.attr.getCall(1).args[0].cy, 30);
    assert.equal(crosshair._circle.attr.getCall(1).args[0]["clip-path"], null);

    assert.equal(crosshair._horizontal.lines[0].attr.callCount, 2);
    assert.deepEqual(crosshair._horizontal.lines[0].attr.getCall(1).args[0].points, [80, 10, 91, 10]);
    assert.deepEqual(crosshair._horizontal.lines[1].attr.getCall(1).args[0].points, [109, 10, 710, 10]);

    assert.equal(crosshair._vertical.lines[0].attr.callCount, 2);
    assert.deepEqual(crosshair._vertical.lines[0].attr.getCall(1).args[0].points, [80, 10, 80, 21]);
    assert.deepEqual(crosshair._vertical.lines[1].attr.getCall(1).args[0].points, [80, 39, 80, 720]);
});

QUnit.test("show label", function(assert) {
    this.renderer.bBoxTemplate.width = 5;
    var crosshair = this.createCrosshair({ horizontalLine: { label: { visible: true } } }, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 100.9, y: 30.4, xValue: "x100", yValue: "y30", axis: "defaultAxisName" }));
    // assert
    assert.equal(crosshair._horizontal.labels[0].text.attr.callCount, 3);
    assert.deepEqual(crosshair._horizontal.labels[0].text.attr.getCall(1).args[0], { text: "y30_formatted", x: 30, y: 10 });
    assert.deepEqual(crosshair._horizontal.labels[0].text.attr.getCall(2).args[0], { x: 30, y: 0 });

    assert.equal(crosshair._horizontal.labels[0].background.attr.callCount, 2);
    assert.deepEqual(crosshair._horizontal.labels[0].background.attr.lastCall.args[0], { x: 22, y: 6, width: 21, height: 28 });
    assert.deepEqual(crosshair._horizontalGroup.attr.lastCall.args[0], { translateY: 20 });
});

QUnit.test("show not in canvas, left", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 10, y: 30, xValue: "x10", yValue: "y30", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "hidden" });
});

QUnit.test("show not in canvas, right", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 730, y: 30, xValue: "x730", yValue: "y30", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "hidden" });
});

QUnit.test("show not in canvas, top", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 100, y: 3, xValue: "x100", yValue: "y3", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "hidden" });
});

QUnit.test("show not in canvas, bottom", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 200, y: 750, xValue: "x200", yValue: "y750", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "hidden" });
});

QUnit.test("show in canvas, left", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 80, y: 30, xValue: "x80", yValue: "y30", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });
});

QUnit.test("show in canvas, right", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 710, y: 30, xValue: "x710", yValue: "y30", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });
});

QUnit.test("show in canvas, top", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 100, y: 10, xValue: "x100", yValue: "y10", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });
});

QUnit.test("show in canvas, bottom", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 200, y: 720, xValue: "x200", yValue: "y720", axis: "defaultAxisName" }));

    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });
});

QUnit.test("show very long label out of the canvas. left position", function(assert) {
    var options = { horizontalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "left" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.x = 3;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].x, 35);
});

QUnit.test("show very long label out of the canvas. right position", function(assert) {
    var options = { horizontalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "right" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.x = 760;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].x, 22);
});

QUnit.test("show big label in height out of the top canvas", function(assert) {
    var options = { horizontalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "left" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.y = 5;
    this.renderer.bBoxTemplate.height = 100;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].y, -11);
});

QUnit.test("show big label in height out of the bottom canvas", function(assert) {
    var options = { horizontalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "left" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 700, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.y = 5;
    this.renderer.bBoxTemplate.height = 200;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].y, -89);
});

QUnit.test('label formatting', function(assert) {
    var crosshair = this.createCrosshair({ label: { format: 'someFormat', precision: 'somePrecision', customizeText: "customize_text", visible: true } }, {}),
        dataForCrosshair = getDataForShowCrosshair({ x: 120, y: 120, xValue: "200", yValue: "720", axis: "defaultAxisName" });

    crosshair.render();
    // act
    crosshair.show(dataForCrosshair);

    // assert
    assert.equal(this.axes[0][0].getFormattedValue.callCount, 1, 'format call count. arg axis');
    assert.equal(this.axes[1][0].getFormattedValue.callCount, 1, 'format call count. val axis');
    assert.deepEqual(this.axes[0][0].getFormattedValue.getCall(0).args, ['200', {
        format: 'someFormat', precision: 'somePrecision',
        customizeText: "customize_text", visible: true
    }, dataForCrosshair.point]);

    assert.deepEqual(this.axes[1][0].getFormattedValue.getCall(0).args, ['720', {
        format: 'someFormat', precision: 'somePrecision',
        customizeText: "customize_text", visible: true
    }, dataForCrosshair.point]);

    assert.deepEqual(this.renderer.text.firstCall.returnValue.attr.getCall(1).args[0], { text: '200_formatted', x: 80, y: 30 });
    assert.deepEqual(this.renderer.text.secondCall.returnValue.attr.getCall(1).args[0], { text: '720_formatted', x: 30, y: 10 });
});

QUnit.module("Crosshair, vertical line", environment);

QUnit.test("render label", function(assert) {
    var options = { verticalLine: { label: { visible: true, font: { size: 14, color: "red" }, backgroundColor: "blue" } } };
    var crosshair = this.createCrosshair(options, { position: "top" });

    // act
    crosshair.render();
    // assert
    checkText(assert, this.renderer.text, "0", 0, 0, { align: "center", "class": undefined }, { 'font-size': 14, fill: "red" });
    checkRect(assert, this.renderer.rect, 0, 0, 0, 0, { fill: "blue" });
    assert.ok(this.renderer.text.lastCall.returnValue.attr.called);
    assert.ok(this.renderer.text.lastCall.returnValue.append.calledAfter(this.renderer.rect.lastCall.returnValue.append));
    assert.ok(this.renderer.rect.lastCall.returnValue.append.calledAfter(this.renderer.path.firstCall.returnValue.append));
});

QUnit.test("render with label, position is bottom", function(assert) {
    var options = { verticalLine: { label: { visible: true, font: { size: 14, color: "red" }, backgroundColor: "blue" } } };
    var crosshair = this.createCrosshair(options, { position: "bottom" });

    // act
    crosshair.render();
    // assert
    checkText(assert, this.renderer.text, "0", 0, 0, { align: "center", "class": undefined }, { 'font-size': 14, fill: "red" });
    checkRect(assert, this.renderer.rect, 0, 0, 0, 0, { fill: "blue" });
});

QUnit.test("show label", function(assert) {
    var crosshair = this.createCrosshair({ verticalLine: { label: { visible: true } } }, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 110.9, y: 50.4, xValue: "x110", yValue: "y50", axis: "defaultAxisName" }));
    // assert
    assert.equal(crosshair._vertical.labels[0].text.attr.callCount, 3);
    assert.deepEqual(crosshair._vertical.labels[0].text.attr.getCall(1).args[0], { text: "x110_formatted", x: 80, y: 30 });
    assert.deepEqual(crosshair._vertical.labels[0].text.attr.getCall(2).args[0], { x: 80, y: 30 });

    assert.equal(crosshair._vertical.labels[0].background.attr.callCount, 2);
    assert.deepEqual(crosshair._vertical.labels[0].background.attr.lastCall.args[0], { x: 22, y: 6, width: 56, height: 28 });
    assert.deepEqual(crosshair._verticalGroup.attr.lastCall.args[0], { translateX: 30 });
});

QUnit.test("show label, null text", function(assert) {
    var crosshair = this.createCrosshair({ verticalLine: { label: { visible: true } } }, {});
    this.axes[0][0].getFormattedValue = function() { return null; };
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 110, y: 50, xValue: "x110", yValue: "y50", axis: "defaultAxisName" }));
    // assert
    assert.equal(crosshair._vertical.labels[0].text.attr.callCount, 2);
    assert.deepEqual(crosshair._vertical.labels[0].text.attr.lastCall.args[0], { text: "" });
    assert.equal(crosshair._vertical.labels[0].background.attr.callCount, 2);
    assert.deepEqual(crosshair._vertical.labels[0].background.attr.lastCall.args[0], { x: 0, y: 0, width: 0, height: 0 });
});

QUnit.test("show very big label out of the canvas. top position", function(assert) {
    var options = { verticalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "top" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.y = 3;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].y, 31);
});

QUnit.test("show very big label out of the canvas. bottom position", function(assert) {
    var options = { verticalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "bottom" }),
        dataForShow = getDataForShowCrosshair({ x: 100, y: 30, axis: "defaultAxisName" }, 6);

    this.axes[0][0].stub("getLabelsPosition").returns(780);
    this.renderer.bBoxTemplate.y = 780;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].y, 776);
});

QUnit.test("show very long label out of the left canvas", function(assert) {
    var options = { verticalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "top" }),
        dataForShow = getDataForShowCrosshair({ x: 80, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.width = 200;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].x, 108);
});

QUnit.test("show very long label out of the right canvas", function(assert) {
    var options = { verticalLine: { label: { visible: true } } },
        crosshair = this.createCrosshair(options, { position: "top" }),
        dataForShow = getDataForShowCrosshair({ x: 700, y: 30, axis: "defaultAxisName" }, 6);

    this.renderer.bBoxTemplate.width = 200;

    crosshair.render();
    crosshair.show(dataForShow);

    assert.equal(this.renderer.text.lastCall.returnValue.attr.lastCall.args[0].x, 72);
});

QUnit.module("show - hide", environment);

QUnit.test("show", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 110, y: 50, xValue: "x110", yValue: "y50", axis: "defaultAxisName" }));
    // assert
    assert.equal(crosshair._crosshairGroup.attr.callCount, 2);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(1).args[0], { visibility: "visible" });
});

QUnit.test("hide", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.render();
    crosshair.show(getDataForShowCrosshair({ x: 110, y: 50, xValue: "x110", yValue: "y50", axis: "defaultAxisName" }));
    crosshair.hide();
    // assert
    assert.equal(crosshair._crosshairGroup.attr.callCount, 3);
    assert.deepEqual(crosshair._crosshairGroup.attr.getCall(2).args[0], { visibility: "hidden" });
});

QUnit.module("Disposing", environment);

QUnit.test("Dispose", function(assert) {
    var crosshair = this.createCrosshair({}, {});
    // act
    crosshair.dispose();
    // assert
    assert.ok(crosshair);
    assert.deepEqual(crosshair._renderer, null);
    assert.deepEqual(crosshair._crosshairGroup, null);
    assert.deepEqual(crosshair._options, null);
    assert.deepEqual(crosshair._canvas, null);
    assert.deepEqual(crosshair._axes, null);
    assert.deepEqual(crosshair._horizontalGroup, null);
    assert.deepEqual(crosshair._verticalGroup, null);
    assert.deepEqual(crosshair._horizontal, null);
    assert.deepEqual(crosshair._vertical, null);
    assert.deepEqual(crosshair._circle, null);
});
