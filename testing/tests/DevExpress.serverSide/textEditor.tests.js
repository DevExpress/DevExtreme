QUnit.testStart(function() {
    const markup = '<div id="texteditor"></div>';

    document.getElementById('qunit-fixture').innerHTML = markup;
});

import '../DevExpress.ui.widgets.editors/textEditorParts/markup.tests.js';
