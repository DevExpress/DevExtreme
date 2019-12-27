const $ = require('jquery');

require('common.css!');
require('generic_light.css!');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="container"></div>');
});

require('./filterBuilderParts/commonTests.js');
require('./filterBuilderParts/utilsTests.js');
require('./filterBuilderParts/eventsTests.js');
require('./filterBuilderParts/keyboardNavigation.js');
require('./filterBuilderParts/markupTests.js');
