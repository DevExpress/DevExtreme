var $ = require('jquery');

require('common.css!');
require('ui/overlay');

QUnit.testStart(function() {
    var markup = '<div id="overlay"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('default options');

QUnit.test('height and width are \'auto\' on SSR', function(assert) {
    var overlay = $('#overlay').dxOverlay().dxOverlay('instance'),
        overlayElementStyles = overlay.element().style;

    assert.equal(overlay.option('height'), null, 'height is \'null\'');
    assert.equal(overlay.option('width'), null, 'width is \'null\'');
    assert.equal(overlayElementStyles.width, '', 'element has no width');
    assert.equal(overlayElementStyles.height, '', 'element has no height');
});

