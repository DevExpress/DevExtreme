import $ from 'jquery';
import { getTranslateValues } from '__internal/ui/scroll_view/utils/get_translate_values';
import { getElementOverflowY, getElementOverflowX } from '__internal/ui/scroll_view/utils/get_element_style';
import { getScrollbarSize } from '__internal/ui/scroll_view/utils/get_scrollbar_size';
import resizeCallbacks from 'core/utils/resize_callbacks';
import config from 'core/config';
import pointerMock from '../../../helpers/pointerMock.js';
import { isRenderer } from 'core/utils/type';
import browser from 'core/utils/browser';
import Scrollable from 'ui/scroll_view/ui.scrollable';

import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
    SCROLLABLE_SCROLLBARS_HIDDEN,
    SCROLLABLE_DISABLED_CLASS,
} from './scrollable.constants.js';

import {
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL,
    DIRECTION_BOTH,
    SCROLLABLE_WRAPPER_CLASS
} from '__internal/ui/scroll_view/consts.js';


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
    },
    afterEach: function() {
        this.clock.restore();
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

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

QUnit.module('api', moduleConfig);

[true, false].forEach((useNative) => {
    QUnit.test('Check that widget is renovated or not', function(assert) {
        const scrollable = $('#scrollable').dxScrollable({
            useNative
        }).dxScrollable('instance');

        assert.strictEqual(scrollable.isRenovated(), !!Scrollable.IS_RENOVATED_WIDGET);
    });
});

QUnit.test('scroll event should be triggered if scroll position changed', function(assert) {
    let called = 0;
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'both'
    });
    const $content = $scrollable.find('.content1');

    $scrollable.dxScrollable('scrollTo', { top: 50, left: 50 });

    return new Promise(function(resolve) {
        $scrollable.dxScrollable('option', 'onScroll', function() {
            assert.ok(++called <= 2, 'scroll was fired on height change');
            resolve();
        });
        $content.height(50);
    }).then(function() {
        return new Promise(function(resolve) {
            $scrollable.dxScrollable('option', 'onScroll', function() {
                assert.ok(++called >= 2, 'scroll was fired on width change');
                resolve();
            });
            $content.width(50);
        });
    });
});

[true, false].forEach((useNative) => {
    QUnit.test(`content(), useNative: ${useNative}`, function(assert) {
        const $scrollable = $('#scrollable').dxScrollable({ useNative });
        const content = $scrollable.dxScrollable('instance').content();

        assert.equal(isRenderer(content), !!config().useJQuery, 'content is correct');
        assert.ok($(content).hasClass(SCROLLABLE_CONTENT_CLASS), 'returns content');
    });

    QUnit.test(`container(), useNative: ${useNative}`, function(assert) {
        const $scrollable = $('#scrollable').dxScrollable({ useNative });
        const container = $scrollable.dxScrollable('instance').container();

        assert.equal(isRenderer(container), !!config().useJQuery, 'container is correct');
        assert.ok($(container).hasClass(SCROLLABLE_CONTAINER_CLASS), 'returns container');
    });

    QUnit.test(`scrollBy with plain object: { left: value; top: value}, useNative: ${useNative}`, function(assert) {
        assert.expect(2);

        const distance = 10;
        const $scrollable = $('#scrollable').dxScrollable({
            useNative,
            onEnd: function() {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, 'scroll to correctly vertical position');
                assert.equal(location.left, 0, 'scroll to correctly horizontal position');
            }
        });
        const scrollable = $scrollable.dxScrollable('instance');

        scrollable.scrollBy({ left: distance, top: distance });

        if(useNative) {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, -distance, 'scroll to correctly vertical position');
            assert.equal(location.left, isRenovatedScrollable ? 0 : -distance, 'scroll to correctly horizontal position');
        }
    });

    QUnit.test(`scrollBy with plain object: { x: value; y: value}, useNative: ${useNative}`, function(assert) {
        assert.expect(2);

        const distance = 10;
        const $scrollable = $('#scrollable').dxScrollable({
            useNative,
            onEnd: function() {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, 'scroll to correctly vertical position');
                assert.equal(location.left, 0, 'scroll to correctly horizontal position');
            }
        });
        const scrollable = $scrollable.dxScrollable('instance');

        scrollable.scrollBy({ x: distance, y: distance });

        if(useNative) {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, -distance, 'scroll to correctly vertical position');
            assert.equal(location.left, isRenovatedScrollable ? 0 : -distance, 'scroll to correctly horizontal position');
        }
    });
});

QUnit.test('scrollBy with numeric', function(assert) {
    const distance = 10;
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, -distance, 'scroll to correctly vertical position');
            assert.equal(location.left, 0, 'scroll to correctly horizontal position');
        }
    });
    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy actions', function(assert) {
    let started = 0;
    let scrolled = 0;
    let ended = 0;
    const completed = $.Deferred();
    const distance = 10;
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        },
        onScroll: function() {
            scrolled++;
        },
        onEnd: function() {
            ended++;
            completed.resolve();
        }
    });
    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
    completed.done(function() {
        assert.equal(started, 1, 'start action should be fired once');
        assert.equal(scrolled, 1, 'scroll action should be fired once');
        assert.equal(ended, 1, 'end action should be fired once');
    });
});

QUnit.test('scrollBy to location', function(assert) {
    const distance = 10;
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy to location with dynamic content', function(assert) {
    this.clock.restore();

    const distance = 10;
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').empty().dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    $content.append($('<div>').height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

// T389058
QUnit.test('scrollBy to location with dynamic content if auto update is prevented', function(assert) {
    const distance = 10;
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').empty().dxScrollable({
        useNative: false,
        updateManually: true,
        onEnd: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, isRenovatedScrollable ? -20 : 0, 'vertical location set correctly');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    $content.append($('<div>').height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollTo to location', function(assert) {
    const distance = 10;
    let actionFiredCount = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            actionFiredCount++;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo(distance);
    scrollable.scrollTo(distance);

    assert.equal(actionFiredCount, 1, 'action was fired only one time');
});

QUnit.test('scrollTo to location with dynamic content', function(assert) {
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').empty().append($('<div>').height(150)).dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.roughEqual(location.top, -50, 1.01, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    scrollable.scrollTo(100);
    $content.empty().append($('<div>').height(101));

    scrollable.scrollTo(50);
});


QUnit.test('scrollOffset', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    pointerMock($content)
        .start()
        .down()
        .move(0, -10);

    assert.deepEqual($scrollable.dxScrollable('scrollOffset'), { top: 10, left: 0 }, 'scrollOffset is correct');
});

QUnit.test('scrollLeft', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: DIRECTION_HORIZONTAL
    });
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    pointerMock($content)
        .start()
        .down()
        .move(-10, 0);

    assert.equal($scrollable.dxScrollable('scrollLeft'), 10, 'scrollLeft is correct');
});

QUnit.test('scrollTop', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

    pointerMock($content)
        .start()
        .down()
        .move(0, -10);

    assert.equal($scrollable.dxScrollable('scrollTop'), 10, 'scrollTop is correct');
});

QUnit.test('scrollbar hidden while scrolling when showScrollbar is never', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'never'
    });

    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal($scrollbar.is(':hidden'), true, 'scrollbar is hidden');
});

QUnit.test('showScrollbar: never -> onScroll, useNative: true, useSimulatedScrollbar: true, should add dx-scrollable-scrollbars-hidden class', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        showScrollbar: 'never',
        useSimulatedScrollbar: true,
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true);

    $scrollable.dxScrollable('option', 'showScrollbar', 'onScroll');

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false);
});

QUnit.test('showScrollbar: never -> onScroll, useNative: false, should not add dx-scrollable-scrollbars-hidden class', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'never'
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false);

    $scrollable.dxScrollable('option', 'showScrollbar', 'onScroll');

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false);
});

QUnit.test('event arguments', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function(e) {
            assert.notEqual(e.event, undefined, 'Event passed');
            assert.deepEqual(e.scrollOffset, { top: 10, left: isRenovatedScrollable ? 0 : undefined }, 'scrollOffset passed');
            assert.equal(e.reachedLeft, undefined, 'reachedLeft passed');
            assert.equal(e.reachedRight, undefined, 'reachedRight passed');
            assert.equal(e.reachedTop, false, 'reachedTop passed');
            assert.equal(e.reachedBottom, false, 'reachedBottom passed');
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();
    const distance = -10;

    mouse
        .down()
        .move(0, distance)
        .up();
});

QUnit.test('disabled: scroll was not moved when disabled is true', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        disabled: true
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();
    const distance = -10;

    mouse.down().move(0, distance);
    const location = getScrollOffset($scrollable);
    assert.equal(location.top, 0, 'scroll was not moved when disabled is true');
    mouse.up();
});

QUnit.test('simulated strategy should subscribe to the poiner events after disabled option changed', function(assert) {
    const $scrollable = $('#scrollable');
    const scrollableInstance = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        disabled: true
    }).dxScrollable('instance');

    scrollableInstance.option('disabled', false);

    const $scroll = $scrollable.find(`.${SCROLLABLE_SCROLLBAR_CLASS} .dx-scrollable-scroll`);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger('mouseenter');

    assert.equal($scroll.hasClass('dx-state-invisible'), false, 'thumb is visible after mouse enter');
});

QUnit.test('disabled option add class to root element', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), false, 'scrollable have not disabled class');

    $scrollable.dxScrollable('option', 'disabled', true);

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), true, 'scrollable have disabled class');
});

QUnit.test('changing option showScrollbar does not duplicate scrollbar', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: 'onScroll'
    });

    $scrollable.dxScrollable('option', 'showScrollbar', 'never');

    const $scrollbars = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbars.length, 1, 'scrollbar is not duplicated');
});

QUnit.test('switching useNative to false turns off native scrolling', function(assert) {
    const scrollable = $('#scrollable').dxScrollable({
        useNative: true
    }).dxScrollable('instance');

    let containerEl = $(scrollable.container()).get(0);
    assert.equal(getElementOverflowX(containerEl), 'hidden');
    assert.equal(getElementOverflowY(containerEl), 'auto');

    scrollable.option('useNative', false);

    containerEl = $(scrollable.container()).get(0);
    assert.equal(getElementOverflowX(containerEl), 'hidden');
    assert.equal(getElementOverflowY(containerEl), 'hidden');
});

QUnit.test('event handlers should be reattached after changing to simulated strategy ', function(assert) {
    if(QUnit.urlParams['nojquery']) {
        assert.ok(true);
    } else {
        const $scrollable = $('#scrollable').dxScrollable({
            useNative: true
        });

        const scrollable = $scrollable.dxScrollable('instance');

        let wrapperEl = $scrollable.find(`.${SCROLLABLE_WRAPPER_CLASS}`).get(0);

        let eventListeners = Object.values($._data(wrapperEl).events || {});

        assert.equal(eventListeners.length, isRenovatedScrollable ? 4 : 6, 'event listeners');
        eventListeners.forEach((event) => {
            assert.equal(event.length, 1, 'event handler');
        });

        scrollable.option('useNative', false);

        wrapperEl = $scrollable.find(`.${SCROLLABLE_WRAPPER_CLASS}`).get(0);

        eventListeners = Object.values($._data(wrapperEl).events || {});

        assert.equal(eventListeners.length, isRenovatedScrollable ? 7 : 6, 'event listeners');
        eventListeners.forEach((event) => {
            assert.equal(event.length, 1, 'event handler');
        });
    }
});

QUnit.test('event handlers should be reattached after changing to native strategy ', function(assert) {
    if(QUnit.urlParams['nojquery']) {
        assert.ok(true);
    } else {
        const $scrollable = $('#scrollable').dxScrollable({
            useNative: false
        });

        const scrollable = $scrollable.dxScrollable('instance');

        let wrapperEl = $scrollable.find(`.${SCROLLABLE_WRAPPER_CLASS}`).get(0);

        let eventListeners = Object.values($._data(wrapperEl).events || {});

        assert.equal(eventListeners.length, isRenovatedScrollable ? 7 : 6, 'event listeners');

        eventListeners.forEach((event) => {
            assert.equal(event.length, 1, 'event handler');
        });

        scrollable.option('useNative', true);

        wrapperEl = $scrollable.find(`.${SCROLLABLE_WRAPPER_CLASS}`).get(0);

        eventListeners = Object.values($._data(wrapperEl).events || {});

        assert.equal(eventListeners.length, isRenovatedScrollable ? 4 : 6, 'event listeners');
        eventListeners.forEach((event) => {
            assert.equal(event.length, 1, 'event handler');
        });
    }
});


QUnit.test('scrollToElement', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>').height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item.get(0));

    assert.roughEqual(scrollable.scrollTop(), $wrapper.height() + $item.outerHeight() - scrollable.clientHeight(), 0.5);
});

QUnit.test('getScrollElementPosition', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $item = $('<div>').height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const position = scrollable.getScrollElementPosition($item, DIRECTION_VERTICAL);

    assert.equal(position, $item.offset().top - $scrollable.offset().top - $item.height());
});

QUnit.test('scrollToElement when item height is greater than scroll height', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>').height(100).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item.get(0));

    assert.equal(scrollable.scrollTop(), $wrapper.height());
});

QUnit.test('scrollToElement with offset', function(assert) {
    const bottomOffset = 70;
    const $scrollable = $('#scrollable').empty().height(100);
    const $item1 = $('<div>').height(50).appendTo($scrollable);
    const $item2 = $('<div>').height(50).appendTo($scrollable);

    $('<div>').height(150).appendTo($scrollable);

    const scrollable = $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    }).dxScrollable('instance');

    scrollable.scrollToElement($item2, { bottom: bottomOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight());
});

QUnit.test('scrollToElement with offset in opposite direction', function(assert) {
    const topOffset = 30;
    const $scrollable = $('#scrollable').empty().height(100);
    const $item1 = $('<div>').height(50).appendTo($scrollable);
    const $item2 = $('<div>').height(50).appendTo($scrollable);

    $('<div>').height(1500).appendTo($scrollable);

    const scrollable = $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    }).dxScrollable('instance');

    scrollable.scrollTo(200);
    scrollable.scrollToElement($item2, { top: topOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight() - topOffset);
});

QUnit.test('scrollToElement with absolute position in the container(T162489)', function(assert) {
    const $scrollable = $('#scrollable');
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>', {
        css: {
            position: 'absolute',
            top: 50
        }
    }).height(100).append($('<div/>')).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo(50);
    scrollable.scrollToElement($item.children().eq(0));

    assert.equal(scrollable.scrollTop(), $wrapper.height() - scrollable.clientHeight());
});

QUnit.test('scrollToElement does not scroll to element when element is not child of scrollable', function(assert) {
    const $scrollable = $('#scrollable');
    const $item = $('<div>').height(500).insertAfter($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0, 'scrollable was not scrolled');
});

QUnit.test('scrollToElement scrolls to bottom position of element when scroll scrollTop less than element position.top', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>').height(100).appendTo($scrollable);
    const $spaceItem = $('<div>').height(500).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollTo($wrapper.height() + $item.height() + $spaceItem.height());
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), $wrapper.outerHeight() + $item.outerHeight() - scrollable.clientHeight());
});

QUnit.test('scrollToElement does not scroll when element is placed in visible area', function(assert) {
    const $scrollable = $('#scrollable').height(30);
    const $item = $('<div>').height(10).prependTo($scrollable);

    $('<div>').height(30).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollTo(30);
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 30);
});

QUnit.test('scrollToElement does not scroll when element is placed in visible area and greater than visible area', function(assert) {
    const $scrollable = $('#scrollable').height(30);
    const $item = $('<div>').height(50).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: DIRECTION_VERTICAL
    });

    const scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0);
});

QUnit.test('scrollToElement scrolls in both directions', function(assert) {
    const topPosition = 30;
    const leftPosition = 50;
    const itemSize = 30;

    const $scrollable = $('#scrollable').width(50).height(50).css('position', 'relative');

    $scrollable.wrapInner('<div>').children().eq(0).width(200).height(200);

    const $item = $('<div>').css({
        width: itemSize + 'px',
        height: itemSize + 'px',
        position: 'absolute',
        top: topPosition + 'px',
        left: leftPosition + 'px'
    }).appendTo($scrollable);

    const scrollable = $scrollable.dxScrollable({
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollToElement($item);
    assert.roughEqual(scrollable.scrollTop(), topPosition + itemSize - scrollable.clientHeight(), 1, 'scrollable was scrolled by vertical');
    assert.roughEqual(scrollable.scrollLeft(), leftPosition + itemSize - scrollable.clientWidth(), 1, 'scrollable was scrolled by horizontal');
});

QUnit.test('scrollTo should not reset unused position', function(assert) {
    const contentWidth = 1000;
    const containerWidth = 100;
    const $scrollable = $('#scrollable').width(containerWidth);

    $scrollable.wrapInner('<div>').children().width(contentWidth);

    const scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollTo({ left: containerWidth, top: 10 });
    scrollable.scrollTo({ top: 40 });
    assert.equal(scrollable.scrollLeft(), containerWidth, 'left position was not reset');
    assert.equal(scrollable.scrollTop(), 40, 'top position set');
});

QUnit.test('_onVisibilityChanged option should allow to set custom position', function(assert) {
    const scrollPosition = 42;
    const $scrollable = $('#scrollable');

    $scrollable.wrapInner('<div>').children();

    const scrollable = $scrollable.dxScrollable({
        useNative: false,
        _onVisibilityChanged: (instance) => {
            instance.scrollTo(scrollPosition);
        }
    }).dxScrollable('instance');

    scrollable.scrollTo(99);
    $scrollable.trigger('dxhiding');
    $scrollable.trigger('dxshown');

    assert.strictEqual(scrollable.scrollTop(), scrollPosition, 'top position set');
});

[true, false].forEach((useNative) => {
    [DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, DIRECTION_BOTH].forEach((direction) => {
        let scrollToValue = 40;

        if(direction === DIRECTION_HORIZONTAL) {
            scrollToValue = { left: 40 };
        }

        if(direction === DIRECTION_VERTICAL) {
            scrollToValue = { top: 40 };
        }

        QUnit.test(`scrollTo(${JSON.stringify(scrollToValue)}), update scrollOffset value after resize, useNative: ${useNative}, dir: ${direction}`, function(assert) {
            const contentSize = 1000;
            const containerSize = 100;
            const $scrollable = $('#scrollable').width(containerSize).height(containerSize);
            $scrollable.wrapInner('<div>').children().width(contentSize).height(contentSize);

            const scrollable = $scrollable.dxScrollable({
                useNative,
                direction,
            }).dxScrollable('instance');

            // for IOS with min-height: 101% style
            $(scrollable.content()).css({ minHeight: '100%' });

            scrollable.scrollTo(scrollToValue);

            const expectedTopOffsetValue = direction !== DIRECTION_HORIZONTAL ? 40 : 0;
            const expectedLeftOffsetValue = direction !== DIRECTION_VERTICAL ? 40 : 0;
            assert.deepEqual(scrollable.scrollOffset(), {
                top: expectedTopOffsetValue,
                left: expectedLeftOffsetValue,
            }, 'scrollOffset()');
            assert.strictEqual(scrollable.scrollTop(), expectedTopOffsetValue, 'scrollTop()');
            assert.strictEqual(scrollable.scrollLeft(), expectedLeftOffsetValue, 'scrollLeft()');

            $('#scrollable').width(500).height(500);
            resizeCallbacks.fire();

            assert.deepEqual(scrollable.scrollOffset(), {
                top: expectedTopOffsetValue,
                left: expectedLeftOffsetValue,
            }, 'scrollOffset()');
            assert.strictEqual(scrollable.scrollTop(), expectedTopOffsetValue, 'scrollTop()');
            assert.strictEqual(scrollable.scrollLeft(), expectedLeftOffsetValue, 'scrollLeft()');

            $('#scrollable').width(1000).height(1000);
            resizeCallbacks.fire();

            assert.deepEqual(scrollable.scrollOffset(), {
                top: 0,
                left: 0,
            }, 'scrollOffset()');
            assert.strictEqual(scrollable.scrollTop(), 0, 'scrollTop()');
            assert.strictEqual(scrollable.scrollLeft(), 0, 'scrollLeft()');
        });
    });
});

class ScrollableTestHelper {
    constructor(options) {
        const { useNative, direction, useSimulatedScrollbar, rtlEnabled } = options;
        this.onScrollHandler = sinon.spy();
        this._useNative = useNative;
        this._direction = direction;
        this._rtlEnabled = rtlEnabled;
        this._useSimulatedScrollbar = useSimulatedScrollbar;
        this.$scrollable = $('#scrollable');
        this.scrollable = this._getScrollable();
        this.$container = $(this.scrollable.container());
    }

    _getScrollable() {
        return this.$scrollable.dxScrollable({
            useNative: this._useNative,
            useSimulatedScrollbar: this._useSimulatedScrollbar,
            direction: this._direction,
            rtlEnabled: this._rtlEnabled,
            showScrollbar: 'always',
            onScroll: this.onScrollHandler
        }).dxScrollable('instance');
    }

    getMaxScrollOffset() {
        const containerElement = this.$container.get(0);
        const maxVerticalOffset = containerElement.scrollHeight - containerElement.clientHeight;
        const maxHorizontalOffset = containerElement.scrollWidth - containerElement.clientWidth;

        return {
            vertical: maxVerticalOffset,
            horizontal: maxHorizontalOffset
        };
    }

    getScrollbarSize(direction) {
        return getScrollbarSize(this.$container.get(0), direction);
    }

    checkScrollEvent(options) {
        const scrollArguments = this.onScrollHandler.lastCall.args[0];

        QUnit.assert.equal(scrollArguments.reachedTop, options.reachedTop, 'reachedTop');
        QUnit.assert.equal(scrollArguments.reachedBottom, options.reachedBottom, 'reachedBottom');
        QUnit.assert.equal(scrollArguments.reachedLeft, options.reachedLeft, 'reachedLeft');
        QUnit.assert.equal(scrollArguments.reachedRight, options.reachedRight, 'reachedRight');
    }

    checkScrollTranslateValues({ vertical, horizontal }) {
        if(!this._useNative || (this._useNative && this._useSimulatedScrollbar)) {

            const checkTranslateValues = ({ vertical, horizontal }) => {
                if(this._direction === DIRECTION_VERTICAL || this._direction === 'both') {
                    const $scroll = this.$scrollable.find(`.${SCROLLBAR_VERTICAL_CLASS} .${SCROLLABLE_SCROLL_CLASS}`);
                    const { left, top } = getTranslateValues($scroll.get(0));

                    QUnit.assert.strictEqual(left, 0, 'translate left');
                    QUnit.assert.roughEqual(top, vertical, 1.001, 'translate top');
                }

                if(this._direction === DIRECTION_HORIZONTAL || this._direction === 'both') {
                    const $scroll = this.$scrollable.find(`.${SCROLLBAR_HORIZONTAL_CLASS} .${SCROLLABLE_SCROLL_CLASS}`);
                    const { left, top } = getTranslateValues($scroll.get(0));

                    QUnit.assert.roughEqual(left, horizontal, 1.001, 'translate left');
                    QUnit.assert.strictEqual(top, 0, 'translate top');
                }
            };

            if(this._useNative && this._useSimulatedScrollbar) {
                this.scrollable.update();
                this.$container.trigger('scroll');
            }

            checkTranslateValues({ vertical, horizontal });
        }
    }

    checkScrollOffset({ left, top, maxScrollOffset, epsilon = 0.001 }, message) {
        const scrollOffset = getScrollOffset(this.$scrollable);

        QUnit.assert.roughEqual(this.getMaxScrollOffset().horizontal, maxScrollOffset, epsilon, 'horizontal maxScrollOffset');

        let expectedScrollOffsetLeft = left;

        if(this._useNative && this._rtlEnabled) {
            expectedScrollOffsetLeft = left - this.getMaxScrollOffset().horizontal;

            if(browser.msie && browser.version < 12) {
                expectedScrollOffsetLeft = Math.abs(expectedScrollOffsetLeft);
            }
        }

        QUnit.assert.roughEqual(-scrollOffset.left, expectedScrollOffsetLeft, epsilon, 'scrollOffset.left');
        QUnit.assert.roughEqual(-scrollOffset.top, top, epsilon, 'scrollOffset.top');
        QUnit.assert.roughEqual(this.scrollable.scrollLeft(), left, epsilon, message || 'scrollable.scrollLeft()');
        QUnit.assert.roughEqual(this.scrollable.scrollTop(), top, epsilon, 'scrollable.scrollTop()');
    }

    setContainerWidth(width) {
        this.$scrollable.css('width', width);

        if(!isRenovatedScrollable) {
            resizeCallbacks.fire();
        }
    }
}


[true, false].forEach((useNative) => {
    [true, false].forEach((useSimulatedScrollbar) => {
        // T947463
        QUnit.module(`ScrollToElement, native: ${useNative}, useSimulateScrollbar: ${useSimulatedScrollbar}`, moduleConfig, () => {
            const elementHeight = 20;
            const elementWidth = 30;
            const elementOffset = { top: 100, left: 100 };

            const setInitialState = () => {
                $('.content1').css({ width: 0, height: 0 });
                $('.content2').css({ width: 200, height: 200, position: 'relative' });
                $('<div id="element"></div>').css({ position: 'absolute', width: elementWidth, height: elementHeight }).appendTo($('.content2'));
            };

            [DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, 'both'].forEach((direction) => {
                QUnit.test(`Scroll from top to bottom, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top });
                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL) : 0;

                    helper.checkScrollOffset({ left: 0, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 16, horizontal: 0 });
                });

                QUnit.test(`Scroll from left to right, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ left: elementOffset.left });
                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL) : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: 0, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 0, horizontal: 18 });
                });

                QUnit.test(`Scroll from bottom to top, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top });
                    helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical });
                    helper.scrollable.update();

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? elementOffset.top : 0;

                    helper.checkScrollOffset({ left: 0, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 23, horizontal: 0 });
                });

                QUnit.test(`Scroll from right to left, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ left: elementOffset.left });
                    helper.scrollable.scrollTo({ left: helper.getMaxScrollOffset().horizontal });
                    helper.scrollable.update();

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? elementOffset.left : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: 0, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 0, horizontal: 23 });
                });

                QUnit.test(`Scroll from left-top to right-bottom, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL) : 0;
                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL) : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 16, horizontal: 18 });
                });

                QUnit.test(`Scroll from left-bottom to right-top, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                    helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical });
                    helper.scrollable.update();

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? elementOffset.top : 0;
                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL) : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 23, horizontal: 18 });
                });

                QUnit.test(`Scroll from right-bottom to left-top, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                    helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical, left: helper.getMaxScrollOffset().horizontal });
                    helper.scrollable.update();

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? elementOffset.top : 0;
                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? elementOffset.left : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 23, horizontal: 23 });
                });

                QUnit.test(`Scroll from right-top to left-bottom, direction: ${direction}, rtlEnabled: false`, function() {
                    setInitialState();
                    const helper = new ScrollableTestHelper({ direction, useNative, useSimulatedScrollbar, rtlEnabled: false });

                    const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                    helper.scrollable.scrollTo({ left: helper.getMaxScrollOffset().horizontal });
                    helper.scrollable.update();

                    helper.scrollable.scrollToElement($element);
                    helper.scrollable.update();

                    const expectedTopOffset = direction !== DIRECTION_HORIZONTAL ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL) : 0;
                    const expectedLeftOffset = direction !== DIRECTION_VERTICAL ? elementOffset.left : 0;

                    helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                    helper.checkScrollTranslateValues({ vertical: 16, horizontal: 23 });
                });
            });

            QUnit.test(`Scroll from left to right, bottom border on scrollbar, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, direction: both, rtlEnabled: false`, function() {
                setInitialState();
                const helper = new ScrollableTestHelper({ direction: 'both', useNative, useSimulatedScrollbar, rtlEnabled: false });

                helper.scrollable.scrollTo({ top: helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL) / 2 });
                helper.scrollable.update();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedLeftOffset = helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL);
                const expectedTopOffset = helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL);

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                helper.checkScrollTranslateValues({ vertical: 16, horizontal: 18 });
            });

            QUnit.test(`Scroll from top to bottom, right border on scrollbar, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, direction: both, rtlEnabled: false`, function() {
                setInitialState();
                const helper = new ScrollableTestHelper({ direction: 'both', useNative, useSimulatedScrollbar, rtlEnabled: false });

                helper.scrollable.scrollTo({ left: helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL) / 2 });
                helper.scrollable.update();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });
                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedLeftOffset = helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize(DIRECTION_VERTICAL);
                const expectedTopOffset = helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize(DIRECTION_HORIZONTAL);

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
                helper.checkScrollTranslateValues({ vertical: 16, horizontal: 18 });
            });
        });

        QUnit.module(`ScrollPosition after update(), native: ${useNative}`, moduleConfig, () => {
            QUnit.test(`direction: horizontal, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtl: false -> scrollTo(left: center) -> scrollTo(left: max)`, function() {
                const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, useSimulatedScrollbar, rtlEnabled: false });

                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });

                helper.scrollable.update();
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });

                helper.scrollable.scrollTo({ left: 25 });
                helper.scrollable.update();
                helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 12 });

                helper.scrollable.scrollTo({ left: 50 });
                helper.scrollable.update();
                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 25 });
            });

            QUnit.test(`direction: horizontal, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtl: true -> scrollTo(left: center) -> scrollTo(left: 0)`, function() {
                const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, useSimulatedScrollbar, rtlEnabled: true });

                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 25 });

                helper.scrollable.update();
                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 25 });

                helper.scrollable.scrollTo({ left: 25 });
                helper.scrollable.update();
                helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 12 });

                helper.scrollable.scrollTo({ left: 0 });
                helper.scrollable.update();
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });
            });

            QUnit.test(`Change content size, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, direction: horizontal, rtl: false -> change content size`, function() {
                const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, useSimulatedScrollbar, rtlEnabled: false });

                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });

                helper.$scrollable.find('.content1').css('width', '200px');
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 150 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });

                helper.scrollable.update();
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 150 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 0 });
            });

            QUnit.test(`direction: horizontal, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtl: true -> change content size`, function() {
                const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, useSimulatedScrollbar, rtlEnabled: true });

                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: 25 });

                helper.$scrollable.find('.content1').css('width', '200px');
                helper.checkScrollOffset({ left: useNative ? 150 : 50, top: 0, maxScrollOffset: 150 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: !useNative ? 25 : 35 });

                helper.scrollable.update();
                helper.checkScrollOffset({ left: useNative || isRenovatedScrollable ? 150 : 50, top: 0, maxScrollOffset: 150 });
                helper.checkScrollTranslateValues({ vertical: 0, horizontal: !useNative && !isRenovatedScrollable ? 12 : 35 });
            });
        });

        QUnit.module(`ScrollPosition after resize, rtl: true, useNative: ${useNative}`, {
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
            }
        }, () => {
            [0, 10, 20].forEach(scrollRight => {
                QUnit.test(`Direction: horizontal, useSimulatedScrollbar: ${useSimulatedScrollbar}, initialScrollPosition(Right - ${scrollRight}), css.zoomIn -> css.zoomOut`, function() {
                    const helper = new ScrollableTestHelper({
                        direction: DIRECTION_HORIZONTAL,
                        useNative,
                        useSimulatedScrollbar,
                        rtlEnabled: true
                    });
                    const maxOffset = helper.getMaxScrollOffset();
                    helper.scrollable.scrollTo({ left: maxOffset.horizontal - scrollRight });
                    helper.scrollable.update();
                    [1, 1.1, 1].forEach(zoomLevel => {
                        helper.scrollable._getWindowDevicePixelRatio = () => zoomLevel;
                        helper.scrollable.$element().css('zoom', zoomLevel);

                        helper.checkScrollOffset({ left: 50 - scrollRight, top: 0, maxScrollOffset: 50, epsilon: 1.1 });
                        helper.checkScrollTranslateValues({ vertical: 0, horizontal: (50 - scrollRight) * 0.5 });
                    });
                });

                QUnit.test(`Direction: horizontal, useSimulatedScrollbar: ${useSimulatedScrollbar}, initialScrollPosition(Left: ${scrollRight}), css.zoomIn -> css.zoomOut`, function() {
                    const helper = new ScrollableTestHelper({
                        direction: DIRECTION_HORIZONTAL,
                        useNative,
                        useSimulatedScrollbar,
                        rtlEnabled: true
                    });

                    helper.scrollable.scrollTo({ left: scrollRight });
                    helper.scrollable.update();
                    [1, 1.1, 1].forEach(zoomLevel => {
                        helper.scrollable._getWindowDevicePixelRatio = () => zoomLevel;
                        helper.scrollable.$element().css('zoom', zoomLevel);

                        helper.checkScrollOffset({ left: scrollRight, top: 0, maxScrollOffset: 50, epsilon: 1.1 });
                        helper.checkScrollTranslateValues({ vertical: 0, horizontal: scrollRight * 0.5 });
                    });
                });
            });

            QUnit.test(`Direction: horizontal, rtl: true, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: true, scroll save the max right position when width of window was changed`, function(assert) {
                const clock = sinon.useFakeTimers();

                try {
                    const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, useSimulatedScrollbar, rtlEnabled: true });
                    assert.strictEqual(helper.scrollable.scrollLeft(), 50, 'scrolled to max right position');
                    helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
                    helper.checkScrollTranslateValues({ vertical: 0, horizontal: 25 });

                    helper.scrollable.scrollTo({ left: 25 });
                    helper.scrollable.update();
                    resizeCallbacks.fire();

                    assert.strictEqual(helper.scrollable.scrollLeft(), 25, 'scrolled to max right position');
                    helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });
                    helper.checkScrollTranslateValues({ vertical: 0, horizontal: 12 });
                } finally {
                    clock.restore();
                }
            });
        });
    });

    QUnit.module(`Scroll arguments, native: ${useNative}`, moduleConfig, () => {
        QUnit.test('Direction: vertical, rtl: false, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', function() {
            const helper = new ScrollableTestHelper({ direction: DIRECTION_VERTICAL, useNative, rtlEnabled: false });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: undefined, reachedRight: undefined });
        });

        QUnit.test('Direction: horizontal, rtl: false, scrollPosition: { left: 0 } -> { left: 1 } -> { left: center } -> { left: max-1 } -> { left: max }', function() {
            const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, rtlEnabled: false });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: true, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: maxOffset.horizontal - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: maxOffset.horizontal });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: true });
        });

        QUnit.test('Direction: both, rtl: false, scrollPosition: { top: 0, left: 0 } -> { top:1, left: 1 } -> { top: center, left: center } -> { top: max-1, left: max-1 } -> { top: max, left: max }', function() {
            const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: false });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: true, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 1, left: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 25, left: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical - 1, left: maxOffset.horizontal - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical, left: maxOffset.horizontal });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: false, reachedRight: true });
        });

        QUnit.test('Direction: vertical, rtl: true, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', function() {
            const helper = new ScrollableTestHelper({ direction: DIRECTION_VERTICAL, useNative, rtlEnabled: true });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: undefined, reachedRight: undefined });
        });

        QUnit.test('Direction: horizontal, rtl: true, scrollPosition: { left: max } -> { left: max-1 } -> { left: center } -> { left: 1 } -> { left: 0 }', function() {
            const helper = new ScrollableTestHelper({ direction: DIRECTION_HORIZONTAL, useNative, rtlEnabled: true });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: true });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: maxOffset.horizontal - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ left: 0 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: true, reachedRight: false });
        });

        QUnit.test('Direction: both, rtl: true, scrollPosition: { top: 0, left: max } -> { top:1, left: max-1 } -> { top: center, left: center } -> { top: max-1, left: 1 } -> { top: max, left: 0 }', function() {
            const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: true });
            const maxOffset = helper.getMaxScrollOffset();

            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: false, reachedRight: true });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 1, left: maxOffset.horizontal - 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: 25, left: 25 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical - 1, left: 1 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

            helper.onScrollHandler.resetHistory();
            helper.scrollable.scrollTo({ top: maxOffset.vertical, left: 0 });
            helper.$container.trigger('scroll');
            helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: true, reachedRight: false });
        });
    });
});
