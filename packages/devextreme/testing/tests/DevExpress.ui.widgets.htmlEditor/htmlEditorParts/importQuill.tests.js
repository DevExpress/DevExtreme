import { getQuill } from '__internal/ui/html_editor/m_quill_importer';

QUnit.module('Import 3rd party', function() {
    QUnit.test('it throw an error if the quill script is not referenced', function(assert) {
        assert.throws(
            function() { getQuill(); },
            function(e) {
                return /(E1041)[\s\S]*(Quill)/.test(e.message);
            },
            'The Quill script is not referenced'
        );
    });
});
