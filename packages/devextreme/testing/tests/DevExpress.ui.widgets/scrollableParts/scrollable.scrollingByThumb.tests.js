import $ from 'jquery';
import { getTranslateValues } from '__internal/ui/scroll_view/utils/get_translate_values';
import animationFrame from 'common/core/animation/frame';
import Scrollbar from '__internal/ui/scroll_view/m_scrollbar';
import pointerMock from '../../../helpers/pointerMock.js';
import Scrollable from 'ui/scroll_view/ui.scrollable';

import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
    SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
    SCROLLABLE_SCROLLBAR_ACTIVE_CLASS
} from './scrollable.constants.js';
// eslint-disable-next-line spellcheck/spell-checker
import { rerender as reRender } from 'inferno';

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

const moduleConfig = {
    beforeEach: function() {
        const markup = `
            <style nonce="qunit-test">
                #scrollable {
                    height: 50px;
                    width: 50px;
                }
                #scrollable .content1 {
                    height: 100px;
                    width: 100px;
                }
            </style>
            <div id="scrollable">
                <div class="content1"></div>
                <div class="content2"></div>
            </div>`;
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

const getScrollOffset = function($scrollable) {
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const location = getTranslateValues($content.get(0));

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module('scrolling by thumb', moduleConfig);

QUnit.test('normalize visibilityMode for scrollbar', function(assert) {
    if(isRenovatedScrollable) {
        // test not relevant for renovated scrollable
        assert.ok(true);
        return;
    }

    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: true,
        useNative: false
    });

    let scrollbar = Scrollbar.getInstance($('.' + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option('visibilityMode'), 'onScroll', 'true normalize to onScroll');

    $scrollable.dxScrollable('option', 'showScrollbar', false);

    scrollbar = Scrollbar.getInstance($('.' + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option('visibilityMode'), 'never', 'true normalize to onScroll');
});

QUnit.test('scroll by thumb', function(assert) {
    const containerHeight = 50;
    const contentHeight = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    const $thumb = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const mouse = pointerMock($thumb).start();
    let location;
    const distance = 10;
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const containerToContentRatio = (containerHeight / contentHeight);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('update');

    mouse.down();
    const downEvent = mouse.lastEvent();
    mouse.move(0, distance);
    location = getScrollOffset($scrollable);

    assert.strictEqual(downEvent.isDefaultPrevented(), true, 'default should be prevented (T1240632)');
    assert.equal(location.top, -distance / containerToContentRatio, 'scroll follows pointer');

    mouse.move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, -2 * distance / containerToContentRatio, 'scroll follows pointer everytime');
});

QUnit.test('scrollTo should scroll to correct position during scroll by thumb', function(assert) {
    const containerHeight = 50;
    const contentHeight = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    const $thumb = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const mouse = pointerMock($thumb).start();
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const instance = $scrollable.dxScrollable('instance');

    $container.height(containerHeight);
    $content.height(contentHeight);
    instance.update();

    mouse.down().move(0, 10);
    instance.scrollTo(30);

    assert.equal(instance.scrollTop(), 30, 'scroll has correct position');
});

QUnit.test('scroll by thumb without scrolling by content', function(assert) {
    const containerHeight = 50;
    const contentHeight = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        scrollByThumb: true,
        scrollByContent: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    const $thumb = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const mouse = pointerMock($thumb).start();
    const distance = 10;
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('update');

    mouse.down().move(0, distance);
    assert.notEqual(getScrollOffset($scrollable).top, 0, 'scroll follows pointer');
});

QUnit.test('scroll by thumb should prevent scrolling cross direction', function(assert) {
    const containerSize = 50;
    const contentSize = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        direction: 'both',
        scrollByThumb: true,
        scrollByContent: true,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    const $thumb = $scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS + ' .' + SCROLLABLE_SCROLL_CLASS);
    const mouse = pointerMock($thumb).start();
    const distance = 10;
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    $container
        .height(containerSize)
        .width(containerSize);
    $content
        .height(contentSize)
        .width(contentSize);
    $scrollable.dxScrollable('update');

    mouse.down().move(-distance, distance);
    assert.equal(getScrollOffset($scrollable).left, 0, 'horizontal scrolling prevented');
});

QUnit.test('thumb is visible on mouseenter when thumbMode=\'onHover\'', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'thumb is hidden after scrollable creation');

    $container.trigger('mouseenter');

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible after mouse enter');

    $container.trigger('mouseleave');
    reRender();

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'thumb is hidden after mouse leave');
});

QUnit.test('thumb is visible after update when content became more then container', function(assert) {
    const $scrollable = $('#scrollable').height(100);
    const $innerWrapper = $scrollable.wrapInner('<div>').children().height(50);

    $scrollable.dxScrollable({
        showScrollbar: 'onHover',
        useNative: false
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger('mouseenter');

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'thumb is hidden when content less then container');

    $innerWrapper.height(200);
    $scrollable.dxScrollable('update');

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible after update');
});

QUnit.test('showScrollbar: onHover, useNative: false, direction: vertical -> scaleRatio should be recalculated on mouseenter before scrollbar has been shown', function(assert) {
    const $scrollable = $('#scrollable').height(100);
    $scrollable.wrapInner('<div>').children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'onHover',
        useNative: false,
        direction: 'vertical',
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    const $container = $scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
    assert.equal($scroll.get(0).getBoundingClientRect().height, 50, 'real thumb size');
    assert.equal($scroll.height(), 46, 'thumb size');
    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'thumb is hidden');

    $scrollable.css('transform', 'scale(0.50)');
    $container.trigger('mouseenter');

    assert.equal($scroll.get(0).getBoundingClientRect().height, 25, 'real thumb size');
    assert.equal($scroll.height(), 46, 'thumb size');
    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible after mouseenter');
});

QUnit.test('thumb hide after scroll when showScrollbar = onScroll', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: 'onScroll',
        inertiaEnabled: false,
        useNative: false
    });

    const $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);
    const $scrollbar = $('.' + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    $scrollbar.trigger('mouseenter');
    pointerMock($content).start().wheel(1);

    this.clock.tick(500);

    assert.equal($scroll.hasClass('dx-state-invisible'), true, 'thumb is hidden');
});

QUnit.test('thumb stays visible after scroll when mouseEnter on scrollbar and scroll stopped', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    $container.trigger('mouseenter');
    pointerMock($container).start().wheel(1);

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible after mouse enter');
});

QUnit.test('thumb always visible when showScroll = always', function(assert) {
    const $scrollable = $('#scrollable').height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        inertiaEnabled: false,
        useNative: false
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible always');

    pointerMock($('.' + SCROLLABLE_CONTENT_CLASS, $scrollable)).start().wheel(1);

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible always');
});

QUnit.test('always visible class should be added when showScrollbar = always', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), true, 'class added');

    $scrollable.dxScrollable('option', 'showScrollbar', 'never');
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), false, 'class added');
});

QUnit.test('showScrollbar option change', function(assert) {
    const $scrollable = $('#scrollable').height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });

    $scrollable.dxScrollable('option', 'showScrollbar', 'never');

    const $scrollbar = $('.' + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);

    assert.equal($scrollbar.is(':hidden'), true);
    assert.equal($scrollbar.css('display'), 'none');
    assert.equal($scroll.hasClass('dx-state-invisible'), true);
});

QUnit.test('scrolling by thumb does not cause inertia', function(assert) {
    assert.expect(1);

    const containerHeight = 50;
    const contentHeight = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        scrollByThumb: true,
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, -2 * distance / containerToContentRatio, 'no inertia');
        }
    });

    $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS).height(contentHeight);

    const $thumb = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const mouse = pointerMock($thumb).start();
    const distance = 10;
    const containerToContentRatio = (containerHeight / contentHeight);

    $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS).height(containerHeight);

    $scrollable.dxScrollable('update');

    mouse
        .down()
        .move(0, distance)
        .wait(20)
        .move(0, distance)
        .up();
});

QUnit.test('thumb is visible on mouseenter when thumbMode=\'onHover\' only for single scrollable nested in another scrollable', function(assert) {
    const $scrollable = $('#scrollable');
    const $wrapScrollable = $scrollable.wrap('<div>').parent();

    $wrapScrollable.height(100);
    $scrollable.height(200);
    $scrollable.children().height(300);

    const scrollableOption = {
        useNative: false,
        showScrollbar: 'onHover'
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    const $scrollableContainer = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    const $wrapScrollableContainer = $('.' + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);
    const $scrollableScroll = $scrollableContainer.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $wrapScrollableScroll = $wrapScrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`).not($scrollableScroll);

    $wrapScrollableContainer.trigger('mouseenter');
    $scrollableContainer.trigger('mouseenter');

    reRender();
    assert.equal($scrollableScroll.hasClass('dx-state-invisible'), false, 'scrollbar is visible for inner scrollable');
    assert.equal($wrapScrollableScroll.hasClass('dx-state-invisible'), isRenovatedScrollable ? false : true, 'scrollbar visibility for outer scrollable');
});

QUnit.test('scroll by thumb does not hide scrollbar when mouse goes outside of scrollable', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        scrollByContent: true
    });

    const $scroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.trigger('mouseenter');

    pointerMock($container)
        .start()
        .down()
        .move(0, -1);

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'scrollbar is visible');

    $container.trigger('mouseleave');

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'scrollbar is visible after mouseleave');
});

QUnit.test('leaving inner scroller and releasing in outer scroller should hide inner scrollbar and show outer scrollbar', function(assert) {
    const $scrollable = $('#scrollable');
    const $wrapScrollable = $scrollable.wrap('<div>').parent();

    $wrapScrollable.height(100);
    $scrollable.height(200);
    $scrollable.children().height(300);

    const scrollableOption = {
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: 'onHover'
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    const $scrollableContainer = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    const $wrapScrollableContainer = $('.' + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);

    const $scrollableScroll = $scrollableContainer.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $wrapScrollableScroll = $wrapScrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`).not($scrollableScroll);

    // enter outer
    $wrapScrollableContainer.trigger('mouseenter');
    // enter inner
    $scrollableContainer.trigger('mouseenter');

    // start scrolling inner
    pointerMock($scrollableContainer).start().down().move(0, 10);
    // leaving inner
    $scrollableContainer.trigger($.Event('mouseleave', { relatedTarget: $wrapScrollableContainer.get(0) }));
    // up on outer
    pointerMock($wrapScrollableContainer).up();

    assert.equal($scrollableScroll.hasClass('dx-state-invisible'), true, 'scrollbar is hidden for inner scrollable');
    assert.equal($wrapScrollableScroll.hasClass('dx-state-invisible'), false, 'scrollbar is visible for outer scrollable');
});

QUnit.test('scrollbar is visible for parent scrollable after mouse leave for children scrollable', function(assert) {
    const $scrollable = $('#scrollable').height(250);
    const $childScrollable = $('<div>').height(500);

    $childScrollable.append('<div>').children().height(750);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'vertical'
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'vertical'
    });

    const $parentContainer = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS).eq(0);
    const $childrenContainer = $childScrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event('mouseenter', { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event('mouseenter', { originalEvent: { target: $childrenContainer.get(0) } }));
    reRender();

    const $childrenScroll = $childScrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $parentScroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`).not($childrenScroll);

    assert.equal($parentScroll.hasClass('dx-state-invisible'), isRenovatedScrollable ? false : true, 'parent scrollbar visibility');
    assert.equal($childrenScroll.hasClass('dx-state-invisible'), false, 'children scrollbar is visible');

    $childScrollable.triggerHandler($.Event('mouseleave', { relatedTarget: $parentContainer.get(0) }));
    reRender();

    assert.equal($parentScroll.hasClass('dx-state-invisible'), false, 'parent scrollbar is visible');
    assert.equal($childrenScroll.hasClass('dx-state-invisible'), true, 'children scrollbar is hidden');
});

QUnit.test('scrollbar is visible for parent scrollable after start', function(assert) {
    const $scrollable = $('#scrollable').height(25);
    const $childScrollable = $('<div>').height(50);

    $childScrollable.append('<div>').children().height(75);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'vertical'
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'vertical'
    });

    const $parentContainer = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS).eq(0);
    const $childrenContainer = $childScrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event('mouseenter', { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event('mouseenter', { originalEvent: { target: $childrenContainer.get(0) } }));
    pointerMock($childrenContainer).start().down().move(0, 10);

    $childrenContainer.trigger($.Event('mouseleave', { originalEvent: { target: $childrenContainer.get(0) } }));

    const $childrenScroll = $childScrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`);
    const $parentScroll = $scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .dx-scrollable-scroll`).not($childrenScroll);

    assert.equal($parentScroll.hasClass('dx-state-invisible'), isRenovatedScrollable ? false : true, 'parent scrollbar is hidden');
    assert.equal($childrenScroll.hasClass('dx-state-invisible'), false, 'children scrollbar is visible');
});

QUnit.test('scrollbar set active state only for one scrollable when direction of parentScrollable is horizontal and direction of innerScrollable is vertical', function(assert) {
    const $scrollable = $('#scrollable').height(25);
    const $childScrollable = $('<div>').height(50).appendTo($scrollable);
    $childScrollable.append('<div>').children().height(75);
    $childScrollable.dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'vertical'
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        direction: 'horizontal'
    });

    const $childScrollbar = $childScrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS);
    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).not($childScrollbar);

    pointerMock($childScrollable).start()
        .down()
        .up();

    assert.equal($childScrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, 'child scrollbar has not active state');
    assert.equal($scrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, 'scrollbar has not active state');
});
