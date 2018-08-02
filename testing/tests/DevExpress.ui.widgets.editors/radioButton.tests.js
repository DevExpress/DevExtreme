var $ = require("jquery"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/radio_group/radio_button");

QUnit.testStart(function() {
    var markup =
        '<div id="radioButton"> </div>';

    $("#qunit-fixture").html(markup);
});

var RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked";

QUnit.module("value changing");

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
                assert.ok(e.event, "event present");
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
