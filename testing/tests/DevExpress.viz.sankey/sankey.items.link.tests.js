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
    var links = this.links();

    assert.deepEqual(links[0].smartAttr.lastCall.args[0].fill, "#aabbcc");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0].fill, "#aabbcc");
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
    var links = this.links();

    assert.deepEqual(links[0].smartAttr.lastCall.args[0].stroke, "#ffeedd");
    assert.deepEqual(links[0].smartAttr.lastCall.args[0]["stroke-width"], 0);

    assert.deepEqual(links[1].smartAttr.lastCall.args[0].stroke, "#ffeedd");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-width"], 0);
});

QUnit.test("Hover style", function(assert) {
    var sankey = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        links: {
            color: '#432432',
            border: {
                visible: true,
                color: "#ffeedd",
                width: 2
            },
            hoverStyle: {
                color: '#654654',
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

    sankey.getAllItems().links[1].hover(true);

    var links = this.links();

    assert.equal(links[1].smartAttr.lastCall.args[0].fill, "#654654");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0].stroke, "#aabbcc");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-opacity"], 0.1);
    assert.deepEqual(links[1].smartAttr.lastCall.args[0].hatching, {
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

    var links = this.links();

    assert.equal(links[1].smartAttr.lastCall.args[0].fill, "#111111");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!links[1].smartAttr.lastCall.args[0].hatching);
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

    var links = this.links();

    assert.deepEqual(links[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-opacity"], 0.4);
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

    var links = this.links();

    assert.deepEqual(links[1].smartAttr.lastCall.args[0]["stroke-width"], 0);
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
    var links = this.links();

    assert.equal(links[0].smartAttr.firstCall.args[0].fill, '#aabbcc');
    assert.equal(links[1].smartAttr.firstCall.args[0].fill, '#aabbcc');
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
        }),
        links = this.links();

    sankey.getAllItems().nodes[0].hover(true);
    assert.equal(links[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(links[1].smartAttr.lastCall.args[0].fill, '#112233');
    assert.equal(links[2].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllItems().nodes[0].hover(false);
    sankey.getAllItems().nodes[1].hover(true);
    assert.equal(links[0].smartAttr.lastCall.args[0].fill, '#112233');
    assert.equal(links[1].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(links[2].smartAttr.lastCall.args[0].fill, '#112233');

    sankey.getAllItems().nodes[1].hover(false);
    sankey.getAllItems().nodes[3].hover(true);
    assert.equal(links[0].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(links[1].smartAttr.lastCall.args[0].fill, '#ffeedd');
    assert.equal(links[2].smartAttr.lastCall.args[0].fill, '#ffeedd');
});
