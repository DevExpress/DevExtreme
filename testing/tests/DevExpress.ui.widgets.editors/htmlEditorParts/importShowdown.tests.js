
SystemJS.config({
    map: {
        'showdown': ''
    }
});

define(function(require) {
    var MarkdownConverter = require("ui/html_editor/converters/markdown").default;

    QUnit.module("Import 3rd party", function() {
        QUnit.test("it throw an error if the markdown -> html converter script isn't referenced", function(assert) {
            debugger;
            assert.throws(
                function() { new MarkdownConverter(); },
                function(e) {
                    return /E1053/.test(e.message);
                },
                "The showdown script isn't referenced"
             );
        });
    });
});
