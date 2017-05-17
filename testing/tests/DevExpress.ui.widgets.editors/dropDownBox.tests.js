"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    fx = require("animation/fx"),
    DropDownBox = require("ui/drop_down_box");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownBox"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox",
    DX_TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",
    TAB_KEY_CODE = 9,
    DX_STATE_FOCUSED_CLASS = "dx-state-focused";

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.$element = $("#dropDownBox");
        this.simpleItems = [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
            { id: 3, name: "Item 3" }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module("common", moduleConfig);

QUnit.test("element should have correct class", function(assert) {
    this.$element.dxDropDownBox({});

    assert.ok(this.$element.hasClass(DROP_DOWN_BOX_CLASS), "element has correct class");
});

QUnit.test("the widget should work without the dataSource", function(assert) {
    this.$element.dxDropDownBox({ value: 1 });
    var $input = this.$element.find("input"),
        instance = this.$element.dxDropDownBox("instance");

    assert.equal(instance.option("value"), 1, "value is correct");
    assert.equal(instance.option("text"), 1, "text is correct");
    assert.equal($input.val(), 1, "input value is correct");

    instance.option("value", "Test");
    assert.equal(instance.option("value"), "Test", "value is correct");
    assert.equal(instance.option("text"), "Test", "text is correct");
    assert.equal($input.val(), "Test", "input value is correct");
});

QUnit.test("expressions", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: 1
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 1", "expressions work");
});

QUnit.test("array value should be supported", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [2]
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 2", "array value works");
});

QUnit.test("array value changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [2]
    });

    var $input = this.$element.find("input");

    instance.option("value", 1);
    assert.equal($input.val(), "Item 1", "value has been changed correctly from array to primitive");

    instance.option("value", [2]);
    assert.equal($input.val(), "Item 2", "value has been changed correctly from primitive to array");
});

QUnit.test("multiple selection should work", function(assert) {
    this.$element.dxDropDownBox({
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    var $input = this.$element.find("input");
    assert.equal($input.val(), "Item 1, Item 3", "multiple selection works");
});

QUnit.test("multiple selection value changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: 2
    });

    var $input = this.$element.find("input");

    instance.option("value", [1, 3]);
    assert.equal($input.val(), "Item 1, Item 3", "correct values are selected");
});

QUnit.test("value clearing", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    var $input = this.$element.find("input");

    instance.option("value", null);
    assert.equal($input.val(), "", "input was cleared");
});

QUnit.test("content template should work", function(assert) {
    assert.expect(3);

    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        opened: true,
        contentTemplate: function(e) {
            assert.strictEqual(e.component.NAME, "dxDropDownBox", "component is correct");
            assert.equal(e.value, 1, "value is correct");
            return "Test content";
        },
        valueExpr: "id",
        displayExpr: "name",
        value: 1
    });

    assert.equal(instance.content().text(), "Test content", "content template has been rendered");
});

QUnit.test("popup and editor width should be equal", function(assert) {
    var instance = new DropDownBox(this.$element, {
        items: this.simpleItems,
        opened: true,
        width: 500,
        contentTemplate: function() {
            return "Test content";
        },
        valueExpr: "id",
        displayExpr: "name",
        value: [1, 3]
    });

    assert.equal(instance.content().outerWidth(), this.$element.outerWidth(), "width are equal on init");
    assert.equal(instance.content().outerWidth(), 500, "width are equal on init");

    instance.option("width", 700);
    assert.equal(instance.content().outerWidth(), this.$element.outerWidth(), "width are equal after option change");
    assert.equal(instance.content().outerWidth(), 700, "width are equal after option change");
});

QUnit.test("dropDownBox should work with the slow dataSource", function(assert) {
    var items = [{ key: 1, text: "Item 1" }, { key: 2, text: "Item 2" }],
        instance = new DropDownBox(this.$element, {
            dataSource: {
                load: function() {
                    $.Deferred().resolve(items).promise();
                },
                byKey: function() {
                    var d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([{ key: 2, text: "Item 2" }]);
                    }, 50);

                    return d.promise();
                }
            },
            valueExpr: "key",
            displayExpr: "text",
            value: 2
        });

    var $input = this.$element.find("input");

    this.clock.tick(50);

    assert.equal($input.val(), "Item 2", "Input value was filled");
    assert.equal(instance.option("value"), 2, "value was applied");
});

QUnit.test("dropDownBox should update display text after dataSource changed", function(assert) {
    var items = [{ id: 1, name: "item 1" }, { id: 2, name: "item 2" }, { id: 3, name: "item 3" }],
        instance = new DropDownBox(this.$element, {
            dataSource: [],
            displayExpr: "name",
            valueExpr: "id",
            value: [2, 3]
        }),
        $input = this.$element.find("input");

    instance.option("dataSource", items);

    assert.equal($input.val(), "item 2, item 3", "input text has been updated");
});

QUnit.test("text option should follow the displayValue option", function(assert) {
    var instance = new DropDownBox(this.$element, {});
    instance.option("displayValue", "test");

    assert.equal(instance.option("text"), "test", "text option has been changed");
});


QUnit.module("popup options", moduleConfig);

QUnit.test("customize width and height", function(assert) {
    var instance = new DropDownBox(this.$element, {
            width: 200,
            dropDownOptions: {
                width: 100,
                height: 100
            },
            opened: true
        }),
        $popupContent = instance.content();

    assert.equal($popupContent.outerWidth(), 100, "popup width has been customized");
    assert.equal($popupContent.outerHeight(), 100, "popup height has been customized");

    instance.option("dropDownOptions.width", undefined);
    assert.equal($popupContent.outerWidth(), 200, "popup width customization has been cancelled");
});

QUnit.test("dimensionChanged should be called after dimension popup option changing", function(assert) {
    var instance = new DropDownBox(this.$element, {
            opened: true
        }),
        dimensionChangedSpy = sinon.spy(instance, "_dimensionChanged");

    var dimensionOptions = ["width", "height", "maxWidth", "maxHeight", "minWidth", "minHeight"];
    dimensionOptions.forEach(function(dimensionOption) {
        instance.option("dropDownOptions." + dimensionOption, 100);
    });

    assert.equal(dimensionChangedSpy.callCount, dimensionOptions.length, "dimensionChanged was called correct number of times");
});

QUnit.test("dimensionChanged should be called once when different popup options changing simultaneously", function(assert) {
    var instance = new DropDownBox(this.$element, {
            opened: true
        }),
        dimensionChangedSpy = sinon.spy(instance, "_dimensionChanged");

    instance.option("dropDownOptions", {
        title: "Test",
        width: 100,
        height: 100
    });

    assert.equal(dimensionChangedSpy.callCount, 1, "dimensionChanged was called once");
});

QUnit.test("popup should not be draggable by default", function(assert) {
    this.$element.dxDropDownBox({
        opened: true
    });

    var popup = this.$element.find(".dx-popup").dxPopup("instance");

    assert.strictEqual(popup.option("dragEnabled"), false, "dragging is disabled");
});


QUnit.module("keyboard navigation", moduleConfig);

QUnit.testInActiveWindow("first focusable element inside of content should get focused after tab pressing", function(assert) {
    var $input1 = $("<input>", { id: "input1", type: "text" }),
        $input2 = $("<input>", { id: "input2", type: "text" }),
        instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate: function(component, $content) {
                $content.append($input1, $input2);
            }
        }),
        $input = this.$element.find("." + DX_TEXTEDITOR_INPUT_CLASS),
        keyboard = keyboardMock($input);

    keyboard.press("tab");

    assert.equal(instance.content().parent(".dx-overlay-content").attr("tabindex"), -1, "popup content should not be tabbable");
    assert.ok(instance.option("opened"), "popup was not closed after tab key pressed");
    assert.ok($input1.is(":focus"), "first focusable content element got focused");
});

QUnit.testInActiveWindow("last focusable element inside of content should get focused after shift+tab pressing", function(assert) {
    var $input1 = $("<input>", { id: "input1", type: "text" }),
        $input2 = $("<input>", { id: "input2", type: "text" }),
        instance = new DropDownBox(this.$element, {
            opened: true,
            focusStateEnabled: true,
            contentTemplate: function(component, $content) {
                $content.append($input1, $input2);
            }
        }),
        $input = this.$element.find("." + DX_TEXTEDITOR_INPUT_CLASS),
        event = $.Event("keydown", { which: TAB_KEY_CODE, shiftKey: true });

    $input.focus().trigger(event);

    assert.ok(instance.option("opened"), "popup was not closed after shift+tab key pressed");
    assert.ok($input2.is(":focus"), "first focusable content element got focused");
});

QUnit.testInActiveWindow("widget should be closed after tab pressing on the last content element", function(assert) {
    var $input1 = $("<input>", { id: "input1", type: "text" }),
        $input2 = $("<input>", { id: "input2", type: "text" }),
        instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate: function(component, $content) {
                $content.append($input1, $input2);
            }
        }),
        keyboard = keyboardMock($input2);

    keyboard.press("tab");
    this.clock.tick();

    assert.notOk(instance.option("opened"), "popup was closed");
});

QUnit.testInActiveWindow("input should get focused when shift+tab pressed on first content element", function(assert) {
    var $input1 = $("<input>", { id: "input1", type: "text" }),
        $input2 = $("<input>", { id: "input2", type: "text" }),
        instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            opened: true,
            contentTemplate: function(component, $content) {
                $content.append($input1, $input2);
            }
        }),
        event = $.Event("keydown", { which: TAB_KEY_CODE, shiftKey: true });

    $input1.focus().trigger(event);

    assert.notOk(instance.option("opened"), "popup was closed");
    assert.ok(this.$element.hasClass(DX_STATE_FOCUSED_CLASS), "input is focused");
    assert.ok(event.isDefaultPrevented(), "prevent default for focusing it's own input but not an input of the previous editor on the page");
});

QUnit.testInActiveWindow("inner input should be focused after popup opening", function(assert) {
    var inputFocusedHandler = sinon.stub(),
        $input = $("<input>", { id: "input1", type: "text" }).on("focus", inputFocusedHandler),
        instance = new DropDownBox(this.$element, {
            focusStateEnabled: true,
            contentTemplate: function(component, $content) {
                $content.append($input);
            }
        });

    instance.open();

    assert.ok(inputFocusedHandler.callCount, 1, "input get focused");
});
