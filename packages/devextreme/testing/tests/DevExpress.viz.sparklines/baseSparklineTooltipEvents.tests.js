/* global createTestContainer */

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const pointerEvents = require('common/core/events/pointer');

require('viz/sparkline');
require('viz/bullet');

const fixture = $('<div>')
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

const environment = (widget) => ({
    beforeEach: function() {
        this.$container = $(createTestContainer('#container'));
        this.createWidget = function(options) {
            return this.$container[widget](options)[widget]('instance');
        };
        this.triggerDocument = function(name, target, x, y) {
            const event = $.Event(name, { pageX: x, pageY: y });

            //  Because of ui.events.js
            event.changedTouches = [{}];
            event.touches = [{}];

            $(window.document).trigger(event);
        };

        this.trigger = function(type, target, x, y) {
            const event = $.Event(type);
            event.pageX = x;
            event.pageY = y;
            target.trigger(event);
            this.triggerDocument.apply(this, arguments); //  Bubbling emulation
        };
    },
    afterEach: function() {
        this.$container.remove();
    }
});

QUnit.module('Tooltip events', environment('dxSparkline'));

function createTest(name, actions, asserts) {
    ['down', 'move'].forEach(act => {
        QUnit.test(`${name}. pointer${act}`, function(assert) {
            const tooltipShown = sinon.spy();
            const tooltipHidden = sinon.spy();
            const sparkline = this.createWidget({
                dataSource: [4, 8, 5],
                tooltip: {
                    enabled: true
                },
                onTooltipShown: tooltipShown,
                onTooltipHidden: tooltipHidden
            });

            actions.arrange.call(this, pointerEvents[act], sparkline._tooltipTracker);

            // act
            actions.act.call(this, pointerEvents[act], sparkline._tooltipTracker);

            // assert
            assert.strictEqual(tooltipShown.callCount, asserts.tooltipShownCallCount);
            assert.strictEqual(tooltipHidden.callCount, asserts.tooltipHiddenCallCount);
        });
    });
}

createTest('Tooltip showing', {
    arrange() { },
    act(act, tracker) {
        this.trigger(act, tracker, 10, 15);
    }
}, {
    tooltipShownCallCount: 1,
    tooltipHiddenCallCount: 0
});

createTest('Tooltip hiding after move pointer outside canvas', {
    arrange(act, tracker) {
        this.trigger(act, tracker, 10, 15);
    },
    act(act, tracker) {
        this.trigger(act, tracker, 1000, 1000);
    }
}, {
    tooltipShownCallCount: 1,
    tooltipHiddenCallCount: 1
});

QUnit.test('No events hendling after dispose', function(assert) {
    const tooltipShown = sinon.spy();
    const tooltipHidden = sinon.spy();
    const sparkline = this.createWidget({
        dataSource: [4, 8, 5],
        tooltip: {
            enabled: true
        },
        onTooltipShown: tooltipShown,
        onTooltipHidden: tooltipHidden
    });

    const tracker = sparkline._tooltipTracker;
    this.trigger(pointerEvents.move, tracker, 10, 15);
    tooltipShown.resetHistory();

    // act
    this.$container.remove();

    this.triggerDocument(pointerEvents.move);
    this.triggerDocument(pointerEvents.down);

    // assert
    assert.strictEqual(tooltipShown.callCount, 0);
    assert.strictEqual(tooltipHidden.callCount, 0);
});

QUnit.module('Tooltip events, bullet', environment('dxBullet'));

QUnit.test('Tooltip should not hide if in the canvas with margins', function(assert) {
    const tooltipShown = sinon.spy();
    const tooltipHidden = sinon.spy();
    const bullet = this.createWidget({
        startScaleValue: 0,
        endScaleValue: 35,
        tooltip: {
            enabled: true
        },
        value: 20,
        onTooltipShown: tooltipShown,
        onTooltipHidden: tooltipHidden
    });

    const tracker = bullet._tooltipTracker;
    this.trigger(pointerEvents.move, tracker, 10, 15);
    this.trigger(pointerEvents.move, tracker, 3, 5);
    this.trigger(pointerEvents.move, tracker, 253, 35);

    // assert
    assert.strictEqual(tooltipShown.callCount, 1);
    assert.strictEqual(tooltipHidden.callCount, 0);
});
