import $ from 'jquery';
import translator from 'animation/translator';
import resizeCallbacks from 'core/utils/resize_callbacks';
import animationFrame from 'animation/frame';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import config from 'core/config';
import browser from 'core/utils/browser';
import pointerMock from '../../../helpers/pointerMock.js';
import { isRenderer } from 'core/utils/type';

import 'common.css!';
import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLABLE_SCROLLBARS_HIDDEN,
    SCROLLABLE_DISABLED_CLASS,
    calculateInertiaDistance
} from './scrollable.constants.js';

const moduleConfig = {
    beforeEach: function() {
        const markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
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

const getScrollOffset = function($scrollable) {
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const location = translator.locate($content);

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module('api', moduleConfig);

QUnit.test('update', function(assert) {
    const moveDistance = -10;
    const moveDuration = 10;
    const inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration);
    const distance = moveDistance + inertiaDistance;
    const $scrollable = $('#scrollable');
    const $scrollableChild = $scrollable.find('div');

    $scrollableChild.height(0);

    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(distance), 'distance was calculated correctly');
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    $scrollableChild.height(-1 * distance + 1);
    $scrollable.dxScrollable('instance').update();

    mouse
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();
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


QUnit.test('content', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const content = $scrollable.dxScrollable('instance').content();

    assert.equal(isRenderer(content), !!config().useJQuery, 'content is correct');
    assert.ok($(content).hasClass(SCROLLABLE_CONTENT_CLASS), 'returns content');
});

QUnit.test('scrollBy with plain object', function(assert) {
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

    scrollable.scrollBy({ left: distance, top: distance });
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
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);


    $content.append($('<div>').height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy to location with dynamic content if auto update is prevented', function(assert) {
    const distance = 10;
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').empty().dxScrollable({
        useNative: false,
        updateManually: true,
        onEnd: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.equal(location.top, 0, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);


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
                assert.roughEqual(location.top, -50, 1, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    scrollable.scrollTo(100);
    $content.empty().append($('<div>').height(101));
    scrollable.scrollTo(50);
});


QUnit.test('scrollOffset', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.deepEqual($scrollable.dxScrollable('scrollOffset'), { top: 10, left: 0 }, 'scrollOffset is correct');
});

QUnit.test('scrollLeft', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { left: -10 });

    assert.equal($scrollable.dxScrollable('scrollLeft'), 10, 'scrollLeft is correct');
});

QUnit.test('scrollTop', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.equal($scrollable.dxScrollable('scrollTop'), 10, 'scrollTop is correct');
});

QUnit.test('scrollbar hidden while scrolling when showScrollbar is false', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal($scrollbar.is(':hidden'), true, 'scrollbar is hidden');
});

QUnit.test('showScrollbar render', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, 'scrollable has class scrollbars_disabled');

    $scrollable.dxScrollable('option', 'showScrollbar', true);

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false, 'scrollable has not class scrollbars_disabled');
});

QUnit.test('event arguments', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function(e) {
            assert.notEqual(e.event, undefined, 'Event passed');
            assert.deepEqual(e.scrollOffset, { top: 10, left: undefined }, 'scrollOffset passed');
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

    const scrollbar = Scrollbar.getInstance($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS));
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger('mouseenter');

    assert.equal(scrollbar.option('visible'), true, 'thumb is visible after mouse enter');
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
        showScrollbar: true
    });

    $scrollable.dxScrollable('option', 'showScrollbar', false);

    const $scrollbars = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbars.length, 1, 'scrollbar is not duplicated');
});

QUnit.test('switching useNative to false turns off native scrolling', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    assert.notEqual($container.css('overflowY'), 'hidden');

    $scrollable.dxScrollable('option', 'useNative', false);

    assert.equal($container.css('overflowY'), 'hidden');
});

QUnit.test('scrollToElement', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>').height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item.get(0));

    assert.roughEqual(scrollable.scrollTop(), $wrapper.height() + $item.outerHeight() - scrollable.clientHeight(), 0.5);
});

QUnit.test('getScrollElementPosition', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $item = $('<div>').height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const position = scrollable.getScrollElementPosition($item, 'vertical');

    assert.equal(position, $item.offset().top - $scrollable.offset().top - $item.height());
});

QUnit.test('scrollToElement when item height is greater than scroll height', function(assert) {
    const $scrollable = $('#scrollable').height(50);
    const $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    const $item = $('<div>').height(100).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
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
        direction: 'vertical'
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
        direction: 'vertical'
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
        direction: 'vertical'
    });

    const scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo(50);
    scrollable.scrollToElement($item.children().eq(0));

    assert.equal(scrollable.scrollTop() + scrollable.option('pushBackValue'), $wrapper.height() - scrollable.clientHeight());
});

QUnit.test('scrollToElement does not scroll to element when element is not child of scrollable', function(assert) {
    const $scrollable = $('#scrollable');
    const $item = $('<div>').height(500).insertAfter($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
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
        direction: 'vertical'
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
        direction: 'vertical'
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
        direction: 'vertical'
    });

    const scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0);
});

QUnit.test('scrollToElements scrolls in both directions', function(assert) {
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
    assert.roughEqual(scrollable.scrollTop() + scrollable.option('pushBackValue'), topPosition + itemSize - scrollable.clientHeight(), 1, 'scrollable was scrolled by vertical');
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


class ScrollableTestHelper {
    constructor(options) {
        const { useNative, direction, rtlEnabled, pushBackValue = 0 } = options;
        this.onScrollHandler = sinon.spy();
        this._useNative = useNative;
        this._direction = direction;
        this._rtlEnabled = rtlEnabled;
        this._pushBackValue = pushBackValue;
        this.$scrollable = $('#scrollable');
        this.scrollable = this._getScrollable();
        this.$container = this._getScrollableContainer();
    }

    _getScrollable() {
        return this.$scrollable.dxScrollable({
            useNative: this._useNative,
            direction: this._direction,
            rtlEnabled: this._rtlEnabled,
            pushBackValue: this._pushBackValue,
            showScrollbar: 'always',
            onScroll: this.onScrollHandler
        }).dxScrollable('instance');
    }

    getMaxScrollOffset() {
        const containerElement = this.$container.get(0);
        const maxVerticalOffset = containerElement.scrollHeight - containerElement.clientHeight;
        const maxHorizontalOffset = containerElement.scrollWidth - containerElement.clientWidth;

        return {
            vertical: this._useNative ? maxVerticalOffset - 2 * this._pushBackValue : maxVerticalOffset,
            horizontal: maxHorizontalOffset
        };
    }

    _getScrollableContainer() {
        return this.$scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
    }

    getScrollbarSize(prop) {
        return this.$container.get(0)[`offset${prop}`] - this.$container.get(0)[`client${prop}`];
    }

    checkScrollEvent(options) {
        const scrollArguments = this.onScrollHandler.lastCall.args[0];

        QUnit.assert.equal(scrollArguments.reachedTop, options.reachedTop, 'reachedTop');
        QUnit.assert.equal(scrollArguments.reachedBottom, options.reachedBottom, 'reachedBottom');
        QUnit.assert.equal(scrollArguments.reachedLeft, options.reachedLeft, 'reachedLeft');
        QUnit.assert.equal(scrollArguments.reachedRight, options.reachedRight, 'reachedRight');
    }

    checkScrollOffset({ left, top, maxScrollOffset, epsilon = 0.001 }, message) {
        const scrollOffset = getScrollOffset(this.$scrollable);
        QUnit.assert.roughEqual(this.getMaxScrollOffset().horizontal, maxScrollOffset, epsilon, 'horizontal maxScrollOffset');
        QUnit.assert.roughEqual(-scrollOffset.left, left, epsilon, 'scrollOffset.left');
        QUnit.assert.roughEqual(-scrollOffset.top, top, epsilon, 'scrollOffset.top');
        QUnit.assert.roughEqual(this.scrollable.scrollLeft(), left, epsilon, message || 'scrollable.scrollLeft()');
        QUnit.assert.roughEqual(this.scrollable.scrollTop(), top, epsilon, 'scrollable.scrollTop()');
    }

    setContainerWidth(width) {
        this.$scrollable.css('width', width);

        resizeCallbacks.fire();
    }
}


[true, false].forEach((useNative) => {
    // T947463
    QUnit.module(`ScrollToElement, native: ${useNative}`, moduleConfig, () => {
        const elementHeight = 20;
        const elementWidth = 30;
        const elementOffset = { top: 100, left: 100 };

        const setInitialState = () => {
            $('.content1').css({ width: 0, height: 0 });
            $('.content2').css({ width: 200, height: 200, position: 'relative' });
            $('<div id="element"></div>').css({ position: 'absolute', width: elementWidth, height: elementHeight }).appendTo($('.content2'));
        };

        ['vertical', 'horizontal', 'both'].forEach((direction) => {
            QUnit.test(`Scroll from top to bottom, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top });
                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height') : 0;

                helper.checkScrollOffset({ left: 0, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from left to right, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ left: elementOffset.left });
                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedLeftOffset = direction !== 'vertical' ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width') : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: 0, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from bottom to top, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top });
                helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical });
                helper.scrollable.update();

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? elementOffset.top : 0;

                helper.checkScrollOffset({ left: 0, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from right to left, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ left: elementOffset.left });
                helper.scrollable.scrollTo({ left: helper.getMaxScrollOffset().horizontal });
                helper.scrollable.update();

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedLeftOffset = direction !== 'vertical' ? elementOffset.left : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: 0, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from left-top to right-bottom, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height') : 0;
                const expectedLeftOffset = direction !== 'vertical' ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width') : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from left-bottom to right-top, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical });
                helper.scrollable.update();

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? elementOffset.top : 0;
                const expectedLeftOffset = direction !== 'vertical' ? helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width') : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from right-bottom to left-top, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                helper.scrollable.scrollTo({ top: helper.getMaxScrollOffset().vertical, left: helper.getMaxScrollOffset().horizontal });
                helper.scrollable.update();

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? elementOffset.top : 0;
                const expectedLeftOffset = direction !== 'vertical' ? elementOffset.left : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });

            QUnit.test(`Scroll from right-top to left-bottom, direction: ${direction}, rtlEnabled: false`, function() {
                const helper = new ScrollableTestHelper({ direction, useNative, rtlEnabled: false, pushBackValue: 0 });
                setInitialState();

                const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

                helper.scrollable.scrollTo({ left: helper.getMaxScrollOffset().horizontal });
                helper.scrollable.update();

                helper.scrollable.scrollToElement($element);
                helper.scrollable.update();

                const expectedTopOffset = direction !== 'horizontal' ? helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height') : 0;
                const expectedLeftOffset = direction !== 'vertical' ? elementOffset.left : 0;

                helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
            });
        });

        QUnit.test('Scroll from left to right, bottom border on scrollbar, direction: both, rtlEnabled: false', function() {
            const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: false, pushBackValue: 0 });
            setInitialState();

            helper.scrollable.scrollTo({ top: helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height') / 2 });
            helper.scrollable.update();

            const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });

            helper.scrollable.scrollToElement($element);
            helper.scrollable.update();

            const expectedLeftOffset = helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width');
            const expectedTopOffset = helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height');

            helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
        });

        QUnit.test('Scroll from top to bottom, right border on scrollbar, direction: both, rtlEnabled: false', function() {
            const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: false, pushBackValue: 0 });
            setInitialState();

            helper.scrollable.scrollTo({ left: helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width') / 2 });
            helper.scrollable.update();

            const $element = $('#element').css({ top: elementOffset.top, left: elementOffset.left });
            helper.scrollable.scrollToElement($element);
            helper.scrollable.update();

            const expectedLeftOffset = helper.$container.get(0).offsetWidth + elementWidth + helper.getScrollbarSize('Width');
            const expectedTopOffset = helper.$container.get(0).offsetHeight + elementHeight + helper.getScrollbarSize('Height');

            helper.checkScrollOffset({ left: expectedLeftOffset, top: expectedTopOffset, maxScrollOffset: helper.getMaxScrollOffset().horizontal });
        });
    });

    QUnit.module(`ScrollPosition after update(), native: ${useNative}`, moduleConfig, () => {
        QUnit.test('direction: horizontal, rtl: false -> scrollTo(left: center) -> scrollTo(left: max)', function() {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: false, pushBackValue: 0 });
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });

            helper.scrollable.update();
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });

            helper.scrollable.scrollTo({ left: 25 });
            helper.scrollable.update();
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });

            helper.scrollable.scrollTo({ left: 50 });
            helper.scrollable.update();
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });
        });

        QUnit.test('direction: horizontal, rtl: true -> scrollTo(left: center) -> scrollTo(left: 0)', function() {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true, pushBackValue: 0 });
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });

            helper.scrollable.update();
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });

            helper.scrollable.scrollTo({ left: 25 });
            helper.scrollable.update();
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });

            helper.scrollable.scrollTo({ left: 0 });
            helper.scrollable.update();
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });
        });

        QUnit.test('Change content size, direction: horizontal, rtl: false -> change content size', function() {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: false, pushBackValue: 0 });
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 50 });

            helper.$scrollable.find('.content1').css('width', '200px');
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 150 });

            helper.scrollable.update();
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 150 });
        });

        QUnit.test('direction: horizontal, rtl: true -> change content size', function() {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true, pushBackValue: 0 });
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });

            helper.$scrollable.find('.content1').css('width', '200px');
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 150 }); // left should be -150 (T848870)

            helper.scrollable.update();
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 150 });
        });
    });

    QUnit.module(`ScrollPosition after resize, rtl: true, native: ${useNative}`, moduleConfig, () => {
        QUnit.test('Direction: horizontal, initialScrollPosition(Right), content.width:100, container.width(50) -> container.width(75) -> container.width(100)', function(assert) {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true });
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 }, 'initial rendering');

            helper.setContainerWidth(75);
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 25 }, 'scrolled to max right position after resize to 75px');

            helper.setContainerWidth(100);
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 0 }, 'scrolled to max right position after resize to 75px');
        });

        QUnit.test('Direction: horizontal, initialScrollPosition(Right), content.width:100, container.width(75) -> container.width(50) -> container.width(100)', function(assert) {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true });
            helper.setContainerWidth(75);
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 25 }, 'scrolled to max right position after resize to 75px');

            helper.setContainerWidth(50);
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');

            helper.setContainerWidth(100);
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 0 }, 'scrolled to max right position after resize to 100px');
        });

        QUnit.test('Direction: horizontal, initialScrollPosition(Right), content.width:100, container.width(50) -> container.width(100) -> container.width(75)', function(assert) {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true });
            helper.setContainerWidth(50);
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');

            helper.setContainerWidth(100);
            helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 0 }, 'scrolled to max right position after resize to 100px');

            helper.setContainerWidth(75);
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 25 }, 'scrolled to max right position after resize to 75px');
        });

        [1, 10, 20].forEach(scrollOffset => {
            QUnit.test(`Direction: horizontal, initialScrollPosition(Right), content.width:100, container.width(50), scrollTo(Right - ${scrollOffset}) -> container.width(75) -> container.width(50) -> container.width(100) -> container.width(50)`, function(assert) {
                const helper = new ScrollableTestHelper({
                    direction: 'horizontal',
                    useNative,
                    rtlEnabled: true
                });
                const maxOffset = helper.getMaxScrollOffset();
                helper.scrollable.scrollTo({ left: maxOffset.horizontal - scrollOffset });
                helper.scrollable.update();

                helper.setContainerWidth(75);
                helper.checkScrollOffset({ left: helper.getMaxScrollOffset().horizontal - scrollOffset, top: 0, maxScrollOffset: 25 }, 'scrolled to max right position after resize to 75px');

                helper.setContainerWidth(50);
                helper.checkScrollOffset({ left: helper.getMaxScrollOffset().horizontal - scrollOffset, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');

                helper.setContainerWidth(100);
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 0 }, 'scrolled to max right position after resize to 100px');

                helper.setContainerWidth(50);
                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');
            });
        });

        [30, 40, 50].forEach(scrollOffset => {
            QUnit.test(`Direction: horizontal, initialScrollPosition(Left), content.width:100, container.width(50), scrollTo(${scrollOffset}) -> container.width(75) -> container.width(50) -> width(100) -> container.width(50)`, function(assert) {
                const helper = new ScrollableTestHelper({
                    direction: 'horizontal',
                    useNative,
                    rtlEnabled: true
                });
                helper.scrollable.scrollTo({ left: scrollOffset });
                helper.scrollable.update();

                helper.setContainerWidth(75);
                helper.checkScrollOffset({ left: scrollOffset - 25, top: 0, maxScrollOffset: 25 }, 'scrolled to max right position after resize to 75px');

                helper.setContainerWidth(50);
                helper.checkScrollOffset({ left: scrollOffset, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');

                helper.setContainerWidth(100);
                helper.checkScrollOffset({ left: 0, top: 0, maxScrollOffset: 0 }, 'scrolled to max right position after resize to 100px');

                helper.setContainerWidth(50);
                helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 }, 'scrolled to max right position after resize to 50px');
            });
        });

        if(!browser.msie) {
            [0, 10, 20].forEach(scrollRight => {
                QUnit.test(`Direction: horizontal, initialScrollPosition(Right - ${scrollRight}), css.zoomIn -> css.zoomOut`, function(assert) {
                    const helper = new ScrollableTestHelper({
                        direction: 'horizontal',
                        useNative,
                        rtlEnabled: true
                    });
                    const maxOffset = helper.getMaxScrollOffset();
                    helper.scrollable.scrollTo({ left: maxOffset.horizontal - scrollRight });
                    helper.scrollable.update();
                    [1, 1.1, 1].forEach(zoomLevel => {
                        helper.scrollable._getWindowDevicePixelRatio = () => zoomLevel;
                        helper.scrollable.$element().css('zoom', zoomLevel);

                        helper.checkScrollOffset({ left: 50 - scrollRight, top: 0, maxScrollOffset: 50, epsilon: 1.1 });
                    });
                });

                QUnit.test(`Direction: horizontal, initialScrollPosition(Left: ${scrollRight}), css.zoomIn -> css.zoomOut`, function(assert) {
                    const helper = new ScrollableTestHelper({
                        direction: 'horizontal',
                        useNative,
                        rtlEnabled: true
                    });

                    helper.scrollable.scrollTo({ left: scrollRight });
                    helper.scrollable.update();
                    [1, 1.1, 1].forEach(zoomLevel => {
                        helper.scrollable._getWindowDevicePixelRatio = () => zoomLevel;
                        helper.scrollable.$element().css('zoom', zoomLevel);

                        helper.checkScrollOffset({ left: scrollRight, top: 0, maxScrollOffset: 50, epsilon: 1.1 });
                    });
                });
            });
        }

        QUnit.test(`Direction: horizontal, rtl: true, useNative: ${useNative}, rtlEnabled: true, scroll save the max right position when width of window was changed`, function(assert) {
            const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true });
            assert.strictEqual(helper.scrollable.scrollLeft(), helper.scrollable.$content().width() - helper.$scrollable.width(), 'scrolled to max right position');
            helper.checkScrollOffset({ left: 50, top: 0, maxScrollOffset: 50 });

            helper.scrollable.scrollTo({ left: 25 });
            helper.scrollable.update();
            resizeCallbacks.fire();

            assert.strictEqual(helper.scrollable.scrollLeft(), 25, 'scrolled to max right position');
            helper.checkScrollOffset({ left: 25, top: 0, maxScrollOffset: 50 });
        });
    });

    [0, 10].forEach((pushBackValue) => {
        QUnit.module(`Scroll arguments, native: ${useNative}, pushBackValue: ${pushBackValue}`, moduleConfig, () => {
            QUnit.test('Direction: vertical, rtl: false, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', function() {
                const helper = new ScrollableTestHelper({ direction: 'vertical', useNative, rtlEnabled: false, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: undefined, reachedRight: undefined });
            });

            QUnit.test('Direction: horizontal, rtl: false, scrollPosition: { left: 0 } -> { left: 1 } -> { left: center } -> { left: max-1 } -> { left: max }', function() {
                const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: false, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: true, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: maxOffset.horizontal - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: maxOffset.horizontal });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: true });
            });

            QUnit.test('Direction: both, rtl: false, scrollPosition: { top: 0, left: 0 } -> { top:1, left: 1 } -> { top: center, left: center } -> { top: max-1, left: max-1 } -> { top: max, left: max }', function() {
                const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: false, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: true, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 1, left: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 25, left: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical - 1, left: maxOffset.horizontal - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical, left: maxOffset.horizontal });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: false, reachedRight: true });
            });

            QUnit.test('Direction: vertical, rtl: true, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', function() {
                const helper = new ScrollableTestHelper({ direction: 'vertical', useNative, rtlEnabled: true, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: undefined, reachedRight: undefined });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: undefined, reachedRight: undefined });
            });

            QUnit.test('Direction: horizontal, rtl: true, scrollPosition: { left: max } -> { left: max-1 } -> { left: center } -> { left: 1 } -> { left: 0 }', function() {
                const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative, rtlEnabled: true, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: true });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: maxOffset.horizontal - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ left: 0 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: undefined, reachedBottom: undefined, reachedLeft: true, reachedRight: false });
            });

            QUnit.test('Direction: both, rtl: true, scrollPosition: { top: 0, left: max } -> { top:1, left: max-1 } -> { top: center, left: center } -> { top: max-1, left: 1 } -> { top: max, left: 0 }', function() {
                const helper = new ScrollableTestHelper({ direction: 'both', useNative, rtlEnabled: true, pushBackValue: pushBackValue });
                const maxOffset = helper.getMaxScrollOffset();

                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: true, reachedBottom: false, reachedLeft: false, reachedRight: true });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 1, left: maxOffset.horizontal - 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: 25, left: 25 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical - 1, left: 1 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: false, reachedLeft: false, reachedRight: false });

                helper.onScrollHandler.reset();
                helper.scrollable.scrollTo({ top: maxOffset.vertical, left: 0 });
                helper.$container.trigger('scroll');
                helper.checkScrollEvent({ reachedTop: false, reachedBottom: true, reachedLeft: true, reachedRight: false });
            });
        });
    });
});
