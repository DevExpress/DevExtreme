var $ = require('jquery'),
    MouseStrategy = require('events/pointer/mouse'),
    registerEvent = require('events/core/event_registrator'),
    nativePointerMock = require('../../../helpers/nativePointerMock.js'),
    special = require('../../../helpers/eventHelper.js').special;

QUnit.module('mouse events', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(MouseStrategy.map, function(pointerEvent, originalEvents) {
            if(special[pointerEvent]) {
                special[pointerEvent].dispose.apply(undefined);
            }
            registerEvent(pointerEvent, new MouseStrategy(pointerEvent, originalEvents));
        });

        this.$element = $('#element');
    },

    afterEach: function() {
        MouseStrategy.resetObserver();
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
