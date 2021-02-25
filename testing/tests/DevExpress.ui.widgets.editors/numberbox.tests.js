import $ from 'jquery';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

import './numberBoxParts/common.tests.js';
import './numberBoxParts/mask.caret.tests.js';
import './numberBoxParts/mask.tests.js';

