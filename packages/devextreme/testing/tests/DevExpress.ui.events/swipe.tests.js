import $ from 'jquery';
import { noop } from 'core/utils/common';
import swipeEvents from 'common/core/events/swipe';
import mathUtils from 'core/utils/math';
import domUtils from '__internal/core/utils/m_dom';
import Action from '__internal/core/m_action';
import devices from '__internal/core/m_devices';
import GestureEmitter from 'common/core/events/gesture/emitter.gesture';
import pointerMock from '../../helpers/pointerMock.js';

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const TOUCH_BOUNDARY = GestureEmitter.initialTouchBoundary;


GestureEmitter.touchBoundary(TOUCH_BOUNDARY);


const moduleConfig = {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body');
        this.mouse = pointerMock(this.element);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.element.remove();
        this.clock.restore();
    }
};


$.each(['horizontal', 'vertical'], function(_, direction) {

    const prepareMoveCoord = function(x, y) {
        if(direction === 'horizontal') {
            return [x, y];
        }
        if(direction === 'vertical') {
            return [y, x];
        }
    };

    QUnit.module(direction, moduleConfig);

    QUnit.test('swipe update event', function(assert) {
        const element = this.element;
        const mouse = this.mouse;
        const updateHistory = [];

        element.on(swipeEvents.swipe, {
            itemSizeFunc: function() {
                return 1000;
            },
            direction: direction
        }, function(e) {
            assert.strictEqual(e.target, element[0]);
            updateHistory.push(e.offset);
        });

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(500 + TOUCH_BOUNDARY, 0))
            .move(prepareMoveCoord(250, 0));

        assert.deepEqual(updateHistory, [0.5, 0.75]);
    });


    function testSwipeEndEvent(testName, pixelOffset, expectedItemOffset) {
        QUnit.test(testName, function(assert) {
            const element = this.element;
            const mouse = this.mouse;
            let updateCount = 0;
            const itemSize = 1000;

            element.on(swipeEvents.swipe, {
                itemSizeFunc: function() { return itemSize; },
                direction: direction
            }, function() {
                updateCount++;
            }).on(swipeEvents.end, function(e) {
                assert.strictEqual(e.target, element[0]);
                assert.equal(e.offset, pixelOffset / itemSize);
                assert.equal(e.targetOffset, expectedItemOffset);
                assert.equal(updateCount, 1);
            });

            mouse.start().down().move(prepareMoveCoord(pixelOffset + mathUtils.sign(pixelOffset) * TOUCH_BOUNDARY, 0)).up();
        });
    }

    testSwipeEndEvent('swipe for 2 items', 1600, 2);
    testSwipeEndEvent('swipe for -1 items', -900, -1);

    QUnit.test('fast swipe', function(assert) {

        const mouse = this.mouse;
        let targetOffset;

        this.element.on(swipeEvents.end, {
            itemSizeFunc: function() { return 1000; },
            direction: direction
        }, function(e) {
            targetOffset = e.targetOffset;
        });

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(100 + TOUCH_BOUNDARY, 0))
            .up();
        assert.equal(targetOffset, 1, 'instant single move, not rolled back');

        mouse
            .start()
            .down()
            .wait(100)
            .move(prepareMoveCoord(1 + TOUCH_BOUNDARY, 0))
            .up();
        assert.equal(targetOffset, 1, 'short fast single move, not rolled back');

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(100 + TOUCH_BOUNDARY, 0))
            .wait(5000)
            .up();
        assert.equal(targetOffset, 0, 'single move, delay before end, rolled back');

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(50 + TOUCH_BOUNDARY, 0))
            .wait(10)
            .move(prepareMoveCoord(50, 0))
            .up();
        assert.equal(targetOffset, 1, 'fast swipe, not rolled back');

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(50 + TOUCH_BOUNDARY, 0))
            .wait(5000)
            .move(prepareMoveCoord(50, 0))
            .up();
        assert.equal(targetOffset, 1, 'slow swipe, rolled back');

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(33 + TOUCH_BOUNDARY, 0))
            .wait(5000)
            .move(prepareMoveCoord(33, 0))
            .wait(10)
            .move(prepareMoveCoord(33, 0))
            .up();
        assert.equal(targetOffset, 1, 'slow then fast, not rolled back');

        mouse
            .start()
            .down()
            .move(prepareMoveCoord(33 + TOUCH_BOUNDARY, 0))
            .wait(10)
            .move(prepareMoveCoord(33, 0))
            .wait(5000)
            .move(prepareMoveCoord(33, 0))
            .up();
        assert.equal(targetOffset, 1, 'fast then slow, rolled back');

        this.clock.restore();
    });

    QUnit.test('max offsets', function(assert) {
        const offsetHistory = [];

        this.element.on(swipeEvents.start, {
            itemSizeFunc: function() { return 100; },
            direction: direction
        }, function(e) {
            e.maxLeftOffset = 1;
            e.maxRightOffset = 1;
            e.maxTopOffset = 1;
            e.maxBottomOffset = 1;
        }).on(swipeEvents.swipe, function(e) {
            offsetHistory.push(e.offset);
        }).on(swipeEvents.end, function(e) {
            offsetHistory.push(e.targetOffset);
        });

        this.mouse
            .start()
            .down()
            .move(prepareMoveCoord(-400 - TOUCH_BOUNDARY, 0))
            .up()
            .start()
            .down()
            .move(prepareMoveCoord(400 + TOUCH_BOUNDARY, 0))
            .up();
        assert.deepEqual(offsetHistory, [-2, -1, 2, 1]);
    });
});


QUnit.module('behaviour', moduleConfig);

QUnit.test('swipe should not be crashed if element deleted at swiping', function(assert) {
    assert.expect(0);

    this.anotherElement = $('<div></div>').appendTo('body');
    try {
        this.element.on(swipeEvents.swipe, noop);
        this.anotherElement.on(swipeEvents.swipe, noop);

        this.mouse.start().down().move(-50);
        this.element.remove();
        this.anotherMouse = pointerMock(this.anotherElement);
        this.anotherMouse.move(-50).up();
    } finally {
        this.anotherElement.remove();
    }
});

QUnit.test('swipe event handler should not stop working on the element if another element was removed', function(assert) {
    const $children = $('<div></div><div></div>');
    let called = 0;

    $children
        .appendTo(this.element)
        .on(swipeEvents.swipe, function() {
            called++;
        });

    $.cleanData($children.eq(0));

    pointerMock($children.eq(1))
        .start()
        .down()
        .move(-100)
        .up();

    assert.equal(called, 1);
});

QUnit.test('swipe ignores wheel', function(assert) {
    assert.expect(0);

    this.element.on(swipeEvents.swipe, function() {
        assert.ok(false, 'dxswipe fired');
    });

    pointerMock(this.element).wheel();
});


QUnit.module('blur', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real;
        this.originalCurrentDevice = devices.current();

        this.originalResetActiveElement = domUtils.resetActiveElement;
        this.resetCount = 0;
        domUtils.resetActiveElement = $.proxy(function() {
            this.resetCount++;
        }, this);
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real = this.originalRealDevice;
        devices.current(this.originalCurrentDevice);

        domUtils.resetActiveElement = this.originalResetActiveElement;
    }
});

QUnit.testInActiveWindow('swiper should reset active element inside (B250228)', function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, 'this test run only in webkit');
        return;
    }

    const $innerInput = $('<input>').appendTo(this.element);
    let originalDevice;

    try {
        originalDevice = devices.real();
        devices.real({ platform: 'ios' });

        this.element.on(swipeEvents.swipe, noop);
        $innerInput.focus();

        this.element
            .trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 0, pageY: 0, pointers: [0] }))
            .trigger($.Event('dxpointermove', { pointerType: 'mouse', pageX: 100, pageY: 0, pointers: [0] }))
            .trigger($.Event('dxpointerup', { pointerType: 'mouse', pointers: [] }));

        assert.equal(this.resetCount, 1, 'inner input was blurred');

    } finally {
        $innerInput.remove();
        devices.real(originalDevice);
    }
});

QUnit.testInActiveWindow('swiper should not reset active element outside (B250228)', function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, 'this test run only in webkit');
        return;
    }

    const $outerInput = $('<input>').appendTo('#container');

    try {
        this.element.on(swipeEvents.swipe, noop);
        $outerInput.focus();

        this.element
            .trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 0, pageY: 0, pointers: [0] }))
            .trigger($.Event('dxpointermove', { pointerType: 'mouse', pageX: 100, pageY: 0, pointers: [0] }))
            .trigger($.Event('dxpointerup', { pointerType: 'mouse', pointers: [] }));

        assert.equal(this.resetCount, 0, 'outer input was not blurred');

    } finally {
        $outerInput.remove();
    }
});


QUnit.module('subscriptions', {
    beforeEach: function() {
        this.element = $('<div class=\'el\'></div>').appendTo('body');
    },
    afterEach: function() {
        this.element.remove();
    }
});

QUnit.test('subscription on element should work correctly when event triggered', function(assert) {
    let subscriptionCalled = 0;
    this.element.on(swipeEvents.end, function(e) {
        subscriptionCalled++;
    });

    this.element.trigger(swipeEvents.end);
    assert.strictEqual(subscriptionCalled, 1, 'subscription called');
});

QUnit.test('swipe event is not bubble', function(assert) {
    let subscriptionCalled = 0;
    $('body').on(swipeEvents.end + '.testNamespace', '.el', function(e) {
        subscriptionCalled++;
    });

    this.element
        .trigger(swipeEvents.start)
        .trigger(swipeEvents.swipe)
        .trigger(swipeEvents.end);

    assert.strictEqual(subscriptionCalled, 0, 'subscription is not called');

    $('body').off('.testNamespace');
});


QUnit.module('hacks');

QUnit.test('default behaviour on dxpointermove should be prevented to reduce user selection while swipe', function(assert) {
    const $element = $('#element');

    $element.on(swipeEvents.start, noop);

    $element.trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 200, pageY: 200, pointers: [0] }));

    const moveEvent = $.Event('dxpointermove', { pointerType: 'mouse', pageX: 210, pageY: 200, pointers: [0] });
    $element.trigger(moveEvent);
    assert.ok(moveEvent.isDefaultPrevented(), 'default prevented');

    $element.trigger($.Event('dxpointerup', { pointerType: 'mouse', pointers: [] }));
});

QUnit.test('Event should not be prevented to avoid the "[Intervation] error" when event is not cancelable', function(assert) {
    const $element = $('#element');

    $element.on(swipeEvents.start, noop);

    $element.trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 200, pageY: 200, pointers: [0] }));

    const moveEvent = $.Event('dxpointermove', { cancelable: false, pointerType: 'mouse', pageX: 210, pageY: 200, pointers: [0] });
    $element.trigger(moveEvent);

    assert.strictEqual(moveEvent.isDefaultPrevented(), false, 'event is not prevented');
});


QUnit.module('integration', moduleConfig);

QUnit.test('action in swipeend callback', function(assert) {
    let actionCalled = 0;

    this.element.on(swipeEvents.end, function(e) {
        return new Action(function() {
            actionCalled++;
        }).execute();
    });

    this.mouse
        .start().down().move(-400).up();

    assert.strictEqual(actionCalled, 1, 'action fired');
});

QUnit.test('body event handler should be unsubscribed if no one swipe event handler present', function(assert) {
    this.element
        .on(swipeEvents.swipe, noop)
        .off(swipeEvents.swipe);
    const moveHandlers = $.grep(($._data($('body')[0], 'events') || {})['dxpointermove'] || [], function(item) {
        return item.namespace === 'dxSwipe';
    });
    assert.equal(moveHandlers.length, 0, 'handler removed');
});
