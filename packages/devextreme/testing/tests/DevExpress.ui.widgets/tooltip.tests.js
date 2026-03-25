import $ from 'jquery';
import fx from 'common/core/animation/fx';
import Tooltip from 'ui/tooltip';
import renderer from 'core/renderer';
import uiErrors from 'ui/widget/ui.errors';
import keyboardMock from '../../helpers/keyboardMock.js';

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';
const DX_INVISIBILITY_CLASS = 'dx-state-invisible';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';

const wrapper = function() {
    return $('body').find('.' + TOOLTIP_WRAPPER_CLASS);
};

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
        <div class="dx-viewport">\
            <div id="target"></div>\
            <div id="target2"></div>\
            <div id="tooltip"></div>\
            <div id="tooltip2"></div>\
        </div>\
    //</div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render', () => {
    QUnit.test('render as tooltip', function(assert) {
        const $tooltip = $('#tooltip');
        new Tooltip($tooltip, { visible: true });

        assert.ok($tooltip.hasClass(TOOLTIP_CLASS));
        assert.ok(wrapper().length);
    });

    QUnit.test('tooltip should render when target is core renderer object', function(assert) {
        const target = renderer($('#target'));
        const target2 = renderer($('#target2'));

        const $tooltip = $('#tooltip');
        const $tooltip2 = $('#tooltip2');

        new Tooltip($tooltip, {
            target: target,
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave'
        });

        new Tooltip($tooltip2, {
            target: target2,
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave'
        });

        $('#target').trigger('mouseenter');

        assert.notOk($tooltip.hasClass(DX_INVISIBILITY_CLASS), 'first tooltip is visible');
        assert.ok($tooltip2.hasClass(DX_INVISIBILITY_CLASS), 'second tooltip is hidden');
    });

    QUnit.test('tooltip should render when target is selector', function(assert) {
        const $tooltip = $('#tooltip');

        new Tooltip($tooltip, {
            target: '#defferedTarget',
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave'
        });

        $('<div>').attr('id', 'defferedTarget').appendTo('body');
        $('#defferedTarget').trigger('mouseenter');

        assert.notOk($tooltip.hasClass(DX_INVISIBILITY_CLASS), 'first tooltip is visible');
    });

    QUnit.module('Breaking change t1123711 - warning W1021', () => {
        QUnit.test('should be logged if container is invalid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#tooltip').dxTooltip({
                    container: 'invalid',
                    visible: true
                });

                assert.ok(uiErrors.log.calledOnce, 'only one warning is logged');
                assert.deepEqual(uiErrors.log.lastCall.args, [
                    'W1021',
                    'dxTooltip',
                ], 'args of the log method');
            } finally {
                uiErrors.log.restore();
            }
        });

        QUnit.test('should not not be logged if container is valid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#tooltip').dxTooltip({
                    container: 'body',
                    visible: true
                });

                assert.ok(uiErrors.log.notCalled, 'no warning is logged');
            } finally {
                uiErrors.log.restore();
            }
        });
    });
});

QUnit.module('overlay integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('tooltip should be closed on outside click if hideOnOutsideClick is true', function(assert) {
        const $tooltip = $('#tooltip').dxTooltip({
            hideOnOutsideClick: true
        });
        const instance = $tooltip.dxTooltip('instance');

        instance.show();
        $('#qunit-fixture').trigger('dxpointerdown');

        assert.equal(instance.option('visible'), false, 'toast was hidden should be hiding');
    });

    QUnit.test('tooltip should not prevent hideOnOutsideClick handler of other overlays', function(assert) {
        const tooltip = new Tooltip($('#tooltip'));
        const $overlay = $('<div>').appendTo('.dx-viewport');

        const overlay = $overlay.dxOverlay({
            hideOnOutsideClick: true
        }).dxOverlay('instance');

        overlay.show();
        tooltip.show();

        $('#qunit-fixture').trigger('dxpointerdown');

        assert.equal(overlay.option('visible'), false, 'dxOverlay should be hiding');
    });
});

QUnit.module('base z-index', () => {
    QUnit.test('tooltip should have correct z-index', function(assert) {
        Tooltip.baseZIndex(10000);

        const tooltip = new Tooltip($('#tooltip'), { visible: true });
        const $tooltipContent = tooltip.$overlayContent();

        assert.equal($tooltipContent.css('zIndex'), 10001, 'tooltip\'s z-index is correct');
    });
});

QUnit.module('accessibility', () => {
    QUnit.test('role="tooltip" attribute should be added to tooltip', function(assert) {
        const $tooltip = $('#tooltip');
        new Tooltip($tooltip);
        const $overlayContent = $tooltip.find(`.${OVERLAY_CONTENT_CLASS}`);

        assert.equal($overlayContent.attr('role'), 'tooltip');
    });

    QUnit.test('aria-describedby property should be set on target when tooltip is visible', function(assert) {
        const $target = $('#target');
        const $element = $('#tooltip');
        new Tooltip($element, { target: $target, visible: false });
        const $overlay = $element.find(`.${OVERLAY_CONTENT_CLASS}`);

        assert.notEqual($target.attr('aria-describedby'), undefined, 'aria-describedby exists on target');
        assert.equal($target.attr('aria-describedby'), $overlay.attr('id'), 'aria-describedby and overlay\'s id are equal');

    });

    QUnit.module('WCAG - dismissible', () => {
        QUnit.test('should hide visible tooltip on Escape key press', function(assert) {
            const tooltip = new Tooltip($('#tooltip'), {
                target: '#target',
                visible: true,
            });
            const $target = $('#target').attr('tabindex', 0);
            const keyboard = keyboardMock($target);

            keyboard.keyDown('esc');

            assert.strictEqual(tooltip.option('visible'), false, 'tooltip is hidden');
        });
    });

    QUnit.module('WCAG - hoverable', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    }, () => {
        QUnit.test('should stay visible when pointer moves from target to tooltip content', function(assert) {
            const instance = new Tooltip($('#tooltip'), {
                target: '#target',
                showEvent: 'mouseenter',
                hideEvent: 'mouseleave',
                visible: true,
                animation: null,
            });

            const $overlayContent = wrapper().find(`.${OVERLAY_CONTENT_CLASS}`);

            $('#target').trigger('mouseleave');
            $overlayContent.trigger('mouseenter');
            this.clock.tick(200);

            assert.ok(instance.option('visible'), 'tooltip remains visible after pointer moves to tooltip content');
        });

        QUnit.test('should hide when pointer leaves tooltip content', function(assert) {
            const instance = new Tooltip($('#tooltip'), {
                target: '#target',
                showEvent: 'mouseenter',
                hideEvent: 'mouseleave',
                visible: true,
                animation: null,
            });

            const $overlayContent = wrapper().find(`.${OVERLAY_CONTENT_CLASS}`);

            $overlayContent.trigger('mouseenter');
            $overlayContent.trigger('mouseleave');

            assert.notOk(instance.option('visible'), 'tooltip hides when pointer leaves tooltip content');
        });
    });
});
