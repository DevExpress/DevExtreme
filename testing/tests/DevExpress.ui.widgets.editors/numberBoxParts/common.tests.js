import $ from "jquery";
import SpinButton from "ui/number_box/number_box.spin";
import config from "core/config";
import devices from "core/devices";
import keyboardMock from "../../../helpers/keyboardMock.js";
import pointerMock from "../../../helpers/pointerMock.js";

import "ui/number_box";
import "ui/validator";

const NUMBERBOX_CLASS = "dx-numberbox";
const INVALID_CLASS = "dx-invalid";
const SPIN_CLASS = "dx-numberbox-spin";
const SPIN_CONTAINER_CLASS = "dx-numberbox-spin-container";
const SPIN_UP_CLASS = "dx-numberbox-spin-up";
const SPIN_DOWN_CLASS = "dx-numberbox-spin-down";
const TEXTEDITOR_CLASS = "dx-texteditor";
const INPUT_CLASS = "dx-texteditor-input";
const CONTAINER_CLASS = "dx-texteditor-container";
const SPIN_TOUCH_FRIENDLY_CLASS = "dx-numberbox-spin-touch-friendly";
const PLACEHOLDER_CLASS = "dx-placeholder";
const ACTIVE_STATE_CLASS = "dx-state-active";

QUnit.module("basics", {}, () => {
    QUnit.test("markup init", (assert) => {
        const element = $("#numberbox").dxNumberBox();

        assert.ok(element.hasClass(NUMBERBOX_CLASS));
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));

        assert.equal(element.find("." + INPUT_CLASS).length, 1);
        assert.equal(element.find("." + CONTAINER_CLASS).length, 1);
    });

    QUnit.test("input should have correct type", (assert) => {
        const $element = $("#numberbox").dxNumberBox();
        const instance = $element.dxNumberBox("instance");

        function checkInput(type) {
            let result = false;

            const input = $("<input>")
                .appendTo($("body"));

            try {
                input.prop("type", type);
                result = input.prop("type") === type;
            } catch(e) {
                result = false;
            }

            $(input).remove();

            return result;
        }

        assert.equal($element.find("." + INPUT_CLASS).prop("type"), checkInput("number") ? instance.option("mode") : "text");
    });

    QUnit.test("input should have inputmode attribute for numeric keyboard on mobile devices", function(assert) {
        const $element = $("#numberbox").dxNumberBox();
        assert.equal($element.find("." + INPUT_CLASS).attr("inputmode"), "decimal", "inputmode is correct");
    });

    QUnit.test("onContentReady fired after the widget is fully ready", (assert) => {
        assert.expect(2);

        $("#numberbox").dxNumberBox({
            value: 25,
            onContentReady(e) {
                assert.equal($(e.element).find("input").val(), 25);
                assert.ok($(e.element).hasClass(NUMBERBOX_CLASS));
            }
        });
    });

    QUnit.test("init with options", (assert) => {
        assert.expect(2);

        const element = $("#numberbox").dxNumberBox({
            min: 0,
            max: 100
        });

        const $input = element.find("." + INPUT_CLASS);

        assert.equal($input.prop("min"), 0);
        assert.equal($input.prop("max"), 100);
    });

    QUnit.test("typing value by keyboard update 'value' option", (assert) => {
        assert.expect(2);

        const element = $("#numberbox").dxNumberBox({
            value: 100,
            valueChangeEvent: "change"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option("value"), 100);

        keyboard
            .caret(3)
            .type("200")
            .change();

        assert.strictEqual(instance.option("value"), 100200);
    });

    QUnit.test("validate value on focusout", (assert) => {
        assert.expect(2);

        const element = $("#numberbox").dxNumberBox({
            value: 100,
            valueChangeEvent: "change"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option("value"), 100);

        keyboard
            .caret(3)
            .type("..200");

        $input.focusout();

        assert.strictEqual(instance.option("value"), 100, "validate value on focusout");
    });

    QUnit.test("trigger invalid event", (assert) => {
        assert.expect(2);

        const element = $("#numberbox").dxNumberBox({
            value: 100,
            valueChangeEvent: "change"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option("value"), 100);

        keyboard
            .caret(3)
            .type("..200");

        $input.trigger("invalid");

        assert.strictEqual(instance.option("value"), 100, "validate value on invalid event");
    });

    QUnit.test("validate value on keyup", (assert) => {
        const element = $("#numberbox").dxNumberBox({
            value: 100,
            valueChangeEvent: "keyup"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.strictEqual(instance.option("value"), 100);

        keyboard
            .type("1")
            .type(".");

        const expectedResult = 1.1;

        assert.strictEqual(instance.option("value"), expectedResult, "value is correct");
    });

    QUnit.test("Validate value on keyup when 0 typing after a comma", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: null,
            valueChangeEvent: "keyup",
            mode: "text"
        });

        const instance = $element.dxNumberBox("instance");

        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type("1")
            .type(",")
            .type("0");

        let expectedValue = "1,0";

        assert.strictEqual($input.val(), expectedValue, "comma has not disappear");

        keyboard
            .type("2");

        expectedValue = "1.02";

        assert.strictEqual(instance.option("value"), expectedValue++, "value is correct");
    });

    QUnit.test("validate 'plus' char typing", (assert) => {
        const element = $("#numberbox").dxNumberBox({
            value: 1,
            valueChangeEvent: "change"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type("1")
            .type("+")
            .type("1")
            .change();

        assert.strictEqual(instance.option("value"), 1, "value is correct");

        instance.option("value", null);

        keyboard
            .type("+")
            .type("1")
            .change();

        assert.strictEqual(instance.option("value"), 1, "value is correct");
    });

    QUnit.test("validate 'minus' char typing", (assert) => {
        const element = $("#numberbox").dxNumberBox({
            value: 1,
            valueChangeEvent: "change"
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type("1")
            .type("-")
            .type("1")
            .change();

        assert.strictEqual(instance.option("value"), 1, "value is correct");

        instance.option("value", null);

        $input
            .focus()
            .val("-11")
            .trigger("change");

        assert.strictEqual(instance.option("value"), -11, "value is correct");
    });

    QUnit.test("jQuery event should be specified on value change when value is not valid", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: 1,
            valueChangeEvent: "keyup",
            onValueChanged(e) {
                assert.ok(e.event, "jQuery event specified");
            }
        });

        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .press("end")
            .press("backspace")
            .keyUp("backspace");
    });

    QUnit.test("regression test. Change value used option", (assert) => {
        assert.expect(1);

        const element = $("#numberbox").dxNumberBox({
            value: 100
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        instance.option("value", 200);

        assert.equal($input.val(), 200);
    });

    QUnit.test("'text' option should be correct", (assert) => {
        assert.expect(2);

        const element = $("#numberbox").dxNumberBox({
            value: 100
        });

        const instance = element.dxNumberBox("instance");
        assert.equal(instance.option("text"), "100", "Text is OK");

        instance.option("value", 200);

        assert.equal(instance.option("text"), "200", "Text is OK");
    });

    QUnit.test("placeholder is visible when value is invalid", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            placeholder: "Placeholder",
            value: ""
        });

        const instance = $element.dxNumberBox("instance");
        const $placeholder = $element.find("." + PLACEHOLDER_CLASS);

        assert.ok($placeholder.is(":visible"), "placeholder is visible");
        instance.option("value", "10");
        assert.ok(!$placeholder.is(":visible"), "placeholder is not visible with valid value");
        instance.option("value", "sdg");
        assert.ok($element.find("." + PLACEHOLDER_CLASS).is(":visible"), "placeholder is visible with invalid value");
    });

    QUnit.test("init with option useLargeSpinButtons", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        assert.ok($element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), "element has touchFriendly class");
    });

    QUnit.testInActiveWindow("input is focused when spin buttons are clicked if useLargeSpinButtons = false", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: false
        });

        const $input = $element.find(".dx-texteditor-input");
        const $spinButton = $element.find(".dx-numberbox-spin-up");

        assert.ok(!$input.is(":focus"), "input is not focused before click on spin button");
        $element.css("display"); // NOTE: FF test does not work without relayout

        $spinButton.trigger("dxpointerdown");
        assert.ok($input.is(":focus"), "input is focused after click on spin button");
    });

    QUnit.test("spin button should have feedback after click on it", (assert) => {
        const FEEDBACK_SHOW_TIMEOUT = 30;
        this.clock = sinon.useFakeTimers();

        try {
            const $element = $("#numberbox").dxNumberBox({
                showSpinButtons: true
            });

            const $spinButton = $element.find(".dx-numberbox-spin-up");
            const mouse = pointerMock($spinButton).start();

            mouse.down();

            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.ok($spinButton.hasClass("dx-state-active"), "spin button has active-state class");
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test("spin button should change value after long click on it", (assert) => {
        const FEEDBACK_SHOW_TIMEOUT = 500;
        this.clock = sinon.useFakeTimers();

        try {
            const $element = $("#numberbox").dxNumberBox({
                showSpinButtons: true,
                value: 100
            });

            const $spinButton = $element.find(".dx-numberbox-spin-up");
            const mouse = pointerMock($spinButton).start();

            mouse.down();

            const instance = $element.dxNumberBox("instance");

            assert.equal(instance.option("value"), 101, "value is correct");
            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.equal(instance.option("value"), 101, "value is correct");
            this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
            assert.ok(instance.option("value") > 101, "value is correct");
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test("hoverStateEnabled option", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            hoverStateEnabled: true
        });

        $element.trigger("dxhoverstart");
        assert.ok($element.hasClass("dx-state-hover"), "dxNumberBox has hover class");

        $element.trigger("dxhoverend");
        assert.ok(!$element.hasClass("dx-state-hover"), "dxNumberBox has not hover class");
    });

    QUnit.test("hoverStateEnabled option for spinButton", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            hoverStateEnabled: true,
            showSpinButtons: true
        });

        const $spinButton = $element.find(".dx-numberbox-spin-button");

        $spinButton.trigger("dxhoverstart");
        assert.ok($spinButton.hasClass("dx-state-hover"), "Spin button has hover class after mouse enter on it");

        $spinButton.trigger("dxhoverend");
        assert.ok(!$spinButton.hasClass("dx-state-hover"), "Spin button has not hover class after mouse enter on it");
    });

    QUnit.testInActiveWindow("input value is greeter or less after mousewheel action", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 100.6
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $numberBoxInput = $numberBox.find(".dx-texteditor-input");
        const mouse = pointerMock($numberBoxInput);

        $numberBoxInput.focus();
        $numberBoxInput.focus();

        mouse.wheel(10);
        assert.equal(numberBox.option("value"), 101.6, "value is greeter after mousewheel up");

        mouse.wheel(-20);
        assert.equal(numberBox.option("value"), 100.6, "value is less after mousewheel down");

        $numberBoxInput.blur();
        mouse.wheel(-20);
        assert.roughEqual(numberBox.option("value"), 100.6, 1.001);
    });

    QUnit.test("mousewheel action should not work in disabled state", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 100.6,
            disabled: true
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $numberBoxInput = $(".dx-texteditor-input", $numberBox);
        const mouse = pointerMock($numberBoxInput).start();

        $numberBoxInput.get(0).focus();

        mouse.wheel(10);
        assert.equal(numberBox.option("value"), 100.6, "value is not changed");
    });

    QUnit.test("mousewheel action should not work if widget is not focused", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({ value: 100 });
        const numberBox = $numberBox.dxNumberBox("instance");
        const input = $(".dx-texteditor-input", $numberBox).get(0);
        const mouse = pointerMock(input).start();

        mouse.wheel(10);
        assert.strictEqual(numberBox.option("value"), 100);

        input.focus();

        mouse.wheel(10);
        assert.notStrictEqual(numberBox.option("value"), 100);
    });

    QUnit.testInActiveWindow("input is not focused when spin buttons are clicked if useLargeSpinButtons = true", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        const $input = $element.find(".dx-texteditor-input");
        const $spinButton = $element.find(".dx-numberbox-spin-up");

        assert.ok(!$input.is(":focus"), "input is not focused before click on spin button");
        $element.css("display"); // NOTE: FF test does not work without relayout

        $spinButton.trigger("dxpointerdown");

        assert.ok(!$input.is(":focus"), "input is not focused after click on spin button");

        $element.css("display"); // NOTE: FF test does not work without relayout
        $input.focus();
        assert.ok($input.is(":focus"), "input is focused");
        $spinButton.trigger("dxpointerdown");

        assert.ok($input.is(":focus"), "input is still focused");
    });

    QUnit.test("correct order of buttons when widget is rendered", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showSpinButtons: true,
            showClearButton: true
        });
        const $buttons = $element.find(".dx-texteditor-buttons-container").children();

        assert.ok($buttons.eq(0).hasClass("dx-clear-button-area"), "clear button is the first");
        assert.ok($buttons.eq(1).hasClass("dx-numberbox-spin-container"), "spin buttons are the second");
    });

    QUnit.test("correct order of buttons when clear button option is set after rendering", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showSpinButtons: true
        });

        const instance = $element.dxNumberBox("instance");

        instance.option("showClearButton", true);

        const $buttons = $element.find(".dx-texteditor-buttons-container").children();

        assert.ok($buttons.eq(0).hasClass("dx-clear-button-area"), "clear button is the first");
        assert.ok($buttons.eq(1).hasClass("dx-numberbox-spin-container"), "spin buttons are the second");
    });

    QUnit.test("correct order of buttons when spin buttons option is set after rendering", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showClearButton: true
        });

        const instance = $element.dxNumberBox("instance");

        instance.option("showSpinButtons", true);

        const $buttons = $element.find(".dx-texteditor-buttons-container").children();
        assert.ok($buttons.eq(0).hasClass("dx-clear-button-area"), "clear button is the first");
        assert.ok($buttons.eq(1).hasClass("dx-numberbox-spin-container"), "spin buttons are the second");
    });

    QUnit.test("clear button should save valueChangeEvent", (assert) => {
        const valueChangedHandler = sinon.spy();

        const $element = $("#numberbox").dxNumberBox({
            showClearButton: true,
            onValueChanged: valueChangedHandler
        });

        const $clearButton = $element.find(".dx-clear-button-area");
        $clearButton.trigger("dxclick");

        assert.equal(valueChangedHandler.callCount, 1, "valueChangedHandler has been called");
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, "dxclick", "event is correct");
    });

    QUnit.test("clearButton should clear the text even if the value was not changed", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            showClearButton: true,
            value: null
        });

        const $input = $element.find(".dx-texteditor-input");
        const kb = keyboardMock($input);

        assert.strictEqual($input.val(), "", "value was cleared");

        kb.type("123");
        const $clearButton = $element.find(".dx-clear-button-area");
        $clearButton.trigger("dxclick");

        assert.strictEqual($input.val(), "", "value is still cleared");
    });

    QUnit.test("T220209 - the 'valueFormat' option", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 5,
            valueFormat(value) {
                return (value < 10 ? "0" : "") + value;
            }
        });

        assert.equal($numberBox.dxNumberBox("option", "value"), 5, "value is correct");
        assert.equal($numberBox.find(".dx-texteditor-input").val(), "05", "input value is correct");
    });

    QUnit.test("T220209 - the 'valueFormat' option when value is changed using keyboard", (assert) => {
        if(devices.real().platform !== "generic") {
            assert.ok(true, "this test is actual only for desktop ");
            return;
        }

        const $numberBox = $("#numberbox").dxNumberBox({
            value: 5,
            valueFormat(value) {
                return (value < 10 ? "0" : "") + value;
            }
        });

        const $input = $numberBox.find(".dx-texteditor-input");

        keyboardMock($input)
            .press('end')
            .type("0");

        $input.trigger("change");
        $input.trigger("focusout");

        assert.equal($numberBox.dxNumberBox("option", "value"), 50, "value is correct");
        assert.equal($numberBox.find(".dx-texteditor-input").val(), "50", "input value is correct");
    });

    QUnit.test("T220209 - the 'valueFormat' option when value is changed using spin buttons", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 5,
            valueFormat(value) {
                return (value < 10 ? "0" : "") + value;
            },
            showSpinButtons: true
        });

        const $spinUpButton = $numberBox.find(".dx-numberbox-spin-up");

        $spinUpButton.trigger("dxpointerdown");

        assert.equal($numberBox.dxNumberBox("option", "value"), 6, "value is correct");
        assert.equal($numberBox.find(".dx-texteditor-input").val(), "06", "input value is correct");
    });

    QUnit.test("T351846 - the value should not be changed after the 'change' input event is fired if value is null", (assert) => {
        let valueChangedCount = 0;

        const $numberBox = $("#numberbox").dxNumberBox({
            value: null,
            onValueChanged() {
                valueChangedCount++;
            }
        });

        const $input = $numberBox.find("." + INPUT_CLASS);

        keyboardMock($input)
            .focus()
            .change();

        assert.equal(valueChangedCount, 0, "the 'onValueChanged' action is not fired");
        assert.equal($numberBox.dxNumberBox("option", "value"), null, "value is correct");
    });

    QUnit.test("T351846 - the value should be reset to null if input is cleared", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 0
        });

        const $input = $numberBox.find("." + INPUT_CLASS);

        keyboardMock($input)
            .focus()
            .press('end')
            .press('backspace')
            .change();

        assert.equal($numberBox.dxNumberBox("option", "value"), null, "value is correct");
    });

    QUnit.test("the value should be reset to null if reset method called", (assert) => {
        const numberBox = $("#numberbox").dxNumberBox({
            value: 0
        }).dxNumberBox("instance");

        numberBox.reset();

        assert.equal(numberBox.option("value"), null, "value is correct");
    });

    QUnit.test("The value option should not be changed if it is invalid", (assert) => {
        const value = "any invalid value";

        const $numberBox = $("#numberbox").dxNumberBox({
            value
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);

        assert.equal(numberBox.option("value"), value, "value is not changed");
        assert.ok(!numberBox.option("isValid"), "the 'isValid' option is false");
        assert.equal($input.val(), "", "input value is cleared");
    });

    QUnit.test("The value option should not be reset if it is invalid", (assert) => {
        const value = "any invalid value";

        const $numberBox = $("#numberbox").dxNumberBox({
            value: 5
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);

        numberBox.option("value", value);
        assert.equal(numberBox.option("value"), value, "value is not reset");
        assert.ok(!numberBox.option("isValid"), "the 'isValid' option is false");
        assert.equal($input.val(), "", "input value is cleared");
    });

    QUnit.test("The value option should not be reset if it is invalid", (assert) => {
        const value = "any invalid value";

        const $numberBox = $("#numberbox").dxNumberBox({
            value: 5
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);

        numberBox.option("value", value);
        assert.equal(numberBox.option("value"), value, "value is not reset");
        assert.ok(!numberBox.option("isValid"), "the 'isValid' option is false");
        assert.equal($input.val(), "", "input value is cleared");
    });

    QUnit.test("The widget should be valid if the value option is undefined", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: undefined
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);

        assert.ok(numberBox.option("isValid"), "widget is valid");
        assert.equal($input.val(), "", "input value is correct");
    });

    QUnit.test("The widget should be invalid if isValid option is false on init but value format is correct", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 0,
            isValid: false
        });

        assert.ok($numberBox.hasClass(INVALID_CLASS), "widget is invalid");
    });
});

QUnit.module("submit element", {}, () => {
    QUnit.test("a hidden input should be rendered", (assert) => {
        const $element = $("#numberbox").dxNumberBox();
        const $hiddenInput = $element.find("input[type='hidden']");

        assert.equal($hiddenInput.length, 1, "a hidden input is created");
    });

    QUnit.test("the hidden input should get correct value on init", (assert) => {
        const expectedValue = 24.8;

        const $element = $("#numberbox").dxNumberBox({
            value: expectedValue
        });

        const $hiddenInput = $element.find("input[type='hidden']");

        assert.equal(parseFloat($hiddenInput.val()), expectedValue, "the hidden input has correct value after init");
    });

    QUnit.test("the hidden input gets correct value after widget value is changed", (assert) => {
        const expectedValue = 13;

        const $element = $("#numberbox").dxNumberBox({
            value: 24.6
        });

        const instance = $element.dxNumberBox("instance");
        const $hiddenInput = $element.find("input[type='hidden']");

        instance.option("value", expectedValue);
        assert.equal(parseInt($hiddenInput.val()), expectedValue, "the hidden input value is correct");
    });

    QUnit.test("the hidden input should use the decimal separator specified in DevExpress.config", (assert) => {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: "|" });

            const $element = $("#numberbox").dxNumberBox({
                value: 12.25
            });

            const $hiddenInput = $element.find("input[type='hidden']");

            assert.equal($hiddenInput.val(), "12|25", "the correct decimal separator is used");
        } finally {
            config(originalConfig);
        }
    });
});

QUnit.module("the 'name' option", {}, () => {
    QUnit.test("hidden input should get the 'name' attribute", (assert) => {
        const expectedName = "name";

        $("#numberbox").dxNumberBox({
            name: expectedName
        });

        const $hiddenInput = $("input[type='hidden']");

        assert.equal($hiddenInput.attr("name"), expectedName, "hidden input has correct 'name' attribute");
    });

    QUnit.test("editor input should not get the 'name' attribute", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            name: "name"
        });

        const input = $element.find("." + INPUT_CLASS).get(0);

        assert.notOk(input.hasAttribute("name"), "edior input does not have the 'name' attribute");
    });
});

QUnit.module("input value updating", {}, () => {
    QUnit.test("value should not be redrawn if it equals previous value", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: 0
        });

        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .press("del")
            .type("00")
            .change();
        $input.trigger("change");
        assert.equal($input.val(), "00");
    });

    QUnit.test("value should not be redrawn if it does not equals previous value", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: 1
        });

        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .press("del")
            .type("00")
            .change();
        $input.trigger("change");
        assert.equal($input.val(), "00");
    });

    QUnit.test("value should not be redrawn if it is incomplete and valueChangeEvent is set to keyup", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: null,
            valueChangeEvent: "keyup",
            mode: "text"
        });

        const instance = $element.dxNumberBox("instance");
        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.val("");
        keyboard
            .type("-");
        assert.equal($input.val(), "-");
        $input.focusout();

        $input.val("");
        keyboard
            .type("2e");
        assert.equal($input.val(), "2e");
        $input.focusout();

        $input.val("");
        keyboard
            .type(".5");

        assert.equal($input.val(), ".5");
        $input.focusout();
        assert.equal(instance.option("value"), 0.5);

        $input.val("1");
        keyboard
            .caret(1)
            .type(".")
            .triggerEvent("keyup");

        keyboard
            .type("5")
            .triggerEvent("keyup");

        assert.equal($input.val(), "1.5");
        $input.focusout();

        $input.val("");
        keyboard
            .type("-")
            .triggerEvent("keyup");

        keyboard
            .type("5")
            .triggerEvent("keyup");

        assert.equal($input.val(), "-5");
        $input.focusout();
    });

    QUnit.test("T378082 - value should be null if the incorrect value is entered", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: null,
            mode: "text"
        });

        const $input = $element.find("." + INPUT_CLASS);

        keyboardMock($input)
            .type("..")
            .change();

        assert.equal($element.dxNumberBox("option", "value"), null, "value is correct");
    });

    QUnit.test("value should be updated when it was incomplete", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            value: null,
            mode: "text"
        });

        const instance = $element.dxNumberBox("instance");
        const $input = $element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type("7.").change();

        assert.equal(instance.option("value"), 7, "value is correct");
        assert.equal($input.val(), "7.", "input is not cleaned yet");

        $input.focusout();
        assert.equal(instance.option("value"), 7, "value is correct");
        assert.equal($input.val(), "7", "input is cleaned");
    });
});

QUnit.module("options changed callbacks", {
    beforeEach: () => {
        this.element = $("#numberbox");
        this.instance = this.element.dxNumberBox().dxNumberBox("instance");
    }
}, () => {
    QUnit.test("min/max", (assert) => {
        assert.expect(2);

        this.instance.option("min", 123);
        assert.equal(this.element.find("." + INPUT_CLASS).prop("min"), "123");

        this.instance.option("max", 321);
        assert.equal(this.element.find("." + INPUT_CLASS).prop("max"), "321");
    });

    QUnit.test("step", (assert) => {
        assert.expect(1);

        this.instance.option("step", 123);
        assert.equal(this.element.find("." + INPUT_CLASS).prop("step"), "123");
    });

    QUnit.test("min/max: value changes to limited value", (assert) => {
        assert.expect(4);

        const $input = this.element.find("." + INPUT_CLASS);

        this.instance.option("min", 100);
        this.instance.option("max", 200);

        $input
            .focus()
            .val("99")
            .trigger("change");

        assert.equal($input.val(), 100);

        $input
            .focus()
            .val("201")
            .trigger("change");
        assert.equal($input.val(), 200);

        this.instance.option("value", 90);
        assert.equal($input.val(), 90, "set value less than min with option");

        this.instance.option("value", 203);
        assert.equal($input.val(), 203, "set value more than min with option");
    });

    QUnit.test("min/max: value changes when max wasn't set", (assert) => {
        const $input = this.element.find("." + INPUT_CLASS);

        this.instance.option("min", 100);

        $input
            .focus()
            .val("99")
            .trigger("change");

        assert.equal($input.val(), 100);
    });

    QUnit.test("min/max: value changes when min wasn't set", (assert) => {
        const $input = this.element.find("." + INPUT_CLASS);

        this.instance.option("min", undefined);
        this.instance.option("max", 100);

        $input
            .focus()
            .val("101")
            .trigger("change");

        assert.equal($input.val(), 100);
    });

    QUnit.test("changing min limit should lead to value change in base numberbox", (assert) => {
        this.instance.option({
            value: 5,
            min: 1
        });

        this.instance.option("min", 6);
        assert.equal(this.instance.option("value"), 6, "value has been updated");
    });

    QUnit.test("changing max limit should lead to value change in base numberbox", (assert) => {
        this.instance.option({
            value: 5,
            max: 6
        });

        this.instance.option("max", 4);
        assert.equal(this.instance.option("value"), 4, "value has been updated");
    });

    QUnit.test("min/max: value changes to limited value with number mode", (assert) => {
        this.instance.option({
            mode: "number",
            valueChangeEvent: "keyup",
            min: 10,
            max: 20
        });

        const $input = this.element.find("." + INPUT_CLASS);
        const kb = keyboardMock($input);

        $input.val("");
        kb.type("9");

        assert.equal($input.val(), 10, "input value was changed to the minimum after changing via input");
        assert.equal(this.instance.option("value"), 10, "widget's value was changed to the minimum after changing via input");

        $input.val("");
        kb.type("219");

        assert.equal($input.val(), 20, "input value was changed to the maximum after changing via input");
        assert.equal(this.instance.option("value"), 20, "widget's value was changed to the maximum after changing via input");
    });

    QUnit.test("min/max: value changes if value is negative", (assert) => {
        const $input = this.element.find("." + INPUT_CLASS);

        this.instance.option("min", -30);
        this.instance.option("max", -10);

        $input
            .focus()
            .val("-100")
            .trigger("change");

        assert.equal($input.val(), -30);

        $input
            .focus()
            .val("-5")
            .trigger("change");

        assert.equal($input.val(), -10);

        this.instance.option("value", -50);
        assert.equal($input.val(), -50, "set value less than min with option");

        this.instance.option("value", -5);
        assert.equal($input.val(), -5, "set value more than min with option");
    });

    QUnit.test("value starts from decimal", (assert) => {
        assert.expect(1);

        const $input = this.element.find("." + INPUT_CLASS);

        $input.get(0)
            .focus();

        $input
            .focus()
            .val(".1")
            .trigger("change");

        assert.equal(this.instance.option("value"), 0.1, "value is right");
    });

    QUnit.test("showSpinButtons", (assert) => {
        assert.expect(5);

        assert.ok(!this.element.hasClass(SPIN_CLASS), "on default spin classes aren't applied");
        let $spinContainer = this.element.find("." + SPIN_CONTAINER_CLASS);
        assert.ok(!$spinContainer.length, "on default spins aren't added");

        this.instance.option("showSpinButtons", true);
        assert.ok(this.element.hasClass(SPIN_CLASS), "spin classes are applied");
        $spinContainer = this.element.find("." + SPIN_CONTAINER_CLASS);
        assert.ok($spinContainer.length, "spins are added");

        this.instance.option("showSpinButtons", false);
        assert.ok(!this.element.hasClass(SPIN_CLASS), "spin classes aren't applied");
        $spinContainer = this.element.find("." + SPIN_CONTAINER_CLASS);
    });

    QUnit.test("spin edit handling", (assert) => {
        assert.expect(3);

        this.instance.option("showSpinButtons", true);
        this.instance.option("value", 100);

        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "101");

        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "100");

        $input.val("");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "-1");
    });

    QUnit.test("interactions with spin buttons do not change value if the readOnly option was set to true", (assert) => {
        this.instance.option("showSpinButtons", true);
        this.instance.option("value", 100);
        this.instance.option("readOnly", true);

        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const mouse = pointerMock($spinUp).start();

        mouse.click();

        assert.equal($input.val(), "100");
    });

    QUnit.test("correct round value with integer step", (assert) => {
        this.instance.option("showSpinButtons", true);
        this.instance.option("value", 0.2);
        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "1.2");

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "2.2");
        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "3.2");

        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "2.2");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "1.2");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "0.2");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "-0.8");
    });

    QUnit.test("correct round value with float step", (assert) => {
        this.instance.option("showSpinButtons", true);
        this.instance.option("value", 1.4);
        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);
        this.instance.option("step", 1.81);

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "3.21");

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "5.02");

        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "3.21");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "1.4");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "-0.41");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "-2.22");
    });

    QUnit.test("keep null value with 0 step", (assert) => {
        this.instance.option("showSpinButtons", true);
        this.instance.option("value", null);
        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);
        this.instance.option("step", 0);

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "");

        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "");
    });

    QUnit.test("spin edit min/max", (assert) => {
        assert.expect(2);

        this.instance.option({
            showSpinButtons: true,
            value: 1,
            min: 0,
            max: 1
        });

        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);

        $spinUp.trigger("dxpointerdown");
        assert.equal($input.val(), "1", "max value is right");

        $spinDown.trigger("dxpointerdown");
        $spinDown.trigger("dxpointerdown");
        assert.equal($input.val(), "0", "min value is right");
    });

    QUnit.test("spin edit min/max onValueChanged action", (assert) => {
        assert.expect(2);

        this.instance.option({
            showSpinButtons: true,
            value: 1,
            min: 0,
            max: 1
        });

        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);

        this.instance.option({
            value: 0,
            onValueChanged(data) {
                assert.equal(data.value, 1, "value in action is right");
            }
        });
        $spinUp.trigger("dxpointerdown");

        this.instance.option({
            value: 1,
            onValueChanged(data) {
                assert.equal(data.value, 0, "value in action is right");
            }
        });
        $spinDown.trigger("dxpointerdown");
        $spinDown.trigger("dxpointerdown");
    });

    QUnit.test("spin edit long click handling", (assert) => {
        assert.expect(1);

        this.clock = sinon.useFakeTimers();
        try {
            this.instance.option("showSpinButtons", true);
            this.instance.option("value", 100);

            const $input = this.element.find("." + INPUT_CLASS);
            const $spinUp = this.element.find("." + SPIN_UP_CLASS);
            const mouse = pointerMock($spinUp).start();

            mouse.down();

            this.clock.tick(800);

            mouse.up();

            assert.equal($input.val(), "102", "long click is handled");
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test("spin edit long click handling", (assert) => {
        assert.expect(2);

        this.clock = sinon.useFakeTimers();
        try {
            this.instance.option("showSpinButtons", true);
            this.instance.option("value", 100);

            const $spinUp = this.element.find("." + SPIN_UP_CLASS);
            const pointer = pointerMock($spinUp).start();

            pointer.down();
            this.clock.tick(1800);
            assert.ok($spinUp.hasClass(ACTIVE_STATE_CLASS), "active class present during hold");

            pointer.up();
            assert.ok(!$spinUp.hasClass(ACTIVE_STATE_CLASS), "active class not present during hold");
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test("spin button should not catch dxhold event from parent dom elements", (assert) => {
        this.instance.option("showSpinButtons", true);
        this.instance.option("value", 100);

        this.clock = sinon.useFakeTimers();
        try {
            const $spinUp = this.element.find("." + SPIN_UP_CLASS);
            const pointer = pointerMock($spinUp).start();

            pointer.down();
            $spinUp.trigger("dxhold");
            this.element.trigger("dxhold");
            this.clock.tick(500);

            assert.equal(this.instance.option("value"), 107, "value is correct");
        } finally {
            this.clock.restore();
        }
    });

    QUnit.test("spin edit immediately after keyboard input", (assert) => {
        this.instance.option("showSpinButtons", true);

        const $input = this.element.find("." + INPUT_CLASS);
        const $spinUp = this.element.find("." + SPIN_UP_CLASS);
        const $spinDown = this.element.find("." + SPIN_DOWN_CLASS);

        this.instance.option("value", "10");
        $input.val("30");
        $spinUp.trigger("dxpointerdown");
        assert.equal(this.instance.option("value"), 31, "widget has correct value after spinUp click");
        assert.equal($input.val(), 31, "displayed value is correct after spinUp click");

        this.instance.option("value", "10");
        $input.val("30");
        $spinDown.trigger("dxpointerdown");
        assert.equal(this.instance.option("value"), 29, "widget has correct value after spinDown click");
        assert.equal($input.val(), 29, "displayed value is correct after spinDown click");
    });

    QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", (assert) => {
        this.instance.option({
            onValueChanged() {
                assert.ok(true);
            }
        });
        this.instance.option("value", true);
    });

    QUnit.test("Placeholder must not be visible after setting value by option", (assert) => {
        this.instance.option({ placeholder: "1", value: "" });
        assert.ok(this.element.find(".dx-placeholder").is(":visible"), "placeholder is visible");

        this.instance.option("value", "23");
        assert.ok(this.element.find(".dx-placeholder").is(":hidden"), "placeholder is hidden");
    });

    QUnit.test("useLargeSpinButtons option changed", (assert) => {
        this.instance.option({
            showSpinButtons: true,
            useLargeSpinButtons: false
        });

        assert.ok(!this.element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), "element has not touchFriendly class");

        this.instance.option({ useLargeSpinButtons: true });
        assert.ok(this.element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), "element has touchFriendly class");
    });

    QUnit.test("onValueChanged option should get jQuery event as a parameter when spin buttons are clicked", (assert) => {
        let jQueryEvent;

        this.instance.option({
            showSpinButtons: true,
            onValueChanged(e) {
                jQueryEvent = e.event;
            }
        });

        const $spinUp = this.element.find(".dx-numberbox-spin-up");
        const $spinDown = this.element.find(".dx-numberbox-spin-down");

        $spinUp.trigger("dxpointerdown");
        assert.equal(jQueryEvent.target, $spinUp.get(0), "jQuery event is defined when spinup click used");

        $spinDown.trigger("dxpointerdown");
        assert.equal(jQueryEvent.target, $spinDown.get(0), "jQuery event is defined when spindown click used");
    });

    QUnit.testInActiveWindow("onValueChanged option should get jQuery event as a parameter when mouse wheel is used", (assert) => {
        if(devices.real().platform !== "generic") {
            assert.ok(true, "this test is actual only for desktop ");
            return;
        }

        let jQueryEvent;

        this.instance.option({
            showSpinButtons: true,
            onValueChanged(e) {
                jQueryEvent = e.event;
            }
        });

        const $numberBoxInput = this.element.find("." + INPUT_CLASS);
        const mouse = pointerMock($numberBoxInput);

        $numberBoxInput.focus();
        $numberBoxInput.focus();

        mouse.wheel(10);
        assert.equal(jQueryEvent.delta, 10, "jQuery event is defined when mousewheel up");

        mouse.wheel(-10);
        assert.equal(jQueryEvent.delta, -10, "jQuery event is defined when mousewheel down");
    });

    QUnit.test("onValueChanged option should get jQuery event as a parameter when up/down arrows are used", (assert) => {
        let jQueryEvent;

        this.instance.option({
            showSpinButtons: true,
            onValueChanged(e) {
                jQueryEvent = e.event;
            }
        });

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.keyDown("up");
        assert.equal(jQueryEvent.key, "ArrowUp", "jQuery event is defined when up key pressed");

        keyboard.keyDown("down");
        assert.equal(jQueryEvent.key, "ArrowDown", "jQuery event is defined when down key pressed");
    });
});

QUnit.module("regressions", {
    beforeEach: () => {
        this.element = $("#numberbox").dxNumberBox();
        this.instance = this.element.dxNumberBox("instance");
    }
}, () => {
    QUnit.test("B230398", (assert) => {
        assert.expect(3);

        const element = $("#numberbox").dxNumberBox({ value: "", placeholder: "auto" });
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = element.dxNumberBox("instance");

        assert.equal(instance.option("value"), "");

        keyboard
            .type("10")
            .change();

        assert.equal(instance.option("value"), 10);

        keyboard
            .press("backspace")
            .press("backspace")
            .change();

        assert.equal(instance.option("value"), null);
    });

    QUnit.test("B234644 - break value update handler in google chrome at desktop and android", (assert) => {
        if(!/chrome/i.test(navigator.userAgent)) {
            assert.ok(true);
            return;
        }

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        this.instance.option("value", "1");

        keyboard
            .type(".1.1")
            .change();

        $input.focusout();

        if(this.instance.option("mode") === "text") {
            assert.equal(this.instance.option("value"), 0.1, "check that incorrect input handling is work");
            assert.equal($input.val(), 0.1, "check input value");
        } else {
            assert.equal(this.instance.option("value"), 1, "check that incorrect input handling is work");
            assert.equal($input.val(), 1, "check input value");
        }

        keyboard
            .type("1...")
            .change();

        $input.focusout();
        assert.equal(this.instance.option("value") || '', $input.val(), "check that input value equal option value after incorrect value");
    });

    QUnit.test("B233615 dxNumberbox UI value reset after 'type' option changing in Opera", (assert) => {
        assert.expect(3);

        this.instance.option("value", 100);
        assert.equal(this.instance.option("value"), 100, "check that we init value option");
        this.instance.option("type", "number");
        assert.equal(this.instance.option("value"), 100, "check that value option is ok");
        assert.equal(this.element.find("." + INPUT_CLASS).val(), 100, "find and check that value from jQuery is ok too");
    });

    QUnit.test("B235175 - add additional test cases for various numbers", (assert) => {
        assert.expect(10);

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;
        const isTextMode = instance.option("mode") === "text";
        let expectedInputValue;

        instance.option("value", "1");

        $input.focus()
            .val("1e2")
            .trigger("change");
        assert.strictEqual(instance.option("value"), 100, "check widgets option value 100");
        $input.focusout();
        expectedInputValue = isTextMode ? "100" : "1e2";
        assert.strictEqual($input.val(), expectedInputValue, "check input value 100");

        $input.focus()
            .val("2e+3")
            .trigger("change");
        assert.strictEqual(instance.option("value"), 2000, "check widgets option value 2000");
        $input.focusout();
        expectedInputValue = isTextMode ? "2000" : "2e+3";
        assert.strictEqual($input.val(), expectedInputValue, "check input value 2000");

        $input.focus()
            .val("1e-2")
            .trigger("change");
        assert.strictEqual(instance.option("value"), 0.01, "check widgets option value 0.01");
        $input.focusout();
        expectedInputValue = isTextMode ? "0.01" : "1e-2";
        assert.strictEqual($input.val(), expectedInputValue, "check input value 0.01");

        instance.option("value", "");

        keyboard
            .focus()
            .type(" 2")
            .change();
        assert.equal(instance.option("value"), 2, "check widgets option value 2");
        $input.focusout();
        assert.equal($input.val(), "2", "check input value 2");

        instance.option("value", "1");
        keyboard
            .focus()
            .type(" 1")
            .change();
        assert.equal(instance.option("value"), 11, "check widgets option value 1");
        $input.focusout();
        assert.equal($input.val(), "11", "check input value 1");
    });

    QUnit.test("B235175 - one case for minmax numberbox", (assert) => {
        assert.expect(4);

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;

        instance.option("value", "6");
        instance.option("max", 50);

        keyboard
            .type("9")
            .change();

        assert.equal(instance.option("value"), 50, "check widgets option value 50");
        assert.equal($input.val(), "50", "check input value 50");

        instance.option("value", "6");
        keyboard
            .type("9")
            .change();
        assert.equal(instance.option("value"), 50, "check widgets option value 50");
        assert.equal($input.val(), "50", "check input value 50");
    });

    QUnit.test("numberbox should correctly process 'undefined' value", (assert) => {
        const instance = this.instance;

        instance.option("value", undefined);

        assert.equal(instance.option("value"), null, "value was reset correctly");
    });

    QUnit.test("B236651 - when we try set zero value that do not change", (assert) => {
        assert.expect(4);

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;
        instance.option("value", "");

        keyboard
            .focus()
            .type("69")
            .change();
        assert.equal(instance.option("value"), 69, "check widgets option value 69");
        assert.equal($input.val(), "69", "check input value 69");

        keyboard
            .focus()
            .press("backspace")
            .press("backspace")
            .type("0")
            .change();

        assert.equal(instance.option("value"), 0, "check widgets option value 0");
        assert.equal($input.val(), "0", "check input value 0");
    });

    QUnit.test("Both comma and dot can be used as float separator (Q561267)", (assert) => {
        assert.expect(4);

        const $input = this.element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const instance = this.instance;

        instance.option("value", null);

        $input.attr("type", "text");
        keyboard
            .focus()
            .type("1.1")
            .change();

        assert.equal(instance.option("value"), 1.1);
        $input.focusout();
        assert.equal($input.val(), "1.1");

        instance.option("value", "");

        keyboard
            .focus()
            .type("1,2")
            .change();

        assert.equal(instance.option("value"), 1.2);
        $input.focusout();
        assert.equal($input.val(), "1.2");
    });

    QUnit.test("Complete dispose dxNumberBox", (assert) => {
        this.instance._dispose();
        assert.ok(!this.element.children().length);
    });

    QUnit.test("T282446 - widget disabled state change should lead to spin buttons disabled state change", (assert) => {
        const $element = $("#widget").dxNumberBox({
            disabled: true,
            showSpinButtons: true
        });

        const instance = $element.dxNumberBox("instance");
        const $spinButton = $element.find(".dx-numberbox-spin-button");

        instance.option("disabled", false);

        assert.ok(!SpinButton.getInstance($spinButton).option("disabled"), "spin button disabled state is correct");
    });
});

QUnit.module("widget sizing render", {}, () => {
    QUnit.test("default", (assert) => {
        const $element = $("#widget").dxNumberBox();

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("constructor", (assert) => {
        const $element = $("#widget").dxNumberBox({ width: 400 });
        const instance = $element.dxNumberBox("instance");

        assert.strictEqual(instance.option("width"), 400);
        assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
    });

    QUnit.test("root with custom width", (assert) => {
        const $element = $("#widthRootStyle").dxNumberBox();
        const instance = $element.dxNumberBox("instance");

        assert.strictEqual(instance.option("width"), undefined);
        assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
    });

    QUnit.test("change width", (assert) => {
        const $element = $("#widget").dxNumberBox();
        const instance = $element.dxNumberBox("instance");
        const customWidth = 400;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });
});

QUnit.module("keyboard navigation", {}, () => {
    QUnit.test("control keys test", (assert) => {
        const element = $("#numberbox").dxNumberBox({
            focusStateEnabled: true,
            value: 100
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.equal(instance.option("value"), 100);

        keyboard.keyDown("up");
        assert.equal(instance.option("value"), 101, "value is correct after upArrow press");

        keyboard.keyDown("down");
        assert.equal(instance.option("value"), 100, "value is correct after downArrow press");

        instance.option("step", 2);

        keyboard.keyDown("down");
        assert.equal(instance.option("value"), 98, "value is correct after downArrow press");

        keyboard.keyDown("up");
        assert.equal(instance.option("value"), 100, "value is correct after upArrow press");
    });

    QUnit.test("it is impossible to change value by keyboard in readonly editor", (assert) => {
        const element = $("#numberbox").dxNumberBox({
            focusStateEnabled: true,
            readOnly: true,
            value: 100
        });

        const instance = element.dxNumberBox("instance");
        const $input = element.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        assert.equal(instance.option("value"), 100);

        keyboard.keyDown("up");
        assert.equal(instance.option("value"), 100, "value is correct after upArrow press");

        keyboard.keyDown("down");
        assert.equal(instance.option("value"), 100, "value is correct after downArrow press");
    });

    QUnit.test("keypress with meta key should not be prevented", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        let isKeyPressPrevented = false;
        $input.on("keypress", e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });
        keyboard.triggerEvent("keypress", { key: "0", metaKey: true });
        assert.equal(isKeyPressPrevented, false, "keypress with meta is not prevented");
    });

    QUnit.test("keypress with ctrl key should not be prevented", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        let isKeyPressPrevented = false;
        $input.on("keypress", e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });
        keyboard.triggerEvent("keypress", { key: "0", ctrlKey: true });
        assert.equal(isKeyPressPrevented, false, "keypress with meta is not prevented");
    });

    QUnit.test("control keys should not be prevented", (assert) => {
        const controlKeys = ["Tab", "Del", "Delete", "Backspace", "Left", "ArrowLeft", "Right", "ArrowRight", "Home", "End"];

        let isKeyPressPrevented = false;
        const $numberBox = $("#numberbox").dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.on("keypress", e => {
            isKeyPressPrevented = e.isDefaultPrevented();
        });

        $.each(controlKeys, (_, key) => {
            isKeyPressPrevented = false;
            keyboard.triggerEvent("keypress", { key });
            assert.equal(isKeyPressPrevented, false, key + " is not prevented");
        });
    });

    QUnit.test("Subtract key is not prevented", (assert) => {
        const keyPressStub = sinon.stub();
        const $numberBox = $("#numberbox").dxNumberBox({
            focusStateEnabled: true
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.on("keypress", keyPressStub);

        keyboard.triggerEvent("keypress", { keyCode: 109, key: "Subtract" });
        assert.equal(keyPressStub.lastCall.args[0].isDefaultPrevented(), false, "Subtract key is not prevented");
    });
});

QUnit.module("number validation", {}, () => {
    QUnit.test("decimal is not removed on valueChangeEvent", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            valueChangeEvent: "keyup"
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        $input.val("1").trigger("keyup");
        $input.val("1.").trigger("keyup");

        const inputValue = $input.val();

        $input.trigger("keyup");

        assert.equal($input.val(), inputValue, "decimal not removed");
    });

    QUnit.test("T277051 - the 'e' letter entered in the center of text should not be ignored", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: 95
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find(".dx-texteditor-input");
        const keyboard = keyboardMock($input);

        keyboard
            .caret(1)
            .type("e0");

        $input
            .change();

        assert.equal(numberBox.option("value"), 900000, "value is correct");
    });

    QUnit.test("T303827: Delete last number in scientific notation with valueChangeEvent:'keyup'", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            valueChangeEvent: 'keyup'
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        const isTextMode = numberBox.option("mode") === "text";

        const initialValue = "888888888888888888888888888888";
        let expectedInputValue;
        let expectedOptionValue;

        keyboard
            .type(initialValue);

        $input.focusout();
        $input.focus();

        keyboard
            .caret(30)
            .press("backspace");

        $input.trigger("keyup");

        expectedInputValue = isTextMode ? "8.888888888888888e+3" : "888888888888888888888888888880";
        assert.equal($input.val(), expectedInputValue, "last digit was deleted");

        expectedOptionValue = isTextMode ? "8.888888888888888e+3" : "8.888888888888888e+29";
        assert.equal(numberBox.option("value"), expectedOptionValue, "value vas changed");
    });

    QUnit.test("Value shouldn't be reset after point remove", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            valueChangeEvent: "keyup",
            value: 55.3
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.prop("type", "text");

        keyboard
            .caret(7)
            .press("backspace")
            .press("backspace");

        assert.equal($input.val(), "55", "value is correct");
    });

    QUnit.test("When is type 'number' set entered characters should be saved", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            valueChangeEvent: "keyup",
            value: null
        });

        const numberBox = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);

        $input.prop("type", "text");
        $input
            .val(".")
            .trigger("keyup");

        assert.equal(numberBox.option("value"), null, "value is correct");

        $input
            .val(".5")
            .trigger("keyup");

        const validityState = $input.get(0).validity;
        const isBadInputDefined = validityState && validityState.badInput !== undefined;
        if(isBadInputDefined) {
            assert.equal(validityState.badInput, false, "validity is valid");
        }
        assert.equal(numberBox.option("value"), "0.5", "value is correct");
    });

    QUnit.test("the validation message should be shown if value is invalid", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            value: "abc"
        });

        const instance = $numberBox.dxNumberBox("instance");

        assert.equal($numberBox.find(".dx-invalid-message .dx-overlay-content").text(), instance.option("invalidValueMessage"), "validation message is rendered");
    });

    QUnit.test("the validation message should be shown if value is invalid after 'enter' key was pressed", (assert) => {
        const $numberBox = $("#numberbox").dxNumberBox({
            valueChangeEvent: "input"
        }).dxValidator({
            validationRules: [
                {
                    type: "range",
                    min: 3,
                    max: 10,
                    message: "Value is not in range"
                }
            ]
        });

        const instance = $numberBox.dxNumberBox("instance");
        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type("2");
        keyboard.change();
        assert.equal($numberBox.find(".dx-invalid-message .dx-overlay-content").text(), instance.option("validationError").message, "validation message is rendered");

        keyboard.press("enter");

        assert.equal($numberBox.find(".dx-invalid-message .dx-overlay-content").text(), "Value is not in range", "validation message is not empty");
    });

    QUnit.test("onValueChanged should be fired after 'enter' key was pressed", (assert) => {
        const onValueChangedStub = sinon.stub();

        const $numberBox = $("#numberbox").dxNumberBox({
            onValueChanged: onValueChangedStub
        });

        const $input = $numberBox.find("." + INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type("2");
        keyboard.press("enter");
        keyboard.change();

        assert.equal(onValueChangedStub.callCount, 1, "valueChange was fired");
    });
});

QUnit.module("aria accessibility", {}, () => {
    QUnit.test("aria role", (assert) => {
        const $element = $("#numberbox").dxNumberBox({});
        const $input = $element.find(".dx-texteditor-input");

        assert.equal($input.attr("role"), "spinbutton", "aria role is correct");
    });

    QUnit.test("aria properties", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            min: 12,
            max: 30,
            value: 25
        });

        const $input = $element.find(".dx-texteditor-input");

        assert.equal($input.attr("aria-valuemin"), 12, "aria min is correct");
        assert.equal($input.attr("aria-valuemax"), 30, "aria max is correct");
        assert.equal($input.attr("aria-valuenow"), 25, "aria now is correct");
    });

    QUnit.test("aria-valuemin and valuemax attributes should be set when min/max option is 0", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            min: 0,
            max: 0
        });

        const $input = $element.find(".dx-texteditor-input");

        assert.strictEqual($input.attr("aria-valuemin"), "0", "aria min is correct");
        assert.strictEqual($input.attr("aria-valuemax"), "0", "aria max is correct");
    });

    QUnit.test("the dxNumberBox should not have valuemin when max only is specified", (assert) => {
        const $element = $("#numberbox").dxNumberBox({
            max: 30,
            value: 25
        });
        const numberBox = $element.dxNumberBox("instance");
        const $input = $element.find(".dx-texteditor-input").get(0);

        assert.notOk($input.hasAttribute("aria-valuemin"), "there is no valuemin");

        numberBox.option({
            min: 4,
            max: undefined
        });
        assert.notOk($input.hasAttribute("aria-valuemax"), "there is no valuemax");
        assert.strictEqual($($input).attr("aria-valuemin"), "4", "valuemin is correct");

        numberBox.option({
            min: undefined,
            max: undefined
        });
        assert.notOk($input.hasAttribute("aria-valuemax"), "there is no valuemin");
        assert.notOk($input.hasAttribute("aria-valuemax"), "there is no valuemax");
    });
});
