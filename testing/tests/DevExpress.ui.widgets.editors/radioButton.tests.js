"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/radio_group/radio_button");

QUnit.testStart(function() {
    var markup =
        '<div id="radioButton"> </div>';

    $("#qunit-fixture").html(markup);
});

var RADIO_BUTTON_CLASS = "dx-radiobutton",
    RADIO_BUTTON_ICON_CLASS = "dx-radiobutton-icon",
    RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked";

var toSelector = function(cssClass) {
    return "." + cssClass;
};


QUnit.module("button rendering");

QUnit.test("widget should be rendered", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton();

    assert.ok($radioButton.hasClass(RADIO_BUTTON_CLASS), "widget class added");
});

QUnit.test("icon should be rendered", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton(),
        $icon = $radioButton.children(toSelector(RADIO_BUTTON_ICON_CLASS));

    assert.ok($icon.length, "icon rendered");
});


QUnit.module("value changing");

QUnit.test("widget should be selected if value is set to true", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton({
        value: true
    });

    assert.ok($radioButton.hasClass(RADIO_BUTTON_CHECKED_CLASS), "selected class added");
});

QUnit.test("widget should not be selected if value is set to false", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton({
        value: false
    });

    assert.ok(!$radioButton.hasClass(RADIO_BUTTON_CHECKED_CLASS), "selected class removed");
});

QUnit.test("widget should be selected if value is changed dynamically", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton({
            value: false
        }),
        radioButton = $("#radioButton").dxRadioButton("instance");

    radioButton.option("value", true);
    assert.ok($radioButton.hasClass(RADIO_BUTTON_CHECKED_CLASS), "selected class added");
});

QUnit.test("value change action should be fired on value change", function(assert) {
    $("#radioButton").dxRadioButton({
        onValueChanged: function() {
            assert.ok(true, "action fired");
        }
    });

    var radioButton = $("#radioButton").dxRadioButton("instance");
    radioButton.option("value", true);
});


QUnit.module("interaction");

QUnit.test("value should be changed by clicking", function(assert) {
    assert.expect(2);

    var $radioButton = $("#radioButton").dxRadioButton({
            onValueChanged: function(e) {
                assert.ok(e.jQueryEvent, "event present");
            }
        }),
        radioButton = $("#radioButton").dxRadioButton("instance");

    $radioButton.trigger("dxclick");
    assert.equal(radioButton.option("value"), true, "value changed");
});

QUnit.test("value can be changed only to true", function(assert) {
    var $radioButton = $("#radioButton").dxRadioButton({
        }),
        radioButton = $("#radioButton").dxRadioButton("instance");

    $radioButton.trigger("dxclick");
    $radioButton.trigger("dxclick");
    assert.equal(radioButton.option("value"), true, "value is true");
});

QUnit.module("keyboard navigation");

QUnit.test("state changes on space press", function(assert) {
    assert.expect(1);

    var $element = $("#radioButton").dxRadioButton({
            focusStateEnabled: true,
            value: false
        }),
        instance = $element.dxRadioButton("instance"),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    keyboard.keyDown("space");

    assert.equal(instance.option("value"), true, "value has been change successfully");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#radioButton").dxRadioButton();
    assert.equal($element.attr("role"), "radio", "aria role is correct");
});

QUnit.test("aria properties", function(assert) {
    var $element = $("#radioButton").dxRadioButton({ value: true }),
        instance = $element.dxRadioButton("instance");

    assert.equal($element.attr("aria-checked"), "true", "aria checked true is correct");

    instance.option("value", false);
    assert.equal($element.attr("aria-checked"), "false", "aria checked false is correct");
});
