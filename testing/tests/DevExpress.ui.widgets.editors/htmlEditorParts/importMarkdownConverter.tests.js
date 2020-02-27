import 'ui/html_editor/converters/markdown';
import { getLibrary } from 'core/library_registry';

QUnit.module('Import 3rd party', function() {
    QUnit.test('Markdown-related libraries should be registered', function(assert) {
        let isOK = true;

        try {
            getLibrary('showdown');
        } catch(e) {
            isOK = false;
            assert.ok(false, 'showdown script is not registered');
        }

        try {
            getLibrary('turndown');
        } catch(e) {
            isOK = false;
            assert.ok(false, 'turndown script is not registered');
        }

        assert.ok(isOK);
    });
});
