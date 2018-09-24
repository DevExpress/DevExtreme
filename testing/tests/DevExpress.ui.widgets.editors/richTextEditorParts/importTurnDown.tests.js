
SystemJS.config({
    map: {
        'turndown': '/testing/helpers/quillDependencies/noTurndown.js'
    }
});

define(function(require) {
    var MarkdownConverter = require("ui/rich_text_editor/converters/markdown").default;

    QUnit.module("Import 3rd party", function() {
        QUnit.test("it throw an error if the html -> markdown converter script isn't referenced", function(assert) {
            assert.throws(
                function() { new MarkdownConverter(); },
                function(e) {
                    return /(E1041)[\s\S]*(Turndown)/.test(e.message);
                },
                "The Turndown script isn't referenced"
            );
        });
    });
});
