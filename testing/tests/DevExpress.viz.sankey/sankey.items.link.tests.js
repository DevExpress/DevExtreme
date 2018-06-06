// TODO: Drawing link exactly between to rectangles
// TODO: links colorMode

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
    } }, "generic.light");


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
