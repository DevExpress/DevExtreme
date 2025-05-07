import $ from 'jquery';
import Tooltip from 'ui/tooltip';
import { show } from '__internal/ui/tooltip/m_tooltip';
import viewPort from 'core/utils/view_port';
import fx from 'common/core/animation/fx';

function checkTooltip(assert) {
    const $testContent = $('.dx-popup-content').find('.test-content');
    assert.equal($('.dx-tooltip').length, 1);
    assert.equal($testContent.length, 1);
    assert.equal($testContent.text(), 'My tooltip');
    assert.ok($('.dx-tooltip-wrapper').hasClass('dx-position-right'));
}


QUnit.testStart(function() {
    const markup = '<button id="tooltip-target">My button</button>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('tooltip tests', {
    beforeEach: function() {
        fx.off = true;
        viewPort.value('#qunit-fixture');
    },

    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('show tooltip', function(assert) {
    show({
        target: '#qunit-fixture button',
        content: '<div class="test-content">My tooltip</div>',
        position: 'right'
    });

    checkTooltip(assert);
});

QUnit.test('show tooltip using $ target', function(assert) {
    const $target = $('#tooltip-target');

    show({
        target: $target,
        content: '<div class="test-content">My tooltip</div>',
        position: 'right'
    });

    checkTooltip(assert);
});

QUnit.test('show tooltip once', function(assert) {
    const $target = $('#tooltip-target');

    $target.on('dxclick', function() {
        show({
            target: $target,
            content: '<div class="test-content">My tooltip</div>',
            position: 'right'
        });
    });

    $target.trigger('dxclick');
    $target.trigger('dxclick');

    assert.equal($('.dx-tooltip').length, 1);
});

QUnit.test('show tooltip with custom animation', function(assert) {
    const $target = $('#tooltip-target');

    show({
        target: $target,
        content: '<div class="test-content">My tooltip</div>',
        position: 'right',
        animation: { hide: false }
    });

    const tooltipInstance = Tooltip.getInstance($('.dx-tooltip'));
    assert.deepEqual(tooltipInstance.option('animation'), { hide: false });
});

QUnit.test('tooltip option', function(assert) {
    const $target = $('#tooltip-target');

    show({
        target: $target,
        content: '<div class="test-content">My tooltip</div>',
        position: 'right',
        animation: { hide: false },
        height: 200,
        width: 300
    });

    const tooltipInstance = Tooltip.getInstance($('.dx-tooltip'));
    assert.ok(!tooltipInstance.option('content'));
    assert.equal(tooltipInstance.option('height'), 200);
    assert.equal(tooltipInstance.option('width'), 300);
});

QUnit.test('second shown tooltip should remove first shown (T107568)', function(assert) {
    fx.off = false;
    const done = assert.async();

    show().done(function() {
        show();
        assert.equal($('.dx-tooltip').length, 1);
        done();
    });
});
