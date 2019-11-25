import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import nativePointerMock from "../../helpers/nativePointerMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";
import devices from "core/devices";

import "common.css!";
import "ui/text_area";
import "ui/scroll_view/ui.scrollable";

QUnit.testStart(() => {
    const markup =
        '<div id="textarea"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="container">\
            <div id="withContainer"></div>\
        </div>\
        <div id="scrollable">\
            <div id="content" style="width: 300px; height: 300px;">\
                <div id="textAreaInScrollable" style="margin: 50px;">\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});


const TEXTAREA_CLASS = "dx-textarea";
const INPUT_CLASS = "dx-texteditor-input";
const PLACEHOLDER_CLASS = "dx-placeholder";
const AUTO_RESIZE_CLASS = "dx-texteditor-input-auto-resize";

const SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container";

QUnit.module("rendering");

QUnit.test("onContentReady fired after the widget is fully ready", function(assert) {
    assert.expect(1);

    $("#textarea").dxTextArea({
        onContentReady(e) {
            assert.ok($(e.element).hasClass(TEXTAREA_CLASS));
        }
    });
});

QUnit.test("scrolling with dxpointer events", function(assert) {
    assert.expect(4);

    const longValue = "qwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTY";
    const $element = $("#textarea").dxTextArea({ height: 100, width: 100, value: longValue });
    const $input = $element.dxTextArea("instance")._input();

    assert.equal($input.scrollTop(), 0);

    const pointer = pointerMock($input).start().down().move(0, 40).scroll(0, 40).up();
    assert.equal($input.scrollTop(), 40);

    $(document).on("dxpointermove.dxtestns", e => {
        assert.ok(false, "dxpointermove should be prevented");
    });

    $($input).on("dxpointermove", e => {
        assert.ok(e.isScrollingEvent);
    });

    pointer.down().move(0, 40).scroll(0, 40).up();
    assert.equal($input.scrollTop(), 80);

    $(document).off(".dxtestns");
});

QUnit.test("scrolling with dxpointer events, empty TextArea", function(assert) {
    const $element = $("#textarea").dxTextArea({ height: 100, width: 100 });
    const $input = $element.dxTextArea("instance")._input();

    $(document).on("dxpointermove.dxtestns", e => {
        assert.ok(true, "dxpointermove should not be prevented");
    });
    pointerMock($input).start().down().move(0, 40).scroll(0, 40).up();
    $(document).off(".dxtestns");
});


QUnit.module("options changing");

QUnit.test("value", function(assert) {
    assert.expect(2);

    const $element = $("#textarea").dxTextArea({});
    const $input = $element.find(`.${INPUT_CLASS}`);
    const instance = $element.dxTextArea("instance");

    instance.option("value", "123");
    assert.equal($input.val(), "123");

    instance.option("value", "321");
    assert.equal($input.val(), "321");
});

QUnit.test("disabled", function(assert) {
    assert.expect(2);

    const $element = $("#textarea").dxTextArea({});
    const $input = $element.find(`.${INPUT_CLASS}`);
    const instance = $element.dxTextArea("instance");

    instance.option("disabled", true);
    assert.ok($input.prop("disabled"));

    instance.option("disabled", false);
    assert.equal($input.prop("disabled"), false);
});

QUnit.test("placeholder", function(assert) {
    assert.expect(2);

    const $element = $("#textarea").dxTextArea({});
    const instance = $element.dxTextArea("instance");

    instance.option("placeholder", "John Doe");
    assert.equal($element.find(`.${INPUT_CLASS}`).prop("placeholder") || $element.find(`.${PLACEHOLDER_CLASS}`).attr("data-dx_placeholder"), "John Doe");

    instance.option("placeholder", "John Jr. Doe");
    assert.equal($element.find(`.${INPUT_CLASS}`).prop("placeholder") || $element.find(`.${PLACEHOLDER_CLASS}`).attr("data-dx_placeholder"), "John Jr. Doe");
});

QUnit.test("inputAttr", function(assert) {
    const $textArea = $("#textarea").dxTextArea({
        inputAttr: { id: "testId" }
    });

    const $input = $textArea.find(`.${INPUT_CLASS}`);
    const instance = $textArea.dxTextArea("instance");

    assert.equal($input.attr("id"), "testId", "Attr ID was created on Init");

    instance.option("inputAttr", { "id": "newTestId" });
    assert.equal($input.attr("id"), "newTestId", "Attr ID was changed");
});

QUnit.test("the 'inputAttr' option should preserve widget specific classes", function(assert) {
    const $textArea = $("#textarea").dxTextArea({
        inputAttr: { class: "some-class" }
    });

    assert.equal($textArea.find(`.${INPUT_CLASS}`).length, 1, "widget specific class is preserved");
});

QUnit.test("the 'inputAttr' option should affect only custom classes on change", function(assert) {
    const firstClassName = "first";
    const secondClassName = "second";
    const $textArea = $("#textarea").dxTextArea();
    const instance = $("#textarea").dxTextArea("instance");

    instance.option("inputAttr", { class: firstClassName });

    const $input = $textArea.find(`.${INPUT_CLASS}`);
    assert.equal($input.length, 1, "widget specific class is preserved");
    assert.ok($input.hasClass(firstClassName), "first custom class is added");

    instance.option("inputAttr", { class: secondClassName });
    assert.equal($input.length, 1, "widget specific class is preserved");
    assert.ok($input.hasClass(secondClassName), "second custom class is added");
    assert.notOk($input.hasClass(firstClassName), "first custom class is removed");
});

QUnit.test("readOnly", function(assert) {
    assert.expect(2);

    const $element = $("#textarea").dxTextArea({});
    const $input = $element.find(`.${INPUT_CLASS}`);
    const instance = $element.dxTextArea("instance");

    instance.option("readOnly", true);
    assert.ok($input.prop("readOnly"));

    instance.option("readOnly", false);
    assert.equal($input.prop("readOnly"), false);
});

QUnit.test("B234546 dxTextArea - It is impossible to change the height via code", function(assert) {
    assert.expect(1);

    const $element = $("#textarea").dxTextArea({});
    const instance = $element.dxTextArea("instance");
    const height = 500;

    instance.option("height", height);
    assert.equal($element.height(), height, "Widget height should change too");
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    $("#textarea").dxTextArea({
        onValueChanged() { assert.ok(true); }
    }).dxTextArea("instance").option("value", true);
});

QUnit.test("B254647 dxTextArea - widget overlaps another widgets", function(assert) {
    const $element = $("#textarea").dxTextArea({});
    const instance = $element.dxTextArea("instance");
    const height = 500;

    instance.option("height", height);
    assert.equal($element.find(`.${INPUT_CLASS}`).outerHeight(), $element.height(), "input outer height should be equal widget height");
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    const $element = $("#widget").dxTextArea();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("root with custom width", function(assert) {
    const $element = $("#widthRootStyle").dxTextArea();
    const instance = $element.dxTextArea("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    const $element = $("#widget").dxTextArea();
    const instance = $element.dxTextArea("instance");
    const customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("widget renders correctly when minHeight and maxHeight is specified in pixels", function(assert) {
    const minHeight = 100;
    const $element = $("#widget").dxTextArea({
        minHeight: minHeight + "px",
        autoResizeEnabled: true
    });

    const $input = $element.find(".dx-texteditor-input");
    const inputHeight = $input.outerHeight();

    assert.strictEqual(inputHeight, minHeight, "height is ok");
});


QUnit.module("the 'autoResizeEnabled' option");

QUnit.test("widget is resized on init", function(assert) {
    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true
    });

    const $input = $element.find(".dx-texteditor-input");

    const inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on input", function(assert) {
    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true
    });

    const $input = $element.find(".dx-texteditor-input");

    $($input).trigger("focus");
    keyboardMock($input).type("\n\n");
    $($input).trigger("input");

    const inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on value change", function(assert) {
    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true
    });

    const instance = $element.dxTextArea("instance");
    const $input = $element.find(".dx-texteditor-input");

    instance.option("value", "\n\n");

    const inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on paste", function(assert) {
    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true
    });

    const $input = $element.find(".dx-texteditor-input");

    $input
        .val("\n\n")
        .trigger("paste");

    const inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

[true, false].forEach((autoResizeEnabled) => {
    QUnit.test(`auto resize class depends on the "autoResizeEnabled" value, "autoResizeEnabled" is ${autoResizeEnabled}`, function(assert) {
        const $element = $("#textarea").dxTextArea({
            autoResizeEnabled,
            value: "1"
        });

        const $input = $element.find(`.${INPUT_CLASS}`);

        assert.strictEqual($input.hasClass(AUTO_RESIZE_CLASS), autoResizeEnabled, "Check auto resize class");
    });
});

QUnit.test("widget has correct height with auto resize mode and the 'maxHeight' option", function(assert) {
    const boundaryHeight = 50;

    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true,
        value: "1\n2\n3\n4\n5",
        maxHeight: boundaryHeight
    });

    const $input = $element.find(".dx-texteditor-input");
    const elementHeight = $element.outerHeight();
    const inputHeight = $input.outerHeight();

    $element.css("maxHeight", "");
    $input.css("height", 0);
    const heightDifference = $element.outerHeight() - $input.outerHeight();

    assert.equal(elementHeight, boundaryHeight, "widget height is correct");
    assert.equal(inputHeight, boundaryHeight - heightDifference, "widget height is correct");
});

QUnit.test("widget with auto resize should have a scrollbar if content is higher than the max height", function(assert) {
    const boundaryHeight = 50;

    const $element = $("#textarea");
    const instance = $element.dxTextArea({
        autoResizeEnabled: true,
        value: "1\n2\n3\n4\n5\n6\n7\n8\n9",
        maxHeight: boundaryHeight
    }).dxTextArea("instance");

    const $input = $element.find(`.${INPUT_CLASS}`);

    assert.notOk($input.hasClass(AUTO_RESIZE_CLASS), "textarea hasn't an auto resize class");
    assert.strictEqual($input.css("overflow-y"), "auto", "textarea has a scrollbar");

    instance.option("value", "1");
    assert.ok($input.hasClass(AUTO_RESIZE_CLASS), "textarea with auto resize hasn't a scrollbar in case the content fit into container");
});

QUnit.test("widget with auto resize should not have a scrollbar after max-height changed to the higher value", function(assert) {
    const $element = $("#textarea");
    const instance = $element.dxTextArea({
        autoResizeEnabled: true,
        value: "1\n2\n3\n4\n5\n6\n7\n8\n9",
        maxHeight: 50
    }).dxTextArea("instance");

    const $input = $element.find(`.${INPUT_CLASS}`);

    instance.option("maxHeight", 500);
    assert.ok($input.hasClass(AUTO_RESIZE_CLASS), "textarea with auto resize hasn't a scrollbar in case the content fit into container");
});

QUnit.test("widget has correct height with auto resize mode and the 'minHeight' option", function(assert) {
    const boundaryHeight = 50;

    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true,
        value: "1",
        minHeight: boundaryHeight
    });

    const $input = $element.find(".dx-texteditor-input");
    const elementHeight = $element.outerHeight();
    const inputHeight = $input.outerHeight();

    $element.css("min-height", "");
    $input.css("height", 0);
    const heightDifference = $element.outerHeight() - $input.outerHeight();

    assert.equal(elementHeight, boundaryHeight, "widget height is correct");
    assert.equal(inputHeight, boundaryHeight - heightDifference, "input height is correct");
});

QUnit.test("widget should adopt its size on shown (T403238)", function(assert) {
    const $element = $("#textarea")
        .hide()
        .dxTextArea({
            width: 70,
            autoResizeEnabled: true,
            minHeight: 20
        });

    const initialHeight = $element.height();
    const instance = $element.dxTextArea("instance");

    instance.option("value", "some really long string that should be wrapped");
    $element.show().triggerHandler("dxshown");

    assert.ok($element.height() > initialHeight, "widget is resized");
});

QUnit.test("widget should adopt its size on 'visible' option change (T403238)", function(assert) {
    const $element = $("#textarea")
        .dxTextArea({
            width: 70,
            autoResizeEnabled: true,
            minHeight: 20
        });

    const initialHeight = $element.height();
    const instance = $element.dxTextArea("instance");

    instance.option("visible", false);
    instance.option({
        value: "some really long string that should be wrapped",
        visible: true
    });

    assert.ok($element.height() > initialHeight, "widget is resized");
});

QUnit.test("vertical scroll bar is hidden in auto resize mode", function(assert) {
    const $element = $("#textarea").dxTextArea({
        autoResizeEnabled: true,
    });

    const $input = $element.find(`.${INPUT_CLASS}`);
    const instance = $element.dxTextArea("instance");

    assert.equal($input.css("overflow-y"), "hidden", "vertical scroll bar is initially hidden");

    instance.option("autoResizeEnabled", false);

    assert.equal($input.css("overflow-y"), "auto", "vertical scroll bar is visible after disabling auto resize");

    instance.option("autoResizeEnabled", true);

    assert.equal($input.css("overflow-y"), "hidden", "vertical scroll bar is hidden after enabling auto resize");
});


QUnit.test("widget can not scroll container to the top on change content height (T755402)", function(assert) {
    const container = $("#container").css({
        "overflow": "scroll",
        "height": "60px"
    });

    const $element = $("#withContainer").dxTextArea({
        autoResizeEnabled: true,
        valueChangeEvent: "keyup"
    });

    const $input = $element.find(".dx-texteditor-input");

    $($input).trigger("focus");
    keyboardMock($input).type("\n\n");
    keyboardMock($input).type("\n\n");
    keyboardMock($input).type("\n\n");
    keyboardMock($input).type("\n\n");
    keyboardMock($input).type("\n\n");
    container.scrollTop(20);
    keyboardMock($input).type("\n\n");
    assert.strictEqual(container.scrollTop(), 20);
});

QUnit.module("TextArea in simulated scrollable", () => {
    if(devices.current().deviceType === "desktop") {
        ["vertical", "horizontal"].forEach((direction) => {
            class TextAreaInScrollableTestHelper {
                constructor(direction) {
                    this._direction = direction;
                    this._isVerticalDirection = this._direction === 'vertical';
                    this.$scrollable = this._getScrollable();
                    this.$textArea = this._getTextArea();
                    this.$textAreaInput = this.$textArea.find(`.${INPUT_CLASS}`);
                    if(!this._isVerticalDirection) {
                        this.$textAreaInput.css({ 'white-space': 'nowrap' });
                    }
                    this.maxScrollValue = this._getMaxScrollValue(this._isVerticalDirection ? 'Height' : 'Width');
                }

                _getScrollable() {
                    return $("#scrollable").dxScrollable({
                        width: 200,
                        height: 200,
                        useNative: false,
                        direction: this._direction,
                        showScrollbar: "always",
                    });
                }

                _getTextArea() {
                    return $("#textAreaInScrollable").dxTextArea({
                        width: 100,
                        height: 100,
                        text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n"
                    });
                }

                _getMaxScrollValue(prop) {
                    return this.$textAreaInput.get(0)[`scroll${prop}`] - this.$textAreaInput.get(0)[`client${prop}`];
                }

                getScrollableContainer() {
                    return this.$scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
                }

                setPosition($element, scrollPosition) {
                    this._isVerticalDirection ? $element.scrollTop(scrollPosition) : $element.scrollLeft(scrollPosition);
                }

                checkAsserts(assert, expectedOffset) {
                    let $container = this.getScrollableContainer();

                    if(this._isVerticalDirection) {
                        assert.strictEqual($container.scrollTop(), expectedOffset, "scrollTop()");
                    } else {
                        assert.strictEqual($container.scrollLeft(), expectedOffset, "scrollLeft()");
                    }
                }

                isShift() {
                    return !this._isVerticalDirection;
                }
            }

            QUnit.test(`mousewheel: textArea (scrollPosition - MIN) - wheel -> up -> down - scrollable direction: ${direction}`, function(assert) {
                const helper = new TextAreaInScrollableTestHelper(direction);
                const $container = helper.getScrollableContainer();

                helper.setPosition($container, 100);

                const pointer = nativePointerMock(helper.$textAreaInput);

                pointer.start().wheel(20, helper.isShift());
                helper.checkAsserts(assert, 80);

                pointer.start().wheel(-20, helper.isShift());
                helper.checkAsserts(assert, 80);
            });

            QUnit.test(`mousewheel: textArea (scrollPosition - MAX) - wheel -> down -> up - scrollable direction: ${direction}`, function(assert) {
                const helper = new TextAreaInScrollableTestHelper(direction);
                const $container = helper.getScrollableContainer();

                helper.setPosition($container, 50);
                helper.setPosition(helper.$textAreaInput, helper.maxScrollValue);

                const pointer = nativePointerMock(helper.$textAreaInput);

                pointer.start().wheel(-20, helper.isShift());
                helper.checkAsserts(assert, 70);

                pointer.start().wheel(20, helper.isShift());
                helper.checkAsserts(assert, 70);
            });

            QUnit.test(`mousewheel: textArea (scrollPosition - MIDDLE) - wheel -> down -> up - scrollable direction: ${direction}`, function(assert) {
                const helper = new TextAreaInScrollableTestHelper(direction);
                const $container = helper.getScrollableContainer();

                helper.setPosition($container, 100);
                helper.setPosition(helper.$textAreaInput, helper.maxScrollValue / 2);

                const pointer = nativePointerMock(helper.$textAreaInput);

                pointer.start().wheel(-20, helper.isShift());
                helper.checkAsserts(assert, 100);

                pointer.start().wheel(20, helper.isShift());
                helper.checkAsserts(assert, 100);
            });

        });
    }
});

