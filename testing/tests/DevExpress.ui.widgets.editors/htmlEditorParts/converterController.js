import "ui/html_editor";
import ConverterController from "ui/html_editor/converterController";

const { test } = QUnit;

QUnit.module("Converter controller", () => {
    test("Check registered converters", (assert) => {
        const deltaConverter = ConverterController.getConverter("delta");
        const markdownConverter = ConverterController.getConverter("markdown");

        assert.ok(deltaConverter, "Delta converter exists");
        assert.notOk(markdownConverter, "Markdown converter isn't exists by default");
    });

    test("Add new converter", (assert) => {
        ConverterController.addConverter("custom", () => {});
        const customConverter = ConverterController.getConverter("custom");

        assert.ok(customConverter, "Custom converter exists");
    });
});
