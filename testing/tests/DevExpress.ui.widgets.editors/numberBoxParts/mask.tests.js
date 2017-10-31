"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

require("ui/text_box/ui.text_editor");

var INPUT_CLASS = "dx-texteditor-input";

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
    var NUMPAD_MINUS_KEY = 109,
        MINUS_KEY = 189;

    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.keyDown(NUMPAD_MINUS_KEY);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");

    this.keyboard.caret(2).keyDown(NUMPAD_MINUS_KEY);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");

    this.keyboard.keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");

    this.keyboard.caret(2).keyDown(MINUS_KEY);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");
});


QUnit.module("format: minimum and maximum", moduleConfig);

QUnit.test("input should be prevented when digit is not in range", function(assert) {
    this.instance.option({
        min: 5,
        max: 10
    });

    this.keyboard.type("4");
    assert.equal(this.input.val(), "", "input for incorrect digit was prevented");
});

QUnit.test("input should not be prevented if digit + '0' is in range", function(assert) {
    this.instance.option({
        min: 5,
        max: 40
    });

    this.keyboard.type("4");
    assert.equal(this.input.val(), "4", "input for digit was not prevented");
});

QUnit.test("invert sign should be prevented if minimum is larger than 0", function(assert) {
    var MINUS_KEY = 189;

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

QUnit.test("left arrow limitation", function(assert) {
    this.instance.option({
        format: "$#",
        value: 1
    });

    assert.equal(this.input.val(), "$1", "text is correct");

    this.keyboard.caret(1).keyDown("left");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event is prevented");
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
