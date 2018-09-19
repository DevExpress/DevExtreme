import $ from "jquery";

import "ui/html_editor";

const CONTENT_CLASS = "dx-htmleditor-content";

function getSelector(className) {
    return "." + className;
}

const { test } = QUnit;

QUnit.module("Value as HTML markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "<h1>Hi!</h1><p>Test</p>");
        assert.equal(markup, "<h1>Hi!</h1><p>Test</p>");
    });

    test("change value by user", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: (e) => {
                    assert.equal(e.value, "<p>Hi! <strong>Test.</strong></p>");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        instance
            .$element()
            .find(getSelector(CONTENT_CLASS))
            .html("<p>Hi! <strong>Test.</strong></p>");
    });
});


QUnit.module("Value as Markdown markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "Hi!\nIt's a **test**!",
                valueType: "Markdown"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "Hi!\nIt's a **test**!");
        assert.equal(markup, "<p>Hi!</p><p>It's a <strong>test</strong>!</p>");
    });

    test("change value by user", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                valueType: "Markdown",
                onValueChanged: (e) => {
                    assert.equal(e.value, "Hi! **Test.**");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        instance
            .$element()
            .find(getSelector(CONTENT_CLASS))
            .html("<p>Hi! <strong>Test.</strong></p>");
    });
});
