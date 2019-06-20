import $ from "jquery";
import { Deferred } from "core/utils/deferred";

import "ui/drop_down_editor/ui.drop_down_editor";
import "common.css!";

const { module, test, testStart } = QUnit;

testStart(function() {
    const markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownEditorLazy"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const DROP_DOWN_EDITOR_CLASS = "dx-dropdowneditor";
const DROP_DOWN_EDITOR_INPUT_WRAPPER = "dx-dropdowneditor-input-wrapper";
const DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button";
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible";
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = "dx-dropdowneditor-field-template-wrapper";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

module("DropDownEditor markup", {
    beforeEach: () => {
        this.rootElement = $("<div id='dropDownEditor'></div>");
        this.rootElement.appendTo($("#qunit-fixture"));
        this.$dropDownEditor = $("#dropDownEditor").dxDropDownEditor();
        this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor("instance");
    },
    afterEach: () => {
        this.rootElement.remove();
        this.dropDownEditor = null;
    }
}, () => {
    test("root element must be decorated with DROP_DOWN_EDITOR_CLASS", (assert) => {
        assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_CLASS));
    });

    test("dxDropDownEditor must have a button which must be decorated with DROP_DOWN_EDITOR_BUTTON_CLASS", (assert) => {
        const $dropDownButton = this.rootElement.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
        assert.strictEqual($dropDownButton.length, 1);
        assert.ok($dropDownButton.hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS));
    });

    test("input wrapper must be upper than button", (assert) => {
        const $inputWrapper = this.rootElement.children();

        assert.strictEqual(this.rootElement.find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`)[0], $inputWrapper[0]);
        assert.strictEqual(this.rootElement.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`)[0], $inputWrapper.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`)[0]);
    });

    test("input must be wrapped for proper event handling", (assert) => {
        assert.ok(this.dropDownEditor._input().parents().find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`).hasClass(DROP_DOWN_EDITOR_INPUT_WRAPPER));
    });

    test("DROP_DOWN_EDITOR_BUTTON_VISIBLE class should depend on drop down button visibility", (assert) => {
        assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class present by default");

        this.dropDownEditor.option("showDropDownButton", false);
        assert.notOk(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class removes when the button hides");

        this.dropDownEditor.option("showDropDownButton", true);
        assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE), "class appears when the button shows");
    });

    test("correct buttons order after rendering", (assert) => {
        const $dropDownEditor = this.rootElement.dxDropDownEditor({
                showClearButton: true
            }),
            $buttonsContainer = $dropDownEditor.find(".dx-texteditor-buttons-container"),
            $buttons = $buttonsContainer.children();

        assert.equal($buttons.length, 2, "clear button and drop button were rendered");
        assert.ok($buttons.eq(0).hasClass("dx-clear-button-area"), "clear button is the first one");
        assert.ok($buttons.eq(1).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), "drop button is the second one");
    });

    test("fieldTemplate as render", (assert) => {
        const $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            fieldTemplate: function(value) {
                const $textBox = $("<div>").dxTextBox();
                return $("<div>").text(value + this.option("value")).append($textBox);
            },
            value: "test"
        });

        assert.strictEqual($dropDownEditor.find(`.${DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER}`).length, 1);
        assert.equal($.trim($dropDownEditor.text()), "testtest", "field rendered");
    });

    test("field should be rendered after input value rendering", (assert) => {
        const dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            value: "test"
        }).dxDropDownEditor("instance");

        const deferred = new Deferred();
        const renderFieldSpy = sinon.spy(dropDownEditor, "_renderField");
        sinon.stub(dropDownEditor, "_renderInputValue").returns(deferred.promise());
        dropDownEditor.repaint();

        assert.ok(renderFieldSpy.notCalled, "field rendering is waiting for an input value rendering");
        deferred.resolve();
        assert.ok(renderFieldSpy.calledOnce, "field has been rendered");
    });
});


module("aria accessibility", () => {
    test("aria role", (assert) => {
        const $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor(),
            $input = $dropDownEditor.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.attr("role"), "combobox", "aria role on input is correct");
        assert.strictEqual($dropDownEditor.attr("role"), undefined, "aria role on element is not exist");
    });

    test("aria-autocomplete property on input", (assert) => {
        const $input = $("#dropDownEditorLazy").dxDropDownEditor().find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.equal($input.attr("aria-autocomplete"), "list", "haspopup attribute exists");
    });
});

