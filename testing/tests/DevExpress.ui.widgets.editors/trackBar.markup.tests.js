var $ = require('jquery');

require('ui/track_bar');

QUnit.testStart(function() {
    var markup =
        '<div id="trackbar"></div>';

    $('#qunit-fixture').html(markup);
});

function toSelector(text) {
    return '.' + text;
}

var TRACKBAR_CLASS = 'dx-trackbar',
    TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container',
    TRACKBAR_RANGE_CLASS = 'dx-trackbar-range',
    TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';

QUnit.module('TrackBar markup', {
    beforeEach: function() {
        this.$element = $('#trackbar');
    }
});

QUnit.test('markup', function(assert) {
    assert.expect(4);

    var $trackBar = this.$element.dxTrackBar();

    assert.ok($trackBar.hasClass(TRACKBAR_CLASS), 'dxTrackBar initialized');
    assert.equal($trackBar.find(toSelector(TRACKBAR_CONTAINER_CLASS)).length, 1, 'Container has been created');
    assert.equal($trackBar.find(toSelector(TRACKBAR_RANGE_CLASS)).length, 1, 'Range has been created');
    assert.equal($trackBar.find(toSelector(TRACKBAR_WRAPPER_CLASS)).length, 1, 'Wrapper div has been created');
});
