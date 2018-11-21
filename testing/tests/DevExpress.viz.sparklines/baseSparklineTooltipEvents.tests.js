/* global createTestContainer */

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    baseSparkline = require("viz/sparklines/base_sparkline"),
    DEFAULT_EVENTS_DELAY = 200,
    TOUCH_EVENTS_DELAY = 1000;

require("viz/sparkline");

var fixture = $("<div>")
    .attr("id", "qunit-fixture")
    .appendTo($("body"));


$("<div>")
    .attr("id", "container")
    .css({ width: 250, height: 100 })
    .appendTo(fixture);


QUnit.begin(function() {
    rendererModule.Renderer = function() {
        return new vizMocks.Renderer();
    };
});

var environment = {
    beforeEach: function() {
        baseSparkline._DEBUG_reset();
        // this._originalRendererType = dxSparkline.prototype._rendererType;
        this.$container = createTestContainer('#container');
        this.createSparkline = function(options) {
            return this.$container.dxSparkline(options).dxSparkline("instance");
        };
        // dxSparkline.prototype._rendererType = vizMocks.Renderer;
        this.triggerDocument = function(name) {
            var event = $.Event(name);

            //  Because of ui.events.js
            event.changedTouches = [{}];
            event.touches = [{}];

            $(window.document).trigger(event);
        };

        this.trigger = function(type, target, x, y) {
            var event = $.Event(type);
            event.pageX = x;
            event.pageY = y;
            target.trigger(event);
            this.triggerDocument.apply(this, arguments); //  Bubbling emulation
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        // dxSparkline.prototype._rendererType = this._originalRendererType;
        this.$container.remove();
    }
};


QUnit.module('Tooltip events on non-touch device', environment);

QUnit.test('Mouseover after delay', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
        dataSource: [4, 8, 6, 9, 5],
        tooltip: {
            enabled: true
        }
    });

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
    };

    this.trigger('mouseover', sparkline._tooltipTracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Mousemove with big distance', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 5, 'Show timeout set 5 time');
    };
    this.trigger('mouseover', tracker, 5, 5);

    this.trigger('mousemove', tracker, 10, 5);
    this.trigger('mousemove', tracker, 10, 20);
    this.trigger('mousemove', tracker, 30, 10);
    this.trigger('mousemove', tracker, 40, 5);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Mousemove with small distance', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
    };
    this.trigger('mouseover', tracker, 5, 5);

    this.trigger('mousemove', tracker, 7, 5);
    this.trigger('mousemove', tracker, 7, 3);
    this.trigger('mousemove', tracker, 4, 3);
    this.trigger('mousemove', tracker, 4, 6);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Quick mouseout after mouseover', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_clearShowTooltipTimeout = 0;

    this.trigger('mouseover', tracker);
    this.trigger('mouseout', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);

    assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
    assert.equal(sparkline._DEBUG_clearShowTooltipTimeout, 1, 'Clear show tooltip timeout 1 time');
});

QUnit.test('Mouseout after mouseover', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        that.trigger('mouseout', tracker);
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };
    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };
    that.trigger('mouseover', tracker);
    that.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Hide tooltip on mousewheel without delay', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 0, 'Hide timeout set 1 time');
    };
    that.trigger('mouseover', tracker);
    that.clock.tick(DEFAULT_EVENTS_DELAY);
    that.trigger('dxmousewheel', tracker);
});

QUnit.test('B252494 - Tooltip exception', function(assert) {
    assert.expect(3);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        sparkline.option('type', null);
        that.trigger('mouseout', tracker);
    };
    sparkline._DEBUG_hideCallback = function(tooltipWasShowed) {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
        assert.ok(!tooltipWasShowed, 'Tooltip is not showed');
    };
    that.trigger('mouseover', tracker);
    that.clock.tick(DEFAULT_EVENTS_DELAY);
    that.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Dispose after show - B252555', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5]
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.trigger('mouseout', tracker);
        $(that.$container).remove();
        that.clock.tick(DEFAULT_EVENTS_DELAY);
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'Show timeout set 1 time');
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.ok(false);
    };

    that.trigger('mouseover', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.test('Dispose after hide - B252555', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5]
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.trigger('mouseout', tracker);
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        sparkline._DEBUG_showCallback = function() {
            assert.ok(false);
        };
        that.trigger('mouseover', tracker);
        $(that.$container).remove();
        that.clock.tick(DEFAULT_EVENTS_DELAY);
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 2, 'Show timeout set 2 time');
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };

    that.trigger('mouseover', tracker);
    that.clock.tick(DEFAULT_EVENTS_DELAY);
});

QUnit.module('Tooltip events on touch device', environment);

QUnit.test('Touchstart', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'show timeout set 1 time');
    };

    this.trigger("touchstart", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Pointerdown', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_showCallback = function() {
        assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1, 'show timeout set 1 time');
    };

    this.trigger("pointerdown", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Quick touchend', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("touchstart", tracker);
    this.triggerDocument("touchend");
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Quick pointerup', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("pointerdown", tracker);
    this.triggerDocument("pointerup");
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Touchstart in another place', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.triggerDocument("touchstart");
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("touchstart", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Pointerdown in another place', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.triggerDocument("pointerdown");
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("pointerdown", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Touchstart on document after tooltip showing', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.triggerDocument("touchstart");
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("touchstart", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Pointerdown on document after tooltip showing', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.triggerDocument("pointerdown");
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger("pointerdown", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Long touchstart when tooltip was shown', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        sparkline._DEBUG_showCallback = function() {
            assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 2, 'show timeout set 2 time');
            assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 0, 'hide timeout set 0 time');
        };
        that.trigger("touchstart", tracker);
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    this.trigger("touchstart", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('Long pointerdown when tooltip was shown', function(assert) {
    assert.expect(2);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        sparkline._DEBUG_showCallback = function() {
            assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 2, 'show timeout set 2 time');
            assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 0, 'hide timeout set 0 time');
        };
        that.trigger("pointerdown", tracker);
        that.clock.tick(TOUCH_EVENTS_DELAY);
    };

    this.trigger("pointerdown", tracker);
    this.clock.tick(TOUCH_EVENTS_DELAY);
});

QUnit.test('B239993 - Tooltip exception. With render. Touch', function(assert) {
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: false
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline.render();

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        assert.ok(false, 'callback should not be');
    };
    sparkline._DEBUG_hideCallback = function(tooltipShown) {
        assert.ok(!tooltipShown, 'tooltip should not be shown');
    };

    that.trigger("touchstart", tracker);
    that.trigger("touchend", tracker);

    assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1);
    assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1);
});

QUnit.test('B239993 - Tooltip exception. With render. Pointer', function(assert) {
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: false
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline.render();

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        assert.ok(false, 'callback should not be');
    };
    sparkline._DEBUG_hideCallback = function(tooltipWasShown) {
        assert.ok(!tooltipWasShown, 'tooltip should not be shown');
    };

    that.trigger("pointerdown", tracker);
    that.trigger("pointerup", tracker);

    assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1);
    assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1);
});

QUnit.test('B239993 - Tooltip exception. Without render. Touch', function(assert) {
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: false
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        assert.ok(false, 'callback should not be');
    };
    sparkline._DEBUG_hideCallback = function(tooltipShown) {
        assert.ok(!tooltipShown, 'tooltip should not be shown');
    };
    that.trigger("touchstart", tracker);
    that.trigger("touchend", tracker);

    assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1);
    assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1);
});

QUnit.test('B239993 - Tooltip exception. Without render. Pointer', function(assert) {
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: false
            }
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_showTooltipTimeoutSet = 0;
    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        assert.ok(false, 'callback should not be');
    };
    sparkline._DEBUG_hideCallback = function(tooltipShown) {
        assert.ok(!tooltipShown, 'tooltip should not be shown');
    };

    that.trigger("pointerdown", tracker);
    that.trigger("pointerup", tracker);

    assert.equal(sparkline._DEBUG_showTooltipTimeoutSet, 1);
    assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1);
});
