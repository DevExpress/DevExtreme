"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("common.css!");
require("ui/check_box");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="checkbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var CHECKBOX_CLASS = "dx-checkbox",
    CHECKBOX_CONTAINER_CLASS = "dx-checkbox-container",
    CHECKBOX_CONTAINER_SELECTOR = ".dx-checkbox-container",
    ICON_SELECTOR = ".dx-checkbox-icon",
    CHECKED_CLASS = "dx-checkbox-checked",
    CHECKBOX_TEXT_CLASS = "dx-checkbox-text",
    CHECKBOX_HAS_TEXT_CLASS = "dx-checkbox-has-text";


QUnit.module("render");

QUnit.test("markup init", function(assert) {
    var element = $("#checkbox").dxCheckBox();

    assert.ok(element.hasClass(CHECKBOX_CLASS));

    var checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

    assert.ok(checkboxContent.hasClass(CHECKBOX_CONTAINER_CLASS), "checkbox has a container");

    assert.equal(checkboxContent.find(ICON_SELECTOR).length, 1, "checkbox has an icon");
});

QUnit.test("init with default options", function(assert) {
    var element = $("#checkbox").dxCheckBox(),
        instance = element.data("dxCheckBox");

    assert.equal(instance.option("value"), false, "checkbox has a false value by default");
    assert.ok(!element.hasClass(CHECKED_CLASS));
    assert.ok(!element.hasClass(CHECKBOX_HAS_TEXT_CLASS, "checkbox without text has not text class"));
});

QUnit.test("init with options", function(assert) {
    var element = $("#checkbox").dxCheckBox({
        value: true,
        text: "text"
    });

    var checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

    assert.ok(element.hasClass(CHECKED_CLASS, "checkBox is checked"));
    assert.equal($.trim(checkboxContent.find("." + CHECKBOX_TEXT_CLASS).text()), "text");
    assert.ok(element.hasClass(CHECKBOX_HAS_TEXT_CLASS), "checkbox with text has text class");
});

QUnit.test("click triggers user handler and changes state", function(assert) {
    var checked = false;

    var element = $("#checkbox").dxCheckBox({
        onValueChanged: function(e) {
            assert.ok(e.value, "value present");
            checked = true;
        }
    });

    var instance = element.data("dxCheckBox");

    assert.ok(!checked);
    assert.ok(!instance.option("value"));

    element.trigger("dxclick");
    assert.ok(checked);
    assert.ok(instance.option("value"));
});

QUnit.test("changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    var checkbox = $("#checkbox").dxCheckBox({
        onValueChanged: function(args) {
            assert.equal(args.value, true, "correct value present");
            assert.ok(true);
        }
    }).dxCheckBox("instance");
    checkbox.option("value", true);
});


QUnit.module("options");

QUnit.test("visible", function(assert) {
    var $element = $("#checkbox").dxCheckBox(),
        instance = $element.dxCheckBox("instance");
    instance.option("width", 1);
    assert.ok($element.is(":visible"), "checkBox is visible");

    instance.option("visible", false);
    assert.ok($element.is(":hidden"), "checkBox is hidden");
});

QUnit.test("text is changed according to the corresponding option", function(assert) {
    var $element = $("#checkbox").dxCheckBox(),
        instance = $element.dxCheckBox("instance");

    instance.option("text", "new text");
    assert.equal($element.text(), "new text", "checkbox changed text to 'new text'");

    instance.option("text", "new text 2");
    assert.equal($element.text(), "new text 2", "checkbox changed text to 'new text 2'");
});

QUnit.test("disabled", function(assert) {
    var $element = $("#checkbox").dxCheckBox({
            disabled: true,
            value: false
        }),
        instance = $element.dxCheckBox("instance");

    $element.trigger("dxclick");
    assert.equal(instance.option("value"), false);

    instance.option("disabled", false);
    $element.trigger("dxclick");
    assert.equal(instance.option("value"), true);
});

QUnit.test("checkbox icon must not resize according to the 'width' and 'height' options", function(assert) {
    var newSize = 50;

    var $element = $("#checkbox").dxCheckBox(),
        instance = $element.dxCheckBox("instance"),
        initWidth = $element.find(ICON_SELECTOR).width(),
        initHeight = $element.find(ICON_SELECTOR).height();

    instance.option("width", newSize);

    assert.equal($element.find(ICON_SELECTOR).width(), initWidth, "icon width is not resized ");

    instance.option("height", newSize);

    assert.equal($element.find(ICON_SELECTOR).height(), initHeight, "icon height is not resized");
});


QUnit.module("hidden input");

QUnit.test("a hidden input should be rendered", function(assert) {
    var $element = $("#checkbox").dxCheckBox(),
        $input = $element.find("input");

    assert.equal($input.length, 1, "input is rendered");
    assert.equal($input.attr("type"), "hidden", "type attribute of hidden input");
});

QUnit.test("the hidden input has 'true' value", function(assert) {
    var $element = $("#checkbox").dxCheckBox({ value: true }),
        $input = $element.find("input");

    assert.equal($input.val(), "true", "a hidden input's value");
});

QUnit.test("the hidden input has 'false' value", function(assert) {
    var $element = $("#checkbox").dxCheckBox(),
        $input = $element.find("input");

    assert.equal($input.val(), "false", "a hidden input's value");
});

QUnit.test("the hidden should change its value on widget value change", function(assert) {
    var $element = $("#checkbox").dxCheckBox({
            value: undefined
        }),
        instance = $element.dxCheckBox("instance"),
        $input = $element.find("input");

    instance.option("value", false);
    assert.equal($input.val(), "false", "input value has been changed");

    instance.option("value", true);
    assert.equal($input.val(), "true", "input value has been changed second time");
});


QUnit.module("the 'name' option");

QUnit.test("widget input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#checkbox").dxCheckBox({
            name: expectedName
        }),
        $input = $element.find("input");

    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
});


QUnit.module("regressions");

QUnit.test("Q504139", function(assert) {
    var $element = $("#checkbox").dxCheckBox({ value: undefined }),
        instance = $element.data("dxCheckBox");
    assert.ok(!$element.hasClass(CHECKED_CLASS));

    instance.option({ value: null });
    assert.ok(!$element.hasClass(CHECKED_CLASS));

    instance.option({ value: 0 });
    assert.ok(!$element.hasClass(CHECKED_CLASS));
});


QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxCheckBox({ width: 400 }),
        instance = $element.dxCheckBox("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxCheckBox(),
        instance = $element.dxCheckBox("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxCheckBox(),
        instance = $element.dxCheckBox("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("keyboard navigation");

QUnit.test("check state changes on space press", function(assert) {
    assert.expect(2);

    var $element = $("#checkbox").dxCheckBox({
            focusStateEnabled: true,
            onValueChanged: function() {
                assert.ok(true, "press space on button call click action");
            },
            value: false
        }),
        instance = $element.dxCheckBox("instance"),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    keyboard.keyDown("space");

    assert.equal(instance.option("value"), true, "value has been change successfully");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#checkbox").dxCheckBox({});
    assert.equal($element.attr("role"), "checkbox", "aria role is correct");
});

QUnit.test("aria checked attributes", function(assert) {
    var $element = $("#checkbox").dxCheckBox({ value: true }),
        instance = $element.dxCheckBox("instance");

    assert.equal($element.attr("aria-checked"), "true", "checked state is correct");

    instance.option("value", "");
    assert.equal($element.attr("aria-checked"), "false", "unchecked state is correct");

    instance.option("value", undefined);
    assert.equal($element.attr("aria-checked"), "mixed", "mixed state is correct");
});
