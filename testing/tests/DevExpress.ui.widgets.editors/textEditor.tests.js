const $ = require('jquery');

require('common.css!');

QUnit.testStart(function() {
    const markup = '<div id="texteditor"></div>';

    $('#qunit-fixture').html(markup);
});

require('./textEditorParts/markup.tests.js');
require('./textEditorParts/common.tests.js');
require('./textEditorParts/mask.tests.js');
