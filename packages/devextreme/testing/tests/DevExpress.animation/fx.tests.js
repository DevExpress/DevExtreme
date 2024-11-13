import $ from 'jquery';
import renderer from 'core/renderer';
import eventsEngine from 'common/core/events/core/events_engine';
import fx from 'common/core/animation/fx';
import translator from 'common/core/animation/translator';
import animationFrame from 'common/core/animation/frame';
import positionUtils from 'common/core/animation/position';
import support from '__internal/core/utils/m_support';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            .my-animation {
                -moz-transition-property: all;
                -o-transition-property: all;
                -webkit-transition-property: all;
                transition-property: all;
                -moz-transform: translate3d(0px,0px,0px);
                -o-transform: translate3d(0px,0px,0px);
                -webkit-transform: translate3d(0px,0px,0px);
                transform: translate3d(0px,0px,0px);
            }
            .my-animation.my-animation-active {
                -moz-transform: translate3d(1000px,0px,0px);
                -o-transform: translate3d(1000px,0px,0px);
                -webkit-transform: translate3d(1000px,0px,0px);
                transform: translate3d(1000px,0px,0px);
            }
            #container {
                position: relative;
            }
            #test {
                position: absolute;
                top:0;
                left:0;
                width: 50px;
                height: 50px;
                background: yellow;
            }
            #transitionPropTest {
                position: absolute;
                top:0;
                left:0;
                width: 50px;
                height: 50px;
                background: red;
            }
            #staticTest {
                width: 50px;
                height: 50px;
                background: green;
            }
        </style>

        <div id="qunit-fixture" class="qunit-fixture-visible">
            <div id="container">
                <div id="test"></div>
                <div id="transitionPropTest"></div>
                <div id="staticTest"></div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

const SIMULATED_TRANSITIONEND_TIMEOUT_DATA_KEY = 'dxSimulatedTransitionTimeoutKey';
const ANIM_QUEUE_KEY = 'dxAnimQueue';
const ANIM_DATA_KEY = 'dxAnimData';

QUnit.module('frame transitions', {
    beforeEach: function() {
        this.animate = function($element, config) {
            return fx.animate($element, $.extend({ strategy: 'frame' }, config));
        };

        this.clock = sinon.useFakeTimers();

        this.originalRAF = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1);
        };
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this.originalRAF;
    }
});

QUnit.test('basic animation', function(assert) {
    assert.expect(6);

    const $element = $('#test');
    const done = assert.async();

    this.animate($element, {
        to: { left: 1000 },
        delay: 500,
        duration: 50,
        complete: function() {
            assert.equal($element.position().left, 1000, 'complete callback fired correctly');
            done();
        }
    });

    assert.equal($element.position().left, 0, 'animation not started until delay is not expired');

    this.clock.tick(250);
    assert.equal($element.position().left, 0, 'animation not started until delay is not expired');

    this.clock.tick(250);
    assert.equal($element.position().left, 0, 'animation not started until delay is not expired');

    this.clock.tick(20);
    assert.ok($element.position().left > 0 && $element.position().left < 1000, 'animation is performing');

    this.clock.tick(20);
    assert.ok($element.position().left > 0 && $element.position().left < 1000, 'animation is performing');

    this.clock.tick(20);
});

QUnit.test('basic animation when window was scrolled', function(assert) {
    assert.expect(2);

    const $container = $('#container');
    const $wrapper = $('<div>').appendTo('body');
    const $element = $('<div>').appendTo('body');

    try {
        $wrapper.css({
            minHeight: '800px',
            minWidth: '800px',
            height: '150%',
            width: '150%',
            position: 'absolute',
            top: '0',
            left: '0'
        });
        $element.css({ height: 50, width: 50, top: '200px', background: 'blue' });

        const initialTopPosition = $element.get(0).getBoundingClientRect().top;
        const initialLeftPosition = $element.get(0).getBoundingClientRect().left;

        const done = assert.async();

        window.scrollBy(200, 200);

        this.animate($element, {
            type: 'slide',
            position: {
                my: 'right',
                at: 'right',
                of: $container
            },
            duration: 200,
            complete: function() {
                assert.roughEqual($element.get(0).getBoundingClientRect().top, initialTopPosition - 200, 1.5, 'position after animation is correct');
                assert.roughEqual($element.get(0).getBoundingClientRect().left, initialLeftPosition - 200, 1, 'position after animation is correct');
                done();
            }
        });
        this.clock.tick(250);
    } finally {
        window.scroll(0, 0);
        $wrapper.remove();
        $element.remove();
    }
});

QUnit.test('animation when window was scrolled', function(assert) {
    assert.expect(3);

    const $wrapper = $('<div>').appendTo('body');
    const $target = $('<div>').appendTo($wrapper);
    const $element = $('<div>').appendTo('body');

    try {
        $wrapper.css({ height: '150%', width: '150%', position: 'absolute', top: '0', left: '0' });
        $target.css({ height: 50, width: 50, position: 'absolute', top: '320px', left: '120px', background: 'green' });
        $element.css({ height: 50, width: 50, top: '200px', background: 'blue', position: 'absolute' });

        const done = assert.async();
        window.scrollBy(100, 200);

        this.animate($element, {
            type: 'slide',
            from: {
                position: {
                    my: 'top',
                    at: 'bottom',
                    of: window
                }
            },
            to: {
                position: {
                    my: 'bottom',
                    at: 'bottom',
                    of: window
                }
            },
            duration: 100,
            complete: function() {
                assert.roughEqual($element.get(0).getBoundingClientRect().top, $(window).height() - $element.height(), 1, 'position after animation is correct');
            }
        });
        this.clock.tick(150);

        this.animate($element, {
            type: 'slide',
            from: {
                position: {
                    my: 'top left',
                    at: 'top left',
                    of: $target
                }
            },
            to: {
                position: {
                    my: 'top left',
                    at: 'bottom right',
                    of: $target
                }
            },
            duration: 100,
            complete: function() {
                const offset = $element.offset();
                assert.roughEqual(offset.top, 370, 1.5, 'top position after animation to the target element is correct');
                assert.roughEqual(offset.left, 170, 1.5, 'left position after animation to the target element is correct');
                done();
            }
        });
        this.clock.tick(150);
    } finally {
        window.scroll(0, 0);
        $wrapper.remove();
        $target.remove();
        $element.remove();
    }
});

QUnit.test('draw callback', function(assert) {
    const $element = $('#test');
    const done = assert.async();

    let prop;
    this.animate($element, {
        from: { prop: 0 },
        to: { prop: 1000 },
        duration: 50,
        draw: function(values) {
            prop = values.prop;
        },
        complete: function() {
            done();
        }
    });

    this.clock.tick(20);
    assert.ok(prop > 0 && prop < 1000, 'animation is performing');

    this.clock.tick(30);
});

QUnit.test('Fallback to no animation strategy', function(assert) {
    assert.expect(1);

    const $element = $('#test');
    const savedSupport = support.transition;

    support.transition = function() { return false; };

    const result = this.animate($element, {
        type: 'css',
        from: 'my-animation',
        to: 'my-animation-active',
        duration: 50
    });

    assert.equal(result.state(), 'resolved', 'Do nothing asynchronously');

    support.transition = savedSupport;
});

QUnit.test('animation from', function(assert) {
    assert.expect(3);

    const done = assert.async();
    const $element = $('#test');

    this.animate($element, {
        from: { left: -1000 },
        to: { left: 1000 },
        delay: 500,
        duration: 50,
        complete: function() {
            assert.equal($element.position().left, 1000);
            done();
        }
    });

    assert.equal($element.position().left, -1000);

    this.clock.tick(500);
    assert.equal($element.position().left, -1000);

    this.clock.tick(50);
});

QUnit.test('isAnimating func', function(assert) {
    assert.expect(1);

    const $element = renderer('#test');

    this.animate($element, {
        to: { left: 1000 },
        duration: 50
    });

    assert.equal(fx.isAnimating($element), true);
});

QUnit.test('animation stop', function(assert) {
    assert.expect(1);

    const $element = $('#test');

    this.animate($element, {
        to: { left: 1000 },
        duration: 500
    });

    this.clock.tick(250);
    const leftAfterStop = $element.position().left;

    fx.stop($element);
    this.clock.tick(250);

    assert.equal($element.position().left, leftAfterStop, 'left property is not changed after animation stopped');
});

QUnit.test('animation stop with jump to the end', function(assert) {
    assert.expect(3);

    const $element = $('#test');

    this.animate($element, {
        to: { left: 1000 },
        duration: 500,
        complete: function() {
            assert.ok(true);
        }
    });

    this.clock.tick(250);
    fx.stop($element, true);

    assert.equal($element.position().left, 1000, 'left property equals to end value after animation stopped');

    this.clock.tick(250);
    assert.equal($element.position().left, 1000, 'left property is not changed after animation stopped');
});

QUnit.test('animation stop works even if called before animation start (delay case)', function(assert) {
    assert.expect(3);

    const $element = $('#test');

    this.animate($element, {
        to: { left: 1000 },
        delay: 500,
        duration: 500
    });

    fx.stop($element);

    this.clock.tick(250);

    assert.equal($element.position().left, 0, 'left property is not changed while delay timeout runs');

    this.clock.tick(250);
    assert.equal($element.position().left, 0, 'left property is not changed after delay timeout expired');

    this.clock.tick(500);
    assert.equal($element.position().left, 0, 'left property is not changed after animation duration expired');
});

QUnit.test('off flag', function(assert) {
    fx.off = true;

    try {
        const element = $('#test');

        this.animate(element, {
            to: { left: 1000 }
        });

        assert.equal(element.position().left, 1000);
    } finally {
        fx.off = false;
    }
});

QUnit.test('off flag with delay (T265612)', function(assert) {
    fx.off = true;

    try {
        const element = $('#test');

        this.animate(element, {
            delay: 100,
            to: { left: 1000 }
        });

        assert.equal(element.position().left, 1000);
    } finally {
        fx.off = false;
    }
});

QUnit.test('animation of \'translate\' prop', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $.when(this.animate($element, {
        from: { transform: 'translate(0, 0)' },
        to: { transform: 'translate(10px, 20px)' },
        duration: 50,
        complete: function() {
            assert.equal($element.css('transform'), 'matrix(1, 0, 0, 1, 10, 20)');
            done();
        }
    }));

    this.clock.tick(50);
});

QUnit.test('animation should correctly handle incorrect transform string', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $.when(this.animate($element, {
        from: { transform: 'translate(0, 0)' },
        to: { transform: '0000000000000000000000000000000000000000000000' },
        duration: 50,
        complete: function() {
            assert.ok(true, 'animation completed');
            done();
        }
    }));

    this.clock.tick(50);
});

QUnit.test('off flag, complete callback', function(assert) {
    fx.off = true;
    try {
        const element = $('#test');
        let called = 0;
        let args = null;

        this.animate(element, {
            to: { left: 1000 },
            complete: function() {
                called++;
                args = arguments;
            }
        });

        assert.equal(called, 1);

        assert.equal(args.length, 2);
        assert.strictEqual($(args[0]).get(0), element.get(0));
        assert.ok($.isPlainObject(args[1]));
    } finally {
        fx.off = false;
    }
});

QUnit.test('complete triggered when \'from\' and \'to\' are equal', function(assert) {
    assert.expect(0);

    const done = assert.async();

    this.animate('#test', {
        type: 'slide',
        from: { left: 0 },
        to: { left: 0 },
        duration: 100,
        complete: function() {
            done();
        }
    });

    this.clock.tick(100);
});

QUnit.test('regressions: \'stop\' method w/o \'jumpToEnd\' should prevent \'complete\' triggering', function(assert) {
    fx.off = false;

    const done = assert.async();
    let called = 0;
    const element = $('#test');

    this.animate(element, {
        from: { left: 100 },
        to: { left: 900 },
        duration: 25000,
        complete: function() {
            called++;
            assert.ok(false, 'if you see this assertion, complete callback was triggered');
        }
    });

    this.clock.tick(100);

    const lastElementLeft = element.position().left;
    assert.ok(lastElementLeft > 0);

    fx.stop(element);

    this.clock.tick(100);

    this.animate(element, {
        from: { left: 50 },
        to: { left: 150 },
        duration: 0,
        complete: function() {
            assert.equal(called, 0);
            done();
        }
    });

    this.clock.tick(30000);
});

QUnit.test('regressions: isAnimating should return false if animation is over', function(assert) {
    assert.expect(1);

    const element = $('#test');

    this.animate(element, {
        from: { left: 0 },
        to: { left: 100 },
        duration: 100,
        complete: function() {
            assert.equal(fx.isAnimating(element), false);
        }
    });

    this.clock.tick(100);
});

QUnit.test('regressions: element cleanup (memory leaks)', function(assert) {
    assert.expect(16);

    const element = $('#test');
    const clock = this.clock;
    const animate = this.animate;

    const checkElementCleaned = function() {
        assert.ok(!element.data(SIMULATED_TRANSITIONEND_TIMEOUT_DATA_KEY));
        assert.ok(!element.data(ANIM_DATA_KEY));
        assert.ok(!element.data(ANIM_QUEUE_KEY));
        assert.ok(!$._data(element, 'events'));
    };

    const animateElement = function(duration) {
        return animate(element, {
            from: { left: 0 },
            to: { left: 100 },
            duration: duration,
            complete: function() {
                checkElementCleaned();
            }
        });
    };

    animateElement(100);
    clock.tick(100);

    animateElement(30000);
    clock.tick(100);

    fx.stop(element);
    checkElementCleaned();

    animateElement(30000);

    clock.tick(100);
    fx.stop(element, true);

    checkElementCleaned();
});

QUnit.test('position my/at/of style', function(assert) {
    assert.expect(2);

    const $element = $('#test');
    const $container = $('#container');

    this.animate($element, {
        from: {
            position: {
                my: 'left',
                at: 'right',
                of: $container
            }
        },
        to: {
            position: {
                my: 'right',
                at: 'right',
                of: $container
            }
        },
        duration: 100,
        complete: function() {
            assert.equal($element.position().left, $container.width() - $element.width());
        }
    });

    assert.equal($element.position().left, $container.width());
    this.clock.tick(100);
});


if(support.transition()) {

    QUnit.module('CSS3 transitions', {
        beforeEach: function() {
            this.animate = function($element, config) {
                return fx.animate($element, $.extend({ strategy: 'transition' }, config));
            };
        }
    });

    QUnit.test('basic animation', function(assert) {
        assert.expect(2);

        const done = assert.async();
        const $element = $('#test');

        this.animate($element, {
            to: { left: 1000 },
            delay: 500,
            duration: 50,
            complete: function() {
                assert.equal($element.position().left, 1000);
                done();
            }

        });

        assert.equal($element.position().left, 0);
    });

    QUnit.test('basic animation via CSS class', function(assert) {
        assert.expect(10);

        const done = assert.async();
        const cleanupWhen = $.Deferred();
        const $element = $('#test');

        this.animate($element, {
            type: 'css',
            from: 'my-animation',
            to: 'my-animation-active',
            duration: 50,
            cleanupWhen: cleanupWhen,
            complete: function() {
                assert.ok($element.is('.my-animation'));
                assert.ok($element.is('.my-animation-active'));
                assert.equal($element.position().left, 1000);
                cleanupWhen.resolve();
                assert.ok($element.is('.my-animation'));
                assert.ok($element.is('.my-animation-active'));
                assert.equal($element.position().left, 1000);
                setTimeout(function() { // browser recalculate styles only during the next paint
                    assert.ok(!$element.is('.my-animation'));
                    assert.ok(!$element.is('.my-animation-active'));
                    assert.equal($element.position().left, 0);
                    done();
                });
            }

        });

        assert.equal($element.position().left, 0);
    });

    QUnit.test('transition css property set to element on start of the animation (T317083)', function(assert) {
        const done = assert.async();
        const $element = $('#transitionPropTest');

        const animation = fx.createAnimation($element, {
            type: 'css',
            from: 'my-animation',
            to: 'my-animation-active',
            duration: 100,
            easing: 'cubic-bezier(0, 0, 0.58, 1)',
            complete: function() {
                done();
            }
        });

        animation.setup();
        assert.notEqual($element.css('transition-timing-function'), 'cubic-bezier(0, 0, 0.58, 1)', 'timing function does not change');

        animation.start();
        assert.equal($element.css('transition-timing-function'), 'cubic-bezier(0, 0, 0.58, 1)', 'timing function changed after animation start');
    });

    QUnit.test('cleanupWhen option', function(assert) {
        assert.expect(10);

        const that = this;
        const done = assert.async();
        const $element = $('#test');
        const config = {
            from: 'my-animation',
            to: 'my-animation-active',
            duration: 1000
        };
        const cleanupWhen = $.Deferred();

        this.animate($element, config).done(function() {
            assert.equal($element.position().left, 0);

            config.cleanupWhen = cleanupWhen.promise();

            that.animate($element, config).done(function() {
                assert.ok($element.is('.my-animation'));
                assert.ok($element.is('.my-animation-active'));
                assert.equal($element.position().left, 1000);

                setTimeout(function() {
                    assert.ok($element.is('.my-animation'));
                    assert.ok($element.is('.my-animation-active'));
                    assert.equal($element.position().left, 1000);

                    cleanupWhen.resolve();
                    assert.ok(!$element.is('.my-animation'));
                    assert.ok(!$element.is('.my-animation-active'));
                    assert.equal($element.position().left, 0);
                    done();
                });
            });
        });


    });

    QUnit.test('animation from', function(assert) {
        assert.expect(2);

        const done = assert.async();
        const $element = $('#test');

        this.animate($element, {
            from: { left: -1000 },
            to: { left: 1000 },
            delay: 500,
            duration: 50,
            complete: function() {
                assert.equal($element.position().left, 1000);
                done();
            }
        });

        assert.equal($element.position().left, -1000);
    });

    QUnit.test('isAnimating func', function(assert) {
        assert.expect(1);

        const $element = renderer('#test');

        this.animate($element, {
            to: { left: 1000 },
            duration: 50
        });

        assert.equal(fx.isAnimating($element), true);
        fx.stop($element);
    });

    QUnit.test('animation stop', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const $element = $('#test');

        this.animate($element, {
            to: { left: 1000 },
            duration: 500
        });

        setTimeout(function() {
            const leftAfterStop = $element.css('left');
            fx.stop($element);

            setTimeout(function() {
                assert.roughEqual(parseFloat($element.css('left')), parseFloat(leftAfterStop), 0.1);
                done();
            }, 100);
        }, 100);
    });

    QUnit.test('animation stop with jump to the end', function(assert) {
        assert.expect(2);

        const done = assert.async();
        const $element = $('#test');

        this.animate($element, {
            to: { left: 1000 },
            duration: 500,
            complete: function() {
                assert.ok(true);
            }
        });

        setTimeout(function() {
            fx.stop($element, true);
            assert.equal($element.position().left, 1000);
            done();
        }, 100);
    });

    QUnit.test('animation stop works even if called before animation start (timeout case)', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const $element = $('#test');

        this.animate($element, {
            to: { left: 1000 },
            delay: 500,
            duration: 500
        });

        fx.stop($element);

        setTimeout(function() {
            assert.equal($element.position().left, 0);
            done();
        }, 50);
    });

    QUnit.test('off flag', function(assert) {
        fx.off = true;

        try {
            const element = $('#test');

            this.animate(element, {
                to: { left: 1000 }
            });

            assert.equal(element.position().left, 1000);
        } finally {
            fx.off = false;
        }
    });

    QUnit.test('animation of \'translate\' prop', function(assert) {
        const done = assert.async();
        const $element = $('#test');

        $.when(this.animate($element, {
            from: { transform: 'translate(0, 0)' },
            to: { transform: 'translate(10px, 20px)' },
            duration: 50,
            complete: function() {
                assert.equal($element.css('transform'), 'matrix(1, 0, 0, 1, 10, 20)');
                done();
            }
        }));
    });

    QUnit.test('off flag, complete callback', function(assert) {
        fx.off = true;
        try {
            const element = $('#test');
            let called = 0;
            let args = null;

            this.animate(element, {
                to: { left: 1000 },
                complete: function() {
                    called++;
                    args = arguments;
                }
            });

            assert.equal(called, 1);

            assert.equal(args.length, 2);
            assert.strictEqual($(args[0]).get(0), element.get(0));
            assert.ok($.isPlainObject(args[1]));
        } finally {
            fx.off = false;
        }
    });

    QUnit.test('complete triggered when \'from\' and \'to\' are equal', function(assert) {
        assert.expect(0);

        const done = assert.async();

        this.animate('#test', {
            type: 'slide',
            from: { left: 0 },
            to: { left: 0 },
            duration: 100,
            complete: function() {
                done();
            }
        });
    });

    QUnit.testInActiveWindow('regressions: \'stop\' method w/o \'jumpToEnd\' should prevent \'complete\' triggering', function(assert) {
        /* global waitFor */

        fx.off = false;

        const done = assert.async();
        let called = 0;
        const element = $('#test');
        const animate = this.animate;
        let lastElementLeft;

        animate(element, {
            from: { left: 100 },
            to: { left: 900 },
            duration: 25000,
            complete: function() {
                called++;
                assert.ok(false, 'if you see this assertion, complete callback was triggered');
            }
        });

        waitFor(function() {
            lastElementLeft = element.position().left;
            return lastElementLeft > 0;
        }).done(function() {
            waitFor(function() {
                const left = element.position().left;
                return left > lastElementLeft || left === 900;
            }).done(function() {
                fx.stop(element);

                animate(element, {
                    from: { left: 50 },
                    to: { left: 150 },
                    duration: 0,
                    complete: function() {
                        assert.equal(called, 0);
                        done();
                    }
                });
            });
        });
    });

    QUnit.test('regressions: isAnimating should return false if animation is over', function(assert) {
        const done = assert.async();
        const element = $('#test');

        this.animate(element, {
            from: { left: 0 },
            to: { left: 100 },
            duration: 100,
            complete: function() {
                assert.equal(fx.isAnimating(element), false);
                done();
            }
        });
    });

    QUnit.test('regressions: element cleanup (memory leaks)', function(assert) {
        const done = assert.async();
        const element = $('#test');
        const animate = this.animate;

        const checkElementCleaned = function() {
            assert.ok(!element.data(SIMULATED_TRANSITIONEND_TIMEOUT_DATA_KEY));
            assert.ok(!element.data(ANIM_DATA_KEY));
            assert.ok(!element.data(ANIM_QUEUE_KEY));
            assert.ok(!$._data(element, 'events'));
        };

        const animateElement = function(duration) {
            return animate(element, {
                from: { left: 0 },
                to: { left: 100 },
                duration: duration,
                complete: function() {
                    checkElementCleaned();
                }
            });
        };

        $.when(animateElement(100)).done(function() {
            animateElement(30000);
            setTimeout(function() {
                fx.stop(element);
                checkElementCleaned();

                animateElement(30000);
                setTimeout(function() {
                    fx.stop(element, true);
                    checkElementCleaned();
                    done();
                }, 100);
            }, 100);
        });
    });

    QUnit.test('regression: animate result is rejected when element is disposed (T300400)', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const $test = $('#test');

        const result = this.animate($test, {
            type: 'slide',
            from: { left: 0 },
            to: { left: 0 },
            duration: 100
        });

        setTimeout(function() {
            $test.remove();
            assert.equal(result.state(), 'rejected');
            done();
        }, 50);

    });

    QUnit.test('regression: the \'dxremove.dxFXStartAnimation\' event handler should be unsubscribed on node remove (T388920)', function(assert) {
        assert.expect(4);

        const done = assert.async();
        const $test = $('#test');
        const testedEventName = 'dxremove.dxFXStartAnimation';

        function eventUsedTimes(sinonSpy, eventName) {
            let result = 0;
            for(let i = 0; i < sinonSpy.callCount; i++) {
                if(sinonSpy.getCall(i).args[1] === eventName) {
                    result++;
                }
            }
            return result;
        }

        sinon.spy(eventsEngine, 'on');
        sinon.spy(eventsEngine, 'off');

        const animation = fx.createAnimation($test, {
            type: 'slide',
            from: { left: 0 },
            to: { left: 100 },
            duration: 100
        });

        animation.setup();
        animation.start()
            .done(function() {
                assert.fail('Should be rejected when the element is removed from DOM');
            }).fail(function() {
                assert.equal(eventUsedTimes(eventsEngine.on, testedEventName), 1);
                assert.equal(eventUsedTimes(eventsEngine.off, testedEventName), 2);
            }).always(function() {
                eventsEngine.on.restore();
                eventsEngine.off.restore();
                done();
            });

        assert.equal(eventUsedTimes(eventsEngine.on, testedEventName), 1);
        assert.equal(eventUsedTimes(eventsEngine.off, testedEventName), 1);
        $test.remove();
    });

    QUnit.test('regression: the \'dxremove.dxFXStartAnimation\' event handler should be unsubscribed on animation end (T388920)', function(assert) {
        assert.expect(2);

        const done = assert.async();
        const $test = $('#test');
        const testedEventName = 'dxremove.dxFXStartAnimation';

        function eventUsedTimes(sinonSpy, eventName) {
            let result = 0;
            for(let i = 0; i < sinonSpy.callCount; i++) {
                if(sinonSpy.getCall(i).args[1] === eventName) {
                    result++;
                }
            }
            return result;
        }

        sinon.spy(eventsEngine, 'on');
        sinon.spy(eventsEngine, 'off');

        const animation = fx.createAnimation($test, {
            type: 'slide',
            from: { left: 0 },
            to: { left: 100 },
            duration: 100
        });

        animation.setup();
        animation.start()
            .done(function() {
                assert.equal(eventUsedTimes(eventsEngine.on, testedEventName), 1);
                assert.equal(eventUsedTimes(eventsEngine.off, testedEventName), 2);
            }).fail(function() {
                assert.fail('animation.start() deferred shouldn\'t fail');
            }).always(function() {
                eventsEngine.on.restore();
                eventsEngine.off.restore();
                done();
            });
    });

    QUnit.test('Check for timers (should clear timers on DOM node remove)', function(assert) {
        assert.expect(0);

        const $test = $('#test');

        this.animate($test, {
            type: 'slide',
            from: { left: 0 },
            to: { left: 100 },
            duration: 100
        });
    });

    QUnit.test('position my/at/of style', function(assert) {
        const done = assert.async();
        const $element = $('#test');
        const $container = $('#container');

        this.animate($element, {
            from: {
                position: {
                    my: 'left',
                    at: 'right',
                    of: $container
                }
            },
            to: {
                position: {
                    my: 'right',
                    at: 'right',
                    of: $container
                }
            },
            duration: 100,
            complete: function() {
                assert.equal($element.position().left, $container.width() - $element.width());
                done();
            }
        });

        assert.equal($element.position().left, $container.width());
    });

    QUnit.test('animation should not be ended if transitionEnd event fired after previous animation in queue (Chrome bug)', function(assert) {
        assert.expect(0);

        const $element = $('#test');

        this.animate($element, {
            to: { left: 100 },
            duration: 99999,
            complete: function() {
                assert.ok(false, 'transition should not be ended');
            }
        });

        $element.trigger(support.transitionEndEventName());
        fx.stop($element);
    });
}


QUnit.module('fx effects');

QUnit.test('fade', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test');

    fx.animate($element, {
        type: 'fade',
        to: 0.5,
        duration: 100,
        complete: function() {
            assert.strictEqual($element.css('opacity'), '0.5');
            done();
        }
    });
});

QUnit.test('fade - using AnimationState object', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test');

    fx.animate($element, {
        type: 'fade',
        to: {
            opacity: 0.5
        },
        duration: 100,
        complete: function() {
            assert.strictEqual($element.css('opacity'), '0.5');
            done();
        }
    });
});

QUnit.test('fade - using AnimationState object - opacity fallback to 1', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test');

    fx.animate($element, {
        type: 'fade',
        to: { },
        duration: 100,
        complete: function() {
            assert.strictEqual($element.css('opacity'), '1');
            done();
        }
    });
});
QUnit.test('fade - using AnimationState object - skipElementInitialStyles', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fade',
        skipElementInitialStyles: true,
        from: {
            opacity: 0.7
        },
        duration: 100,
        start: function() {
            assert.equal($element.css('opacity'), 0.7, 'starts from zero not from element\'s opacity');
        },
        complete: function() {
            assert.strictEqual($element.css('opacity'), '1');
            done();
        }
    });
});

QUnit.test('fade with skipElementInitialStyles: to={opacity:0} opacity should be regarded as specified', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fade',
        skipElementInitialStyles: true,
        to: {
            opacity: 0
        },
        duration: 100,
        complete: function() {
            assert.strictEqual($element.css('opacity'), '0', 'ends on 0');
            done();
        }
    });
});

QUnit.test('fadeIn', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fadeIn',
        duration: 100,
        start: function($element) {
            assert.equal($($element).css('opacity'), 0.5, 'starts from elements opacity');
        },
        complete: function() {
            assert.strictEqual($($element).css('opacity'), '1');
            done();
        }
    });
});

QUnit.test('fadeIn skipElementInitialStyles', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fadeIn',
        skipElementInitialStyles: true,
        duration: 100,
        start: function() {
            assert.equal($element.css('opacity'), 0, 'starts from zero not from element\'s opacity');
        },
        complete: function() {
            assert.strictEqual($element.css('opacity'), '1');
            done();
        }
    });
});

QUnit.test('fade should change visibility before animation', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test')
        .css('opacity', 0)
        .css('visibility', 'hidden');

    fx.animate($element, {
        type: 'fade',
        duration: 100,
        to: 0.1,
        start: function() {
            assert.strictEqual($element.css('visibility'), 'visible');
            done();
        }
    });
});

QUnit.test('fadeOut', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test').css('opacity', 1);

    fx.animate($element, {
        type: 'fadeOut',
        duration: 100,
        complete: function() {
            assert.strictEqual($element.css('opacity'), '0');
            done();
        }
    });
});

QUnit.test('fadeOut skipElementInitialStyles', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fadeOut',
        skipElementInitialStyles: true,
        duration: 100,
        start: function() {
            assert.strictEqual($element.css('opacity'), '1', 'starts from 1 not from element\'s opacity');
            done();
        }
    });
});

QUnit.test('fadeOut with skipElementInitialStyles: from={opacity:0} opacity should be regarded as specified', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test').css('opacity', 0.5);

    fx.animate($element, {
        type: 'fadeOut',
        skipElementInitialStyles: true,
        from: {
            opacity: 0
        },
        duration: 100,
        start: function() {
            assert.strictEqual($element.css('opacity'), '0', 'start from 0');
            done();
        }
    });
});

QUnit.test('pop should not reset translate', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const $element = $('#test');

    translator.move($element, {
        left: 20,
        top: 20
    });

    fx.animate($element, {
        type: 'pop',
        from: {
            scale: 0
        },
        to: {
            scale: 1
        },
        duration: 100,
        complete: function() {
            translator.clearCache($element);
            assert.deepEqual(translator.locate($element), {
                left: 20,
                top: 20
            });
            done();
        }
    });
});

QUnit.test('slide', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({ top: 10, left: 10 });

    fx.animate($element, {
        type: 'slide',
        from: { left: 50, top: 50 },
        to: { left: 1000, top: 100 },
        duration: 100,
        complete: function() {
            const pos = translator.locate($element);

            assert.equal(pos.left, 1000);
            assert.equal(pos.top, 100);

            done();
        }
    });
});

const positions = {
    'top': { my: 'bottom center', at: 'top center' },
    'bottom': { my: 'top center', at: 'bottom center' },
    'right': { my: 'left center', at: 'right center' },
    'left': { my: 'right center', at: 'left center' },
};
$.each(['In', 'Out'], function(_, type) {
    $.each(positions, function(alias, position) {
        const testPosition = function($element, assert) {
            const pos = $element.offset();
            const place = positionUtils.calculate($element, $.extend({ of: window }, position));

            assert.equal(pos.left, place.h.location);
            assert.equal(pos.top, place.v.location);
        };

        QUnit.test('slide' + type + ' ' + alias, function(assert) {
            const done = assert.async();
            const $element = $('#test');

            fx.animate($element, {
                type: 'slide' + type,
                direction: alias,
                to: { left: 1000, top: 100 },
                duration: 100,
                start: function() {
                    if(type === 'Out') {
                        return;
                    }

                    testPosition($element, assert);
                    done();
                },
                complete: function() {
                    if(type === 'In') {
                        return;
                    }

                    testPosition($element, assert);
                    done();
                }
            });
        });
    });
});

QUnit.test('slide with opacity', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    fx.animate($element, {
        type: 'slide',
        from: { left: 0, opacity: 0 },
        to: { left: 100, opacity: 1 },
        duration: 100,
        complete: function() {
            const pos = translator.locate($element);
            assert.equal($element.css('opacity'), 1);
            assert.equal(pos.left, 100);
            done();
        }
    });
    assert.equal($element.css('opacity'), 0);
});

QUnit.test('slide without from', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({ top: 10, left: 10 });

    fx.animate($element, {
        type: 'slide',
        to: { left: 1000, top: 100 },
        duration: 100,
        complete: function() {
            const pos = translator.locate($element);

            assert.equal(pos.left, 1000);
            assert.equal(pos.top, 100);

            done();
        }
    });
});

QUnit.test('slide with predefined CSS transform', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({ transform: 'translate3d(10px,10px,0px)' });

    fx.animate($element, {
        type: 'slide',
        to: { left: 1000, top: 100 },
        duration: 100,
        complete: function() {
            const pos = translator.locate($element);

            assert.equal(pos.left, 1000);
            assert.equal(pos.top, 100);

            done();
        }
    });
});

QUnit.test('slide with predefined top & left', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({
        top: 3,
        left: 4
    });

    fx.animate($element, {
        type: 'slide',
        to: { left: 1000, top: 100 },
        duration: 100,
        complete: function() {
            const pos = $element.position();

            assert.equal(pos.left, 1000);
            assert.equal(pos.top, 100);

            done();
        }
    });
});


QUnit.module('relative animation');

QUnit.test('slide', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    fx.animate($element, {
        type: 'slide',
        to: { left: '+=1000', top: '-=100' },
        complete: function() {
            const pos = $element.position();

            assert.equal(pos.left, 1000);
            assert.equal(pos.top, -100);

            done();
        }
    });
});

QUnit.test('slide with predefined top & left', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({ top: 3, left: 4 });

    fx.animate($element, {
        type: 'slide',
        to: { left: '+=1000', top: '+=100' },
        complete: function() {
            const pos = $element.position();

            assert.equal(pos.left, 1004);
            assert.equal(pos.top, 103);

            done();
        }
    });
});

QUnit.test('slide animate one axis', function(assert) {
    const done = assert.async();
    const $element = $('#test');

    $element.css({ top: 3, left: 4 });

    fx.animate($element, {
        type: 'slide',
        to: { top: '+=100' },
        duration: 100,
        complete: function() {
            const pos = $element.position();

            assert.equal(pos.left, 4);
            assert.equal(pos.top, 103);

            done();
        }
    });
});


QUnit.module('animation queue', {
    beforeEach: function() {
        this.$element = $('#test');

        this.firstAnimation = function($element, config) {
            return fx.animate($element, $.extend({
                from: { left: 50 },
                to: { left: 100 },
                duration: 100
            }, config));
        };

        this.secondAnimation = function($element, config) {
            return fx.animate($element, $.extend({
                from: { left: 150 },
                to: { left: 200 },
                duration: 50
            }, config));
        };
    }
});

QUnit.test('animation for element is in queue by default', function(assert) {
    assert.expect(5);

    const done = assert.async();
    const $element = this.$element;
    let callBacksCount = 0;

    this.firstAnimation($element, {
        start: function() {
            assert.equal(callBacksCount, 0);
            callBacksCount++;
        },
        complete: function() {
            assert.equal(callBacksCount, 1);
            callBacksCount++;
        }
    });

    this.secondAnimation($element, {
        start: function() {
            assert.equal(callBacksCount, 2);
            callBacksCount++;
        },
        complete: function() {
            assert.equal(callBacksCount, 3);
            callBacksCount++;
            done();
        }
    });

    assert.equal(callBacksCount, 1, 'first animation start');
});

QUnit.test('stop queue animation without jumpToEnd', function(assert) {
    const $element = this.$element;
    let callBacksCount = 0;

    this.firstAnimation($element, {
        start: function() {
            callBacksCount++;
        }
    });
    this.secondAnimation($element, {
        start: function() {
            callBacksCount += 2;
        }
    });
    fx.stop($element);

    assert.equal(callBacksCount, 1);
});


QUnit.test('stop queue animation with jumpToEnd', function(assert) {
    const $element = this.$element;
    let callBacksCount = 0;

    this.firstAnimation($element, {});
    this.secondAnimation($element, {
        complete: function() {
            callBacksCount++;
        }
    });

    fx.stop($element, true);
    assert.equal(callBacksCount, 1);
});

QUnit.test('clear queue after stop', function(assert) {
    const $element = this.$element;
    let callBacksCount = 0;

    this.firstAnimation($element, {});
    this.secondAnimation($element, {
        complete: function() {
            callBacksCount++;
        }
    });
    fx.stop($element);

    this.secondAnimation($element, {
        complete: function() {
            callBacksCount++;
        }
    });
    fx.stop($element, true);
    assert.equal(callBacksCount, 1);
});

QUnit.test('clear queue after stop on complete handler', function(assert) {
    const done = assert.async();
    const $element = this.$element;
    let callBacksCount = 0;

    this.firstAnimation($element, {
        complete: function() {
            fx.stop($element);
            assert.equal(callBacksCount, 1);
            done();
        }
    });
    this.secondAnimation($element, {
        complete: function() {
            callBacksCount++;
        }
    });
});

QUnit.test('animations should be pushed to queue correctly on complete handler', function(assert) {
    const done = assert.async();
    const d = $.Deferred();
    const $element = this.$element;
    const firstAnimation = this.firstAnimation;
    const secondAnimation = this.secondAnimation;
    const log = [];

    firstAnimation($element, {
        start: function() {
            log.push('first outer start');
        },
        complete: function() {
            log.push('first outer complete');

            firstAnimation($element, {
                start: function() {
                    log.push('first inner start');
                },
                complete: function() {
                    log.push('first inner complete');
                }
            });
            secondAnimation($element, {
                start: function() {
                    log.push('second inner start');
                },
                complete: function() {
                    log.push('second inner complete');

                    d.resolve();
                }
            });
        }
    });
    secondAnimation($element, {
        start: function() {
            log.push('second outer start');
        },
        complete: function() {
            log.push('second outer complete');
        }
    });

    d.done(function() {
        assert.deepEqual(log, [
            'first outer start',
            'first outer complete',
            'second outer start',
            'second outer complete',
            'first inner start',
            'first inner complete',
            'second inner start',
            'second inner complete'
        ]);
        done();
    });
});

QUnit.test('animations should be pushed to queue after stop correctly on complete handler', function(assert) {
    const done = assert.async();
    const d = $.Deferred();
    const $element = this.$element;
    const firstAnimation = this.firstAnimation;
    const secondAnimation = this.secondAnimation;
    const log = [];

    firstAnimation($element, {
        start: function() {
            log.push('first outer start');
        },
        complete: function() {
            log.push('first outer complete');

            fx.stop($element);
            firstAnimation($element, {
                start: function() {
                    log.push('first inner start');
                },
                complete: function() {
                    log.push('first inner complete');
                }
            });
            secondAnimation($element, {
                start: function() {
                    log.push('second inner start');
                },
                complete: function() {
                    log.push('second inner complete');

                    d.resolve();
                }
            });
        }
    });
    secondAnimation($element, {
        start: function() {
            log.push('second outer start');
        },
        complete: function() {
            log.push('second outer complete');
        }
    });

    d.done(function() {
        assert.deepEqual(log, [
            'first outer start',
            'first outer complete',
            'second outer start',
            'second outer complete',
            'first inner start',
            'first inner complete',
            'second inner start',
            'second inner complete'
        ]);
        done();
    });
});


QUnit.module('regression');

QUnit.test('\'from\'/\'to\' config validation', function(assert) {
    const element = $('#test');

    assert.throws(function() {
        fx.animate(element, {
            type: 'pop',
            from: '123'
        });
    }, function(ex) {
        assert.ok(ex.message.indexOf('Animation configuration with the \'pop\' type requires \'from\' configuration as a plain object.') > -1);
        return true;
    });

    assert.throws(function() {
        fx.animate(element, {
            type: 'pop',
            to: 1
        });
    }, function(ex) {
        assert.ok(ex.message.indexOf('Animation configuration with the \'pop\' type requires \'to\' configuration as a plain object.') > -1);
        return true;
    });

    assert.throws(function() {
        fx.animate(element, {
            type: 'slide',
            to: true
        });
    }, function(ex) {
        assert.ok(ex.message.indexOf('Animation configuration with the \'slide\' type requires \'to\' configuration as a plain object.') > -1);
        return true;
    });

    assert.throws(function() {
        fx.animate(element, {
            type: 'slide',
            from: 5
        });
    }, function(ex) {
        assert.ok(ex.message.indexOf('Animation configuration with the \'slide\' type requires \'from\' configuration as a plain object.') > -1);
        return true;
    });

});
