import $ from "jquery";
import caret from "ui/text_box/utils.caret";
import keyboardMock from "../../helpers/keyboardMock.js";

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

QUnit.test("'getCaret' does not raise an error when it is impossible to get a range", (assert) => {
    const pseudoInput = {
        get selectionStart() {
            throw "You can not get a selection";
        },

        get selectionEnd() {
            throw "You can not get a selection";
        }
    };

    try {
        assert.deepEqual(caret(pseudoInput), { start: 0, end: 0 });
        assert.ok(true, "exception is not thrown");
    } catch(e) {
        assert.ok(false, "exception is thrown");
    }
});

QUnit.test("'setCaret' does not raise an error when it is impossible to set a range", (assert) => {
    const caretPosition = { start: 1, end: 2 };
    const initialDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'selectionStart');
    const getterSetterConfig = {
        get: function() {
            throw "You can not get a selection";
        },
        set: function(value) {
            throw "You can not set a selection";
        }
    };

    Object.defineProperty(HTMLInputElement.prototype, 'selectionStart', $.extend({}, initialDescriptor, getterSetterConfig));

    const input = $("<input>").appendTo("#qunit-fixture").get(0);

    try {
        caret(input, caretPosition);
        assert.ok(true, "exception is not thrown");
    } catch(e) {
        assert.ok(false, "exception is thrown");
    }

    Object.defineProperty(HTMLInputElement.prototype, 'selectionStart', initialDescriptor);
});
