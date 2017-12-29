"use strict";

/* global fields */

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

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
            this.getValueButtonElement().click();

            var $input = this.getTextEditorElement().find("input");
            $input.val("Test");

            if(eventType === "keyup") {
                keyboardMock($input).keyUp(key);
            } else {
                keyboardMock($input).keyDown(key);
            }
            $input.trigger("change");
        };
    }
}, function() {
    QUnit.test("show editor on keydown event", function(assert) {
        this.instance.option("value", ["Zipcode", "<>", 123]);

        keyboardMock(this.getValueButtonElement()).keyDown(ENTER_KEY);

        assert.notOk(this.getValueButtonElement().length);
        assert.ok(this.getTextEditorElement().length);
    });

    QUnit.test("skip first enter keyup after enter keydown by value button", function(assert) {
        this.instance.option("value", ["Zipcode", "<>", 123]);

        keyboardMock(this.getValueButtonElement()).keyDown(ENTER_KEY);
        keyboardMock(this.getTextEditorElement()).keyUp(ENTER_KEY);

        assert.ok(this.getTextEditorElement().length);

        keyboardMock(this.getTextEditorElement()).keyDown(ENTER_KEY);
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
        this.changeValueAndPressKey(TAB_KEY, "keyup");

        assert.equal(this.getValueButtonElement().text(), "Test");
    });

    QUnit.test("tab press without change a condition", function(assert) {
        this.getValueButtonElement().click();

        document.activeElement.blur();
        keyboardMock(this.getTextEditorElement().find("input")).keyUp(TAB_KEY);

        assert.equal(this.getValueButtonElement().text(), "<enter a value>");
    });

    QUnit.test("change condition value after enter key press", function(assert) {
        var value = this.instance.option("value");

        this.changeValueAndPressKey("enter");

        assert.notEqual(this.instance.option("value"), value);
        assert.equal(this.getValueButtonElement().length, 1);

        value = this.instance.option("value");

        this.changeValueAndPressKey("enter");
        keyboardMock(this.getTextEditorElement()).keyUp(ENTER_KEY);

        assert.equal(this.instance.option("value"), value);
        assert.equal(this.getValueButtonElement().length, 1);
    });

    QUnit.testInActiveWindow("value button gets focus after enter key press", function(assert) {
        this.changeValueAndPressKey(ENTER_KEY);

        assert.ok(this.getValueButtonElement().is(":focus"));
    });

    QUnit.testInActiveWindow("value button gets focus after escape key press", function(assert) {
        this.changeValueAndPressKey(ESCAPE_KEY, "keyup");

        assert.ok(this.getValueButtonElement().is(":focus"));
    });

    //T591055
    QUnit.testInActiveWindow("menu has focus after open by enter key press", function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyDown(ENTER_KEY);

        assert.ok(this.getMenuElement().is(":focus"));
    });

    QUnit.testInActiveWindow("close menu after escape key press", function(assert) {
        keyboardMock(this.getOperationButtonElement()).keyDown(ENTER_KEY);

        assert.ok(this.getMenuElement().is(":focus"));

        keyboardMock(this.getMenuElement()).keyDown(ESCAPE_KEY);

        assert.notOk(this.getMenuElement().length);
        assert.ok(this.getOperationButtonElement().is(":focus"));
    });

    QUnit.testInActiveWindow("select item in menu", function(assert) {
        this.triggerEvent(this.getOperationButtonElement(), "keydown", ENTER_KEY);

        var menuKeyboard = keyboardMock(this.getMenuElement());

        menuKeyboard.keyDown(DOWN_ARROW_KEY);

        assert.equal($(".dx-treeview-node.dx-state-focused").text(), "Contains");

        menuKeyboard.keyDown(ENTER_KEY);

        assert.ok(this.getOperationButtonElement().is(":focus"));
        assert.equal(this.getOperationButtonElement().text(), "Contains");
    });
});
