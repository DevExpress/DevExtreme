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
    this.keyboard.type("12e*3.456");
    assert.equal(this.input.val(), "123.46", "value is correct");
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

QUnit.skip("removing required symbol should try replace it to 0", function(assert) {
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

QUnit.test("pressing '-' button should revert the number", function(assert) {
    this.instance.option({
        displayFormat: "#.000",
        value: 123.456
    });

    this.keyboard.press("-");
    assert.equal(this.input.val(), "-123.456", "value is correct");

    this.keyboard.caret(2).press("-");
    assert.equal(this.input.val(), "123.456", "value is correct");
});

QUnit.test("clear input value should clear a formatted value", function(assert) {
    this.instance.option({
        displayFormat: "#.000",
        value: 123
    });

    this.keyboard
        .caret({ start: 0, end: 7 })
        .press("backspace")
        .input()
        .change();


    assert.equal(this.input.val(), "", "value is empty");
});

QUnit.test("new value should correctly apply after clear an old one", function(assert) {
    this.instance.option({
        displayFormat: "#.000",
        value: 123
    });

    this.keyboard
        .caret({ start: 0, end: 7 })
        .press("backspace")
        .input()
        .type("2")
        .input();


    assert.equal(this.input.val(), "2.000", "value is correct");
});

QUnit.test("replace all text should work correctly", function(assert) {
    this.instance.option({
        displayFormat: "#.000",
        value: 123
    });

    this.keyboard
        .caret({ start: 0, end: 7 })
        .type("4")
        .input()
        .change();

    assert.equal(this.input.val(), "4.000", "value is correct");
});

QUnit.test("displayFormat with stub symbol", function(assert) {
    this.instance.option({
        displayFormat: "$#"
    });

    this.keyboard
        .type("12")
        .input()
        .change();

    assert.equal(this.input.val(), "$12", "value is correct");
});

QUnit.test("update whole value in case when displayFormat contains a stub symbols", function(assert) {
    this.instance.option({
        displayFormat: "$#",
        value: 1
    });

    this.keyboard
        .caret({ start: 0, end: 3 })
        .type("23")
        .input()
        .change();


    assert.equal(this.input.val(), "$23", "value is correct");

});

QUnit.test("displayFormat with several stub symbols", function(assert) {
    this.instance.option({
        displayFormat: "$$#",
        value: 1
    });

    this.keyboard
        .caret({ start: 0, end: 3 })
        .type("23")
        .input()
        .change();


    assert.equal(this.input.val(), "$$23", "value is correct");

});

QUnit.test("remove stub symbol", function(assert) {
    this.instance.option({
        displayFormat: "$$#",
        value: 1
    });

    this.keyboard
        .caret({ start: 2, end: 2 })
        .press("backspace")
        .input();


    assert.equal(this.input.val(), "$$1", "do not remove a stub symbol");

});

QUnit.skip("displayFormat with escaped symbol", function(assert) {
    //parser should work with escaping
    this.instance.option({
        displayFormat: "$'#'$#"
    });

    this.keyboard
        .type("12")
        .input()
        .change();

    assert.equal(this.input.val(), "$#$12", "value is correct");
});

QUnit.test("commonly used formats", function(assert) {
    var formats = [
        { format: '$ #.##', value: 123.456, expected: "$ 123.46" },
        { format: '#.## р', value: 123.456, expected: "123.46 р" },
        // { format: '#,##0 р', value: 12345.678, expected: "12,345.678 р" },
        // { format: '$ #,##0', value: 1234.567, expected: "$ 1,234.567" },
        { format: '$ #.##;($ #.##)', value: -123.456, expected: "($ 123.46)" },
        { format: '#.## р;($ #.##) р', value: 123.456, expected: "123.46 р" },
        // { format: '$ #,##0;($ #,##0)', value: 1234.567, expected: "$ 1,234.567" },
        // { format: '$ #,##0 mil;($ #,##0 mil)', value: 123.45, expected: "$ 123.450 mil" },
        { format: '#.##%', value: 123.456, expected: "12345.60%" },
        { format: '#.00%', value: 123.456, expected: "12345.60%" },
        // { format: '#,##.00%', value: 123.456, expected: "12,345.60%" },
        { format: '0#.###', value: 1.234, expected: "01.234" },
        { format: '0000', value: 123.456, expected: "0123" }
    ];

    formats.forEach(function(format) {
        this.instance.option("value", "");
        this.instance.option("displayFormat", format.format);
        this.instance.option("value", format.value);

        assert.equal(this.input.val(), format.expected, format.format + " with value " + format.value + " is correct");
    }.bind(this));
});
