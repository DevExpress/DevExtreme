"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

QUnit.module("custom formatters", {
    beforeEach: function() {
        this.$element = $("#texteditor").dxTextEditor({
            value: "123",
            format: function(e) {
                return "$ " + e.actionValue;
            },
            parse: function(e) {
                return e.actionValue.replace(/[^0-9]/g, '');
            }
        });
        this.input = this.$element.find(".dx-texteditor-input");
        this.instance = this.$element.dxTextEditor("instance");
        this.keyboard = keyboardMock(this.input);
    }
});

QUnit.test("initial value should be formatted correctly", function(assert) {
    assert.equal(this.input.val(), "$ 123", "value is formatted");
});

QUnit.test("api value should be formatted correctly", function(assert) {
    this.instance.option("value", "456");

    assert.equal(this.input.val(), "$ 456", "value is formatted");
});

QUnit.test("changed input value should be formatted correctly", function(assert) {
    this.input.val("456").trigger("change");

    assert.equal(this.input.val(), "$ 456", "value is formatted");
    assert.equal(this.instance.option("value"), "456", "widget got parsed value");
});

QUnit.test("text should be formatted on input", function(assert) {
    this.keyboard
        .caret(5)
        .type("4")
        .change();

    assert.equal(this.input.val(), "$ 1234", "value is formatted");
    assert.equal(this.instance.option("value"), "1234", "widget got parsed value");
});

QUnit.test("format option change should affect to input text", function(assert) {
    this.instance.option({
        format: function(e) {
            return e.actionValue + "%";
        }
    });

    assert.equal(this.input.val(), "123%", "value was reformatted");
});

QUnit.test("parse option change should affect to the value", function(assert) {
    this.instance.option({
        parse: function(e) {
            return e.actionValue.replace(/[^0-9]/g, '').replace('3', '5');
        }
    });

    assert.equal(this.input.val(), "$ 125", "text was reformatted");
    assert.equal(this.instance.option("value"), "125", "value was reformatted");
});

QUnit.test("backspace and delete input should not reformat the value", function(assert) {
    var formatter = sinon.stub(),
        parser = sinon.stub();

    this.instance.option({
        format: formatter,
        parse: parser
    });

    this.keyboard
        .keyDown("backspace")
        .input()
        .caret(0)
        .keyDown("delete")
        .input();

    assert.equal(formatter.callCount, 3, "formatter was called 3 times");
    assert.equal(parser.callCount, 3, "parser was called 3 times");
});
