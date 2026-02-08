import $ from 'jquery';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="hcw"></div>');
});

import './hierarchicalCollectionWidgetParts/hierarchicalDataAdapter.js';
import './hierarchicalCollectionWidgetParts/hierarchicalCollectionWidget.js';
