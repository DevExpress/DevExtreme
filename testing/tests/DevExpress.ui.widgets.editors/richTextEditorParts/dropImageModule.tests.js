import $ from "jquery";

import DropImage from "ui/rich_text_editor/modules/dropImage";
import { createBlobFile } from "../../../helpers/fileHelper.js";

const IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==";

class DropImageMock extends DropImage {
    _getImage(files, callback) {
        callback(IMAGE);
    }
}

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#richTextEditor");

        this.insertEmbedStub = sinon.stub();

        this.quillMock = {
            root: this.$element,
            getSelection: () => {
                return { index: 1, length: 1 };
            },
            insertEmbed: this.insertEmbedStub
        };

        this.file = createBlobFile("test", 80);

        this.options = {
            editorInstance: {
                NAME: "dxRichTextEditor"
            }
        };
    }
};

const { test } = QUnit;

QUnit.module("DropImage module", moduleConfig, () => {
    test("insert image on drop", (assert) => {
        new DropImageMock(this.quillMock, this.options);

        const event = $.Event($.Event("drop", { dataTransfer: { files: [this.file] } }));
        this.$element.trigger(event);

        assert.equal(this.insertEmbedStub.callCount, 1, "File inserted");
        assert.deepEqual(this.insertEmbedStub.lastCall.args, [1, "image", IMAGE, "user"], "insert base64 image by user");
    });

    test("check file type", (assert) => {
        const dropImage = new DropImage(this.quillMock, this.options);

        const textFile = createBlobFile("test", 80, "text/html");
        const unsupportedImage = createBlobFile("test", 80, "image/psd");

        assert.ok(dropImage._isImage(this.file), "PNG");
        assert.notOk(dropImage._isImage(textFile), "Text");
        assert.notOk(dropImage._isImage(unsupportedImage), "PSD is unsupported");
    });

    test("insert image on paste", (assert) => {
        new DropImageMock(this.quillMock, this.options);

        const event = $.Event($.Event("paste", { clipboardData: { items: [this.file] } }));
        this.$element.trigger(event);

        assert.equal(this.insertEmbedStub.callCount, 1, "File inserted");
        assert.deepEqual(this.insertEmbedStub.lastCall.args, [1, "image", IMAGE, "user"], "insert base64 image by user");
    });
});
