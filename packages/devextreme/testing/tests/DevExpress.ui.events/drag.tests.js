const $ = require('jquery');
const noop = require('core/utils/common').noop;
const dragEvents = require('common/core/events/drag');
const support = require('core/utils/support');
const GestureEmitter = require('common/core/events/gesture/emitter.gesture');
const dropTargets = dragEvents.dropTargets;
const pointerMock = require('../../helpers/pointerMock.js');

$('#qunit-fixture').addClass('qunit-fixture-visible');
QUnit.testStart(function() {
    const markup =
        '<style nonce="qunit-test">\
            #container {\
                position: relative;\
            }\
            #dropTarget {\
                width: 100px;\
                height: 100px;\
                position: absolute;\
                top: 200px;\
                left: 200px;\
            }\
            #anotherDropTarget {\
                width: 100px;\
                height: 100px;\
                position: absolute;\
                top: 200px;\
                left: 300px;\
            }\
            #element {\
                position: absolute;\
                width: 100px;\
                height: 100px;\
            }\
            #innerDropTarget {\
                width: 100%;\
                height: 100%;\
            }\
            #runtime {\
                width: 100px;\
                height: 100px;\
                position: absolute;\
                top: 200px; \
                left: 400px; \
            } \
        </style>\
        <div id="container">\
            <div id="element"></div>\
            <div id="dropTarget">\
                <div id="innerDropTarget"></div>\
            </div>\
            <div id="anotherDropTarget"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

GestureEmitter.touchBoundary(GestureEmitter.initialTouchBoundary);


QUnit.module('dragging');

QUnit.test('dragstart should be fired', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        assert.strictEqual(e.target, $element[0]);
    });

    pointer.start().down().move(10).up();
});

QUnit.test('dragstart should be fired with down event arguments', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        assert.equal(e.pageX, 0);
        assert.equal(e.pageY, 0);
    });

    pointer.start().down().move(10).up();
});

QUnit.test('drag should be fired', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    let lastDragOffset;

    $element.on(dragEvents.move, function(e) {
        assert.strictEqual(e.target, $element[0]);
        lastDragOffset = e.offset;
    });

    pointer.start().down().move(10, 20);
    assert.deepEqual(lastDragOffset, {
        x: 10,
        y: 20
    });

    pointer.move(-20, -20);
    assert.deepEqual(lastDragOffset, {
        x: -10,
        y: 0
    });

    pointer.up();
});

QUnit.test('dragend should be fired', function(assert) {
    assert.expect(2);

    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.end, function(e) {
        assert.strictEqual(e.target, $element[0]);

        assert.deepEqual(e.offset, {
            x: 10,
            y: 0
        });
    });

    pointer.start().down().move(10).up();
});

QUnit.test('y offset should be equal zero with horizontal direction', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    let lastDragOffset;

    $element.on(dragEvents.move, {
        direction: 'horizontal'
    }, function(e) {
        lastDragOffset = e.offset;
    });

    pointer.start().down().move(20, 10);
    assert.deepEqual(lastDragOffset, {
        x: 20,
        y: 0
    });

    pointer.up();
});

QUnit.test('x offset should be equal zero with vertical direction', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    let lastDragOffset;

    $element.on(dragEvents.move, {
        direction: 'vertical'
    }, function(e) {
        lastDragOffset = e.offset;
    });

    pointer.start().down().move(10, 20);
    assert.deepEqual(lastDragOffset, {
        x: 0,
        y: 20
    });

    pointer.up();
});

QUnit.test('maxLeftOffset', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        e.maxLeftOffset = 100;
    }).on(dragEvents.move, function(e) {
        assert.deepEqual(e.offset, {
            x: -100,
            y: 0
        });
    });

    pointer.start().down().move(-200, 0).up();
});

QUnit.test('maxRightOffset', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        e.maxRightOffset = 100;
    }).on(dragEvents.move, function(e) {
        assert.deepEqual(e.offset, {
            x: 100,
            y: 0
        });
    });

    pointer.start().down().move(200, 0).up();

});

QUnit.test('maxTopOffset', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        e.maxTopOffset = 100;
    }).on(dragEvents.move, function(e) {
        assert.deepEqual(e.offset, {
            x: 0,
            y: -100
        });
    });

    pointer.start().down().move(0, -200).up();

});

QUnit.test('maxBottomOffset', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.start, function(e) {
        e.maxBottomOffset = 100;
    }).on(dragEvents.move, function(e) {
        assert.deepEqual(e.offset, {
            x: 0,
            y: 100
        });
    });

    pointer.start().down().move(0, 200).up();
});

QUnit.test('Should be possible to drag into created in runtime element', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    const clock = sinon.useFakeTimers();
    let dragEnterCount = 0;
    const subscribeToDragEnterAndLeaveEvents = function(elements) {
        elements.on('dxdragenter', function(e) {
            dragEnterCount = 1;
        });
    };

    $element.on('dxdragstart', function(e) {
        setTimeout(() => {
            $('#container').append($('<div id="runtime"/>'));
            subscribeToDragEnterAndLeaveEvents($('#runtime'));
        }, 50);

    });
    $element.on('dxdragend', function(e) {
        $('#runtime').remove();
    });

    pointer.start().down().move(50, 50);
    clock.tick(50);
    pointer.move(400, 200);

    assert.equal(dragEnterCount, 1);
    pointer.up();
    clock.restore();
});

QUnit.module('drop targets registration');

QUnit.test('element should be pushed to drop targets on dragenter subscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    assert.equal(dropTargets.length, 1, 'drop target added');
    assert.equal(dropTargets[0], $dropTarget.get(0), ' correct drop target added');
});

QUnit.test('element should be removed from drop targets on dragenter unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    $dropTarget.off(dragEvents.enter);
    assert.equal(dropTargets.length, 0, 'drop target removed');
});

QUnit.test('element should be pushed to drop targets on dragleave subscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.leave, noop);
    assert.equal(dropTargets.length, 1, 'drop target added');
    assert.equal(dropTargets[0], $dropTarget.get(0), ' correct drop target added');
});

QUnit.test('element should be removed from drop targets on dragleave unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.leave, noop);
    $dropTarget.off(dragEvents.leave);
    assert.equal(dropTargets.length, 0, 'drop target removed');
});

QUnit.test('element should be pushed to drop targets on drop subscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.drop, noop);
    assert.equal(dropTargets.length, 1, 'drop target added');
    assert.equal(dropTargets[0], $dropTarget.get(0), ' correct drop target added');
});

QUnit.test('element should be removed from drop targets on drop unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.drop, noop);
    $dropTarget.off(dragEvents.drop);
    assert.equal(dropTargets.length, 0, 'drop target removed');
});

QUnit.test('element should be pushed to drop targets only once on dragenter, dragleave and drop subscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    $dropTarget.on(dragEvents.leave, noop);
    $dropTarget.on(dragEvents.drop, noop);
    assert.equal(dropTargets.length, 1, 'drop target added');
});

QUnit.test('element should not be removed from drop targets if it has dragleave or dragenter or drop subscription after unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    $dropTarget.on(dragEvents.leave, noop);
    $dropTarget.on(dragEvents.drop, noop);
    $dropTarget.off(dragEvents.enter);
    assert.equal(dropTargets.length, 1, 'drop target present');
    $dropTarget.off(dragEvents.leave);
    assert.equal(dropTargets.length, 1, 'drop target present');
});

QUnit.test('all elements should be removed from drop targets after unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');
    const $secondDropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    $secondDropTarget.on(dragEvents.enter, noop);
    $secondDropTarget.off(dragEvents.enter);
    $dropTarget.off(dragEvents.enter, noop);
    assert.equal(dropTargets.length, 0, 'drop targets aren\'t present');
});

QUnit.test('element should be removed from drop targets if it has not any subscription after unsubscription', function(assert) {
    const $dropTarget = $('<div>').appendTo('#qunit-fixture');

    $dropTarget.on(dragEvents.enter, noop);
    $dropTarget.on(dragEvents.leave, noop);
    $dropTarget.on(dragEvents.drop, noop);
    $dropTarget.off(dragEvents.enter);
    $dropTarget.off(dragEvents.leave);
    $dropTarget.off(dragEvents.drop);
    assert.equal(dropTargets.length, 0, 'drop target removed');
});

QUnit.test('There are no exceptions when dragging an element when it has several subscriptions with and without a selector to the dragenter event', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $('#container').on(dragEvents.enter, noop);
    $('#container').on(dragEvents.enter, '#dropTarget', noop);

    $element.on(dragEvents.start, noop);

    try {
        pointer.start().down().move(10, 10);
        assert.ok(true);
    } catch(e) {
        assert.ok(false);
    }
});


QUnit.module('dropping');

QUnit.test('dxdragenter should be fired when draggable enter drop target', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(0, 250);
    assert.equal(dragEnterFired, 0);

    pointer.move(250).move().up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('dxdragenter should be fired only if pointer above drop target', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(50, 50).move(200, 200).up();

    assert.equal(dragEnterFired, 1);
});

QUnit.test('dxdragleave should not be fired if drag started on the element', function(assert) {
    let $element;

    try {
        const $dropTarget = $('#dropTarget');
        let dragLeaveFired = 0;

        $element = $('#element');
        pointerMock($element);

        $element.css({
            left: 200,
            top: 200
        });

        $dropTarget.on(dragEvents.leave, function(e) {
            dragLeaveFired++;
        });

        $element.on(dragEvents.start, noop);

        $element.trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 200, pageY: 200 }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'mouse', pageX: 201, pageY: 201 }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'mouse' }));

        $element.trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 200, pageY: 200 }));
        $element.trigger($.Event('dxpointermove', { pointerType: 'mouse', pageX: 201, pageY: 201 }));
        $element.trigger($.Event('dxpointerup', { pointerType: 'mouse' }));
        assert.equal(dragLeaveFired, 0);

    } finally {
        $element.css({
            left: 200,
            top: 200
        });
    }
});

QUnit.test('dxdragleave should be fired when draggable leave drop target', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dragLeaveFired = 0;

    $dropTarget.on(dragEvents.leave, function(e) {
        dragLeaveFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250);
    assert.equal(dragLeaveFired, 0);

    pointer.move(250).move().up();
    assert.equal(dragLeaveFired, 1);
});

QUnit.test('dxdragleave and dxdragenter should be fired when draggable moves from one drop target to another', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const $anotherDropTarget = $('#anotherDropTarget');
    const pointer = pointerMock($element);
    let dragLeaveFired = 0;
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.leave, function(e) {
        dragLeaveFired++;
    });
    $anotherDropTarget.on(dragEvents.enter, function(e) {
        assert.equal(dragLeaveFired, 1, 'previous drop target lived');
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(100).up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('dxdragenter should not be fired on drag element', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $element.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(50, 50).up();
    assert.equal(dragEnterFired, 0);
});

QUnit.test('drop targets should be overridden by e.targetElements (array of jQuery)', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const $anotherDropTarget = $('#anotherDropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });
    $anotherDropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, function(e) {
        e.targetElements = [$dropTarget];
    });

    pointer.start().down().move(250, 250).move(100).up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('drop targets should be overridden by e.targetElements (DOMNode)', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const $anotherDropTarget = $('#anotherDropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });
    $anotherDropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, function(e) {
        e.targetElements = $dropTarget.get(0);
    });

    pointer.start().down().move(250, 250).move(100).up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('drop targets should be overridden by e.targetElements (null)', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const $anotherDropTarget = $('#anotherDropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });
    $anotherDropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, function(e) {
        e.targetElements = null;
    });

    pointer.start().down().move(250, 250).move(100).up();
    assert.equal(dragEnterFired, 0);
});

QUnit.test('drop targets should be overridden by e.targetElements (container)', function(assert) {
    const $element = $('#element');
    const $dropTargetContainer = $('#dropTarget');
    const $innerDropTarget = $('#innerDropTarget');
    const $anotherDropTarget = $('#anotherDropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $innerDropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });
    $anotherDropTarget.on(dragEvents.enter, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, function(e) {
        e.targetElements = $dropTargetContainer.get(0);
    });

    pointer.start().down().move(250, 250).move(100).up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('dxdrop should be fired when draggable drop to the target', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dropFired = 0;

    $dropTarget.on(dragEvents.drop, function(e) {
        dropFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).up();
    assert.equal(dropFired, 1);
});

QUnit.test('dxdragenter, dxdragleave, dxdrop should be fired with current dragging element', function(assert) {
    assert.expect(4);

    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);

    $dropTarget.on(dragEvents.enter, function(e) {
        assert.equal(e.draggingElement, $element.get(0));
    });
    $dropTarget.on(dragEvents.leave, function(e) {
        assert.equal(e.draggingElement, $element.get(0));
    });
    $dropTarget.on(dragEvents.drop, function(e) {
        assert.equal(e.draggingElement, $element.get(0));
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(200, 200).move(-200, -200).up();
});

QUnit.test('dxdragenter, dxdragleave, dxdrop should have correct target', function(assert) {
    assert.expect(4);

    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);

    $dropTarget.on(dragEvents.enter, function(e) {
        assert.equal(e.target, $dropTarget.get(0));
    });
    $dropTarget.on(dragEvents.leave, function(e) {
        assert.equal(e.target, $dropTarget.get(0));
    });
    $dropTarget.on(dragEvents.drop, function(e) {
        assert.equal(e.target, $dropTarget.get(0));
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(200, 200).move(-200, -200).up();
});

QUnit.test('dxdragenter, dxdragleave, dxdrop should support delegated subscriptions', function(assert) {
    assert.expect(4);

    const $element = $('#element');
    const $dropContainer = $('#container');
    const pointer = pointerMock($element);

    $dropContainer.on(dragEvents.enter, '#dropTarget', function(e) {
        assert.ok(true);
    });
    $dropContainer.on(dragEvents.leave, '#dropTarget', function(e) {
        assert.ok(true);
    });
    $dropContainer.on(dragEvents.drop, '#dropTarget', function(e) {
        assert.ok(true);
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(200, 200).move(-200, -200).up();
});

QUnit.test('dxdragenter, dxdragleave, dxdrop should be fired on closest delegated target', function(assert) {
    assert.expect(8);

    const $element = $('#element');
    const $dropContainer = $('#container');
    const pointer = pointerMock($element);

    $dropContainer
        .on(dragEvents.enter, '#dropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.leave, '#dropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.drop, '#dropTarget', function(e) { assert.ok(true); });

    $dropContainer
        .on(dragEvents.enter, '#innerDropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.leave, '#innerDropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.drop, '#innerDropTarget', function(e) { assert.ok(true); });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(200, 200).move(-200, -200).up();
});

QUnit.test('dxdragenter, dxdragleave, dxdrop should not be fired on unsubscribed delegated target', function(assert) {
    assert.expect(4);

    const $element = $('#element');
    const $dropContainer = $('#container');
    const pointer = pointerMock($element);

    $dropContainer
        .on(dragEvents.enter, '#dropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.leave, '#dropTarget', function(e) { assert.ok(true); })
        .on(dragEvents.drop, '#dropTarget', function(e) { assert.ok(true); });

    $dropContainer
        .on(dragEvents.enter, '#innerDropTarget', function(e) { assert.ok(false); })
        .on(dragEvents.leave, '#innerDropTarget', function(e) { assert.ok(false); })
        .on(dragEvents.drop, '#innerDropTarget', function(e) { assert.ok(false); })
        .off([dragEvents.enter, dragEvents.leave, dragEvents.drop].join(' '), '#innerDropTarget');

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(250, 250).move(200, 200).move(-200, -200).up();
});


['successive', 'reverse'].forEach((orderOfSubscriptions) => {
    QUnit.test(`dxdragenter of the nested target should be fired with ${orderOfSubscriptions} subscriptions`, function(assert) {
        assert.expect(2);

        const $element = $('#element');
        const $dropContainer1 = orderOfSubscriptions === 'successive' ? $('#dropTarget') : $('#innerDropTarget');
        const $dropContainer2 = orderOfSubscriptions === 'successive' ? $('#innerDropTarget') : $('#dropTarget');
        const pointer = pointerMock($element);

        $dropContainer1.on(dragEvents.enter, function(e) { assert.ok(true); });
        $dropContainer2.on(dragEvents.enter, function(e) { assert.ok(true); });

        $element.on(dragEvents.start, noop);

        pointer.start().down().move(200, 200).move(50, 50).up();
    });
});


QUnit.module('hacks');

QUnit.test('default behaviour on dxpointermove should be prevented to reduce user selection while drag', function(assert) {
    const $element = $('#element');

    $element.on(dragEvents.start, noop);

    $element.trigger($.Event('dxpointerdown', { pointerType: 'mouse', pageX: 200, pageY: 200, pointers: [0] }));

    const moveEvent = $.Event('dxpointermove', { pointerType: 'mouse', pageX: 210, pageY: 200, pointers: [0] });
    $element.trigger(moveEvent);
    assert.ok(moveEvent.isDefaultPrevented(), 'default prevented');

    $element.trigger($.Event('dxpointerup', { pointerType: 'mouse', pointers: [] }));
});

QUnit.test('drag should not crash with multiple touches', function(assert) {
    if(!support.touchEvents) {
        assert.ok(true);
        return;
    }

    const $element = $('#element');

    let startFired = 0;
    let endFired = 0;

    $element.on(dragEvents.start, function() {
        startFired++;
    });
    $element.on(dragEvents.end, function() {
        endFired++;
    });

    $element.trigger($.Event('touchstart', { pageX: 0, pageY: 0, touches: [{ identifier: 1, pageX: 0, pageY: 0 }], targetTouches: [1], changedTouches: [{ identifier: 1 }] }));
    $element.trigger($.Event('touchmove', { pageX: 100, pageY: 200, touches: [{ identifier: 1, pageX: 100, pageY: 200 }], targetTouches: [1], changedTouches: [{ identifier: 1 }] }));

    $element.trigger($.Event('touchstart', { touches: [1, 2], targetTouches: [1, 2], changedTouches: [{ identifier: 2 }] }));

    $element.trigger($.Event('touchend', { touches: [1], targetTouches: [2], changedTouches: [{ identifier: 2 }] }));
    $element.trigger($.Event('touchend', { touches: [], targetTouches: [1], changedTouches: [{ identifier: 1 }] }));

    assert.equal(startFired, 1, 'start fired only once');
    assert.equal(endFired, 1, 'end fired only once');
});

QUnit.test('drag correctly works with FireFox on touch-based devices (T602186)', function(assert) {
    if(!support.touchEvents) {
        assert.ok(true);
        return;
    }

    const $element = $('#element');
    const extendTarget = function(config, pageX, pageY) {
        config.pageX = pageX;
        config.pageY = pageY;
    };

    $element.on(dragEvents.start, function(e) {
        assert.equal(e.pageX, 45, 'correct drag start pageX argument');
        assert.equal(e.pageY, 50, 'correct drag start pageY argument');
    });
    $element.on(dragEvents.move, function(e) {
        assert.equal(e.pageX, 70, 'correct drag move pageX argument');
        assert.equal(e.pageY, 75, 'correct drag move pageY argument');
    });

    const touchStartParams = { pageX: 0, pageY: 0, touches: [{ identifier: 1, pageX: 45, pageY: 50 }], targetTouches: [1], changedTouches: [{ identifier: 1, pageX: 45, pageY: 50 }] };
    const touchMoveParams = { pageX: 145, pageY: 100, touches: [{ identifier: 1, pageX: 70, pageY: 75 }], targetTouches: [1], changedTouches: [{ identifier: 1, pageX: 70, pageY: 75 }] };
    const touchEndParams = { touches: [], targetTouches: [1], changedTouches: [{ identifier: 1 }] };

    if(QUnit.urlParams['nojquery']) {
        extendTarget(touchStartParams, 0, 0);
        extendTarget(touchMoveParams, 145, 100);
    } else {
        extendTarget(touchStartParams, 45, 50);
        extendTarget(touchMoveParams, 70, 75);
    }

    $element.trigger($.Event('touchstart', touchStartParams));
    $element.trigger($.Event('touchmove', touchMoveParams));
    $element.trigger($.Event('touchend', touchEndParams));
});

QUnit.test('drag move should not prevent default if e._cancelPreventDefault is true', function(assert) {
    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on(dragEvents.move, function(e) {
        e._cancelPreventDefault = true;
    });

    const e = pointer.start().down().move(250, 250).lastEvent();
    assert.notOk(e.isDefaultPrevented(), 'prevent default is cancelled');
});


QUnit.module('performance');

QUnit.test('override dropTarget position function', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, {
        itemPositionFunc: function() {
            return {
                left: 0,
                top: 0
            };
        }
    }, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(50, 50).up();
    assert.equal(dragEnterFired, 1);
});

QUnit.test('override dropTarget size function', function(assert) {
    const $element = $('#element');
    const $dropTarget = $('#dropTarget');
    const pointer = pointerMock($element);
    let dragEnterFired = 0;

    $dropTarget.on(dragEvents.enter, {
        itemSizeFunc: function() {
            return {
                width: 300,
                height: 300
            };
        }
    }, function(e) {
        dragEnterFired++;
    });

    $element.on(dragEvents.start, noop);

    pointer.start().down().move(400, 400).up();
    assert.equal(dragEnterFired, 1);
});
