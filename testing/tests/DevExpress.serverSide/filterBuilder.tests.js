import $ from 'jquery';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="container"></div>');
});

QUnit.module('Filter Builder markup');

import '../DevExpress.ui.widgets/filterBuilderParts/markupTests.js';
