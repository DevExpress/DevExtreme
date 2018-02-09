"use strict";

var $ = require("jquery");
var windowUtils = require("core/utils/window");

require("common.css!");
require("ui/switch");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="switch"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var SWITCH_CLASS = "dx-switch",
    WRAPPER_CLASS = "dx-switch-wrapper",
    CONTAINER_CLASS = "dx-switch-container",

    INNER_CLASS = "dx-switch-inner",
    INNER_SELECTOR = "." + INNER_CLASS,
    HANDLE_CLASS = "dx-switch-handle",
    HANDLE_SELECTOR = "." + HANDLE_CLASS,

    LABEL_ON_CLASS = "dx-switch-on",
    LABEL_OFF_CLASS = "dx-switch-off",
    LABEL_ON_SELECTOR = "." + LABEL_ON_CLASS,
    LABEL_OFF_SELECTOR = "." + LABEL_OFF_CLASS;

QUnit.module("Switch markup");

QUnit.test("markup", function(assert) {
    var check = windowUtils.hasWindow() ? assert.ok.bind(assert) : assert.notOk.bind(assert);

    var element = $("#switch").dxSwitch();

    assert.ok(element.hasClass(SWITCH_CLASS));

    var wrapper = element.find("." + WRAPPER_CLASS);
    assert.equal(wrapper.length, 1);

    var container = wrapper.children();
    assert.equal(container.length, 1);
    assert.ok(container.hasClass(CONTAINER_CLASS));

    var inner = element.find(INNER_SELECTOR);
    check(inner.length, "Switch inner");

    var labelOnEl = element.find(LABEL_ON_SELECTOR);
    check(labelOnEl.length, "Switch label");

    var handleEl = element.find(HANDLE_SELECTOR);
    check(handleEl.length, "Switch handle");

    var labelOffEl = element.find(LABEL_OFF_SELECTOR);
    check(labelOffEl.length, "Switch label");
});

QUnit.test("a hidden input should be rendered", function(assert) {
    var $element = $("#switch").dxSwitch(),
        $input = $element.find("input");

    assert.equal($input.length, 1, "input is rendered");
    assert.equal($input.attr("type"), "hidden", "input type is 'hidden'");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxSwitch(),
        instance = $element.dxSwitch("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("aria role", function(assert) {
    var $element = $("#switch").dxSwitch({});

    assert.equal($element.attr("role"), "button", "aria role is correct");
});
