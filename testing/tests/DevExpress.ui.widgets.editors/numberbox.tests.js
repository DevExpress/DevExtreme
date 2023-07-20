import '../../helpers/noIntl.js';
import $ from 'jquery';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

import './numberBoxParts/common.tests.js';
import './numberBoxParts/mask.caret.tests.js';
import './numberBoxParts/mask.tests.js';

