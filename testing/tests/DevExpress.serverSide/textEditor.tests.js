require('common.css!');

QUnit.testStart(function() {
    var markup = '<div id="texteditor"></div>';

    document.getElementById('qunit-fixture').innerHTML = markup;
});

require('../DevExpress.ui.widgets.editors/textEditorParts/markup.tests.js');
