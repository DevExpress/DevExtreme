"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    createSankey = common.createSankey,
    environment = common.environment;

QUnit.module("Node labels", environment);

QUnit.test("Create label group on initialization", function(assert) {
    createSankey({});

    var labelsGroup = this.labelsGroup();
    assert.equal(labelsGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(labelsGroup.attr.lastCall.args[0].class, "dxs-labels");
});

QUnit.test("Create labels", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        }
    });
    var labelsGroup = this.labelsGroup(),
        labels = this.labels(),
        that = this;

    assert.ok(labelsGroup.clear.called);
    assert.equal(labels.length, 3);
    assert.equal(that.renderer.text.callCount, 3);

    labels.forEach(function(label) {
        // label.attr.firstCall.args // attrs of label
        assert.equal(label.renderer, that.renderer, 'renderer');
        assert.equal(label.append.callCount, 1, 'appended once');
        assert.equal(label.attr.callCount, 2, 'Two calls: setting all attrs and adjusting y coordinate');
    });

    assert.equal(that.renderer.text.getCall(0).args[0], 'A');
    assert.equal(that.renderer.text.getCall(1).args[0], 'B');
    assert.equal(that.renderer.text.getCall(2).args[0], 'Z');
});

QUnit.test("If no labels present", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: false
        }
    });
    var labelsGroup = this.labelsGroup(),
        labels = this.labels();

    assert.ok(labelsGroup.clear.called);
    assert.equal(labels.length, 0);
});

QUnit.test("Create labels with styles", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true,
            border: {
                visible: true,
                color: "white",
                width: 10,
                opacity: 0.2
            },
            font: {
                color: "red",
                weight: 400,
                size: 26
            },
        }
    });
    var labels = this.labels(),
        css = labels[0].css.firstCall.args[0],
        attrs = labels[0].attr.firstCall.args[0];

    assert.deepEqual(css, {
        fill: "red",
        cursor: "default",
        "font-family": "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
        "font-size": 26,
        "font-weight": 400
    });
    assert.equal(attrs.stroke, "white");
    assert.equal(attrs["stroke-opacity"], 0.2);
    assert.equal(attrs["stroke-width"], 10);
});

QUnit.test("Create labels with styles and invisible borders", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true,
            border: {
                visible: false,
                color: "white",
                width: 10,
                opacity: 0.2
            }
        }
    });
    var labels = this.labels(),
        attrs = labels[0].attr.firstCall.args[0];

    assert.equal(attrs["stroke-width"], 0);
});

QUnit.test("Label color if colorMode is 'node'", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            colorMode: 'node'
        }
    });
    var labels = this.labels(),
        nodes = this.nodes();

    assert.equal(nodes[0].attr.lastCall.args[0].fill, labels[0].css.firstCall.args[0].fill);
    assert.equal(nodes[1].attr.lastCall.args[0].fill, labels[1].css.firstCall.args[0].fill);
    assert.equal(nodes[2].attr.lastCall.args[0].fill, labels[2].css.firstCall.args[0].fill);
});

/*
QUnit.test("Default label alignment for inside labels is center", function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 2 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside"
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, "center", "text alignment");
});

QUnit.test("Default label alignment for outside labels is left", function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 2 }],
        valueField: "value",
        label: {
            visible: true,
            position: "columns"
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, "left", "text alignment");
});

QUnit.test("Default label alignment for outside labels is right if rtl enabled", function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 2 }],
        valueField: "value",
        rtlEnabled: true,
        label: {
            visible: true,
            position: "columns"
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, "right", "text alignment");
});

QUnit.test("Do not create labels if label.visible set to false", function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        valueField: "value",
        label: {
            visible: false
        }
    });
    var labelsGroup = this.labelGroup();

    assert.ok(labelsGroup.clear.called);
    assert.equal(labelModule.Label.callCount, 0, "no one label is created");
});

QUnit.test("Hide labels for zero values id showForZeroValues is set to false", function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    stubAlgorithm.normalizeValues.returns([1, 1]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 0 }],
        valueField: "value",
        label: {
            visible: true,
            showForZeroValues: false
        }
    });

    assert.equal(labelModule.Label.callCount, 2);
    assert.ok(!labelModule.Label.getCall(0).returnValue.stub("draw").calledWith(false));
    assert.ok(labelModule.Label.getCall(1).returnValue.stub("draw").calledWith(false));
});

QUnit.test("Reserve space for labels if position outside", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 680, 600]);
});

QUnit.test("Reserve space for labels if position outside and horizontal alignment is left", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [120, 0, 800, 600]);
});

QUnit.test("Reserve space for labels if position columns", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 665, 600]);
});

QUnit.test("Use columns position if position value is not accepted", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            horizontalOffset: 15,
            position: "not accepted value",
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 665, 600]);
});

QUnit.test("Do not reserve space for labels if position inside", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
});

QUnit.test("Relayout labels after dataSource changed", function(assert) {
    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    funnel.option({
        dataSource: [{ value: 2 }]
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 735, 600]);
});

QUnit.test("Place labels with outside position", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5],
        [0, 0.6, 1, 0.8]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [360, 330]);

    label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 510]);
});

QUnit.test("Place labels with outside position. inverted", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        label: {
            visible: true,
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 590]);
});

QUnit.test("Place labels with outside position and left horizontal alignment", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.deepEqual(label.shift.args[0], [0, 30]);
});

QUnit.test("Place labels with outside position. horizontalAlignment left. inverted", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        label: {
            visible: true,
            horizontalAlignment: "left",
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [0, 590]);
});

QUnit.test("Place labels with inside position", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 175]);
});

QUnit.test("Place labels with inside position, figure is hexagon", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 1, 1, 0, 1, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 325]);
});

QUnit.test("Place labels with columns position", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 30]);
    assert.deepEqual(label2.shift.args[0], [700, 30]);
});

QUnit.test("Place labels with columns position. inverted", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 590]);
});

QUnit.test("Place labels with columns position. rtl", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        rtlEnabled: true,
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 30]);
    assert.deepEqual(label2.shift.args[0], [755, 30]);
});

QUnit.test("Place labels with columns position and left horizontal alignment", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            horizontalAlignment: "left",
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 30]);
    assert.deepEqual(label2.shift.args[0], [0, 30]);
});

QUnit.test("Place labels with columns position. horizontalAlignment left inverted", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        label: {
            visible: true,
            position: "columns",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [0, 590]);
});

QUnit.test("Place labels with columns position and left horizontal alignment. rtl", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        rtlEnabled: true,
        label: {
            visible: true,
            horizontalAlignment: "left",
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 30]);
    assert.deepEqual(label2.shift.args[0], [55, 30]);
});

QUnit.test("Connector strategy", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outsiDe",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [679, 0], "center");
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [679, 0], "figure point");
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 20,
        width: 40
    }), [[ 6, 15 ], [ 46, 15 ], [ 46, 35 ], [ 6, 35 ]], "prepareLabelPoints");
    assert.equal(connectorStrategy.isLabelInside(), false, "isLabelInside");
});

QUnit.test("Connector strategy. left horizontalAlignment", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [121, 0], "center");
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [121, 0], "figure point");
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 20,
        width: 40
    }), [ [ 14, 15 ], [ 54, 15 ], [ 54, 35 ], [ 14, 35 ]], "prepareLabelPoints");
});


QUnit.test("Connector strategy. inverted", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [121, 599], "center");
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 20,
        width: 40
    }), 	[ [ 14, 14 ], [ 54, 14 ], [ 54, 34 ], [ 14, 34 ]], "prepareLabelPoints");
});

QUnit.test("Place labels and connector, item border width > 0, horizontalAlignment is left", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [138, 31]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [259, 1], "figure point");
});

QUnit.test("Place labels and connector, item border width > 0, horizontalAlignment is right", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "right",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [562, 31]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [541, 1], "figure point");
});

QUnit.test("Place labels and connector, item border width > 0, horizontalAlignment is left, inverted", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        item: { border: { visible: true, width: 2 } },
        inverted: true,
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [138, 590]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [259, 598], "figure point");
});

QUnit.test("Place labels and connector, item border width > 0, horizontalAlignment is right, inverted", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        inverted: true,
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "right",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [562, 590]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [541, 598], "figure point");
});

QUnit.test("change label option", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    this.labelGroup().clear.reset();

    funnel.option({
        label: {
            position: "inside"
        }
    });

    assert.equal(this.labelGroup().clear.callCount, 1);
    assert.equal(labelModule.Label.callCount, 2);

    var label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [392.5, 175]);
});
*/


QUnit.module("Node labels. Adaptive layout", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $("#test-container").css({
            width: 300
        });
    }
}));

QUnit.test("Shown labels if container size bigger than adaptiveLayout", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: false
        }
    });

    assert.ok(this.labelsGroup().clear.called);
    assert.equal(this.labels().length, this.nodes().length);
});

QUnit.test("Hide labels if container size smaller than adaptiveLayout", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        },
        adaptiveLayout: {
            width: 600,
            keepLabels: false
        }
    });

    assert.ok(this.labelsGroup().clear.called);
    assert.equal(this.labels().length, 0);
});

QUnit.test("Show labels if keepLabels is true and container size is smaller than adaptiveLayout", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        },
        adaptiveLayout: {
            width: 600,
            keepLabels: true
        }
    });

    assert.equal(this.labels().length, 3);
});

QUnit.test("Show labels if keepLabels is true and widget size is smaller than adaptiveLayout", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        },
        adaptiveLayout: {
            width: 300,
            keepLabels: true
        },
        size: {
            width: 400
        }
    });

    assert.equal(this.labels().length, 3);
});

QUnit.test("Show hidden labels", function(assert) {
    var sankey = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        label: {
            visible: true
        },
        adaptiveLayout: {
            width: 500,
            keepLabels: false
        }
    });

    sankey.option({
        size: {
            width: 600
        }
    });
    assert.equal(this.labels().length, 3);
});
// TODO: test overlap function in sankey
// TODO: attributes.attr['text-anchor'] = 'end' if the label is in last cascade
// TODO: aplying offsets for labels
/*
QUnit.test("Apply label ellipsis and correct label coordinates", function(assert) {
    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: "columns"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180
        }
    });

    assert.equal(labelModule.Label.getCall(0).returnValue.fit.lastCall.args[0], 45);
    assert.ok(!labelModule.Label.getCall(1).returnValue.stub("fit").called);
});

QUnit.test("Apply label ellipsis and correct label coordinates. Right horizontalAlignment", function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: "columns",
            horizontalAlignment: "right"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180
        }
    });

    assert.equal(labelModule.Label.getCall(0).returnValue.fit.lastCall.args[0], 45);
    assert.ok(!labelModule.Label.getCall(1).returnValue.stub("fit").called);
});

QUnit.test("Correct label pos if label out from left", function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: "columns",
            horizontalAlignment: "left"
        },
        rtlEnabled: true,
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.equal(label.shift.lastCall.args[0], 0);
});

QUnit.test("Correct label pos if label out from right", function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: "columns",
            horizontalAlignment: "right"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.equal(label.shift.lastCall.args[0], 80);
});

QUnit.test("Correct label pos if label out from top", function(assert) {

    stubAlgorithm.getFigures.returns([[0, 0, 1, 0, 1, 0.1, 0, 0.1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: "inside"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180,
            height: 50,
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.equal(label.shift.lastCall.args[1], 0);
});

QUnit.test("Correct label pos if label out from top", function(assert) {

    stubAlgorithm.getFigures.returns([[0, 0.9, 1, 0.9, 1, 1, 0, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: "inside"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 180,
            height: 50,
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.equal(label.shift.lastCall.args[1], 40);
});
*/
