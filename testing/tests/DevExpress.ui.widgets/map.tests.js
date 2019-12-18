var $ = require('jquery');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="map"></div>';

    $('#qunit-fixture').html(markup);
});

require('./mapParts/commonTests.js');
require('./mapParts/googleStaticTests.js');
require('./mapParts/googleTests.js');
require('./mapParts/bingTests.js');
