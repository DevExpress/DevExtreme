import $ from 'jquery';
import { compare } from 'core/utils/version';
import { getEventTarget } from 'common/core/events/utils/event_target';
import {
    eventData,
    eventDelta,
    needSkipEvent,
    addNamespace,
    normalizeKeyName,
    getChar,
    isCommandKeyPressed,
} from 'common/core/events/utils/index';
import pointerMock from '../../helpers/pointerMock.js';
import nativePointerMock from '../../helpers/nativePointerMock.js';

const { test, testStart, testInActiveWindow } = QUnit;

const W3CEventProps = [
    'bubbles',
    'cancelable',
    'currentTarget',
    'eventPhase',
    'target',
    'timeStamp',
    'type',
    'preventDefault',
    'stopPropagation'
];

const W3CUIEventProps = W3CEventProps.concat([
    'detail',
    'view'
]);

const W3CMouseEventProps = W3CUIEventProps.concat([
    'altKey',
    'button',
    'clientX',
    'clientY',
    'ctrlKey',
    'metaKey',
    'relatedTarget',
    'screenX',
    'screenY',
    'shiftKey'
]);

const W3CTouchEventProps = W3CUIEventProps.concat([
    'altKey',
    'changedTouches',
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'targetTouches',
    'touches'
]);

const additionalProps = [
    'originalEvent',

    'stopPropagation',
    'stopImmediatePropagation',
    'preventDefault',

    'relatedTarget',
    'delegateTarget',

    'which',
    'button',
    'charCode',

    'pageX',
    'pageY',

    'offsetX',
    'offsetY',
    'isTrusted'
];

const eventOwnProps = ['originalEvent', 'type', 'currentTarget', 'timeStamp'];
const noJQueryEventOwnProps = ['isTrusted'];

testStart(() => {
    const markup = `
        <div id="container">
            <div id="element"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('event utils', () => {
    if(compare($.fn.jquery, [3]) >= 0) {
        const allProps = additionalProps.concat(W3CTouchEventProps);
        $.each(['mousedown', 'mousemove', 'mouseup', 'click', 'keydown', 'keyup'], function(index, eventName) {
            test(`${eventName} support original event properties`, function(assert) {
                const targetElement = $('#element');
                const e = nativePointerMock(targetElement).eventMock(eventName, { delegateTarget: $('#element').get(0) });

                $.each(allProps, function() {
                    assert.ok(this in e || this in e.originalEvent, 'event has \'' + this + '\' property');
                });
                if(!navigator.pointerEnabled && !navigator.msPointerEnabled) {
                    $.each(eventOwnProps, function(_, propName) {
                        assert.ok(Object.prototype.hasOwnProperty.call(e, propName), 'property \'' + this + '\' is own property');
                    });
                    if(QUnit.urlParams['nojquery']) {
                        $.each(noJQueryEventOwnProps, function(_, propName) {
                            assert.ok(Object.prototype.hasOwnProperty.call(e, propName), 'property \'' + this + '\' is own property (no jquery)');
                        });
                    }
                }
            });
        });
    }

    test('mouse support methods', function(assert) {
        const time = new Date().valueOf();
        const targetElement = $('#element');
        const e1 = nativePointerMock(targetElement).eventMock('mousemove', {
            pageX: 1,
            pageY: 2,
            timeStamp: time,
            which: 2
        });
        const e2 = nativePointerMock(targetElement).eventMock('mousemove', {
            pageX: 2,
            pageY: 1,
            timeStamp: time + 50,
            which: 1
        });
        const data1 = eventData(e1);
        const data2 = eventData(e2);
        const delta = eventDelta(data1, data2);

        assert.equal(data1.x, 1, 'eventData x');
        assert.equal(data1.y, 2, 'eventData y');
        assert.ok(data1.time, 'eventData time');

        assert.ok(needSkipEvent(e1), 'skip event');
        assert.ok(!needSkipEvent(e2), 'do not skip event');

        assert.equal(delta.x, 1, 'eventDelta x');
        assert.equal(delta.y, -1, 'eventDelta y');
        assert.ok(delta.time, 50);
    });

    if(compare($.fn.jquery, [3]) < 0) {
        test('touch support methods', function(assert) {
            const targetElement = $('#element');
            const e1 = nativePointerMock(targetElement).eventMock('touchmove', {
                touches: [{
                    pageX: 1,
                    pageY: 2
                }],
                timeStamp: new Date().valueOf()
            });
            const data1 = eventData(e1);

            assert.equal(data1.x, 1, 'eventData x');
            assert.equal(data1.y, 2, 'eventData y');
            assert.ok(data1.time, 'eventData time');

            assert.ok(!needSkipEvent(e1), 'do not skip event');
        });
    }

    test('mspointer support methods', function(assert) {
        const targetElement = $('#element');
        const e1 = nativePointerMock(targetElement).eventMock('MSPointerMove', {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: 2
        });

        nativePointerMock(targetElement).eventMock('MSPointerMove', {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, 'eventData x');
        assert.equal(data1.y, 2, 'eventData y');
        assert.ok(data1.time, 'eventData time');
    });

    test('pointer support methods', function(assert) {
        const targetElement = $('#element');
        const e1 = nativePointerMock(targetElement).eventMock('pointermove', {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: 'touch'
        });

        nativePointerMock(targetElement).eventMock('pointermove', {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, 'eventData x');
        assert.equal(data1.y, 2, 'eventData y');
        assert.ok(data1.time, 'eventData time');
    });

    test('dxpointer support methods', function(assert) {
        const targetElement = $('#element');
        const e1 = nativePointerMock(targetElement).eventMock('dxpointermove', {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: 'touch'
        });

        nativePointerMock(targetElement).eventMock('dxpointermove', {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, 'eventData x');
        assert.equal(data1.y, 2, 'eventData y');
        assert.ok(data1.time, 'eventData time');
    });

    test('addNamespace method', function(assert) {
        const event = addNamespace('custom', 'Widget');
        const severalEventsByString = addNamespace('custom1 custom2', 'Widget');
        const severalEventsByArray = addNamespace(['custom1', 'custom2'], 'Widget');

        assert.equal(event, 'custom.Widget', 'custom event name');
        assert.equal(severalEventsByString, 'custom1.Widget custom2.Widget', 'several custom event names');
        assert.equal(severalEventsByArray, 'custom1.Widget custom2.Widget', 'several custom event names');
    });

    [
        {
            testData: { key: 'Backspace' },
            expected: 'backspace',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Tab' },
            expected: 'tab',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Enter' },
            expected: 'enter',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Escape' },
            expected: 'escape',
            comment: 'Standard API'
        },
        {
            testData: { key: 'PageUp' },
            expected: 'pageUp',
            comment: 'Standard API'
        },
        {
            testData: { key: 'PageDown' },
            expected: 'pageDown',
            comment: 'Standard API'
        },
        {
            testData: { key: 'End' },
            expected: 'end',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Home' },
            expected: 'home',
            comment: 'Standard API'
        },
        {
            testData: { key: 'ArrowLeft' },
            expected: 'leftArrow',
            comment: 'Standard API'
        },
        {
            testData: { key: 'ArrowUp' },
            expected: 'upArrow',
            comment: 'Standard API'
        },
        {
            testData: { key: 'ArrowRight' },
            expected: 'rightArrow',
            comment: 'Standard API'
        },
        {
            testData: { key: 'ArrowDown' },
            expected: 'downArrow',
            comment: 'Standard API'
        },
        {
            testData: { key: 'f' },
            expected: 'F',
            comment: 'Standard API'
        },
        {
            testData: { key: ' ' },
            expected: 'space',
            comment: 'Standard API'
        },
        {
            testData: { key: 'a' },
            expected: 'A',
            comment: 'Standard API'
        },
        {
            testData: { key: '*' },
            expected: 'asterisk',
            comment: 'Standard API'
        },
        {
            testData: { key: '-' },
            expected: 'minus',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Control' },
            expected: 'control',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Alt' },
            expected: 'alt',
            comment: 'Standard API'
        },
        {
            testData: { key: 'Shift' },
            expected: 'shift',
            comment: 'Standard API'
        },
        {
            testData: { key: 'ArrowUp', which: 36 },
            expected: 'upArrow',
            comment: '\'key\' attribute is prior'
        },
        {
            testData: { },
            expected: undefined,
            comment: 'return undefined in case event has no \'key\' or \'which\' attribute'
        },
        // Legacy & iOS 10.2-
        {
            testData: { which: 8 },
            expected: 'backspace',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 9 },
            expected: 'tab',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 13 },
            expected: 'enter',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 27 },
            expected: 'escape',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 33 },
            expected: 'pageUp',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 34 },
            expected: 'pageDown',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 35 },
            expected: 'end',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 36 },
            expected: 'home',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 37 },
            expected: 'leftArrow',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 38 },
            expected: 'upArrow',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 39 },
            expected: 'rightArrow',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 40 },
            expected: 'downArrow',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 46 },
            expected: 'del',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 32 },
            expected: 'space',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 70 },
            expected: 'F',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 65 },
            expected: 'A',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 106 },
            expected: 'asterisk',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 109 },
            expected: 'minus',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 189 },
            expected: 'minus',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 173 },
            expected: 'minus',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 16 },
            expected: 'shift',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 17 },
            expected: 'control',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { which: 18 },
            expected: 'alt',
            comment: '\'which\' attribute used where \'key\' attribute unsupported'
        },
        {
            testData: { key: 'â', which: 65 },
            expected: 'A',
            comment: '\'which\' attribute used where \'key\' attribute value is unknown (non-invariant locale)'
        },
        {
            testData: { key: 'ƒ', which: 70 },
            expected: 'F',
            comment: '\'which\' attribute used where \'key\' attribute value is unknown (non-invariant locale)'
        },
        // T1094718
        {
            testData: { key: 'F2', which: 113 },
            expected: 'F2',
            comment: '\'key\' attribute is prior'
        }
    ].forEach(({ testData, expected, comment }) => {
        test(`normalizeKeyName(${testData.key || testData.which || 'undefined'}) method should normalize key name based on "key" or "which" field`, function(assert) {
            assert.strictEqual(normalizeKeyName(testData), expected, comment);
        });
    });

    test('getChar method should get char based on \'key\' or \'which\' attribute', function(assert) {
        assert.strictEqual(getChar({ key: 'z' }), 'z');
        assert.strictEqual(getChar({ which: 50 }), '2');
        assert.strictEqual(getChar({ key: 'z', which: 50 }), 'z', '\'key\' attribute is prior');

    });

    [false, true].forEach((metaKey) => {
        [false, true].forEach((ctrlKey) => {
            const expectedResult = metaKey || ctrlKey;
            const event = { ctrlKey, metaKey };

            test(`"isCommandKeyPressed" should return ${expectedResult} (metaKey=${metaKey}, ctrlKey=${ctrlKey})`, function(assert) {
                assert.strictEqual(isCommandKeyPressed(event), expectedResult, `command key is ${expectedResult ? '' : 'not'} pressed (metaKey=${metaKey}, ctrlKey=${ctrlKey})`);
            });
        });
    });
});

QUnit.module('getEventTarget', () => {
    test('should return composedPath first element if originalEvent.target is shadowRoot', function(assert) {
        const root = document.getElementById('qunit-fixture');

        const $element = $('#element');
        const $div = $('<div>');

        $element.append($div);

        const customEvent = $.Event('customEvent', {
            originalEvent: $.Event('customEvent', {
                target: root,
                composedPath: () => [$div.get(0)]
            })
        });

        const target = getEventTarget(customEvent);

        const expectedTarget = root.shadowRoot ? $div.get(0) : root;
        assert.strictEqual(target, expectedTarget, 'target is correct');
    });

    test('should return event.target if originalEvent path is undefined in shadowRoot', function(assert) {
        const root = document.getElementById('qunit-fixture');

        const $element = $('#element');
        const $div = $('<div>');

        $element.append($div);

        const customEvent = $.Event('customEvent', {
            originalEvent: $.Event('customEvent', {
                target: root,
                composedPath: () => null,
            })
        });

        const target = getEventTarget(customEvent);

        assert.strictEqual(target, root, 'target is correct');
    });
});

QUnit.module('skip mousewheel event test', () => {
    const needSkipMouseWheel = element => {
        const mouse = pointerMock(element);
        let needSkip;

        element.on({
            'dxmousewheel': e => {
                needSkip = needSkipEvent(e);
            }
        });

        mouse.wheel();
        return needSkip;
    };

    const checkSkippedMouseWheelEvent = ($container, selector) => needSkipMouseWheel($container.find(selector).first());

    testInActiveWindow('needSkipEvent returns true for number input wheel', function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, 'this test run only in webkit');
            return;
        }

        let element;

        try {
            element = $('<input type=\'number\' />')
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns true for text input wheel', function(assert) {
        let element;
        try {
            element = $('<input type=\'text\' />')
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.ok(!needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns true for textarea input wheel', function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, 'this test run only in webkit');
            return;
        }

        let element;
        try {
            element = $('<textarea></textarea>')
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns true for select input wheel', function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, 'this test run only in webkit');
            return;
        }

        let element;
        try {
            element = $('<select><option /><option /><option /></select>')
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns false for contentEditable element', function(assert) {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h>Test</h>
                    <div class="text">
                        <b>Bold</b>
                    </div>
                </div>
            `)
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.notOk(checkSkippedMouseWheelEvent($element, 'h'), 'event is skipped for the h tag');
            assert.notOk(checkSkippedMouseWheelEvent($element, '.text'), 'event is skipped for the element with the \'text\' class name');
            assert.notOk(checkSkippedMouseWheelEvent($element, 'b'), 'event is skipped for the b tag');
        } catch(e) {
            $element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns false for element with contenteditable false', function(assert) {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h contenteditable="false">Test</h>
                    <div contenteditable="false" class="text">
                        <b contenteditable="false">Bold</b>
                    </div>
                </div>
            `)
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.notOk(checkSkippedMouseWheelEvent($element, 'h'), 'event is skipped for the h tag');
            assert.notOk(checkSkippedMouseWheelEvent($element, '.text'), 'event is skipped for the element with the \'text\' class name');
            assert.notOk(checkSkippedMouseWheelEvent($element, 'b'), 'event is skipped for the b tag');
        } catch(e) {
            $element.remove();
        }
    });

    testInActiveWindow('needSkipEvent returns false for the contentEditable element when this element is not focused', function(assert) {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h>Test</h>
                    <div class="text">
                        <b>Bold</b>
                    </div>
                </div>
            `).appendTo('#qunit-fixture');

            assert.notOk(checkSkippedMouseWheelEvent($element, 'h'), 'event is skipped for the h tag');
            assert.notOk(checkSkippedMouseWheelEvent($element, '.text'), 'event is skipped for the element with the \'text\' class name');
            assert.notOk(checkSkippedMouseWheelEvent($element, 'b'), 'event is skipped for the b tag');
        } catch(e) {
            $element.remove();
        }
    });
});

QUnit.module('skip mouse event tests', () => {
    const needSkipMouseDown = (element, selector) => {
        const target = selector ? element.find(selector).first() : element;
        const mouse = nativePointerMock(target);
        let needSkip;

        target.on({
            'mousedown': e => {
                needSkip = needSkipEvent(e);
            }
        });
        mouse.mouseDown();
        return needSkip;
    };

    test('needSkipEvent returns true for input click', function(assert) {
        const element = $('<input type=\'text\' />');
        assert.ok(needSkipMouseDown(element));
    });

    test('needSkipEvent returns true for textarea click', function(assert) {
        const element = $('<textarea></textarea>');
        assert.ok(needSkipMouseDown(element));
    });

    test('needSkipEvent returns true for select click', function(assert) {
        const element = $('<select><option /><option /><option /></select>');
        assert.ok(needSkipMouseDown(element));
    });

    test('needSkipEvent returns true for clicking the contenteditable', function(assert) {
        const element = $(`
        <div contenteditable="true">
            <h1>Test</h1>
            <div class="text">
                <b>Bold</b>
            </div>
        </div>
    `);
        assert.ok(needSkipMouseDown(element, 'h1'));
        assert.ok(needSkipMouseDown(element, '.text'));
        assert.ok(needSkipMouseDown(element, 'b'));
    });

    test('needSkipEvent returns true for div click', function(assert) {
        const element = $('<div />');
        assert.ok(!needSkipMouseDown(element));
    });
});

QUnit.module('skip pointer event tests', () => {
    const needSkipPointerDown = element => {
        const mouse = nativePointerMock(element);
        let needSkip;

        element.on({
            'touchstart': e => {
                needSkip = needSkipEvent(e);
            }
        });
        mouse.touchStart();
        return needSkip;
    };

    testInActiveWindow('needSkipEvent returns true for focused input click (B254465)', function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, 'this test run only in webkit');
            return;
        }

        let element;
        try {
            element = $('<input type=\'text\' />')
                .appendTo('#qunit-fixture')
                .trigger('focus');

            assert.ok(needSkipPointerDown(element));
        } finally {
            element.remove();
        }
    });

    test('needSkipEvent returns false for not focused input click', function(assert) {
        const element = $('<input type=\'text\' />');
        assert.ok(!needSkipPointerDown(element));
    });

    test('needSkipEvent returns false for div click', function(assert) {
        const element = $('<div />');
        assert.ok(!needSkipPointerDown(element));
    });
});

if(compare($.fn.jquery, [3]) < 0) {
    QUnit.module('JQuery integration', () => {
        const W3CPointerEventProps = W3CMouseEventProps.concat([
            'pointerId',
            'pointerType',
            'width',
            'height',
            'pressure',
            'tiltX',
            'tiltY',
            'isPrimary'
        ]);

        const jQueryAdditionalProps = [
            'originalEvent',

            'stopPropagation',
            'isPropagationStopped',
            'stopImmediatePropagation',
            'isImmediatePropagationStopped',
            'preventDefault',
            'isDefaultPrevented',

            'result',
            'data',

            'relatedTarget',
            'delegateTarget',
            'originalTarget',

            'which',
            'button',
            'charCode',

            'pageX',
            'pageY',

            'clientX',
            'clientY',

            'offsetX',
            'offsetY',

            'screenX',
            'screenY',

            'prevValue'
        ];


        if('ontouchstart' in window && !('callPhantom' in window)) {
            $.each(['touchstart', 'touchmove', 'touchend', 'touchcancel'], (index, eventName) => {
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/touch-eventUtils/)`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(W3CTouchEventProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, function(assert) {
                    assert.expect(0);

                    const element = $('#element')
                        .on(eventName + '.Test', (e) => {
                            assert.ok(false);
                        })
                        .off('.Test')
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });
            });
        }

        if(navigator.msPointerEnabled) {
            $.each(['MSPointerDown', 'MSPointerMove', 'MSPointerUp'], (index, eventName) => {
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(W3CPointerEventProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, function(assert) {
                    assert.expect(0);

                    const element = $('#element')
                        .on(eventName + '.Test', (e) => {
                            assert.ok(false);
                        })
                        .off('.Test')
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });
            });
        }

        if(navigator.pointerEnabled) {
            $.each(['pointerdown', 'pointermove', 'pointerup'], function(index, eventName) {
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(W3CPointerEventProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, function(assert) {
                    const element = $('#element')
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, 'event has \'' + this + '\' property');
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, function(assert) {
                    assert.expect(0);

                    const element = $('#element')
                        .on(eventName + '.Test', (e) => {
                            assert.ok(false);
                        })
                        .off('.Test')
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });
            });
        }
    });

    QUnit.module('regressions', () => {
        $.each('touchstart touchend touchmove touchcancel'.split(' '), (_, eventName) => {
            test(eventName + ' - some event properties should not be undefined', function(assert) {
                const event = $.event.fix({ type: eventName, touches: [], changedTouches: [{ screenX: 123, screenY: 321, clientX: 345, clientY: 543, pageX: 678, pageY: 876 }] });

                assert.equal(event.screenX, 123, 'event.screenX is defined');
                assert.equal(event.screenY, 321, 'event.screenY is defined');

                assert.equal(event.clientX, 345, 'event.clientX is defined');
                assert.equal(event.clientY, 543, 'event.clientY is defined');

                assert.equal(event.pageX, 678, 'event.pageX is defined');
                assert.equal(event.pageY, 876, 'event.pageY is defined');
            });
        });
    });
}
