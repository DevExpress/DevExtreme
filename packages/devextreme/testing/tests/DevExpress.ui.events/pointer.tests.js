import $ from 'jquery';

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element"><div id="delegated"></div></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

import './pointerParts/baseTests.js';
import './pointerParts/mouseTests.js';
import './pointerParts/touchTests.js';
import './pointerParts/mouseAndTouchTests.js';
import './pointerParts/strategySelectionTests.js';
