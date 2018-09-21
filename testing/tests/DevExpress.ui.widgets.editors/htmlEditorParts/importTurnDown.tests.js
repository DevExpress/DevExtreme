
SystemJS.config({
    map: {
        'turndown': ''
    }
});

define(function(require) {
    var MarkdownConverter = require("ui/html_editor/converters/markdown").default;

    QUnit.module("Import 3rd party", function() {
        QUnit.test("it throw an error if the html -> markdown converter script isn't referenced", function(assert) {
            assert.throws(
                function() { new MarkdownConverter(); },
                function(e) {
                    return /E1052/.test(e.message);
                },
                "The Turndown script isn't referenced"
            );
        });
    });
});
