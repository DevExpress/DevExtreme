const $ = require('jquery');

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element"><div id="delegated"></div></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

require('./pointerParts/baseTests.js');
require('./pointerParts/mouseAndTouchTests.js');
require('./pointerParts/strategySelectionTests.js');
