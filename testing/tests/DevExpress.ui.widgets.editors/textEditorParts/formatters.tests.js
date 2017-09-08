"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

QUnit.module("custom formatters", {
    beforeEach: function() {
        this.$element = $("#texteditor").dxTextEditor({
            value: "123",
            displayFormat: "currency"
        });
        this.input = this.$element.find(".dx-texteditor-input");
        this.instance = this.$element.dxTextEditor("instance");
        this.keyboard = keyboardMock(this.input);
    }
});

QUnit.test("initial value should be formatted correctly", function(assert) {
    assert.equal(this.input.val(), "$123", "value is formatted");
});

QUnit.test("api value should be formatted correctly", function(assert) {
    this.instance.option("value", "456");

    assert.equal(this.input.val(), "$456", "value is formatted");
});

QUnit.test("changed input value should be formatted correctly", function(assert) {
    this.input.val("456").trigger("change");

    assert.equal(this.input.val(), "$456", "value is formatted");
    assert.equal(this.instance.option("value"), "456", "widget got parsed value");
});

QUnit.test("text should be formatted on input", function(assert) {

    this.instance.option("value", null);

    this.input.val("1234");
    this.keyboard.input();

    assert.equal(this.input.val(), "$1,234", "value is formatted");
    assert.equal(this.instance.option("value"), null, "value was not changed yet");

    this.keyboard.change();
    assert.equal(this.instance.option("value"), "1234", "widget got parsed value");
});

QUnit.test("format option change should affect to input text", function(assert) {
    this.instance.option("displayFormat", "percent");

    assert.equal(this.input.val(), "12,300%", "value was reformatted");
});
