import $ from 'jquery';
import fx from 'common/core/animation/fx';

import 'ui/track_bar';

QUnit.testStart(function() {
    const markup =
        '<div class="dx-viewport">\
            <div id="container">\
                <div id="trackbar"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

function toSelector(text) {
    return '.' + text;
}

const TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';

QUnit.module('options', {
    beforeEach: function() {
        this.$element = $('#trackbar');
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('value test', function(assert) {
        assert.expect(2);

        const $trackBar = this.$element.dxTrackBar({
            value: 10
        });
        const trackBar = $trackBar.dxTrackBar('instance');

        assert.equal(trackBar.option('value'), 10, 'value option is right');

        trackBar.option('value', 30);
        assert.equal(trackBar.option('value'), 30, 'value option has been change right');
    });

    QUnit.test('min/max test', function(assert) {
        assert.expect(4);

        const $trackBar = this.$element.dxTrackBar({
            min: 20,
            max: 150
        });
        const trackBar = $trackBar.dxTrackBar('instance');

        assert.equal(trackBar.option('min'), 20, 'min option is right');

        trackBar.option('min', 30);
        assert.equal(trackBar.option('min'), 30, 'min option is right');

        assert.equal(trackBar.option('max'), 150, 'max option has been change right');

        trackBar.option('max', 70);
        assert.equal(trackBar.option('max'), 70, 'max option has been change right');
    });

    QUnit.test('min/max overflow test', function(assert) {
        assert.expect(4);

        const $trackBar = this.$element.dxTrackBar({
            min: 20,
            max: 150
        });
        const trackBar = $trackBar.dxTrackBar('instance');

        assert.equal(trackBar.option('value'), 20, 'value option change to min value after set min > value');

        trackBar.option('min', 50);
        assert.equal(trackBar.option('value'), 50, 'value option change to min value after set min > value');

        trackBar.option('value', 200);
        assert.equal(trackBar.option('value'), 150, 'value option change to max value after set value > max');

        trackBar.option('max', 100);
        assert.equal(trackBar.option('value'), 100, 'value option change to max value after set max < value');
    });

    QUnit.test('range width depends on value', function(assert) {
        assert.expect(2);

        const $trackBar = this.$element.dxTrackBar({
            value: 10,
            min: 0,
            max: 100
        }).css('width', 100);
        const trackBar = $trackBar.dxTrackBar('instance');
        const $range = $trackBar.find(toSelector(TRACKBAR_RANGE_CLASS));

        assert.equal($range.width(), trackBar.option('value'), 'range width is right');

        trackBar.option('value', 30);
        assert.equal($range.width(), trackBar.option('value'), 'range width has been change right');
    });

    QUnit.test('range width depends on max/min options', function(assert) {
        assert.expect(3);

        const $trackBar = this.$element.dxTrackBar({
            value: 40,
            min: 20,
            max: 100
        }).css('width', 100);
        const trackBar = $trackBar.dxTrackBar('instance');
        const $range = $trackBar.find(toSelector(TRACKBAR_RANGE_CLASS));

        assert.equal($range.width(), 25, 'range width is right');

        trackBar.option('max', 120);
        assert.equal($range.width(), 20, 'range width has been change right after max changing');

        trackBar.option('min', 70);
        trackBar.option('value', 95);
        assert.equal($range.width(), 50, 'range width has been change right after min changing');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        assert.expect(1);

        const trackBar = this.$element.dxTrackBar({
            onValueChanged: function() { assert.ok(true, 'action fired'); }
        }).dxTrackBar('instance');
        trackBar.option('value', 10);
    });
});

