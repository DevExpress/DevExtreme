const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="hcw"></div>');
});

require('./hierarchicalCollectionWidgetParts/hierarchicalDataAdapter.js');
require('./hierarchicalCollectionWidgetParts/hierarchicalCollectionWidget.js');
