"use strict";

var common = require("./commonParts/common.js"),
    createSankey = common.createSankey,
    environment = common.environment,
    themeModule = require("viz/themes");

themeModule.registerTheme({
    name: "test-theme",
    sankey: {
        nodes: {
            border: {
                visible: true,
                color: "black"
            }
        }
    }
}, "generic.light");


QUnit.module("Items: links", environment);

QUnit.test("Creation", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        }),
        links = sankey.getAllItems().links;

    assert.equal(links[0].connection.from, 'A');
    assert.equal(links[0].connection.to, 'Z');
    assert.equal(links[0].connection.weight, 1);

    assert.equal(links[1].connection.from, 'B');
    assert.equal(links[1].connection.to, 'Z');
    assert.equal(links[1].connection.weight, 1);
});

QUnit.test("Color from options applied to all links", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        links: {
            color: '#aabbcc'
        }
    });

    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0].fill, "#aabbcc");
    assert.deepEqual(this.link(1)[0].smartAttr.lastCall.args[0].fill, "#aabbcc");
});

QUnit.test("Normal style, border is not visible", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        links: {
            border: {
                visible: false,
                color: "#ffeedd",
                width: 2
            }
        }
    });

    var base = this.link(0)[0];
    assert.deepEqual(base.smartAttr.lastCall.args[0].stroke, "#ffeedd");
    assert.deepEqual(base.smartAttr.lastCall.args[0]["stroke-width"], 0);

    assert.deepEqual(base.smartAttr.lastCall.args[0].stroke, "#ffeedd");
    assert.deepEqual(base.smartAttr.lastCall.args[0]["stroke-width"], 0);
});

QUnit.test("Hover style", function(assert) {
    var sankey = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        links: {
            color: '#432432',
            opacity: 0.1,
            border: {
                visible: true,
                color: "#ffeedd",
                width: 2
            },
            hoverStyle: {
                color: '#654654',
                opacity: 0.75,
                border: {
                    visible: true,
                    color: "#aabbcc",
                    width: 3,
                    opacity: 0.1
                },
                hatching: {
                    direction: "left"
                }
            }
        }
    });

    var overlay = this.link(1)[0], base = this.link(1)[1];
    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0, 'overlay element is invisible');
    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0.1, 'base element is visible');
    assert.equal(base.smartAttr.lastCall.args[0].fill, "#432432");

    sankey.getAllItems().links[1].hover(true);

    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0.75, 'overlay visible');
    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0), 'base invisible';

    assert.equal(overlay.smartAttr.lastCall.args[0].fill, "#654654");
    assert.equal(overlay.smartAttr.lastCall.args[0].stroke, "#aabbcc");
    assert.equal(overlay.smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.equal(overlay.smartAttr.lastCall.args[0]["stroke-opacity"], 0.1);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0].hatching, {
        direction: "left",
        opacity: 0.75,
        step: 6,
        width: 2
    });
});

QUnit.test("Sankey does not fire drawn event on link hover", function(assert) {
    var drawn = sinon.spy(),
        sankey = createSankey({
            dataSource: [['A', 'Z', 1]],
            onDrawn: drawn
        });

    drawn.reset();

    sankey.getAllItems().links[0].hover(true);

    assert.equal(drawn.callCount, 0);
});

QUnit.test("Clear hover of item", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            links: {
                color: '#111111',
                border: {
                    visible: true,
                    color: "#ffffff",
                    width: 2
                },
                hoverStyle: {
                    border: {
                        visible: true,
                        color: "#123123",
                        width: 3
                    },
                    hatching: {
                        direction: "left"
                    }
                }
            }
        }),
        link = sankey.getAllItems().links[1];

    link.hover(true);
    link.hover(false);

    var overlay = this.link(1)[0],
        base = this.link(1)[1];

    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0.3, 'base element visible');
    assert.equal(base.smartAttr.lastCall.args[0].fill, "#111111");
    assert.equal(base.smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.equal(base.smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!base.smartAttr.lastCall.args[0].hatching);

    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0, 'overlay element invisible');
});

QUnit.test("Inherit border from normal style if hoverStyle.border option is not set", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            links: {
                color: '#234234',
                border: {
                    visible: true,
                    color: "#ffffff",
                    width: 2,
                    opacity: 0.4
                }
            }
        }),
        link = sankey.getAllItems().links[1];

    link.hover(true);

    var overlay = this.link(1)[0],
        base = this.link(1)[1];

    assert.equal(base.smartAttr.lastCall.args[0].opacity, 0, 'base invisible');
    assert.equal(overlay.smartAttr.lastCall.args[0].opacity, 0.5, 'overlay visible');
    assert.equal(overlay.smartAttr.lastCall.args[0].fill, "#234234");
    assert.equal(overlay.smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.equal(overlay.smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.equal(overlay.smartAttr.lastCall.args[0]["stroke-opacity"], 0.4);
});

QUnit.test("Border for hoverStyle can be disabled", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            links: {
                border: {
                    visible: true,
                    color: "#ffffff",
                    width: 2
                },
                hoverStyle: {
                    border: {
                        visible: false
                    }
                }
            }
        }),
        link = sankey.getAllItems().links[1];

    link.hover(true);

    var overlay = this.link(1)[0],
        base = this.link(1)[1];

    assert.deepEqual(base.smartAttr.lastCall.args[0].opacity, 0);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0].opacity, 0.5);
    assert.deepEqual(overlay.smartAttr.lastCall.args[0]["stroke-width"], 0);
});

QUnit.test("hover changed event", function(assert) {
    var hoverChanged = sinon.spy(),
        sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            onHoverChanged: hoverChanged
        }),
        link = sankey.getAllItems().links[0];

    link.hover(true);

    assert.ok(hoverChanged.calledOnce);
    assert.strictEqual(hoverChanged.lastCall.args[0].item, link);
});

QUnit.test("hover changed event after hover second item", function(assert) {
    var hoverChanged = sinon.spy(),
        sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            onHoverChanged: hoverChanged
        }),
        link = sankey.getAllItems().links[0];

    link.hover(true);
    hoverChanged.reset();

    sankey.getAllItems().links[1].hover(true);

    assert.equal(hoverChanged.callCount, 2);
});

QUnit.test("Hover item two times, hover changed event should fire only one time", function(assert) {
    var hoverChanged = sinon.spy(),
        sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            onHoverChanged: hoverChanged
        }),
        link = sankey.getAllItems().links[0];

    link.hover(true);
    link.hover(true);

    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test("Unhover item if it is not hovered, hover changed event shouldn't fire", function(assert) {
    var hoverChanged = sinon.spy(),
        sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            onHoverChanged: hoverChanged
        }),
        link = sankey.getAllItems().links[0];

    link.hover(false);

    assert.equal(hoverChanged.callCount, 0);
});

QUnit.test("disable hover", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1]],
            hoverEnabled: false
        }),
        links = sankey.getAllItems().links;

    links[0].hover(true);

    assert.ok(!links[0].isHovered());
});


QUnit.test("isHovered method", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]]
        }),
        links = sankey.getAllItems().links;

    links[1].hover(true);

    assert.ok(links[1].isHovered());
    assert.ok(!links[0].isHovered());
});

QUnit.test("links colorMode", function(assert) {
    var sankey = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            links: {
                colorMode: 'node'
            }
        }),
        nodes = this.nodes();

    sankey.getAllItems().links.forEach(function(linkItem) {
        var node = nodes.find(function(node) { return node.attr.firstCall.args[0]._name === linkItem.connection.from; });
        assert.equal(node.smartAttr.firstCall.args[0].fill, linkItem.color);
    });
});

QUnit.test("links colorMode with fixed color of nodes", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        nodes: {
            color: '#aabbcc'
        },
        links: {
            colorMode: 'node'
        }
    });

    assert.equal(this.link(0)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
    assert.equal(this.link(1)[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
});

QUnit.test("links style when adjacent node is hovered", function(assert) {
    var sankey = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1], ['C', 'Z', 1]],
        nodes: {
            color: '#aabbcc'
        },
        links: {
            color: '#112233',
            hoverStyle: {
                color: '#ffeedd'
            }
        }
    });

    sankey.getAllItems().nodes[0].hover(true);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].opacity, 0.5);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].opacity, 0);

    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllItems().nodes[0].hover(false);
    sankey.getAllItems().nodes[1].hover(true);
    assert.equal(this.link(0)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(0)[1].smartAttr.lastCall.args[0].fill, '#112233');

    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].opacity, 0.5);
    assert.equal(this.link(1)[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(this.link(1)[1].smartAttr.lastCall.args[0].opacity, 0);

    assert.equal(this.link(2)[0].smartAttr.lastCall.args[0].opacity, 0);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].opacity, 0.3);
    assert.equal(this.link(2)[1].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllItems().nodes[1].hover(false);
    sankey.getAllItems().nodes[2].hover(true);
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
