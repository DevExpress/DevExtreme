var $ = require("jquery");

require("ui/text_box/ui.text_editor");

var TEXTEDITOR_CLASS = "dx-texteditor",
    INPUT_CLASS = "dx-texteditor-input",
    CONTAINER_CLASS = "dx-texteditor-container",
    PLACEHOLDER_CLASS = "dx-placeholder",
    STATE_INVISIBLE_CLASS = "dx-state-invisible";

QUnit.module("Basic markup");

QUnit.test("basic init", function(assert) {
    var element = $("#texteditor").dxTextEditor();

    assert.ok(element.hasClass(TEXTEDITOR_CLASS));
    assert.equal(element.children().length, 1);
    assert.equal(element.find("." + PLACEHOLDER_CLASS).length, 1);
    assert.equal(element.find("." + INPUT_CLASS).length, 1);
    assert.equal(element.find("." + CONTAINER_CLASS).length, 1);
});

QUnit.test("init with placeholder", function(assert) {
    var element = $("#textbox").dxTextEditor({
        placeholder: "enter value"
    });

    var placeholder = element.find("." + PLACEHOLDER_CLASS);

    assert.notOk(placeholder.hasClass(STATE_INVISIBLE_CLASS), "placeholder is visible when editor hasn't a value");
});

QUnit.test("init with options", function(assert) {
    var element = $("#texteditor").dxTextEditor({
        value: "custom",
        placeholder: "enter value",
        readOnly: true,
        tabIndex: 3
    });

    var input = element.find("." + INPUT_CLASS),
        placeholder = element.find("." + PLACEHOLDER_CLASS);

    assert.equal(input.val(), "custom");
    assert.equal(input.prop("placeholder") || element.find("." + PLACEHOLDER_CLASS).attr("data-dx_placeholder"), "enter value");
    assert.ok(placeholder.hasClass(STATE_INVISIBLE_CLASS), "placeholder is invisible when editor has a value");
    assert.equal(input.prop("readOnly"), true);
    assert.equal(input.prop("tabindex"), 3);
});

QUnit.test("init with focusStateEnabled = false", function(assert) {
    var element = $("#texteditor").dxTextEditor({
        focusStateEnabled: false,
        tabIndex: 3
    });

    var input = element.find("." + INPUT_CLASS);

    assert.equal(input.prop("tabindex"), -1);
});

QUnit.test("value === 0 should be rendered on init", function(assert) {
    var $element = $("#texteditor").dxTextEditor({
        value: 0
    });

    var input = $element.find("." + INPUT_CLASS);
    assert.equal(input.val(), "0", "value rendered correctly");
});


QUnit.test("T220209 - the 'valueFormat' option", function(assert) {
    var $textEditor = $("#texteditor").dxTextEditor({
        value: "First",
        valueFormat: function(value) {
            return value + " format";
        }
    });

    assert.equal($textEditor.dxTextEditor("option", "value"), "First", "value is correct");
    assert.equal($textEditor.find(".dx-texteditor-input").val(), "First format", "input value is correct");
});


QUnit.module("the 'name' option");

QUnit.test("widget input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#texteditor").dxTextEditor({
            name: expectedName
        }),
        $input = $element.find("." + INPUT_CLASS);

    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
});
