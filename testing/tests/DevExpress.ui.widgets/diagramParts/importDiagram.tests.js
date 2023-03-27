/* global System */
System.addImportMap({
    imports: {
        'devexpress-diagram': '/testing/helpers/noDiagram.js',
    },
});

System.register(['ui/diagram/diagram.importer'], function() {
    let getDiagram;

    return {
        setters: [function(_diagramImporter) {
            getDiagram = _diagramImporter.getDiagram;
        }],
        execute: function() {
            QUnit.module('Import devexpress-diagram', function() {
                QUnit.test('throw an error if the devexpress-diagram script isn\'t referenced', function(assert) {
                    assert.throws(
                        function() { getDiagram(); },
                        function(e) {
                            return /(E1041)[\s\S]*(devexpress-diagram)/.test(e.message);
                        },
                    );
                });
            });
        },
    };
});
