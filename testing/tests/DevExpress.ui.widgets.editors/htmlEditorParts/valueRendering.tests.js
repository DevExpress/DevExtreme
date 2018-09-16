import $ from "jquery";

import "ui/html_editor";

const { test } = QUnit;

QUnit.module("Value as HTML markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(".dx-htmleditor-content").html();

        assert.equal(instance.option("value"), "<h1>Hi!</h1><p>Test</p>");
        assert.equal(markup, "<h1>Hi!</h1><p>Test</p>");
    });

    QUnit.skip("change value by user", (assert) => {
        const instance = $("#htmlEditor")
        .dxHtmlEditor()
        .dxHtmlEditor("instance");
        $(instance.element()).find(".dx-htmleditor-content").text("Hi!\nTest.").trigger("change");
        assert.equal(instance.option("value"), "<p>Hi!<br/>Test.</p>");
    });
});

QUnit.module("Value as Markdown markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "Hi!\nIt's a **test**!",
                valueType: "Markdown"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(".dx-htmleditor-content").html();

        assert.equal(instance.option("value"), "Hi!\nIt's a **test**!");
        assert.equal(markup, "<p>Hi!</p><p>It's a <strong>test</strong>!</p>");
    });
});
