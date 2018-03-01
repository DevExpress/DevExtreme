"use strict";

var $ = require("jquery"),
    devices = require("core/devices");

require("ui/text_box");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="textbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var TEXTBOX_CLASS = "dx-textbox",
    INPUT_CLASS = "dx-texteditor-input",
    CONTAINER_CLASS = "dx-texteditor-container",
    PLACEHOLDER_CLASS = "dx-placeholder";

QUnit.module("markup");

QUnit.test("markup init", function(assert) {
    assert.expect(5);

    var element = $("#textbox").dxTextBox();

    assert.ok(element.hasClass(TEXTBOX_CLASS));
    assert.equal(element.children().length, 1);
    assert.equal(element.find("." + PLACEHOLDER_CLASS).length, 1);
    assert.equal(element.find("." + INPUT_CLASS).length, 1);
    assert.equal(element.find("." + CONTAINER_CLASS).length, 1);
});

QUnit.test("init with options", function(assert) {
    assert.expect(4);

    var element = $("#textbox").dxTextBox({
        value: "custom",
        mode: "search",
        placeholder: "enter value",
        readOnly: true
    });

    var input = element.find("." + INPUT_CLASS);

    assert.equal(input.val(), "custom");
    assert.equal(input.attr("type"), "text");
    assert.equal(input.prop("placeholder") || element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "enter value");

    assert.equal(input.prop("readOnly"), true);
});

QUnit.test("'maxLength' option", function(assert) {
    var originalDevices = devices.real();
    devices.real({
        platform: "not android",
        version: ["32"]
    });

    try {
        var element = $("#textbox").dxTextBox({ maxLength: "5" }),
            input = element.find("." + INPUT_CLASS);
        assert.equal(input.attr("maxLength"), "5");
    } finally {
        devices.real(originalDevices);
    }
});

QUnit.test("set width via constructor", function(assert) {
    var $element = $("#widget").dxTextBox({ width: 400 }),
        elementStyles = $element.get(0).style;

    assert.strictEqual(elementStyles.width, "400px", "'width' style of the element must be equal to custom width");
});
