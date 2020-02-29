const $ = require('jquery');
const wheelEvent = require('events/core/wheel');
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
