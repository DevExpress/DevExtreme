/* global System */

System.addImportMap({
    imports: {
        'devexpress-gantt': '/testing/helpers/noGantt.js'
    }
});

System.register(['ui/gantt/gantt_importer'], function() {
    let getGantt;

    return {
        setters: [function(_ganttImporter) {
            getGantt = _ganttImporter.getGanttViewCore;
        }],
        execute: function() {
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
        }
    };
});
