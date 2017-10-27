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

QUnit.module("format option", moduleConfig);

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

QUnit.test("parser should work with strict formats", function(assert) {
    this.instance.option("value", "");
    this.instance.option("format", "#0.00");

    this.keyboard.type("1");
    assert.equal(this.input.val(), "1.00", "1 typed");

    this.keyboard.type("2");
    assert.equal(this.input.val(), "12.00", "2 typed");

    this.keyboard.type(".4");
    assert.equal(this.input.val(), "12.40", ".4 typed");

    this.keyboard.type("5");
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

QUnit.test("value should be reformatted when format option changed", function(assert) {
    this.instance.option("value", 123);
    assert.equal(this.input.val(), "123", "value is correct");

    this.instance.option("format", "#.00");
    assert.equal(this.input.val(), "123.00", "value was reformatted");
});

QUnit.skip("removing required symbol should try replace it to 0", function(assert) {
    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.caret(2).press("del").input();
    assert.equal(this.input.val(), "12.456", "remove before point");

    this.keyboard.press("del").input();
    assert.equal(this.input.val(), "12.056", "remove point");

    this.keyboard.press("del").input();
    assert.equal(this.input.val(), "12.006", "remove after point");
});

QUnit.test("pressing NumPad '-' button should revert the number", function(assert) {
    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.keyDown(109);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");

    this.keyboard.caret(2).keyDown(109);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");
});

QUnit.test("pressing '-' button should revert the number", function(assert) {
    this.instance.option({
        format: "#.000",
        value: 123.456
    });

    this.keyboard.keyDown(189);
    assert.equal(this.input.val(), "-123.456", "value is correct");
    assert.equal(this.instance.option("value"), -123.456, "value is correct");

    this.keyboard.caret(2).keyDown(189);
    assert.equal(this.input.val(), "123.456", "value is correct");
    assert.equal(this.instance.option("value"), 123.456, "value is correct");
});

QUnit.test("clear input value should clear a formatted value", function(assert) {
    this.instance.option({
        format: "#.000",
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
        format: "#.000",
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
        format: "#.000",
        value: 123
    });

    this.keyboard
        .caret({ start: 0, end: 7 })
        .type("4")
        .input()
        .change();

    assert.equal(this.input.val(), "4.000", "value is correct");
});

QUnit.test("format with stub symbol", function(assert) {
    this.instance.option({
        format: "$#"
    });

    this.keyboard
        .type("12")
        .input()
        .change();

    assert.equal(this.input.val(), "$12", "value is correct");
});

QUnit.test("update whole value in case when format contains a stub symbols", function(assert) {
    this.instance.option({
        format: "$#",
        value: 1
    });

    this.keyboard
        .caret({ start: 0, end: 3 })
        .type("23")
        .change();

    assert.equal(this.input.val(), "$23", "value is correct");

});

QUnit.test("format with several stub symbols", function(assert) {
    this.instance.option({
        format: "$$#",
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
        format: "$$#",
        value: 1
    });

    this.keyboard
        .caret({ start: 2, end: 2 })
        .press("backspace")
        .input();

    assert.equal(this.input.val(), "$$1", "do not remove a stub symbol");

});

QUnit.skip("format with escaped symbol", function(assert) {
    //todo: built-in localization bug: parser should work with escaped strings
    this.instance.option({
        format: "$'#'$#"
    });

    this.keyboard
        .type("12")
        .change();

    assert.equal(this.input.val(), "$#$12", "value is correct");
});

QUnit.test("removing decimal point should not change the value", function(assert) {
    this.instance.option("value", 123.45);
    this.keyboard.caret(3).press("del").input();

    assert.equal(this.input.val(), "123.45", "value is correct");
});

QUnit.test("pressing float separator should not move the caret", function(assert) {
    this.instance.option("value", 123.45);
    this.keyboard.caret(2).type(".");

    assert.equal(this.input.val(), "123.45", "value is right");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret was not moved");

    this.keyboard.caret(3).type(".");
    assert.equal(this.input.val(), "123.45", "value is right");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret was moved to the float part");

});

QUnit.test("incorrect char didn't change an input value", function(assert) {
    this.instance.option({
        format: "#",
        value: 1234
    });

    this.keyboard
        .caret({ start: 1, end: 1 })
        .type("g")
        .input();

    assert.equal(this.input.val(), "1234", "value is the same");
});

QUnit.test("incorrect char didn't change a caret position", function(assert) {
    this.instance.option("value", 1234);

    this.keyboard
        .caret({ start: 1, end: 1 })
        .type("g")
        .input();

    var caret = this.keyboard.caret();

    assert.equal(caret.start, 1, "start position is the same");
    assert.equal(caret.end, 1, "end position is the same");
    assert.equal(this.input.val(), "1234", "value is the same");
});

QUnit.test("changing value to 0 should not clear the input", function(assert) {
    this.keyboard.type("0").change();

    assert.strictEqual(this.instance.option("value"), 0, "value is correct");
    assert.equal(this.input.val(), "0", "text is correct");
});

QUnit.test("removing first stub symbol should not clear the value", function(assert) {
    this.instance.option({
        format: "$ #",
        value: 123
    });

    this.keyboard.caret(1).press("backspace").input();

    assert.equal(this.input.val(), "$ 123", "value is correct");
});

QUnit.test("removing a char should work correctly with negative value", function(assert) {
    this.instance.option("value", -123.45);
    this.keyboard.caret(6).press("del");

    assert.equal(this.input.val(), "-123.4", "value is correct");
});

QUnit.test("changing of format option should reformat the input", function(assert) {
    this.instance.option("value", 0.5);
    assert.equal(this.input.val(), "0.5", "text is correct");

    this.instance.option("format", "#%");
    assert.equal(this.input.val(), "50%", "text was reformatted");
    assert.equal(this.instance.option("value"), 0.5, "value was not changed");
});

QUnit.test("percent format should work properly on value change", function(assert) {
    this.instance.option("value", "");
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

QUnit.test("removing a stub should not work", function(assert) {
    this.instance.option("format", "#%");
    this.instance.option("value", 1.23);

    assert.equal(this.input.val(), "123%", "initial value is correct");
    this.keyboard.caret(4).press("backspace").input().change();

    assert.equal(this.input.val(), "123%", "text is correct");
    assert.equal(this.instance.option("value"), 1.23, "value is correct");
});

QUnit.test("ctrl+v should not be prevented", function(assert) {
    this.keyboard.keyDown("v", { ctrlKey: true });
    assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false, "keydown event is not prevented");
});

QUnit.test("leading zeros should be parsed", function(assert) {
    this.instance.option("format", "$ #0");
    this.instance.option("value", 0);

    assert.equal(this.input.val(), "$ 0", "value is correct");

    this.keyboard.caret(3).type("1");

    assert.equal(this.input.val(), "$ 1", "value is correct");
});

QUnit.test("leading zeros without stubs should be parsed", function(assert) {
    this.instance.option("format", "#0$");
    this.instance.option("value", 0);

    assert.equal(this.input.val(), "0$", "value is correct");

    this.keyboard.caret(1).type("1");

    assert.equal(this.input.val(), "1$", "value is correct");
});

QUnit.test("incomplete enter should not be prevented when there are stubs after the caret", function(assert) {
    this.instance.option({
        format: "#0.## kg",
        value: 123
    });

    this.keyboard.caret(3).type(".45");

    assert.equal(this.input.val(), "123.45 kg", "value is correct");
});


QUnit.module("format: removing", moduleConfig);

QUnit.test("delete key should remove a char", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(2).press("del").input("del");
    assert.equal(this.input.val(), "12.45", "value is correct");
});

QUnit.test("delete key should not remove a point", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(3).keyDown("del");
    assert.equal(this.input.val(), "123.45", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is good");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event was prevented");
});

QUnit.test("delete key should not remove a stub", function(assert) {
    this.instance.option({
        format: "$ #0.00",
        value: 123.45
    });

    this.keyboard.caret(0).keyDown("del");
    assert.equal(this.input.val(), "$ 123.45", "value is correct");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event was prevented");
});

QUnit.test("delete key should replace required char to 0", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(4).keyDown("del").input("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "event was not prevented");
    assert.equal(this.input.val(), "123.05", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 5, end: 5 }, "caret is good");
});

QUnit.test("delete key should replace required chars in selection to 0", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret({ start: 2, end: 6 }).press("del").input("del");
    assert.notOk(this.keyboard.event.isDefaultPrevented(), "event was not prevented");
    assert.equal(this.input.val(), "12.00", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret is good");
});

QUnit.test("backspace key should remove a char", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(2).press("backspace").input("backspace");
    assert.equal(this.input.val(), "13.45", "value is correct");
});

QUnit.test("backspace key should not remove a point", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(4).keyDown("backspace");
    assert.equal(this.input.val(), "123.45", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 3, end: 3 }, "caret is good");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event was prevented");
});

QUnit.test("backspace key should replace required char to 0", function(assert) {
    this.instance.option({
        format: "#0.00",
        value: 123.45
    });

    this.keyboard.caret(5).press("backspace").input("backspace");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event was not prevented");
    assert.equal(this.input.val(), "123.05", "value is correct");
    assert.deepEqual(this.keyboard.caret(), { start: 4, end: 4 }, "caret is good");
});

QUnit.test("backspace key should not remove a stub", function(assert) {
    this.instance.option({
        format: "$ #0.00",
        value: 123.45
    });

    this.keyboard.caret(2).keyDown("backspace");
    assert.equal(this.input.val(), "$ 123.45", "value is correct");
    assert.ok(this.keyboard.event.isDefaultPrevented(), "event was prevented");
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

QUnit.test("moving caret to closest non stub - forward direction", function(assert) {
    this.instance.option({
        format: "$ #",
        value: 1
    });

    this.keyboard.caret(0);
    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 2, end: 2 }, "caret was adjusted");
});

QUnit.test("moving caret to closest non stub - backward direction", function(assert) {
    this.instance.option({
        format: "#d",
        value: 1
    });

    this.keyboard.caret(2);
    this.input.trigger("dxclick");

    assert.deepEqual(this.keyboard.caret(), { start: 1, end: 1 }, "caret was adjusted");
});
