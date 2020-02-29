import $ from 'jquery';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="container"></div>');
});

import './filterBuilderParts/commonTests.js';
import './filterBuilderParts/utilsTests.js';
import './filterBuilderParts/eventsTests.js';
import './filterBuilderParts/keyboardNavigation.js';
import './filterBuilderParts/markupTests.js';
