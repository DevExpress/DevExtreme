import $ from 'jquery';
import support from '__internal/core/utils/m_support';
import messageLocalization from 'common/core/localization/message';

import {
    LOADINDICATOR_CLASS,
    LOADINDICATOR_ICON_CLASS,
    LOADINDICATOR_CONTENT_CLASS,
    LOADINDICATOR_SEGMENT_CLASS,
    LOADINDICATOR_IMAGE_CLASS,
} from '__internal/ui/load_indicator';

import 'ui/load_indicator';
import 'fluent_blue_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="loadIndicator"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('indicator with browser animation', {
    beforeEach: function() {
        this._defaultAnimation = support.animation;
        support.animation = function() { return true; };
    },
    afterEach: function() {
        support.animation = this._defaultAnimation;
    }
}, () => {
    QUnit.test('visibility of the LoadIndicator with initial value of the \'visible\' option equal to \'true\'', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator({ visible: true });
        assert.ok($element.is(':visible'));
    });

    QUnit.test('render animated indicator markup', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false });
        const loadIndicator = $indicator.dxLoadIndicator('instance');

        assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), 'Load Indicator initialized');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_ICON_CLASS}`).length, 1, 'Icon div created');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT_CLASS}`).length, loadIndicator.option('_animatingSegmentCount') + 1, 'Segments created');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT_CLASS}1`).length, 1, 'Numerated segment created');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_CONTENT_CLASS}`).length, 1, 'content is created');
    });

    QUnit.test('visible changes visibility option', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false });
        const loadIndicator = $indicator.dxLoadIndicator('instance');

        assert.ok($indicator.is(':hidden'));

        loadIndicator.option('visible', false);
        assert.ok($indicator.is(':hidden'));

        loadIndicator.option('visible', true);
        assert.ok($indicator.is(':visible'));

        loadIndicator.option('visible', false);
        assert.ok($indicator.is(':hidden'));
    });
});

QUnit.module('Events', () => {
    QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';

        assert.expect(2);

        $('#loadIndicator').dxLoadIndicator({
            visible: true,
            indicatorSrc: url,
            onContentReady: function(e) {
                assert.ok($(e.element).find(`.${LOADINDICATOR_IMAGE_CLASS}`).css('backgroundImage'));
                assert.ok($(e.element).hasClass(LOADINDICATOR_CLASS));
            }
        });
    });
});

QUnit.module('accessibility', () => {
    QUnit.test('role on load indicator', function(assert) {
        const instance = $('#loadIndicator').dxLoadIndicator({ visible: true }).dxLoadIndicator('instance');

        assert.strictEqual(instance.$element().attr('role'), 'alert');
    });

    QUnit.test('load indicator has correct aria-label', function(assert) {
        const label = messageLocalization.format('Loading');
        const instance = $('#loadIndicator').dxLoadIndicator({ visible: true }).dxLoadIndicator('instance');

        assert.strictEqual(instance.$element().attr('aria-label'), label);
    });
});
