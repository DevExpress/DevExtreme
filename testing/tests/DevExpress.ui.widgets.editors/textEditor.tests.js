import $ from 'jquery';
import { addShadowDomStyles } from 'core/utils/shadow_dom';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="texteditor"></div>';

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});

import './textEditorParts/markup.tests.js';
import './textEditorParts/common.tests.js';
import './textEditorParts/mask.tests.js';
