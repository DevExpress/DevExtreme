
import { getLibrary } from 'core/library_registry';
import 'integration/quill';

QUnit.module('Import 3rd party', function() {
    QUnit.test('there is no error when the quill script referenced', function(assert) {
        let isOK = true;

        try {
            getLibrary('quill');
        } catch(e) {
            isOK = false;
        }

        assert.ok(isOK);
    });
});

