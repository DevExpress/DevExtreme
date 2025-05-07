const $ = require('jquery');
const noop = require('core/utils/common').noop;
const devices = require('core/devices');
const feedbackEvents = require('common/core/events/core/emitter.feedback');
const pointerMock = require('../../helpers/pointerMock.js');

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element" class="item">\
                <div id="elementContent"></div>\
            </div>\
            <div id="neighbor" class="item"></div>\
            <div id="anotherNeighbor" class="item"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('feedback touch', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('dxactive should be fired after pointerdown with timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let activeFired = 0;

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        activeFired++;
    });

    pointer.start('touch').down();
    assert.equal(activeFired, 0, 'active does\'n fired immediately after pointerdown');
    this.clock.tick(10);
    assert.equal(activeFired, 1, 'active fired after timeout');
});

QUnit.test('dxinactive should be fired after pointerup with timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('touch').down().up();
    assert.equal(inactiveFired, 0, 'inactive does\'n fired immediately after pointerup');
    this.clock.tick(100);
    assert.equal(inactiveFired, 1, 'inactive fired after timeout');
});

QUnit.test('dxactive should be fired after pointerup if active timeout is not finished', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let activeFired = 0;

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        activeFired++;
    });

    pointer.start('touch').down().up();
    assert.equal(activeFired, 1, 'active fired immediately after pointerup');
    this.clock.tick(10);
    assert.equal(activeFired, 1, 'active does not fired after timeout');
});

QUnit.test('dxactive should not be fired after pointerup if active timeout is finished', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let activeFired = 0;

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        activeFired++;
    });

    pointer.start('touch').down();
    this.clock.tick(10);
    pointer.up();
    assert.equal(activeFired, 1, 'active does not fired after timeout');
});

QUnit.test('dxactive should not bubble', function(assert) {
    const $element = $('#element');
    const $container = $('#container');
    const pointer = pointerMock($element);

    $container.on(feedbackEvents.active, { timeout: 10 }, function() {
        assert.ok(false, 'active fired on parent');
    });

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        assert.ok(true, 'active fired on child');
    });

    pointer.start('touch').down();
    this.clock.tick(10);
});

QUnit.test('dxinactive should be fired immediately after several pointerdown', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        assert.ok(true, 'inactive fired immediately');
    });

    pointer.start('touch').down().up().down();
    this.clock.tick(100);
});

QUnit.test('dxinactive should be fired immediately after pointerdown on another element', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const $neighbor = $('#neighbor');

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        assert.ok(true, 'inactive fired immediately');
    });
    $neighbor.on(feedbackEvents.active, noop);

    pointerMock($element).start('touch').down().up();
    pointerMock($neighbor).start('touch').down();
});

QUnit.test('dxactive should be fired on parent element if child was active before', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const $elementContent = $('#elementContent');

    $element.on(feedbackEvents.active, { timeout: 100 }, function() {
        assert.ok(true, 'active fired');
    });
    $elementContent.on(feedbackEvents.active, { timeout: 100 }, noop);

    pointerMock($elementContent).start('touch').down().up();
    pointerMock($element).start('touch').down();
    this.clock.tick(100);
});

QUnit.test('dxinactive should not be fired on parent element if child is activated', function(assert) {
    const $element = $('#element');
    const $elementContent = $('#elementContent');
    let inactiveFiredCount = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFiredCount++;
    });
    $elementContent.on(feedbackEvents.inactive, { timeout: 100 }, noop);

    pointerMock($element).start('touch').down().up();
    pointerMock($elementContent).start('touch').down().up();
    this.clock.tick(100);
    assert.equal(inactiveFiredCount, 1, 'inactive on parent fired once');
});

QUnit.test('dxinactive should be fired after other dxinactive unsubscribed', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const $neighbor = $('#neighbor');
    const $anotherNeighbor = $('#anotherNeighbor');

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        assert.ok(true, 'inactive fired');
    });
    $neighbor.on(feedbackEvents.inactive, { timeout: 100 }, noop);
    $anotherNeighbor.on(feedbackEvents.inactive, { timeout: 100 }, noop);

    pointerMock($element).start('touch').down().up();
    $anotherNeighbor.off(feedbackEvents.inactive);
    pointerMock($neighbor).start('touch').down().up();
});

QUnit.test('dxinactive should not be fired immediately after other dxinactive unsubscribed', function(assert) {
    assert.expect(0);

    const $element = $('#element');
    const $anotherNeighbor = $('#anotherNeighbor');

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        assert.ok(false, 'inactive not fired');
    });
    $anotherNeighbor.on(feedbackEvents.inactive, { timeout: 100 }, noop);

    pointerMock($element).start('touch').down().up();
    $anotherNeighbor.off(feedbackEvents.inactive);
});


QUnit.module('feedback mouse', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('dxactive should be fired after mousedown without timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let activeFired = 0;

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        activeFired++;
    });

    pointer.start('mouse').down();
    this.clock.tick(0);
    assert.equal(activeFired, 1, 'active fired immediately');
});

QUnit.test('dxinactive should be fired after mouseup without timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('mouse').down().up();
    this.clock.tick(0);
    assert.equal(inactiveFired, 1, 'inactive fired immediately');
});

QUnit.test('dxactive should be fired on parent element if child was active before', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const $elementContent = $('#elementContent');

    $element.on(feedbackEvents.active, { timeout: 100 }, function() {
        assert.ok(true, 'active fired');
    });
    $elementContent.on(feedbackEvents.active, { timeout: 100 }, noop);

    pointerMock($elementContent).start('mouse').down().up();
    pointerMock($element).start('mouse').down();
    this.clock.tick(0);
});


QUnit.module('feedback simulator', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.isSimulator = sinon.stub(devices, 'isSimulator').callsFake(function() { return true; });
    },

    afterEach: function() {
        this.clock.restore();
        this.isSimulator.restore();
    }
});

QUnit.test('dxactive should be fired after mousedown with timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let activeFired = 0;

    $element.on(feedbackEvents.active, { timeout: 10 }, function() {
        activeFired++;
    });

    pointer.start('mouse').down();
    assert.equal(activeFired, 0, 'active does\'n fired immediately after pointerdown');
    this.clock.tick(10);
    assert.equal(activeFired, 1, 'active fired after timeout');
});

QUnit.test('dxinactive should be fired after mouseup with timeout', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('mouse').down().up();
    assert.equal(inactiveFired, 0, 'inactive does\'n fired immediately after pointerup');
    this.clock.tick(100);
    assert.equal(inactiveFired, 1, 'inactive fired after timeout');
});


QUnit.module('delegated feedback touch', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('dxactive should have correct currentTarget', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');
    const $item = $items.eq(0);

    $container.on('dxactive', '.item', { timeout: 0 }, function(e) {
        assert.equal(e.currentTarget, $item.get(0), 'current target correct');
    });

    pointerMock($item).start('touch').down();
    this.clock.tick(0);
});

QUnit.test('dxinactive should have correct currentTarget', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');
    const $item = $items.eq(0);

    $container.on('dxinactive', '.item', { timeout: 0 }, function(e) {
        assert.equal(e.currentTarget, $item.get(0), 'current target correct');
    });

    pointerMock($item).start('touch').down().up();
    this.clock.tick(0);
});

QUnit.test('dxactive should have correct currentTarget if timeout is not finished', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');
    const $item = $items.eq(0);

    $container.on('dxactive', '.item', { timeout: 100 }, function(e) {
        assert.equal(e.currentTarget, $item.get(0), 'current target correct');
    });

    pointerMock($item).start('touch').down().up();
});

QUnit.test('dxinactive should have correct currentTarget if timeout is not finished', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');
    const $item = $items.eq(0);

    $container.on(feedbackEvents.inactive, '.item', { timeout: 100 }, function(e) {
        assert.equal(e.currentTarget, $item.get(0), 'current target correct');
    });

    pointerMock($item).start('touch').down().up().down();
});

QUnit.test('dxinactive should have correct currentTarget if timeout is not finished and target is changed', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');

    $container.on(feedbackEvents.inactive, '.item', { timeout: 100 }, function(e) {
        assert.equal(e.currentTarget, $items.eq(0).get(0), 'current target correct');
    });

    pointerMock($items.eq(0)).start('touch').down().up();
    pointerMock($items.eq(1)).start('touch').down();
});

QUnit.test('dxactive should be fired after remove DOM node', function(assert) {
    const $elementContent = $('#elementContent');
    const $container = $('#container');

    $container.on(feedbackEvents.active, '.item', { timeout: 10 }, function() {
        assert.ok(true, 'active fired');
    });

    pointerMock($elementContent).start('touch').down();
    $elementContent.detach();
    this.clock.tick(10);
});

QUnit.test('dxinactive should be fired after remove DOM node', function(assert) {
    const $elementContent = $('#elementContent');
    const $container = $('#container');

    $container.on(feedbackEvents.inactive, '.item', { timeout: 10 }, function() {
        assert.ok(true, 'inactive fired');
    });

    pointerMock($elementContent).start('touch').down().up();
    $elementContent.detach();
    this.clock.tick(10);
});


QUnit.module('feedback lock', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('lockfeedback should not fail if active emitter not present', function(assert) {
    assert.expect(0);
    feedbackEvents.lock($.Deferred().promise());
});

QUnit.test('dxinactive should not be fired after timeout if event is locked', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('touch').down().up();
    this.clock.tick(99);
    feedbackEvents.lock($.Deferred());
    this.clock.tick(1);
    assert.equal(inactiveFired, 0, 'inactive not fired after timeout');
});

QUnit.test('dxinactive should be fired after lock released if event is locked', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('touch').down().up();
    this.clock.tick(99);
    feedbackEvents.lock($.Deferred().resolve());
    this.clock.tick(1);
    assert.equal(inactiveFired, 1, 'inactive fired after lock release');
});

QUnit.test('dxinactive should not be fired after timeout if event is locked during gesture', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.active, { timeout: 0 }, noop);
    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('touch').down();
    this.clock.tick(1);
    feedbackEvents.lock($.Deferred());
    pointer.up();
    this.clock.tick(100);
    assert.equal(inactiveFired, 0, 'inactive not fired after timeout');
});

QUnit.test('dxactive should be fired after lock immediately', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(feedbackEvents.active, { timeout: 100 }, function() {
        assert.ok(true);
    });

    pointer.start('touch').down();
    feedbackEvents.lock($.Deferred());
});

QUnit.test('dxinactive should be fired after lock released if event is locked during gesture', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start('touch').down();
    this.clock.tick(1);
    feedbackEvents.lock($.Deferred().resolve());
    pointer.up();
    this.clock.tick(100);
    assert.equal(inactiveFired, 1, 'inactive fired after lock release');
});

QUnit.test('locked dxinactive should not be fired after new active emitter activate', function(assert) {
    const $element = $('#element');
    const $neighbor = $('#neighbor');
    let inactiveFired = 0;

    $element.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });
    $neighbor.on(feedbackEvents.inactive, { timeout: 100 }, noop);

    pointerMock($element).start('touch').down().up();
    feedbackEvents.lock($.Deferred());
    pointerMock($neighbor).start('touch').down().up();
    assert.equal(inactiveFired, 0, 'inactive not fired');
});

QUnit.test('dxinactive should be fired after each lock release', function(assert) {
    const $container = $('#container');
    const $items = $container.find('.item');
    const targets = [];

    $container.on(feedbackEvents.inactive, '.item', { timeout: 100 }, function(e) {
        targets.push(e.target);
    });

    const deferred = $.Deferred();
    pointerMock($items.eq(0)).start('touch').down().up();
    feedbackEvents.lock(deferred);

    pointerMock($items.eq(1)).start('touch').down().up();
    feedbackEvents.lock(deferred);

    deferred.resolve();
    assert.deepEqual(targets, [$items[0], $items[1]], 'inactive not fired');
});

QUnit.test('dxinactive should be fired on child element if parent with feedback present', function(assert) {
    const $element = $('#element');
    const $elementContent = $('#elementContent');
    let inactiveFired = 0;
    const deferred = $.Deferred();

    $element.on(feedbackEvents.inactive, { timeout: 100 }, noop);
    $elementContent.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointerMock($elementContent).start('touch').down().up();
    feedbackEvents.lock(deferred);
    this.clock.tick(100);
    assert.equal(inactiveFired, 0, 'inactive not fired');
    deferred.resolve();
    assert.equal(inactiveFired, 1, 'inactive not fired');
});

QUnit.test('dxinactive should be fired after unlock neighbor element', function(assert) {
    assert.expect(1);

    const $container = $('#container');
    const $items = $container.find('.item');
    let inactiveFired = 0;
    const deferred = $.Deferred();

    $container.on(feedbackEvents.inactive, '.item', { timeout: 100 }, function(e) {
        inactiveFired++;
    });

    pointerMock($items.eq(0)).start('touch').down().up();
    feedbackEvents.lock(deferred);

    pointerMock($items.eq(1)).start('touch').down().up();

    pointerMock($items.eq(2)).start('touch').down().up();
    deferred.resolve();
    this.clock.tick(100);

    assert.equal(inactiveFired, 3, 'inactive fired');
});
