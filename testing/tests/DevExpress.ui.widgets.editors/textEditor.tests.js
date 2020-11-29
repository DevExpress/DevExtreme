import $ from 'jquery';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="texteditor"></div>';

    $('#qunit-fixture').html(markup);
});

import './textEditorParts/markup.tests.js';
import './textEditorParts/common.tests.js';
import './textEditorParts/mask.tests.js';
