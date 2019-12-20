var $ = require('jquery'),
    common = require('./commonParts/common.js'),
    createSankey = common.createSankey,
    environment = common.environment;

QUnit.module('Node labels', environment);

QUnit.test('Create label group on initialization', function(assert) {
    createSankey({});

    var labelsGroup = this.labelsGroup();
    assert.equal(labelsGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(labelsGroup.attr.lastCall.args[0].class, 'dxs-labels');
});

QUnit.test('Create labels', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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
        assert.equal(label.renderer, that.renderer, 'renderer');
        assert.equal(label.append.callCount, 1, 'appended once');
        assert.equal(label.children[0].attr.callCount, 2, 'Two calls: setting all attrs and adjusting x,y coordinates');
    });

    assert.equal(that.renderer.text.getCall(0).args[0], 'A');
    assert.equal(that.renderer.text.getCall(1).args[0], 'B');
    assert.equal(that.renderer.text.getCall(2).args[0], 'Z');
});

QUnit.test('If no labels present', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            visible: false
        }
    });
    var labelsGroup = this.labelsGroup(),
        labels = this.labels();

    assert.ok(labelsGroup.clear.called);
    assert.equal(labels.length, 0);
});

QUnit.test('Create labels with styles', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            visible: true,
            border: {
                visible: true,
                color: 'white',
                width: 10,
                opacity: 0.2
            },
            font: {
                color: 'red',
                weight: 400,
                size: 26
            },
        }
    });
    var label = this.label(0),
        css = label.css.firstCall.args[0],
        attrs = label.attr.firstCall.args[0];

    assert.deepEqual(css, {
        fill: 'red',
        cursor: 'default',
        'font-family': '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
        'font-size': 26,
        'font-weight': 400
    });
    assert.equal(attrs.stroke, 'white');
    assert.equal(attrs['stroke-opacity'], 0.2);
    assert.equal(attrs['stroke-width'], 10);
});

QUnit.test('Create labels with styles and invisible borders', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            visible: true,
            border: {
                visible: false,
                color: 'white',
                width: 10,
                opacity: 0.2
            }
        }
    });
    var attrs = this.label(0).attr.firstCall.args[0];
    var haveAttrsOwnProperty = Object.prototype.hasOwnProperty.bind(attrs);

    assert.equal(haveAttrsOwnProperty('stroke-width'), false);
    assert.equal(haveAttrsOwnProperty('stroke-opacity'), false);
    assert.equal(haveAttrsOwnProperty('stroke'), false);
});

QUnit.test('Create labels with styles and invisible borders if border width is 0', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            visible: true,
            border: {
                visible: true,
                color: 'white',
                width: 0,
                opacity: 0.2
            }
        }
    });
    var attrs = this.label(0).attr.firstCall.args[0];
    var haveAttrsOwnProperty = Object.prototype.hasOwnProperty.bind(attrs);

    assert.equal(haveAttrsOwnProperty('stroke-width'), false);
    assert.equal(haveAttrsOwnProperty('stroke-opacity'), false);
    assert.equal(haveAttrsOwnProperty('stroke'), false);
});

QUnit.test('Label color if useNodeColors set to true', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            useNodeColors: true
        }
    });
    var nodes = this.nodes();

    assert.equal(nodes[0].attr.lastCall.args[0].fill, this.label(0).css.firstCall.args[0].fill);
    assert.equal(nodes[1].attr.lastCall.args[0].fill, this.label(1).css.firstCall.args[0].fill);
    assert.equal(nodes[2].attr.lastCall.args[0].fill, this.label(2).css.firstCall.args[0].fill);
});

QUnit.test('Labels customize text', function(assert) {

    var customizeText = function(node) {
        return 'test text ' + node.title;
    };

    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            customizeText: customizeText
        }
    });

    assert.equal(this.renderer.text.getCall(0).args[0], 'test text A');
    assert.equal(this.renderer.text.getCall(1).args[0], 'test text B');
    assert.equal(this.renderer.text.getCall(2).args[0], 'test text Z');
});

QUnit.test('Labels alignment through cascades', function(assert) {
    createSankey({
        dataSource: [{ source: 'Node 1', target: 'Node 3', weight: 1 }, { source: 'Node 2', target: 'Node 3', weight: 1 }],
    });

    var nodes = this.nodes();

    assert.equal(this.label(0).attr.lastCall.args[0].translateX, 22, 'Alignment in first cascade');
    assert.equal(this.label(1).attr.lastCall.args[0].translateX, 22, 'Alignment in first cascade');
    assert.equal(this.label(2).attr.lastCall.args[0].translateX, 956, 'Alignment in last cascade');

    assert.ok(nodes[0].attr.firstCall.args[0].x < this.label(0).attr.lastCall.args[0].translateX, 'First cascade');
    assert.ok(nodes[1].attr.firstCall.args[0].x < this.label(1).attr.lastCall.args[0].translateX, 'First cascade');
    assert.ok(nodes[2].attr.firstCall.args[0].x > this.label(2).attr.lastCall.args[0].translateX, 'Last cascade');
});

QUnit.test('Labels alignment through cascades with rtlEnabled', function(assert) {
    createSankey({
        rtlEnabled: true,
        dataSource: [{ source: 'Node 1', target: 'Node 3', weight: 1 }, { source: 'Node 2', target: 'Node 3', weight: 1 }],
    });

    var nodes = this.nodes();

    assert.equal(this.label(0).attr.lastCall.args[0].translateX, 22, 'Alignment in first cascade');
    assert.equal(this.label(1).attr.lastCall.args[0].translateX, 22, 'Alignment in first cascade');
    assert.equal(this.label(2).attr.lastCall.args[0].translateX, 956, 'Alignment in last cascade');

    assert.ok(nodes[0].attr.firstCall.args[0].x < this.label(0).attr.lastCall.args[0].translateX, 'First cascade');
    assert.ok(nodes[1].attr.firstCall.args[0].x < this.label(1).attr.lastCall.args[0].translateX, 'First cascade');
    assert.ok(nodes[2].attr.firstCall.args[0].x > this.label(2).attr.lastCall.args[0].translateX, 'Last cascade');
});


QUnit.test('Labels offsets', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            horizontalOffset: 0,
            verticalOffset: 0
        }
    });

    var x = this.labels().map(function(label) { return label.children[0].attr.lastCall.args[0].translateX; }),
        y = this.labels().map(function(label) { return label.children[0].attr.lastCall.args[0].translateY; });

    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        label: {
            horizontalOffset: 20,
            verticalOffset: 30
        }
    });

    var xOffset = this.labels().map(function(label) { return label.children[0].attr.lastCall.args[0].translateX; }),
        yOffset = this.labels().map(function(label) { return label.children[0].attr.lastCall.args[0].translateY; }),
        xDifference = [xOffset[0] - x[0], xOffset[1] - x[1], xOffset[2] - x[2]],
        yDifference = [yOffset[0] - y[0], yOffset[1] - y[1], yOffset[2] - y[2]];

    assert.deepEqual(xDifference, [20, 20, -20], 'horizontal offset applied'); // labels in last cascade are moved to other side (-10)
    assert.deepEqual(yDifference, [30, 30, 30], 'vertical offset applied');
});

// T669620
QUnit.test('Label drawing on bottom border of widget', function(assert) {
    this.renderer.bBoxTemplate = sinon.stub();
    this.renderer.bBoxTemplate.onCall(7).returns({ x: 1, y: -10, width: 20, height: 10 });
    this.renderer.bBoxTemplate.returns({ x: 1, y: 2, width: 20, height: 10 });

    createSankey({
        dataSource: [{ target: 't1', source: 's1', weight: 20 },
            { target: 't2', source: 's1', weight: 30 }, { target: 't3', source: 's1', weight: 0.1 }
        ],
        size: {
            width: 800,
            height: 400
        }
    });

    assert.equal(this.label(3).attr.lastCall.args[0].translateY, 400, 'Alignment of bottom label');
});

// T669620
QUnit.test('Label drawing on top border of widget', function(assert) {
    createSankey({
        dataSource: [{ target: 't3', source: 's1', weight: 0.1 }, { target: 't1', source: 's1', weight: 20 },
            { target: 't2', source: 's1', weight: 30 }
        ],
        size: {
            width: 800,
            height: 400
        }
    });

    assert.equal(this.label(1).attr.lastCall.args[0].translateY, -2, 'Alignment of top label');
});

QUnit.module('Node labels. Adaptive layout', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $('#test-container').css({
            width: 300
        });
    }
}));

QUnit.test('Shown labels if container size bigger than adaptiveLayout', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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

QUnit.test('Hide labels if container size smaller than adaptiveLayout', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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

QUnit.test('Show labels if keepLabels is true and container size is smaller than adaptiveLayout', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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

QUnit.test('Show labels if keepLabels is true and widget size is smaller than adaptiveLayout', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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

QUnit.test('Show hidden labels', function(assert) {
    var sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
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
