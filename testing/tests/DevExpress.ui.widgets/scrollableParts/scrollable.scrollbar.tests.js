import $ from 'jquery';
import animationFrame from 'animation/frame';
import devices from 'core/devices';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import pointerMock from '../../../helpers/pointerMock.js';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import { getTranslateValues } from 'renovation/ui/scroll_view/utils/get_translate_values';

import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLABLE_SCROLL_CONTENT_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS,
    SCROLLABLE_SCROLLBAR_ACTIVE_CLASS
} from './scrollable.constants.js';

const SCROLLBAR_MIN_HEIGHT = 15;

const moduleConfig = {
    beforeEach: function() {
        const markup = '\
        <div id="scrollable" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2"></div>\
        </div>\
        <div id="scrollable1" style="height: 100px;">\
            <div id="scrollable2" style="height: 50px;">\
                    <div class="innerContent"></div>\
            </div>\
            <div style="height: 100px;"></div>\
        </div>\
        <div id="scaledContainer" style="transform:scale(0.2, 0.5)">\
            <div style="height: 500px; width: 500px;">\
                <div id="scaledScrollable">\
                    <div id="scaledContent" style="height: 992px; width: 992px;"></div>\
                </div>\
            </div>\
        </div>';
        $('#qunit-fixture').html(markup);

        this.clock = sinon.useFakeTimers();
        this._originalRequestAnimationFrame = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this._originalRequestAnimationFrame;
    }
};

QUnit.module('scrollbar', moduleConfig);

QUnit.test('markup', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $scrollbar = $container.children().eq(1);
    const $scroll = $scrollbar.children().eq(0);
    const $scrollContent = $scroll.children().eq(0);

    assert.equal($container.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 1, 'single scrollbar added');
    assert.ok($scrollbar.hasClass(SCROLLABLE_SCROLLBAR_CLASS), 'dx-scrollable-scrollbar class attached');
    assert.ok($scroll.hasClass(SCROLLABLE_SCROLL_CLASS), 'dx-scrollable-scroll class attached');
    assert.ok($scrollContent.hasClass(SCROLLABLE_SCROLL_CONTENT_CLASS), 'dx-scrollable-scroll-content class attached');
});

QUnit.test('direction css classes', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'both'
    });

    assert.equal($scrollable.find('.' + SCROLLBAR_HORIZONTAL_CLASS).length, 1, 'horizontal scrollbar added');
    assert.equal($scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS).length, 1, 'vertical scrollbar added');
});

QUnit.test('scrollbar appears when scrolling is begun', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true,
        inertiaEnabled: false
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'scrollbar is hidden before scrolling');

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'scrollbar is shown during scrolling');
});

QUnit.test('scrollbar is hidden when scrolling is completed', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            assert.equal($scroll.hasClass('dx-state-invisible'), true, 'scrollbar is hidden');
        }
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();
});

QUnit.test('scrollbar height calculated correctly', function(assert) {
    const containerHeight = 50;
    const contentHeight = 100;
    const scrollHeight = (containerHeight / contentHeight) * containerHeight;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);

    $scrollable.dxScrollable('instance').update();

    assert.equal($scroll.outerHeight(), scrollHeight, 'scrollbar height calculated correctly');
});

QUnit.test('scrollbar min height', function(assert) {
    const $scrollable = $('#scrollable');
    $scrollable.height(10);
    $scrollable.children().height(10000);

    $scrollable.dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true
    });

    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    assert.roughEqual($scrollbar.outerHeight(), SCROLLBAR_MIN_HEIGHT, 0.01);
});

QUnit.test('scrollbar position calculated correctly when content much greater than container', function(assert) {
    const containerSize = 100;
    const contentSize = 10000;

    const $scrollable = $('#scrollable');
    $scrollable.height(containerSize);
    $scrollable.wrapInner('<div>').children().height(contentSize);

    $scrollable.dxScrollable({
        useSimulatedScrollbar: true,
        useNative: false
    });
    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $scrollable.dxScrollable('scrollTo', contentSize - containerSize);

    assert.equal(getTranslateValues($scrollbar.get(0)).top, containerSize - SCROLLBAR_MIN_HEIGHT);
});

QUnit.test('scrollbar position calculated correctly with scaled content', function(assert) {
    const $scrollable = $('#scaledScrollable');
    const instance = $scrollable.dxScrollable({
        useSimulatedScrollbar: true,
        useNative: false,
        showScrollbar: 'always',
        direction: 'both'
    }).dxScrollable('instance');
    const $scrollbars = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $hScrollBar = $scrollbars.eq(0);
    const $vScrollBar = $scrollbars.eq(1);

    instance.scrollTo({ left: 200, top: 200 });
    assert.strictEqual(getTranslateValues($hScrollBar.get(0)).left, 100, 'Correct scrollbar position');
    assert.strictEqual(getTranslateValues($vScrollBar.get(0)).top, 100, 'Correct scrollbar position');

    instance.scrollTo({ left: 100, top: 100 });

    assert.strictEqual(getTranslateValues($hScrollBar.get(0)).left, 50, 'Correct scrollbar position');
    assert.strictEqual(getTranslateValues($vScrollBar.get(0)).top, 50, 'Correct scrollbar position');

    const hScrollbarRect = $hScrollBar.get(0).getBoundingClientRect();
    const vScrollbarRect = $vScrollBar.get(0).getBoundingClientRect();

    assert.roughEqual(vScrollbarRect.height, 125, 0.01, 'Correct vertical scrollbar size');
    assert.strictEqual(hScrollbarRect.width, 50, 'Correct horizontal scrollbar size');
    assert.strictEqual($container.scrollTop(), 100, 'Content position isn\'t zoomed');
    assert.strictEqual($container.scrollLeft(), 100, 'Content position isn\'t zoomed');
});

QUnit.test('scrollbar in scaled container has correct position after update', function(assert) {
    const containerHeight = 500;
    const contentHeight = 1000;
    const scaleRatio = 0.5;
    const distance = -100;
    const expectedScrollbarDistance = -distance * (containerHeight / (contentHeight * 5)) / scaleRatio;

    const $scrollable = $('#scaledScrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('instance').update();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .up();

    $content.height(contentHeight * 5);
    $scrollable.dxScrollable('instance').update();

    assert.equal(getTranslateValues($scroll.get(0)).top, expectedScrollbarDistance, 'scrollbar correctly positioned');
});

QUnit.test('scrollbar width calculated correctly', function(assert) {
    const containerWidth = 50;
    const contentWidth = 100;
    const scrollWidth = (containerWidth / contentWidth) * containerWidth;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'horizontal'
    });
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.width(containerWidth);
    $content.width(contentWidth);

    $scrollable.dxScrollable('instance').update();

    assert.equal($scroll.outerWidth(), scrollWidth, 'scrollbar width calculated correctly');
});

QUnit.test('moving scrollable moves scrollbar', function(assert) {
    const containerHeight = 50;
    const contentHeight = 100;
    const distance = -10;
    const scrollbarDistance = -distance * (containerHeight / contentHeight);

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            assert.equal(getTranslateValues($scroll.get(0)).top, 2 * scrollbarDistance, 'scrollbar follows pointer everytime');
        }
    });

    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('instance').update();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .move(0, distance)
        .up();
});

QUnit.test('scrollbar has correct position after update', function(assert) {
    const containerHeight = 200;
    const contentHeight = 400;
    const distance = -10;
    const scrollbarDistance = -distance * (containerHeight / (contentHeight * 5));

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('instance').update();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .up();

    $content.height(contentHeight * 5);
    $scrollable.dxScrollable('instance').update();
    $scroll.css('opacity', 1);

    assert.equal(getTranslateValues($scroll.get(0)).top, scrollbarDistance, 'scrollbar correctly positioned');
});

QUnit.test('scroll updated before start', function(assert) {
    const scrollHeight = 100;
    const $scrollable = $('#scrollable').height(scrollHeight);
    const $innerWrapper = $scrollable.wrapInner('<div>').children().eq(0).height(scrollHeight / 2);

    const scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'vertical',
        scrollByContent: true,
        bounceEnabled: false
    }).dxScrollable('instance');

    $innerWrapper.height(2 * scrollHeight);
    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -10);

    assert.equal(scrollable.scrollOffset().top, 10, 'scrollable moved');
});

QUnit.test('scroll not updated before start if auto update is prevented', function(assert) {
    const scrollHeight = 100;
    const $scrollable = $('#scrollable').height(scrollHeight);
    const $innerWrapper = $scrollable.wrapInner('<div>').children().eq(0).height(scrollHeight / 2);

    const scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'vertical',
        scrollByContent: true,
        bounceEnabled: false,
        updateManually: true
    }).dxScrollable('instance');

    $innerWrapper.height(2 * scrollHeight);
    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -10);

    assert.equal(scrollable.scrollOffset().top, 0, 'scrollable not moved');
});

QUnit.test('scroll not updated after scrollTo if auto update is prevented', function(assert) {
    const scrollHeight = 100;
    const $scrollable = $('#scrollable').height(scrollHeight);
    const $innerWrapper = $scrollable.wrapInner('<div>').children().eq(0).height(scrollHeight / 2);

    const scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'vertical',
        scrollByContent: true,
        bounceEnabled: false,
        updateManually: true
    }).dxScrollable('instance');

    $innerWrapper.height(2 * scrollHeight);

    scrollable.scrollTo(10);

    assert.equal(scrollable.scrollOffset().top, 0, 'scrollable not moved');
});

QUnit.test('native scrollable should be updated before dxscrollinit', function(assert) {
    const $scrollable = $('#scrollable1').dxScrollable({
        useNative: true,
        direction: 'vertical'
    });

    $scrollable.hide();

    const $scrollableNested = $('#scrollable2').dxScrollable({
        useNative: true,
        direction: 'vertical'
    });
    const $scrollableNestedContainer = $scrollableNested.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollableNested.find('.innerContent').eq(0);

    $scrollableNestedContainer.on('dxscrollinit', function() {
        assert.ok(true, 'scroll action fired for nested dxScrollable');
    });

    $scrollable.show();
    $content.height(100);

    pointerMock($content).start().down().up();
});

QUnit.test('scrollbar removed when direction changed', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'vertical'
    });

    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLL_CLASS).length, 1, 'one scrollbar added');

    $scrollable.dxScrollable('instance').option('direction', 'horizontal');

    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLL_CLASS).length, 1, 'single scrollbar for single direction');
});

QUnit.test('direction class was changed when direction changed', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'vertical'
    });

    assert.ok($scrollable.hasClass('dx-scrollable-vertical'), 'scrollbar has class vertical');
    assert.equal($scrollable.hasClass('dx-scrollable-horizontal'), false, 'scrollbar has not class horizontal');
    assert.equal($scrollable.hasClass('dx-scrollable-both'), false, 'scrollbar has not class both');

    $scrollable.dxScrollable('instance').option('direction', 'horizontal');

    assert.equal($scrollable.hasClass('dx-scrollable-vertical'), false, 'scrollbar has class vertical');
    assert.ok($scrollable.hasClass('dx-scrollable-horizontal'), 'scrollbar has not class horizontal');
    assert.equal($scrollable.hasClass('dx-scrollable-both'), false, 'scrollbar has not class both');

    $scrollable.dxScrollable('instance').option('direction', 'both');

    assert.equal($scrollable.hasClass('dx-scrollable-vertical'), false, 'scrollbar has class vertical');
    assert.equal($scrollable.hasClass('dx-scrollable-horizontal'), false, 'scrollbar has not class horizontal');
    assert.ok($scrollable.hasClass('dx-scrollable-both'), 'scrollbar has not class both');
});

QUnit.test('scrollbar does not appear during scrolling when content is less than container', function(assert) {
    const containerHeight = 50;
    const contentHeight = containerHeight;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    const $content = $scrollable.find('.content1');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('instance').update();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.ok($scrollable.find('.dx-scrollable-scrollbar').is(':hidden'), 'scrollbar is hidden during scrolling');
});

QUnit.test('scrollbar jumps to the mouse click point on scrollbar area', function(assert) {
    $('#qunit-fixture').css('top', 0);

    const containerSize = 50;
    const contentHeight = 100;
    const moveDistance = 20;

    const $scrollable = $('#scrollable')
        .height(containerSize)
        .wrapInner('<div>');
    $scrollable.children().height(contentHeight);

    $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: 'onHover',
        scrollByThumb: true,
        scrollByContent: false
    });

    const $scrollbarContainer = $scrollable.find('.dx-scrollbar-vertical');
    const pointer = pointerMock($scrollbarContainer)
        .start()
        .move(0, moveDistance)
        .down();

    const scrollable = $scrollable.dxScrollable('instance');
    const scrollOffset = (moveDistance / containerSize) * contentHeight - containerSize / 2;

    assert.roughEqual(scrollable.scrollOffset().top, scrollOffset, 0.5);

    pointer.move(0, 10);
    assert.roughEqual(scrollable.scrollOffset().top, scrollOffset + (10 / containerSize) * contentHeight, 0.5);
});

QUnit.test('scrollbar add active class when thumb is clicked', function(assert) {
    const SCROLLBAR_ACTIVE_CLASS = SCROLLABLE_SCROLLBAR_ACTIVE_CLASS;
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        scrollByThumb: true
    });

    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS);
    const $thumb = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);


    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, 'active class was not attached before mouse down on thumb');
    pointerMock($thumb).start().down();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), true, 'active class was attached after mouse down on thumb');

    pointerMock($('body')).start().up();
    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, 'active class was not attached after mouse up');
});

QUnit.test('scrollbar add active class when click on scrollbar area', function(assert) {
    const SCROLLBAR_ACTIVE_CLASS = SCROLLABLE_SCROLLBAR_ACTIVE_CLASS;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: 'onHover',
        scrollByThumb: true
    });

    const $scrollbar = $scrollable.find('.dx-scrollbar-vertical');
    const pointer = pointerMock($scrollbar)
        .start()
        .down();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), true, 'active class was attached after mouse down on scrollbar area');

    pointer.up();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, 'active class was removed after mouse up');
});

QUnit.test('useSimulatedScrollbar is false when useNative option set to true', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });

    assert.equal($scrollable.dxScrollable('option', 'useSimulatedScrollbar'), devices.real().platform === 'android', 'useSimulatedScrollbar should be false');
});

QUnit.test('useSimulatedScrollbar option dependence from useNative option', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true
    });

    $scrollable.dxScrollable('option', 'useNative', true);
    // NOTE: on android devices useSimulatedScrollbar is true always
    assert.equal($scrollable.dxScrollable('option', 'useSimulatedScrollbar'), devices.real().platform === 'android', 'useSimulatedScrollbar option was changed');
});

QUnit.test('scrollBar is not hoverable when scrollByThumb options is false', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollBar: 'onHover',
        scrollByThumb: false
    });

    const $scrollbar = $('.' + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    const $scroll = $scrollbar.find('.dx-scrollable-scroll');

    $scrollbar.trigger('mouseenter');

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'scrollbar is not hoverable');
});

QUnit.test('container size should be rounded to prevent unexpected scrollbar appearance', function(assert) {
    const scrollbar = new Scrollbar($('#scrollable'), {
        containerSize: 100.8,
        contentSize: 101
    });

    assert.ok(scrollbar.$element().is(':hidden'), 'scrollbar is not visible');
});

QUnit.test('content size should be rounded to prevent unexpected scrollbar appearance', function(assert) {
    const scrollbar = new Scrollbar($('#scrollable'), {
        containerSize: 100,
        contentSize: 100.4
    });

    assert.ok(scrollbar.$element().is(':hidden'), 'scrollbar is not visible');
});

QUnit.test('scrollbar should be hidden when container size is almost similar to content size when zooming', function(assert) {
    const scrollable = new Scrollable($('#scrollable'), {
        useNative: false
    });

    const dimension = 'height';
    const fakeContainerSizeWhenZoomIs125 = 404;
    const fakeContentSizeWhenZoomIs125 = 405;
    const fakeContentAndContainerSizeWhenZoomIs100 = 405;

    const scroller = scrollable._strategy._scrollers['vertical'];
    const scrollableContainerElement = scrollable.container();
    const scrollableContentElement = scrollable.content();

    sinon.stub(scrollableContainerElement, 'getBoundingClientRect').returns({ [dimension]: fakeContainerSizeWhenZoomIs125 });
    sinon.stub(scrollableContentElement, 'getBoundingClientRect').returns({ [dimension]: fakeContentSizeWhenZoomIs125 });
    sinon.stub(scroller, '_getBaseDimension').returns(fakeContentAndContainerSizeWhenZoomIs100);

    scrollable.update();

    assert.notOk(scroller._scrollbar._needScrollbar(), 'scrollbar is hidden');
});
