"use strict";

var $ = require("jquery"),
    config = require("core/config"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

var INPUT_CLASS = "dx-texteditor-input",
    PLACEHOLDER_CLASS = "dx-placeholder",
    MINUS_KEY = 189;

var moduleConfig = {
    beforeEach: function() {
        this.$element = $("#numberbox").dxNumberBox({
            format: "#0.##",
            value: "",
            useMaskBehavior: true
        });
        this.input = this.$element.find(".dx-texteditor-input");
        this.instance = this.$element.dxNumberBox("instance");
        this.keyboard = keyboardMock(this.input, true);
    }
};


QUnit.module("format: api value changing", moduleConfig);

QUnit.test("number type of input is not supported with masks", function(assert) {
    var $element = $("#numberbox").dxNumberBox({
            useMaskBehavior: true,
            format: "#",
            mode: "number"
        }),
        instance = $element.dxNumberBox("instance");

    assert.equal($element.find("." + INPUT_CLASS).prop("type"), "tel", "input has tel type");

    instance.option("mode", "number");
    assert.equal($element.find("." + INPUT_CLASS).prop("type"), "tel", "user can not set number type with mask");
});

QUnit.test("empty value should not be formatted", function(assert) {
    this.instance.option("value", "");
    assert.equal(this.input.val(), "", "value is empty");
});

QUnit.test("format should be applied on value change", function(assert) {
    this.instance.option("value", 12.34);
    assert.equal(this.input.val(), "12.34", "value is correct");
});

QUnit.test("value should be reformatted when format option changed", function(assert) {
    this.instance.option("value", 123);
    assert.equal(this.input.val(), "123", "value is correct");

    this.instance.option("format", "#.00");
    assert.equal(this.input.val(), "123.00", "value was reformatted");
});

QUnit.test("setting value to undefined should work correctly", function(assert) {
    this.instance.option({
        format: "#0",
        value: 667
    });

    this.instance.option("value", "");
    this.instance.option("value", undefined);

    assert.strictEqual(this.input.val(), "", "value is correct");
    assert.strictEqual(this.instance.option("value"), undefined, "value is correct");
});

QUnit.test("widget should not crash when it is disposing on change (T578115)", function(assert) {
    this.instance.option({
        value: 1,
        onValueChanged: function(e) {
            e.component.dispose();
        }
    });

    this.keyboard.type("2").change();

    assert.ok(true, "there was no exceptions");
});

QUnit.test("api value changing should hide a placeholder", function(assert) {
    this.instance.option({
        format: "$ #0",
        placeholder: "Enter number"
    });

    var $placeholder = this.$element.find("." + PLACEHOLDER_CLASS);

    assert.ok($placeholder.is(":visible"), "placeholder is visible");

    this.instance.option("value", 1);

    assert.equal(this.input.val(), "$ 1", "text is correct");
    assert.notOk($placeholder.is(":visible"), "placeholder is hidden");
});


QUnit.module("format: sign and minus button", moduleConfig);

QUnit.test("pressing '-' button should revert the number", function(assert) {
    var NUMPAD_MINUS_KEY = 109;

    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.caret(3).keyDown(NUMPAD_MINUS_KEY).input("-");
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value should not be changed before valueChange event");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is correct");
    this.keyboard.change();
    assert.equal(this.instance.option("value"), -123.456, "value has been changed after valueChange event");

    this.keyboard.keyDown(NUMPAD_MINUS_KEY).input("-");
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value should not be changed before valueChange event");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret is correct");
    this.keyboard.change();
    assert.equal(this.instance.option("value"), 123.456, "value has been changed after valueChange event");

    this.keyboard.caret(3).keyDown(MINUS_KEY).input("-");
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value should not be changed before valueChange event");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is correct");
    this.keyboard.change();
    assert.equal(this.instance.option("value"), -123.456, "value has been changed after valueChange event");

    this.keyboard.keyDown(MINUS_KEY).input("-");
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value should not be changed before valueChange event");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret is correct");
    this.keyboard.change();
    assert.equal(this.instance.option("value"), 123.456, "value has been changed after valueChange event");
});

QUnit.test("pressing '-' button should revert zero number", function(assert) {
    this.instance.option({
        format: "#0",
        value: 0
    });

    this.keyboard.keyDown(MINUS_KEY).input("-").change();
    assert.equal(this.input.val(), "-0", "text is correct");
    assert.equal(1 / this.instance.option("value"), -Infinity, "value is negative");

    this.keyboard.keyDown(MINUS_KEY).input("-").change();
    assert.equal(this.input.val(), "0", "text is correct");
    assert.equal(1 / this.instance.option("value"), Infinity, "value is positive");
});

QUnit.test("pressing '-' with different positive and negative parts", function(assert) {
    this.instance.option({
        format: "$ #0;($ #0)",
        value: 123
    });

    this.keyboard.keyDown(MINUS_KEY).input("-").change();
    assert.equal(this.input.val(), "($ 123)", "text is correct");
    assert.equal(this.instance.option("value"), -123, "value is negative");

    this.keyboard.keyDown(MINUS_KEY).input("-").change();
    assert.equal(this.input.val(), "$ 123", "text is correct");
    assert.equal(this.instance.option("value"), 123, "value is positive");
});

QUnit.test("focusout after inverting sign should not lead to value changing", function(assert) {
    this.instance.option("value", -123);

    //note: keyboard mock keyDown send wrong key for '-' and can not be used here
    this.input.trigger($.Event("keydown", { keyCode: MINUS_KEY, which: MINUS_KEY, key: "-" }));
    this.keyboard.caret(3).input("-");
    this.keyboard.blur().change();

    assert.equal(this.input.val(), "123", "text is correct");
    assert.equal(this.instance.option("value"), 123, "value is correct");
});

QUnit.module("format: fixed point format", moduleConfig);

QUnit.test("value should be formatted on first input", function(assert) {
    this.instance.option("format", "#0.00");

    this.keyboard.type("1");
    assert.equal(this.input.val(), "1.00", "required digits was added on first input");
});

QUnit.test("extra decimal points should be ignored", function(assert) {
    this.instance.option("format", "#0.00");

    this.keyboard.type("2..05");
    assert.equal(this.input.val(), "2.05", "text is correct");
});

QUnit.test("value should be rounded to the nearest digit on input an extra float digits", function(assert) {
    this.instance.option("format", "#0.00");

    this.keyboard.type("2.057").change();
    assert.equal(this.input.val(), "2.06", "text is correct");
    assert.equal(this.instance.option("value"), 2.06, "value is correct");
});

QUnit.test("required digits should be replaced on input", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 1.23
    });

    this.keyboard.caret(2).type("45");
    assert.equal(this.input.val(), "1.45", "text is correct");
});

QUnit.test("removing required value should replace it to 0", function(assert) {
    this.instance.option({
        format: "#0.000",
        value: 1.234
    });

    this.keyboard.caret(3).press("backspace");
    assert.equal(this.input.val(), "1.340", "backspace works");

    this.keyboard.press("del");
    assert.equal(this.input.val(), "1.400", "delete works");
});

QUnit.test("removing decimal point should move the caret", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 1.23
    });

    this.keyboard.caret(2).press("backspace");
    assert.deepEqual(this.keyboard.caret().start, 1, "caret was moved");
});

QUnit.test("removing last integer should replace it to 0", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 1.23
    });

    this.keyboard.caret(1).press("backspace");
    assert.equal(this.input.val(), "0.23", "integer was replaced to 0");
});

QUnit.test("input with non-required digit", function(assert) {
    this.instance.option("format", "#0.##");

    this.keyboard.type("1");
    assert.equal(this.input.val(), "1", "extra digits should not be shown");

    this.keyboard.type("..");
    assert.equal(this.input.val(), "1.", "extra point should be prevented");

    this.keyboard.type("0");
    assert.equal(this.input.val(), "1.0", "zero should not be rounded");

    this.keyboard.type("56");
    assert.equal(this.input.val(), "1.06", "extra digit should be rounded");
});

QUnit.test("removed digits should not be replaced to 0 when they are not required", function(assert) {
    this.instance.option({
        format: "#0.##",
        value: 1.23
    });

    this.keyboard.caret(3).press("backspace");
    assert.equal(this.input.val(), "1.3", "digit was removed");

    this.keyboard.press("del").change();
    assert.equal(this.input.val(), "1", "decimal point was removed together with last float digit");
});


QUnit.module("format: minimum and maximum", moduleConfig);

QUnit.test("invert sign should be prevented if minimum is larger than 0", function(assert) {
    this.instance.option({
        min: 0,
        value: 4
    });

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "4", "reverting was prevented");
});

QUnit.test("integer should not be longer than 15 digit", function(assert) {
    this.instance.option("value", 999999999999999);
    this.keyboard.caret(15).type("5");

    assert.equal(this.input.val(), "999999999999999", "input was prevented");
});

QUnit.test("negative integer should not be longer than 15 digit", function(assert) {
    this.instance.option("value", -999999999999999);
    this.keyboard.caret(16).type("5");

    assert.equal(this.input.val(), "-999999999999999", "input was prevented");
});

QUnit.test("15-digit value with decimal part should be parsed", function(assert) {
    this.instance.option("format", "#0.####");
    this.instance.option("value", 9999999999.999);
    this.keyboard.caret(14).type("9");

    assert.equal(this.input.val(), "9999999999.9999", "input was not prevented");
});

QUnit.test("boundary value should correctly apply after second try to set overflow value", function(assert) {
    this.instance.option({
        min: 1,
        max: 4,
        value: 2
    });

    this.input.val("");
    this.keyboard
        .type("6")
        .press("enter")
        .change();

    assert.equal(this.input.val(), "4", "text is adjusted to max");
    assert.equal(this.instance.option("value"), 4, "value is adjusted to max");

    this.input.val("");
    this.keyboard
        .type("7")
        .press("enter")
        .change();

    assert.equal(this.input.val(), "4", "text is adjusted to max second time");
    assert.equal(this.instance.option("value"), 4, "value is adjusted to max second time");

    this.input.val("");
    this.keyboard
        .type("0")
        .press("enter")
        .change();

    assert.equal(this.input.val(), "1", "text is adjusted to min");
    assert.equal(this.instance.option("value"), 1, "value is adjusted to min");
});


QUnit.module("format: text input", moduleConfig);

QUnit.test("invalid chars should be prevented on keydown", function(assert) {
    this.keyboard.type("12e*3.456");
    assert.equal(this.input.val(), "123.46", "value is correct");
});

QUnit.test("input should be correct with group separators", function(assert) {
    this.instance.option("format", "$ #,##0.00 d");

    this.keyboard.type("1234567.894");
    assert.equal(this.input.val(), "$ 1,234,567.89 d", "input is correct");
});

QUnit.test("select and replace all text", function(assert) {
    this.instance.option({
        format: "$ #.000 d",
        value: 123
    });

    this.keyboard
        .caret({ start: 0, end: 11 })
        .type("4");

    assert.equal(this.input.val(), "$ 4.000 d", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret position is correct");
});

QUnit.test("decimal point should move the caret before float part only", function(assert) {
    this.instance.option("value", 123.45);
    this.keyboard.caret(2).type(".");

    assert.equal(this.input.val(), "123.45", "value is right");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret was not moved");

    this.keyboard.caret(3).type(".");
    assert.equal(this.input.val(), "123.45", "value is right");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret was moved to the float part");
});

QUnit.test("ctrl+v should not be prevented", function(assert) {
    this.keyboard.keyDown("v", { ctrlKey: true });
    assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false, "keydown event is not prevented");
});

QUnit.test("incomplete input should not be prevented when there are stubs and zeros after the caret", function(assert) {
    this.instance.option({
        format: "#0.## kg",
        value: 123
    });

    this.keyboard.caret(3).type(".05");

    assert.equal(this.input.val(), "123.05 kg", "value is correct");
});

QUnit.test("leading zeros should be replaced on input", function(assert) {
    this.instance.option("format", "$ #0 d");
    this.instance.option("value", 0);

    assert.equal(this.input.val(), "$ 0 d", "value is correct");

    this.keyboard.caret(3).type("12");

    assert.equal(this.input.val(), "$ 12 d", "value is correct");
});

QUnit.test("leading zeros should not be replaced if input is before them", function(assert) {
    this.instance.option("format", "#0 d");
    this.instance.option("value", 0);

    assert.equal(this.input.val(), "0 d", "value is correct");

    this.keyboard.caret(0).type("12");

    assert.equal(this.input.val(), "120 d", "value is correct");
});

QUnit.test("it should be possible to input decimal point when valueChangeEvent is input (T580162)", function(assert) {
    this.instance.option("valueChangeEvent", "input");
    this.keyboard.type("1.5");

    assert.equal(this.input.val(), "1.5", "value is correct");
});

QUnit.test("enter should remove incomplete value chars from input", function(assert) {
    this.keyboard.type("123.").press("enter");
    assert.equal(this.input.val(), "123", "input was reformatted");
});

QUnit.testInActiveWindow("focusout should remove incomplete value chars from input", function(assert) {
    this.instance.option("value", 123);
    this.keyboard.caret(3).type(".").change().blur();
    assert.equal(this.input.val(), "123", "input was reformatted");
});


QUnit.module("format: percent format", moduleConfig);

QUnit.test("percent format should work properly on value change", function(assert) {
    this.instance.option("format", "#0%");
    this.keyboard.type("45").change();

    assert.equal(this.input.val(), "45%", "text is correct");
    assert.equal(this.instance.option("value"), 0.45, "value is correct");
});

QUnit.test("escaped percent should be parsed correctly", function(assert) {
    this.instance.option("format", "#0'%'");
    this.keyboard.type("123").change();

    assert.equal(this.input.val(), "123%", "text is correct");
    assert.equal(this.instance.option("value"), 123, "value is correct");
});

QUnit.test("non-ldml percent format should work properly on value change", function(assert) {
    this.instance.option("value", "");
    this.instance.option("format", "percent");
    this.keyboard.type("45").change();

    assert.equal(this.input.val(), "45%", "text is correct");
    assert.equal(this.instance.option("value"), 0.45, "value is correct");
});

QUnit.test("input before leading zero in percent format", function(assert) {
    this.instance.option("format", "#0%");
    this.instance.option("value", 0);

    this.keyboard.caret(0).type("45");

    assert.equal(this.input.val(), "450%", "text is correct");
});


QUnit.module("format: removing", moduleConfig);

QUnit.test("delete key", function(assert) {
    this.instance.option({
        format: "$ #0.00 d",
        value: 123.45
    });

    this.keyboard.caret(0).keyDown("del");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete should not remove a stub");

    this.keyboard.caret(2).keyDown("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("del");
    assert.equal(this.input.val(), "$ 23.45 d", "value is correct");

    this.keyboard.caret(4).keyDown("del");
    assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, "caret should be moved throug the point");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete should not remove a point");

    this.keyboard.caret(5).keyDown("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("del");
    assert.equal(this.input.val(), "$ 23.50 d", "required digit should be replaced to 0 after removing");
});

QUnit.test("backspace key", function(assert) {
    this.instance.option({
        format: "$ #0.00 d",
        value: 123.45
    });

    this.keyboard.caret(1).keyDown("backspace");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete should not remove a stub");

    this.keyboard.caret(3).keyDown("backspace");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("backspace");
    assert.equal(this.input.val(), "$ 23.45 d", "value is correct");

    this.keyboard.caret(5).keyDown("backspace");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret should be moved throug the point");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete should not remove a point");

    this.keyboard.caret(6).keyDown("backspace");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("backspace");
    assert.equal(this.input.val(), "$ 23.50 d", "required digit should be replaced to 0 after removing");
});

QUnit.test("removing non required char with negative value", function(assert) {
    this.instance.option("value", -123.45);

    this.keyboard.caret(6).press("del");
    assert.equal(this.input.val(), "-123.4", "value is correct");

    this.keyboard.press("backspace").change();
    assert.equal(this.input.val(), "-123", "value is correct");
});

QUnit.test("removing with group separators using delete key", function(assert) {
    this.instance.option({
        format: "$ #,##0.## d",
        value: 1234567890
    });

    assert.equal(this.input.val(), "$ 1,234,567,890 d", "value is correct");

    this.keyboard.caret(2).keyDown("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("del");
    assert.equal(this.input.val(), "$ 234,567,890 d", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret is good");

    this.keyboard.caret(5).keyDown("del");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete was prevented before separator");

    this.keyboard.caret({ start: 4, end: 11 }).keyDown("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.input.val("$ 2390 d");
    this.keyboard.caret({ start: 4, end: 4 });
    this.keyboard.input("del");
    assert.equal(this.input.val(), "$ 2,390 d", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, "caret is good after selection removing");
});

QUnit.test("removing with group separators using backspace key", function(assert) {
    this.instance.option({
        format: "$ #,##0.## d",
        value: 1234567890
    });

    assert.equal(this.input.val(), "$ 1,234,567,890 d", "value is correct");

    this.keyboard.caret(3).keyDown("backspace");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("backspace");
    assert.equal(this.input.val(), "$ 234,567,890 d", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret is good");

    this.keyboard.caret(6).keyDown("backspace");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "delete was prevented after separator");

    this.keyboard.caret({ start: 4, end: 11 }).keyDown("backspace");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "delete should not be prevented");
    this.keyboard.input("backspace");
    assert.equal(this.input.val(), "$ 2,390 d", "value is correct");
});

QUnit.test("removing required last char should not replace it to 0", function(assert) {
    this.instance.option("value", 1);
    this.keyboard.caret(1).press("backspace");

    assert.equal(this.input.val(), "", "value is correct");
});

QUnit.test("removing required last char should replace it to 0 if percent format", function(assert) {
    this.instance.option("format", "#0%");
    this.instance.option("value", 0.01);
    this.keyboard.caret(1).press("backspace");

    assert.equal(this.input.val(), "0%", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret position is correct");
});

QUnit.test("removing required decimal digit should replace it to 0 and move caret", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 1.23
    });
    this.keyboard.caret(4).press("backspace");

    assert.equal(this.input.val(), "1.20", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret position is correct");
});

QUnit.test("removing integer digit using backspace if group separator is hiding", function(assert) {
    this.instance.option({
        format: "#,##0",
        value: 1234
    });
    this.keyboard.caret(4).press("backspace");

    assert.equal(this.input.val(), "124", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret position is correct");
});

QUnit.test("removing all characters should change value to null", function(assert) {
    this.instance.option({
        format: "$#0",
        value: 1
    });

    this.keyboard.caret({ start: 0, end: 2 }).press("backspace").change();

    assert.strictEqual(this.input.val(), "", "value is correct");
    assert.strictEqual(this.instance.option("value"), null, "value is reseted");
});

QUnit.test("removing all digits but not all characters should change value to 0", function(assert) {
    this.instance.option({
        format: "#0.0 kg",
        value: 1
    });

    this.keyboard.caret({ start: 0, end: 4 }).press("backspace").change();

    assert.strictEqual(this.input.val(), "0.0 kg", "value is correct");
    assert.strictEqual(this.instance.option("value"), 0, "value is reseted");
});

QUnit.test("removing all digits should save the sign", function(assert) {
    this.instance.option({
        format: "#0 kg",
        value: -1
    });

    this.keyboard.caret({ start: 2, end: 2 }).press("backspace").input("backspace");

    assert.strictEqual(this.input.val(), "-0 kg", "text is correct");
});

QUnit.test("removing last digit 0 should save the sign", function(assert) {
    this.instance.option({
        format: "#0 kg",
        value: -0
    });

    this.keyboard.caret({ start: 2, end: 2 }).press("backspace").input("backspace");

    assert.strictEqual(this.input.val(), "-0 kg", "text is correct");
});

QUnit.test("removing digit if decimal format", function(assert) {
    this.instance.option({
        format: "00000",
        value: 1234
    });

    assert.equal(this.input.val(), "01234", "value is correct");

    this.keyboard.caret(5).press("backspace");
    assert.equal(this.input.val(), "00123", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, "caret is correct");
});

QUnit.test("removing digit if decimal format with prefix", function(assert) {
    this.instance.option({
        format: "$00000",
        value: 1234
    });

    assert.equal(this.input.val(), "$01234", "value is correct");

    this.keyboard.caret(6).press("backspace");
    assert.equal(this.input.val(), "$00123", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 6, end: 6 }, "caret is correct");
});

QUnit.test("removing decimal separator if decimal separator is not default", function(assert) {
    var oldDecimalSeparator = config().decimalSeparator;

    config({ decimalSeparator: "," });

    try {
        this.instance.option({
            format: "#0.00",
            value: 1
        });

        this.keyboard.caret(2).press("backspace");

        assert.equal(this.input.val(), "1,00", "text is correct");
        assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret is moved");
    } finally {
        config({ decimalSeparator: oldDecimalSeparator });
    }
});


QUnit.module("format: caret boundaries", moduleConfig);

QUnit.test("right arrow limitation", function(assert) {
    this.instance.option({
        format: "#d",
        value: 1
    });

    assert.equal(this.input.val(), "1d", "text is correct");

    this.keyboard.caret(1).keyDown("right");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event is prevented");
});

QUnit.test("right arrow after select all", function(assert) {
    this.instance.option({
        format: "# d",
        value: 1
    });

    assert.equal(this.input.val(), "1 d", "text is correct");

    this.keyboard.caret({ start: 0, end: 3 }).keyDown("right");

    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret is after last digit");
});

QUnit.test("left arrow limitation", function(assert) {
    this.instance.option({
        format: "$#",
        value: 1
    });

    assert.equal(this.input.val(), "$1", "text is correct");

    this.keyboard.caret(1).keyDown("left");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event is prevented");
});

QUnit.test("left arrow after select all", function(assert) {
    this.instance.option({
        format: "$ #0",
        value: 1
    });

    assert.equal(this.input.val(), "$ 1", "text is correct");

    this.keyboard.caret({ start: 0, end: 3 }).keyDown("left");

    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret is before first digit");
});

QUnit.test("home button limitation", function(assert) {
    this.instance.option({
        format: "$#",
        value: 1
    });

    assert.equal(this.input.val(), "$1", "text is correct");

    this.keyboard.caret(2).keyDown("home");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret is on the boundary");
});

QUnit.test("end button limitation", function(assert) {
    this.instance.option({
        format: "#d",
        value: 1
    });

    assert.equal(this.input.val(), "1d", "text is correct");

    this.keyboard.caret(0).keyDown("end");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret is on the boundary");
});

QUnit.test("shift+home and shift+end should have default behavior", function(assert) {
    this.keyboard.keyDown("home", { shiftKey: true });
    assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false);

    this.keyboard.keyDown("end", { shiftKey: true });
    assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false);
});

QUnit.test("ctrl+a should have default behavior", function(assert) {
    this.keyboard.keyDown("a", { ctrlKey: true });
    assert.deepEqual(this.keyboard.event.isDefaultPrevented(), false);
});

QUnit.test("moving caret to closest non stub on click - forward direction", function(assert) {
    this.instance.option({
        format: "$ #",
        value: 1
    });

    this.keyboard.caret(0);
    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret was adjusted");
});

QUnit.test("moving caret to closest non stub on click - backward direction", function(assert) {
    this.instance.option({
        format: "#d",
        value: 1
    });

    this.keyboard.caret(2);
    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret was adjusted");
});

QUnit.test("move caret to the end when only stubs remain in the input", function(assert) {
    this.instance.option({
        format: "$ #",
        value: 1
    });

    this.keyboard.caret(3)
        .press("backspace");

    assert.equal(this.input.val(), "$ ", "text is correct");

    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret was adjusted");
});

QUnit.test("move caret to the start when only stubs remain in the input", function(assert) {
    this.instance.option({
        format: "# p",
        value: 1
    });

    this.keyboard.caret(1)
        .press("backspace");

    assert.equal(this.input.val(), " p", "text is correct");

    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 0, end: 0 }, "caret was adjusted");
});

QUnit.test("caret should not move out of the boundaries when decimal separator was typed in percent format", function(assert) {
    this.instance.option({
        format: "#0%",
        value: 0.01
    });

    this.keyboard.caret(1).type(".");

    assert.equal(this.keyboard.caret().start, 1, "caret should not move when decimal part is disabled");
});

QUnit.test("caret should not move out of the boundaries when non-available digit was typed", function(assert) {
    this.instance.option({
        format: "#0.00 kg",
        value: 1.23
    });

    this.keyboard.caret(4).type("1");

    assert.equal(this.keyboard.caret().start, 4, "caret should not move");
});
