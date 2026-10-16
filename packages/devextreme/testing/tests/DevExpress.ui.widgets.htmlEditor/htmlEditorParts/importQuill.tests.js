import quillImporter from 'ui/html_editor/quill_importer';

QUnit.module('Import 3rd party', function() {
    QUnit.test('it throw an error if the quill script is not referenced', function(assert) {
        assert.throws(
            function() { quillImporter.getQuill(); },
            function(e) {
                return /(E1041)[\s\S]*(Quill)/.test(e.message);
            },
            'The Quill script is not referenced'
        );
    });
});
