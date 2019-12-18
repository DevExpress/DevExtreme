SystemJS.config({
    map: {
        'showdown': '/testing/helpers/quillDependencies/noShowdown.js'
    }
});

define(function(require) {
    var MarkdownConverter = require('ui/html_editor/converters/markdown').default;

    QUnit.module('Import 3rd party', function() {
        QUnit.test('it throw an error if the markdown -> html converter script isn\'t referenced', function(assert) {
            assert.throws(
                function() { new MarkdownConverter(); },
                function(e) {
                    return /(E1041)[\s\S]*(Showdown)/.test(e.message);
                },
                'The showdown script isn\'t referenced'
            );
        });

        QUnit.test('initialize showdown from window', function(assert) {
            var prevWinShowdown = window.showdown;

            window.showdown = {
                Converter: function() {
                    this.initialized = true;
                }
            };

            var converter = new MarkdownConverter();

            assert.ok(converter._markdown2Html.initialized);

            window.showdown = prevWinShowdown;
        });
    });
});
