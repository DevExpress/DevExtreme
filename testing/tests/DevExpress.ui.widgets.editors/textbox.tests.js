var $ = require("jquery"),
    TextBox = require("ui/text_box"),
    devices = require("core/devices"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="textbox"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var internals = TextBox.__internals;

var TEXTBOX_CLASS = "dx-textbox",
    INPUT_CLASS = "dx-texteditor-input",
    PLACEHOLDER_CLASS = "dx-placeholder",
    SEARCHBOX_CLASS = "dx-searchbox",
    SEARCH_ICON_CLASS = "dx-icon-search";

QUnit.module();

QUnit.test("onContentReady fired after the widget is fully ready", function(assert) {
    assert.expect(1);

    $("#textbox").dxTextBox({
        onContentReady: function(e) {
            assert.ok($(e.element).hasClass(TEXTBOX_CLASS));
        }
    });
});

QUnit.test("changing mode to 'search' should render search icon", function(assert) {
    var element = $("#textbox").dxTextBox(),
        textBox = element.dxTextBox("instance");

    textBox.option("mode", "search");

    assert.ok(element.has(SEARCHBOX_CLASS));
    assert.equal(element.find("." + SEARCH_ICON_CLASS).length, 1);
});

QUnit.test("'maxLength' option on android 2.3 and 4.1", function(assert) {
    var originalDevices = devices.real();
    devices.real({
        platform: "android",
        version: ["2", "3"]
    });

    var originalUA = internals.uaAccessor();
    internals.uaAccessor("default android browser");

    try {
        var $element = $("#textbox").dxTextBox({ maxLength: 1 }),
            $input = $element.find("." + INPUT_CLASS),
            event = $.Event("keydown", { key: "1" });

        $input.trigger(event);
        $input.val("1");
        assert.ok(!event.isDefaultPrevented());

        event = $.Event("keydown", { key: "2" });
        $input.trigger(event);
        assert.ok(event.isDefaultPrevented());
    } finally {
        devices.real(originalDevices);
        internals.uaAccessor(originalUA);
    }
});

QUnit.test("call focus() method", function(assert) {
    executeAsyncMock.setup();
    try {
        var inFocus,
            onFocusIn = function() {
                inFocus = !inFocus;
            },
            element = $("#textbox").dxTextBox({ onFocusIn: onFocusIn });

        inFocus = element.find(".dx-texteditor-input").is(":focus");
        assert.ok(!inFocus, "at start  input has not focused");

        element.find(".dx-texteditor-input").trigger("focusin");
        assert.ok(inFocus, "when call 'focus' method, then focus on input");

    } finally {
        executeAsyncMock.teardown();
    }
});

QUnit.test("T218573 - clearButton should be hidden if mode is 'search' and the 'showClearButton' option is false", function(assert) {
    var $element = $("#textbox").dxTextBox({
            showClearButton: false,
            mode: "search",
            value: "Text"
        }),
        instance = $element.dxTextBox("instance");

    assert.ok(!instance.option("showClearButton"), "the 'showClearButton' options is correct");
    assert.equal($(".dx-clear-button-area").length, 0, "clear button is not rendered");
});

QUnit.test("clear button should save valueChangeEvent", function(assert) {
    var valueChangedHandler = sinon.spy(),
        $element = $("#textbox").dxTextBox({
            showClearButton: true,
            value: "123",
            onValueChanged: valueChangedHandler
        });

    var $clearButton = $element.find(".dx-clear-button-area");
    $clearButton.trigger("dxclick");

    assert.equal(valueChangedHandler.callCount, 1, "valueChangedHandler has been called");
    assert.equal(valueChangedHandler.getCall(0).args[0].event.type, "dxclick", "event is correct");
});


QUnit.module("options changing", {
    beforeEach: function() {
        this.element = $("#textbox").dxTextBox({});
        this.input = this.element.find("." + INPUT_CLASS);
        this.instance = this.element.dxTextBox("instance");
    }
});

QUnit.test("mode", function(assert) {
    assert.expect(1);

    this.instance.option("mode", "search");
    assert.equal(this.element.find("." + INPUT_CLASS).attr("type"), "text");
});

QUnit.test("value", function(assert) {
    assert.expect(2);

    this.instance.option("value", "123");
    assert.equal(this.input.val(), "123");

    this.instance.option("value", "321");
    assert.equal(this.input.val(), "321");
});

QUnit.test("disabled", function(assert) {
    assert.expect(2);

    this.instance.option("disabled", true);
    assert.ok(this.input.prop("disabled"));

    this.instance.option("disabled", false);
    assert.ok(!this.input.prop("disabled"));
});

QUnit.test("placeholder", function(assert) {
    assert.expect(2);

    this.instance.option("placeholder", "John Doe");
    assert.equal(this.element.find("." + INPUT_CLASS).prop("placeholder") || this.element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "John Doe");

    this.instance.option("placeholder", "John Jr. Doe");
    assert.equal(this.element.find("." + INPUT_CLASS).prop("placeholder") || this.element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "John Jr. Doe");
});

QUnit.test("'maxLength' option", function(assert) {
    var originalDevices = devices.real();
    devices.real({
        platform: "not android",
        version: ["24"]
    });

    try {
        this.instance.option("maxLength", 5);
        assert.equal(this.input.attr("maxLength"), 5);

        this.instance.option("maxLength", null);
        assert.equal(this.input.attr("maxLength"), null);

        this.instance.option("maxLength", 3);
        assert.equal(this.input.attr("maxLength"), 3);
    } finally {
        devices.real(originalDevices);
    }
});

QUnit.test("'maxLength' on android 2.3 and 4.1 ", function(assert) {
    var originalDevices = devices.real();
    devices.real({
        platform: "android",
        version: ["4", "1"]
    });

    var originalUA = internals.uaAccessor();
    internals.uaAccessor("default android browser");

    try {
        this.instance.option("maxLength", 2);

        var event = $.Event("keydown", { key: "1" });

        this.input.trigger(event);
        this.input.val("1");
        assert.ok(!event.isDefaultPrevented());

        event = $.Event("keydown", { key: "2" });
        this.input.trigger(event);
        this.input.val("12");
        assert.ok(!event.isDefaultPrevented());

        event = $.Event("keydown", { key: "3" });
        this.input.trigger(event);
        assert.ok(event.isDefaultPrevented());
    } finally {
        devices.real(originalDevices);
        internals.uaAccessor(originalUA);
    }
});

QUnit.test("readOnly", function(assert) {
    assert.expect(2);

    this.instance.option("readOnly", true);
    assert.ok(this.input.prop("readOnly"));

    this.instance.option("readOnly", false);
    assert.equal(this.input.prop("readOnly"), false);
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    this.instance.option("onValueChanged", function() { assert.ok(true); });
    this.instance.option("value", true);
});

QUnit.test("options 'height' and 'width'", function(assert) {
    var h = 500,
        w = 400;
    this.instance.option({
        height: h,
        width: w,
        value: "qwertyQWERTY"
    });

    assert.equal(this.element.height(), h, "widget's height set");
    assert.equal(this.element.width(), w, "widget's width set");
    assert.equal(this.input.outerHeight(), this.element.height(), "input outer height should be equal widget height");
    assert.equal(this.input.outerWidth(), this.element.width(), "input outer width should be equal widget width");

    h = 300,
    w = 500;
    this.instance.option({
        height: h,
        width: w
    });

    assert.equal(this.element.height(), h, "widget's height set");
    assert.equal(this.element.width(), w, "widget's width set");
    assert.equal(this.input.outerHeight(), this.element.height(), "input outer height should be equal widget height");
    assert.equal(this.input.outerWidth(), this.element.width(), "input outer width should be equal widget width");
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#textbox").dxTextBox();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#textbox").dxTextBox({ width: 400 }),
        instance = $element.dxTextBox("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxTextBox(),
        instance = $element.dxTextBox("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#textbox").dxTextBox(),
        instance = $element.dxTextBox("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});
