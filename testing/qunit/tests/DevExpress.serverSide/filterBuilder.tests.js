const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="container"></div>');
});

QUnit.module('Filter Builder markup');

require('../DevExpress.ui.widgets/filterBuilderParts/markupTests.js');
