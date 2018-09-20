import DeltaConverter from "ui/html_editor/converters/delta";
import MarkdownConverter from "ui/html_editor/converters/markdown";

const { test } = QUnit;

QUnit.module("Delta converter", () => {
    test("it throw an error if the converter script isn't referenced", (assert) => {
        const delta2html = DeltaConverter._deltaToHtmlConverter;

        DeltaConverter._deltaToHtmlConverter = null;

        assert.throws(
            function() { new DeltaConverter(); },
            function(e) {
                return /E1051/.test(e.message);
            },
            "The Quill script isn't referenced"
        );

        DeltaConverter._deltaToHtmlConverter = delta2html;
    });

    test("it convert an delta operations to HTML markup", (assert) => {
        const deltaConverter = new DeltaConverter();
        const deltaOps = [{
            insert: 'test',
            attributes: {
                bold: true
            }
        }];

        assert.equal(deltaConverter.toHtml(deltaOps), "<p><strong>test</strong></p>", "It converts delta operations");
    });
});

QUnit.module("Markdown converter", () => {
    test("it throw an error if the html -> markdown converter script isn't referenced", (assert) => {
        const html2markdown = MarkdownConverter._TurnDown;

        MarkdownConverter._TurnDown = null;

        assert.throws(
            function() { new MarkdownConverter(); },
            function(e) {
                return /E1052/.test(e.message);
            },
            "The Turndown script isn't referenced"
        );

        MarkdownConverter._TurnDown = html2markdown;
    });

    test("it throw an error if the markdown -> html converter script isn't referenced", (assert) => {
        const markdown2html = MarkdownConverter._ShowDown;

        MarkdownConverter._ShowDown = null;

        assert.throws(
            function() { new MarkdownConverter(); },
            function(e) {
                return /E1053/.test(e.message);
            },
            "The Turndown script isn't referenced"
        );

        MarkdownConverter._ShowDown = markdown2html;
    });

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
