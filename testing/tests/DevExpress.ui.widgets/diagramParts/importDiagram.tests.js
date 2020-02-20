
import { getLibrary } from 'core/registry';
import 'integration/diagram';

QUnit.module('Import devexpress-diagram', function() {
    QUnit.test('there is no error when the devexpress-diagram script referenced', function(assert) {
        let isOK = true;

        try {
            getLibrary('diagram');
        } catch(e) {
            isOK = false;
        }

        assert.ok(isOK, 'devexpress-diagram has been added');
    });
});

