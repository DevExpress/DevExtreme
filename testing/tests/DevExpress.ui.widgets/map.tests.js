import $ from 'jquery';

import 'common.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="map"></div>';

    $('#qunit-fixture').html(markup);
});

import './mapParts/commonTests.js';
import './mapParts/googleStaticTests.js';
import './mapParts/googleTests.js';
import './mapParts/bingTests.js';
