var $ = require("jquery"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("common.css!");
require("ui/text_area");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="textarea"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});


var TEXTAREA_CLASS = "dx-textarea",
    INPUT_CLASS = "dx-texteditor-input",
    PLACEHOLDER_CLASS = "dx-placeholder";


QUnit.module("rendering");

QUnit.test("onContentReady fired after the widget is fully ready", function(assert) {
    assert.expect(1);

    $("#textarea").dxTextArea({
        onContentReady: function(e) {
            assert.ok($(e.element).hasClass(TEXTAREA_CLASS));
        }
    });
});

QUnit.test("scrolling with dxpointer events", function(assert) {
    assert.expect(4);

    var longValue = "qwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTYqwertyQWERTY",
        $element = $("#textarea").dxTextArea({ height: 100, width: 100, value: longValue }),
        $input = $element.dxTextArea("instance")._input();

    assert.equal($input.scrollTop(), 0);

    var pointer = pointerMock($input).start().down().move(0, 40).scroll(0, 40).up();
    assert.equal($input.scrollTop(), 40);

    $(document).on("dxpointermove.dxtestns", function(e) {
        assert.ok(false, "dxpointermove should be prevented");
    });

    $($input).on("dxpointermove", function(e) {
        assert.ok(e.isScrollingEvent);
    });

    pointer.down().move(0, 40).scroll(0, 40).up();
    assert.equal($input.scrollTop(), 80);

    $(document).off(".dxtestns");
});


QUnit.module("options changing");

QUnit.test("value", function(assert) {
    assert.expect(2);

    var $element = $("#textarea").dxTextArea({}),
        $input = $element.find("." + INPUT_CLASS),
        instance = $element.dxTextArea("instance");

    instance.option("value", "123");
    assert.equal($input.val(), "123");

    instance.option("value", "321");
    assert.equal($input.val(), "321");
});

QUnit.test("disabled", function(assert) {
    assert.expect(2);

    var $element = $("#textarea").dxTextArea({}),
        $input = $element.find("." + INPUT_CLASS),
        instance = $element.dxTextArea("instance");

    instance.option("disabled", true);
    assert.ok($input.prop("disabled"));

    instance.option("disabled", false);
    assert.equal($input.prop("disabled"), false);
});

QUnit.test("placeholder", function(assert) {
    assert.expect(2);

    var $element = $("#textarea").dxTextArea({}),
        instance = $element.dxTextArea("instance");

    instance.option("placeholder", "John Doe");
    assert.equal($element.find("." + INPUT_CLASS).prop("placeholder") || $element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "John Doe");

    instance.option("placeholder", "John Jr. Doe");
    assert.equal($element.find("." + INPUT_CLASS).prop("placeholder") || $element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "John Jr. Doe");
});

QUnit.test("inputAttr", function(assert) {
    var $textArea = $("#textarea").dxTextArea({
        inputAttr: { id: "testId" }
    });

    var $input = $textArea.find("." + INPUT_CLASS);
    var instance = $textArea.dxTextArea("instance");

    assert.equal($input.attr("id"), "testId", "Attr ID was created on Init");

    instance.option("inputAttr", { "id": "newTestId" });
    assert.equal($input.attr("id"), "newTestId", "Attr ID was changed");
});

QUnit.test("the 'inputAttr' option should preserve widget specific classes", function(assert) {
    var $textArea = $("#textarea").dxTextArea({
        inputAttr: { class: "some-class" }
    });

    assert.equal($textArea.find("." + INPUT_CLASS).length, 1, "widget specific class is preserved");
});

QUnit.test("the 'inputAttr' option should affect only custom classes on change", function(assert) {
    var firstClassName = "first";
    var secondClassName = "second";
    var $textArea = $("#textarea").dxTextArea();
    var instance = $("#textarea").dxTextArea("instance");

    instance.option("inputAttr", { class: firstClassName });

    var $input = $textArea.find("." + INPUT_CLASS);
    assert.equal($input.length, 1, "widget specific class is preserved");
    assert.ok($input.hasClass(firstClassName), "first custom class is added");

    instance.option("inputAttr", { class: secondClassName });
    assert.equal($input.length, 1, "widget specific class is preserved");
    assert.ok($input.hasClass(secondClassName), "second custom class is added");
    assert.notOk($input.hasClass(firstClassName), "first custom class is removed");
});

QUnit.test("readOnly", function(assert) {
    assert.expect(2);

    var $element = $("#textarea").dxTextArea({}),
        $input = $element.find("." + INPUT_CLASS),
        instance = $element.dxTextArea("instance");

    instance.option("readOnly", true);
    assert.ok($input.prop("readOnly"));

    instance.option("readOnly", false);
    assert.equal($input.prop("readOnly"), false);
});

QUnit.test("B234546 dxTextArea - It is impossible to change the height via code", function(assert) {
    assert.expect(1);

    var $element = $("#textarea").dxTextArea({}),
        instance = $element.dxTextArea("instance"),
        height = 500;

    instance.option("height", height);
    assert.equal($element.height(), height, "Widget height should change too");
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    $("#textarea").dxTextArea({
        onValueChanged: function() { assert.ok(true); }
    }).dxTextArea("instance").option("value", true);
});

QUnit.test("B254647 dxTextArea - widget overlaps another widgets", function(assert) {
    var $element = $("#textarea").dxTextArea({}),
        instance = $element.dxTextArea("instance"),
        height = 500;

    instance.option("height", height);
    assert.equal($element.find("." + INPUT_CLASS).outerHeight(), $element.height(), "input outer height should be equal widget height");
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxTextArea();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxTextArea(),
        instance = $element.dxTextArea("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxTextArea(),
        instance = $element.dxTextArea("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("the 'autoResizeEnabled' option");

QUnit.test("widget is resized on init", function(assert) {
    var $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true
        }),
        $input = $element.find(".dx-texteditor-input");

    var inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on input", function(assert) {
    var $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true
        }),
        $input = $element.find(".dx-texteditor-input");

    $($input).trigger("focus");
    keyboardMock($input).type("\n\n");
    $($input).trigger("input");

    var inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on value change", function(assert) {
    var $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true
        }),
        instance = $element.dxTextArea("instance"),
        $input = $element.find(".dx-texteditor-input");

    instance.option("value", "\n\n");

    var inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget is resized on paste", function(assert) {
    var $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true
        }),
        $input = $element.find(".dx-texteditor-input");

    $input
        .val("\n\n")
        .trigger("paste");

    var inputHeight = $input.outerHeight();
    $input.height(0);

    assert.equal(inputHeight, $input[0].scrollHeight, "widget height is correct");
});

QUnit.test("widget has correct height with auto resize mode and the 'maxHeight' option", function(assert) {
    var boundaryHeight = 50,
        $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true,
            value: "1\n2\n3\n4\n5",
            maxHeight: boundaryHeight
        }),
        $input = $element.find(".dx-texteditor-input");

    var elementHeight = $element.outerHeight(),
        inputHeight = $input.outerHeight();

    $element.css("maxHeight", "");
    $input.css("height", 0);
    var heightDifference = $element.outerHeight() - $input.outerHeight();

    assert.equal(elementHeight, boundaryHeight, "widget height is correct");
    assert.equal(inputHeight, boundaryHeight - heightDifference, "widget height is correct");
});

QUnit.test("widget has correct height with auto resize mode and the 'minHeight' option", function(assert) {
    var boundaryHeight = 50,
        $element = $("#textarea").dxTextArea({
            autoResizeEnabled: true,
            value: "1",
            minHeight: boundaryHeight
        }),
        $input = $element.find(".dx-texteditor-input");

    var elementHeight = $element.outerHeight(),
        inputHeight = $input.outerHeight();

    $element.css("min-height", "");
    $input.css("height", 0);
    var heightDifference = $element.outerHeight() - $input.outerHeight();

    assert.equal(elementHeight, boundaryHeight, "widget height is correct");
    assert.equal(inputHeight, boundaryHeight - heightDifference, "input height is correct");
});

QUnit.test("widget should adopt its size on shown (T403238)", function(assert) {
    var $element = $("#textarea")
            .hide()
            .dxTextArea({
                width: 70,
                autoResizeEnabled: true,
                minHeight: 20
            }),
        initialHeight = $element.height(),
        instance = $element.dxTextArea("instance");

    instance.option("value", "some really long string that should be wrapped");
    $element.show().triggerHandler("dxshown");

    assert.ok($element.height() > initialHeight, "widget is resized");
});

QUnit.test("widget should adopt its size on 'visible' option change (T403238)", function(assert) {
    var $element = $("#textarea")
            .dxTextArea({
                width: 70,
                autoResizeEnabled: true,
                minHeight: 20
            }),
        initialHeight = $element.height(),
        instance = $element.dxTextArea("instance");

    instance.option("visible", false);
    instance.option({
        value: "some really long string that should be wrapped",
        visible: true
    });

    assert.ok($element.height() > initialHeight, "widget is resized");
});
