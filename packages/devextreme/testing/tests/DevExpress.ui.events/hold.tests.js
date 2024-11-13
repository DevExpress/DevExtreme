const $ = require('jquery');
const holdEvent = require('common/core/events/hold');
const pointerMock = require('../../helpers/pointerMock.js');

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element"></div>\
        </div>\
        <div id="parent">\
            <div id="child1"></div>\
            <div id="child2"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('hold', {
    beforeEach: function() {
        this.element = $('#element');
        this.container = $('#container');

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('default', function(assert) {
    let fired = 0;
    const element = this.element;
    const pointer = pointerMock(element);

    element.on(holdEvent.name, function() {
        fired++;
    });

    assert.ok(!fired);

    pointer
        .start()
        .down();
    this.clock.tick(1800);
    pointer.up();

    assert.equal(fired, 1);

    pointer.down();
    this.clock.tick(1800);
    assert.equal(fired, 2);
});

QUnit.test('custom timeout', function(assert) {
    let fired = 0;

    const element = this.element.on(holdEvent.name, { timeout: 10 }, function() {
        assert.equal(++fired, 1);
    });

    assert.ok(!fired);

    const pointer = pointerMock(element);

    pointer
        .start()
        .down();
    this.clock.tick(10);
    pointer
        .wait(10)
        .up();
});

QUnit.test('handler has right args', function(assert) {
    const element = this.element;
    const pointer = pointerMock(element);

    element.on(holdEvent.name, { timeout: 10 }, function(e) {
        assert.strictEqual(e.target, element[0]);
    });

    pointer
        .start()
        .down();
    this.clock.tick(10);
    pointer
        .wait(10)
        .up();
});

QUnit.test('delegated handlers', function(assert) {
    const element = this.element;
    const container = this.container;

    const nested = element.append('<div>').children();

    container.on(holdEvent.name, '#element', { timeout: 10 }, function(e) {
        assert.strictEqual(e.target, nested[0]);
        assert.strictEqual(e.delegateTarget, container[0]);
    });

    const pointer = pointerMock(nested);

    pointer
        .start()
        .down();
    this.clock.tick(10);
    pointer
        .wait(10)
        .up();
});

QUnit.test('hold event should be fired if content scrolled less then 5 pixels', function(assert) {
    assert.expect(1);

    const element = this.element;
    const container = this.container;

    container.on(holdEvent.name, '#element', { timeout: 10 }, function(e) {
        assert.ok(true, 'hold should not be fired');
    });

    const pointer = pointerMock(element);

    pointer
        .start()
        .down();
    this.clock.tick(10);
    pointer
        .wait(10)
        .up();
});

QUnit.test('hold event should not be fired if content scrolled more then 5 pixels', function(assert) {
    assert.expect(0);

    const element = this.element;
    const container = this.container;

    container.on(holdEvent.name, '#element', { timeout: 10 }, function(e) {
        assert.ok(false, 'hold should not be fired');
    });

    const pointer = pointerMock(element);

    pointer
        .start()
        .down()
        .move(6, 0);
    this.clock.tick(10);
    pointer
        .wait(10)
        .up();
});

QUnit.test('event stopPropagation', function(assert) {
    const $element = $('#element');
    const $container = $('#container');
    let holdFired = 0;

    $container.on(holdEvent.name, function(e) {
        holdFired++;
    });

    $element.on(holdEvent.name, function(e) {
        holdFired++;
        e.stopPropagation();
    });

    const pointer = pointerMock($element);

    pointer
        .start()
        .down();
    this.clock.tick(800);
    pointer
        .wait(800)
        .up();

    assert.equal(holdFired, 1, 'hold fired once');
});

QUnit.test('hold with multitouch', function(assert) {
    let count = 0;
    $('#parent').on(holdEvent.name, function() {
        count++;
    });

    pointerMock('#child1').start().down();
    pointerMock('#child2').start().down();
    this.clock.tick(800);

    assert.equal(count, 1, 'hold event fired once');
});

QUnit.test('hold was prevented after second finger was moved', function(assert) {
    let count = 0;
    $('#parent').on(holdEvent.name, function() {
        count++;
    });

    pointerMock('#child1').start().down();
    pointerMock('#child2').start().down().move(10);
    this.clock.tick(800);

    assert.equal(count, 0, 'hold event was not fired');
});

QUnit.test('several handlers on one element', function(assert) {
    let count = 0;
    const $element = $('#element');

    $element.on(holdEvent.name, function() {
        count++;
    }).on(holdEvent.name, function() {
        count++;
    });

    pointerMock($element).start().down();
    this.clock.tick(800);
    assert.equal(count, 2, 'several handlers was handled');
});
