var $ = require('jquery'),
    MouseAndTouchStrategy = require('events/pointer/mouse_and_touch'),
    registerEvent = require('events/core/event_registrator'),
    nativePointerMock = require('../../../helpers/nativePointerMock.js'),
    special = require('../../../helpers/eventHelper.js').special;

QUnit.module('mouse and touch events', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(MouseAndTouchStrategy.map, function(pointerEvent, originalEvents) {
            if(special[pointerEvent]) {
                special[pointerEvent].dispose.apply(undefined);
            }
            registerEvent(pointerEvent, new MouseAndTouchStrategy(pointerEvent, originalEvents));
        });

        this.$element = $('#element');
    },

    afterEach: function() {
        MouseAndTouchStrategy.resetObserver();
        this.clock.restore();
    }
});

QUnit.test('pointer event should not trigger twice on real devices', function(assert) {
    var handlerTriggerCount = 0;

    var $container = $('#container').on('dxpointerdown', function() {
        handlerTriggerCount++;
    });

    var $element = this.$element.on('dxpointerdown', function() {
        handlerTriggerCount++;
    });

    nativePointerMock($element)
        .start()
        .down();

    assert.equal(handlerTriggerCount, 2);

    nativePointerMock($container)
        .start()
        .down();

    assert.equal(handlerTriggerCount, 3);
});

QUnit.test('one pointer event should not unsubscribe another events', function(assert) {
    assert.expect(1);

    var $element = this.$element;

    $element
        .on('dxpointerdown dxpointerup', function(e) {
            assert.equal(e.type, 'dxpointerup');
        })
        .off('dxpointerdown');

    $element.trigger('dxpointerdown');
    $element.trigger('dxpointerup');
});

QUnit.test('dxpointerup triggers twice on real devices', function(assert) {
    var triggered = 0;

    this.$element.on('dxpointerup', function() {
        triggered++;
    });

    var pointer = nativePointerMock(this.$element)
        .start()
        .touchStart()
        .touchEnd();

    this.clock.tick(300);

    pointer
        .mouseDown()
        .mouseUp();

    assert.equal(triggered, 1);
});


$.each({
    'dxpointerdown': 'mouseDown',
    'dxpointermove': 'mouseMove',
    'dxpointerup': 'mouseUp',
    'dxpointerover': 'mouseOver',
    'dxpointerout': 'mouseOut',
    'dxpointerenter': 'mouseEnter',
    'dxpointerleave': 'mouseLeave'
}, function(eventName, triggerMethod) {
    QUnit.test('\'' + eventName + '\' has pointerType = \'mouse\' if it was triggered by mouse event', function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerType, 'mouse');
        });

        nativePointerMock(this.$element)[triggerMethod]();
    });
});

$.each({
    'dxpointerdown': 'mouseDown',
    'dxpointermove': 'mouseMove',
    'dxpointerup': 'mouseUp',
    'dxpointerover': 'mouseOver',
    'dxpointerout': 'mouseOut',
    'dxpointerenter': 'mouseEnter',
    'dxpointerleave': 'mouseLeave'
}, function(eventName, triggerMethod) {
    QUnit.test('\'' + eventName + '\' event should have correct pointerId', function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerId, 1);
        });

        nativePointerMock(this.$element)[triggerMethod]();
    });
});

var simulateMouseEvent = function($element, type, options) {
    options = $.extend({
        canBubble: true,
        cancelable: true,
        type: type
    }, options);

    var event = document.createEvent('MouseEvents');

    var args = [];
    $.each(['type', 'canBubble', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey',
        'shiftKey', 'metaKey', 'button', 'relatedTarget'], function(i, name) {
        if(name in options) {
            args.push(options[name]);
        } else {
            args.push(event[name]);
        }
    });
    event.initMouseEvent.apply(event, args);

    $element[0].dispatchEvent(event);
};

QUnit.test('dxpointer events should have correct pointers', function(assert) {
    this.$element.one('dxpointerdown', function(e) {
        var pointers = e.pointers;
        assert.equal(pointers.length, 1);
    });
    simulateMouseEvent(this.$element, 'mousedown');

    this.$element.one('dxpointermove', function(e) {
        var pointers = e.pointers;
        assert.equal(pointers.length, 1);
    });
    simulateMouseEvent(this.$element, 'mousemove');

    this.$element.one('dxpointerup', function(e) {
        var pointers = e.pointers;
        assert.equal(pointers.length, 0);
    });
    simulateMouseEvent(this.$element, 'mouseup');

    this.$element.one('dxpointermove', function(e) {
        var pointers = e.pointers;
        assert.equal(pointers.length, 0);
    });
    simulateMouseEvent(this.$element, 'mousemove');
});

QUnit.test('pointers in dxpointer events should be updated on mouse move', function(assert) {
    simulateMouseEvent(this.$element, 'mousedown', { clientX: 0 });

    this.$element.one('dxpointermove', function(e) {
        var pointers = e.pointers;

        assert.equal(pointers[0].pageX || pointers[0].clientX, 50);
    });
    simulateMouseEvent(this.$element, 'mousemove', { clientX: 50 });
});


$.each({
    'dxpointerdown': 'touchstart',
    'dxpointermove': 'touchmove',
    'dxpointerup': 'touchend'
}, function(eventName, triggerEvent) {
    QUnit.test('\'' + eventName + '\' has pointerType = \'touch\' if it was triggered by touch event', function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerType, 'touch');
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17 }],
            touches: [{ identifier: 17 }]
        });
    });
});

$.each({
    'dxpointerdown': 'touchstart',
    'dxpointermove': 'touchmove',
    'dxpointerup': 'touchend'
}, function(eventName, triggerEvent) {
    QUnit.test('\'' + eventName + '\' event should have correct pointerId', function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerId, 17);
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17 }],
            touches: [{ identifier: 17 }]
        });
    });
});

$.each({
    'dxpointerdown': 'touchstart',
    'dxpointermove': 'touchmove',
    'dxpointerup': 'touchend'
}, function(eventName, triggerEvent) {
    QUnit.test('\'' + eventName + '\' event should have correct pointerId', function(assert) {
        this.$element.on(eventName, function(e) {
            if(eventName !== 'dxpointerup') {
                assert.equal(e.pointers.length, 1, 'pointer was added');
                var pointer = e.pointers[0];

                $.each(['pageX', 'pageY'], function() {
                    assert.ok(this in pointer, 'event has \'' + this + '\' property');
                });

                assert.equal(pointer.pointerId, 17);
            } else {
                assert.equal(e.pointers.length, 0, 'pointers was cleaned');
            }
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17, pageX: 0, pageY: 0 }],
            touches: eventName === 'dxpointerup' ? [] : [{ identifier: 17, pageX: 0, pageY: 0 }]
        });
    });
});

$.each({
    'dxpointerdown': 'touchstart',
    'dxpointermove': 'touchmove',
    'dxpointerup': 'touchend'
}, function(eventName, triggerEvent) {
    QUnit.test('\'' + eventName + '\' event should have correct pageX/pageY', function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pageX, 10);
            assert.equal(e.pageY, 15);
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17, pageX: 10, pageY: 15 }],
            touches: eventName === 'dxpointerup' ? [] : [{ identifier: 17, pageX: 10, pageY: 15 }]
        });
    });
});
