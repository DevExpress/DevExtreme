import $ from 'jquery';
import translator from 'animation/translator';
import animationFrame from 'animation/frame';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import config from 'core/config';
import pointerMock from '../../../helpers/pointerMock.js';
import { isRenderer } from 'core/utils/type';

import 'common.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLABLE_SCROLLBARS_HIDDEN,
    SCROLLABLE_DISABLED_CLASS,
    calculateInertiaDistance
} from './scrollable.constants.js';

var moduleConfig = {
    beforeEach: function() {
        var markup = '\
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

var getScrollOffset = function($scrollable) {
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS),
        location = translator.locate($content);

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module('api', moduleConfig);

QUnit.test('update', function(assert) {
    var moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,
        $scrollable = $('#scrollable'),
        $scrollableChild = $scrollable.find('div');

    $scrollableChild.height(0);

    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(distance), 'distance was calculated correctly');
        }
    });

    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    $scrollableChild.height(-1 * distance + 1);
    $scrollable.dxScrollable('instance').update();

    mouse
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();
});

QUnit.test('scroll event should be triggered if scroll position changed', function(assert) {
    var called = 0,
        $scrollable = $('#scrollable').dxScrollable({
            useNative: false,
            direction: 'both'
        }),
        $content = $scrollable.find('.content1');

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
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    var content = $scrollable.dxScrollable('instance').content();

    assert.equal(isRenderer(content), !!config().useJQuery, 'content is correct');
    assert.ok($(content).hasClass(SCROLLABLE_CONTENT_CLASS), 'returns content');
});

QUnit.test('scrollBy with plain object', function(assert) {
    var distance = 10,
        $scrollable = $('#scrollable').dxScrollable({
            useNative: false,
            onEnd: function() {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, 'scroll to correctly vertical position');
                assert.equal(location.left, 0, 'scroll to correctly horizontal position');
            }
        }),
        scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy({ left: distance, top: distance });
});

QUnit.test('scrollBy with numeric', function(assert) {
    var distance = 10,
        $scrollable = $('#scrollable').dxScrollable({
            useNative: false,
            onEnd: function() {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, 'scroll to correctly vertical position');
                assert.equal(location.left, 0, 'scroll to correctly horizontal position');
            }
        }),
        scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy actions', function(assert) {
    var started = 0,
        scrolled = 0,
        ended = 0,
        completed = $.Deferred(),
        distance = 10,
        $scrollable = $('#scrollable').dxScrollable({
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
        }),
        scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
    completed.done(function() {
        assert.equal(started, 1, 'start action should be fired once');
        assert.equal(scrolled, 1, 'scroll action should be fired once');
        assert.equal(ended, 1, 'end action should be fired once');
    });
});

QUnit.test('scrollBy to location', function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy to location with dynamic content', function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $('#scrollable').empty().dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable('instance'),
        $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);


    $content.append($('<div>').height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollBy to location with dynamic content if auto update is prevented', function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $('#scrollable').empty().dxScrollable({
        useNative: false,
        updateManually: true,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, 0, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable('instance'),
        $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);


    $content.append($('<div>').height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test('scrollTo to location', function(assert) {
    var distance = 10,
        actionFiredCount = 0;

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            actionFiredCount++;
        }
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo(distance);
    scrollable.scrollTo(distance);

    assert.equal(actionFiredCount, 1, 'action was fired only one time');
});

QUnit.test('scrollTo to location with dynamic content', function(assert) {
    var wasFirstMove = false;

    var $scrollable = $('#scrollable').empty().append($('<div>').height(150)).dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.roughEqual(location.top, -50, 1, 'scroll to correctly vertical position');
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable('instance'),
        $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    scrollable.scrollTo(100);
    $content.empty().append($('<div>').height(101));
    scrollable.scrollTo(50);
});

QUnit.test('scrollOffset', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.deepEqual($scrollable.dxScrollable('scrollOffset'), { top: 10, left: 0 }, 'scrollOffset is correct');
});

QUnit.test('scrollLeft', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { left: -10 });

    assert.equal($scrollable.dxScrollable('scrollLeft'), 10, 'scrollLeft is correct');
});

QUnit.test('scrollTop', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.equal($scrollable.dxScrollable('scrollTop'), 10, 'scrollLeft is correct');
});

QUnit.test('scrollbar hidden while scrolling when showScrollbar is false', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    var $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal($scrollbar.is(':hidden'), true, 'scrollbar is hidden');
});

QUnit.test('showScrollbar render', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, 'scrollable has class scrollbars_disabled');

    $scrollable.dxScrollable('option', 'showScrollbar', true);

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false, 'scrollable has not class scrollbars_disabled');
});

QUnit.test('event arguments', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
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

    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start(),
        distance = -10;

    mouse
        .down()
        .move(0, distance)
        .up();
});

QUnit.test('disabled: scroll was not moved when disabled is true', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
            useNative: false,
            disabled: true
        }),
        mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse.down().move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, 0, 'scroll was not moved when disabled is true');
    mouse.up();
});

QUnit.test('simulated strategy should subscribe to the poiner events after disabled option changed', function(assert) {
    var $scrollable = $('#scrollable'),
        scrollableInstance = $('#scrollable').dxScrollable({
            useNative: false,
            showScrollbar: 'onHover',
            disabled: true
        }).dxScrollable('instance');

    scrollableInstance.option('disabled', false);

    var scrollbar = Scrollbar.getInstance($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS));
    var $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger('mouseenter');

    assert.equal(scrollbar.option('visible'), true, 'thumb is visible after mouse enter');
});

QUnit.test('disabled option add class to root element', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), false, 'scrollable have not disabled class');

    $scrollable.dxScrollable('option', 'disabled', true);

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), true, 'scrollable have disabled class');
});

QUnit.test('changing option showScrollbar does not duplicate scrollbar', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        showScrollbar: true
    });

    $scrollable.dxScrollable('option', 'showScrollbar', false);

    var $scrollbars = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbars.length, 1, 'scrollbar is not duplicated');
});

QUnit.test('switching useNative to false turns off native scrolling', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });

    var $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    assert.notEqual($container.css('overflowY'), 'hidden');

    $scrollable.dxScrollable('option', 'useNative', false);

    assert.equal($container.css('overflowY'), 'hidden');
});

QUnit.test('scrollToElement', function(assert) {
    var $scrollable = $('#scrollable').height(50);
    var $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    var $item = $('<div>').height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item.get(0));

    assert.roughEqual(scrollable.scrollTop(), $wrapper.height() + $item.outerHeight() - scrollable.clientHeight(), 0.5);
});

QUnit.test('scrollToElement when item height is greater than scroll height', function(assert) {
    var $scrollable = $('#scrollable').height(50);
    var $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    var $item = $('<div>').height(100).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item.get(0));

    assert.equal(scrollable.scrollTop(), $wrapper.height());
});

QUnit.test('scrollToElement with offset', function(assert) {
    var bottomOffset = 70;
    var $scrollable = $('#scrollable').empty().height(100);
    var $item1 = $('<div>').height(50).appendTo($scrollable);
    var $item2 = $('<div>').height(50).appendTo($scrollable);

    $('<div>').height(150).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: 'vertical'
    }).dxScrollable('instance');

    scrollable.scrollToElement($item2, { bottom: bottomOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight());
});

QUnit.test('scrollToElement with offset in opposite direction', function(assert) {
    var topOffset = 30;
    var $scrollable = $('#scrollable').empty().height(100);
    var $item1 = $('<div>').height(50).appendTo($scrollable);
    var $item2 = $('<div>').height(50).appendTo($scrollable);

    $('<div>').height(1500).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: 'vertical'
    }).dxScrollable('instance');

    scrollable.scrollTo(200);
    scrollable.scrollToElement($item2, { top: topOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight() - topOffset);
});

QUnit.test('scrollToElement with absolute position in the container(T162489)', function(assert) {
    var $scrollable = $('#scrollable'),
        $wrapper = $scrollable.wrapInner('<div>').children().eq(0),
        $item = $('<div>', {
            css: {
                position: 'absolute',
                top: 50
            }
        }).height(100).append($('<div/>')).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo(50);
    scrollable.scrollToElement($item.children().eq(0));

    assert.equal(scrollable.scrollTop() + scrollable.option('pushBackValue'), $wrapper.height() - scrollable.clientHeight());
});

QUnit.test('scrollToElement does not scroll to element when element is not child of scrollable', function(assert) {
    var $scrollable = $('#scrollable');
    var $item = $('<div>').height(500).insertAfter($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0, 'scrollable was not scrolled');
});

QUnit.test('scrollToElement scrolls to bottom position of element when scroll scrollTop less than element position.top', function(assert) {
    var $scrollable = $('#scrollable').height(50);
    var $wrapper = $scrollable.wrapInner('<div>').children().eq(0);
    var $item = $('<div>').height(100).appendTo($scrollable);
    var $spaceItem = $('<div>').height(500).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollTo($wrapper.height() + $item.height() + $spaceItem.height());
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), $wrapper.outerHeight() + $item.outerHeight() - scrollable.clientHeight());
});

QUnit.test('scrollToElement does not scroll when element is placed in visible area', function(assert) {
    var $scrollable = $('#scrollable').height(30);
    var $item = $('<div>').height(10).prependTo($scrollable);

    $('<div>').height(30).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollTo(30);
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 30);
});

QUnit.test('scrollToElement does not scroll when element is placed in visible area and greater than visible area', function(assert) {
    var $scrollable = $('#scrollable').height(30);
    var $item = $('<div>').height(50).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: 'vertical'
    });

    var scrollable = $scrollable.dxScrollable('instance');
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0);
});

QUnit.test('scrollToElements scrolls in both directions', function(assert) {
    var topPosition = 30;
    var leftPosition = 50;
    var itemSize = 30;

    var $scrollable = $('#scrollable').width(50).height(50).css('position', 'relative');

    $scrollable.wrapInner('<div>').children().eq(0).width(200).height(200);

    var $item = $('<div>').css({
        width: itemSize + 'px',
        height: itemSize + 'px',
        position: 'absolute',
        top: topPosition + 'px',
        left: leftPosition + 'px'
    }).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollToElement($item);
    assert.roughEqual(scrollable.scrollTop() + scrollable.option('pushBackValue'), topPosition + itemSize - scrollable.clientHeight(), 1, 'scrollable was scrolled by vertical');
    assert.roughEqual(scrollable.scrollLeft(), leftPosition + itemSize - scrollable.clientWidth(), 1, 'scrollable was scrolled by horizontal');
});

QUnit.test('scrollTo should not reset unused position', function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $('#scrollable').width(containerWidth);

    $scrollable.wrapInner('<div>').children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
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
        const { useNative, direction, rtlEnabled, pushBackValue } = options;
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

    checkScrollEvent(options) {
        const scrollArguments = this.onScrollHandler.lastCall.args[0];

        QUnit.assert.equal(scrollArguments.reachedTop, options.reachedTop, 'reachedTop');
        QUnit.assert.equal(scrollArguments.reachedBottom, options.reachedBottom, 'reachedBottom');
        QUnit.assert.equal(scrollArguments.reachedLeft, options.reachedLeft, 'reachedLeft');
        QUnit.assert.equal(scrollArguments.reachedRight, options.reachedRight, 'reachedRight');
    }
}

[0, 10].forEach((pushBackValue) => {
    [true, false].forEach((useNative) => {
        QUnit.module(`Scroll arguments, native: ${useNative}, pushBackValue: ${pushBackValue}`, moduleConfig, () => {
            QUnit.test('Direction: \'vertical\', rtl: false, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', () => {
                const helper = new ScrollableTestHelper({ direction: 'vertical', useNative: useNative, rtlEnabled: false, pushBackValue: pushBackValue });
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

            QUnit.test('Direction: \'horizontal\', rtl: false, scrollPosition: { left: 0 } -> { left: 1 } -> { left: center } -> { left: max-1 } -> { left: max }', () => {
                const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative: useNative, rtlEnabled: false, pushBackValue: pushBackValue });
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

            QUnit.test('Direction: \'both\', rtl: false, scrollPosition: { top: 0, left: 0 } -> { top:1, left: 1 } -> { top: center, left: center } -> { top: max-1, left: max-1 } -> { top: max, left: max }', () => {
                const helper = new ScrollableTestHelper({ direction: 'both', useNative: useNative, rtlEnabled: false, pushBackValue: pushBackValue });
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

            QUnit.test('Direction: \'vertical\', rtl: true, scrollPosition: { top: 0 } -> { top: 1 } -> { top: center } -> { top: max-1 } -> { top: max }', () => {
                const helper = new ScrollableTestHelper({ direction: 'vertical', useNative: useNative, rtlEnabled: true, pushBackValue: pushBackValue });
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

            QUnit.test('Direction: \'horizontal\', rtl: true, scrollPosition: { left: max } -> { left: max-1 } -> { left: center } -> { left: 1 } -> { left: 0 }', () => {
                const helper = new ScrollableTestHelper({ direction: 'horizontal', useNative: useNative, rtlEnabled: true, pushBackValue: pushBackValue });
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

            QUnit.test('Direction: \'both\', rtl: true, scrollPosition: { top: 0, left: max } -> { top:1, left: max-1 } -> { top: center, left: center } -> { top: max-1, left: 1 } -> { top: max, left: 0 }', () => {
                const helper = new ScrollableTestHelper({ direction: 'both', useNative: useNative, rtlEnabled: true, pushBackValue: pushBackValue });
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
