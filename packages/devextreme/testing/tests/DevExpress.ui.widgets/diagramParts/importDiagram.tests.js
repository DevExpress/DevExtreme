import { getDiagram } from '__internal/ui/diagram/diagram.importer';

QUnit.module('Import devexpress-diagram', function() {
    QUnit.test('throw an error if the devexpress-diagram script isn\'t referenced', function(assert) {
        assert.throws(
            function() { getDiagram(); },
            function(e) {
                return /(E1041)[\s\S]*(devexpress-diagram)/.test(e.message);
            }
        );
    });
});
