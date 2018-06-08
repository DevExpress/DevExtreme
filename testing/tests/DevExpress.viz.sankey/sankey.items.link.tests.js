// TODO: Drawing link exactly between to rectangles
// TODO: links colorMode
// TODO: test of style when adjacent node hovered

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
