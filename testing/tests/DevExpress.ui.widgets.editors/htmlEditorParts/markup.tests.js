import $ from "jquery";

import "ui/html_editor";

const HTML_EDITOR_CLASS = "dx-htmleditor";

const { test } = QUnit;

QUnit.module("Base markup", () => {
    test("render markup", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element();

        assert.ok($element.hasClass(HTML_EDITOR_CLASS), "Widget has a specific class on the root level");
        assert.equal($element.text(), "Hi!Test");
    });

    test("change value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element();

        instance.option("value", "<p>New value</p>");
        assert.equal($element.text(), "New value");
    });
});
