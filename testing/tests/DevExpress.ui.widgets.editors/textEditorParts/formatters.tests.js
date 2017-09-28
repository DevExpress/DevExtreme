"use strict";

var $ = require("jquery"),
    numberParserGenerator = require("core/utils/number_parser_generator"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

QUnit.module("displayFormat option", {
    beforeEach: function() {
        this.$element = $("#texteditor").dxTextEditor({
            displayFormat: "#.##"
        });
        this.input = this.$element.find(".dx-texteditor-input");
        this.instance = this.$element.dxTextEditor("instance");
        this.keyboard = keyboardMock(this.input, true);
    }
});

QUnit.test("empty value should not be formatted", function(assert) {
    assert.equal(this.input.val(), "", "value is empty");
});

QUnit.test("parser should work with strict formats", function(assert) {
    this.instance.option("displayFormat", "#0.00");

    this.keyboard.type("1").input();
    assert.equal(this.input.val(), "1.00", "1 typed");

    this.keyboard.type("2").input();
    assert.equal(this.input.val(), "12.00", "2 typed");

    this.keyboard.type(".4").input();
    assert.equal(this.input.val(), "12.40", ".4 typed");

    this.keyboard.type("5").input();
    assert.equal(this.input.val(), "12.45", "5 typed");
});

QUnit.test("format should be applied on input", function(assert) {
    this.keyboard.type("12e-3.456");
    assert.equal(this.input.val(), "123.45", "value is correct");
});

QUnit.test("format should be applied on value change", function(assert) {
    this.instance.option("value", 12.34);
    assert.equal(this.input.val(), "12.34", "value is correct");
});

QUnit.test("typing a symbol should insert or replace a value", function(assert) {
    this.instance.option("value", 123.45);

    this.keyboard.caret(2).type("7");
    assert.equal(this.input.val(), "1273.45", "value is correct");

    this.keyboard.caret(4).type(".89");
    assert.equal(this.input.val(), "1273.89", "value is correct");
});

QUnit.test("parser should be refreshed when displayFormat option changed", function(assert) {
    var parserGeneratorMock = sinon.spy(numberParserGenerator, "generateNumberParser");

    try {
        this.instance.option({
            displayFormat: "#.00",
            value: 123.45
        });

        assert.equal(parserGeneratorMock.callCount, 1, "parser was refreshed once");
        assert.equal(parserGeneratorMock.getCall(0).args[0], "#.00", "parser was refreshed with correct argument");
    } finally {
        parserGeneratorMock.restore();
    }
});

QUnit.test("removing a symbol should try replace it to 0", function(assert) {
    this.instance.option({
        displayFormat: "#.000",
        value: 123.456
    });

    this.keyboard.caret(2).press("del").input();
    assert.equal(this.input.val(), "12.456", "it is possible to remove a char");

    this.keyboard.press("del").input();
    assert.equal(this.input.val(), "12.056", "it is impossible to remove a point");

    this.keyboard.press("del").input();
    assert.equal(this.input.val(), "12.006", "char was replaced to 0");
});
