import $ from "jquery";

import "ui/text_box/ui.text_editor";
import { Deferred } from "core/utils/deferred";

const TEXTEDITOR_CLASS = "dx-texteditor";
const INPUT_CLASS = "dx-texteditor-input";
const CONTAINER_CLASS = "dx-texteditor-container";
const PLACEHOLDER_CLASS = "dx-placeholder";
const STATE_INVISIBLE_CLASS = "dx-state-invisible";

const { test, module } = QUnit;

module("Basic markup", () => {
    test("basic init", (assert) => {
        const element = $("#texteditor").dxTextEditor();

        assert.ok(element.hasClass(TEXTEDITOR_CLASS));
        assert.equal(element.children().length, 1);
        assert.equal(element.find(`.${PLACEHOLDER_CLASS}`).length, 1);
        assert.equal(element.find(`.${INPUT_CLASS}`).length, 1);
        assert.equal(element.find(`.${CONTAINER_CLASS}`).length, 1);
    });

    test("init with placeholder", (assert) => {
        const element = $("#textbox").dxTextEditor({
            placeholder: "enter value"
        });

        const placeholder = element.find(`.${PLACEHOLDER_CLASS}`);

        assert.notOk(placeholder.hasClass(STATE_INVISIBLE_CLASS), "placeholder is visible when editor hasn't a value");
    });

    test("init with options", (assert) => {
        const element = $("#texteditor").dxTextEditor({
            value: "custom",
            placeholder: "enter value",
            readOnly: true,
            tabIndex: 3
        });

        const input = element.find(`.${INPUT_CLASS}`),
            placeholder = element.find(`.${PLACEHOLDER_CLASS}`);

        assert.equal(input.val(), "custom");
        assert.equal(input.prop("placeholder") || element.find(`.${PLACEHOLDER_CLASS}`).attr("data-dx_placeholder"), "enter value");
        assert.ok(placeholder.hasClass(STATE_INVISIBLE_CLASS), "placeholder is invisible when editor has a value");
        assert.equal(input.prop("readOnly"), true);
        assert.equal(input.prop("tabindex"), 3);
    });

    test("init with focusStateEnabled = false", (assert) => {
        const element = $("#texteditor").dxTextEditor({
            focusStateEnabled: false,
            tabIndex: 3
        });

        const input = element.find("." + INPUT_CLASS);

        assert.equal(input.prop("tabindex"), -1);
    });

    test("value === 0 should be rendered on init", (assert) => {
        const $element = $("#texteditor").dxTextEditor({
            value: 0
        });

        const input = $element.find("." + INPUT_CLASS);
        assert.equal(input.val(), "0", "value rendered correctly");
    });


    test("T220209 - the 'valueFormat' option", (assert) => {
        const $textEditor = $("#texteditor").dxTextEditor({
            value: "First",
            valueFormat: function(value) {
                return value + " format";
            }
        });

        assert.equal($textEditor.dxTextEditor("option", "value"), "First", "value is correct");
        assert.equal($textEditor.find(`.${INPUT_CLASS}`).val(), "First format", "input value is correct");
    });

    test("input addons should be rendered after input's value", (assert) => {
        const deferred = new Deferred();
        const editor = $("#texteditor").dxTextEditor({
            value: "test"
        }).dxTextEditor("instance");
        const renderInputAddonsStub = sinon.spy(editor, "_renderInputAddons");

        sinon.stub(editor, "_renderInputValue").returns(deferred.promise());
        editor.repaint();

        assert.ok(renderInputAddonsStub.notCalled, "Addons rendering is waiting for a value rendering");
        deferred.resolve();
        assert.ok(renderInputAddonsStub.calledOnce, "Addons should be rendered after value rendering");
    });
});

module("the 'name' option", () => {
    test("widget input should get the 'name' attribute with a correct value", (assert) => {
        const expectedName = "some_name",
            $element = $("#texteditor").dxTextEditor({
                name: expectedName
            }),
            $input = $element.find(`.${INPUT_CLASS}`);

        assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
    });
});

