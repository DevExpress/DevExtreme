import $ from 'jquery';
import { noop } from 'core/utils/common';
import Swipeable from 'common/core/events/gesture/swipeable';
import swipeEvents from 'common/core/events/swipe';
import pointerMock from '../../helpers/pointerMock.js';

QUnit.module('swipeable', {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body').css('width', 100);
        this.pointer = pointerMock(this.element);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.element.remove();
        this.clock.restore();
    }
}, () => {
    QUnit.test('render', function(assert) {
        new Swipeable(this.element);
        assert.ok(this.element.hasClass('dx-swipeable'));
    });


    $.each({
        'onStart': 'start',
        'onUpdated': '',
        'onEnd': 'end',
        'onCancel': 'cancel'
    }, function(key, value) {
        QUnit.test('\'' + key + '\' handler attached', function(assert) {
            let called = 0;
            const options = {};

            options[key] = function() {
                called++;
            };

            new Swipeable(this.element, options);
            this.element.trigger(swipeEvents.swipe + value);

            assert.equal(called, 1);
        });

        QUnit.test('\'' + key + '\' option change', function(assert) {
            let called = 0;
            const options = {};

            options[key] = noop;

            const swipeable = new Swipeable(this.element, options);
            this.element.trigger(swipeEvents.swipe + value);
            assert.equal(called, 0);

            swipeable.option(key, function() {
                called++;
            });
            this.element.trigger(swipeEvents.swipe + value);

            assert.equal(called, 1);
        });
    });

    QUnit.test('\'elastic\' option', function(assert) {
        assert.expect(2);

        const swipeable = new Swipeable(this.element, {
            elastic: true,
            onStart: function(e) {
                e.event.maxRightOffset = 1;
                e.event.maxLeftOffset = 1;
            },
            onEnd: function(e) {
                assert.equal(e.event.offset, 2);
            }
        });

        this.pointer
            .start()
            .down()
            .move(400)
            .up();

        this.clock.tick(400);

        swipeable.option({
            elastic: false,
            onEnd: function(e) {
                assert.equal(e.event.offset, 1);
            }
        });

        this.pointer
            .start()
            .down()
            .move(400)
            .up();
    });

    QUnit.test('\'itemSizeFunc\' option', function(assert) {
        assert.expect(2);

        const swipeable = new Swipeable(this.element, {
            itemSizeFunc: function() {
                return 100;
            },
            onEnd: function(e) {
                assert.equal(e.event.offset, 0.5);
            }
        });

        this.pointer
            .start()
            .down()
            .move(50)
            .up();

        this.clock.tick(400);

        swipeable.option({
            itemSizeFunc: function() {
                return 1000;
            }
        });

        this.pointer
            .start()
            .down()
            .move(500)
            .up();
    });
});

