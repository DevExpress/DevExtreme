import QuillImporter from "ui/html_editor/quill_importer";
const { test } = QUnit;

QUnit.module("Quill importer", () => {
    test("it throw an error if the quill script isn't referenced", (assert) => {
        const quill = QuillImporter._quill;

        QuillImporter._quill = null;

        assert.throws(
            function() { QuillImporter.getQuill(); },
            function(e) {
                return /E1050/.test(e.message);
            },
            "The Quill script isn't referenced"
        );

        QuillImporter._quill = quill;
    });
});

