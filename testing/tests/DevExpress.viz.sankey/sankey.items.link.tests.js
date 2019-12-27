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
    }
}, 'generic.light');


QUnit.module('Items: links', environment);

QUnit.test('Creation', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
    });
    const links = sankey.getAllLinks();

    assert.equal(links[0].connection.source, 'A');
    assert.equal(links[0].connection.target, 'Z');
    assert.equal(links[0].connection.weight, 1);

    assert.equal(links[1].connection.source, 'B');
    assert.equal(links[1].connection.target, 'Z');
    assert.equal(links[1].connection.weight, 1);
});

QUnit.test('Color from options applied to all links', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            color: '#aabbcc'
        }
    });

    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0].fill, '#aabbcc');
    assert.deepEqual(this.link(1)[0].smartAttr.lastCall.args[0].fill, '#aabbcc');
});

QUnit.test('Normal style, border is not visible', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            border: {
                visible: false,
                color: '#ffeedd',
                width: 2
            }
        }
    });

    const base = this.link(0)[0];
    assert.deepEqual(base.smartAttr.lastCall.args[0].stroke, '#ffeedd');
    assert.deepEqual(base.smartAttr.lastCall.args[0]['stroke-width'], 0);

    assert.deepEqual(base.smartAttr.lastCall.args[0].stroke, '#ffeedd');
    assert.deepEqual(base.smartAttr.lastCall.args[0]['stroke-width'], 0);
});

QUnit.test('Hover style', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            color: '#432432',
            opacity: 0.1,
            border: {
                visible: true,
                color: '#ffeedd',
                width: 2
            },
            hoverStyle: {
                color: '#654654',
                opacity: 0.75,
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

    const overlay = this.link(1)[0]; const base = this.link(1)[1];
    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0, 'overlay element is invisible');
    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0.1, 'base element is visible');
    assert.equal(base.smartAttr.lastCall.args[0].fill, '#432432');

    sankey.getAllLinks()[1].hover(true);

    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0.75, 'overlay visible');
    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0), 'base invisible';

    assert.equal(overlay.smartAttr.lastCall.args[0].fill, '#654654');
    assert.equal(overlay.smartAttr.lastCall.args[0].stroke, '#aabbcc');
    assert.equal(overlay.smartAttr.lastCall.args[0]['stroke-width'], 3);
    assert.equal(overlay.smartAttr.lastCall.args[0]['stroke-opacity'], 0.1);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0].hatching, {
        direction: 'left',
        opacity: 0.75,
        step: 6,
        width: 2
    });
});

QUnit.test('Sankey does not fire drawn event on link hover', function(assert) {
    const drawn = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        onDrawn: drawn
    });

    drawn.reset();

    sankey.getAllLinks()[0].hover(true);

    assert.equal(drawn.callCount, 0);
});

QUnit.test('Clear hover of item', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
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
    const link = sankey.getAllLinks()[1];

    link.hover(true);
    link.hover(false);

    const overlay = this.link(1)[0];
    const base = this.link(1)[1];

    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0.3, 'base element visible');
    assert.equal(base.smartAttr.lastCall.args[0].fill, '#111111');
    assert.equal(base.smartAttr.lastCall.args[0].stroke, '#ffffff');
    assert.equal(base.smartAttr.lastCall.args[0]['stroke-width'], 2);
    assert.ok(!base.smartAttr.lastCall.args[0].hatching);

    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0, 'overlay element invisible');
});

QUnit.test('Inherit border from normal style if hoverStyle.border option is not set', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            color: '#234234',
            border: {
                visible: true,
                color: '#ffffff',
                width: 2,
                opacity: 0.4
            }
        }
    });
    const link = sankey.getAllLinks()[1];

    link.hover(true);

    const overlay = this.link(1)[0];
    const base = this.link(1)[1];

    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0, 'base invisible');
    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0.5, 'overlay visible');
    assert.equal(overlay.smartAttr.lastCall.args[0].fill, '#234234');
    assert.equal(overlay.smartAttr.lastCall.args[0].stroke, '#ffffff');
    assert.equal(overlay.smartAttr.lastCall.args[0]['stroke-width'], 2);
    assert.equal(overlay.smartAttr.lastCall.args[0]['stroke-opacity'], 0.4);
});

QUnit.test('Border for hoverStyle can be disabled', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
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
    const link = sankey.getAllLinks()[1];

    link.hover(true);

    const overlay = this.link(1)[0];
    const base = this.link(1)[1];

    assert.deepEqual(base.smartAttr.lastCall.args[0].opacity, 0);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0].opacity, 0.5);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0]['stroke-width'], 0);
});

QUnit.test('hover changed event', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onLinkHoverChanged: hoverChanged
    });
    const link = sankey.getAllLinks()[0];

    link.hover(true);

    assert.ok(hoverChanged.calledOnce);
    assert.strictEqual(hoverChanged.lastCall.args[0].target, link);
});

QUnit.test('hover changed event after hover second item', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onLinkHoverChanged: hoverChanged
    });
    const link = sankey.getAllLinks()[0];

    link.hover(true);
    hoverChanged.reset();

    sankey.getAllLinks()[1].hover(true);

    assert.equal(hoverChanged.callCount, 2);
});

QUnit.test('Hover item two times, hover changed event should fire only one time', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onLinkHoverChanged: hoverChanged
    });
    const link = sankey.getAllLinks()[0];

    link.hover(true);
    link.hover(true);

    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test('Unhover item if it is not hovered, hover changed event shouldn\'t fire', function(assert) {
    const hoverChanged = sinon.spy();
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onLinkHoverChanged: hoverChanged
    });
    const link = sankey.getAllLinks()[0];

    link.hover(false);

    assert.equal(hoverChanged.callCount, 0);
});

QUnit.test('disable hover', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        hoverEnabled: false
    });
    const links = sankey.getAllLinks();

    links[0].hover(true);

    assert.ok(!links[0].isHovered());
});


QUnit.test('isHovered method', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }]
    });
    const links = sankey.getAllLinks();

    links[1].hover(true);

    assert.ok(links[1].isHovered());
    assert.ok(!links[0].isHovered());
});

QUnit.test('links colorMode \'source\'', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            colorMode: 'source'
        }
    });
    const nodes = this.nodes();

    sankey.getAllLinks().forEach(function(linkItem) {
        const node = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === linkItem.connection.source; });
        assert.equal(node.smartAttr.firstCall.args[0].fill, linkItem.color);
    });
});

QUnit.test('links colorMode \'source\' with fixed color of nodes', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        node: {
            color: '#aabbcc'
        },
        link: {
            colorMode: 'source'
        }
    });

    assert.equal(this.link(0)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
    assert.equal(this.link(1)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
});

QUnit.test('links colorMode \'target\'', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        link: {
            colorMode: 'target'
        }
    });
    const nodes = this.nodes();

    sankey.getAllLinks().forEach(function(linkItem) {
        const node = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === linkItem.connection.target; });
        assert.equal(node.smartAttr.firstCall.args[0].fill, linkItem.color);
    });
});

QUnit.test('links colorMode \'target\' with fixed color of nodes', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        node: {
            color: '#aabbcc'
        },
        link: {
            colorMode: 'target'
        }
    });

    assert.equal(this.link(0)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
    assert.equal(this.link(1)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
});

QUnit.test('links style when adjacent node is hovered', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }, { source: 'C', target: 'Z', weight: 1 }],
        node: {
            color: '#aabbcc'
        },
        link: {
            color: '#112233',
            hoverStyle: {
                color: '#ffeedd'
            }
        }
    });

    sankey.getAllNodes()[0].hover(true);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].opacity, 0.5);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].opacity, 0);

    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllNodes()[0].hover(false);
    sankey.getAllNodes()[1].hover(true);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].opacity, 0.5);
    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].opacity, 0);

    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllNodes()[1].hover(false);
    sankey.getAllNodes()[2].hover(true);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].opacity, 0.5);
    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].opacity, 0);
});
