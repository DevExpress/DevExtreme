const $ = require('jquery');
const devices = require('core/devices');
const hoverEvents = require('common/core/events/hover');

QUnit.testStart(function() {
    const markup =
        '<div id="container" class="container">\
            <div id="element" class="element"></div>\
            <div id="second-element"></div>\
        </div>\
        <div class="container">\
            <div class="element"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const POINTER_ENTER = 'dxpointerenter';
const POINTER_LEAVE = 'dxpointerleave';

QUnit.module('hover', {
    beforeEach: function() {
        this.$element = $('#element');
    }
});

QUnit.test('hover start', function(assert) {
    let hoverStartFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        });

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));

    assert.equal(hoverStartFired, 1);
});

QUnit.test('hover end', function(assert) {
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        });

    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));

    assert.equal(hoverEndFired, 1);
});

QUnit.test('hover start/end', function(assert) {
    let hoverStartFired = 0;
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        });

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));
    assert.equal(hoverStartFired, 1);
    assert.equal(hoverEndFired, 0);

    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));
    assert.equal(hoverStartFired, 1);
    assert.equal(hoverEndFired, 1);
});

QUnit.test('hover event with two delegated subscriptions on the same element (T430275)', function(assert) {
    let firstSubscription = 0;
    let secondSubscription = 0;
    const $element = this.$element;
    const $secondElement = $('#second-element');
    const $container = $('#container');

    $container
        .on(hoverEvents.start, '#element', function() {
            firstSubscription++;
        })
        .on(hoverEvents.start, '#second-element', function() {
            secondSubscription++;
        });

    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $element[0] }));
    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $secondElement[0] }));

    assert.equal(firstSubscription, 1);
    assert.equal(secondSubscription, 1);
});

QUnit.test('hover event with two delegated subscriptions on the same element fire after remove one of them', function(assert) {
    let subscription = 0;
    let removedSubscription = 0;
    const $element = this.$element;
    const $secondElement = $('#second-element');
    const $container = $('#container');
    const subscriptionToRemove = function() {
        removedSubscription++;
    };

    $container
        .on(hoverEvents.start, '#element', subscriptionToRemove)
        .on(hoverEvents.start, '#second-element', function() {
            subscription++;
        })
        .off(hoverEvents.start, '#element', subscriptionToRemove);

    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $element[0] }));
    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $secondElement[0] }));

    assert.equal(removedSubscription, 0);
    assert.equal(subscription, 1);
});

QUnit.test('hover event fires twice after updating delegated subscription', function(assert) {
    let hoverEventFired = 0;
    const $element = this.$element;
    const $container = $('#container');
    const subscriptionToRemove = function() {
        hoverEventFired++;
    };

    $container
        .on(hoverEvents.start, '#element', subscriptionToRemove)
        .off(hoverEvents.start, '#element', subscriptionToRemove)
        .on(hoverEvents.start, '#element', subscriptionToRemove);

    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $element[0] }));

    assert.equal(hoverEventFired, 1);
});

QUnit.test('hover start/end teardown', function(assert) {
    let hoverStartFired = 0;
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        })
        .off(hoverEvents.start)
        .off(hoverEvents.end);

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));
    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));
    assert.equal(hoverStartFired, 0);
    assert.equal(hoverEndFired, 0);
});

QUnit.test('hover start/end refresh', function(assert) {
    let hoverStartFired = 0;
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        })
        .off(hoverEvents.start)
        .off(hoverEvents.end)
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        });

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));
    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));
    assert.equal(hoverStartFired, 1);
    assert.equal(hoverEndFired, 1);
});

QUnit.test('hover end fired after teardown start', function(assert) {
    let hoverStartFired = 0;
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        })
        .off(hoverEvents.start);

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));
    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));
    assert.equal(hoverStartFired, 0);
    assert.equal(hoverEndFired, 1);
});

QUnit.test('hover events does not fire unexpectedly after update multiple subscriptions on multiple elements (T450286)', function(assert) {
    let hoverFired = 0;
    const $container = $('.container');
    const selector = '.element';
    const subscription = hoverEvents.start + ' ' + hoverEvents.end;

    $container
        .on(subscription, selector, function() {
            hoverFired++;
        })
        .off(subscription)
        .on(subscription, selector, function() {
            hoverFired++;
        });

    const $firstContainer = $container.eq(0);
    const $secondContainer = $container.eq(1);
    const firstElement = $firstContainer.find(selector)[0];
    const secondElement = $secondContainer.find(selector)[0];


    $firstContainer.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: firstElement }));
    $firstContainer.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [], target: firstElement }));
    $secondContainer.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: secondElement }));
    $secondContainer.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [], target: secondElement }));

    assert.equal(hoverFired, 4);
});

QUnit.test('add and remove several hover delegated subscriptions from one element work correct', function(assert) {
    let hoverFired = 0;
    const handlerToRemove1 = function() {
        hoverFired++;
    };
    const handlerToRemove2 = function() {
        hoverFired++;
    };
    const handlerToProcess = function() {
        hoverFired++;
    };
    const $container = $('#container');
    const selector = '#element';

    $container
        .on(hoverEvents.start, selector, handlerToRemove1)
        .on(hoverEvents.start, selector, handlerToRemove2)
        .on(hoverEvents.start, selector, handlerToProcess)
        .off(hoverEvents.start, selector, handlerToRemove1)
        .off(hoverEvents.start, selector, handlerToRemove2);

    $container.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: $(selector)[0] }));

    assert.equal(hoverFired, 1);
});

QUnit.test('prevent hover on touch device', function(assert) {
    let hoverStartFired = 0;
    let hoverEndFired = 0;
    const $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        })
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        });

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointerType: 'touch', pointers: [] }));
    assert.equal(hoverStartFired, 0);
    assert.equal(hoverEndFired, 0);

    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointerType: 'touch', pointers: [] }));
    assert.equal(hoverStartFired, 0);
    assert.equal(hoverEndFired, 0);
});

QUnit.test('hover should be prevented in simulator', function(assert) {
    sinon.stub(devices, 'isSimulator').callsFake(function() { return true; });

    try {
        let hoverStartFired = 0;
        let hoverEndFired = 0;
        const $element = this.$element;

        $element
            .on(hoverEvents.start, function() {
                hoverStartFired++;
            })
            .on(hoverEvents.end, function() {
                hoverEndFired++;
            });

        $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));
        assert.equal(hoverStartFired, 0);
        assert.equal(hoverEndFired, 0);

        $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));
        assert.equal(hoverStartFired, 0);
        assert.equal(hoverEndFired, 0);
    } finally {
        devices.isSimulator.restore();
    }
});
