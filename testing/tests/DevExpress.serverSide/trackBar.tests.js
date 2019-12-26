require('../DevExpress.ui.widgets.editors/trackBar.markup.tests.js');

const $ = require('jquery');

require('ui/track_bar');

QUnit.testStart(function() {
    const markup =
        '<div id="trackbar"></div>';

    $('#qunit-fixture').html(markup);
});

function toSelector(text) {
    return '.' + text;
}

const TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';

QUnit.module('Range width', {
    beforeEach: function() {
        this.$element = $('#trackbar');
    }
}, () => {
    QUnit.test('range width doesn\'t depend on value on server', function(assert) {
        const $trackBar = this.$element.dxTrackBar({
            value: 10,
            min: 0,
            max: 100
        }).css('width', 100);
        const $range = $trackBar.find(toSelector(TRACKBAR_RANGE_CLASS));

        assert.equal($range[0].style.width, '0px', 'range width is right');
    });
});
