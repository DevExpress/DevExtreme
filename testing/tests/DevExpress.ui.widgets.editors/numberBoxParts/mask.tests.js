"use strict";

var $ = require("jquery"),
    config = require("core/config"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

var INPUT_CLASS = "dx-texteditor-input",
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

QUnit.test("pressing '-' button should revert the number", function(assert) {
    var NUMPAD_MINUS_KEY = 109;

    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.caret(3).keyDown(NUMPAD_MINUS_KEY);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is correct");

    this.keyboard.keyDown(NUMPAD_MINUS_KEY);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret is correct");

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is correct");

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret is correct");
});

QUnit.test("pressing '-' button should revert zero number", function(assert) {
    this.instance.option({
        format: "#0",
        value: 0
    });

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "-0", "text is correct");
    assert.equal(1 / this.instance.option("value"), -Infinity, "value is negative");

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "0", "text is correct");
    assert.equal(1 / this.instance.option("value"), Infinity, "value is positive");
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

QUnit.test("widget should not crash when it is disposing on change", function(assert) {
    this.instance.option({
        value: 1,
        onValueChanged: function(e) {
            e.component._dispose();
        }
    });

    this.keyboard.type("2").change();

    assert.ok(true, "there was no exceptions");
});


QUnit.module("format: minimum and maximum", moduleConfig);

QUnit.test("input should be fitted into range after value change", function(assert) {
    this.instance.option({
        min: 1,
        max: 4,
        value: 0
    });

    this.instance.option("value", 5);
    assert.equal(this.input.val(), "5", "changing via api is customers responsibility");
    assert.equal(this.instance.option("value"), 5, "changing via api is customers responsibility");

    this.input.val("0");
    this.keyboard.input("0").change();
    assert.equal(this.input.val(), "1", "text is adjusted to min");
    assert.equal(this.instance.option("value"), 1, "value is adjusted to min");

    this.input.val("8");
    this.keyboard.input("8").change();
    assert.equal(this.input.val(), "4", "text is adjusted to max");
    assert.equal(this.instance.option("value"), 4, "value is adjusted to max");
});

QUnit.test("invert sign should be prevented if minimum is larger than 0", function(assert) {
    this.instance.option({
        min: 0,
        value: 4
    });

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "4", "reverting was prevented");
});

QUnit.test("17-digit value should not be parsed", function(assert) {
    this.instance.option("value", 999999999999999);
    this.keyboard.type("9");

    assert.equal(this.input.val(), "999999999999999", "input was prevented");
});

QUnit.test("17-digit negative value should not be parsed", function(assert) {
    this.instance.option("value", -999999999999999);
    this.keyboard.type("9");

    assert.equal(this.input.val(), "-999999999999999", "input was prevented");
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

QUnit.test("paste value from clipboard", function(assert) {
    this.instance.option({
        format: "$ #,##0.000",
        value: 0.5
    });

    assert.equal(this.input.val(), "$ 0.500", "value before paste");

    this.keyboard.caret(3);
    this.input.val("$ 01234.500");
    this.keyboard.press("ctrl+v");
    this.keyboard.input();

    assert.equal(this.input.val(), "$ 1,234.500", "value after paste");
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


QUnit.module("format: percent format", moduleConfig);

QUnit.test("percent format should work properly on value change", function(assert) {
    this.instance.option("format", "#0%");
    this.keyboard.type("45").change();

    assert.equal(this.input.val(), "45%", "text is correct");
    assert.equal(this.instance.option("value"), 0.45, "value is correct");
});

QUnit.test("non-ldml percent format should work properly on value change", function(assert) {
    this.instance.option("value", "");
    this.instance.option("format", "percent");
    this.keyboard.type("45").change();

    assert.equal(this.input.val(), "45%", "text is correct");
    assert.equal(this.instance.option("value"), 0.45, "value is correct");
});

QUnit.test("input before leading zero", function(assert) {
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
    assert.equal(this.input.val(), "$ 23.05 d", "required digit should be replaced to 0 after removing");
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
    assert.equal(this.input.val(), "$ 23.05 d", "required digit should be replaced to 0 after removing");
});

QUnit.test("removing non required char with negative value", function(assert) {
    this.instance.option("value", -123.45);

    this.keyboard.caret(6).press("del");
    assert.equal(this.input.val(), "-123.4", "value is correct");

    this.keyboard.press("backspace").input("backspace");
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

    this.keyboard.caret(3).press("backspace");
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

QUnit.test("removing required last char should replace it to 0", function(assert) {
    this.instance.option("value", 1);
    this.keyboard.caret(1).press("backspace").input("backspace");

    assert.equal(this.input.val(), "0", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret position is correct");
});

QUnit.test("removing required last char should replace it to 0 if percent format", function(assert) {
    this.instance.option("format", "#0%");
    this.instance.option("value", 0.01);
    this.keyboard.caret(1).press("backspace").input("backspace");

    assert.equal(this.input.val(), "0%", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret position is correct");
});

QUnit.test("removing required decimal digit should replace it to 0 and move caret", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 1.23
    });
    this.keyboard.caret(4).press("backspace").input("backspace");

    assert.equal(this.input.val(), "1.20", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret position is correct");
});

QUnit.test("removing integer digit using backspace if group separator is hiding", function(assert) {
    this.instance.option({
        format: "#,##0",
        value: 1234
    });
    this.keyboard.caret(4).press("backspace").input("backspace");

    assert.equal(this.input.val(), "124", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret position is correct");
});

QUnit.test("removing all characters should change value to null", function(assert) {
    this.instance.option({
        format: "$#0",
        value: 1
    });

    this.keyboard.caret({ start: 0, end: 2 }).press("backspace").input("backspace").change();

    assert.strictEqual(this.input.val(), "", "value is correct");
    assert.strictEqual(this.instance.option("value"), null, "value is reseted");
});

QUnit.test("removing all digits but not all characters should change value to 0", function(assert) {
    this.instance.option({
        format: "#0.0 kg",
        value: 1
    });

    this.keyboard.caret({ start: 0, end: 4 }).press("backspace").input("backspace").change();

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

    this.keyboard.caret(5).press("backspace").input("backspace");
    assert.equal(this.input.val(), "00123", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, "caret is correct");
});

QUnit.test("removing digit if decimal format with prefix", function(assert) {
    this.instance.option({
        format: "$00000",
        value: 1234
    });

    assert.equal(this.input.val(), "$01234", "value is correct");

    this.keyboard.caret(6).press("backspace").input("backspace");
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

        this.keyboard.caret(2).press("backspace").input("backspace");

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
