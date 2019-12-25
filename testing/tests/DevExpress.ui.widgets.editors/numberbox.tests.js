var $ = require('jquery');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

require('./numberBoxParts/common.tests.js');
require('./numberBoxParts/mask.caret.tests.js');
require('./numberBoxParts/mask.tests.js');

