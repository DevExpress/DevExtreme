import $ from 'jquery';
import support from '__internal/core/utils/m_support';
import messageLocalization from 'common/core/localization/message';
import 'ui/load_indicator';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="loadIndicator"></div>';

    $('#qunit-fixture').html(markup);
});

const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_ICON = LOADINDICATOR_CLASS + '-icon';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_SEGMENT = LOADINDICATOR_CLASS + '-segment';
const LOADINDICATOR_IMAGE = 'dx-loadindicator-image';

QUnit.module('indicator with browser animation', {
    beforeEach: function() {
        // Override support styleProp
        this._defaultAnimation = support.animation;
        support.animation = function() { return true; };
    },
    afterEach: function() {
        // Restoring support styleProp
        support.animation = this._defaultAnimation;
    }
}, () => {
    QUnit.test('visibility of the LoadIndicator with initial value of the \'visible\' option equal to \'true\'', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator({ visible: true, viaImage: false });
        assert.ok($element.is(':visible'));
    });

    [true, false].forEach((viaImage) => {
        QUnit.test(`render animated indicator markup with viaImage=${viaImage}`, function(assert) {
            const $indicator = $('#loadIndicator').dxLoadIndicator({
                visible: false,
                viaImage,
            });
            const loadIndicator = $indicator.dxLoadIndicator('instance');

            assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), 'Load Indicator initialized');
            assert.strictEqual($indicator.find(`.${LOADINDICATOR_ICON}`).length, 1, 'Icon div created');
            assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT}`).length, loadIndicator.option('_animatingSegmentCount') + 1, 'Segments created');
            assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT}1`).length, 1, 'Numerated segment created');
            assert.strictEqual($indicator.find(`.${LOADINDICATOR_CONTENT_CLASS}`).length, 1, 'content is created');
        });
    });

    QUnit.test('visible changes visibility option', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({
            visible: false
        });
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
                assert.ok($(e.element).find('.' + LOADINDICATOR_IMAGE).css('backgroundImage'));
                assert.ok($(e.element).hasClass(LOADINDICATOR_CLASS));
            }
        });
    });
});

QUnit.module('accessability', () => {
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
