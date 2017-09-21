"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

var INCOMPLETE_INPUTS = [".", "-.", "-5.", "5e", "5e-"],
    COMPLEX_FORMATS = ["exponential", "percent", "currency", "fixedpoint"];

QUnit.module("custom formatters", {
    beforeEach: function() {
        this.formatter = sinon.stub();
        this.parser = sinon.stub();
        this.$element = $("#texteditor").dxTextEditor({
            value: "123",
            displayFormat: {
                type: "custom",
                formatter: function(value) {
                    return Math.floor(value / 10) + "|" + value % 10;
                },
                parser: function(text) {
                    return parseFloat(text.replace(/[^0-9.,]/g, ""));
                }
            }
        });
        this.input = this.$element.find(".dx-texteditor-input");
        this.instance = this.$element.dxTextEditor("instance");
        this.keyboard = keyboardMock(this.input);
    }
});

QUnit.test("format initial value", function(assert) {
    assert.equal(this.input.val(), "12|3", "value is formatted");
});

QUnit.test("format value changing by api", function(assert) {
    this.instance.option("value", 456);

    assert.equal(this.input.val(), "45|6", "value is formatted");
});

QUnit.test("format value on input change event", function(assert) {
    this.input.val("456").trigger("change");

    assert.equal(this.input.val(), "45|6", "value is formatted");
    assert.equal(this.instance.option("value"), 456, "widget got parsed value");
});

QUnit.test("format value on input", function(assert) {

    this.instance.option("value", null);

    this.input.val("1234");
    this.keyboard.input();

    assert.equal(this.input.val(), "123|4", "value is formatted");
    assert.equal(this.instance.option("value"), null, "value was not changed yet");

    this.keyboard.change();
    assert.equal(this.instance.option("value"), 1234, "widget got parsed value");
});

QUnit.test("displayFormat formatter changing", function(assert) {
    this.instance.option("displayFormat.formatter", sinon.stub().returns("$"));

    assert.equal(this.input.val(), "$", "text was reformatted");
});

QUnit.test("displayFormat parser changing", function(assert) {
    this.instance.option("displayFormat.parser", sinon.stub().returns(789));

    assert.equal(this.input.val(), "78|9", "text was reformatted");
});

QUnit.test("value should be restored if parser could not parse it", function(assert) {
    this.instance.option("displayFormat.parser", sinon.stub().returns(NaN));
    this.keyboard.type("4");

    assert.equal(this.input.val(), "12|3", "input value was restored");
    assert.equal(this.instance.option("value"), 123, "value was not changed");
});

QUnit.test("value should not be restored on input if it is incomplete", function(assert) {
    this.instance.option("displayFormat.parser", sinon.stub().returns(NaN));

    INCOMPLETE_INPUTS.forEach(function(inputValue) {
        this.input.val(inputValue);
        this.keyboard.input();

        assert.equal(this.input.val(), inputValue, inputValue + " input should not be formated");
    }.bind(this));
});

QUnit.test("value should be restored on change if it is incomplete", function(assert) {
    this.instance.option("displayFormat.parser", sinon.stub().returns(NaN));

    INCOMPLETE_INPUTS.forEach(function(inputValue) {
        this.input.val(inputValue).trigger("change");
        assert.equal(this.input.val(), "12|3", inputValue + " input should be formated");
    }.bind(this));
});

QUnit.test("symbols after the caret should be selected if complex format is used", function(assert) {
    this.instance.option("displayFormat.formatter", sinon.stub().returns("456.."));

    COMPLEX_FORMATS.forEach(function(formatType) {
        this.instance.option("value", null);
        this.instance.option("displayFormat.type", formatType);
        this.instance.option("value", 456);

        assert.equal(this.input.val(), "456..", "input is correct for '" + formatType + "'");
        assert.equal(this.input[0].selectionStart, 3, "selection start is correct for '" + formatType + "'");
        assert.equal(this.input[0].selectionEnd, 5, "selection end is correct for '" + formatType + "'");
    }.bind(this));
});

QUnit.test("symbols should not be selected if a simlpe format is used", function(assert) {
    this.instance.option("displayFormat.formatter", sinon.stub().returns("..456.."));
    this.instance.option("value", 456);

    assert.equal(this.input.val(), "..456..", "input is correct");
    assert.equal(this.input[0].selectionStart, 7, "selection start is correct");
    assert.equal(this.input[0].selectionEnd, 7, "selection end is correct");
});

QUnit.test("symbols should be selected if a simlpe format is used with 'replaceAfterCaret' option", function(assert) {
    this.instance.option("displayFormat.formatter", sinon.stub().returns("456.."));
    this.instance.option("displayFormat.replaceAfterCaret", true);
    this.instance.option("value", 456);

    assert.equal(this.input.val(), "456..", "input is correct");
    assert.equal(this.input[0].selectionStart, 3, "selection start is correct");
    assert.equal(this.input[0].selectionEnd, 5, "selection end is correct");
});

QUnit.skip("backspace should work with complex format", function(assert) {
    var formatterStub = sinon.stub();

    formatterStub
        .withArgs(123)
        .returns("123.")
        .withArgs(12)
        .returns("12.");

    this.instance.option("displayFormat.formatter", formatterStub);
    var formatType = "fixedpoint";

    // COMPLEX_FORMATS.forEach(function(formatType) {
    this.instance.option("displayFormat.type", formatType);
    this.instance.option("value", 123);
    this.keyboard.press("backspace");

    assert.equal(this.input.val(), "12.", "input is correct for '" + formatType + "'");
    assert.equal(this.input[0].selectionStart, 2, "selection start is correct for '" + formatType + "'");
    assert.equal(this.input[0].selectionEnd, 3, "selection end is correct for '" + formatType + "'");
    // }.bind(this));
});
