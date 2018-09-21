import QuillRegistrator from "ui/rich_text_editor/quill_registrator";
import Image from "ui/rich_text_editor/formats/image";

const { test } = QUnit;

QUnit.module("Quill registrator", () => {
    test("check defaults", (assert) => {
        const quillRegistrator = new QuillRegistrator();
        const quill = quillRegistrator.getQuill();

        const alignFormat = quill.import("formats/align");
        const directionFormat = quill.import("formats/direction");
        const fontFormat = quill.import("formats/font");
        const sizeFormat = quill.import("formats/size");

        const AlignStyle = quill.import("attributors/style/align");
        const DirectionStyle = quill.import("attributors/style/direction");
        const FontStyle = quill.import("attributors/style/font");
        const SizeStyle = quill.import("attributors/style/size");

        const imageFormat = quill.import("formats/image");

        const baseTheme = quill.import("themes/basic");

        assert.deepEqual(alignFormat, AlignStyle, "Style attributor");
        assert.deepEqual(directionFormat, DirectionStyle, "Style attributor");
        assert.deepEqual(fontFormat, FontStyle, "Style attributor");
        assert.deepEqual(sizeFormat, SizeStyle, "Style attributor");

        assert.deepEqual(imageFormat, Image, "Custom format");

        assert.ok(baseTheme, "custom base theme");
    });

    test("change format", (assert) => {
        const quillRegistrator = new QuillRegistrator();
        const quill = quillRegistrator.getQuill();

        const alignClassFormat = quill.import("attributors/class/align");

        quillRegistrator.registerModules({
            "formats/align": alignClassFormat
        });

        const alignFormat = quill.import("formats/align");

        assert.deepEqual(alignFormat, alignClassFormat, "Class attributor");
    });

    test("create a quill editor instance", (assert) => {
        const element = document.getElementById("richTextEditor");
        const quillRegistrator = new QuillRegistrator();

        quillRegistrator.createEditor(element);

        assert.equal(element.className, "ql-container");
    });
});

