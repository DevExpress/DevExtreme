
SystemJS.config({
    map: {
        'quill': '',
        'quill-delta-to-html': ''
    }
});

define(function(require) {
    var getQuill = require("ui/html_editor/quill_importer").getQuill,
        DeltaConverter = require("ui/html_editor/converters/delta").default;

    QUnit.module("Import 3rd party", function() {
        QUnit.test("it throw an error if the quill script isn't referenced", function(assert) {
            assert.throws(
                function() { getQuill(); },
                function(e) {
                    return /E1050/.test(e.message);
                },
                "The Quill script isn't referenced"
            );
        });

        QUnit.test("it throw an error if the delta to html converter script isn't referenced", function(assert) {
            assert.throws(
                function() { new DeltaConverter(); },
                function(e) {
                    return /E1051/.test(e.message);
                },
                "The Quill script isn't referenced"
            );
        });
    });
});
