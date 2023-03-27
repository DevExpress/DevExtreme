import { getGanttViewCore as getGantt } from 'ui/gantt/gantt_importer';

QUnit.module('Import devexpress-gantt', function() {
    QUnit.test('throw an error if the devexpress-gantt script isn\'t referenced', function(assert) {
        assert.throws(
            function() { getGantt(); },
            function(e) {
                return /(E1041)[\s\S]*(devexpress-gantt)/.test(e.message);
            }
        );
    });
});
