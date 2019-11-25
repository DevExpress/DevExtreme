import QuillRegistrator from "ui/html_editor/quill_registrator";
import Image from "ui/html_editor/formats/image";
import Font from "ui/html_editor/formats/font";
import Size from "ui/html_editor/formats/size";

const { test } = QUnit;

QUnit.module("Quill registrator", () => {
    test("check defaults", function(assert) {
        const quillRegistrator = new QuillRegistrator();
        const quill = quillRegistrator.getQuill();

        const alignFormat = quill.import("formats/align");
        const directionFormat = quill.import("formats/direction");
        const fontFormat = quill.import("formats/font");
        const sizeFormat = quill.import("formats/size");

        const AlignStyle = quill.import("attributors/style/align");
        const DirectionStyle = quill.import("attributors/style/direction");

        const imageFormat = quill.import("formats/extendedImage");

        const baseTheme = quill.import("themes/basic");

        assert.deepEqual(alignFormat, AlignStyle, "Style attributor");
        assert.deepEqual(directionFormat, DirectionStyle, "Style attributor");
        assert.deepEqual(fontFormat, Font, "Style attributor");
        assert.deepEqual(sizeFormat, Size, "Style attributor");

        assert.deepEqual(imageFormat, Image, "Custom format");

        assert.ok(baseTheme, "custom base theme");
    });

    test("change format", function(assert) {
        const quillRegistrator = new QuillRegistrator();
        const quill = quillRegistrator.getQuill();

        const alignClassFormat = quill.import("attributors/class/align");

        quillRegistrator.registerModules({
            "formats/align": alignClassFormat
        });

        const alignFormat = quill.import("formats/align");

        assert.deepEqual(alignFormat, alignClassFormat, "Class attributor");
    });

    test("create a quill editor instance", function(assert) {
        const element = document.getElementById("htmlEditor");
        const quillRegistrator = new QuillRegistrator();

        quillRegistrator.createEditor(element);

        assert.equal(element.className, "ql-container");
    });

    test("add a customModule", function(assert) {
        const quillRegistrator = new QuillRegistrator();

        quillRegistrator.registerModules({
            "modules/fakeModule": () => {},
            "modules/toolbar": () => {} // replace existing module
        });

        const customModuleNames = quillRegistrator.getRegisteredModuleNames();

        assert.deepEqual(customModuleNames, ["fakeModule"], "Should return only custom modules");
    });
});
