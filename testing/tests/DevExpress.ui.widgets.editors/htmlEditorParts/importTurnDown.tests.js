SystemJS.config({
    map: {
        'turndown': '/testing/helpers/quillDependencies/noTurndown.js'
    }
});

define(function(require) {
    var MarkdownConverter = require('ui/html_editor/converters/markdown').default;

    QUnit.module('Import 3rd party', function() {
        QUnit.test('it throw an error if the html -> markdown converter script isn\'t referenced', function(assert) {
            assert.throws(
                function() { new MarkdownConverter(); },
                function(e) {
                    return /(E1041)[\s\S]*(Turndown)/.test(e.message);
                },
                'The Turndown script isn\'t referenced'
            );
        });

        QUnit.test('initialize turndown from window', function(assert) {
            var prevWinTurndown = window.TurndownService;

            window.TurndownService = function() {
                this.initialized = true;
            };

            var converter = new MarkdownConverter();

            assert.ok(converter._html2Markdown.initialized);

            window.TurndownService = prevWinTurndown;
        });
    });
});
