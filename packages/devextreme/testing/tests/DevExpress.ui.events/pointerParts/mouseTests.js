const $ = require('jquery');
const MouseStrategy = require('common/core/events/pointer/mouse');
const registerEvent = require('common/core/events/core/event_registrator');
const nativePointerMock = require('../../../helpers/nativePointerMock.js');
const special = require('../../../helpers/eventHelper.js').special;

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
    let handlerTriggerCount = 0;

    const $container = $('#container').on('dxpointerdown', function() {
        handlerTriggerCount++;
    });

    const $element = this.$element.on('dxpointerdown', function() {
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
    let triggered = 0;

    this.$element.on('dxpointerup', function() {
        triggered++;
    });

    const pointer = nativePointerMock(this.$element)
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

const simulateMouseEvent = function($element, type, options) {
    options = $.extend({
        cancelable: true,
        type: type,
        bubbles: true,
        composed: true,
    }, options);

    const event = new MouseEvent(type, options);

    $element[0].dispatchEvent(event);
};

QUnit.test('dxpointer events should have correct pointers', function(assert) {
    this.$element.one('dxpointerdown', function(e) {
        const pointers = e.pointers;
        assert.equal(pointers.length, 1);
    });
    simulateMouseEvent(this.$element, 'mousedown');

    this.$element.one('dxpointermove', function(e) {
        const pointers = e.pointers;
        assert.equal(pointers.length, 1);
    });
    simulateMouseEvent(this.$element, 'mousemove');

    this.$element.one('dxpointerup', function(e) {
        const pointers = e.pointers;
        assert.equal(pointers.length, 0);
    });
    simulateMouseEvent(this.$element, 'mouseup');

    this.$element.one('dxpointermove', function(e) {
        const pointers = e.pointers;
        assert.equal(pointers.length, 0);
    });
    simulateMouseEvent(this.$element, 'mousemove');
});

QUnit.test('pointers in dxpointer events should be updated on mouse move', function(assert) {
    simulateMouseEvent(this.$element, 'mousedown', { clientX: 0 });

    this.$element.one('dxpointermove', function(e) {
        const pointers = e.pointers;

        assert.equal(pointers[0].pageX || pointers[0].clientX, 50);
    });
    simulateMouseEvent(this.$element, 'mousemove', { clientX: 50 });
});
