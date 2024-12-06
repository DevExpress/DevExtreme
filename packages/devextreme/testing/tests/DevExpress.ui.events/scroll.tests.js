const $ = require('jquery');
const noop = require('core/utils/common').noop;
const scrollEvents = require('common/core/events/gesture/emitter.gesture.scroll');
const GestureEmitter = require('common/core/events/gesture/emitter.gesture');
const eventUtils = require('common/core/events/utils/index');
const devices = require('core/devices');
const compareVersions = require('core/utils/version').compare;
const animationFrame = require('common/core/animation/frame');
const pointerMock = require('../../helpers/pointerMock.js');

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="scrollable"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const FRAME_DURATION = Math.round(1000 / 60);
const INERTIA_TIMEOUT = 100;
const VELOCITY_CALC_TIMEOUT = 200;
const TOUCH_BOUNDARY = GestureEmitter.initialTouchBoundary;


GestureEmitter.touchBoundary(TOUCH_BOUNDARY);

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('scroll init');

QUnit.test('dxscrollinit fired on pointer down', function(assert) {
    let fired = 0;
    let args;

    const $scrollable = $('#scrollable').on(scrollEvents.init, function(e) {
        args = e;
        fired++;
    });

    const $innerContent = $('<div>').appendTo($scrollable);

    pointerMock($innerContent).start().down();

    assert.equal(fired, 1, 'dxscrollinit fired once');
    assert.ok($scrollable.is(args.target), 'event target specified');
    assert.ok(args.originalEvent, 'original event specified');
});

QUnit.test('dxscrollinit is not fired on element without subscription', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable');
    const $after = $('<div>').insertAfter($scrollable);

    $scrollable.on(scrollEvents.init, function() {
        assert.ok(false, 'dxscrollinit fired');
    });

    pointerMock($after).start().down();
});

QUnit.test('dxscrollinit considers events.needSkipEvent', function(assert) {
    assert.expect(0);

    try {
        eventUtils.forceSkipEvents();

        const $scrollable = $('#scrollable').on(scrollEvents.init, function(e) {
            assert.ok(false, 'dxscrollinit fired');
        });

        pointerMock($scrollable).start().down();

    } finally {
        eventUtils.stopEventsSkipping();
    }
});

QUnit.test('dxscrollinit bubbling', function(assert) {
    assert.expect(1);

    const $scrollable = $('#scrollable').on(scrollEvents.init, noop);

    const $scrollableParent = $scrollable.wrap('<div>').parent();

    $scrollableParent.on(scrollEvents.init, function() {
        assert.ok(true, 'dxscrollinit bubbles');
    });

    pointerMock($scrollable).start().down();
});

QUnit.test('dxscrollinit canceling', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable').on(scrollEvents.init, function(e) {
        e.cancel = true;
    });
    $scrollable.on(scrollEvents.start, function() {
        assert.ok(false, 'scrollstart was not canceled');
    });

    pointerMock($scrollable).start()
        .down()
        .move();
});


QUnit.module('scroll start');

QUnit.test('dxscrollstart fired on first pointer move', function(assert) {
    let fired = 0;
    let args;

    const $scrollable = $('#scrollable')
        .on(scrollEvents.start, function(e) {
            args = e;
            fired++;
        });

    pointerMock($scrollable).start()
        .down()
        .move(TOUCH_BOUNDARY);

    assert.equal(fired, 1, 'dxscrollstart fired once');
    assert.ok($scrollable.is(args.target), 'event target specified');
    assert.ok(args.originalEvent, 'original event specified');
});

QUnit.test('dxscrollstart should not fire without start', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable').on(scrollEvents.start, function(e) {
        assert.ok(false, 'dxscrollstart fired');
    });

    pointerMock($scrollable).start().move();
});

QUnit.test('dxscrollstart fired only on first pointer move', function(assert) {
    let fired = 0;
    const $scrollable = $('#scrollable').on(scrollEvents.start, function(e) {
        fired++;
    });

    pointerMock($scrollable).start().down().move(TOUCH_BOUNDARY).move();

    assert.equal(fired, 1, 'dxscrollstart fired once');
});

QUnit.test('dxscrollstart canceling', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable')
        .on(scrollEvents.start, function(e) {
            e.cancel = true;
        })
        .on(scrollEvents.move, function() {
            assert.ok(false, 'dxscroll fired for canceled event');
        });

    pointerMock($scrollable).start().down().move();
});


QUnit.module('scroll move');

QUnit.test('dxscroll fired on pointer move', function(assert) {
    let fired = 0;
    let args;
    let moveEventData;

    const $scrollable = $('#scrollable')
        .on(scrollEvents.move, function(e) {
            args = e;
            fired++;
            moveEventData = eventUtils.eventData(e.originalEvent);
        });

    pointerMock($scrollable).start()
        .down()
        .move(TOUCH_BOUNDARY, TOUCH_BOUNDARY);

    assert.equal(fired, 1, 'dxscroll fired once');
    assert.ok($scrollable.is(args.target), 'event target specified');
    assert.ok(args.originalEvent, 'original event specified');
    assert.deepEqual(args.delta, eventUtils.eventDelta(moveEventData, moveEventData), 'delta specified');
});

QUnit.test('dxscroll fired on every move', function(assert) {
    let fired = 0;
    let lastDelta;

    const $scrollable = $('#scrollable').on(scrollEvents.move, function(e) {
        lastDelta = e.delta;
        fired++;
    });

    pointerMock($scrollable).start()
        .down()
        .move(TOUCH_BOUNDARY, TOUCH_BOUNDARY)
        .move(20, 20);

    assert.equal(fired, 2, 'dxscroll fired twice');
    assert.equal(lastDelta.y, 20, 'delta between move events');
});

QUnit.test('dxscroll canceling', function(assert) {
    let fired = 0;

    const $scrollable = $('#scrollable').on(scrollEvents.move, function(e) {
        e.cancel = true;
        fired++;
    });

    pointerMock($scrollable).start()
        .down()
        .move(TOUCH_BOUNDARY, TOUCH_BOUNDARY)
        .move(20, 20);

    assert.equal(fired, 1, 'dxscroll fired once');
});


QUnit.module('scroll end');

QUnit.test('dxscrollend fired on pointer end', function(assert) {
    let fired = 0;
    let args;
    const scrollDistance = 10;
    const waitTime = 10;

    const $scrollable = $('#scrollable')
        .on(scrollEvents.end, function(e) {
            fired++;
            args = e;
        });

    pointerMock($scrollable).start()
        .down()
        .wait(waitTime)
        .move(TOUCH_BOUNDARY, TOUCH_BOUNDARY)
        .move(scrollDistance, scrollDistance)
        .up();

    const velocity = scrollDistance * FRAME_DURATION / waitTime;

    assert.equal(fired, 1, 'dxscrollend fired once');
    assert.ok($scrollable.is(args.target), 'event target specified');
    assert.ok(args.originalEvent, 'original event specified');
    assert.deepEqual(args.velocity, { x: velocity, y: velocity }, 'velocity specified');
});

QUnit.test('zero velocity when gesture end is deferred', function(assert) {
    let args;

    const $scrollable = $('#scrollable')
        .on(scrollEvents.end, function(e) {
            args = e;
        });

    pointerMock($scrollable).start()
        .down()
        .wait(10)
        .move(TOUCH_BOUNDARY, TOUCH_BOUNDARY)
        .wait(INERTIA_TIMEOUT)
        .up();

    assert.deepEqual(args.velocity, { x: 0, y: 0 }, 'zero velocity');
});

QUnit.test('dxscrollend velocity calculation', function(assert) {
    let args;
    const scrollDistance = 10;
    const waitTimeout = 10;
    const halfScrollDistance = scrollDistance / 2;

    const $scrollable = $('#scrollable').on(scrollEvents.end, function(e) {
        args = e;
    });

    pointerMock($scrollable).start()
        .down()
        .wait(VELOCITY_CALC_TIMEOUT + 1)
        .move(scrollDistance, scrollDistance)
        .wait(waitTimeout)
        .move(halfScrollDistance, halfScrollDistance)
        .up();

    const velocity = (halfScrollDistance) * FRAME_DURATION / waitTimeout;
    assert.deepEqual(args.velocity, { x: velocity, y: velocity }, 'velocity is correct');
});

QUnit.test('pointer up stops scrolling', function(assert) {
    assert.expect(0);

    let finished = false;

    const $scrollable = $('#scrollable')
        .on(scrollEvents.move, function(e) {
            if(finished) {
                assert.ok(false, 'dxscroll fired after pointer end');
            }
        })
        .on(scrollEvents.end, function(e) {
            finished = true;
        });

    pointerMock($scrollable).start()
        .down()
        .move()
        .up()
        .move();
});

QUnit.test('no scrolling without pointer down after pointer up', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable')
        .on(scrollEvents.move, function(e) {
            assert.ok(false, 'dxscroll fired after pointer end');
        });

    pointerMock($scrollable).start()
        .down()
        .up()
        .move();
});

QUnit.test('dxscrollend should not be fired when there was no pointer move', function(assert) {
    assert.expect(0);

    const $scrollable = $('#scrollable').on(scrollEvents.end, function(e) {
        assert.ok(false, 'dxscrollend fired there was no pointer move');
    });

    pointerMock($scrollable).start()
        .down()
        .up();
});


QUnit.module('scroll stop');

QUnit.test('dxscrollstop fired on tap', function(assert) {
    let fired = 0;
    let args;

    const $scrollable = $('#scrollable').on(scrollEvents.stop, function(e) {
        args = e;
        fired++;
    });

    pointerMock($scrollable).start()
        .down()
        .up();

    assert.equal(fired, 1, 'dxscrollstop fired once');
    assert.ok($scrollable.is(args.target), 'event target specified');
    assert.ok(args.originalEvent, 'original event specified');
});


QUnit.module('scroll cancel');

QUnit.test('scroll cancel fired when direction is wrong', function(assert) {
    let cancelEventCounter = 0;
    $('#container').on(scrollEvents.move, { direction: 'horizontal' }, noop);
    const $scrollable = $('#scrollable').on(scrollEvents.cancel,
        { direction: 'vertical' },
        function() {
            cancelEventCounter++;
        });

    pointerMock($scrollable).start()
        .down()
        .move(TOUCH_BOUNDARY, 0);

    assert.equal(cancelEventCounter, 1, 'cancel event fired once');
});

QUnit.test('scroll cancel fired after set e.cancel=true', function(assert) {
    let cancelEventCounter = 0;
    const $scrollable = $('#scrollable').on(scrollEvents.init, function(e) {
        e.cancel = true;
    }).on(scrollEvents.cancel, function() {
        cancelEventCounter++;
    });

    pointerMock($scrollable).start().down();

    assert.equal(cancelEventCounter, 1, 'cancel event fired once');
});


QUnit.module('scroll wheel');

QUnit.test('dxscrollwheel fired on mouse wheel', function(assert) {
    let scrollInit = 0;
    let scrollStart = 0;
    let scrollMove = 0;
    let scrollEnd = 0;
    const distance = TOUCH_BOUNDARY;


    const $scrollable = $('#scrollable')
        .on(scrollEvents.init, {
            validate: function() {
                return true;
            }
        }, function() {
            scrollInit++;
        })
        .on(scrollEvents.start, function(e) {
            if(scrollInit) {
                scrollStart++;
            }
        })
        .on(scrollEvents.move, function() {
            if(scrollStart) {
                scrollMove++;
            }
        })
        .on(scrollEvents.end, function() {
            if(scrollMove) {
                scrollEnd++;
            }
        });

    pointerMock($scrollable).start().wheel(distance);

    assert.equal(scrollInit, 1, 'scrollInit fired once');
    assert.equal(scrollStart, 1, 'scrollStart fired once after scrollWheel');
    assert.equal(scrollMove, 1, 'scroll fired once after scrollStart');
    assert.equal(scrollEnd, 1, 'scrollEnd fired once after scrollMove');
});

QUnit.test('dxscrollwheel fires move after dxclick', function(assert) {
    let scrollStartCounter = 0;
    const $scrollable = $('#scrollable').on(scrollEvents.start, {
        validate: function() {
            return true;
        }
    }, function() {
        scrollStartCounter++;
    }).on('dxclick', noop);

    const pointer = pointerMock($scrollable).start().click();
    pointer.wheel(TOUCH_BOUNDARY);

    assert.equal(scrollStartCounter, 1, 'scrollstart was fired');
});

QUnit.test('dxscrollwheel did not prevent event', function(assert) {
    let isDefaultPrevented;
    const $scrollable = $('#scrollable').on(scrollEvents.move, {
        validate: function() {
            return true;
        }
    }, noop);
    $(document).on('dxmousewheel', function(e) {
        isDefaultPrevented = e.isDefaultPrevented();
    });

    pointerMock($scrollable).start().wheel(TOUCH_BOUNDARY);

    assert.strictEqual(isDefaultPrevented, false, 'dxscrollwhell was not prevented');
});

(function() {

    QUnit.module('wheel locker', moduleConfig);

    const wheelMove = function($element, shiftKey) {
        pointerMock($element).start().wheel(20, { shiftKey });
    };

    const WHEEL_UNLOCK_TIMEOUT = 400;

    QUnit.test('lock should be released on only after timeout', function(assert) {
        let innerCaptured = false;

        const $inner = $('#scrollable').on(scrollEvents.move, {
            direction: 'vertical',
            validate: function() { return true; }
        }, function() {
            innerCaptured = true;
        });

        const $outer = $('#container').on(scrollEvents.move, {
            direction: 'vertical',
            validate: function() { return true; }
        }, noop);

        wheelMove($outer);

        this.clock.tick(WHEEL_UNLOCK_TIMEOUT - 1);
        wheelMove($inner);
        assert.ok(!innerCaptured, 'inner scroll was not captured');

        this.clock.tick(WHEEL_UNLOCK_TIMEOUT + 1);
        wheelMove($inner);
        assert.ok(innerCaptured, 'inner scroll was captured');
    });

    QUnit.test('lock should be released after direction change', function(assert) {
        let innerCaptured = false;

        const $inner = $('#scrollable').on(scrollEvents.move, {
            direction: 'horizontal',
            validate: function() { return true; }
        }, function() {
            innerCaptured = true;
        });

        $('#container').on(scrollEvents.move, {
            direction: 'vertical',
            validate: function() { return true; }
        }, noop);

        wheelMove($inner);
        wheelMove($inner, true);
        assert.ok(innerCaptured, 'inner scroll was captured');
    });

})();

(function() {

    QUnit.module('pointer locker', moduleConfig);

    const pointerMove = function($element) {
        pointerMock($element).start().down().move(20).up();
        $element.triggerHandler('scroll');
    };

    const realDevice = devices.real();

    if(realDevice.ios && compareVersions(realDevice.version, [8]) >= 0 ||
        realDevice.android && compareVersions(realDevice.version, [5]) >= 0) {

        QUnit.test('lock should not be released on if scroll stopped (before frame)', function(assert) {
            const done = assert.async();

            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, noop);

            pointerMove($outer);
            const innerPointer = pointerMock($inner).start();
            innerPointer.down();
            animationFrame.requestAnimationFrame(function() {
                innerPointer.move(20).up();
                assert.ok(!innerCaptured, 'inner scroll was not captured');

                done();
            });
        });

        QUnit.test('lock should be released on if scroll not stopped (before frame)', function(assert) {
            const done = assert.async();

            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, noop);

            pointerMove($outer);
            const innerPointer = pointerMock($inner).start();

            animationFrame.requestAnimationFrame(function() {
                innerPointer.down();
                animationFrame.requestAnimationFrame(function() {
                    innerPointer.move(20).up();
                    assert.ok(innerCaptured, 'inner scroll was captured');

                    done();
                });
            });
        });

        QUnit.test('lock should not be released if scroll stopped (after frame)', function(assert) {
            const done = assert.async();

            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, noop);

            const innerPointer = pointerMock($inner).start();
            innerPointer.down();
            $outer.triggerHandler('scroll');
            animationFrame.requestAnimationFrame(function() {
                innerPointer.move(20).up();
                assert.ok(!innerCaptured, 'inner scroll was not captured');

                done();
            });
        });

        QUnit.test('lock should be released on only if scroll stopped (after frame)', function(assert) {
            const done = assert.async();

            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, noop);


            const innerPointer = pointerMock($inner).start();
            innerPointer.down();
            animationFrame.requestAnimationFrame(function() {
                $outer.triggerHandler('scroll');
                innerPointer.move(20).up();
                assert.ok(innerCaptured, 'inner scroll was captured');

                done();
            });
        });

    } else {
        const POINTER_UNLOCK_TIMEOUT = 400;

        QUnit.test('lock should be released on only after timeout', function(assert) {
            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                validate: function() { return true; }
            }, noop);

            pointerMove($outer);

            this.clock.tick(POINTER_UNLOCK_TIMEOUT - 1);
            pointerMove($inner);
            assert.ok(!innerCaptured, 'inner scroll was not captured');

            this.clock.tick(POINTER_UNLOCK_TIMEOUT + 1);
            pointerMove($inner);
            assert.ok(innerCaptured, 'inner scroll was captured');
        });

        QUnit.test('lock should not be accepted when native mouse event is used', function(assert) {
            let innerCaptured = false;

            const $inner = $('#scrollable').on(scrollEvents.move, {
                direction: 'both',
                isNative: true,
                validate: function() { return true; }
            }, function() {
                innerCaptured = true;
            });

            const $outer = $('#container').on(scrollEvents.move, {
                direction: 'both',
                isNative: true,
                validate: function() { return true; }
            }, noop);

            pointerMove($outer);

            this.clock.tick(POINTER_UNLOCK_TIMEOUT - 1);
            pointerMove($inner);

            assert.ok(innerCaptured, 'inner scroll was captured before timeout');
        });
    }

})();
