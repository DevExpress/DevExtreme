import $ from "jquery";

import "ui/html_editor";

const { test } = QUnit;

QUnit.module("Value as HTML markup", () => {
    test("render default value", (assert) => {
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p><h1>Hi!></p><p>Test</p>"
        }).dxHtmlEditor("instance");

        assert.equal(instance.option("value"), "<p><h1>Hi!></p><p>Test</p>");
    });

    QUnit.skip("change value by user", (assert) => {
        const instance = $("#htmlEditor")
        .dxHtmlEditor()
        .dxHtmlEditor("instance");
        $(instance.element()).find(".dx-htmlEditor-content").text("Hi!\nTest.").trigger("change");
        assert.equal(instance.option("value"), "<p>Hi!<br/>Test.</p>");
    });
});
