import $ from "jquery";

import "ui/html_editor";
import "ui/html_editor/converters/markdown";

const CONTENT_CLASS = "dx-htmleditor-content";

function getSelector(className) {
    return `.${className}`;
}

const { test } = QUnit;

QUnit.module("Value as HTML markup", () => {
    test("show placeholder is value undefined", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                placeholder: "test placeholder"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            $content = $element.find(getSelector(CONTENT_CLASS));

        assert.equal($content.get(0).dataset.placeholder, "test placeholder");
    });

    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "<h1>Hi!</h1><p>Test</p>"
            }).dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "<h1>Hi!</h1><p>Test</p>");
        assert.equal(markup, "<h1>Hi!</h1><p>Test</p>");
    });

    test("render transclude content", (assert) => {
        const instance = $("#htmlEditor")
            .html("<h1>Hi!</h1><p>Test</p>")
            .dxHtmlEditor()
            .dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "<h1>Hi!</h1><p>Test</p>");
        assert.equal(markup, "<h1>Hi!</h1><p>Test</p>");
    });

    test("render transclude content and predefined value", (assert) => {
        const instance = $("#htmlEditor")
            .html("<h1>Hi!</h1><p>Test</p>")
            .dxHtmlEditor({
                value: "<p>Test1</p><p>Test2</p>"
            })
            .dxHtmlEditor("instance"),
            $element = instance.$element(),
            markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(instance.option("value"), "<p>Test1</p><p>Test2</p>");
        assert.equal(markup, "<p>Test1</p><p>Test2</p>");
    });

    test("change value by user", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                onValueChanged: (e) => {
                    assert.equal(e.value, "<p>Hi! <strong>Test.</strong></p><p>New line</p>");
                    done();
                }
            })
            .dxHtmlEditor("instance");

        instance
            .$element()
            .find(getSelector(CONTENT_CLASS))
            .html("<p>Hi! <strong>Test.</strong></p><p>New line</p>");
    });

    test("value after change valueType", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                valueType: "markdown",
                value: "Hi! **Test. 123**\nNew line",
                onValueChanged: (e) => {
                    if(e.component.option("valueType") === "html") {
                        assert.equal(e.value, "<p>Hi! <strong>Test. 123</strong></p><p>New line</p>", "value is OK");
                        done();
                    }
                }
            })
            .dxHtmlEditor("instance");

        instance.option("valueType", "html");
    });

    test("render markup with a font-size style", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: '<span style="font-size: 20px">Test</span>'
        }).dxHtmlEditor("instance");
        const $element = instance.$element();
        const markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(markup, '<p><span style="font-size: 20px;">Test</span></p>');
    });

    test("render markup with a font-family style", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: '<span style="font-family: Terminal;">Test</span>'
        }).dxHtmlEditor("instance");
        const $element = instance.$element();
        const markup = $element.find(getSelector(CONTENT_CLASS)).html();

        assert.equal(markup, '<p><span style="font-family: Terminal;">Test</span></p>');
    });
});


QUnit.module("Value as Markdown markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
                value: "Hi!\nIt's a **test**!",
                valueType: "markdown"
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
                valueType: "markdown",
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

    test("value after change valueType", (assert) => {
        const done = assert.async();
        const instance = $("#htmlEditor")
            .dxHtmlEditor({
                value: "<p>Hi! <strong>Test.</strong></p>",
                onValueChanged: (e) => {
                    if(e.component.option("valueType") === "markdown") {
                        assert.equal(e.value, "Hi! **Test.**");
                        done();
                    }
                }
            })
            .dxHtmlEditor("instance");

        instance.option("valueType", "markdown");
    });
});

QUnit.module("Custom blots rendering", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    test("render image", (assert) => {
        const expected = '<img src="http://test.com/test.jpg" alt="altering" width="100px" height="100px">';
        const instance = $("#htmlEditor")
        .dxHtmlEditor({
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "markup contains an image");
            }
        })
        .dxHtmlEditor("instance");

        instance.insertEmbed(0, "extendedImage", { src: "http://test.com/test.jpg", width: 100, height: 100, alt: "altering" });
        this.clock.tick();
    });

    test("render link", (assert) => {
        const instance = $("#htmlEditor")
        .dxHtmlEditor({
            value: "test",
            onValueChanged: (e) => {
                assert.equal(e.value, '<a href="http://test.com" target="_blank">test</a>test', "markup contains an image");
            }
        })
        .dxHtmlEditor("instance");

        instance.setSelection(0, 0);
        instance.insertText(0, "test", "link", { href: "http://test.com", target: true });
    });

    test("render variable", (assert) => {
        const expected = '<span class="dx-variable" data-var-start-esc-char="#" data-var-end-esc-char="#" data-var-value="Test"><span contenteditable="false">#Test#</span></span>';
        const instance = $("#htmlEditor")
        .dxHtmlEditor({
            onValueChanged: (e) => {
                assert.equal(e.value.replace(/\uFEFF/g, ""), expected, "markup contains a variable");
            }
        })
        .dxHtmlEditor("instance");

        instance.insertEmbed(0, "variable", { escapeChar: "#", value: "Test" });
    });
});
