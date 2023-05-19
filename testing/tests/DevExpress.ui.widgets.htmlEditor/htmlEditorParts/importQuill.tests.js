
SystemJS.config({
    map: {
        'devextreme-quill': '/testing/helpers/quillDependencies/noQuill.js'
    }
});

define(function(require) {
    const getQuill = require('ui/html_editor/quill_importer').getQuill;

    const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

    moduleWithoutCsp('Import 3rd party', function() {
        QUnit.test('it throw an error if the quill script isn\'t referenced', function(assert) {
            assert.throws(
                function() { getQuill(); },
                function(e) {
                    return /(E1041)[\s\S]*(Quill)/.test(e.message);
                },
                'The Quill script isn\'t referenced'
            );
        });
    });
});
