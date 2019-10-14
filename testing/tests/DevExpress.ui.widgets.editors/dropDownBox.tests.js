import $ from "jquery";
import renderer from "core/renderer";
import keyboardMock from "../../helpers/keyboardMock.js";
import fx from "animation/fx";
import DropDownBox from "ui/drop_down_box";
import { isRenderer } from "core/utils/type";
import config from "core/config";
import browser from "core/utils/browser";

import "common.css!";

QUnit.testStart(() => {
    const markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownBox"></div>\
            <div id="dropDownBoxAnonymous"><div id="inner">Test</div></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const DX_TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
const TAB_KEY_CODE = "Tab";
const DX_STATE_FOCUSED_CLASS = "dx-state-focused";
const OVERLAY_CONTENT_CLASS = "dx-overlay-content";

const moduleConfig = {
    beforeEach: () => {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.$element = $("#dropDownBox");
        this.simpleItems = [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
            { id: 3, name: "Item 3" }
        ];
    },
    afterEach: () => {
        fx.off = false;
        this.clock.restore();
    }
};

const isIE11 = (browser.msie && parseInt(browser.version) === 11);

QUnit.module("common", moduleConfig, () => {
    QUnit.test("the widget should work without the dataSource", (assert) => {
        this.$element.dxDropDownBox({ value: 1 });
        const $input = this.$element.find(".dx-texteditor-input");
        const instance = this.$element.dxDropDownBox("instance");

        assert.equal(instance.option("value"), 1, "value is correct");
        assert.equal(instance.option("text"), 1, "text is correct");
        assert.equal($input.val(), 1, "input value is correct");

        instance.option("value", "Test");
        assert.equal(instance.option("value"), "Test", "value is correct");
        assert.equal(instance.option("text"), "Test", "text is correct");
        assert.equal($input.val(), "Test", "input value is correct");
    });

    QUnit.test("the widget should work when dataSource is set to null", (assert) => {
        this.$element.dxDropDownBox({ value: 1, dataSource: [1, 2, 3] });

        const instance = this.$element.dxDropDownBox("instance");

        instance.option("dataSource", null);

        assert.ok(true, "widget works correctly");
    });

    QUnit.test("array value should be supported", (assert) => {
        this.$element.dxDropDownBox({
            items: this.simpleItems,
            valueExpr: "id",
            displayExpr: "name",
            value: [2]
        });

        const $input = this.$element.find(".dx-texteditor-input");
        assert.equal($input.val(), "Item 2", "array value works");
    });

    QUnit.test("it should be possible to restore value after reset", (assert) => {
        const instance = new DropDownBox(this.$element, {
            value: 2
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.reset();
        instance.option("value", "Test");

        assert.equal($input.val(), "Test", "value has been applied");
    });

    QUnit.test("array value changing", (assert) => {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: "id",
            displayExpr: "name",
            value: [2]
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.option("value", 1);
        assert.equal($input.val(), "Item 1", "value has been changed correctly from array to primitive");

        instance.option("value", [2]);
        assert.equal($input.val(), "Item 2", "value has been changed correctly from primitive to array");
    });

    QUnit.test("multiple selection should work", (assert) => {
        this.$element.dxDropDownBox({
            items: this.simpleItems,
            valueExpr: "id",
            displayExpr: "name",
            value: [1, 3]
        });

        const $input = this.$element.find(".dx-texteditor-input");
        assert.equal($input.val(), "Item 1, Item 3", "multiple selection works");
    });

    QUnit.test("multiple selection value changing", (assert) => {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: "id",
            displayExpr: "name",
            value: 2
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.option("value", [1, 3]);
        assert.equal($input.val(), "Item 1, Item 3", "correct values are selected");
    });

    QUnit.test("value clearing", (assert) => {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            valueExpr: "id",
            displayExpr: "name",
            value: [1, 3]
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.option("value", null);
        assert.equal($input.val(), "", "input was cleared");
    });

    QUnit.test("clear button should save valueChangeEvent", (assert) => {
        const valueChangedHandler = sinon.spy();

        new DropDownBox(this.$element, {
            items: this.simpleItems,
            showClearButton: true,
            onValueChanged: valueChangedHandler,
            valueExpr: "id",
            displayExpr: "name",
            value: [1]
        });

        const $clearButton = this.$element.find(".dx-clear-button-area");
        $clearButton.trigger("dxclick");

        assert.equal(valueChangedHandler.callCount, 1, "valueChangedHandler has been called");
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, "dxclick", "event is correct");
    });

    QUnit.test("content template should work", (assert) => {
        assert.expect(4);

        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            opened: true,
            contentTemplate(e, contentElement) {
                assert.strictEqual(e.component.NAME, "dxDropDownBox", "component is correct");
                assert.equal(e.value, 1, "value is correct");
                assert.equal(isRenderer(contentElement), !!config().useJQuery, "contentElement is correct");

                return "Test content";
            },
            valueExpr: "id",
            displayExpr: "name",
            value: 1
        });

        assert.equal($(instance.content()).text(), "Test content", "content template has been rendered");
    });

    QUnit.test("anonymous content template should work", (assert) => {
        const $inner = $("#dropDownBoxAnonymous #inner");
        const instance = new DropDownBox($("#dropDownBoxAnonymous"), { opened: true });
        const $content = $(instance.content());

        assert.equal($content.text(), "Test", "Anonymous template works");
        assert.equal($content.find("#inner")[0], $inner[0], "Markup is equal by the link");
    });

    QUnit.test("anonymous template should not be passed to the custom button", (assert) => {
        const instance = new DropDownBox($("#dropDownBoxAnonymous"), {
            buttons: [
                { name: "test", location: "after", options: { text: "Button text" } }
            ],
            opened: true
        });

        const $content = $(instance.content());

        assert.equal($content.text(), "Test", "Anonymous template works");
        assert.equal($("#dropDownBoxAnonymous").find(".dx-button").text(), "Button text", "Button text is correct");
    });

    QUnit.test("popup and editor width should be equal", (assert) => {
        const instance = new DropDownBox(this.$element, {
            items: this.simpleItems,
            opened: true,
            width: 500,
            contentTemplate() {
                return "Test content";
            },
            valueExpr: "id",
            displayExpr: "name",
            value: [1, 3]
        });

        assert.equal($(instance.content()).outerWidth(), this.$element.outerWidth(), "width are equal on init");
        assert.equal($(instance.content()).outerWidth(), 500, "width are equal on init");

        instance.option("width", 700);
        assert.equal($(instance.content()).outerWidth(), this.$element.outerWidth(), "width are equal after option change");
        assert.equal($(instance.content()).outerWidth(), 700, "width are equal after option change");
    });

    QUnit.test("popup and editor width should be eual when the editor rendered in the hidden content", (assert) => {
        this.$element.hide();
        const instance = new DropDownBox(this.$element, {
            deferRendering: false,
            contentTemplate() {
                return "Test content";
            }
        });

        this.$element.show();
        instance.open();
        assert.equal($(instance.content()).outerWidth(), this.$element.outerWidth(), "width are equal");
    });

    QUnit.test("dropDownBox should work with the slow dataSource", (assert) => {
        const items = [{ key: 1, text: "Item 1" }, { key: 2, text: "Item 2" }];

        const instance = new DropDownBox(this.$element, {
            dataSource: {
                load() {
                    $.Deferred().resolve(items).promise();
                },
                byKey() {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve([{ key: 2, text: "Item 2" }]);
                    }, 50);

                    return d.promise();
                }
            },
            valueExpr: "key",
            displayExpr: "text",
            value: 2
        });

        const $input = this.$element.find(".dx-texteditor-input");

        this.clock.tick(50);

        assert.equal($input.val(), "Item 2", "Input value was filled");
        assert.equal(instance.option("value"), 2, "value was applied");
    });

    QUnit.test("dropDownBox should update display text after dataSource changed", (assert) => {
        const items = [{ id: 1, name: "item 1" }, { id: 2, name: "item 2" }, { id: 3, name: "item 3" }];

        const instance = new DropDownBox(this.$element, {
            dataSource: [],
            displayExpr: "name",
            valueExpr: "id",
            value: [2, 3]
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.option("dataSource", items);

        assert.equal($input.val(), "item 2, item 3", "input text has been updated");
    });

    QUnit.test("dropDownBox should update display text after displayExpr changed", (assert) => {
        const items = [{ id: 1, name: "item 1", text: "text 1" }];

        const instance = new DropDownBox(this.$element, {
            items,
            displayExpr: "name",
            valueExpr: "id",
            value: 1
        });

        const $input = this.$element.find(".dx-texteditor-input");

        instance.option("displayExpr", "text");
        assert.equal($input.val(), "text 1", "input text has been updated");
    });

    QUnit.test("dropDownBox should update display text when displayExpr was changed on initialization", (assert) => {
        this.$element.dxDropDownBox({
            items: [{ id: 1, name: "item 1", text: "text 1" }],
            onInitialized(e) {
                e.component.option("displayExpr", "name");
            },
            valueExpr: "id",
            value: 1
        });

        const $input = this.$element.find(".dx-texteditor-input");

        assert.equal($input.val(), "item 1", "input text is correct");
    });

    QUnit.test("text option should follow the displayValue option", (assert) => {
        const instance = new DropDownBox(this.$element, {});
        instance.option("displayValue", "test");

        assert.equal(instance.option("text"), "test", "text option has been changed");
    });

    QUnit.test("displayValue option should be correct after value option changed, acceptCustomValue = true", (assert) => {
        const instance = new DropDownBox(this.$element,
            {
                acceptCustomValue: true,
                dataSource: ["1", "2", "3"],
                value: "1"
            }
        );
        instance.option("value", "12");

        assert.equal(instance.option("displayValue"), "12", "displayValue option has been changed");
    });

    QUnit.test("displayValue option should be correct after value option changed, acceptCustomValue = true, initial value = null", (assert) => {
        const instance = new DropDownBox(this.$element,
            {
                acceptCustomValue: true,
                dataSource: ["1", "2", "3"],
                value: null
            }
        );
        instance.option("value", "12");

        assert.equal(instance.option("displayValue"), "12", "displayValue option has been changed");
    });
});

QUnit.module("popup options", moduleConfig, () => {
    QUnit.test("customize width and height", (assert) => {
        const instance = new DropDownBox(this.$element, {
            width: 200,
            dropDownOptions: {
                width: 100,
                height: 100
            },
            opened: true
        });

        const $popupContent = $(instance.content());

        assert.equal($popupContent.outerWidth(), 100, "popup width has been customized");
        assert.equal($popupContent.outerHeight(), 100, "popup height has been customized");

        instance.option("dropDownOptions.width", undefined);
        assert.equal($popupContent.outerWidth(), 200, "popup width customization has been cancelled");
    });

    QUnit.test("two way binding should work with dropDownOptions", (assert) => {
        const instance = new DropDownBox(this.$element, { opened: true });
        const popup = instance._popup;

        assert.equal(instance.option("dropDownOptions.visible", true, "visible is correct"));

        popup.option("resizeEnabled", true);
        assert.strictEqual(instance.option("dropDownOptions.resizeEnabled"), true, "popup option change leads to dropDownOptions change");
    });

    QUnit.test("popup should not be draggable by default", (assert) => {
        this.$element.dxDropDownBox({
            opened: true
        });

        const popup = this.$element.find(".dx-popup").dxPopup("instance");

        assert.strictEqual(popup.option("dragEnabled"), false, "dragging is disabled");
    });

    QUnit.test("popup should be flipped when container size is smaller than content size", (assert) => {
        const $dropDownBox = $("<div>").appendTo("body");
        try {
            $dropDownBox.css({ position: "fixed", bottom: 0 });
            $dropDownBox.dxDropDownBox({
                opened: true,
                contentTemplate() {
                    return $("<div>").css({ height: "300px", border: "1px solid #000" });
                }
            });

            const $popupContent = $("." + OVERLAY_CONTENT_CLASS);

            assert.ok($popupContent.hasClass("dx-dropdowneditor-overlay-flipped"), "popup was flipped");
        } finally {
            $dropDownBox.remove();
        }
    });

    QUnit.test("maxHeight should be 90% of maximum of top or bottom offsets including page scroll", (assert) => {
        this.$element.dxDropDownBox({
            items: [1, 2, 3],
            value: 2
        });

        const scrollTop = sinon.stub(renderer.fn, "scrollTop").returns(100);
        const windowHeight = sinon.stub(renderer.fn, "innerHeight").returns(700);
        const offset = sinon.stub(renderer.fn, "offset").returns({ left: 0, top: 200 });
        const instance = this.$element.dxDropDownBox("instance");

        try {
            instance.open();

            const popup = $(".dx-popup").dxPopup("instance");
            const maxHeight = popup.option("maxHeight");

            assert.roughEqual(Math.floor(maxHeight()), 523, 3, "maxHeight is correct");
        } finally {
            scrollTop.restore();
            windowHeight.restore();
            offset.restore();
        }
    });

    QUnit.test("Dropdownbox popup should change height according to the content", (assert) => {
        if(isIE11) {
            assert.expect(0);
            return;
        }

        const $content = $("<div>").attr("id", "content");

        const instance = new DropDownBox($("#dropDownBox"), {
            opened: true,
            contentTemplate: () => $content
        });

        const $popupContent = $(instance.content()).parent("." + OVERLAY_CONTENT_CLASS);
        const popupHeight = $popupContent.height();

        $("<div>").height(50).appendTo($content);
        assert.strictEqual($popupContent.height(), popupHeight + 50, "popup height has been changed");
    });
});

QUnit.module("keyboard navigation", moduleConfig, () => {
    QUnit.testInActiveWindow("first focusable element inside of content should get focused after tab pressing", (assert) => {
        const $input1 = $("<input>", { id: "input1", type: "text" });
        const $input2 = $("<input>", { id: "input2", type: "text" });

        const instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const $input = this.$element.find("." + DX_TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.press("tab");

        assert.equal($(instance.content()).parent("." + OVERLAY_CONTENT_CLASS).attr("tabindex"), -1, "popup content should not be tabbable");
        assert.ok(instance.option("opened"), "popup was not closed after tab key pressed");
        assert.ok($input1.is(":focus"), "first focusable content element got focused");
    });

    QUnit.testInActiveWindow("last focusable element inside of content should get focused after shift+tab pressing", (assert) => {
        const $input1 = $("<input>", { id: "input1", type: "text" });
        const $input2 = $("<input>", { id: "input2", type: "text" });

        const instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const $input = this.$element.find("." + DX_TEXTEDITOR_INPUT_CLASS);
        const event = $.Event("keydown", { key: TAB_KEY_CODE, shiftKey: true });

        $input.focus().trigger(event);

        assert.ok(instance.option("opened"), "popup was not closed after shift+tab key pressed");
        assert.ok($input2.is(":focus"), "first focusable content element got focused");
    });

    QUnit.testInActiveWindow("widget should be closed after tab pressing on the last content element", (assert) => {
        const $input1 = $("<input>", { id: "input1", type: "text" });
        const $input2 = $("<input>", { id: "input2", type: "text" });

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const keyboard = keyboardMock($input2);

        keyboard.press("tab");
        this.clock.tick();

        assert.notOk(instance.option("opened"), "popup was closed");
    });

    QUnit.testInActiveWindow("input should get focused when shift+tab pressed on first content element", (assert) => {
        const $input1 = $("<input>", { id: "input1", type: "text" });
        const $input2 = $("<input>", { id: "input2", type: "text" });

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate(component, content) {
                $(content).append($input1, $input2);
            }
        });

        const event = $.Event("keydown", { key: TAB_KEY_CODE, shiftKey: true });

        $input1.focus().trigger(event);

        assert.notOk(instance.option("opened"), "popup was closed");
        assert.ok(this.$element.hasClass(DX_STATE_FOCUSED_CLASS), "input is focused");
        assert.ok(event.isDefaultPrevented(), "prevent default for focusing it's own input but not an input of the previous editor on the page");
    });

    QUnit.testInActiveWindow("inner input should be focused after popup opening", (assert) => {
        const inputFocusedHandler = sinon.stub();
        const $input = $("<input>", { id: "input1", type: "text" }).on("focusin", inputFocusedHandler);

        const instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            contentTemplate(component, content) {
                $(content).append($input);
            }
        });

        instance.open();

        assert.ok(inputFocusedHandler.callCount, 1, "input get focused");
    });
});
