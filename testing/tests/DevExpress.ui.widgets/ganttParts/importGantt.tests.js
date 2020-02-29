
SystemJS.config({
    map: {
        'devexpress-gantt': '/testing/helpers/noGantt.js'
    }
});

define(function(require) {
    const getGantt = require('ui/gantt/gantt_importer').getGanttViewCore;

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
});
