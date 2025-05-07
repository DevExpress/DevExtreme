const $ = require('jquery');
const transformEvent = require('common/core/events/transform');

$('#qunit-fixture').addClass('qunit-fixture-visible');
QUnit.testStart(function() {
    const markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

const testEventFiring = function(eventName) {
    QUnit.test(eventName + ' should be fired in correct condition', function(assert) {
        assert.expect(2);

        const $element = $('#element');
        let eventFired = 0;

        $element.on(eventName, function(e) {
            eventFired++;
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));

        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
        if(/start$/.test(eventName)) {
            assert.equal(eventFired, 1, 'event fired at first dxpointermove');
        }

        if(!/(start|end)$/.test(eventName)) {
            assert.equal(eventFired, 1, 'event fired at dxpointermove');
        }

        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
        if(/end$/.test(eventName)) {
            assert.equal(eventFired, 1, 'event fired at dxpointerup');
        }

        assert.equal(eventFired, 1, 'event fired only once');
    });
};

const testEventScale = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct scale', function(assert) {
        assert.expect(1);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.equal(e.scale, 0.5);
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};

const testEventDeltaScale = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct deltaScale', function(assert) {
        assert.expect(2);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.equal(e.deltaScale, 0.75);
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 75, pageY: 75 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 56.25, pageY: 56.25 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};

const testEventRotation = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct rotation', function(assert) {
        assert.expect(1);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.ok(Math.abs(e.rotation + Math.PI / 4) < 0.0001);
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 0 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};

const testEventDeltaRotation = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct deltaRotation', function(assert) {
        assert.expect(2);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.ok(Math.abs(e.deltaRotation + Math.PI / 4) < 0.0001);
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 0 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: -100 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};

const testEventTranslation = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct translation', function(assert) {
        assert.expect(1);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.deepEqual(e.translation, {
                x: -25,
                y: -25
            });
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};

const testEventDeltaTranslation = function(eventName) {
    QUnit.test(eventName + ' should be fired with correct deltaTranslation', function(assert) {
        assert.expect(2);

        const $element = $('#element');

        $element.on(eventName, function(e) {
            assert.deepEqual(e.deltaTranslation, {
                x: -12.5,
                y: -12.5
            });
        });

        $element.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 75, pageY: 75 }] }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    });
};


QUnit.module('transform firing');

testEventFiring(transformEvent['transformstart']);
testEventFiring(transformEvent['transform']);
testEventFiring(transformEvent['transformend']);


QUnit.module('transform data');

testEventScale(transformEvent['transform']);
testEventDeltaScale(transformEvent['transform']);
testEventRotation(transformEvent['transform']);
testEventDeltaRotation(transformEvent['transform']);
testEventTranslation(transformEvent['transform']);
testEventDeltaTranslation(transformEvent['transform']);

testEventScale(transformEvent['transformend']);
testEventRotation(transformEvent['transformend']);
testEventTranslation(transformEvent['transformend']);

QUnit.module('translate firing');

testEventFiring(transformEvent['translatestart']);
testEventFiring(transformEvent['translate']);
testEventFiring(transformEvent['translateend']);


QUnit.module('translate data');

testEventTranslation(transformEvent['translate']);
testEventDeltaTranslation(transformEvent['translate']);
testEventTranslation(transformEvent['translateend']);


QUnit.module('pinch firing');

testEventFiring(transformEvent['pinchstart']);
testEventFiring(transformEvent['pinch']);
testEventFiring(transformEvent['pinchend']);


QUnit.module('pinch data');

testEventScale(transformEvent['pinch']);
testEventDeltaScale(transformEvent['pinch']);
testEventScale(transformEvent['pinchend']);


QUnit.module('rotate firing');

testEventFiring(transformEvent['rotatestart']);
testEventFiring(transformEvent['rotate']);
testEventFiring(transformEvent['rotateend']);


QUnit.module('rotate data');

testEventRotation(transformEvent['rotate']);
testEventDeltaRotation(transformEvent['rotate']);
testEventRotation(transformEvent['rotateend']);
