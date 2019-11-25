import $ from "jquery";
import devices from "core/devices";
import keyboardMock from "../../../helpers/keyboardMock.js";
import caretWorkaround from "./caretWorkaround.js";

import "ui/text_box/ui.text_editor";

const testMaskRule = (title, config) => {
    QUnit.test(title, (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: config.mask,
            maskRules: config.maskRules || {},
            valueChangeEvent: "keyup"
        });
        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input, true);

        keyboard.type(config.text);

        assert.equal(textEditor.option("value"), config.result);
    });
};

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        this.focusAndTick = ($input, delay) => {
            $input.focus();
            this.clock.tick(delay);
        };
    },

    afterEach: () => {
        this.clock.restore();
    }
};

QUnit.module("rendering", {}, () => {
    QUnit.test("render", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            maskRules: {
                "X": ""
            }
        });

        assert.ok(!$textEditor.hasClass("dx-texteditor-masked"), "textEditor has no mask");
        $textEditor.dxTextEditor("option", "mask", "X");

        const $input = $textEditor.find(".dx-texteditor-input");
        assert.equal($input.val(), "_", "mask is rendered");
        assert.ok($textEditor.hasClass("dx-texteditor-masked"), "textEditor masked");
    });

    QUnit.test("render mask with fixed chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            maskRules: {
                "X": ""
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        assert.equal($input.val(), "(_)", "mask is rendered");
    });
});

QUnit.module("typing", moduleConfig, () => {
    QUnit.test("accept only allowed chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("y");
        assert.equal($input.val(), "_");

        keyboard.type("x");
        assert.equal($input.val(), "x");
    });

    QUnit.test("prevent typing at the end", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x").type("x");
        assert.equal($input.val(), "x");
    });

    QUnit.test("two chars with different maskRules", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XY",
            maskRules: {
                "X": "x",
                "Y": "y"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x").type("y");
        assert.equal($input.val(), "xy");
    });

    QUnit.test("two chars with different maskRules surrounded by fixed chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XY)",
            maskRules: {
                "X": "x",
                "Y": "y"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        this.focusAndTick($input);

        keyboard.type("x").type("y");
        assert.equal($input.val(), "(xy)", "mask rendered correctly");
    });

    QUnit.test("using same maskRules in the mask", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x");
        assert.equal($input.val(), "x_", "first char is typed");
    });

    QUnit.test("typing when caret position in the middle of the text", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        const keyboard = keyboardMock($input, true);

        keyboard.caret(1).type("x");
        assert.equal($input.val(), "_x", "second char is typed");
    });

    QUnit.test("cursor should be set after fixed mask letters during typing", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X--X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x");
        assert.equal(keyboard.caret().start, 3, "cursor set after fixed mask letters");
    });

    QUnit.test("cursor should be set after fixed mask letter during typing at first position", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);
        keyboard.caret(0).type("x");

        assert.equal(keyboard.caret().start, 2, "cursor set after first fixed mask letter");
    });

    QUnit.test("cursor should be set after last typed char", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": ["x", "y"]
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.type("x").type("x");
        keyboard.caret(0);

        keyboard.type("y");
        assert.equal(keyboard.caret().start, 1, "cursor set after last typed char");

        keyboard.type("x");
        assert.equal(keyboard.caret().start, 2, "cursor set after last typed char");

        assert.equal($input.val(), "yx", "value is correct");
    });

    QUnit.test("cursor should stay at current position when typed char is not allowed", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(1).type("y");

        assert.equal(keyboard.caret().start, 1, "caret position is not changed");
    });

    QUnit.test("cursor should stay at current position when typed char is not allowed and value is not empty", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.type("x").type("x").caret(0);
        keyboard.type("y");

        assert.equal(keyboard.caret().start, 0, "caret position is not changed");
    });

    QUnit.test("cursor should have correct position when type stub", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "x-X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard
            .caret(0)
            .type("x");

        assert.deepEqual(keyboard.caret(), { start: 1, end: 1 }, "cursor in correct position");
    });

    QUnit.test("caret position is correct after typing stub and non-stub char", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "1(X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0)
            .type(" ")
            .type("1")
            .type(" ")
            .type("x");

        assert.equal(keyboard.caret().start, 3, "caret in correct position");
    });

    QUnit.test("caret position should be correct after typing", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: " (X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(1)
            .type("x");

        assert.equal(keyboard.caret().start, 3, "caret in correct position");
    });

    QUnit.test("arrow keys should not be prevented", (assert) => {
        const controlKeys = [
            "Tab",
            "End",
            "Home",
            "ArrowLeft",
            "ArrowUp",
            "ArrowRight",
            "ArrowDown",
            // IE9
            "Left",
            "Up",
            "Right",
            "Down"
        ];

        let isKeyPressPrevented = false;
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: " "
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        $input.on("keypress", e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });

        controlKeys.forEach(key => {
            isKeyPressPrevented = false;
            keyboard.triggerEvent("keypress", { key });
            assert.equal(isKeyPressPrevented, false, key + " is not prevented");
        });
    });

    QUnit.test("keypress with meta key should not be prevented", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: " "
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        let isKeyPressPrevented = false;
        $input.on("keypress", e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });
        keyboard.triggerEvent("keypress", { key: "v", metaKey: true });
        assert.equal(isKeyPressPrevented, false, "keypress with meta is not prevented");
    });

    QUnit.test("press enter when caret position in the middle of the text", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        const keyboard = keyboardMock($input, true);

        keyboard.caret(1).type("x").caret(1).press("enter");
        assert.equal($input.val(), "_x", "second char is still there");
    });

    QUnit.test("TextEditor with mask option should firing the 'onChange' event", (assert) => {
        const handler = sinon.stub();
        const clock = sinon.useFakeTimers();

        const $textEditor = $("#texteditor").dxTextEditor({
            onChange: handler,
            mask: "000000"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        $input.triggerHandler("focus");
        clock.tick();

        keyboard.type("123").press("enter");
        assert.equal(handler.callCount, 1, "'change' event is fired on enter after value change");

        keyboard.press("enter");
        assert.equal(handler.callCount, 1, "'change' event is not fired on enter if value is not changed");

        keyboard.type("456");
        $input.triggerHandler("blur");
        assert.equal(handler.callCount, 2, "'change' event is fired after value change and focus out");

        $input.triggerHandler("focus");
        $input.triggerHandler("blur");
        assert.equal(handler.callCount, 2, "'change' event is not fired after focus out without value change");
        clock.restore();
    });
});

QUnit.module("backspace key", moduleConfig, () => {
    QUnit.test("backspace should remove last char and move caret backward", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.type("x").press("backspace");

        this.clock.tick();
        assert.equal(keyboard.caret().start, 0, "caret moved backward");
        assert.equal($input.val(), "_", "char was removed");
    });

    QUnit.test("backspace should remove last char considering fixed letter", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x").press("backspace");

        assert.equal(keyboard.caret().start, 1, "caret moved to fixed char");

        keyboard.press("backspace");
        this.clock.tick();
        assert.equal($input.val(), "_-_", "char was removed");
        assert.equal(keyboard.caret().start, 0, "caret moved to start position");
    });

    QUnit.test("backspace should move caret after fixed letters", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard
            .type("x")
            .type("x")
            .press("backspace");

        assert.equal(keyboard.caret().start, 2, "cursor moved after fixed letters");
    });

    QUnit.test("backspace at start of input should not change caret position", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X",
            maskRules: {
                "X": ""
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);
        keyboard.caret(0).press("backspace");

        assert.equal(keyboard.caret().start, 0, "cursor at start position");
    });

    QUnit.test("backspace should remove chars correctly considering fixed letters", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard
            .type("x")
            .type("x")
            .type("x");

        keyboard.caret(3);
        keyboard
            .press("backspace")
            .press("backspace")
            .press("backspace");

        this.clock.tick();

        assert.equal($input.val(), "_-_x", "chars removed correctly");
    });

    QUnit.test("input event with the 'deleteContentBackward' input type should remove char", (assert) => {
        const BACKSPACE_INPUT_TYPE = "deleteContentBackward";

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-XX",
            maskRules: {
                "X": "x"
            },
            value: "xxx"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);
        keyboard
            .caret(3)
            .beforeInput(null, BACKSPACE_INPUT_TYPE)
            .input(null, BACKSPACE_INPUT_TYPE);

        this.clock.tick();

        assert.equal($input.val(), "x-x_", "char removed");
    });
});

QUnit.module("delete key", {}, () => {
    QUnit.test("char should be deleted after pressing on delete key", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard
            .type("x")
            .caret(0)
            .press("del");

        assert.equal($input.val(), "_", "letter deleted");
    });

    QUnit.test("delete should remove only selected valuable chars (T242341)", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X- X",
            maskRules: {
                X: "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("xx")
            .caret({ start: 0, end: 3 })
            .press("del");

        assert.equal($input.val(), "_- x", "letter deleted");
    });
});

QUnit.module("selection", moduleConfig, () => {
    QUnit.test("all selected chars should be deleted on key press", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard
            .type("x")
            .type("x")
            .caret({ start: 0, end: 2 });

        keyboard.type("x");

        assert.equal($input.val(), "x_", "printed only one char");
    });

    QUnit.test("all selected chars should be deleted on backspace", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XXX",
            maskRules: {
                "X": "x"
            }
        });
        const instance = $textEditor.dxTextEditor("instance");

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard
            .type("x")
            .type("x")
            .type("x")
            .caret({ start: 1, end: 3 });

        keyboard.press("backspace");

        if(instance._maskStrategy.NAME === "default") {
            this.clock.tick();
        }

        assert.equal($input.val(), "x__", "printed only one char");
        assert.equal(keyboard.caret().start, 1, "caret position set to start");
    });

    QUnit.test("all selected chars should be deleted on del key", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XXX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard
            .type("x")
            .type("x")
            .type("x")
            .caret({ start: 1, end: 3 });

        keyboard.press("del");

        assert.equal($input.val(), "x__", "printed only one char");
        assert.equal(keyboard.caret().start, 1, "caret position set to start");
    });

    QUnit.test("it should correctly handle selected range changing when input is missed", (assert) => {
        assert.expect(1);

        $("#texteditor").dxTextEditor({
            onInitialized: ({ component }) => {
                let isPassed = true;

                try {
                    component._caret({ start: 0, end: 1 });
                } catch(e) {
                    isPassed = false;
                }

                assert.ok(isPassed, "In case an input isn't ready, _caret doesn't generate an error");
            }
        });
    });
});

QUnit.module("showMaskMode", moduleConfig, () => {
    QUnit.test("show mask always", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            showMaskMode: "always",
            maskRules: {
                "X": "x"
            }
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");

        assert.equal(textEditor.option("text"), "__", "editor is empty");

        $input.focus();
        assert.equal(textEditor.option("text"), "__", "editor is not empty");
    });

    QUnit.testInActiveWindow("show mask on focus only", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            showMaskMode: "onFocus",
            maskRules: {
                "X": "x"
            }
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        assert.equal(textEditor.option("text"), "", "editor is empty");
        assert.equal($input.val(), "", "input is empty");

        $input.focus();
        this.clock.tick();

        assert.equal(textEditor.option("text"), "__", "editor is not empty");
        assert.equal($input.val(), "__", "input is not empty");
        assert.deepEqual(keyboard.caret(), { start: 0, end: 0 }, "caret position is on the start");

        $input.blur();
        this.clock.tick();

        assert.equal(textEditor.option("text"), "", "editor is empty");
        assert.equal($input.val(), "", "input is empty");
    });

    QUnit.testInActiveWindow("show mask on focus only with useMaskedValue and stub symbols", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "0-0",
            useMaskedValue: true,
            showMaskMode: "onFocus"
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        assert.equal(textEditor.option("text"), "", "editor is empty");
        assert.equal($input.val(), "", "input is empty");

        $input.focus();
        this.clock.tick();
        assert.equal(textEditor.option("text"), "_-_", "editor is not empty");
        assert.equal($input.val(), "_-_", "input is not empty");
        assert.deepEqual(keyboard.caret(), { start: 0, end: 0 }, "caret position is on the start");

        $input.blur();
        assert.equal(textEditor.option("text"), "", "editor is empty");
        assert.equal($input.val(), "", "input is empty");
    });

    QUnit.testInActiveWindow("change mask visibility", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            showMaskMode: "always",
            maskRules: {
                "X": "x"
            }
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");

        assert.equal(textEditor.option("text"), "__", "placeholder is visible");

        textEditor.option("showMaskMode", "onFocus");
        assert.equal(textEditor.option("text"), "", "placeholder is hidden");

        $input.focus();
        assert.equal(textEditor.option("text"), "__", "placeholder is visible");
    });
});

QUnit.module("focusing", moduleConfig, () => {
    QUnit.testInActiveWindow("cursor should be set after fixed mask letters", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0);
        $input.focus();
        this.clock.tick();

        assert.equal(keyboard.caret().start, 1, "caret position set before first rule");
    });

    QUnit.testInActiveWindow("selection should consider fixed mask letters", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: ")X))",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(3);
        $input.focus();
        this.clock.tick();

        assert.equal(keyboard.caret().start, 1, "caret position set before last fixed mask letter");
        assert.equal(keyboard.caret().end, 1, "caret position set before last fixed mask letter");
    });

    QUnit.testInActiveWindow("Editor with mask isn't focused after render", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            focusStateEnabled: true
        });

        assert.notOk($textEditor.hasClass("dx-state-focused"), "editor isn't focused");
    });

    QUnit.testInActiveWindow("caret should be in start position on first editor focusing", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            focusStateEnabled: true
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(1);
        this.clock.tick();

        assert.equal(keyboard.caret().start, 0, "caret is at the start");
        assert.equal(keyboard.caret().end, 0, "caret is at the start");
    });

    QUnit.testInActiveWindow("caret should be at the last symbol when input is incomplete", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            focusStateEnabled: true
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        $input.focus();
        this.clock.tick();
        keyboard.type("1");

        $input.blur();
        $input.focus();
        this.clock.tick();

        assert.equal(keyboard.caret().start, 1, "caret is at the last symbol");
        assert.equal(keyboard.caret().end, 1, "caret is at the last symbol");
    });
});

QUnit.module("value", moduleConfig, () => {
    QUnit.test("extra backspace when clear value set by option should be ignored", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "phone",
            mask: "999-999-9999"
        }).dxTextEditor("instance");
        $textEditor.option("value", "9998887777");

        const $input = $textEditor.$element().find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        const BACKSPACE_CNT = 12;
        const LAST_CARET = 12;
        keyboard.caret(LAST_CARET);
        for(let i = 0; i < BACKSPACE_CNT; ++i) {
            keyboard.press("backspace");
        }
        keyboard.type("  ");
        keyboard.press("enter");

        assert.equal($textEditor.option("value"), "", "cleared correctly");
    });

    QUnit.test("extra char that do not fit in the field should be ignored", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "phone",
            mask: "999-999-9999"
        }).dxTextEditor("instance");
        $textEditor.option("value", "9998887777");

        const $input = $textEditor.$element().find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        const LAST_CARET = 12;
        keyboard.caret(LAST_CARET);

        keyboard.press("backspace")
            .press("backspace")
            .press("backspace")
            .type("222")
            .type("00000000");
        keyboard.press("enter");

        assert.equal($textEditor.option("value"), "9998887222", "extra symbols are ignored");
    });

    QUnit.test("inappropriate to mask char should be recognized as a space", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "phone",
            mask: "999-999-9999"
        }).dxTextEditor("instance");

        $textEditor.option("value", "9998887777");

        const $input = $textEditor.$element().find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        const MIDDLE_CARET = 7;
        keyboard.caret(MIDDLE_CARET);

        keyboard.press("backspace")
            .press("backspace")
            .press("backspace")
            .type("asd");
        keyboard.press("enter");

        assert.equal($textEditor.option("value"), "999   7777", "extra symbols are ignored");
    });

    QUnit.test("value considers mask", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            valueChangeEvent: "keyup",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("x");

        assert.equal($textEditor.dxTextEditor("option", "value"), "x", "value does not contain fixed letters");
        assert.equal($textEditor.dxTextEditor("option", "text"), "(x)", "text option contains fixed letters");
    });

    QUnit.test("value should be set considering stub chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "1(XXX)",
            maskRules: {
                "X": /\d/
            },
            value: "123"
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        assert.equal($input.val(), "1(123)", "value is set correctly");
    });

    QUnit.test("stub char in value should be processed as value", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X1X",
            maskRules: { "X": /\d/ },
            value: "11"
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        assert.equal($input.val(), "111", "value is set");
    });

    QUnit.test("set value via option", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            maskRules: {
                "X": ["x", "y"]
            },
            value: "x"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const textEditor = $textEditor.dxTextEditor("instance");

        assert.equal($input.val(), "(x)", "initial value");

        textEditor.option("value", "y");
        assert.equal($input.val(), "(y)", "value set");

        textEditor.option("value", "z");
        assert.equal($input.val(), "(_)", "value set considering mask");
    });

    QUnit.test("set value via option", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)X",
            maskRules: {
                "X": ["x", "y", "z"]
            },
            value: "xyz"
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        assert.equal($input.val(), "(xy)z", "initial value");
    });

    QUnit.test("option change should be fired during typing", (assert) => {
        let changeEventArgs = {};
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            },
            valueChangeEvent: "change",
            onValueChanged(e) {
                changeEventArgs = e;
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        caretWorkaround($input);
        this.focusAndTick($input);

        keyboard.type("x");
        $input.trigger("change");

        assert.equal(changeEventArgs.value, "x", "value changed");
        assert.equal(changeEventArgs.previousValue, "", "previous value is empty");
    });

    QUnit.test("valueChangeEvent=change should fire change on blur", (assert) => {
        let valueChangedFired = 0;

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            },
            valueChangeEvent: "change",
            onValueChanged(e) {
                valueChangedFired++;
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        caretWorkaround($input);

        keyboard.type("x");

        // NOTE: triggerHandler instead of trigger due to IE blur async firing
        $input.triggerHandler("blur");

        assert.equal(valueChangedFired, 1, "change fired once on blur");
    });

    QUnit.test("valueChangeEvent=change should fire change on blur after removing", (assert) => {
        const valueChangedHandler = sinon.spy();

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "9",
            valueChangeEvent: "change",
            onValueChanged: valueChangedHandler
        });

        const textEditor = $textEditor.dxTextEditor("instance");

        textEditor.option("value", "1");
        valueChangedHandler.reset();

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        caretWorkaround($input);

        keyboard.press("del");

        // NOTE: triggerHandler instead of trigger due to IE blur async firing
        $input.triggerHandler("focusout");

        assert.equal(valueChangedHandler.callCount, 1, "change fired once on blur");
    });

    QUnit.test("valueChangeEvent=change should fire change on beforedeactivate (ie raises blur in wrong time)", (assert) => {
        let valueChangedFired = 0;

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            },
            valueChangeEvent: "change",
            onValueChanged(e) {
                valueChangedFired++;
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        caretWorkaround($input);

        keyboard.type("x");

        $input.triggerHandler("beforedeactivate");

        assert.equal(valueChangedFired, 1, "change fired once on beforedeactivate");
    });

    QUnit.test("valueChangeEvent=change should fire change on pressing enter key", (assert) => {
        let valueChangedFired = 0;

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            },
            valueChangeEvent: "change",
            onValueChanged(e) {
                valueChangedFired++;
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        caretWorkaround($input);

        const keyboard = keyboardMock($input);
        keyboard
            .type("x")
            .press("enter");

        assert.equal(valueChangedFired, 1, "change fired once on pressing enter key");
    });

    QUnit.test("value option change and input value change by typing should trigger onValueChange (T833415)", (assert) => {
        let valueChangeSpy = sinon.spy();

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(000) 000-0000",
            onValueChanged: valueChangeSpy
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const instance = $textEditor.dxTextEditor("instance");
        const keyboard = keyboardMock($input, true);

        keyboard
            .caret(0)
            .type("1111111111")
            .press("enter");

        instance.option("value", "2222222222");

        keyboard
            .caret(0)
            .type("1111111111")
            .press("enter");

        assert.equal(valueChangeSpy.callCount, 3, "change fired");
    });

    QUnit.test("T278701 - the error should not be thrown if value is null and mask is set", (assert) => {
        try {
            $("#texteditor").dxTextEditor({
                value: null,
                mask: '0000'
            });
            assert.ok(true, "everything is ok");
        } catch(e) {
            assert.ok(false, "error is thrown");
        }
    });

    QUnit.test("text should be set not considering stub chars", (assert) => {
        const maskText = "x-x";
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-XX",
            maskRules: {
                "X": "x"
            },
            value: maskText,
            useMaskedValue: true
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        $input.trigger("change");

        assert.equal($input.val(), maskText + $textEditor.dxTextEditor("option", "maskChar"), "text was set");
        assert.equal($textEditor.dxTextEditor("option", "value"), maskText, "value is unclear");
    });

    QUnit.test("text should be set and maskChar replaced by space", (assert) => {
        const maskText = " -x";
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-XX",
            maskRules: {
                "X": "x"
            },
            value: maskText,
            useMaskedValue: true
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        $input.trigger("change");

        assert.equal($textEditor.dxTextEditor("option", "value"), " -x", "text was set");
    });

    QUnit.test("mask should be rendered if value is undefined", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "\\X",
            value: undefined
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        assert.equal($input.val(), "X", "special symbols is rendered");
    });

    QUnit.test("mask stub should be cleared after set mask option to empty string", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            value: ""
        });

        $textEditor.dxTextEditor("instance").option("mask", "");

        const $input = $textEditor.find(".dx-texteditor-input");
        assert.equal($input.val(), "", "value is empty");
    });

    QUnit.test("mask validation should be cleared after set mask option to empty string", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            value: ""
        });

        const textEditor = $textEditor.dxTextEditor("instance");

        textEditor.option("value", "1");
        textEditor.option("mask", "");

        assert.equal(textEditor.option("isValid"), true, "isValid is true");
    });

    QUnit.test("validationRequest event should fire after set mask option to empty string", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            value: ""
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const handler = sinon.stub();

        textEditor.validationRequest.add(handler);

        textEditor.option("mask", "");

        const params = handler.getCall(0).args[0];
        assert.ok(handler.calledOnce, "Validating handler should be called");
        assert.equal(params.value, "", "Value was passed");
        assert.equal(params.editor, textEditor, "textEditor was passed");
    });

    QUnit.test("mask should not be crushed after set in mask option empty value in code", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00",
            value: ""
        });

        const instance = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");

        try {
            instance.option("mask", "");

            const keyboard = keyboardMock($input);
            keyboard.type("3");

            assert.equal(instance.option("text"), "3", "value text is correct");
        } catch(e) {
            assert.ok(false, "error is thrown");
        }
    });
});

QUnit.module("clear button", () => {
    QUnit.test("mask should be displayed instead of empty string after clear button click", (assert) => {
        const clock = sinon.useFakeTimers();

        try {
            const $textEditor = $("#texteditor").dxTextEditor({
                mask: "999",
                showClearButton: true,
                focusStateEnabled: true
            });

            const instance = $textEditor.dxTextEditor("instance");
            const $input = $textEditor.find(".dx-texteditor-input");
            const $clearButton = $textEditor.find(".dx-clear-button-area");

            caretWorkaround($input);

            $input.trigger("focus");
            clock.tick();

            $clearButton.trigger("dxclick");

            assert.equal(instance.option("text"), "___", "option 'text' has mask as value");
            assert.equal($input.val(), "___", "input has mask as value");
        } finally {
            clock.restore();
        }
    });

    QUnit.test("clear button click should not lead to error when value is empty", (assert) => {
        const clock = sinon.useFakeTimers();

        try {
            const $textEditor = $("#texteditor").dxTextEditor({
                mask: "999",
                showClearButton: true
            });

            $textEditor
                .find(".dx-clear-button-area")
                .trigger("dxclick");

            clock.tick();

            assert.expect(0);
        } finally {
            clock.restore();
        }
    });
});

QUnit.module("paste", moduleConfig, () => {
    QUnit.test("paste on empty editor", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0).paste("bxbxb");

        assert.equal($input.val(), "(xx)", "paste event handled correctly");
    });

    QUnit.test("paste in the middle", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": ["x", "y"]
            },
            value: "xy"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(2).paste("x");

        assert.equal($input.val(), "(xx)", "paste at middle handled correctly");
    });

    QUnit.test("paste in the middle of input without value", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(2).paste("x");

        assert.equal($input.val(), "(_x)", "paste at middle handled correctly");
    });

    QUnit.test("paste replaces selection", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XXX)XXX-XX-XX",
            maskRules: {
                "X": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            },
            value: "1234567890"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret({ start: 5, end: 8 }).paste("999");

        assert.equal($input.val(), "(123)999-78-90", "paste replaced selection");
    });

    QUnit.test("paste handles stubs and valid chars correctly", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "1(XXX",
            maskRules: {
                "X": /\d/
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(2).paste("178");

        assert.equal($input.val(), "1(178", "paste handled correctly");
    });

    QUnit.test("paste handles stub correctly", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "+1(XXX)XXX-XX-XX",
            maskRules: {
                "X": /\d/
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        this.focusAndTick($input);
        keyboard.caret(0).paste("+1(999)888-77-66");

        assert.equal($input.val(), "+1(999)888-77-66", "paste handled correctly");
    });

    QUnit.test("paste move cursor after inserted text", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XXX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0);
        this.clock.tick();
        keyboard.paste("xx");

        // NOTE: wait for textEditor async paste handler
        this.clock.tick();

        assert.deepEqual(keyboard.caret(), { start: 2, end: 2 }, "caret has correct position");
    });

    QUnit.test("paste move cursor after accepted chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XXX",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0).paste("xyx");

        assert.deepEqual(keyboard.caret(), { start: 2, end: 2 }, "caret has correct position");
    });

    QUnit.test("paste considers stub maskRules", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        this.focusAndTick($input);
        keyboard.caret(0).paste("x");

        assert.equal(keyboard.caret().start, 2, "caret has correct position");
    });

    QUnit.test("paste should not replace following chars", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: { "X": /\d/ },
            value: "12"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0).paste("0");

        assert.equal($input.val(), "01", "paste handled");
        assert.equal(keyboard.caret().start, 1, "caret in correctly position");
    });

    QUnit.test("paste event should be fired in the FireFox when ctrl+V pressed", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XX",
            maskRules: { "X": /[v0]/ },
            value: ""
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);
        const event = $.Event("keypress", {
            ctrlKey: true,
            keyCode: 0,
            key: "v",
            charCode: 118,
            char: undefined,
            which: 118
        });

        caretWorkaround($input);

        $input.trigger(event);
        keyboard.paste("00");

        assert.equal($input.val(), "00", "'v' char from ctrl+V combination was ignored");
    });
});

QUnit.module("drag text", moduleConfig, () => {
    QUnit.test("mask should support drag", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": "x"
            },
            value: " x"
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        $input.val("(x)_").trigger("drop");

        this.clock.tick();

        assert.equal($input.val(), "(x_)", "mask is correct");
    });

    QUnit.test("mask should support drag with spaces", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XXXX)",
            maskRules: {
                "X": /[xy]/
            },
            value: " x y"
        });

        const $input = $textEditor.find(".dx-texteditor-input");

        $input.val("(x__y)").trigger("drop");

        this.clock.tick();

        assert.equal($input.val(), "(xy__)", "mask is corrected");
    });
});

QUnit.module("cut", () => {
    QUnit.test("cut handled correctly", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "XXX",
            maskRules: {
                "X": "x"
            },
            value: "xxx"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret({ start: 1, end: 2 });

        $input.trigger("cut");

        assert.equal($input.val(), "x_x", "cut handled correctly");
    });
});

QUnit.module("build-in mask rules", moduleConfig, () => {
    testMaskRule("'0' is digit only", { mask: "0000000", text: "+- Az9$", result: " 9" });
    testMaskRule("'9' is digit or space", { mask: "9999999", text: "+- Az9$", result: " 9" });
    testMaskRule("'#' is digit or space|'+'|'-'", { mask: "#######", text: "+- Az9$", result: "+- 9" });
    testMaskRule("'L' is literal only", { mask: "LLLLLLL", text: " Az9$яШ", result: " AzяШ" });
    testMaskRule("'l' is literal only or space", { mask: "lllllll", text: " Az9$яШ", result: " AzяШ" });
    testMaskRule("'C' is any char except space", { mask: "CCCCCCC", text: " Az9$яШ", result: " Az9$яШ" });
    testMaskRule("'c' is any char", { mask: "ccccccc", text: " Az9$яШ", result: " Az9$яШ" });
    testMaskRule("'A' is alphanumeric", { mask: "AAAAAAA", text: " Az9$яШ", result: " Az9яШ" });
    testMaskRule("'a' is alphanumeric or space", { mask: "aaaaaaa", text: " Az9$яШ", result: " Az9яШ" });
});

QUnit.module("custom mask maskRules", moduleConfig, () => {
    testMaskRule("string custom rule", { mask: "xxxxx", maskRules: { "x": "y" }, text: "z0y$ ", result: "y" });
    testMaskRule("array of chars custom rule", {
        mask: "xxxxx",
        maskRules: { "x": ["y", "z"] },
        text: "z0y$ ",
        result: "zy"
    });
    testMaskRule("regexp custom rule", { mask: "xxxxx", maskRules: { "x": /[yz]/ }, text: "z0y$ ", result: "zy" });
    testMaskRule("function custom rule", {
        mask: "xxxxx", maskRules: {
            "x": (char) => {
                return /[yz]/.test(char);
            }
        }, text: "z0y$ ", result: "zy"
    });

    QUnit.test("build-in rules should not be influenced by custom rules", (assert) => {
        $("<div>").appendTo("#qunit-fixture").dxTextEditor({
            mask: "0",
            maskRules: {
                "0": "x"
            }
        });

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "0",
            value: "1"
        });

        assert.equal($textEditor.find(".dx-texteditor-input").val(), "1", "'0' rule preserved");
    });

    QUnit.test("custom function get fullText and current index", (assert) => {
        $("#texteditor").dxTextEditor({
            mask: "-x",
            maskRules: {
                "x": (char, index, fullText) => {
                    assert.equal(index, 1, "handle third char");
                    assert.equal(fullText, "-_", "fullText is correct");
                    return char === "1";
                }
            },
            useMaskedValue: false,
            value: "1"
        });
    });

    QUnit.test("fullText updated, if pasted text is accepted", (assert) => {
        // Fix blinking on blur in MS Edge (https://trello.com/c/HyC0Shoz)
        assert.expect(1);
        let firstTimeCall = true;

        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "xy",
            maskRules: {
                "x": "x",
                "y": (char, index, fullText) => {
                    if(firstTimeCall) {
                        assert.equal(fullText, "x_", "x is accepted");
                    }

                    firstTimeCall = false;
                    return char === "y";
                }
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard.caret(0).paste("xy");
    });

    QUnit.test("validate method has fullText and index args", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "xy",
            maskRules: {
                "x": "x",
                "y": (char, index, fullText) => {
                    assert.equal(typeof fullText, "string", "fulltext is string ");
                    assert.equal(index, 1, "index is correct");
                    return char === "y";
                }
            }
        });
        $textEditor.dxTextEditor("option", "value", "xx");
        assert.ok(!$textEditor.dxTextEditor("option", "isValid"), "editor is not valid");
    });

    QUnit.test("text argument has maskChar instead of spaces", (assert) => {
        $("#texteditor").dxTextEditor({
            mask: "xy",
            maskRules: {
                "x": "x",
                "y": (char, index, text) => {
                    assert.equal(text, "__", "text has only mask chars");
                }
            },
            value: " y"
        });
    });
});

QUnit.module("escape built-in rules", {}, () => {
    QUnit.test("built-in rules should be escaped with '\\'", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: '\\ll',
            value: 'a'
        });

        assert.equal($textEditor.find(".dx-texteditor-input").val(), "la", "first rule work as stub");
    });
});

QUnit.module("validation", {}, () => {
    QUnit.test("validation for 9", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "09",
            value: "1"
        });

        const textEditor = $textEditor.dxTextEditor("instance");

        assert.equal(textEditor.option("isValid"), true, "valid value");

        textEditor.option("mask", "00");
        assert.equal(textEditor.option("isValid"), false, "valid value");
    });

    QUnit.test("mask validation message", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "90",
            maskInvalidMessage: "test",
            valueChangeEvent: "change"
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);
        caretWorkaround($input);

        keyboard.type("1");
        $input.trigger("change");

        assert.equal($(".dx-invalid-message").eq(0).text(), "test", "validation message");
    });

    QUnit.test("mask should be validated before valueChangeEvent is fired", (assert) => {
        let maskIsValidOnValueChange;
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "90",
            valueChangeEvent: "change",
            onValueChanged(e) {
                maskIsValidOnValueChange = e.component.option("isValid");
            }
        });
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("1");
        $input.trigger("change");

        assert.strictEqual(maskIsValidOnValueChange, false, "input is validated before valueChangeEvent was fired");
    });

    QUnit.test("reset should not request validation", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            maskRules: {
                "X": "x"
            },
            value: ""
        });

        $textEditor.dxTextEditor("reset");

        assert.ok(!$textEditor.hasClass("dx-invalid"), "value is not validated");
    });

    QUnit.test("validation after value changed", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "0"
        });

        const textEditor = $textEditor.dxTextEditor("instance");
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        caretWorkaround($input);

        keyboard.type("1");
        $input.trigger("change");

        textEditor.option("value", "");
        assert.ok(textEditor.option("isValid"), "mask with an empty value should be valid. Required validator should check it");

        textEditor.option("value", "f");
        assert.notOk(textEditor.option("isValid"), "mask with an invalid value should be invalid");
    });
});

QUnit.module("T9", moduleConfig, () => {
    QUnit.test("mask works when keypress is not fired", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(X)",
            maskRules: {
                "X": "x"
            }
        });
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard
            .caret({ start: 0, end: 0 })
            .keyDown("x")
            .beforeInput("x", "insertText");

        $input.val("x" + $input.val());

        keyboard
            .caret({ start: 0, end: 1 })
            .input("x");

        this.clock.tick();

        assert.equal($input.val(), "(x)", "mask works correctly");
    });

    QUnit.test("mask works when keypress fired after input", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "(XX)",
            maskRules: {
                "X": "x"
            }
        });
        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        keyboard
            .caret({ start: 0, end: 0 })
            .keyDown("x")
            .beforeInput("x", "insertText");

        $input.val("x" + $input.val());

        keyboard
            .caret({ start: 0, end: 1 })
            .input("x");

        this.clock.tick();
        keyboard.keyPress("x");

        this.clock.tick();

        assert.equal($input.val(), "(x_)", "mask works correctly");
    });

    QUnit.testInActiveWindow("Last char remove correctly when keypress fired after backspace", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X-X",
            maskRules: {
                "X": "x"
            }
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input, true);

        this.focusAndTick($input);
        keyboard.type("xx");
        this.clock.tick();

        keyboard.press("backspace");
        this.clock.tick();

        keyboard.press("backspace");
        this.clock.tick();

        keyboard.press("backspace");
        this.clock.tick();

        assert.equal(keyboard.caret().start, 0, "caret moved backward");
        assert.equal($input.val(), "_-_", "chars was removed");
    });
});

QUnit.module("states", {}, () => {
    QUnit.test("mask should not be changed when readonly mode is enabled", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "X",
            maskRules: {
                "X": "x"
            },
            readOnly: true
        });

        const $input = $textEditor.find(".dx-texteditor-input");
        const event = $.Event("keypress");
        event.key = "F9";

        $input.trigger(event);

        assert.equal($input.val(), "_", "text was not typed");
    });
});

QUnit.module("Hidden input", {}, () => {
    QUnit.test("Render a hidden input to keep a user's input if mask is defined", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "number",
            mask: "(X)"
        });

        const $visibleInput = $textEditor.find(".dx-texteditor-input");
        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.length, 1, "there is a hidden input");
        assert.notOk($visibleInput.attr("name"), "visible input doesn't have a name");
        assert.equal($hiddenInput.attr("name"), "number", "hidden input has a right name");
    });

    QUnit.test("Do not render a hidden input if mask is undefined", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "number"
        });

        const $hiddenInput = $textEditor.find("input[type=hidden]");
        assert.equal($hiddenInput.length, 0, "there isn't a hidden input");
    });

    QUnit.test("Render a hidden input when mask option is set via api", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "number"
        });

        $textEditor.dxTextEditor("instance").option("mask", "+1 (00) 00-00");

        const $visibleInput = $textEditor.find(".dx-texteditor-input");
        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.length, 1, "there is a hidden input");
        assert.notOk($visibleInput.attr("name"), "visible input doesn't have a name");
        assert.equal($hiddenInput.attr("name"), "number", "hidden input has a right name");
    });

    QUnit.test("Remove a hidden input if mask is changed to undefined", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "number",
            mask: "00-00-00"
        });

        $textEditor.dxTextEditor("instance").option("mask", null);

        const $visibleInput = $textEditor.find(".dx-texteditor-input");
        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.length, 0, "Hidden value is removed");
        assert.equal($visibleInput.attr("name"), "number", "Visible input name is restored");
    });

    QUnit.test("Replace hidden input if mask is changed to another value", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "number",
            mask: "00-00-00"
        });

        $textEditor.dxTextEditor("instance").option("mask", "0-0-0");

        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.length, 1, "Hidden value is replaced");
    });

    QUnit.test("A hidden input should have a correct value if useMaskedValue is true", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00-00-00",
            useMaskedValue: true,
            value: "45-23-10"
        });

        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.val(), "45-23-10", "value of hidden input");
    });

    QUnit.test("A hidden input should have a correct value if useMaskedValue is false", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "00-00-00",
            value: "342312"
        });

        const $hiddenInput = $textEditor.find("input[type=hidden]");

        assert.equal($hiddenInput.val(), "342312", "value of hidden input");
    });

    QUnit.test("A hidden input has empty value without mask if useMasked Value is true", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "+1 (000) 0000000",
            useMaskedValue: true
        });

        const $hiddenInput = $textEditor.find("input[type=hidden]");
        assert.equal($hiddenInput.val(), "", "value of hidden input is empty");
    });

    QUnit.test("A hidden input has empty value without mask if useMasked Value is false", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            mask: "+1 (000) 0000000"
        });

        const $hiddenInput = $textEditor.find("input[type=hidden]");
        assert.equal($hiddenInput.val(), "", "value of hidden input is empty");
    });

    QUnit.test("Name attr of hidden input is changed when name option of editor is changed", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            name: "Test name",
            mask: "+1 (000) 0000000"
        });

        $textEditor.dxTextEditor("instance").option("name", "Editor with mask");

        const $hiddenInput = $textEditor.find("input[type=hidden]");
        assert.equal($hiddenInput.attr("name"), "Editor with mask", "name of hidden input");
    });
});

QUnit.module("Strategies", () => {
    QUnit.test("default strategy should be used for all devices, except android 5+", (assert) => {
        const instance = $("#texteditor").dxTextEditor({
            mask: "0"
        }).dxTextEditor("instance");

        const { android, version } = devices.real();
        const isModernAndroidDevice = android && version[0] >= 5;
        const expectedMaskStrategy = isModernAndroidDevice ? "android" : "default";

        assert.strictEqual(instance._maskStrategy.NAME, expectedMaskStrategy, "strategy name is correct");
    });

    QUnit.test("default strategy should be used for devices with android less than v5", (assert) => {
        const currentDevice = devices.real();

        devices.real({
            platform: "android",
            version: [4, 4, 1]
        });

        const instance = $("#texteditor").dxTextEditor({
            mask: "0"
        }).dxTextEditor("instance");

        assert.strictEqual(instance._maskStrategy.NAME, "default", "strategy name is correct");
        devices.real(currentDevice);
    });
});
