
SystemJS.config({
    map: {
        'quill': '/testing/helpers/quillDependencies/noQuill.js',
        'quill-delta-to-html': '/testing/helpers/quillDependencies/noQuillDeltaToHtml.js',
    }
});

define(function(require) {
    var getQuill = require("ui/rich_text_editor/quill_importer").getQuill,
        DeltaConverter = require("ui/rich_text_editor/converters/delta").default;

    QUnit.module("Import 3rd party", function() {
        QUnit.test("it throw an error if the quill script isn't referenced", function(assert) {
            assert.throws(
                function() { getQuill(); },
                function(e) {
                    return /(E1041)[\s\S]*(Quill)/.test(e.message);
                },
                "The Quill script isn't referenced"
            );
        });

        QUnit.test("it throw an error if the delta to html converter script isn't referenced", function(assert) {
            assert.throws(
                function() { new DeltaConverter(); },
                function(e) {
                    return /(E1041)[\s\S]*(QuillDeltaToHtmlConverter)/.test(e.message);
                },
                "The Quill delta converter script isn't referenced"
            );
        });
    });
});
