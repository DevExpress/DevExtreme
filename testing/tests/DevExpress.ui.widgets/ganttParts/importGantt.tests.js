import { getLibrary } from 'core/library_registry';
import 'integration/gantt';

QUnit.module('Import devexpress-gantt', function() {
    QUnit.test('there is no error when the devexpress-gantt script referenced', function(assert) {
        let isOK = true;

        try {
            getLibrary('gantt');
        } catch(e) {
            isOK = false;
        }

        assert.ok(isOK);
    });
});
