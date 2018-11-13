import $ from "jquery";

import "ui/html_editor";
import "ui/html_editor/converters/markdown";

const HTML_EDITOR_CLASS = "dx-htmleditor";
const QUILL_CONTAINER_CLASS = "dx-quill-container";
const HTML_EDITOR_CONTENT_CLASS = "dx-htmleditor-content";

const { test } = QUnit;

QUnit.module("Base markup", () => {
    test("render markup", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element();

        assert.ok($element.hasClass(HTML_EDITOR_CLASS), "Widget has a specific class on the root level");
        assert.ok($element.children().hasClass(QUILL_CONTAINER_CLASS), "Widget has a child marked as quill container");
        assert.equal($element.find(`.${QUILL_CONTAINER_CLASS}`).text(), "Hi!Test");

        const isQuillRendered = !!$element.find(`.${HTML_EDITOR_CONTENT_CLASS}`).length;
        assert.equal(!!instance._deltaConverter, isQuillRendered, "Delta converter isn't initialized at SSR");
        assert.equal(!!instance._quillRegistrator, isQuillRendered, "Quill registrator isn't initialized at SSR");
    });

    test("render markdown markup", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "*Test* **text**",
                valueType: "markdown"
            }).dxHtmlEditor("instance"),
            $element = instance.$element();

        const $htmlEditorContent = $element.find(`.${HTML_EDITOR_CONTENT_CLASS}`);
        const isQuillRendered = !!$htmlEditorContent.length;
        const $content = isQuillRendered ? $htmlEditorContent : $element.find(`.${QUILL_CONTAINER_CLASS}`);

        assert.ok($element.hasClass(HTML_EDITOR_CLASS), "Widget has a specific class on the root level");
        assert.ok($element.children().hasClass(QUILL_CONTAINER_CLASS), "Widget has a child marked as quill container");
        assert.equal($content.html(), "<p><em>Test</em> <strong>text</strong></p>");

        assert.equal(!!instance._deltaConverter, isQuillRendered, "Delta converter isn't initialized at SSR");
        assert.equal(!!instance._quillRegistrator, isQuillRendered, "Quill registrator isn't initialized at SSR");
    });

    test("change value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element();

        instance.option("value", "<p>New value</p>");
        assert.equal($element.find(`.${QUILL_CONTAINER_CLASS}`).text(), "New value");

        const isQuillRendered = !!$element.find(`.${HTML_EDITOR_CONTENT_CLASS}`).length;
        assert.equal(!!instance._deltaConverter, isQuillRendered, "Delta converter isn't initialized at SSR");
        assert.equal(!!instance._quillRegistrator, isQuillRendered, "Quill registrator isn't initialized at SSR");
    });
});
