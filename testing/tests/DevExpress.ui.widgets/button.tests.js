"use strict";

var $ = require("jquery"),
    ValidationEngine = require("ui/validation_engine"),
    Validator = require("ui/validator"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/button");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="button"></div>\
        <div id="inkButton"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="buttonWithTemplate">\
            <div data-options="dxTemplate: { name: \'content\' }" data-bind="text: text"></div>\
        </div>\
        <div id="buttonWithAnonymousTemplate">\
            test\
        </div>';

    $("#qunit-fixture").html(markup);
});

var BUTTON_CLASS = "dx-button",
    BUTTON_TEXT_CLASS = "dx-button-text",
    BUTTON_HAS_TEXT_CLASS = "dx-button-has-text",
    BUTTON_HAS_ICON_CLASS = "dx-button-has-icon",
    BUTTON_CONTENT_CLASS = "dx-button-content",
    BUTTON_BACK_CLASS = "dx-button-back",
    BUTTON_SUBMIT_INPUT_CLASS = "dx-button-submit-input",
    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";

QUnit.test("markup init", function(assert) {
    var element = $("#button").dxButton();

    assert.ok(element.hasClass(BUTTON_CLASS));

    var items = element.children();

    var buttonContent = $(items[0]).hasClass(BUTTON_CONTENT_CLASS);

    assert.equal(true, buttonContent);
});

QUnit.test("init with options", function(assert) {
    var element = $("#button").dxButton({
            text: "text",
            icon: "home"
        }),
        buttonContent = element.find("." + BUTTON_CONTENT_CLASS);

    assert.equal($.trim(buttonContent.find("." + BUTTON_TEXT_CLASS).text()), "text");
    assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), "button with icon has icon class");
    assert.ok(element.hasClass(BUTTON_HAS_TEXT_CLASS), "button with text has text class");
});

QUnit.test("class added from type (back)", function(assert) {
    var element = $("#button").dxButton({
            type: "back"
        }),
        buttonContent = element.find("." + BUTTON_CONTENT_CLASS);

    assert.ok(element.hasClass(BUTTON_BACK_CLASS), "class was added");
    assert.ok(buttonContent.find(".dx-icon").length, "icon class was added");
});

QUnit.test("icon must rendered after change type of button on 'back'", function(assert) {
    var element = $("#button").dxButton({
        type: 'normal',
        text: 'test'
    });

    assert.ok(element.hasClass("dx-button-normal"), "button has correct type class");
    assert.equal(element.find(".dx-icon").length, 0, "icon not be rendered");

    element.dxButton("instance").option("type", "back");

    assert.equal(element.find(".dx-button-normal").length, 0, "prev class type was removed");
    assert.equal(element.find(".dx-icon").length, 1, "icon was rendered");
    assert.ok(element.hasClass(BUTTON_BACK_CLASS), "button has correct type class after change type");
});

QUnit.test("class is not removed after change type", function(assert) {
    var $element = $("#button").dxButton({});

    $element.addClass("test");
    $element.dxButton("option", "type", "custom-1");

    assert.ok($element.hasClass("test"));
});

QUnit.test("previous type class is removed after type changed", function(assert) {
    var $element = $("#button").dxButton({});

    $element.dxButton("option", "type", "custom-1");
    assert.ok($element.hasClass("dx-button-custom-1"));

    $element.dxButton("option", "type", "custom-2");
    assert.ok($element.hasClass("dx-button-custom-2"));
    assert.ok(!$element.hasClass("dx-button-custom-1"));
});

QUnit.test("icon", function(assert) {

    var element = $("#button").dxButton({
        icon: "back"
    });

    assert.ok(element.find(".dx-icon").hasClass("dx-icon-back"), "class was added");

    element.dxButton("instance").option("icon", "success");
    assert.ok(element.find(".dx-icon").hasClass("dx-icon-success"), "class set with option");
    assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), "button with icon has icon class");
    assert.ok(!element.hasClass(BUTTON_HAS_TEXT_CLASS, "button with icon only has not text class"));
});

QUnit.test("icon as path", function(assert) {
    var element = $("#button").dxButton({
        icon: "../../testing/content/add.png"
    });

    assert.ok(element.find("img[src='../../testing/content/add.png']").length, "icon was added by src");

    element.dxButton("instance").option("icon", "../../testing/content/plus.png");
    assert.ok(element.find("img[src='../../testing/content/plus.png']").length, "icon was changed correctly");
});

QUnit.test("icon as external lib class", function(assert) {
    var element = $("#button").dxButton({
        icon: "fa fa-icon"
    });

    assert.ok(element.find(".fa.fa-icon").length, "icon was added by fa class");

    element.dxButton("instance").option("icon", "fa-new-icon fa");
    assert.ok(element.find(".fa-new-icon.fa").length, "icon was changed correctly");
});

QUnit.test("dxButton content class appear on correct container (T256387)", function(assert) {
    var $button = $("#buttonWithTemplate").dxButton({ text: "text1", icon: "test-icon", template: "content" });

    assert.ok($button.find("." + BUTTON_CONTENT_CLASS).hasClass(TEMPLATE_WRAPPER_CLASS), "template has content class");
});

QUnit.test("dxButton with anonymous template", function(assert) {
    var $button = $("#buttonWithAnonymousTemplate").dxButton();

    assert.equal($.trim($button.text()), "test", "anonymous template rendered");
});

QUnit.test("T355000 - the 'onContentReady' action should be fired after widget is rendered entirely", function(assert) {
    var buttonConfig = {
        text: "Test button",
        icon: "trash"
    };

    var areElementsEqual = function(first, second) {
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

        var firstChildren = first.children(),
            secondChildren = second.children();

        for(var i = 0, n = first.length; i < n; i++) {
            if(!areElementsEqual(firstChildren.eq(i), secondChildren.eq(i))) {
                return false;
            }
        }

        return true;
    };

    var $firstButton = $("#widget").dxButton(buttonConfig);

    $("#button").dxButton($.extend({}, buttonConfig, {
        onContentReady: function(e) {
            assert.ok(areElementsEqual($firstButton, e.element), "rendered widget and widget with fired action are equals");
        }
    }));
});


QUnit.module("options changed callbacks", {
    beforeEach: function() {
        this.element = $("#button").dxButton();
        this.instance = this.element.dxButton("instance");
    }
});

QUnit.test("text", function(assert) {
    this.instance.option("text", "new text");
    assert.equal(this.element.text(), "new text");

    this.instance.option("text", "new text 2");
    assert.equal(this.element.text(), "new text 2");
    assert.ok(!this.element.hasClass(BUTTON_HAS_ICON_CLASS), "button with text only has not icon class");
    assert.ok(this.element.hasClass(BUTTON_HAS_TEXT_CLASS, "button with text has text class"));
});

QUnit.test("onClick", function(assert) {
    var clickHandler = sinon.spy();

    this.instance.option("onClick", clickHandler);
    this.element.trigger("dxclick");

    assert.ok(clickHandler.calledOnce, "Handler should be called");
    var params = clickHandler.getCall(0).args[0];
    assert.ok(params, "Event params should be passed");
    assert.ok(params.jQueryEvent, "jQueryEvent should be passed");
    assert.ok(params.validationGroup, "validationGroup should be passed");
});

QUnit.test("icon", function(assert) {
    this.instance.option("icon", "home");
    assert.equal(this.element.find(".dx-icon-home").length, 1);

    this.instance.option("icon", "add");
    assert.equal(this.element.find(".dx-icon-add").length, 1);

    this.instance.option("icon", undefined);
    assert.equal(this.element.find(".dx-icon-add").length, 0);
    assert.equal(this.element.find(".dx-icon-home").length, 0);
});

QUnit.test("type", function(assert) {
    this.instance.option("type", "back");
    assert.ok(this.element.hasClass(BUTTON_BACK_CLASS));
});

QUnit.test("disabled", function(assert) {
    this.instance.option("disabled", true);
    assert.ok(this.element.hasClass("dx-state-disabled"));
});

QUnit.test("T325811 - 'text' option change should not lead to widget clearing", function(assert) {
    var $testElement = $("<div>").appendTo(this.element);
    assert.ok($testElement.parent().hasClass("dx-button"), "test element is in button");
    this.instance.option("text", "new test button text");
    assert.ok($testElement.parent().hasClass("dx-button"), "test element is still in button");
});


QUnit.module("regressions", {
    beforeEach: function() {
        this.element = $("#button").dxButton();
        this.instance = this.element.dxButton("instance");
    }
});

QUnit.test("B230602", function(assert) {
    this.instance.option("icon", "1.png");
    assert.equal(this.element.find("img").length, 1);

    this.instance.option("icon", "2.png");
    assert.equal(this.element.find("img").length, 1);
});

QUnit.test("Q513961", function(assert) {
    this.instance.option({ text: "123", "icon": "home" });
    assert.equal(this.element.find(".dx-icon-home").index(), 0);
});

QUnit.test("B238735: dxButton holds the shape of an arrow after you change it's type from back to any other", function(assert) {
    this.instance.option("type", "back");
    assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), true, "back button css class removed");

    this.instance.option("type", "normal");
    assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), false, "back button css class removed");
});

QUnit.module("inkRipple");

QUnit.test("inkRipple should be removed when widget is removed", function(assert) {
    $("#inkButton").dxButton({
        useInkRipple: true,
        onClick: function(e) {
            var $element = $(e.component.element());
            $element.triggerHandler({ type: 'dxremove' });
            $element.trigger("dxinactive");
            assert.ok(true, "no exceptions");
        }
    });
    $("#inkButton").trigger("dxclick");
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxButton({ text: "ahoy!" });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxButton({ text: "ahoy!", width: 400 }),
        instance = $element.dxButton("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxButton({ text: "ahoy!" }),
        instance = $element.dxButton("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxButton({ text: "ahoy!" }),
        instance = $element.dxButton("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.module("keyboard navigation");

QUnit.test("click fires on enter", function(assert) {
    assert.expect(2);

    var clickFired = 0,
        $element = $("#button").dxButton({
            focusStateEnabled: true,
            onClick: function() { clickFired++; }
        }),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    keyboard.keyDown("enter");
    assert.equal(clickFired, 1, "press enter on button call click action");

    keyboard.keyDown("space");
    assert.equal(clickFired, 2, "press space on button call click action");
});

QUnit.test("arguments on key press", function(assert) {
    var clickHandler = sinon.spy(),
        $element = $("#button").dxButton({
            focusStateEnabled: true,
            onClick: clickHandler
        }),
        keyboard = keyboardMock($element);

    $element.trigger("focusin");
    keyboard.keyDown("enter");

    assert.ok(clickHandler.calledOnce, "Handler should be called");

    var params = clickHandler.getCall(0).args[0];
    assert.ok(params, "Event params should be passed");
    assert.ok(params.jQueryEvent, "jQueryEvent should be passed");
    assert.ok(params.validationGroup, "validationGroup should be passed");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#button").dxButton({});

    assert.equal($element.attr("role"), "button", "aria role is correct");
});

QUnit.test("aria-label attribute", function(assert) {
    var $element = $("#button").dxButton({
            text: 'test',
            icon: 'find',
            type: 'danger'
        }),
        instance = $element.dxButton("instance");

    assert.equal($element.attr("aria-label"), "test", "aria label for all params is correct");

    instance.option("text", "");
    assert.equal($element.attr("aria-label"), "find", "aria label without text is correct");

    instance.option("icon", "/path/file.png");
    assert.equal($element.attr("aria-label"), "file", "aria label without text and icon is correct");

    instance.option("icon", "");
    assert.equal($element.attr("aria-label"), undefined, "aria label without text and icon is correct");
});

QUnit.test("icon-type base64 should not be parsed for aria-label creation (T281454)", function(assert) {
    var $element = $("#button").dxButton({
        icon: 'data:image/png;base64,'
    });

    assert.equal($element.attr("aria-label"), "Base64", "aria label is not exist");
});

QUnit.test("after change the button type to 'back' and then change to 'normal' arrow should be disappear", function(assert) {
    var $element = $("#button").dxButton({});
    var instance = $element.dxButton("instance");

    var backIconClass = ".dx-icon-back";

    assert.equal($element.find(backIconClass).length, 0, "button hasn't 'back' icon");

    instance.option("type", "back");
    assert.equal($element.find(backIconClass).length, 1, "button has 'back' icon");

    instance.option("type", "normal");
    assert.equal($element.find(backIconClass).length, 0, "button hasn't 'back' icon");
});

QUnit.module("submit behavior", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.$element = $("#button").dxButton({ useSubmitBehavior: true });
        this.clickButton = function() {
            this.$element.trigger("dxclick");
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("render input with submit type", function(assert) {
    assert.ok(this.$element.find("input[type=submit]").length, 1);
});

QUnit.test("submit input has .dx-button-submit-input CSS class", function(assert) {
    assert.ok(this.$element.find("." + BUTTON_SUBMIT_INPUT_CLASS).length, 1);
});

QUnit.test("button click call click() on submit input", function(assert) {
    var clickHandlerSpy = sinon.spy();

    this.$element
        .find("." + BUTTON_SUBMIT_INPUT_CLASS)
        .on("click", clickHandlerSpy);

    this.clickButton();

    assert.ok(clickHandlerSpy.calledOnce);
});

QUnit.test("preventDefault is called to dismiss submit of form if validation failed", function(assert) {
    assert.expect(2);
    try {
        var validatorStub = sinon.createStubInstance(Validator),
            clickHandlerSpy = sinon.spy(function(e) {
                assert.ok(e.isDefaultPrevented(), "default is prevented");
            }),
            $element = this.$element.dxButton({ validationGroup: "testGroup" });

        validatorStub.validate = function() { return { isValid: false }; };

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

QUnit.test("button onClick event handler should raise once (T443747)", function(assert) {
    var clickHandlerSpy = sinon.spy();
    this.$element.dxButton({ onClick: clickHandlerSpy });
    this.clickButton();
    assert.ok(clickHandlerSpy.calledOnce);
});
