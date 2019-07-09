var $ = require("jquery");

require("ui/autocomplete");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="dx-viewport">\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var WIDGET_CLASS = "dx-autocomplete",
    TEXTEDITOR_CLASS = "dx-texteditor",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";


QUnit.module("dxAutocomplete", {
    beforeEach: function() {
        this.element = $("#widget").dxAutocomplete({
            value: "text",
            dataSource: ["item 1", "item 2", "item 3"]
        });
        this.instance = this.element.dxAutocomplete("instance");
    }
});

QUnit.test("markup init", function(assert) {
    var element = this.element;

    assert.ok(element.hasClass(WIDGET_CLASS), "Element has " + WIDGET_CLASS + " class");
    assert.ok(element.hasClass(TEXTEDITOR_CLASS), "Element has " + TEXTEDITOR_CLASS + " class");
});

QUnit.test("init with options", function(assert) {
    var element = $("#widget").dxAutocomplete({
            value: "anotherText",
            placeholder: "type something"
        }),
        instance = element.dxAutocomplete("instance");

    assert.equal(instance.option("value"), "anotherText", "autocomplete-s textbox value initialization");
    assert.equal(instance.option("placeholder"), instance.option("placeholder"), "autocomplete-s successful placeholder initialization");

    instance.option("placeholder", "abcde");
    assert.equal(instance.option("placeholder"), "abcde", "when we change autocomplete-s placeholder, we change textbox-s placeholder");
});

QUnit.test("change autocomplete's textbox value", function(assert) {
    this.instance.option("value", "new value");
    assert.equal(this.instance.option("value"), "new value");

    this.instance.option("value", "newest value");
    assert.equal(this.instance.option("value"), "newest value");
});

QUnit.test("maxLength", function(assert) {
    this.instance.option("maxLength", 5);
    assert.equal(this.instance.option("maxLength"), 5);

    this.instance.option("maxLength", 3);
    assert.equal(this.instance.option("maxLength"), 3);
});

QUnit.test("input should be empty when value is empty", function(assert) {
    var $autocomplete = $("#widget").dxAutocomplete({
        placeholder: "test",
        value: ""
    });

    var $input = $autocomplete.find("." + TEXTEDITOR_INPUT_CLASS);
    assert.equal($input.val(), "", "input is empty");
});

QUnit.test("B251138 disabled", function(assert) {
    this.instance.option("disabled", true);
    assert.ok(this.instance.$element().hasClass("dx-state-disabled"), "disabled state should be added to autocomplete itself");
    assert.ok(this.instance.option("disabled"), "Disabled state should be propagated to texteditor");

    this.instance.option("disabled", false);
    assert.ok(!this.instance.$element().hasClass("dx-state-disabled"), "disabled state should be removed from autocomplete itself");
    assert.ok(!this.instance.option("disabled"), "Disabled state should be propagated to texteditor");
});


QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxAutocomplete({ width: 400 }),
        instance = $element.dxAutocomplete("instance"),
        elementStyles = $element.get(0).style;

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual(elementStyles.width, "400px", "width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxAutocomplete(),
        elementStyles = $element.get(0).style;

    assert.strictEqual(elementStyles.width, "300px", "width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxAutocomplete(),
        element = $element.get(0),
        instance = $element.dxAutocomplete("instance");

    instance.option("width", 400);

    assert.strictEqual(element.style.width, "400px", "width of the element must be equal to custom width");
});


QUnit.module("aria accessibility");

QUnit.test("aria-autocomplete property", function(assert) {
    var $element = $("#widget").dxAutocomplete(),
        $input = $element.find("." + TEXTEDITOR_INPUT_CLASS + ":first");

    assert.equal($input.attr("aria-autocomplete"), "inline");
});
