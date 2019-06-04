import $ from "jquery";
import ValidationEngine from "ui/validation_engine";
import Validator from "ui/validator";
import keyboardMock from "../../helpers/keyboardMock.js";

import "ui/button";
import "common.css!";

QUnit.testStart(() => {
    const markup =
        '<div id="button"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="inkButton"></div>\
            <div data-options="dxTemplate: { name: \'content\' }" data-bind="text: text"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const BUTTON_HAS_TEXT_CLASS = "dx-button-has-text";
const BUTTON_HAS_ICON_CLASS = "dx-button-has-icon";
const BUTTON_BACK_CLASS = "dx-button-back";
const BUTTON_SUBMIT_INPUT_CLASS = "dx-button-submit-input";

QUnit.module("options changed callbacks", {
    beforeEach: () => {
        this.element = $("#button").dxButton();
        this.instance = this.element.dxButton("instance");
    }
}, () => {
    QUnit.test("text", (assert) => {
        this.instance.option("text", "new text");
        assert.equal(this.element.text(), "new text");

        this.instance.option("text", "new text 2");
        assert.equal(this.element.text(), "new text 2");
        assert.ok(!this.element.hasClass(BUTTON_HAS_ICON_CLASS), "button with text only has not icon class");
        assert.ok(this.element.hasClass(BUTTON_HAS_TEXT_CLASS, "button with text has text class"));
    });

    QUnit.test("onClick", (assert) => {
        const clickHandler = sinon.spy();

        this.instance.option("onClick", clickHandler);
        this.element.trigger("dxclick");

        assert.ok(clickHandler.calledOnce, "Handler should be called");
        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, "Event params should be passed");
        assert.ok(params.event, "Event should be passed");
        assert.ok(params.validationGroup, "validationGroup should be passed");
    });

    QUnit.test("icon", (assert) => {
        this.instance.option("icon", "home");
        assert.equal(this.element.find(".dx-icon-home").length, 1);

        this.instance.option("icon", "add");
        assert.equal(this.element.find(".dx-icon-add").length, 1);

        this.instance.option("icon", undefined);
        assert.equal(this.element.find(".dx-icon-add").length, 0);
        assert.equal(this.element.find(".dx-icon-home").length, 0);
    });

    QUnit.test("icon position", (assert) => {
        this.instance.option({
            icon: "box",
            text: "Text",
            iconPosition: "right"
        });

        let $buttonContentElements = this.element.find(".dx-button-content").children();
        assert.ok($buttonContentElements.eq(1).hasClass("dx-icon"), "icon is after the text");
        assert.ok($buttonContentElements.eq(1).hasClass("dx-icon-right"), "icon has class for right position");
        assert.ok(this.element.hasClass("dx-button-icon-right"), "button has class for right icon position");

        this.instance.option("iconPosition", "left");
        $buttonContentElements = this.element.find(".dx-button-content").children();
        assert.ok($buttonContentElements.eq(0).hasClass("dx-icon"), "icon is before the text");
        assert.notOk($buttonContentElements.eq(0).hasClass("dx-icon-right"), "icon has no class for right position");
        assert.notOk(this.element.hasClass("dx-button-icon-right"), "button has no class for right icon position");
    });

    QUnit.test("type", (assert) => {
        this.instance.option("type", "back");
        assert.ok(this.element.hasClass(BUTTON_BACK_CLASS));
    });

    QUnit.test("disabled", (assert) => {
        this.instance.option("disabled", true);
        assert.ok(this.element.hasClass("dx-state-disabled"));
    });

    QUnit.test("readOnly validator should be excluded for the click action", (assert) => {
        const clickHandler = sinon.spy();

        this.instance.option({
            onClick: clickHandler
        });

        this.element.addClass("dx-state-readonly");
        this.element.trigger("dxclick");
        assert.strictEqual(clickHandler.callCount, 1, "click handler was executed");
    });

    QUnit.test("T325811 - 'text' option change should not lead to widget clearing", (assert) => {
        const $testElement = $("<div>").appendTo(this.element);
        assert.ok($testElement.parent().hasClass("dx-button"), "test element is in button");
        this.instance.option("text", "new test button text");
        assert.ok($testElement.parent().hasClass("dx-button"), "test element is still in button");
    });
});

QUnit.module("regressions", {
    beforeEach: () => {
        this.element = $("#button").dxButton();
        this.instance = this.element.dxButton("instance");
    }
}, () => {
    QUnit.test("B230602", (assert) => {
        this.instance.option("icon", "1.png");
        assert.equal(this.element.find("img").length, 1);

        this.instance.option("icon", "2.png");
        assert.equal(this.element.find("img").length, 1);
    });

    QUnit.test("Q513961", (assert) => {
        this.instance.option({ text: "123", "icon": "home" });
        assert.equal(this.element.find(".dx-icon-home").index(), 0);
    });

    QUnit.test("B238735: dxButton holds the shape of an arrow after you change it's type from back to any other", (assert) => {
        this.instance.option("type", "back");
        assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), true, "back button css class removed");

        this.instance.option("type", "normal");
        assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), false, "back button css class removed");
    });
});

QUnit.module("contentReady", {}, () => {
    QUnit.test("T355000 - the 'onContentReady' action should be fired after widget is rendered entirely", assert => {
        const buttonConfig = {
            text: "Test button",
            icon: "trash"
        };

        const areElementsEqual = (first, second) => {
            if(first.length !== second.length) {
                return false;
            }

            if(first.length === 0) {
                return true;
            }

            if(first.text() !== second.text()) {
                return false;
            }

            if(first.attr("class") !== second.attr("class")) {
                return false;
            }

            const firstChildren = first.children();
            const secondChildren = second.children();

            for(let i = 0, n = first.length; i < n; i++) {
                if(!areElementsEqual(firstChildren.eq(i), secondChildren.eq(i))) {
                    return false;
                }
            }

            return true;
        };

        const $firstButton = $("#widget").dxButton(buttonConfig);

        $("#button").dxButton($.extend({}, buttonConfig, {
            onContentReady(e) {
                assert.ok(areElementsEqual($firstButton, $(e.element)), "rendered widget and widget with fired action are equals");
            }
        }));
    });
});

QUnit.module("inkRipple", {}, () => {
    QUnit.test("inkRipple should be removed when widget is removed", assert => {
        $("#inkButton").dxButton({
            useInkRipple: true,
            onClick(e) {
                const $element = $(e.component.$element());
                $element.triggerHandler({ type: 'dxremove' });
                $element.trigger("dxinactive");
                assert.ok(true, "no exceptions");
            }
        });
        $("#inkButton").trigger("dxclick");
    });
});

QUnit.module("widget sizing render", {}, () => {
    QUnit.test("default", assert => {
        const $element = $("#widget").dxButton({ text: "ahoy!" });

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("constructor", assert => {
        const $element = $("#widget").dxButton({ text: "ahoy!", width: 400 });
        const instance = $element.dxButton("instance");

        assert.strictEqual(instance.option("width"), 400);
        assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
    });

    QUnit.test("root with custom width", assert => {
        const $element = $("#widthRootStyle").dxButton({ text: "ahoy!" });
        const instance = $element.dxButton("instance");

        assert.strictEqual(instance.option("width"), undefined);
        assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
    });

    QUnit.test("change width", assert => {
        const $element = $("#widget").dxButton({ text: "ahoy!" });
        const instance = $element.dxButton("instance");
        const customWidth = 400;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });
});

QUnit.module("keyboard navigation", {}, () => {
    QUnit.test("click fires on enter", assert => {
        assert.expect(2);

        let clickFired = 0;

        const $element = $("#button").dxButton({
            focusStateEnabled: true,
            onClick() {
                clickFired++;
            }
        });

        const keyboard = keyboardMock($element);

        $element.trigger("focusin");
        keyboard.keyDown("enter");
        assert.equal(clickFired, 1, "press enter on button call click action");

        keyboard.keyDown("space");
        assert.equal(clickFired, 2, "press space on button call click action");
    });

    QUnit.test("arguments on key press", assert => {
        const clickHandler = sinon.spy();

        const $element = $("#button").dxButton({
            focusStateEnabled: true,
            onClick: clickHandler
        });

        const keyboard = keyboardMock($element);

        $element.trigger("focusin");
        keyboard.keyDown("enter");

        assert.ok(clickHandler.calledOnce, "Handler should be called");

        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, "Event params should be passed");
        assert.ok(params.event, "Event should be passed");
        assert.ok(params.validationGroup, "validationGroup should be passed");
    });
});

QUnit.module("submit behavior", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        this.$element = $("#button").dxButton({ useSubmitBehavior: true });
        this.clickButton = function() {
            this.$element.trigger("dxclick");
            this.clock.tick();
        };
    },
    afterEach: () => {
        this.clock.restore();
    }
}, {}, () => {
    QUnit.test("render input with submit type", (assert) => {
        assert.ok(this.$element.find("input[type=submit]").length, 1);
    });

    QUnit.test("submit input has .dx-button-submit-input CSS class", (assert) => {
        assert.ok(this.$element.find("." + BUTTON_SUBMIT_INPUT_CLASS).length, 1);
    });

    QUnit.test("button click call click() on submit input", (assert) => {
        const clickHandlerSpy = sinon.spy();

        this.$element
            .find("." + BUTTON_SUBMIT_INPUT_CLASS)
            .on("click", clickHandlerSpy);

        this.clickButton();

        assert.ok(clickHandlerSpy.calledOnce);
    });

    QUnit.test("preventDefault is called to dismiss submit of form if validation failed", (assert) => {
        assert.expect(2);
        try {
            const validatorStub = sinon.createStubInstance(Validator);

            const clickHandlerSpy = sinon.spy(e => {
                assert.ok(e.isDefaultPrevented(), "default is prevented");
            });

            const $element = this.$element.dxButton({ validationGroup: "testGroup" });

            validatorStub.validate = () => {
                return { isValid: false };
            };

            ValidationEngine.registerValidatorInGroup("testGroup", validatorStub);

            $element
                .find("." + BUTTON_SUBMIT_INPUT_CLASS)
                .on("click", clickHandlerSpy);

            this.clickButton();

            assert.ok(clickHandlerSpy.called);
        } finally {
            ValidationEngine.initGroups();
        }
    });

    QUnit.test("button onClick event handler should raise once (T443747)", (assert) => {
        const clickHandlerSpy = sinon.spy();
        this.$element.dxButton({ onClick: clickHandlerSpy });
        this.clickButton();
        assert.ok(clickHandlerSpy.calledOnce);
    });
});
