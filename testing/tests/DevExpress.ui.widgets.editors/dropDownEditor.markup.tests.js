var $ = require("jquery");

require("common.css!");
require("ui/drop_down_editor/ui.drop_down_editor");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownEditorLazy"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DROP_DOWN_EDITOR_CLASS = "dx-dropdowneditor",
    DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS = "dx-dropdowneditor-input-wrapper",
    DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button",
    DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible";

var beforeEach = function() {
    this.rootElement = $("<div id='dropDownEditor'></div>");
    this.rootElement.appendTo($("#qunit-fixture"));
    this.$dropDownEditor = $("#dropDownEditor").dxDropDownEditor();
    this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor("instance");
};

var afterEach = function() {
    this.rootElement.remove();
    this.dropDownEditor = null;
};

var testEnvironment = {
    beforeEach: beforeEach,
    afterEach: afterEach
};

QUnit.module("DropDownEditor markup", testEnvironment);

QUnit.test("root element must be decorated with DROP_DOWN_EDITOR_CLASS", function(assert) {
    assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_CLASS));
});

QUnit.test("dxDropDownEditor must have a button", function(assert) {
    assert.ok(this.dropDownEditor._$dropDownButton);
});

QUnit.test("button must be decorated with DROP_DOWN_EDITOR_BUTTON_CLASS", function(assert) {
    assert.strictEqual(this.rootElement.find("." + DROP_DOWN_EDITOR_BUTTON_CLASS)[0], this.dropDownEditor._$dropDownButton[0]);
    assert.ok(this.dropDownEditor._$dropDownButton.hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS));
});

QUnit.test("input wrapper must be upper than button", function(assert) {
    var $inputWrapper = this.rootElement.children();

    assert.strictEqual(this.rootElement.find("." + DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS)[0], $inputWrapper[0]);
    assert.strictEqual(this.rootElement.find("." + DROP_DOWN_EDITOR_BUTTON_CLASS)[0], $inputWrapper.find("." + DROP_DOWN_EDITOR_BUTTON_CLASS)[0]);
});

QUnit.test("input must be wrapped for proper event handling", function(assert) {
    assert.ok(this.dropDownEditor._input().parents().find(".dx-dropdowneditor-input-wrapper").hasClass(DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS));
});

QUnit.test("DROP_DOWN_EDITOR_BUTTON_VISIBLE class should depend on drop down button visibility", function(assert) {
    assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class present by default");

    this.dropDownEditor.option("showDropDownButton", false);
    assert.notOk(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class removes when the button hides");

    this.dropDownEditor.option("showDropDownButton", true);
    assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class appears when the button shows");
});

QUnit.test("correct buttons order after rendering", function(assert) {
    var $dropDownEditor = this.rootElement.dxDropDownEditor({
            showClearButton: true
        }),
        $buttonsContainer = $dropDownEditor.find(".dx-texteditor-buttons-container"),
        $buttons = $buttonsContainer.children();

    assert.equal($buttons.length, 2, "clear button and drop button were rendered");
    assert.ok($buttons.eq(0).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), "drop button is the first one");
    assert.ok($buttons.eq(1).hasClass("dx-clear-button-area"), "drop button is the first one");
});

QUnit.test("fieldTemplate as render", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        fieldTemplate: function(value) {
            var $textBox = $("<div>").dxTextBox();
            return $("<div>").text(value + this.option("value")).append($textBox);
        },
        value: "test"
    });

    assert.equal($.trim($dropDownEditor.text()), "testtest", "field rendered");
});

QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor(),
        $input = $dropDownEditor.find("input");

    assert.strictEqual($input.attr("role"), "combobox", "aria role on input is correct");
    assert.strictEqual($dropDownEditor.attr("role"), undefined, "aria role on element is not exist");
});


QUnit.test("aria-autocomplete property on input", function(assert) {
    var $input = $("#dropDownEditorLazy").dxDropDownEditor().find("input");
    assert.equal($input.attr("aria-autocomplete"), "list", "haspopup attribute exists");
});

