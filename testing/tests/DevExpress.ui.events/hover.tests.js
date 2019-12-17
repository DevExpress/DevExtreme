var $ = require('jquery'),
    devices = require('core/devices'),
    hoverEvents = require('events/hover');

QUnit.testStart(function() {
    var markup =
        '<div id="container" class="container">\
            <div id="element" class="element"></div>\
            <div id="second-element"></div>\
        </div>\
        <div class="container">\
            <div class="element"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var POINTER_ENTER = 'dxpointerenter',
    POINTER_LEAVE = 'dxpointerleave';

QUnit.module('hover', {
    beforeEach: function() {
        this.$element = $('#element');
    }
});

QUnit.test('hover start', function(assert) {
    var hoverStartFired = 0,
        $element = this.$element;

    $element
        .on(hoverEvents.start, function() {
            hoverStartFired++;
        });

    $element.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [] }));

    assert.equal(hoverStartFired, 1);
});

QUnit.test('hover end', function(assert) {
    var hoverEndFired = 0,
        $element = this.$element;

    $element
        .on(hoverEvents.end, function() {
            hoverEndFired++;
        });

    $element.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [] }));

    assert.equal(hoverEndFired, 1);
});

QUnit.test('hover start/end', function(assert) {
    var hoverStartFired = 0,
        hoverEndFired = 0,
        $element = this.$element;

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
    var firstSubscription = 0,
        secondSubscription = 0,
        $element = this.$element,
        $secondElement = $('#second-element'),
        $container = $('#container');

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
    var subscription = 0,
        removedSubscription = 0,
        $element = this.$element,
        $secondElement = $('#second-element'),
        $container = $('#container'),
        subscriptionToRemove = function() {
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
    var hoverEventFired = 0,
        $element = this.$element,
        $container = $('#container'),
        subscriptionToRemove = function() {
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
    var hoverStartFired = 0,
        hoverEndFired = 0,
        $element = this.$element;

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
    var hoverStartFired = 0,
        hoverEndFired = 0,
        $element = this.$element;

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
    var hoverStartFired = 0,
        hoverEndFired = 0,
        $element = this.$element;

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
    var hoverFired = 0,
        $container = $('.container'),
        selector = '.element',
        subscription = hoverEvents.start + ' ' + hoverEvents.end;

    $container
        .on(subscription, selector, function() {
            hoverFired++;
        })
        .off(subscription)
        .on(subscription, selector, function() {
            hoverFired++;
        });

    var $firstContainer = $container.eq(0);
    var $secondContainer = $container.eq(1);
    var firstElement = $firstContainer.find(selector)[0];
    var secondElement = $secondContainer.find(selector)[0];


    $firstContainer.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: firstElement }));
    $firstContainer.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [], target: firstElement }));
    $secondContainer.trigger($.Event(POINTER_ENTER, { which: 1, pointers: [], target: secondElement }));
    $secondContainer.trigger($.Event(POINTER_LEAVE, { which: 1, pointers: [], target: secondElement }));

    assert.equal(hoverFired, 4);
});

QUnit.test('add and remove several hover delegated subscriptions from one element work correct', function(assert) {
    var hoverFired = 0,
        handlerToRemove1 = function() {
            hoverFired++;
        },
        handlerToRemove2 = function() {
            hoverFired++;
        },
        handlerToProcess = function() {
            hoverFired++;
        },
        $container = $('#container'),
        selector = '#element';

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
    var hoverStartFired = 0,
        hoverEndFired = 0,
        $element = this.$element;

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
    sinon.stub(devices, 'isSimulator', function() { return true; });

    try {
        var hoverStartFired = 0,
            hoverEndFired = 0,
            $element = this.$element;

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
