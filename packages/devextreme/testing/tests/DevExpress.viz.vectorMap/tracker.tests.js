/* global currentTest */

// This is to prevent losing requested animation frames
// Every time "mousewheel" event is triggered within a test animation frame is requested
// It is done by widgets event system ("dxwheel")
// It is not used in map and requesting frame is just suppressed
import $ from 'jquery';
import { noop } from 'core/utils/common';
import vizMocks from '../../helpers/vizMocks.js';
import trackerModule from 'viz/vector_map/tracker';
import eventEmitterModule from 'viz/vector_map/event_emitter';
import animationFrame from 'common/core/animation/frame';

const FOCUS_OFF_DELAY = 100;

$('#qunit-fixture').append('<div id="test-root"></div>');

animationFrame.requestAnimationFrame = animationFrame.cancelAnimationFrame = noop;

const EVENTS = {
    'start': {
        'mouse': 'mousedown',
        'touch': 'touchstart',
        'MSPointer': 'MSPointerDown',
        'pointer': 'pointerdown'
    },
    'move': {
        'mouse': 'mousemove',
        'touch': 'touchmove',
        'MSPointer': 'MSPointerMove',
        'pointer': 'pointermove'
    },
    'end': {
        'mouse': 'mouseup',
        'touch': 'touchend',
        'MSPointer': 'MSPointerUp',
        'pointer': 'pointerup'
    },
    'wheel': {
        'mouse': 'wheel'
    }
};

const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.root = this.renderer.g();
        this.root.element = $('<div>').appendTo('#test-root')[0];
        trackerModule._DEBUG_forceEventMode(this.eventMode);
        this.createTracker();
        this.$target = $('<div>').appendTo(this.root.element);
        this.$target.get(0)['vectormap-data'] = 'test-data'; // emulate data attachment
        this.$targetNoData = $('<div>').appendTo(this.root.element);
        $.each(this.stubbedCallbacks || [], $.proxy(function(_, name) {
            this[name] = sinon.stub();
        }, this));
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.tracker.dispose();
        this.root.dispose();
        this.clock.restore();
    },
    createTracker: function() {
        const test = this;
        this.projection = { on: sinon.spy() };
        this.tracker = new trackerModule.Tracker({
            root: this.root,
            projection: this.projection,
            dataKey: 'vectormap-data'
        });
        this.tracker.on({
            'start': function(arg) {
                return test.onStart && test.onStart.apply(this, arguments);
            },
            'move': function(arg) {
                return test.onMove && test.onMove.apply(this, arguments);
            },
            'end': function(arg) {
                return test.onEnd && test.onEnd.apply(this, arguments);
            },
            'zoom': function(arg) {
                return test.onZoom && test.onZoom.apply(this, arguments);
            },
            'click': function(arg) {
                return test.onClick && test.onClick.apply(this, arguments);
            },
            'hover-on': function(arg) {
                return test.onHoverOn && test.onHoverOn.apply(this, arguments);
            },
            'hover-off': function(arg) {
                return test.onHoverOff && test.onHoverOff.apply(this, arguments);
            },
            'focus-on': function(arg, done) {
                return test.onFocusOn && test.onFocusOn.apply(null, arguments);
            },
            'focus-move': function(arg) {
                return test.onFocusMove && test.onFocusMove.apply(null, arguments);
            },
            'focus-off': function(arg) {
                return test.onFocusOff && test.onFocusOff.apply(null, arguments);
            }
        });
        this.tracker.setOptions({
            touchEnabled: true,
            wheelEnabled: true
        });

    },
    triggerEvent: function($target, type, x, y, originalEventData) {
        const event = $.Event(type);
        const pointerType = /^pointer/.test(type) ? 'touch' : (/^MSPointer/.test(type) ? 2 : undefined);
        event.pointerType = pointerType;
        event.originalEvent = $.extend($.Event(type), { pointerType: pointerType });
        if(/^touch/.test(type)) {
            event.originalEvent.touches = [{
                pageX: x,
                pageY: y
            }];
        } else if(pointerType) {
            event.originalEvent.pointerId = 100;
        }
        //  For ui.events
        event.originalEvent.changedTouches = event.originalEvent.changedTouches || [];
        event.originalEvent.touches = event.originalEvent.touches || [];
        event.changedTouches = [{}];
        event.touches = [];
        $.extend(event.originalEvent, originalEventData);
        event.target = $target.get(0);
        event.pageX = x;
        event.pageY = y;
        $target.trigger(event);
        return this;
    },
    trigger: function(name, coords, originalEventData) {
        return this.triggerEvent(this.$target, EVENTS[name][this.eventMode], coords.x, coords.y, originalEventData);
    },
    triggerNoData: function(name, coords, originalEventData) {
        return this.triggerEvent(this.$targetNoData, EVENTS[name][this.eventMode], coords.x, coords.y, originalEventData);
    },
    triggerMultitouch: function(name, coords, originalEventData, pointerIndex) {
        const data = $.extend({}, originalEventData);
        if(this.eventMode === 'touch') {
            data.touches = [{}];
            data.touches[pointerIndex] = { pageX: coords.x, pageY: coords.y };
        } else {
            data.pointerId = pointerIndex + 10;
            data.pageX = coords.x;
            data.pageY = coords.y;
        }
        return this.triggerEvent(this.$target, EVENTS[name][this.eventMode], 0, 0, data);
    }
};

QUnit.module('General', environment);

QUnit.test('Subscription to projection', function(assert) {
    const arg = this.projection.on.lastCall.args[0];
    assert.strictEqual(typeof arg.center, 'function', 'center handler');
    assert.strictEqual(typeof arg.zoom, 'function', 'zoom handler');
    assert.strictEqual(arg.center, arg.zoom, 'same handler for both events');
});

QUnit.test('Event emitter methods are injected', function(assert) {
    const tracker = this.tracker;
    $.each(eventEmitterModule._TESTS_eventEmitterMethods, function(name, method) {
        assert.strictEqual(tracker[name], method, name);
    });
});

// T249548
QUnit.module('Default prevention', $.extend({}, environment, {
    check: function(assert, eventMode, eventName, withData, preventDefaultCount, stopPropagationCount) {
        trackerModule._DEBUG_forceEventMode(eventMode);
        this.eventMode = eventMode;
        this.tracker.dispose();
        this.createTracker(); // To attach with correct event names

        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();
        this[withData ? 'trigger' : 'triggerNoData'](eventName, { x: 10, y: 20 }, {
            preventDefault: preventDefault,
            stopPropagation: stopPropagation,
        });

        assert.strictEqual(preventDefault.callCount, preventDefaultCount, 'prevent default');
        assert.strictEqual(stopPropagation.callCount, stopPropagationCount, 'stop propagation');
    }
}));

$.each(['mouse', 'touch', 'MSPointer', 'pointer'], function(_, mode) {
    QUnit.test(mode + ' - start', function(assert) {
        this.check(assert, mode, 'start', true, 1, 0);
    });

    QUnit.test(mode + ' - start / no data', function(assert) {
        this.check(assert, mode, 'start', false, 0, 0);
    });

    QUnit.test(mode + ' - move', function(assert) {
        this.check(assert, mode, 'move', true, 0, 0);
    });

    QUnit.test(mode + ' - move / no data', function(assert) {
        this.check(assert, mode, 'move', false, 0, 0);
    });

    QUnit.test(mode + ' - end', function(assert) {
        this.check(assert, mode, 'end', true, 0, 0);
    });

    QUnit.test(mode + ' - end / no data', function(assert) {
        this.check(assert, mode, 'move', false, 0, 0);
    });
});

QUnit.test('mouse - wheel', function(assert) {
    this.check(assert, 'mouse', 'wheel', true, 1, 2); // second "stopPropagation" is called by the dxmousewheel system
});

QUnit.test('mouse - wheel / no data', function(assert) {
    this.check(assert, 'mouse', 'wheel', false, 0, 1); // one 'stopPropagation' call because our events system always stops propagation
});

$.each(['mouse', 'touch', 'MSPointer', 'pointer'], function(_, type) {
    QUnit.module('click / ' + type, $.extend({}, environment, {
        eventMode: type,
        stubbedCallbacks: ['onClick']
    }));

    QUnit.test('raised on start then end', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('end', { x: 10, y: 20 });

        const arg = this.onClick.lastCall.args[0];
        delete arg.$event;
        assert.deepEqual(arg, { data: 'test-data', x: 10, y: 20 });
    });

    QUnit.test('raised when small moves', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('end', { x: 11, y: 19 });

        const arg = this.onClick.lastCall.args[0];
        delete arg.$event;
        assert.deepEqual(arg, { data: 'test-data', x: 11, y: 19 });
    });

    QUnit.test('not raised when big mouse moves', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('end', { x: 31, y: 10 });

        assert.strictEqual(this.onClick.lastCall, null);
    });

    QUnit.test('not raised if end on element without data', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).triggerNoData('end', { x: 10, y: 20 });

        assert.strictEqual(this.onClick.lastCall, null);
    });

    if(type !== 'mouse') {
        QUnit.test('not raised when disabled', function(assert) {
            this.tracker.setOptions({ touchEnabled: false });
            this.trigger('start', { x: 10, y: 20 }).trigger('end', { x: 10, y: 20 });

            assert.strictEqual(this.onClick.lastCall, null);
        });
    }
});

$.each(['mouse', 'touch', 'MSPointer', 'pointer'], function(_, type) {
    QUnit.module('drag / ' + type, $.extend({}, environment, {
        eventMode: type,
        stubbedCallbacks: ['onStart', 'onMove', 'onEnd']
    }));

    QUnit.test('"start" is raised on start', function(assert) {
        this.trigger('start', { x: 10, y: 20 });

        assert.deepEqual(this.onStart.lastCall.args, [{ data: 'test-data', x: 10, y: 20 }]);
    });

    QUnit.test('"move" is raised on move after start', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 22, y: 31 });

        assert.deepEqual(this.onMove.lastCall.args, [{ data: 'test-data', x: 22, y: 31 }]);
    });

    QUnit.test('"move" is not raised on small moves', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 13, y: 15 });

        assert.strictEqual(this.onMove.lastCall, null);
    });

    QUnit.test('"move" is raised on small moves when already moving', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 22, y: 31 }).trigger('move', { x: 20, y: 30 });

        assert.deepEqual(this.onMove.lastCall.args, [{ data: 'test-data', x: 20, y: 30 }]);
    });

    QUnit.test('"move" is not raised before start', function(assert) {
        this.trigger('move', { x: 20, y: 30 });

        assert.strictEqual(this.onMove.lastCall, null);
    });

    QUnit.test('"end" is raised on end after start', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('end', {});

        assert.deepEqual(this.onEnd.lastCall.args, [{ data: 'test-data', x: 10, y: 20 }]);
    });

    QUnit.test('"end" is not raised before start', function(assert) {
        this.trigger('end', {});

        assert.strictEqual(this.onEnd.lastCall, null);
    });

    QUnit.test('no stack overflow when "reset" is called on "end"', function(assert) {
        this.onEnd = $.proxy(function() {
            this.tracker.reset();
        }, this);
        this.trigger('start', { x: 10, y: 20 }).trigger('end', {});

        assert.ok(true);
    });

    if(type !== 'mouse') {
        QUnit.test('not raised when disabled', function(assert) {
            this.tracker.setOptions({ touchEnabled: false });
            this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 25, y: 30 }).trigger('end', {});

            assert.strictEqual(this.onStart.lastCall, null);
            assert.strictEqual(this.onMove.lastCall, null);
            assert.strictEqual(this.onEnd.lastCall, null);
        });
    }
});

QUnit.module('zoom / mouse', $.extend({}, environment, {
    eventMode: 'mouse',
    stubbedCallbacks: ['onZoom']
}));

QUnit.test('raised on wheel', function(assert) {
    this.trigger('wheel', { x: 10, y: 20 }, { deltaY: -120, deltaMode: 0 });

    assert.deepEqual(this.onZoom.lastCall.args, [{ delta: 1, x: 10, y: 20 }]);
});

// T107589
QUnit.test('raised on small deltas', function(assert) {
    this.trigger('wheel', { x: 10, y: 20 }, { deltaY: 20, deltaMode: 0 });

    assert.deepEqual(this.onZoom.lastCall.args, [{ delta: -1, x: 10, y: 20 }]);
});

QUnit.test('too big deltas are truncated', function(assert) {
    this.trigger('wheel', { x: 10, y: 20 }, { deltaY: -800, deltaMode: 0 });

    assert.deepEqual(this.onZoom.lastCall.args, [{ delta: 4, x: 10, y: 20 }]);
});

QUnit.test('consequent deltas are ignored', function(assert) {
    this.trigger('wheel', { x: 10, y: 20 }, { deltaY: -200, deltaMode: 0 });
    this.trigger('wheel', { x: 11, y: 22 }, { deltaY: -120, deltaMode: 0 });

    assert.deepEqual(this.onZoom.lastCall.args, [{ delta: 2, x: 10, y: 20 }]);
});

QUnit.test('not raised when disabled', function(assert) {
    this.tracker.setOptions({ wheelEnabled: false });
    this.trigger('wheel', { x: 10, y: 20 }, { deltaY: -120, deltaMode: 0 });

    assert.strictEqual(this.onZoom.lastCall, null);
});

$.each(['touch', 'MSPointer', 'pointer'], function(_, type) {
    QUnit.module('zoom / ' + type, $.extend({}, environment, {
        eventMode: type,
        stubbedCallbacks: ['onZoom']
    }));

    QUnit.test('raised on end after two starts', function(assert) {
        this.triggerMultitouch('start', { x: 10, y: 20 }, null, 0).triggerMultitouch('start', { x: 30, y: 40 }, null, 1).triggerMultitouch('end', {}, null, 1);

        assert.deepEqual(this.onZoom.lastCall.args, [{ ratio: 1, x: 20, y: 30 }]);
    });

    QUnit.test('raised after moves', function(assert) {
        this.triggerMultitouch('start', { x: 10, y: 20 }, null, 0).triggerMultitouch('start', { x: 10, y: 40 }, null, 1).
            triggerMultitouch('move', { x: 30, y: 10 }, null, 1).triggerMultitouch('move', { x: 70, y: 10 }, null, 0).
            triggerMultitouch('end', {}, null, 0);

        assert.deepEqual(this.onZoom.lastCall.args, [{ ratio: 2, x: 10, y: 30 }]);
    });

    QUnit.test('not raised when disabled', function(assert) {
        this.tracker.setOptions({ touchEnabled: false });
        this.triggerMultitouch('start', { x: 10, y: 20 }, null, 0).triggerMultitouch('start', { x: 30, y: 40 }, null, 1).triggerMultitouch('end', {}, null, 1);

        assert.strictEqual(this.onZoom.lastCall, null);
    });
});

QUnit.module('hover / mouse', $.extend({}, environment, {
    eventMode: 'mouse',
    stubbedCallbacks: ['onHoverOn', 'onHoverOff']
}));

QUnit.test('"hover-on" is raised on move over element with data', function(assert) {
    this.trigger('move', {});

    assert.deepEqual(this.onHoverOn.lastCall.args, [{ data: 'test-data' }]);
});

QUnit.test('"hover-off" is raised on move over element without data', function(assert) {
    this.trigger('move', {}).triggerNoData('move', {});

    assert.deepEqual(this.onHoverOff.lastCall.args, [{ data: 'test-data' }]);
});

QUnit.test('"hover-off" is not raised before "hover-on"', function(assert) {
    this.triggerNoData('move', {});

    assert.strictEqual(this.onHoverOff.lastCall, null);
});

QUnit.test('no stackoverflow when "reset" is called on "hover-off"', function(assert) {
    this.onHoverOff = $.proxy(function() {
        this.tracker.reset();
    }, this);
    this.trigger('move', {}).triggerNoData('move', {});

    assert.ok(true);
});

$.each(['touch', 'MSPointer', 'pointer'], function(_, type) {
    QUnit.module('hover / ' + type, $.extend({}, environment, {
        eventMode: type,
        stubbedCallbacks: ['onHoverOn', 'onHoverOff']
    }));

    QUnit.test('"hover-on" is raised on start over element with data', function(assert) {
        this.trigger('start', {});

        assert.deepEqual(this.onHoverOn.lastCall.args, [{ data: 'test-data' }]);
    });

    QUnit.test('"hover-off" is raised on start over element without data', function(assert) {
        this.trigger('start', {}).triggerNoData('start', {});

        assert.deepEqual(this.onHoverOff.lastCall.args, [{ data: 'test-data' }]);
    });

    QUnit.test('"hover-off" is not raised before "hover-on"', function(assert) {
        this.triggerNoData('start', {});

        assert.strictEqual(this.onHoverOff.lastCall, null);
    });

    QUnit.test('no stackoverflow when "reset" is called on "hover-off"', function(assert) {
        this.onHoverOff = $.proxy(function() {
            this.tracker.reset();
        }, this);
        this.trigger('start', {}).triggerNoData('start', {});

        assert.ok(true);
    });

    QUnit.test('not raised when disabled', function(assert) {
        this.tracker.setOptions({ touchEnabled: false });
        this.trigger('start', {});

        assert.strictEqual(this.onHoverOn.lastCall, null);
    });
});

const StubFocus = vizMocks.stubClass(new trackerModule.Focus(), null, {
    $constructor: function() {
        currentTest().focus = this;
    }
});

QUnit.module('focus / projection', $.extend({}, environment, {
    beforeEach: function() {
        trackerModule._DEBUG_stubFocusType(StubFocus);
        environment.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
        trackerModule._DEBUG_restoreFocusType();
    }
}));

// 'zoom' is not tested because there is another test which checks that there is one handler for both events
QUnit.test('focus is canceled on projection \'center\' event', function(assert) {
    this.projection.on.lastCall.args[0].center();
    assert.deepEqual(this.focus.cancel.lastCall.args, []);
});

QUnit.module('focus / mouse', $.extend({}, environment, {
    eventMode: 'mouse',
    beforeEach: function() {
        trackerModule._DEBUG_stubFocusType(StubFocus);
        environment.beforeEach.apply(this, arguments);

        this.focus.cancel.reset();
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
        trackerModule._DEBUG_restoreFocusType();
    }
}));

QUnit.test('focus is turned off then turned on on move over element with data', function(assert) {
    this.trigger('move', { x: 10, y: 20 });

    assert.strictEqual(this.focus.turnOff.callCount, 1, 'turn off');
    assert.deepEqual(this.focus.turnOn.lastCall.args, ['test-data', { x: 10, y: 20 }], 'turn on');
});

QUnit.test('focus is turned off and not turned on on move over element without data', function(assert) {
    this.triggerNoData('move', {});

    assert.strictEqual(this.focus.turnOff.callCount, 1, 'turn off');
    assert.strictEqual(this.focus.stub('turnOn').lastCall, null, 'turn on');
});

QUnit.test('focus is canceled on move during dragging', function(assert) {
    this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 20, y: 30 });

    assert.deepEqual(this.focus.cancel.lastCall.args, []);
});

QUnit.test('focus is canceled on wheel', function(assert) {
    this.trigger('wheel', {});

    assert.deepEqual(this.focus.cancel.lastCall.args, []);
});

$.each(['touch', 'MSPointer', 'pointer'], function(_, type) {
    QUnit.module('focus / ' + type, $.extend({}, environment, {
        eventMode: type,
        beforeEach: function() {
            trackerModule._DEBUG_stubFocusType(StubFocus);
            environment.beforeEach.apply(this, arguments);
            this.focus.cancel.reset();
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
            trackerModule._DEBUG_restoreFocusType();
        }
    }));

    QUnit.test('focus is turned off then turned on on start on element with data', function(assert) {
        this.trigger('start', { x: 10, y: 20 });

        assert.strictEqual(this.focus.turnOff.callCount, 1, 'turn off');
        assert.deepEqual(this.focus.turnOn.lastCall.args, ['test-data', { x: 10, y: 20 }], 'turn on');
    });

    QUnit.test('focus is turned off and not turned on on start on element without data', function(assert) {
        this.triggerNoData('start', {});

        assert.strictEqual(this.focus.turnOff.callCount, 1, 'turn off');
        assert.strictEqual(this.focus.stub('turnOn').lastCall, null, 'turn on');
    });

    QUnit.test('focus is canceled on start during dragging', function(assert) {
        this.trigger('start', { x: 10, y: 20 }).trigger('move', { x: 30, y: 40 });

        assert.deepEqual(this.focus.cancel.lastCall.args, []);
    });

    QUnit.test('focus is canceled on start during zooming', function(assert) {
        this.triggerMultitouch('start', { x: 10, y: 20 }, null, 0).triggerMultitouch('start', { x: 40, y: 10 }, null, 1);

        assert.deepEqual(this.focus.cancel.lastCall.args, []);
    });

    QUnit.test('not raised when disabled', function(assert) {
        this.tracker.setOptions({ touchEnabled: false });
        this.trigger('start', { x: 10, y: 20 });

        assert.strictEqual(this.focus.stub('turnOn').lastCall, null);
    });
});

QUnit.module('Focus class', {
    beforeEach: function() {
        this.focusOn = sinon.stub();
        this.focusMove = sinon.stub();
        this.focusOff = sinon.stub();
        const callbacks = {
            'focus-on': this.focusOn,
            'focus-move': this.focusMove,
            'focus-off': this.focusOff
        };
        this.focus = new trackerModule.Focus(function(name, arg) {
            callbacks[name](arg);
        });
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.focus.dispose();
        this.clock.restore();
    }
});

QUnit.test('instance type', function(assert) {
    assert.ok(this.focus instanceof trackerModule.Focus);
});

QUnit.test('turnOn', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });

    const arg = this.focusOn.lastCall.args[0];
    assert.strictEqual(typeof arg.done, 'function');
    delete arg.done;
    assert.deepEqual(this.focusOn.lastCall.args[0], { data: 'data-1', x: 10, y: 20 });
});

QUnit.test('turnOn then turnOn again', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focus.turnOn('data-1', { x: 40, y: 60 });

    delete this.focusOn.lastCall.args[0].done;
    assert.deepEqual(this.focusOn.lastCall.args[0], { data: 'data-1', x: 40, y: 60 });
});

QUnit.test('turnOn when on', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(true);
    this.focus.turnOn('data-1', { x: 20, y: 40 });

    assert.deepEqual(this.focusMove.lastCall.args[0], { data: 'data-1', x: 20, y: 40 });
});

QUnit.test('turnOn when off', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(false);
    this.focus.turnOn('data-1', { x: 20, y: 40 });

    assert.strictEqual(this.focusOn.callCount, 1);
    assert.strictEqual(this.focusMove.lastCall, null);
});

QUnit.test('turnOn / data is changed', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(true);
    this.focus.turnOn('data-2', { x: 20, y: 30 });

    delete this.focusOn.lastCall.args[0].done;
    assert.deepEqual(this.focusOn.lastCall.args[0], { data: 'data-2', x: 20, y: 30 });
});

QUnit.test('turnOff when on', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(true);
    this.focus.turnOff(FOCUS_OFF_DELAY);

    this.clock.tick(FOCUS_OFF_DELAY);
    assert.deepEqual(this.focusOff.lastCall.args, [{ data: 'data-1' }]);
});

QUnit.test('turnOff when off', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(false);
    this.focus.turnOff(FOCUS_OFF_DELAY);

    assert.strictEqual(this.focusOff.lastCall, null);
});

QUnit.test('turnOff should update data synchronously (T1211755)', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(true);
    this.focus.turnOff();

    assert.deepEqual(this.focusOff.lastCall.args, [{ data: 'data-1' }]);
});

QUnit.test('cancel when on', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(true);
    this.focus.cancel();

    assert.deepEqual(this.focusOff.lastCall.args, [{ data: 'data-1' }]);
});

QUnit.test('cancel when off', function(assert) {
    this.focus.turnOn('data-1', { x: 10, y: 20 });
    this.focusOn.lastCall.args[0].done(false);
    this.focus.cancel();

    assert.strictEqual(this.focusOff.lastCall, null);
});

QUnit.test('on disabled target then on other target then on initial target again', function(assert) {
    this.focus.turnOn('data-1', {});
    this.focusOn.lastCall.args[0].done(false);

    this.focus.turnOff(FOCUS_OFF_DELAY);
    this.focus.turnOn('data-2', {});

    this.focus.turnOff(FOCUS_OFF_DELAY);
    this.focus.turnOn('data-1', {});

    assert.strictEqual(this.focusMove.lastCall, null);
});

// T173037
QUnit.test('Turn on then turn on disabled then cancel', function(assert) {
    this.focus.turnOn('data-1', {});

    this.focusOn.lastCall.args[0].done(true);
    this.focus.turnOn('data-2', {});

    this.focusOn.lastCall.args[0].done(false);

    this.focus.cancel();

    assert.deepEqual(this.focusOff.lastCall.args, [{ data: 'data-1' }]);
});
