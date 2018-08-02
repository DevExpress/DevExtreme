var $ = require("jquery"),
    caret = require("ui/text_box/utils.caret"),
    keyboardMock = require("../../helpers/keyboardMock.js");

QUnit.module("caret");

QUnit.test("get caret position", function(assert) {
    var caretPosition = { start: 1, end: 2 };
    var $input = $("<input>").appendTo("#qunit-fixture");

    var keyboard = keyboardMock($input, true);

    keyboard.type("12345").caret({ start: 1, end: 2 });

    assert.deepEqual(caret($input), caretPosition, "caret position is correct");
});

QUnit.test("set caret position", function(assert) {
    var caretPosition = { start: 1, end: 2 };
    var $input = $("<input>").val("12345").appendTo("#qunit-fixture");

    $input.focus();
    caret($input, caretPosition);

    assert.deepEqual(caret($input), caretPosition, "caret position set correctly");
});

QUnit.test("T341277 - an exception if element is not in document", function(assert) {
    var caretPosition = { start: 1, end: 2 },
        input = document.createElement("input");

    try {
        caret(input, caretPosition);
        assert.ok(true, "exception is not thrown");
    } catch(e) {
        assert.ok(false, "exception is thrown");
    }
});
