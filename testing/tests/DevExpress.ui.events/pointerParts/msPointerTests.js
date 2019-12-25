import $ from 'jquery';
import MsPointerStrategy from 'events/pointer/mspointer';
import registerEvent from 'events/core/event_registrator';
import { pointerEvents as isPointerEventsSupported } from 'core/utils/support';
import { isFunction } from 'core/utils/type.js';
import nativePointerMock from '../../../helpers/nativePointerMock.js';
import { special } from '../../../helpers/eventHelper.js';

const POINTER_DOWN_EVENT_NAME = 'pointerdown';
const POINTER_UP_EVENT_NAME = 'pointerup';
const POINTER_MOVE_EVENT_NAME = 'pointermove';
const POINTER_OVER_EVENT_NAME = 'pointerover';
const POINTER_OUT_EVENT_NAME = 'pointerout';
const POINTER_ENTER_EVENT_NAME = 'pointerenter';
const POINTER_LEAVE_EVENT_NAME = 'pointerleave';

const { test } = QUnit;

QUnit.module('mspointer events', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(MsPointerStrategy.map, (pointerEvent, originalEvents) => {
            if(special[pointerEvent]) {
                special[pointerEvent].dispose.apply(undefined);
            }
            registerEvent(pointerEvent, new MsPointerStrategy(pointerEvent, originalEvents));
        });

        this.$element = $('#element');
    },

    afterEach: function() {
        MsPointerStrategy.resetObserver();
        this.clock.restore();
    }
}, () => {
    test('pointer event should not trigger twice on real devices', function(assert) {
        const stubHandler = sinon.stub();
        const $container = $('#container').on('dxpointerdown', stubHandler);
        const $element = this.$element.on('dxpointerdown', stubHandler);

        nativePointerMock($element)
            .start()
            .pointerDown()
            .mouseDown();

        assert.strictEqual(stubHandler.callCount, 2);

        nativePointerMock($container)
            .start()
            .pointerDown()
            .mouseDown();

        assert.strictEqual(stubHandler.callCount, 3);
    });

    test('dxpointerup triggers twice on real devices', function(assert) {
        const stubHandler = sinon.stub();

        this.$element.on('dxpointerup', stubHandler);

        const pointer = nativePointerMock(this.$element)
            .start()
            .pointerDown()
            .pointerUp();

        this.clock.tick(300);

        pointer
            .mouseDown()
            .mouseUp();

        assert.strictEqual(stubHandler.callCount, 1);
    });

    $.each({
        'dxpointerdown': POINTER_DOWN_EVENT_NAME,
        'dxpointermove': POINTER_MOVE_EVENT_NAME,
        'dxpointerup': POINTER_UP_EVENT_NAME,
        'dxpointerover': POINTER_OVER_EVENT_NAME,
        'dxpointerout': POINTER_OUT_EVENT_NAME,
        'dxpointerenter': POINTER_ENTER_EVENT_NAME,
        'dxpointerleave': POINTER_LEAVE_EVENT_NAME
    }, (eventName, triggerEvent) => {
        test('\'' + eventName + '\' has pointerType = \'mouse\' if it was triggered by mouse event', function(assert) {
            this.$element.on(eventName, (e) => {
                assert.strictEqual(e.pointerType, 'mouse');
            });

            this.$element.trigger({
                type: triggerEvent,
                pointerType: 'mouse'
            });
        });
    });

    $.each({
        'dxpointerdown': 'pointerdown',
        'dxpointermove': 'pointermove',
        'dxpointerup': 'pointerup',
        'dxpointerover': 'pointerover',
        'dxpointerout': 'pointerout',
        'dxpointerenter': 'pointerenter',
        'dxpointerleave': 'pointerleave'
    }, (eventName, triggerEvent) => {
        test('\'' + eventName + '\' was triggered once', function(assert) {
            const stubHandler = sinon.stub();
            this.$element.on(eventName, stubHandler);

            this.$element.trigger(triggerEvent);

            assert.strictEqual(stubHandler.callCount, 1);
        });
    });

    $.each({
        'dxpointerdown': POINTER_DOWN_EVENT_NAME,
        'dxpointermove': POINTER_MOVE_EVENT_NAME,
        'dxpointerup': POINTER_UP_EVENT_NAME,
        'dxpointerover': POINTER_OVER_EVENT_NAME,
        'dxpointerout': POINTER_OUT_EVENT_NAME,
        'dxpointerenter': POINTER_ENTER_EVENT_NAME,
        'dxpointerleave': POINTER_LEAVE_EVENT_NAME
    }, (eventName, triggerEvent) => {
        test(`'${eventName}' has pointerType = 'touch' if it was triggered by touch event`, function(assert) {
            this.$element.on(eventName, (e) => {
                assert.strictEqual(e.pointerType, 'touch');
            });

            this.$element.trigger({
                type: triggerEvent,
                pointerType: 'touch'
            });
        });
    });

    $.each({
        'dxpointerdown': POINTER_DOWN_EVENT_NAME,
        'dxpointermove': POINTER_MOVE_EVENT_NAME,
        'dxpointerup': POINTER_UP_EVENT_NAME,
        'dxpointerover': POINTER_OVER_EVENT_NAME,
        'dxpointerout': POINTER_OUT_EVENT_NAME,
        'dxpointerenter': POINTER_ENTER_EVENT_NAME,
        'dxpointerleave': POINTER_LEAVE_EVENT_NAME
    }, (eventName, triggerEvent) => {
        test(`'${eventName}' event should have correct pointerId`, function(assert) {
            this.$element.on(eventName, (e) => {
                assert.strictEqual(e.pointerId, 17);
            });

            this.$element.trigger({
                type: triggerEvent,
                pointerType: 'touch',
                pointerId: 17
            });
        });
    });

    if(isPointerEventsSupported) {
        const createEvent = (type, options) => {
            if(isFunction(window.PointerEvent)) {
                return new PointerEvent(type, options);
            }

            const event = document.createEvent('pointerEvent');
            const args = [];
            $.each(['type', 'bubbles', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey',
                'shiftKey', 'metaKey', 'button', 'relatedTarget', 'offsetX', 'offsetY', 'width', 'height', 'pressure', 'rotation', 'tiltX',
                'tiltY', 'pointerId', 'pointerType', 'hwTimestamp', 'isPrimary'], function(i, name) {
                if(name in options) {
                    args.push(options[name]);
                } else {
                    args.push(event[name]);
                }
            });
            event.initPointerEvent.apply(event, args);

            return event;
        };

        const simulatePointerEvent = ($element, type, options) => {
            options = $.extend({
                bubbles: true,
                cancelable: true,
                type: type
            }, options);

            const event = createEvent(type, options);

            $element[0].dispatchEvent(event);
        };

        QUnit.test('dxpointer events should have all touches in pointer array', function(assert) {
            simulatePointerEvent(this.$element, 'pointerdown', { pointerType: 'touch', pointerId: 17 });

            this.$element.on('dxpointerdown', (e) => {
                const pointers = e.pointers;
                assert.strictEqual(pointers[0].pointerId, 17);
                assert.strictEqual(pointers[1].pointerId, 18);
            });

            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'touch', pointerId: 18 });

            this.$element.on('dxpointerup', (e) => {
                const pointers = e.pointers;
                assert.strictEqual(pointers.length, 1);
                assert.strictEqual(pointers[0].pointerId, 18);
            });

            simulatePointerEvent(this.$element, POINTER_UP_EVENT_NAME, { pointerType: 'touch', pointerId: 17 });
        });

        QUnit.test('active touches should be reset if primary pointer is added', function(assert) {
            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'touch', pointerId: 17, isPrimary: false });

            this.$element.on('dxpointerdown', (e) => {
                const pointers = e.pointers;
                assert.strictEqual(pointers.length, 1);
                assert.strictEqual(pointers[0].pointerId, 18);
            });

            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'touch', pointerId: 18, isPrimary: true });
        });

        QUnit.test('pointers in dxpointer events should be updated on mouse move', function(assert) {
            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'touch', pointerId: 17, clientX: 0 });
            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'touch', pointerId: 18, clientX: 100 });

            this.$element.one('dxpointermove', (e) => {
                const pointers = e.pointers;

                assert.strictEqual(pointers[0].pageX, 0);
                assert.strictEqual(pointers[1].pageX, 50);
            });
            simulatePointerEvent(this.$element, POINTER_MOVE_EVENT_NAME, { pointerType: 'touch', pointerId: 18, clientX: 50 });

            this.$element.one('dxpointermove', (e) => {
                const pointers = e.pointers;

                assert.strictEqual(pointers[0].pageX, 20);
                assert.strictEqual(pointers[1].pageX, 50);
            });
            simulatePointerEvent(this.$element, POINTER_MOVE_EVENT_NAME, { pointerType: 'touch', pointerId: 17, clientX: 20 });
        });

        QUnit.test('two pointers with same pointerid should not be present in pointers array', function(assert) {
            this.$element.on('dxpointerdown', (e) => {
                assert.strictEqual(e.pointers.length, 1);
            });
            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'mouse', pointerId: 1 });
            simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: 'mouse', pointerId: 1 });
        });
    }
});
