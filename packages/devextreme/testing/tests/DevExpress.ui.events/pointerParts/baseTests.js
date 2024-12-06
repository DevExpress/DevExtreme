const $ = require('jquery');
const noop = require('core/utils/common').noop;
const BaseStrategy = require('common/core/events/pointer/base');
const registerEvent = require('common/core/events/core/event_registrator');
const special = require('../../../helpers/eventHelper.js').special;


const BubbledTestEventMap = {
    'dxpointerdown': 'testdown',
    'dxpointermove': 'testmove',
    'dxpointerup': 'testup',
    'dxpointercancel': 'testcancel'
};

const NoBubbledTestEventMap = {
    'dxpointerenter': 'testenter',
    'dxpointerleave': 'testleave'
};

const TestEventMap = $.extend({},
    BubbledTestEventMap,
    NoBubbledTestEventMap
);


QUnit.module('base events', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(TestEventMap, function(pointerEvent, originalEvents) {
            if(special[pointerEvent]) {
                special[pointerEvent].dispose.apply(undefined);
            }
            registerEvent(pointerEvent, new BaseStrategy(pointerEvent, originalEvents));
        });
    },

    afterEach: function() {
        this.clock.restore();
    }
});

$.each({
    'dxpointerdown': [0, 1, 1, 1],
    'dxpointermove': [0, 0, 1, 1],
    'dxpointerup': [0, 0, 0, 1]
}, function(eventName, assertions) {
    QUnit.test('\'' + eventName + '\' event triggers', function(assert) {
        let triggered = 0;

        const $element = $('#element');
        $element.on(eventName, function(e) {
            triggered++;
            assert.strictEqual(e.target, $element[0]);
        });

        assert.equal(triggered, assertions[0]);

        $element.trigger('testdown');
        assert.equal(triggered, assertions[1]);

        $element.trigger('testmove');
        assert.equal(triggered, assertions[2]);

        $element.trigger('testup');
        assert.equal(triggered, assertions[3]);
    });
});

$.each(TestEventMap, function(pointerEvent, originalEvent) {
    QUnit.test('\'' + pointerEvent + '\' event should be prevented if original event was prevented', function(assert) {
        const $element = $('#element');

        $element.on(originalEvent, function(e) {
            e.preventDefault();
        });

        $element.on(pointerEvent, function(e) {
            assert.strictEqual(e.isDefaultPrevented(), true, '\'' + pointerEvent + '\' event was prevented');
        });

        $element.trigger(originalEvent);
    });
});

$.each(NoBubbledTestEventMap, function(pointerEvent, originalEvent) {
    QUnit.test('\'' + pointerEvent + '\' event should not bubble', function(assert) {
        const $element = $('#element');
        let counter = 0;
        $(document).on(originalEvent, function(e) {
            counter++;
        });

        $element.on(pointerEvent, function(e) {
            assert.strictEqual(counter, 0, '\'' + pointerEvent + '\' did not bubble');
        });

        $element.trigger(originalEvent);

        $(document).off(originalEvent);
    });

    QUnit.test('\'' + pointerEvent + '\' event should have delegated subscriptions', function(assert) {
        const $element = $('#element');

        $element.on(pointerEvent, '#delegated', function(e) {
            assert.strictEqual(e.originalEvent.delegateTarget.id, 'element', '\'' + pointerEvent + '\'  have subscription');
        });


        $element.children('#delegated').trigger(originalEvent);
    });
});

$.each(BubbledTestEventMap, function(pointerEvent, originalEvent) {
    QUnit.test('\'' + pointerEvent + '\' event should bubble', function(assert) {
        const $element = $('#element');
        let counter = 0;
        $(document).on(originalEvent, function(e) {
            counter++;
        });

        $element.on(pointerEvent, function(e) {
            assert.strictEqual(counter, 1, '\'' + pointerEvent + '\' bubbled');
        });

        $element.trigger(originalEvent);

        $(document).off(originalEvent);
    });

    QUnit.test('\'' + pointerEvent + '\' event should not have delegated subscriptions', function(assert) {
        const $element = $('#element');

        $element.on(pointerEvent, '#delegated', function(e) {
            assert.strictEqual(e.originalEvent.delegateTarget.id, undefined, '\'' + pointerEvent + '\' not have subscription');
        });

        $element.children('#delegated').trigger(originalEvent);
    });
});

QUnit.test('event trigger order', function(assert) {
    const LOG = [];
    const log = function(e) {
        LOG.push(e.type);
    };

    const $element = $('#element');
    $element
        .on('testdown testup', log)
        .on('dxpointerdown dxpointerup', log)
        .on('testdown testup', log);

    $element
        .trigger('testdown')
        .trigger('testup');

    assert.deepEqual(LOG, [
        'testdown',
        'testdown',
        'dxpointerdown',
        'testup',
        'testup',
        'dxpointerup'
    ]);
});

QUnit.test('pointer events should unsubscribe on .off method', function(assert) {
    const $element = $('#element');
    const getEvents = function() {
        return $.map($._data($element.get(0), 'events') || [], function(i) { return i; });
    };

    assert.equal(getEvents().length, 0);

    $element
        .on('dxpointerdown dxpointermove dxpointerup', noop)
        .off('dxpointerdown dxpointermove dxpointerup');

    assert.equal(getEvents().length, 0);
});

QUnit.test('one pointer event should not unsubscribe another events', function(assert) {
    assert.expect(1);

    const $element = $('#element');

    $element
        .on('dxpointerdown dxpointerup', function(e) {
            assert.equal(e.type, 'dxpointerup');
        })
        .off('dxpointerdown');

    $element.trigger('dxpointerdown');
    $element.trigger('dxpointerup');
});

QUnit.test('empty original event should not unsubscribe the whole namespace', function(assert) {
    assert.expect(1);

    const $element = $('#element');

    const handlerSpy = sinon.spy();
    $element.on('any.dxPointerEvents', handlerSpy);

    const strategy = new BaseStrategy('other', '');
    strategy.noBubble = true;
    strategy.teardown($element);

    $element.trigger('any.dxPointerEvents');

    assert.ok(handlerSpy.calledOnce, 'handlers for \'.dxPointerEvents\' remain');
});

QUnit.test('event is triggered one time after refresh', function(assert) {
    assert.expect(1);

    const $element = $('#element');

    $element
        .on('dxpointerdown', function(e) {
            assert.ok(true);
        })
        .off('dxpointerdown')
        .on('dxpointerdown', function(e) {
            assert.ok(true);
        });

    $element.trigger('dxpointerdown');
});

QUnit.test('pointer event base strategy should have \'setup\' implementation, because jQuery adds a browser event via addEventListener/attachEvent otherwise (T208653)', function(assert) {
    assert.ok($.isFunction((new BaseStrategy('', '')).setup));
});

QUnit.test('pointer events should correctly unsubscribe events with target', function(assert) {
    const $element = $('#element');
    const getEvents = function() {
        return $.map($._data($element.get(0), 'events') || [], function(i) { return i; });
    };

    assert.equal(getEvents().length, 0);

    $element
        .on('dxpointerenter dxpointerleave', '#target1', noop)
        .on('dxpointerenter dxpointerleave', '#target2', noop)
        .off('dxpointerenter dxpointerleave', '#target1')
        .off('dxpointerenter dxpointerleave', '#target2');

    assert.equal(getEvents().length, 0);
});
