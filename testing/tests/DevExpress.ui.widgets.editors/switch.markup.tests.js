"use strict";

var $ = require("jquery");

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
    LABEL_ON_CLASS = "dx-switch-on",
    LABEL_OFF_CLASS = "dx-switch-off",
    HANDLE_CLASS = "dx-switch-handle",

    INNER_SELECTOR = "." + INNER_CLASS,
    LABEL_ON_SELECTOR = "." + LABEL_ON_CLASS,
    LABEL_OFF_SELECTOR = "." + LABEL_OFF_CLASS;

QUnit.module("Switch markup");

QUnit.test("markup", function(assert) {
    var element = $("#switch").dxSwitch();

    assert.ok(element.hasClass(SWITCH_CLASS));

    var wrapper = element.find("." + WRAPPER_CLASS);
    assert.equal(wrapper.length, 1);

    var container = wrapper.children();
    assert.equal(container.length, 1);
    assert.ok(container.hasClass(CONTAINER_CLASS));

    var inner = container.children();
    assert.equal(inner.length, 1);
    assert.ok(inner.hasClass(INNER_CLASS));

    var innerElems = inner.children();
    assert.equal(innerElems.length, 3);

    var labelOnEl = innerElems.eq(0);
    assert.ok(labelOnEl.hasClass(LABEL_ON_CLASS));

    var handleEl = innerElems.eq(1);
    assert.ok(handleEl.hasClass(HANDLE_CLASS));

    var labelOffEl = innerElems.eq(2);
    assert.ok(labelOffEl.hasClass(LABEL_OFF_CLASS));
});

QUnit.test("switch should have correct width by default", function(assert) {
    var $element = $("#switch").dxSwitch();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
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

QUnit.test("default labels", function(assert) {
    var element = $("#switch").dxSwitch();

    var inner = element.find(INNER_SELECTOR);

    var labelOnEl = inner.find(LABEL_ON_SELECTOR);
    assert.equal($.trim(labelOnEl.text()), "ON");

    var labelOffEl = inner.find(LABEL_OFF_SELECTOR);
    assert.equal($.trim(labelOffEl.text()), "OFF");
});

QUnit.test("onText/offText on init", function(assert) {
    var element = $("#switch").dxSwitch({
        onText: "customOn",
        offText: "customOff"
    });

    var inner = element.find(INNER_SELECTOR);

    var textOnEl = inner.find(LABEL_ON_SELECTOR);
    assert.equal($.trim(textOnEl.text()), "customOn");

    var textOffEl = inner.find(LABEL_OFF_SELECTOR);
    assert.equal($.trim(textOffEl.text()), "customOff");
});

QUnit.test("onText/offText options changing", function(assert) {
    var $element = $("#switch").dxSwitch({}),
        instance = $element.dxSwitch("instance");

    instance.option("onText", "1");
    assert.equal($element.find("." + LABEL_ON_CLASS).text(), "1");
    instance.option("onText", "11");
    assert.equal($element.find("." + LABEL_ON_CLASS).text(), "11");

    instance.option("offText", "0");
    assert.equal($element.find("." + LABEL_OFF_CLASS).text(), "0");
    instance.option("offText", "00");
    assert.equal($element.find("." + LABEL_OFF_CLASS).text(), "00");
});

QUnit.test("aria role", function(assert) {
    var $element = $("#switch").dxSwitch({});

    assert.equal($element.attr("role"), "button", "aria role is correct");
});
