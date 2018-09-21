import $ from "jquery";

import "ui/rich_text_editor";
import "ui/rich_text_editor/converters/markdown";

const CONTENT_CLASS = "dx-richtexteditor-content";

function getSelector(className) {
    return "." + className;
}

const { test } = QUnit;

QUnit.module("Value as HTML markup", () => {
    test("show placeholder is value undefined", (assert) => {
        const instance = $("#richTextEditor").dxRichTextEditor({
                placeholder: "test placeholder"
            }).dxRichTextEditor("instance"),
            $element = instance.$element(),
            $content = $element.find(getSelector(CONTENT_CLASS));

        assert.equal($content.get(0).dataset.placeholder, "test placeholder");
    });

    test("render default value", (assert) => {
        const instance = $("#richTextEditor").dxRichTextEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxRichTextEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "<h1>Hi!</h1><p>Test</p>");
        assert.equal(markup, "<h1>Hi!</h1><p>Test</p>");
    });

    test("change value by user", (assert) => {
        const done = assert.async();
        const instance = $("#richTextEditor")
            .dxRichTextEditor({
                onValueChanged: (e) => {
                    assert.equal(e.value, "<p>Hi! <strong>Test.</strong></p>");
                    done();
                }
            })
            .dxRichTextEditor("instance");

        instance
            .$element()
            .find(getSelector(CONTENT_CLASS))
            .html("<p>Hi! <strong>Test.</strong></p>");
    });

    test("value after change valueType", (assert) => {
        const done = assert.async();
        const instance = $("#richTextEditor")
            .dxRichTextEditor({
                valueType: "Markdown",
                value: "Hi! **Test.**",
                onValueChanged: (e) => {
                    if(e.component.option("valueType") === "HTML") {
                        assert.equal(e.value, "<p>Hi! <strong>Test.</strong></p>");
                        done();
                    }
                }
            })
            .dxRichTextEditor("instance");

        instance.option("valueType", "HTML");
    });
});


QUnit.module("Value as Markdown markup", () => {
    test("render default value", (assert) => {
        const instance = $("#richTextEditor").dxRichTextEditor({
                value: "Hi!\nIt's a **test**!",
                valueType: "Markdown"
            }).dxRichTextEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "Hi!\nIt's a **test**!");
        assert.equal(markup, "<p>Hi!</p><p>It's a <strong>test</strong>!</p>");
    });

    test("change value by user", (assert) => {
        const done = assert.async();
        const instance = $("#richTextEditor")
            .dxRichTextEditor({
                valueType: "Markdown",
                onValueChanged: (e) => {
                    assert.equal(e.value, "Hi! **Test.**");
                    done();
                }
            })
            .dxRichTextEditor("instance");

        instance
            .$element()
            .find(getSelector(CONTENT_CLASS))
            .html("<p>Hi! <strong>Test.</strong></p>");
    });

    test("value after change valueType", (assert) => {
        const done = assert.async();
        const instance = $("#richTextEditor")
            .dxRichTextEditor({
                value: "<p>Hi! <strong>Test.</strong></p>",
                onValueChanged: (e) => {
                    if(e.component.option("valueType") === "Markdown") {
                        assert.equal(e.value, "Hi! **Test.**");
                        done();
                    }
                }
            })
            .dxRichTextEditor("instance");

        instance.option("valueType", "Markdown");
    });
});
