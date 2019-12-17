import $ from 'jquery';
import browser from 'core/utils/browser';
import support from 'core/utils/support';
import styleUtils from 'core/utils/style';
import translator from 'animation/translator';
import animationFrame from 'animation/frame';
import domUtils from 'core/utils/dom';
import initMobileViewport from 'mobile/init_mobile_viewport';
import devices from 'core/devices';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import pointerMock from '../../../helpers/pointerMock.js';

import 'common.css!';

import {
    SCROLLABLE_CLASS,
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLABLE_SCROLLBARS_HIDDEN,
    SCROLLABLE_DISABLED_CLASS,
    SCROLLBAR_HOVERABLE_CLASS,
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

QUnit.module('markup', moduleConfig);

QUnit.test('scrollable render', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({}),
        $wrapper = $scrollable.children().eq(0),
        $container = $wrapper.children().eq(0),
        $content = $container.children().eq(0);

    assert.ok($scrollable.hasClass(SCROLLABLE_CLASS), 'dx-scrollable class attached');
    assert.ok($wrapper.hasClass(SCROLLABLE_WRAPPER_CLASS), 'dx-scrollable-wrapper class attached');
    assert.ok($container.hasClass(SCROLLABLE_CONTAINER_CLASS), 'dx-scrollable-container class attached');
    assert.ok($content.hasClass(SCROLLABLE_CONTENT_CLASS), 'dx-scrollable-content class attached');
    assert.equal($content.children().length, 2, 'content was moved');
    assert.ok($content.children().eq(0).hasClass('content1'));
    assert.ok($content.children().eq(1).hasClass('content2'));
});

QUnit.test('scrollable - root element should has \'dx-scrollable-customizable-scrollbars\' class (only for non-Mac desktops)', function(assert) {
    var scrollable = new Scrollable($('#scrollable'));

    if(devices.real().deviceType !== 'desktop' || navigator.platform.indexOf('Mac') > -1 && browser.webkit) {
        assert.notOk(scrollable.$element().hasClass('dx-scrollable-customizable-scrollbars'), 'root element hasn\'t \'dx-scrollable-customizable-scrollbars\' class');
    } else {
        assert.ok(scrollable.$element().hasClass('dx-scrollable-customizable-scrollbars'), 'root element has \'dx-scrollable-customizable-scrollbars\' class');
    }
});

QUnit.module('horizontal direction', moduleConfig);

QUnit.test('horizontal moving scrollable moves content', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'horizontal'
    });
    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse.down().move(distance, 0);
    location = getScrollOffset($scrollable);
    assert.equal(location.left, distance, 'scroll follows pointer in horizontal direction');

    mouse.move(distance, 0);
    location = getScrollOffset($scrollable);
    assert.equal(location.left, 2 * distance, 'scroll follows pointer everytime in horizontal direction');

    mouse.up();
});


QUnit.test('horizontal inertia calc distance', function(assert) {
    assert.expect(1);

    var contentWidth = 9000,
        moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,
        $scrollable = $('#scrollable');

    $scrollable.find('.content1').width(contentWidth);
    $scrollable.dxScrollable({
        useNative: false,
        direction: 'horizontal',
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.left), Math.round(distance), 'distance was calculated correctly');
        }
    });

    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(moveDuration)
        .move(moveDistance, 0)
        .up();
});

QUnit.test('reset unused position after change direction', function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $('#scrollable').width(containerWidth);

    $scrollable.wrapInner('<div>').children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'horizontal'
    }).dxScrollable('instance');

    scrollable.scrollTo(contentWidth);
    scrollable.option('direction', 'vertical');
    assert.equal(scrollable.scrollLeft(), 0, 'left position was reset after change direction');
});

QUnit.module('both directions', moduleConfig);

QUnit.test('bounce problem', function(assert) {
    assert.expect(2);

    var $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, 0, 'content bounced back');
            assert.equal(location.left, 0, 'content bounced back');
        }
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start()
        .down()
        .move(10, 10)
        .up();
});

QUnit.test('both direction option', function(assert) {
    var $scrollable = $('#scrollable');
    $scrollable
        .children().width(1000).height(1000);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, -10, 'content in correct position');
            assert.equal(location.left, -10, 'content left in correct position');
        }
    });

    $scrollable.dxScrollable('option', 'direction', 'both');
    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);

    pointerMock($content).start()
        .down()
        .move(-10, -10)
        .wait(1000)
        .up();
});

QUnit.test('no bounce when innercontent more then content', function(assert) {
    var $scrollable = $('#scrollable');
    var $fixture = $('#qunit-fixture');

    $('<div>').width(300).appendTo($fixture).append($scrollable);
    $('<div>').width(500).appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'horizontal',
        inertiaEnabled: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.left, -200, 'scrollable in right position');
        }
    });

    var $content = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(-200)
        .up();
});

QUnit.test('no scrolling by content during scrolling by thumb', function(assert) {
    var $scrollable = $('#scrollable').height(50).width(50);
    var distance = 10;

    $scrollable.children().width(100).height(100);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        scrollByThumb: true,
        scrollByContent: false,
        inertiaEnabled: false,
        bounceEnabled: false,
        showScrollbar: 'always'
    });

    var $scrollbarHorizontal = $scrollable.find('.dx-scrollbar-horizontal .' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollbarHorizontal).start()
        .down()
        .move(distance, -distance);

    var scrollableOffset = $scrollable.dxScrollable('scrollOffset');
    assert.equal(scrollableOffset.top, 0, 'vertical offset was not changed');
});

QUnit.test('content selection should be allowed during scrolling by thumb', function(assert) {
    var $scrollable = $('#scrollable').height(50).width(50);
    var distance = 10;

    $scrollable.children().width(100).height(100);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        scrollByThumb: true,
        scrollByContent: false,
        inertiaEnabled: false,
        bounceEnabled: false,
        showScrollbar: 'always'
    });

    $(document).on('dxpointermove.TEST', function(e) {
        assert.ok(!e.isDefaultPrevented(), 'default should not be prevented');
    });

    pointerMock($scrollable.children()).start()
        .down()
        .move(distance, -distance);

    $(document).off('.TEST');
});

QUnit.test('reset unused position after change direction (both)', function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $('#scrollable').width(containerWidth);

    $scrollable.wrapInner('<div>').children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollTo({ left: contentWidth, top: 10 });
    scrollable.option('direction', 'vertical');
    assert.equal(scrollable.scrollLeft(), 0, 'left position was reset after change direction');
    assert.equal(scrollable.scrollTop(), 10, 'top position was not reset after change direction');
});

QUnit.module('Hoverable interaction',
    {
        beforeEach: () => {
            var markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
            </div>';
            $('#qunit-fixture').html(markup);
        }
    },
    () => {
        [false, true].forEach((disabled) => {
            [false, true].forEach((onInitialize) => {
                ['vertical', 'horizontal'].forEach((direction) => {
                    ['onScroll', 'onHover', 'always', 'never'].forEach((showScrollbarMode) => {
                        QUnit.test(`ScrollBar hoverable - disabled: ${disabled}, showScrollbar: ${showScrollbarMode}, direction: ${direction}, onInitialize: ${onInitialize}`, (assert) => {
                            const $scrollable = $('#scrollable').dxScrollable({
                                useNative: false,
                                useSimulatedScrollbar: true,
                                showScrollbar: showScrollbarMode,
                                direction: direction,
                                disabled: onInitialize ? disabled : false,
                                scrollByThumb: true
                            });

                            if(!onInitialize) {
                                $scrollable.dxScrollable('instance').option('disabled', disabled);
                            }

                            const $scrollBar = $scrollable.find(`.${SCROLLABLE_SCROLLBAR_CLASS}`);
                            const scrollBar = Scrollbar.getInstance($scrollBar);

                            const isScrollbarHoverable = (showScrollbarMode === 'onHover' || showScrollbarMode === 'always');

                            assert.strictEqual(scrollBar.option('hoverStateEnabled'), isScrollbarHoverable, 'scrollbar.hoverStateEnabled');
                            assert.strictEqual($scrollBar.hasClass(SCROLLBAR_HOVERABLE_CLASS), isScrollbarHoverable, `scrollbar hasn't ${SCROLLBAR_HOVERABLE_CLASS}`);
                            assert.strictEqual($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), disabled ? true : false, 'scrollable-disabled-class');

                            if(browser.msie && parseInt(browser.version) >= 12 && !onInitialize) {
                                assert.ok(true, 'Skip assert for Edge. The pointer-event property processed with a timeout');
                            } else {
                                assert.strictEqual($scrollBar.css('pointer-events'), disabled ? 'none' : 'auto', 'pointer-events');
                            }
                        });
                    });
                });
            });
        });
    }
);

QUnit.module('initViewport integration', moduleConfig);

QUnit.test('initViewport with disabled panning doesn\'t lock native scrolling', function(assert) {
    assert.expect(1);

    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS));

    try {
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on('dxpointermove.initViewportIntegration', function(e) {
            assert.equal(e.isDefaultPrevented(), false, 'dxpointermove was not prevented');
        });

        mouse.start('touch').down().move(1, 1);

    } finally {
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off('.initViewportIntegration');
    }
});

QUnit.test('initViewport disables panning for non-native scrolling', function(assert) {
    assert.expect(1);

    var $scrollable = $('#scrollable').dxScrollable({
            useNative: false,
            inertiaEnabled: false
        }),
        mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS));

    var originalSupportTouch;

    try {
        originalSupportTouch = support.touch;
        support.touch = true;
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on('dxpointermove.initViewportIntegration', function(e) {
            assert.equal(e.isDefaultPrevented(), true, 'dxpointermove was prevented');
        });

        mouse.start('touch').down().move(1, 1);

    } finally {
        support.touch = originalSupportTouch;
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off('.initViewportIntegration');
    }
});

QUnit.test('dxpointermove is prevented when scrolling is disabled (Q574378)', function(assert) {
    var $scrollable = $('#scrollable');

    $scrollable
        .height('auto')
        .wrapInner('<div>').children().height(50);

    $scrollable.dxScrollable({
        useNative: true
    });

    var originalSupportTouch;

    try {
        originalSupportTouch = support.touch;
        support.touch = true;
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on('dxpointermove.initViewportIntegration', function(e) {
            assert.equal(e.isDefaultPrevented(), true, 'dxpointermove was prevented on non win10 devices');
        });

        pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
            .start('touch')
            .down()
            .move(0, 1);

    } finally {
        support.touch = originalSupportTouch;
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off('.initViewportIntegration');
    }
});


QUnit.module('events integration', moduleConfig);

QUnit.test('scrollable returns to bound and prevent other gestures', function(assert) {
    var $scrollable = $('#scrollable');
    var $scrollableInner = $('<div>').appendTo($scrollable).dxScrollable({
        useNative: false,
        bounceEnabled: true,
        direction: 'horizontal'
    });

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        direction: 'vertical'
    });

    pointerMock($scrollable).start()
        .down()
        .move(0, 10);

    pointerMock($scrollableInner).start()
        .down()
        .move(10, 0)
        .up();

    this.clock.tick(1000);
    assert.equal($scrollable.dxScrollable('scrollTop'), 0);
});

QUnit.test('scrollable locking', function(assert) {
    var $scrollable = $('#scrollable');
    var $scrollableWrapper = $scrollable.wrap('<div>').parent();

    var scrollable = $scrollable.dxScrollable({
        direction: 'vertical',
        useNative: false
    }).dxScrollable('instance');

    $scrollableWrapper.on('dxscroll', function() {
        assert.ok(true, 'scrollable is locked');
    });

    scrollable._lock();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start()
        .down()
        .move(0, 10)
        .up();

    this.clock.tick(1000);
});


QUnit.module('regression', moduleConfig);

QUnit.test('B250273 - dxList: showScrollbar option does not work on device.', function(assert) {
    var $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: true,
        showScrollbar: false,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, 'scrollable has class scrollbars_disabled');
    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 0);

    $scrollable.dxScrollable('option', 'showScrollbar', true);
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false, 'scrollable has not class scrollbars_disabled');
    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 1);

    $scrollable.dxScrollable('option', 'showScrollbar', false);
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, 'scrollable has class scrollbars_disabled');
    assert.equal($scrollable.find('.' + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test('simulated scrollable should stop animators on disposing', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        direction: 'both'
    });
    var scrollable = $scrollable.dxScrollable('instance');

    scrollable.scrollTo({ left: 999, top: 999 });

    $scrollable.remove();

    var scrollers = scrollable._strategy._scrollers,
        verticalScroller = scrollers['vertical'],
        horizontalScroller = scrollers['horizontal'];

    assert.ok(verticalScroller._inertiaAnimator._isStopped());
    assert.ok(horizontalScroller._inertiaAnimator._isStopped());

    assert.ok(verticalScroller._bounceAnimator._isStopped());
    assert.ok(horizontalScroller._bounceAnimator._isStopped());
});

QUnit.test('scrollable content should not blink in bounce on iOS', function(assert) {
    var $scrollable = $('#scrollable').dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable('instance');
    var $wrapper = $scrollable.find('.' + SCROLLABLE_WRAPPER_CLASS);
    var onStart = false;
    var onEnd = false;

    $wrapper
        .on('dxscrollstart', function() {
            onStart = instance._strategy._disablePushBack;
        })
        .on('dxscrollend', function() {
            onEnd = instance._strategy._disablePushBack;
        });

    pointerMock($('.content1'))
        .start()
        .down()
        .move(0, 10)
        .up();

    assert.ok(onStart, 'constant _disablePushBack is true on scroll start');
    assert.ok(!onEnd, 'constant _disablePushBack is false on scroll end');
});


QUnit.module('scrollers interaction', moduleConfig);

QUnit.test('scrolling component with content size equal to container size nested in another component causes outer component scrolling', function(assert) {
    assert.expect(1);

    var complete = $.Deferred();

    $('#scrollable').dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            complete.resolve();
        }
    });

    var $scrollableNested = $('.content1').dxScrollable({
        useNative: false,
        bounceEnabled: false
    });

    pointerMock($scrollableNested).start()
        .down()
        .move(0, -10);

    complete.done(function() {
        assert.ok(true, 'scroll action fired for external dxScrollable');
    });
});

QUnit.test('disabled scrollable nested in another scrollable causes outer component scrolling (B238642)', function(assert) {
    assert.expect(1);

    var complete = $.Deferred();

    $('#scrollable').dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            complete.resolve();
        }
    });

    var $scrollableNested = $('.content1').dxScrollable({ disabled: true });

    pointerMock($scrollableNested).start()
        .down()
        .move(0, -10);

    complete.done(function() {
        assert.ok(true, 'scroll action fired for external dxScrollable');
    });
});

QUnit.module('default value nativeScrollable', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalSupportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = true;
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        support.nativeScrolling = this.originalSupportNativeScrolling;
    }
});

var testDefaultValue = function(realDevice, currentDevice, realVersion) {
    devices.real({
        platform: realDevice,
        version: realVersion
    });
    devices.current({ platform: currentDevice });
    $('#scrollable').dxScrollable({});

    return $('#scrollable').dxScrollable('option', 'useNative');
};

var nativeScrollable = [
    { real: 'ios', current: 'ios' },
    { real: 'ios', current: 'generic' },
    { real: 'ios', current: 'desktop' },
    { real: 'android', current: 'android', version: [4] },
    { real: 'android', current: 'generic', version: [4] },
    { real: 'ios', current: 'android' },
    { real: 'android', current: 'ios', version: [4] }
];

$.each(nativeScrollable, function() {
    var devices = this;
    QUnit.test('real: ' + devices.real + '; current: ' + devices.current, function(assert) {
        assert.ok(testDefaultValue(devices.real, devices.current, devices.version));
    });
});

QUnit.module('default value simulatedScrollable', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalSupportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        support.nativeScrolling = this.originalSupportNativeScrolling;
    }
});

var simulatedScrollable = [
    { real: 'android', current: 'android', version: [3] },
    { real: 'android', current: 'android', version: [2] },
    { real: 'generic', current: 'ios' },
    { real: 'generic', current: 'android' },
    { real: 'generic', current: 'generic' },
    { real: 'generic', current: 'desktop' }
];

$.each(simulatedScrollable, function() {
    var devices = this;
    QUnit.test('real: ' + devices.real + '; current: ' + devices.current, function(assert) {
        assert.ok(!testDefaultValue(devices.real, devices.current, devices.version));
    });
});

QUnit.test('useNative false in simulator', function(assert) {
    var windowSelf,
        forceDevice;

    try {
        windowSelf = window.self;
        forceDevice = window.top['dx-force-device'];

        window.self = {};
        window.top['dx-force-device'] = 'iPhone';
        assert.ok(!testDefaultValue('generic', 'generic'));
    } finally {
        window.self = windowSelf;
        if(forceDevice) {
            window.top['dx-force-device'] = forceDevice;
        } else {
            try { delete window.top['dx-force-device']; } catch(e) { }
        }
    }
});


QUnit.module('active element blurring', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalResetActiveElement = domUtils.resetActiveElement;
        this.resetCount = 0;
        domUtils.resetActiveElement = $.proxy(function() {
            this.resetCount++;
        }, this);
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        domUtils.resetActiveElement = this.originalResetActiveElement;
    }
});

var testBlurInNativeScrolling = function(platform, shouldBeBlurred) {
    QUnit.testInActiveWindow(platform + ': active element should' + (shouldBeBlurred ? '' : ' not') + ' be blurred (B250228)', function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, 'this test run only in webkit');
            return;
        }

        var $innerInput;

        try {
            devices.real({ platform: platform });

            var $element = $('#scrollable');
            $innerInput = $('<input>').appendTo($element);

            $element.dxScrollable();
            var elementPointer = pointerMock($element.find('.' + SCROLLABLE_CONTAINER_CLASS));

            $innerInput.focus();
            elementPointer.start().down().move(0, 10);
            if(shouldBeBlurred) {
                assert.equal(this.resetCount, 1, 'inner input was blurred');
            } else {
                assert.equal(this.resetCount, 0, 'inner input was not blurred');
            }
            elementPointer.up();
        } finally {
            $innerInput.remove();
        }
    });
};

testBlurInNativeScrolling('ios', true);
testBlurInNativeScrolling('android');
testBlurInNativeScrolling('desktop');

QUnit.testInActiveWindow('scrollable should not reset active element outside (B250228)', function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, 'this test run only in webkit');
        return;
    }

    var $outerInput;

    try {
        var $element = $('#scrollable'),
            elementPointer = pointerMock($element);

        $outerInput = $('<input>').appendTo('#qunit-fixture');

        $element.dxScrollable();

        $outerInput.focus();
        elementPointer.start().down().move(0, 10);
        assert.equal(this.resetCount, 0, 'outer input was not blurred');
        elementPointer.up();
    } finally {
        $outerInput.remove();
    }
});

QUnit.module('visibility events integration', {
    beforeEach: () => {
        var markup = '\
        <div id="scrollable" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2"></div>\
        </div>';
        $('#qunit-fixture').html(markup);
    }
});

QUnit.test('scroll should save position on dxhiding and restore on dxshown', function(assert) {
    var $scrollable = $('#scrollable');

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollTo({ left: 10, top: 20 });

    domUtils.triggerHidingEvent($scrollable);

    $scrollable.hide();

    scrollable.scrollTo({ left: 0, top: 0 });

    $scrollable.show();
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 10, top: 20 }, 'scroll position restored after dxshown');
});

QUnit.test('scroll should restore on second dxshown', function(assert) {
    var $scrollable = $('#scrollable');

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        direction: 'both'
    }).dxScrollable('instance');

    scrollable.scrollTo({ left: 10, top: 20 });

    domUtils.triggerHidingEvent($scrollable);
    domUtils.triggerShownEvent($scrollable);

    scrollable.scrollTo({ left: 0, top: 0 });
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 0, top: 0 }, 'scroll position was not changed');
});

QUnit.test('scroll should save position on dxhiding when scroll is hidden', function(assert) {
    var $scrollable = $('#scrollable');

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
    }).dxScrollable('instance');

    scrollable.scrollTo({ left: 0, top: 20 });
    domUtils.triggerHidingEvent($scrollable);
    $scrollable.hide();

    scrollable.scrollTo({ left: 0, top: 0 });

    $scrollable.show();
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 0, top: 20 }, 'scroll position restored after dxshown');
});


if(styleUtils.styleProp('touchAction')) {
    QUnit.module('nested scrolling in IE/Edge');

    QUnit.test('touch-action none should be present on not stretched list', function(assert) {
        var $content = $('<div>').width(100).height(100);
        var $scrollable = $('<div>').width(50).height(50);

        $scrollable.append($content).appendTo('#qunit-fixture');

        $scrollable = $scrollable.dxScrollable({
            useNative: false,
            direction: 'both',
            bounceEnabled: false
        });

        var scrollable = $scrollable.dxScrollable('instance'),
            $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

        assert.equal($container.css('touchAction'), 'none');

        $content.width(50).height(100);
        scrollable.update();
        assert.equal($container.css('touchAction'), 'pan-x');

        $content.width(100).height(50);
        scrollable.update();
        assert.equal($container.css('touchAction'), 'pan-y');

        $content.width(50).height(50);
        scrollable.update();
        assert.notEqual($container.css('touchAction'), 'none');
    });
}
