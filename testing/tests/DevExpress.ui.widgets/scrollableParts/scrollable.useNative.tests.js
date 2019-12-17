import $ from 'jquery';
import translator from 'animation/translator';
import animationFrame from 'animation/frame';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import pointerMock from '../../../helpers/pointerMock.js';

import 'common.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS,
    SCROLLABLE_NATIVE_CLASS
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

QUnit.module('useNative', moduleConfig);

QUnit.test('scrollable render', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });

    assert.ok($scrollable.hasClass(SCROLLABLE_NATIVE_CLASS), 'dx-scrollable-native class attached');
});

QUnit.test('simulated scroll does not work when using native', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });

    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start(),
        distance = -10,
        startLocation = getScrollOffset($scrollable);

    mouse
        .down()
        .move(0, distance)
        .up();

    var location = getScrollOffset($scrollable);
    assert.equal(location.top, startLocation.top, 'scroll does not move');
});

QUnit.test('scroll action fired for simulated scroller during native scroll', function(assert) {
    var done = assert.async();

    var $scrollable = $('#scrollable').dxScrollable({
        inertiaEnabled: false,
        useNative: false,
        onScroll: function(args) {
            assert.equal(args.scrollOffset.top, 10, 'scroll action fired with right offset');
            done();
        },
    });

    $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS).scrollTop(10);
});

QUnit.test('scroll action fired when scrollable scrolling', function(assert) {
    assert.expect(2);

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        onScroll: function() {
            assert.ok(true, 'scroll fired');
        }
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    var pointer = pointerMock($container).start().wheel(10);

    $container.scrollTop(10);
    pointer.wheel(10);
});

QUnit.test('scroll action does not fired when scroll location does not changed', function(assert) {
    assert.expect(1);

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        onScroll: function() {
            assert.ok(true, 'scroll fired');
        }
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    pointerMock($container)
        .start()
        .wheel(0)
        .wheel(0);
});

QUnit.test('scrollBy', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable('instance');

    instance.scrollBy(10);
    assert.equal(instance.scrollTop(), 10, 'container has correctly position');

    instance.scrollBy(20);
    assert.equal(instance.scrollTop(), 30, 'container has correctly position');
});

QUnit.test('scrollTo', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable('instance');

    $scrollable.dxScrollable('scrollTo', 10);
    assert.equal(instance.scrollTop(), 10, 'container has correctly position');

    $scrollable.dxScrollable('scrollTo', 20);
    assert.equal(instance.scrollTop(), 20, 'container has correctly position');
});

QUnit.test('useSimulatedScrollbar = false do not create scrollbars when useNative true', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: false
    });

    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test('useSimulatedScrollbar = true create scrollbars when useNative true', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 1);
});

QUnit.test('useSimulatedScrollbar = false remove old scrollbars when useNative true', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    $scrollable.dxScrollable('option', 'useSimulatedScrollbar', false);

    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test('simulatedScrollbar direction', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS).length, 1, 'vertical scrollbar was been added');
    assert.equal($scrollable.find('.' + SCROLLBAR_HORIZONTAL_CLASS).length, 0, 'horizontal scrollbar was not been added');

    $scrollable.dxScrollable('option', 'direction', 'horizontal');

    assert.equal($scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS).length, 0, 'vertical scrollbar was not been added');
    assert.equal($scrollable.find('.' + SCROLLBAR_HORIZONTAL_CLASS).length, 1, 'horizontal scrollbar was been added');

    $scrollable.dxScrollable('option', 'direction', 'both');

    assert.equal($scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS).length, 1, 'vertical scrollbar was been added');
    assert.equal($scrollable.find('.' + SCROLLBAR_HORIZONTAL_CLASS).length, 1, 'horizontal scrollbar was been added');
});

QUnit.test('simulatedScrollbar visibility', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS),
        scrollbar = Scrollbar.getInstance($scrollbar);
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    assert.equal(scrollbar.option('visible'), false, 'on start thumb is hidden');

    pointerMock($container)
        .start()
        .wheel(10);

    assert.equal(scrollbar.option('visible'), true, 'after move thumb is visible');
});

QUnit.test('scrollbar height calculated correctly when simulatedScrollbar is true', function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        scrollHeight = (containerHeight / contentHeight) * containerHeight;

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS),
        $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);

    $scrollable.dxScrollable('instance').update();

    assert.equal($scroll.height(), scrollHeight, 'scrollbar height calculated correctly');
});

QUnit.test('moving scrollable moves scrollbar', function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        distance = 10,
        scrollbarDistance = distance * (containerHeight / contentHeight);

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable('instance').update();

    $scrollable.dxScrollable('scrollTo', 2 * distance);
    $container.trigger('scroll');

    var location = translator.locate($scroll);
    assert.equal(location.top, 2 * scrollbarDistance, 'scrollbar follows pointer everytime');
});

QUnit.test('scrollbar appears for simulated scrolling even when useSimulatedScrollbar is false', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        useSimulatedScrollbar: false,
        inertiaEnabled: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find('.' + SCROLLBAR_VERTICAL_CLASS));

    assert.equal(scrollbar.option('visible'), false, 'scrollbar is hidden before scrolling');

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal(scrollbar.option('visible'), true, 'scrollbar is shown during scrolling');
});

QUnit.test('scrollOffset', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable('instance');

    instance.scrollTo(10);

    assert.deepEqual(instance.scrollOffset(), { top: 10, left: 0 }, 'scrollOffset is correct');
});

QUnit.test('scrollHeight', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);
    $content.css('padding', '10px');

    assert.equal($scrollable.dxScrollable('scrollHeight'), $content.outerHeight() - 2 * $scrollable.dxScrollable('option', 'pushBackValue'), 'scroll height equals to content height');
});

QUnit.test('clientHeight', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    assert.equal($scrollable.dxScrollable('clientHeight'), $container.height(), 'client height equals to container height');
});

QUnit.test('scrollWidth', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);

    assert.equal($scrollable.dxScrollable('scrollWidth'), $content.width(), 'scroll width equals to content width');
});

QUnit.test('clientWidth', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.css({ overflowY: 'hidden' });

    assert.equal($scrollable.dxScrollable('clientWidth'), $container.width(), 'client width equals to container width');
});

QUnit.test('scroll reachedTop true only at the top', function(assert) {
    var currentScrollTopState = true;
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        onScroll: function(e) {
            assert.equal(e.reachedLeft, undefined, 'reached left is not defined');
            assert.equal(e.reachedRight, undefined, 'reached right is not defined');
            assert.equal(e.reachedTop, currentScrollTopState, 'reached top is correct');
        }
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    $container.trigger('scroll');

    currentScrollTopState = false;
    $scrollable.dxScrollable('scrollTo', 1);
    $container.trigger('scroll');

    currentScrollTopState = true;
    $scrollable.dxScrollable('scrollTo', 0);
    $container.trigger('scroll');
}),

QUnit.test('scroll reachedBottom true only at the bottom', function(assert) {
    var currentScrollBottomState = false;
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true,
        onScroll: function(e) {
            assert.equal(e.reachedLeft, undefined, 'reached left is not defined');
            assert.equal(e.reachedRight, undefined, 'reached right is not defined');
            assert.equal(e.reachedBottom, currentScrollBottomState, 'reached bottom is correct');
        }
    });
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var containerSize = $container.prop('clientHeight');
    var contentSize = $content.outerHeight();

    $container.trigger('scroll');

    currentScrollBottomState = true;
    $scrollable.dxScrollable('scrollTo', contentSize - containerSize);
    $container.trigger('scroll');

    currentScrollBottomState = false;
    $scrollable.dxScrollable('scrollTo', contentSize - containerSize - 1);
    $container.trigger('scroll');
});

QUnit.test('scroll reachedLeft true only at the left border', function(assert) {
    var currentScrollLeftState = true;

    var $scrollable = $('#scrollable').width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: 'horizontal',
        onScroll: function(e) {
            assert.equal(e.reachedLeft, currentScrollLeftState, 'reached left is correct');
            assert.equal(e.reachedTop, undefined, 'reached top is not defined');
            assert.equal(e.reachedBottom, undefined, 'reached bottom is not defined');
        }
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.trigger('scroll');

    currentScrollLeftState = false;
    $scrollable.dxScrollable('scrollTo', 1);
    $container.trigger('scroll');

    currentScrollLeftState = true;
    $scrollable.dxScrollable('scrollTo', 0);
    $container.trigger('scroll');
});

QUnit.test('scroll reachedRight true only at the right border', function(assert) {
    var currentScrollLeftState = false;

    var $scrollable = $('#scrollable').width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: 'horizontal',
        onScroll: function(e) {
            assert.equal(e.reachedRight, currentScrollLeftState, 'reached right is correct');
            assert.equal(e.reachedTop, undefined, 'reached top is not defined');
            assert.equal(e.reachedBottom, undefined, 'reached bottom is not defined');
        }
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var containerSize = $container.prop('clientWidth');
    var contentSize = $content.outerWidth();

    $container.trigger('scroll');

    currentScrollLeftState = true;

    $scrollable.dxScrollable('scrollTo', contentSize - containerSize);
    $container.trigger('scroll');

    currentScrollLeftState = false;
    $scrollable.dxScrollable('scrollTo', contentSize - containerSize - 1);
    $container.trigger('scroll');
});

QUnit.test('scroll args are correct', function(assert) {
    var top = true,
        left = true,
        right = false,
        bottom = false;
    var lastScrollEventArgs;
    var $scrollable = $('#scrollable').width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: 'both',
        onScroll: function(e) {
            lastScrollEventArgs = e;
        }
    });

    var checkLastScrollEvent = function() {
        assert.equal(lastScrollEventArgs.reachedTop, top, 'reached top is correct');
        assert.equal(lastScrollEventArgs.reachedRight, right, 'reached right is correct');
        assert.equal(lastScrollEventArgs.reachedBottom, bottom, 'reached bottom is correct');
        assert.equal(lastScrollEventArgs.reachedLeft, left, 'reached left is correct');
    };

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable),
        containerWidth = $container.prop('clientWidth'),
        contentWidth = $container.prop('scrollWidth'),
        containerHeight = $container.prop('clientHeight'),
        contentHeight = $container.prop('scrollHeight');

    assert.ok(!lastScrollEventArgs, 'scroll was not triggered on start');

    $container.trigger('scroll');
    checkLastScrollEvent();

    top = false;
    $scrollable.dxScrollable('scrollTo', { left: 0, top: 1 });
    $container.trigger('scroll');
    checkLastScrollEvent();

    left = false;
    $scrollable.dxScrollable('scrollTo', { left: 1, top: 1 });
    $container.trigger('scroll');
    checkLastScrollEvent();

    bottom = true;
    $scrollable.dxScrollable('scrollTo', {
        left: 1,
        top: contentHeight - containerHeight
    });
    $container.trigger('scroll');
    checkLastScrollEvent();

    right = true;
    $scrollable.dxScrollable('scrollTo', {
        left: contentWidth - containerWidth,
        top: contentHeight - containerHeight
    });
    $container.trigger('scroll');
    checkLastScrollEvent();
});
