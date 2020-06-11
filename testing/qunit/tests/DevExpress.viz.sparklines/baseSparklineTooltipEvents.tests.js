/* global createTestContainer */

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const pointerEvents = require('events/pointer');

require('viz/sparkline');

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

const environment = {
    beforeEach: function() {
        this.$container = $(createTestContainer('#container'));
        this.createSparkline = function(options) {
            return this.$container.dxSparkline(options).dxSparkline('instance');
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
};

QUnit.module('Tooltip events', environment);

function createTest(name, actions, asserts) {
    ['down', 'move'].forEach(act => {
        QUnit.test(`${name}. pointer${act}`, function(assert) {
            const tooltipShown = sinon.spy();
            const tooltipHidden = sinon.spy();
            const sparkline = this.createSparkline({
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
    const sparkline = this.createSparkline({
        dataSource: [4, 8, 5],
        tooltip: {
            enabled: true
        },
        onTooltipShown: tooltipShown,
        onTooltipHidden: tooltipHidden
    });

    const tracker = sparkline._tooltipTracker;
    this.trigger(pointerEvents.move, tracker, 10, 15);
    tooltipShown.reset();

    // act
    this.$container.remove();

    this.triggerDocument(pointerEvents.move);
    this.triggerDocument(pointerEvents.down);

    // assert
    assert.strictEqual(tooltipShown.callCount, 0);
    assert.strictEqual(tooltipHidden.callCount, 0);
});
