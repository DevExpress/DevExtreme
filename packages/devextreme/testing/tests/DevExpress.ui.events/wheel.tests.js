const $ = require('jquery');
const wheelEvent = require('common/core/events/core/wheel');
const nativePointerMock = require('../../helpers/nativePointerMock.js');

QUnit.testStart(function() {
    const markup =
        '<div id="test"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('wheel');

QUnit.test('basic', function(assert) {
    let fired = 0;
    let args;
    const $element = $('#test');
    const mouse = nativePointerMock($element).start();

    $element.on(wheelEvent.name, function(e) {
        fired++;
        args = e;
    });

    mouse.wheel(1);
    assert.equal(fired, 1, 'wheel fired');
    assert.equal(args.type, wheelEvent.name, 'event type specified');
    assert.ok(args.originalEvent, 'originalEvent provided');
});

QUnit.test('handler fired once', function(assert) {
    let firstHandler = 0;
    let secondHandler = 0;
    const $element = $('#test');
    const $wrapper = $element.wrap('<div>').parent();

    $element.on(wheelEvent.name, function(e) {
        firstHandler++;
    });
    $wrapper.on(wheelEvent.name, function(e) {
        secondHandler++;
    });

    nativePointerMock($element).start().wheel(1);

    assert.equal(firstHandler, 1);
    assert.equal(secondHandler, 1);
});

QUnit.test('provide delta and pointerType in event args', function(assert) {
    let args;
    const $element = $('#test');
    const mouse = nativePointerMock($element).start();

    $element.on(wheelEvent.name, function(e) {
        args = e;
    });

    mouse.wheel(10);
    assert.equal(args.delta, 10, 'wheel delta provided');
    assert.equal(args.pointerType, 'mouse', 'wheel pointerType provided');
});

QUnit.test('normalize delta for deltaMode LINE and PAGE', function(assert) {
    const LINE_MODE = 1;
    const PAGE_MODE = 2;
    const DELTA_MULTIPLIER = 30;
    const DELTA = 3;
    const wheelHandler = sinon.stub();
    const $element = $('#test');
    const mouse = nativePointerMock($element).start();

    $element.on(wheelEvent.name, wheelHandler);

    mouse.wheel(DELTA, { deltaMode: LINE_MODE });
    mouse.wheel(DELTA, { deltaMode: PAGE_MODE });

    assert.strictEqual(wheelHandler.callCount, 2);
    assert.strictEqual(wheelHandler.firstCall.args[0].delta, DELTA * DELTA_MULTIPLIER);
    assert.strictEqual(wheelHandler.lastCall.args[0].delta, DELTA * DELTA_MULTIPLIER);
});

QUnit.test('_getWheelDelta handles different delta combinations correctly', function(assert) {
    const $element = $('#test');
    const mouse = nativePointerMock($element).start();
    let eventArgs;

    $element.on(wheelEvent.name, function(e) {
        eventArgs = e;
    });

    mouse.wheel(10, { deltaX: 5, deltaZ: 0 });
    assert.strictEqual(eventArgs.delta, 10, 'vertical scroll should use deltaY');

    mouse.wheel(0, { deltaX: 5, deltaZ: 0 });
    assert.strictEqual(eventArgs.delta, -5, 'horizontal scroll should use deltaX when deltaY is 0');

    mouse.wheel(0, { deltaX: 0, deltaZ: 0 });
    assert.strictEqual(eventArgs.delta, 0, 'should return 0 when all delta values are 0');
});
