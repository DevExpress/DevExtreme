import $ from 'jquery';
import { createFunnel, stubAlgorithm } from './commonParts/common.js';
import labelModule from 'viz/series/points/label';
import { labelEnvironment } from './commonParts/label.js';

QUnit.module('Initialization', labelEnvironment);

QUnit.test('Create label group on initialization', function(assert) {
    createFunnel({});

    var labelsGroup = this.labelGroup();
    assert.equal(labelsGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(labelsGroup.attr.lastCall.args[0].class, 'dxf-labels');
});

QUnit.test('Create labels', function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    stubAlgorithm.normalizeValues.returns([1, 0.5]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 2, argument: 'One', color: '#123123' }, { value: 5, argument: 'Two', color: '#121212' }],
        valueField: 'value',
        label: {
            visible: true
        }
    });
    var labelsGroup = this.labelGroup(),
        label = labelModule.Label.getCall(0).returnValue;

    assert.ok(labelsGroup.clear.called);

    assert.equal(labelModule.Label.callCount, 2, 'two labels are created');
    assert.equal(labelModule.Label.getCall(0).args[0].renderer, this.renderer);
    assert.equal(labelModule.Label.getCall(0).args[0].labelsGroup, labelsGroup);
    assert.deepEqual(label.draw.firstCall.args, [true]);

    assert.equal(label.setData.lastCall.args[0].value, 5, 'value');
    assert.equal(label.setData.lastCall.args[0].percent, 1, 'percent');
    assert.deepEqual(label.setData.lastCall.args[0].item.data, {
        argument: 'Two',
        value: 5,
        color: '#121212'
    }, 'data');
});

QUnit.test('Create labels with styles', function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 2 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            font: {
                color: 'red'
            },
            background: {
                dashStyle: 'solid'
            },
            textAlignment: 'center',
            position: 'outside',
            horizontalOffset: 0,
            verticalOffset: 0,
            showForZeroValues: false
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.attributes.font, {
        color: 'red',
        cursor: 'default',
        family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
        size: 12,
        weight: 400
    }, 'font');

    assert.deepEqual(options.background, {
        dashStyle: 'solid',
        fill: '#1db2f5',
        stroke: 'none',
        'stroke-width': 0
    }, 'background');

    assert.deepEqual(options.connector, {
        stroke: '#1db2f5',
        'stroke-width': 1,
        opacity: 0.5
    }, 'connector');

    assert.deepEqual(options.format, undefined, 'format');
    assert.deepEqual(options.horizontalOffset, 0, 'horizontalOffset');
    assert.deepEqual(options.verticalOffset, 0, 'verticalOffset');
    assert.deepEqual(options.visible, true, 'visible');
    assert.deepEqual(options.showForZeroValues, false, 'showForZeroValues');
    assert.deepEqual(options.customizeText({ valueText: 'value', item: { argument: 'argument' } }), 'argument value', 'customizeText');
    assert.deepEqual(options.textAlignment, 'center', 'textAlign');
});

QUnit.test('Default label alignment for inside labels is center', function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 2 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'inside'
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, 'center', 'text alignment');
});

QUnit.test('Default label alignment for outside labels is left', function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 2 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'columns'
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, 'left', 'text alignment');
});

QUnit.test('Default label alignment for outside labels is right if rtl enabled', function(assert) {
    stubAlgorithm.getFigures.returns([[0]]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 2 }],
        valueField: 'value',
        rtlEnabled: true,
        label: {
            visible: true,
            position: 'columns'
        }
    });

    var options = labelModule.Label.getCall(0).returnValue.setOptions.lastCall.args[0];

    assert.deepEqual(options.textAlignment, 'right', 'text alignment');
});

QUnit.test('Do not create labels if label.visible set to false', function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }],
        valueField: 'value',
        label: {
            visible: false
        }
    });
    var labelsGroup = this.labelGroup();

    assert.ok(labelsGroup.clear.called);
    assert.equal(labelModule.Label.callCount, 0, 'no one label is created');
});

QUnit.test('Hide labels for zero values id showForZeroValues is set to false', function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    stubAlgorithm.normalizeValues.returns([1, 1]);
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 0 }],
        valueField: 'value',
        label: {
            visible: true,
            showForZeroValues: false
        }
    });

    assert.equal(labelModule.Label.callCount, 2);
    assert.ok(!labelModule.Label.getCall(0).returnValue.stub('draw').calledWith(false));
    assert.ok(labelModule.Label.getCall(1).returnValue.stub('draw').calledWith(false));
});

QUnit.test('Reserve space for labels if position outside', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'Outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 680, 600]);
});

QUnit.test('Reserve space for labels if position outside and horizontal alignment is left', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [120, 0, 800, 600]);
});

QUnit.test('Reserve space for labels if position columns', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 665, 600]);
});

QUnit.test('Use columns position if position value is not accepted', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            horizontalOffset: 15,
            position: 'not accepted value',
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 665, 600]);
});

QUnit.test('Do not reserve space for labels if position inside', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'inside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
});

QUnit.test('Relayout labels after dataSource changed', function(assert) {
    var funnel = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'outside',
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

QUnit.test('Place labels with outside position', function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5],
        [0, 0.6, 1, 0.8]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'Outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [360, 330]);

    label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 510]);
});

QUnit.test('Place labels with outside position. inverted', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        label: {
            visible: true,
            position: 'outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 590]);
});

QUnit.test('Place labels with outside position and left horizontal alignment', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'Outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.deepEqual(label.shift.args[0], [0, 30]);
});

QUnit.test('Place labels with outside position. horizontalAlignment left. inverted', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        label: {
            visible: true,
            horizontalAlignment: 'left',
            position: 'outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [0, 590]);
});

QUnit.test('Place labels with inside position', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'inside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 175]);
});

QUnit.test('Place labels with inside position, figure is hexagon', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 1, 1, 0, 1, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'inside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 325]);
});

QUnit.test('Place labels with columns position', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 30]);
    assert.deepEqual(label2.shift.args[0], [700, 30]);
});

QUnit.test('Place labels with columns position. inverted', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        label: {
            visible: true,
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 590]);
});

QUnit.test('Place labels with columns position. rtl', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        rtlEnabled: true,
        label: {
            visible: true,
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 30]);
    assert.deepEqual(label2.shift.args[0], [755, 30]);
});

QUnit.test('Place labels with columns position and left horizontal alignment', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            horizontalAlignment: 'left',
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 30]);
    assert.deepEqual(label2.shift.args[0], [0, 30]);
});

QUnit.test('Place labels with columns position. horizontalAlignment left inverted', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.8, 0, 0.8]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        label: {
            visible: true,
            position: 'columns',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [0, 590]);
});

QUnit.test('Place labels with columns position and left horizontal alignment. rtl', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: 'value',
        rtlEnabled: true,
        label: {
            visible: true,
            horizontalAlignment: 'left',
            position: 'columns',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 30]);
    assert.deepEqual(label2.shift.args[0], [55, 30]);
});

QUnit.test('Connector strategy', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'outsiDe',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [679, 0], 'center');
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [679, 0], 'figure point');
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 5,
        width: 40
    }), [[6, 15], [6, 16], [6, 17], [6, 18], [6, 19], [6, 20], [46, 15], [46, 16], [46, 17], [46, 18], [46, 19], [46, 20]], 'prepareLabelPoints');
    assert.equal(connectorStrategy.isLabelInside(), false, 'isLabelInside');

    assert.deepEqual(connectorStrategy.adjustPoints([1.2, 1, 1.8]), [1, 1, 2]);
});

QUnit.test('Connector strategy. left horizontalAlignment', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [121, 0], 'center');
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [121, 0], 'figure point');
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 2,
        width: 40
    }), [[14, 15], [14, 16], [14, 17], [54, 15], [54, 16], [54, 17]], 'prepareLabelPoints');
});


QUnit.test('Connector strategy. inverted', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [121, 599], 'center');
    assert.deepEqual(connectorStrategy.prepareLabelPoints({
        x: 10,
        y: 15,
        height: 2,
        width: 40
    }), [[14, 15], [14, 16], [14, 17], [54, 15], [54, 16], [54, 17]], 'prepareLabelPoints');
});

QUnit.test('Place labels and connector, item border width > 0, horizontalAlignment is left', function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [138, 31]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [259, 1], 'figure point');
});

QUnit.test('Place labels and connector, item border width > 0, horizontalAlignment is right', function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'right',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [562, 31]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [541, 1], 'figure point');
});

QUnit.test('Place labels and connector, item border width > 0, horizontalAlignment is left, inverted', function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        item: { border: { visible: true, width: 2 } },
        inverted: true,
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'left',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [138, 590]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [259, 598], 'figure point');
});

QUnit.test('Place labels and connector, item border width > 0, horizontalAlignment is right, inverted', function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0.2, 0, 0.8, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        inverted: true,
        item: { border: { visible: true, width: 2 } },
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'right',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(label.shift.args[0], [562, 590]);
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [541, 598], 'figure point');
});

QUnit.test('change label option', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    var funnel = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        label: {
            visible: true,
            position: 'outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    this.labelGroup().clear.reset();

    funnel.option({
        label: {
            position: 'inside'
        }
    });

    assert.equal(this.labelGroup().clear.callCount, 1);
    assert.equal(labelModule.Label.callCount, 2);

    var label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [392.5, 175]);
});

QUnit.module('Adaptive layout', $.extend({}, labelEnvironment, {
    beforeEach: function() {
        labelEnvironment.beforeEach.call(this);

        stubAlgorithm.getFigures.returns([
            [0, 0, 1, 1], [0, 0, 1, 1]
        ]);

        $('#test-container').css({
            width: 240
        });
    }
}));

QUnit.test('Hide labels', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: 'outside'
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 240, 600]);
    assert.ok(labelModule.Label.getCall(0).returnValue.draw.calledWith(false));
    assert.ok(labelModule.Label.getCall(1).returnValue.draw.calledWith(false));
    assert.deepEqual(labelModule.Label.getCall(0).returnValue.draw.firstCall.args, [true]);
});

QUnit.test('Show hidden labels', function(assert) {
    var funnel = createFunnel({
            algorithm: 'stub',
            dataSource: [{ value: 1 }, { value: 2 }],
            label: {
                visible: true,
                position: 'outside'
            },
            adaptiveLayout: {
                width: 150,
                keepLabels: false
            }
        }),
        label = labelModule.Label.getCall(0).returnValue;

    label.resetEllipsis.reset();
    label.draw.reset();

    funnel.option({
        size: {
            width: 400
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 295, 600]);
    assert.ok(!label.draw.calledWith(false));
    assert.deepEqual(label.draw.lastCall.args, [true]);
    assert.ok(label.resetEllipsis.called);
});

QUnit.test('Do not hide labels if keepLabels true', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: 'outside'
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 150, 600]);
    assert.ok(!labelModule.Label.getCall(0).returnValue.draw.calledWith(false));
    assert.ok(!labelModule.Label.getCall(1).returnValue.draw.calledWith(false));
});

QUnit.test('Do not hide labels if keepLabels true. Container width less than adaptiveLayout', function(assert) {
    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: 'outside'
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 140
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 140, 600]);
    assert.ok(!labelModule.Label.getCall(0).returnValue.draw.calledWith(false));
    assert.ok(!labelModule.Label.getCall(1).returnValue.draw.calledWith(false));
});

QUnit.test('Apply label ellipsis and correct label coordinates', function(assert) {
    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: 'columns'
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
    assert.ok(!labelModule.Label.getCall(1).returnValue.stub('fit').called);
});

QUnit.test('Apply label ellipsis and correct label coordinates. Right horizontalAlignment', function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: 'columns',
            horizontalAlignment: 'right'
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
    assert.ok(!labelModule.Label.getCall(1).returnValue.stub('fit').called);
});

QUnit.test('Correct label pos if label out from left', function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: 'columns',
            horizontalAlignment: 'left'
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

QUnit.test('Correct label pos if label out from right', function(assert) {

    stubAlgorithm.getFigures.returns([[0.1, 0, 0.9, 1], [0.2, 0, 0.8, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 1 }],
        label: {
            visible: true,
            position: 'columns',
            horizontalAlignment: 'right'
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

QUnit.test('Correct label pos if label out from top', function(assert) {

    stubAlgorithm.getFigures.returns([[0, 0, 1, 0, 1, 0.1, 0, 0.1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: 'inside'
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

QUnit.test('Correct label pos if label out from top', function(assert) {

    stubAlgorithm.getFigures.returns([[0, 0.9, 1, 0.9, 1, 1, 0, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: 'inside'
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

QUnit.module('Resolve labels overlapping', $.extend({}, labelEnvironment, {
    testOverlapping(labelBoxes, options) {
        stubAlgorithm.getFigures.returns(labelBoxes.map(() => [0, 0]));
        this.labelBoxes = labelBoxes;

        this.funnel = createFunnel($.extend({
            algorithm: 'stub',
            dataSource: labelBoxes.map(() => { return { value: 1 }; }),
            valueField: 'value',
            resolveLabelOverlapping: 'hide',
            label: {
                visible: true,
                horizontalAlignment: 'left',
                position: 'columns'
            }
        }, options || {}));

        return labelModule.Label.getCalls().map(c => c.returnValue);
    }
}));

QUnit.test('Do not hide not overlapped labels. Hide mode', function(assert) {
    const labels = this.testOverlapping([
        { y: 0, height: 15 },
        { y: 15, height: 15 }
    ], {
        resolveLabelOverlapping: 'hide'
    });
    assert.equal(labels[0].stub('hide').callCount, 0);
    assert.equal(labels[1].stub('hide').callCount, 0);
});

QUnit.test('Hide overlapped labels', function(assert) {
    const labels = this.testOverlapping([
        { y: 0, height: 15 },
        { y: 14, height: 15 },
        { y: 15, height: 15 }
    ], {
        resolveLabelOverlapping: 'hide'
    });
    assert.equal(labels[0].stub('hide').callCount, 0);
    assert.equal(labels[1].stub('hide').callCount, 1);
    assert.equal(labels[2].stub('hide').callCount, 0);
});

QUnit.test('Shift overlapped labels', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 15 },
        { x: 2, y: 14, height: 15 },
        { x: 3, y: 15, height: 15 }
    ], {
        resolveLabelOverlapping: 'shift'
    });
    assert.equal(labels[0].stub('shift').callCount, 1);
    assert.equal(labels[1].stub('shift').callCount, 2);
    assert.deepEqual(labels[1].stub('shift').lastCall.args, [2, 15]);
    assert.equal(labels[2].stub('shift').callCount, 2);
    assert.deepEqual(labels[2].stub('shift').lastCall.args, [3, 30]);
});

QUnit.test('Shift. Hide label if it shoul be shifted out of canvas', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 15 },
        { x: 2, y: 14, height: 30 },
        { x: 3, y: 15, height: 15 }
    ], {
        resolveLabelOverlapping: 'shift',
        size: { height: 50 }
    });
    assert.equal(labels[0].stub('shift').callCount, 1);
    assert.equal(labels[0].stub('hide').callCount, 0);

    assert.equal(labels[1].stub('shift').callCount, 2);
    assert.deepEqual(labels[1].stub('shift').lastCall.args, [2, 15]);
    assert.equal(labels[1].stub('hide').callCount, 0);

    assert.equal(labels[2].stub('hide').callCount, 1);
});

QUnit.test('Shift. Do not hide last label if there is empty space', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 15 },
        { x: 2, y: 75, height: 20 },
        { x: 3, y: 75, height: 15 }
    ], {
        resolveLabelOverlapping: 'shift',
        size: { height: 100 }
    });
    assert.equal(labels[0].stub('shift').callCount, 1);
    assert.equal(labels[0].stub('hide').callCount, 0);

    assert.equal(labels[1].stub('shift').callCount, 2);
    assert.deepEqual(labels[1].stub('shift').lastCall.args, [2, 65]);
    assert.equal(labels[1].stub('hide').callCount, 0);

    assert.equal(labels[2].stub('shift').callCount, 3);
    assert.deepEqual(labels[2].stub('shift').lastCall.args, [3, 85]);
    assert.equal(labels[2].stub('hide').callCount, 0);
});

QUnit.test('Shift up all items after empty space', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 15 },
        { x: 2, y: 55, height: 20 },
        { x: 2, y: 75, height: 20 },
        { x: 3, y: 75, height: 15 }
    ], {
        resolveLabelOverlapping: 'shift',
        size: { height: 100 }
    });

    assert.equal(labels[0].stub('shift').callCount, 1);
    assert.deepEqual(labels[1].stub('shift').lastCall.args, [2, 45]);
    assert.deepEqual(labels[2].stub('shift').lastCall.args, [2, 65]);
    assert.deepEqual(labels[3].stub('shift').lastCall.args, [3, 85]);
});

QUnit.test('Shift. Hide item if empty space is not enough', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 66 },
        { x: 2, y: 75, height: 20 },
        { x: 3, y: 75, height: 15 }
    ], {
        resolveLabelOverlapping: 'shift',
        size: { height: 100 }
    });
    assert.equal(labels[0].stub('shift').callCount, 1);
    assert.equal(labels[0].stub('hide').callCount, 0);

    assert.equal(labels[1].stub('shift').callCount, 1);
    assert.equal(labels[1].stub('hide').callCount, 0);

    assert.equal(labels[2].stub('hide').callCount, 1);
});

QUnit.test('Shift overlapped labels. Inverted', function(assert) {
    const labels = this.testOverlapping([
        { x: 1, y: 0, height: 15 },
        { x: 2, y: 14, height: 15 },
        { x: 3, y: 15, height: 15 }
    ].reverse(), {
        resolveLabelOverlapping: 'shift',
        inverted: true
    });
    assert.equal(labels[2].stub('shift').callCount, 1);
    assert.equal(labels[1].stub('shift').callCount, 2);
    assert.deepEqual(labels[1].stub('shift').lastCall.args, [2, 15]);
    assert.equal(labels[0].stub('shift').callCount, 2);
    assert.deepEqual(labels[0].stub('shift').lastCall.args, [3, 30]);
});

QUnit.test('Redraw hidden labels on resize', function(assert) {
    const labels = this.testOverlapping([
        { y: 0, height: 15 },
        { y: 14, height: 15 },
        { y: 15, height: 15 }
    ], {
        size: {
            height: 300
        },
        resolveLabelOverlapping: 'hide',
        label: {
            position: 'inside'
        }
    });

    labels.forEach((l, i) => {
        l.stub('isVisible').returns(i !== 1);
        l.draw.reset();
    });

    this.funnel.option({
        size: {
            height: 500
        }
    });

    assert.ok(!labels[0].draw.called);
    assert.ok(labels[1].draw.called);
    assert.strictEqual(labels[1].draw.lastCall.args[0], true);
    assert.ok(!labels[2].draw.called);
});

QUnit.test('change resolveLabelOverlapping option', function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    var funnel = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        valueField: 'value',
        resolveLabelOverlapping: 'hide',
        label: {
            visible: true,
            position: 'outside',
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    this.labelGroup().clear.reset();
    labelModule.Label.reset();

    funnel.option({
        resolveLabelOverlapping: 'shift',
    });

    assert.equal(this.labelGroup().clear.callCount, 1);
    assert.equal(labelModule.Label.callCount, 1);

    const label = labelModule.Label.getCall(0).returnValue;
    assert.ok(label.shift.called);
});
