import $ from 'jquery';
import { value as viewPort } from 'core/utils/view_port';
import fx from 'animation/fx';
import Tooltip from 'ui/tooltip';
import renderer from 'core/renderer';
import errors from 'core/errors';

import 'generic_light.css!';

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';
const DX_INVISIBILITY_CLASS = 'dx-state-invisible';

const wrapper = function() {
    return $('body').find('.' + TOOLTIP_WRAPPER_CLASS);
};

viewPort($('#qunit-fixture').addClass('dx-viewport'));


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
        const target = renderer('#target');
        const target2 = renderer('#target2');

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
    QUnit.test('tooltip should be closed on outside click if closeOnOutsideClick is true', function(assert) {
        const $tooltip = $('#tooltip').dxTooltip({
            closeOnOutsideClick: true
        });
        const instance = $tooltip.dxTooltip('instance');

        instance.show();
        $('#qunit-fixture').trigger('dxpointerdown');

        assert.equal(instance.option('visible'), false, 'toast was hidden should be hiding');
    });

    QUnit.test('tooltip should not prevent closeOnOutsideClick handler of other overlays', function(assert) {
        const tooltip = new Tooltip($('#tooltip'));
        const $overlay = $('<div>').appendTo('.dx-viewport');

        const overlay = $overlay.dxOverlay({
            closeOnOutsideClick: true
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
        const $tooltipContent = tooltip.overlayContent();

        assert.equal($tooltipContent.css('zIndex'), 10001, 'tooltip\'s z-index is correct');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $tooltip = $('#tooltip');
        new Tooltip($tooltip);
        const $overlayContent = $tooltip.find('.dx-overlay-content');

        assert.equal($overlayContent.attr('role'), 'tooltip');
    });

    QUnit.test('aria-describedby property should be set on target when tooltip is visible', function(assert) {
        const $target = $('#target'); const $element = $('#tooltip');
        new Tooltip($element, { target: '#target', visible: false });
        const $overlay = $element.find('.dx-overlay-content');

        assert.notEqual($target.attr('aria-describedby'), undefined, 'aria-describedby exists on target');
        assert.equal($target.attr('aria-describedby'), $overlay.attr('id'), 'aria-describedby and overlay\'s id are equal');

    });
});

QUnit.test('show warning if deprecated \'elementAttr\' option is used', function(assert) {
    sinon.spy(errors, 'log');

    try {
        $('#tooltip').dxTooltip({
            elementAttr: { class: 'someClass' },
        });
        assert.deepEqual(errors.log.lastCall.args, [
            'W0001',
            'dxTooltip',
            'elementAttr',
            '21.2',
            'This property is deprecated in favor of the wrapperAttr property.'
        ], 'args of the log method');
    } finally {
        errors.log.restore();
    }
});
