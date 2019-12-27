const common = require('./commonParts/common.js');
const createSankey = common.createSankey;
const environment = common.environment;
const themeModule = require('viz/themes');
const find = common.find;

themeModule.registerTheme({
    name: 'test-theme',
    sankey: {
        node: {
            border: {
                visible: true,
                color: 'black'
            }
        }
    } }, 'generic.light');


QUnit.module('Items: nodes', environment);

QUnit.test('Creation', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
    });
    const nodes = sankey.getAllNodes();

    assert.equal(nodes[0].title, 'A');
    assert.equal(nodes[0].linksIn.length, 0);
    assert.equal(nodes[0].linksOut.length, 1);
    assert.equal(nodes[0].linksOut[0].weight, 1);
    assert.equal(nodes[0].linksOut[0].node, 'Z');

    assert.equal(nodes[1].title, 'B');
    assert.equal(nodes[1].linksIn.length, 0);
    assert.equal(nodes[1].linksOut.length, 1);
    assert.equal(nodes[1].linksOut[0].weight, 1);
    assert.equal(nodes[1].linksOut[0].node, 'Z');

    assert.equal(nodes[2].title, 'Z');
    assert.equal(nodes[2].linksIn.length, 2);
    assert.equal(nodes[2].linksIn[0].weight, 1);
    assert.equal(nodes[2].linksIn[0].node, 'A');
    assert.equal(nodes[2].linksIn[1].weight, 1);
    assert.equal(nodes[2].linksIn[1].node, 'B');
    assert.equal(nodes[2].linksOut.length, 0);
});

QUnit.test('Passing nodes[].rect coordinates to SVG', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
    });
    const nodes = sankey.getAllNodes();
    const nodesSVG = this.nodes();

    ['A', 'B', 'Z'].forEach(function(nodeName) {
        const nodeItem = find(nodes, function(n) { return n.title === nodeName; });
        const nodeSVG = find(nodesSVG, function(node) { return node.attr.firstCall.args[0]._name === nodeName; });
        assert.deepEqual(nodeSVG.attr.firstCall.args[0], nodeItem.rect, 'Node ' + nodeName + ': rectangles match');
    });
});

QUnit.test('Color from options applied to all nodes', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            color: '#aabbcc'
        }
    });
    const nodes = this.nodes();

    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0].fill, '#aabbcc');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].fill, '#aabbcc');
});

QUnit.test('Normal style, border is not visible', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            border: {
                visible: false,
                color: '#ffeedd',
                width: 2
            }
        }
    });
    const nodes = this.nodes();

    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0].stroke, '#ffeedd');
    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0]['stroke-width'], 0);

    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].stroke, '#ffeedd');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 0);
});

QUnit.test('Hover style', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            color: '#432432',
            border: {
                visible: true,
                color: '#ffeedd',
                width: 2
            },
            hoverStyle: {
                color: '#654654',
                border: {
                    visible: true,
                    color: '#aabbcc',
                    width: 3,
                    opacity: 0.1
                },
                hatching: {
                    direction: 'left'
                }
            }
        }
    });

    sankey.getAllNodes()[1].hover(true);

    const nodes = this.nodes();

    assert.equal(nodes[1].smartAttr.lastCall.args[0].fill, '#654654');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].stroke, '#aabbcc');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 3);
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-opacity'], 0.1);
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].hatching, {
        direction: 'left',
        opacity: 0.75,
        step: 6,
        width: 2
    });
});

QUnit.test('Sankey does not fire drawn event on hover', function(assert) {
    const drawn = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onDrawn: drawn
    });

    drawn.reset();

    sankey.getAllNodes()[0].hover(true);

    assert.equal(drawn.callCount, 0);
});

QUnit.test('Clear hover of item', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            color: '#111111',
            border: {
                visible: true,
                color: '#ffffff',
                width: 2
            },
            hoverStyle: {
                border: {
                    visible: true,
                    color: '#123123',
                    width: 3
                },
                hatching: {
                    direction: 'left'
                }
            }
        }
    });
    const node = sankey.getAllNodes()[1];

    node.hover(true);
    node.hover(false);

    const nodes = this.nodes();

    assert.equal(nodes[1].smartAttr.lastCall.args[0].fill, '#111111');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].stroke, '#ffffff');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 2);
    assert.ok(!nodes[1].smartAttr.lastCall.args[0].hatching);
});

QUnit.test('Inherit border from normal style if hoverStyle.border option is not set', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            color: '#234234',
            border: {
                visible: true,
                color: '#ffffff',
                width: 2,
                opacity: 0.4
            }
        }
    });
    const node = sankey.getAllNodes()[1];

    node.hover(true);

    const nodes = this.nodes();

    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].fill, '#234234');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].stroke, '#ffffff');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 2);
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-opacity'], 0.4);
});

QUnit.test('Border for hoverStyle can be disabled', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        node: {
            border: {
                visible: true,
                color: '#ffffff',
                width: 2
            },
            hoverStyle: {
                border: {
                    visible: false
                }
            }
        }
    });
    const node = sankey.getAllNodes()[1];

    node.hover(true);

    const nodes = this.nodes();

    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 0);
});

QUnit.test('hover changed event', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onNodeHoverChanged: hoverChanged
    });
    const node = sankey.getAllNodes()[0];

    node.hover(true);

    assert.ok(hoverChanged.calledOnce);
    assert.strictEqual(hoverChanged.lastCall.args[0].target, node);
});

QUnit.test('hover changed event after hover second item', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onNodeHoverChanged: hoverChanged
    });
    const node = sankey.getAllNodes()[0];

    node.hover(true);
    hoverChanged.reset();

    sankey.getAllNodes()[1].hover(true);

    assert.equal(hoverChanged.callCount, 2);
});

QUnit.test('Hover item two times, hover changed event should fire only one time', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onNodeHoverChanged: hoverChanged
    });
    const node = sankey.getAllNodes()[0];

    node.hover(true);
    node.hover(true);

    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test('Unhover item if it is not hovered, hover changed event shouldn\'t fire', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onNodeHoverChanged: hoverChanged
    });
    const node = sankey.getAllNodes()[0];

    node.hover(false);

    assert.equal(hoverChanged.callCount, 0);
});

QUnit.test('disable hover', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        hoverEnabled: false
    });
    const nodes = sankey.getAllNodes();

    nodes[0].hover(true);

    assert.ok(!nodes[0].isHovered());
});


QUnit.test('isHovered method', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });
    const nodes = sankey.getAllNodes();

    nodes[1].hover(true);

    assert.ok(nodes[1].isHovered());
    assert.ok(!nodes[0].isHovered());
});

QUnit.test('Default nodes.padding option', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
    });
    const nodes = this.nodes();
    const nodeA = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'A'; });
    const nodeB = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'B'; });
    const yA = nodeA.attr.firstCall.args[0].y;
    const heightA = nodeA.attr.firstCall.args[0].height;
    const yB = nodeB.attr.firstCall.args[0].y;

    assert.equal(yB - (yA + heightA), 30);
});

QUnit.test('Applying nodes.padding option', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        node: {
            padding: 10
        }
    });
    const nodes = this.nodes();
    const nodeA = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'A'; });
    const nodeB = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'B'; });
    const yA = nodeA.attr.firstCall.args[0].y;
    const heightA = nodeA.attr.firstCall.args[0].height;
    const yB = nodeB.attr.firstCall.args[0].y;

    assert.equal(yB - (yA + heightA), 10);
});

QUnit.test('Updating nodes.padding option', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        node: {
            padding: 10
        }
    });
    sankey.option({ node: { padding: 50 } });

    const nodes = this.nodes();
    const nodeA = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'A'; });
    const nodeB = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === 'B'; });
    const yA = nodeA.attr.firstCall.args[0].y;
    const heightA = nodeA.attr.firstCall.args[0].height;
    const yB = nodeB.attr.firstCall.args[0].y;

    assert.equal(yB - (yA + heightA), 50);
});
