import DeltaConverter from "ui/html_editor/converters/delta";
import MarkdownConverter from "ui/html_editor/converters/markdown";
import { getQuill } from "ui/html_editor/quill_importer";

const { test } = QUnit;

QUnit.module("Delta converter", () => {
    test("it convert an editor content to semantic HTML markup", (assert) => {
        const deltaConverter = new DeltaConverter();
        const deltaOps = [{
            insert: 'test',
            attributes: {
                bold: true
            }
        }];
        const Quill = getQuill();
        const quillInstance = new Quill(document.getElementById("htmlEditor"), {});

        deltaConverter.setQuillInstance(quillInstance);
        quillInstance.setContents(deltaOps);

        assert.equal(deltaConverter.toHtml(), "<strong>test</strong>", "It converts delta operations");
    });
});

QUnit.module("Markdown converter", () => {
    test("it convert a HTML to the Markdown", (assert) => {
        const markdownConverter = new MarkdownConverter();
        const html = "<p>Te<strong>st</strong></p>";

        assert.equal(markdownConverter.toMarkdown(html), "Te**st**", "It converts a HTML to Markdown");
    });

    test("it convert a Markdown to the HTML", (assert) => {
        const markdownConverter = new MarkdownConverter();
        const markdown = "Te**st**";

        assert.equal(markdownConverter.toHtml(markdown), "<p>Te<strong>st</strong></p>", "It converts a Markdown to HTML");
    });
});
