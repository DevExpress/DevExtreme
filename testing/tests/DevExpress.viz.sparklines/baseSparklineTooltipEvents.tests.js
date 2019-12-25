/* global createTestContainer */

var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    rendererModule = require('viz/core/renderers/renderer'),
    baseSparkline = require('viz/sparklines/base_sparkline'),
    eventsEngine = require('events/core/events_engine'),
    devices = require('core/devices'),
    DEFAULT_EVENTS_DELAY = 100;

require('viz/sparkline');

var fixture = $('<div>')
    .attr('id', 'qunit-fixture')
    .appendTo($('body'));


$('<div>')
    .attr('id', 'container')
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
            return this.$container.dxSparkline(options).dxSparkline('instance');
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

    sparkline._DEBUG_showCallback = function() {
        assert.ok(true, 'Show timeout set 1 time');
    };

    this.trigger('mouseover', sparkline._tooltipTracker);
});

QUnit.test('Mousemove with big distance', function(assert) {
    assert.expect(1);
    var tooltipShown = sinon.spy();
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            },
            onTooltipShown: tooltipShown
        }),
        tracker = sparkline._tooltipTracker;

    this.trigger('mouseover', tracker, 5, 5);

    this.trigger('mousemove', tracker, 10, 5);
    this.trigger('mousemove', tracker, 10, 20);
    this.trigger('mousemove', tracker, 30, 10);
    this.trigger('mousemove', tracker, 40, 5);
    assert.equal(tooltipShown.callCount, 1);
});

QUnit.test('Mousemove with small distance', function(assert) {
    assert.expect(1);
    var tooltipShown = sinon.spy();
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            },
            onTooltipShown: tooltipShown
        }),
        tracker = sparkline._tooltipTracker;

    this.trigger('mouseover', tracker, 5, 5);

    this.trigger('mousemove', tracker, 7, 5);
    this.trigger('mousemove', tracker, 7, 3);
    this.trigger('mousemove', tracker, 4, 3);
    this.trigger('mousemove', tracker, 4, 6);
    assert.equal(tooltipShown.callCount, 1);
});

QUnit.test('Quick mouseout after mouseover', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        }),
        tracker = sparkline._tooltipTracker;

    sparkline._DEBUG_clearShowTooltipTimeout = 0;

    this.trigger('mouseover', tracker);
    this.trigger('mouseout', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);

    assert.equal(sparkline._DEBUG_clearShowTooltipTimeout, 1, 'Clear show tooltip timeout 1 time');
});

QUnit.test('Mouseout after mouseover', function(assert) {
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
        that.trigger('mouseout', tracker);
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };
    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };
    that.trigger('mouseover', tracker);
});

QUnit.test('Hide tooltip on scroll without delay', function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: 'generic' });
        assert.expect(2);
        var sparkline = this.createSparkline({
                dataSource: [4, 8, 6, 9, 5],
                tooltip: {
                    enabled: true
                },
                onTooltipHidden: function() {
                    assert.ok(true);
                }
            }),
            tracker = sparkline._tooltipTracker,
            that = this;

        sparkline._DEBUG_hideTooltipTimeoutSet = 0;
        sparkline._DEBUG_hideCallback = function() {
            assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 0, 'Hide timeout set 1 time');
        };
        that.trigger('mouseover', tracker);
        eventsEngine.trigger(sparkline.$element(), 'scroll');
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test('Should not crash on parent scroll if tooltip was not shown', function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: 'generic' });
        assert.expect(0);
        var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            }
        });

        eventsEngine.trigger(sparkline.$element(), 'scroll');
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test('B252494 - Tooltip exception', function(assert) {
    assert.expect(2);
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
        sparkline.option('type', null);
        that.trigger('mouseout', tracker);
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };
    sparkline._DEBUG_hideCallback = function(tooltipWasShowed) {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
        assert.ok(!tooltipWasShowed, 'Tooltip is not showed');
    };
    that.trigger('mouseover', tracker);

});

QUnit.test('Dispose after show - B252555', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5]
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.trigger('mouseout', tracker);
        $(that.$container).remove();
        that.clock.tick(DEFAULT_EVENTS_DELAY);
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.ok(false);
    };

    that.trigger('mouseover', tracker);
});

QUnit.test('Dispose after hide - B252555', function(assert) {
    assert.expect(1);
    var sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5]
        }),
        tracker = sparkline._tooltipTracker,
        that = this;

    sparkline._DEBUG_hideTooltipTimeoutSet = 0;

    sparkline._DEBUG_showCallback = function() {
        that.trigger('mouseout', tracker);
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        sparkline._DEBUG_showCallback = function() {
            assert.ok(false);
        };

        $(that.$container).remove();
        that.trigger('mouseover', tracker);
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'Hide timeout set 1 time');
    };

    that.trigger('mouseover', tracker);
});

QUnit.module('Tooltip events on touch device', environment);

QUnit.test('Touchstart', function(assert) {
    assert.expect(1);
    var tooltipShown = sinon.spy(),
        sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            },
            onTooltipShown: tooltipShown
        }),
        tracker = sparkline._tooltipTracker;


    this.trigger('touchstart', tracker);
    assert.equal(tooltipShown.callCount, 1);
});

QUnit.test('Pointerdown', function(assert) {
    assert.expect(1);
    var tooltipShown = sinon.spy(),
        sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 5],
            tooltip: {
                enabled: true
            },
            onTooltipShown: tooltipShown
        }),
        tracker = sparkline._tooltipTracker;

    this.trigger('pointerdown', tracker);
    assert.equal(tooltipShown.callCount, 1);
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

    this.trigger('touchstart', tracker);
    this.triggerDocument('touchend');
    this.clock.tick(DEFAULT_EVENTS_DELAY);
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

    this.trigger('pointerdown', tracker);
    this.triggerDocument('pointerup');
    this.clock.tick(DEFAULT_EVENTS_DELAY);
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
        that.triggerDocument('touchstart');
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger('touchstart', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
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
        that.triggerDocument('pointerdown');
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger('pointerdown', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
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
        that.triggerDocument('touchstart');
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger('touchstart', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
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
        that.triggerDocument('pointerdown');
        that.clock.tick(DEFAULT_EVENTS_DELAY);
    };

    sparkline._DEBUG_hideCallback = function() {
        assert.equal(sparkline._DEBUG_hideTooltipTimeoutSet, 1, 'hide timeout set 1 time');
    };

    this.trigger('pointerdown', tracker);
    this.clock.tick(DEFAULT_EVENTS_DELAY);
});
