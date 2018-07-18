"use strict";

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js"),
    fields = require("../../../helpers/filterBuilderTestData.js");

require("ui/filter_builder/filter_builder");

var FILTER_BUILDER_ITEM_OPERATION_CLASS = "dx-filterbuilder-item-operation",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text",

    TAB_KEY = 9,
    ENTER_KEY = 13,
    ESCAPE_KEY = 27,
    DOWN_ARROW_KEY = 40;

QUnit.module("Keyboard navigation", {
    beforeEach: function() {
        this.container = $("#container");

        this.instance = this.container.dxFilterBuilder({
            value: [["State", "=", ""]],
            fields: fields
        }).dxFilterBuilder("instance");

        this.triggerEvent = function(element, eventType, keyCode) {
            element.trigger($.Event(eventType, { keyCode: keyCode }));
        };

        this.getValueButtonElement = function() {
            return this.container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        };

        this.getOperationButtonElement = function() {
            return this.container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        };

        this.getMenuElement = function() {
            return $(".dx-treeview");
        };

        this.getTextEditorElement = function() {
            return this.container.find(".dx-texteditor");
        };

        this.changeValueAndPressKey = function(key, eventType) {
            this.getValueButtonElement().trigger("dxclick");

            var textEditorElement = this.getTextEditorElement();
            textEditorElement.dxTextBox("instance").option("value", "Test");

            keyboardMock(this.getTextEditorElement()).keyUp(key);
        };

        this.showTextEditor = function() {
            keyboardMock(this.getValueButtonElement()).keyUp(ENTER_KEY);
        };

        this.setFocusToBody = function() {
            if(document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body") {
                document.activeElement.blur();
            }
        };
    }
}, function() {
    QUnit.test("show editor on keyup event", function(assert) {
        this.instance.option("value", ["Zipcode", "<>", 123]);

        this.showTextEditor();

        assert.notOk(this.getValueButtonElement().length);
        assert.ok(this.getTextEditorElement().length);
    });

    QUnit.test("enter keyup for value button and editor", function(assert) {
        this.instance.option("value", ["Zipcode", "<>", 123]);

        this.showTextEditor();

        assert.ok(this.getTextEditorElement().length);

        keyboardMock(this.getTextEditorElement()).keyUp(ENTER_KEY);

        assert.notOk(this.getTextEditorElement().length);
        assert.ok(this.getValueButtonElement().length);
    });

    QUnit.test("condition isn't changed after escape key press", function(assert) {
        var value = this.instance.option("value");

        this.changeValueAndPressKey(ESCAPE_KEY, "keyup");

        assert.equal(this.instance.option("value"), value);
        assert.equal(this.getValueButtonElement().length, 1);
    });

    QUnit.test("change condition value after tab press", function(assert) {
        this.getValueButtonElement().trigger("dxclick");

        var textEditorElement = this.getTextEditorElement();
        textEditorElement.dxTextBox("instance").option("value", "Test");
        this.setFocusToBody();

        keyboardMock(this.getTextEditorElement()).keyUp(TAB_KEY);

        assert.equal(this.getValueButtonElement().text(), "Test");
    });

    QUnit.test("tab press without change a condition", function(assert) {
        this.getValueButtonElement().trigger("dxclick");

        this.setFocusToBody();
        keyboardMock(this.getTextEditorElement().find("input")).keyUp(TAB_KEY);

        assert.equal(this.getValueButtonElement().text(), "<enter a value>");
    });

    QUnit.test("change condition value after enter key press", function(assert) {
        var value = this.instance.option("value");

        this.changeValueAndPressKey(ENTER_KEY);

        assert.notEqual(this.instance.option("value"), value);
        assert.equal(this.getValueButtonElement().length, 1);

        value = this.instance.option("value");

        this.changeValueAndPressKey(ENTER_KEY);

        assert.equal(this.instance.option("value"), value);
        assert.equal(this.getValueButtonElement().length, 1);
    });

    QUnit.testInActiveWindow("value button gets focus after enter key press", function(assert) {
        this.changeValueAndPressKey(ENTER_KEY);

        assert.ok(this.getValueButtonElement().is(":focus"));
    });

    QUnit.testInActiveWindow("value button gets focus after escape key press", function(assert) {
        this.changeValueAndPressKey(ESCAPE_KEY);

        assert.ok(this.getValueButtonElement().is(":focus"));
    });

    // T591055
    QUnit.testInActiveWindow("menu has focus after open by enter key press", function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        assert.ok(this.getMenuElement().is(":focus"));
    });

    QUnit.testInActiveWindow("close menu after escape key press", function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        assert.ok(this.getMenuElement().is(":focus"));

        keyboardMock(this.getMenuElement()).keyUp(ESCAPE_KEY);

        assert.notOk(this.getMenuElement().length);
        assert.ok(this.getOperationButtonElement().is(":focus"));
    });

    QUnit.testInActiveWindow("select item in menu", function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyUp(ENTER_KEY);

        var menuKeyboard = keyboardMock(this.getMenuElement());

        menuKeyboard.keyDown(DOWN_ARROW_KEY);

        assert.equal($(".dx-treeview-node.dx-state-focused").text(), "Contains");

        menuKeyboard.keyDown(ENTER_KEY);
        menuKeyboard.keyUp(ENTER_KEY);

        assert.ok(this.getOperationButtonElement().is(":focus"));
        assert.equal(this.getOperationButtonElement().text(), "Contains");
    });

    // T653968
    QUnit.testInActiveWindow("editor.value is changed after 'keyup' and saved in filterBulder.value by outer click", function(assert) {
        this.showTextEditor();

        var textEditorElement = this.getTextEditorElement(),
            textEditorInput = textEditorElement.find("input"),
            textEditorInstance = textEditorElement.dxTextBox("instance");

        textEditorInput.val("Test");
        assert.equal(textEditorInput.val(), "Test");
        assert.equal(textEditorInstance.option("value"), "");

        keyboardMock(textEditorInput).keyUp();

        assert.deepEqual(this.instance.option("value"), [["State", "=", ""]]);
        assert.equal(textEditorInstance.option("value"), "Test");
        assert.equal(textEditorInput.val(), "Test");

        $("body").trigger("dxpointerdown");

        assert.deepEqual(this.instance.option("value"), ["State", "=", "Test"]);
    });
});
