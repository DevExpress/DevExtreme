/* global currentAssert */

var $ = require('jquery'),
    animationFrame = require('animation/frame'),
    commonUtils = require('core/utils/common'),
    typeUtils = require('core/utils/type'),
    animationModule = require('viz/core/renderers/animation'),
    rendererModule = require('viz/core/renderers/renderer'),
    vizMocks = require('../../helpers/vizMocks.js');

(function() {
    QUnit.module('AnimationController', {
        beforeEach: function() {
            this.AnimationController = animationModule.AnimationController;

            this.Animation = function(ticks, complete, options) {
                ticks = ticks || 1;

                var that = this,
                    assert = currentAssert();

                that.options = options;
                that.tick = function(now) {
                    ticks--;
                    assert.ok(now, 'current time value should pass in tick');
                    if(ticks === 0) {
                        this.complete = true;
                        complete && complete();
                    }
                    this.ticksContinue = ticks;
                    return ticks;
                };

                that.stop = function() {
                    this.stopped = true;
                    this.stopArguments = $.makeArray(arguments);
                };
            };
        },
        createAnimationController: function(element) {
            this.animationController = new this.AnimationController(element);
            return this.animationController;
        },
        afterEach: function() {
            this.srcRequestAnimationFrame && (animationFrame.requestAnimationFrame = this.srcRequestAnimationFrame);
            this.srcCancelAnimationFrame && (animationFrame.cancelAnimationFrame = this.srcCancelAnimationFrame);
            this.animationController.dispose();

        },
        mockRequestAnimationFrame: function(callback) {
            this.srcRequestAnimationFrame = animationFrame.requestAnimationFrame;
            animationFrame.requestAnimationFrame = callback;
        },
        mockCancelAnimationFrame: function(callback) {
            this.srcCancelAnimationFrame = animationFrame.cancelAnimationFrame;
            animationFrame.cancelAnimationFrame = callback;
        }
    });

    QUnit.test('Creation', function(assert) {
        var element = { elementObject: true };

        var animationController = this.createAnimationController(element);

        assert.ok(animationController);
        assert.equal(animationController._animationCount, 0);
        assert.deepEqual(animationController._animations, {});
        assert.equal(animationController.element, element);
    });

    QUnit.test('Creation. Two Controllers', function(assert) {
        var animationController = this.createAnimationController();
        animationController.addAnimation(new this.Animation());
        // act
        var animationController1 = new this.AnimationController();

        assert.ok(animationController1);
        assert.equal(animationController1._animationCount, 0);
        assert.deepEqual(animationController1._animations, {});

        animationController1.dispose();
    });

    QUnit.test('Add animation', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation = new this.Animation(),
            animationStartedCount = 0;

        var timeOutId = setTimeout(function() {
            assert.ok(false, 'animation not started');
            doAssert();
        }, 2000);
        animationController._loop = function() {
            clearInterval(timeOutId);
            animationStartedCount++;
            doAssert();
        };
        // Act
        animationController.addAnimation(animation);

        // Assert
        function doAssert() {
            assert.equal(animationController._animationCount, 1);
            assert.deepEqual(animationController._animations, { '0': animation });

            assert.equal(animationStartedCount, 1);
            clearTimeout(timeOutId);
            done();
        }
    });

    QUnit.test('Disposing', function(assert) {
        var animationController = this.createAnimationController(),
            srcStop = animationController.stop;

        animationController.addAnimation(new this.Animation());
        animationController.stop = function() {
            this.stopped = true;
        };
        animationController.dispose();

        assert.ok(animationController.stopped);
        assert.strictEqual(animationController.element, null);

        srcStop.call(animationController);
    });

    QUnit.test('Add animations', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animations = [new this.Animation(), new this.Animation(), new this.Animation(), new this.Animation()],
            animationStartedCount = 0;

        var timeOutId = setTimeout(function() {
            assert.ok(false, 'animation not started');
            doAssert();
        }, 2000);

        animationController._loop = function() {
            clearInterval(timeOutId);
            animationStartedCount++;
            doAssert();
        };
        // Act
        for(var i = 0; i < animations.length; i++) {
            animationController.addAnimation(animations[i]);
        }

        // Assert
        function doAssert() {
            assert.equal(animationController._animationCount, 4);
            assert.deepEqual(animationController._animations, { '0': animations[0], '1': animations[1], '2': animations[2], '3': animations[3] });

            assert.equal(animationStartedCount, 1);
            clearTimeout(timeOutId);
            done();
        }
    });

    QUnit.test('Stop animations', function(assert) {
        assert.expect(6);
        var animationController = this.createAnimationController(),
            animation1 = new this.Animation(),
            animation2 = new this.Animation(),
            cancelRequestAnimationFrameSpy = sinon.spy();

        animationController.addAnimation(new this.Animation());
        this.mockCancelAnimationFrame(cancelRequestAnimationFrameSpy);
        // act
        animationController.stop();
        // assert
        assert.deepEqual(animationController._animations, {});
        assert.equal(animationController._animationCount, 0);
        assert.ok(!animation1.stopped);
        assert.ok(!animation2.stopped);
        assert.equal(cancelRequestAnimationFrameSpy.callCount, 1);
        assert.strictEqual(cancelRequestAnimationFrameSpy.firstCall.args[0], animationController._timerId);
    });

    QUnit.test('Stop animations with lock', function(assert) {
        assert.expect(4);
        var animationController = this.createAnimationController(),
            animation1 = new this.Animation(undefined, undefined, {}),
            animation2 = new this.Animation(undefined, undefined, {});

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);
        // act
        animationController.lock();
        // assert
        assert.deepEqual(animationController._animations, {});
        assert.equal(animationController._animationCount, 0);
        assert.deepEqual(animation1.stopArguments, [true]);
        assert.deepEqual(animation2.stopArguments, [true]);
    });

    QUnit.test('lock with unstoppable = true', function(assert) {
        var animationController = this.createAnimationController(),
            animation1 = new this.Animation(undefined, undefined, {}),
            animation2 = new this.Animation(undefined, undefined, {
                unstoppable: true
            }),
            originalStop = animationController.stop;

        animationController.stop = sinon.spy();

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);
        // act
        animationController.lock();

        // assert
        assert.equal(animation1.stopArguments.length, 1, 'stop does called');
        assert.ok(!animation2.stopArguments, 'stop doesn\'t called');
        assert.ok(!animationController.stop.called);

        originalStop.call(animationController);
    });

    QUnit.test('lock with unstoppable = false', function(assert) {
        var animationController = this.createAnimationController(),
            animation1 = new this.Animation(undefined, undefined, {}),
            animation2 = new this.Animation(undefined, undefined, {
                unstoppable: false
            }),
            originalStop = animationController.stop;

        animation2.ignoreLock = false;
        animationController.stop = sinon.spy();

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);
        // act
        animationController.lock();

        // assert
        assert.equal(animation1.stopArguments.length, 1, 'stop does called');
        assert.equal(animation2.stopArguments.length, 1, 'stop does called');
        assert.equal(animationController.stop.callCount, 1);

        originalStop.call(animationController);
    });

    QUnit.test('Run animation', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation1 = new this.Animation(8),
            tickCount = 0,
            srcStopAnimation = animationController.stop;

        this.mockRequestAnimationFrame(function(callBack) {
            tickCount++;
            callBack();
        });
        animationController.stop = function() {
            assert.equal(tickCount, 8);
            assert.strictEqual(animation1.ticksContinue, 0);
            assert.ok(animation1.complete);
            assert.deepEqual(animationController._animations, {});
            animationController.stop = srcStopAnimation;
            done();
        };

        animationController.addAnimation(animation1);
    });

    QUnit.test('Run animations with different duration', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation1 = new this.Animation(8),
            animation2 = new this.Animation(40),
            tickCount = 0,
            srcStopAnimation = animationController.stop;

        this.mockRequestAnimationFrame(function(callBack) {
            tickCount++;
            callBack();
        });
        animationController.stop = function() {
            assert.equal(tickCount, 40);
            assert.strictEqual(animation1.ticksContinue, 0);
            assert.strictEqual(animation2.ticksContinue, 0);
            assert.ok(animation1.complete);
            assert.ok(animation2.complete);
            assert.deepEqual(animationController._animations, {});
            animationController.stop = srcStopAnimation;
            done();
        };

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);
    });

    QUnit.test('Add new animation after complete all animations', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation1 = new this.Animation(8),
            animation2 = new this.Animation(40),

            animation3 = new this.Animation(10),
            animation4 = new this.Animation(12),
            tickCount = 0;

        this.mockRequestAnimationFrame(function(callBack) {
            tickCount++;
            callBack();
        });
        var baseStop = animationController.stop;
        animationController.stop = function() {
            baseStop.call(animationController);
            animationController.stop = function() {
                assert.equal(tickCount, 40 + 12);
                assert.strictEqual(animation1.ticksContinue, 0);
                assert.strictEqual(animation2.ticksContinue, 0);
                assert.strictEqual(animation3.ticksContinue, 0);
                assert.strictEqual(animation4.ticksContinue, 0);
                assert.ok(animation1.complete);
                assert.ok(animation2.complete);

                assert.ok(animation3.complete);
                assert.ok(animation4.complete);

                assert.deepEqual(animationController._animations, {});
                animationController.stop = baseStop;
                done();
            };
            animationController.addAnimation(animation3);
            animationController.addAnimation(animation4);
        };

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);
    });

    QUnit.test('Run animations with different duration. Check behaviour after complete first animation', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation1 = new this.Animation(8),
            animation2 = new this.Animation(40),
            tickCount = 0;

        this.mockRequestAnimationFrame(function(callBack) {
            if(tickCount++ === 8) {
                doAssert();
                return;
            }
            callBack();
        });

        animationController.addAnimation(animation1);
        animationController.addAnimation(animation2);

        function doAssert() {
            assert.equal(tickCount, 9);
            assert.strictEqual(animation1.ticksContinue, 0);
            assert.strictEqual(animation2.ticksContinue, 31);
            assert.ok(animation1.complete);
            assert.ok(!animation2.complete);
            assert.deepEqual(animationController._animations, { '1': animation2 });
            assert.strictEqual(animationController._animationCount, 2);
            done();
        }
    });

    QUnit.test('Create Animation', function(assert) {
        var element = {},
            animationController = this.createAnimationController(element),
            params = { someParameter: true },
            options = { someOption: true };
        animationController._loop = commonUtils.noop;
        var oldAnimation = new this.Animation();
        element.animation = oldAnimation;

        // Act
        animationController.animateElement(element, params, options);
        // Assert
        assert.ok(oldAnimation.stopped, 'old animation must be stopped');
        assert.deepEqual(oldAnimation.stopArguments, [], 'old animation must be stopped with break parameter');
        var newAnimation = element.animation;
        assert.ok(newAnimation && (newAnimation !== oldAnimation));
        assert.deepEqual(newAnimation.options, options);
        assert.deepEqual(newAnimation.params, params);
        assert.deepEqual(animationController._animations, { '0': newAnimation });
        assert.strictEqual(animationController._animationCount, 1);
    });

    QUnit.test('endAnimation without animation', function(assert) {
        var animationController = this.createAnimationController(),
            endAnimation = sinon.stub();

        animationController.onEndAnimation(endAnimation);

        assert.ok(endAnimation.calledOnce);
    });

    QUnit.test('endAnimation with animation', function(assert) {
        var animationController = this.createAnimationController(),
            endAnimation = sinon.stub();

        animationController.addAnimation(new this.Animation());

        animationController.onEndAnimation(endAnimation);

        assert.ok(!endAnimation.called);
    });

    QUnit.testInActiveWindow('endAnimation after complete animation', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            animation = new this.Animation(2),
            endAnimation = sinon.stub(),
            complete = function() {
                endAnimation();
                doAssert();
            };

        animationController.addAnimation(animation);
        animationController.onEndAnimation(complete);

        function doAssert() {
            assert.ok(endAnimation.calledOnce);
            done();
        }
    });

    QUnit.testInActiveWindow('endAnimation after complete second animation', function(assert) {
        var done = assert.async(),
            animationController = this.createAnimationController(),
            completeAnimation = function() {
                animationController.addAnimation(secondAnimation);
            },
            firstAnimation = new this.Animation(2, completeAnimation),
            secondAnimation = new this.Animation(3),
            endAnimation = sinon.stub(),
            complete = function() {
                endAnimation();
                doAssert();
            };

        animationController.addAnimation(firstAnimation);
        animationController.onEndAnimation(complete);

        function doAssert() {
            assert.ok(endAnimation.calledOnce);
            done();
        }
    });

})();

(function() {
    var environment = {
        beforeEach: function() {
            var that = this;
            this.Animation = animationModule.Animation;
            this.createAnimation = function(element, params, options) {
                var animation = new this.Animation(element, params, options);

                animation._calcProgress = function() {
                    return Math.min(1, this._progress + 0.4);
                };

                return animation;
            };

            this.animateAttributeParameters = {};

            this.options = {
                easing: 'easeOutCubic',
                duration: 1000,
                animateStep: {
                    _: function(element, params, progress, easing, currentParams, attribute) {
                        that.animateAttributeParameters._Arguments = that.animateAttributeParameters._Arguments || [];

                        that.animateAttributeParameters._Arguments.push($.extend(true, {}, $.makeArray(arguments)));
                        currentParams._Progress = progress;
                    },
                    base: function(element, params, progress, easing, currentParams, attribute) {
                        that.animateAttributeParameters.baseArguments = that.animateAttributeParameters.baseArguments || [];
                        that.animateAttributeParameters.baseArguments.push($.extend(true, {}, $.makeArray(arguments)));
                        currentParams.baseProgress = progress;

                    },
                    complete: function(element, currentParams) {
                        that.animateAttributeParameters.completeArguments = that.animateAttributeParameters.completeArguments || [];
                        that.animateAttributeParameters.completeArguments.push($.extend(true, {}, $.makeArray(arguments)));
                    }
                }
            };
            this.params = {
                _: {
                    from: 0,
                    to: 1
                }
            };

            this.element = new (vizMocks.stubClass(rendererModule.SvgElement,
                {
                    attr: function() { return this; },
                    css: function() { return this; },
                    append: function() { return this; }
                }))();

        }
    };
    QUnit.module('Animation', environment);

    QUnit.test('Creation', function(assert) {
        var animation = new this.Animation(this.element, this.params, this.options);

        assert.ok(animation);
        assert.deepEqual(animation.params, this.params);
        assert.deepEqual(animation.options, this.options);
        assert.equal(animation.element, this.element);
        assert.strictEqual(animation._progress, 0);
        assert.deepEqual(animation._currentParams, {});
        assert.equal(animation.duration, this.options.duration);
    });

    QUnit.test('Start', function(assert) {
        var animation = new this.Animation(this.element, this.params, this.options),
            firstTick = animation.tick,
            secondTick;

        // Act
        var result = animation.tick(new Date().getTime());
        secondTick = animation.tick;
        // Assert
        assert.ok(new Date() - animation._startTime < 1000);
        assert.strictEqual(result, true);
        assert.ok(firstTick !== secondTick);
    });


    QUnit.test('Calculate animation progress', function(assert) {
        var animation = new this.Animation(this.element, this.params, $.extend(this.options, { duration: 10000 }));
        animation._startTime = new Date(2013, 0, 1, 0, 0, 0, 0);
        // Act,Assert
        assert.roughEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 0, 250).getTime()), 0.025, 0.01);
        assert.roughEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 1, 0).getTime()), 0.1, 0.01);
        assert.roughEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 3, 0).getTime()), 0.3, 0.01);
        assert.roughEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 5, 500).getTime()), 0.55, 0.01);
        assert.roughEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 10, 0).getTime()), 1, 0.01);
        assert.strictEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 10, 1).getTime()), 1);
    });

    QUnit.test('Calculate animation progress when animation duration is 0', function(assert) {
        var animation = new this.Animation(this.element, this.params, $.extend(this.options, { duration: 0 }));
        animation._startTime = new Date(2013, 0, 1, 0, 0, 0, 0);
        // Act,Assert
        assert.strictEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 0, 250).getTime()), 1);
        assert.strictEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 1, 0).getTime()), 1);
        assert.strictEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 3, 0).getTime()), 1);
        assert.strictEqual(animation._calcProgress(new Date(2013, 0, 1, 0, 0, 5, 500).getTime()), 1);
    });

    function assertAnimationAction(assert, animateActionParams, elem, params, progress, currentParams, attributeName, actionNumber) {
        actionNumber = actionNumber || 0;
        assert.equal(animateActionParams[0], elem, 'element ' + actionNumber);
        assert.deepEqual(animateActionParams[1], params, 'params ' + actionNumber);
        assert.equal(animateActionParams[2], progress, 'progress ' + actionNumber);
        assert.ok(animateActionParams[3].call, 'easing is function ' + actionNumber);
        assert.deepEqual(animateActionParams[4], currentParams, 'current value ' + actionNumber);
        assert.strictEqual(animateActionParams[5], attributeName, 'animated property ' + actionNumber);
    }

    QUnit.test('Step', function(assert) {
        var animation = this.createAnimation(this.element, this.params, this.options);
        // Act
        animation.tick();
        animation.tick();
        animation.tick();
        // Assert
        var animateAction1 = this.animateAttributeParameters._Arguments[0];
        assertAnimationAction(assert, animateAction1, this.element, this.params['_'], 0.4, {}, '_', 1);

        var animateAction2 = this.animateAttributeParameters._Arguments[1];
        assertAnimationAction(assert, animateAction2, this.element, this.params['_'], 0.8, { _Progress: 0.4 }, '_', 2);
    });

    QUnit.test('Step. same params', function(assert) {
        var animation = this.createAnimation(this.element, $.extend(true, this.params, { x: { from: 10, to: 12 } }), this.options);
        // Act
        animation.tick();
        animation.tick();
        animation.tick();
        // Assert
        var animateAction1 = this.animateAttributeParameters._Arguments[0];
        assertAnimationAction(assert, animateAction1, this.element, this.params['_'], 0.4, {}, '_', 1);

        var animateAction11 = this.animateAttributeParameters.baseArguments[0];
        assertAnimationAction(assert, animateAction11, this.element, this.params['x'], 0.4, { _Progress: 0.4 }, 'x', 11);

        var animateAction2 = this.animateAttributeParameters._Arguments[1];
        assertAnimationAction(assert, animateAction2, this.element, this.params['_'], 0.8, { _Progress: 0.4, baseProgress: 0.4 }, '_', 2);

        var animateAction21 = this.animateAttributeParameters.baseArguments[1];
        assertAnimationAction(assert, animateAction21, this.element, this.params['x'], 0.8, { _Progress: 0.8, baseProgress: 0.4 }, 'x', 21);
    });

    QUnit.test('Stop. Break Animations', function(assert) {
        this.options.complete = sinon.stub();
        var animation = this.createAnimation(this.element, $.extend(true, this.params, { x: { from: 10, to: 12 } }), this.options);
        // Act
        animation.tick();
        animation.tick();
        animation.stop();
        // Assert
        var animateAction1 = this.animateAttributeParameters._Arguments[0];
        assertAnimationAction(assert, animateAction1, this.element, this.params['_'], 0.4, {}, '_', 1);

        var animateAction11 = this.animateAttributeParameters.baseArguments[0];
        assertAnimationAction(assert, animateAction11, this.element, this.params['x'], 0.4, { _Progress: 0.4 }, 'x', 11);
        var completeAction = this.animateAttributeParameters.completeArguments[0];
        assert.equal(completeAction[0], this.element);
        assert.deepEqual(completeAction[1], { _Progress: 0.4, baseProgress: 0.4 });
        assert.ok(this.options.complete.calledOnce);
    });

    QUnit.test('Stop. Break Animations with disable user complete', function(assert) {
        this.options.complete = sinon.stub();
        var animation = this.createAnimation(this.element, $.extend(true, this.params, { x: { from: 10, to: 12 } }), this.options);
        // Act
        animation.tick();
        animation.tick();
        animation.stop(true);
        // Assert
        var animateAction1 = this.animateAttributeParameters._Arguments[0];
        assertAnimationAction(assert, animateAction1, this.element, this.params['_'], 0.4, {}, '_', 1);

        var animateAction11 = this.animateAttributeParameters.baseArguments[0];
        assertAnimationAction(assert, animateAction11, this.element, this.params['x'], 0.4, { _Progress: 0.4 }, 'x', 11);

        var completeAction = this.animateAttributeParameters.completeArguments[0];
        assert.equal(completeAction[0], this.element);
        assert.deepEqual(completeAction[1], { _Progress: 0.4, baseProgress: 0.4 });
        assert.ok(!this.options.complete.called);
    });

    QUnit.test('Synchronize animation', function(assert) {
        var animation = this.createAnimation(this.element, this.params, this.options),
            synchronizeTimeValue;
        animation._calcProgress = function(now) { synchronizeTimeValue = now; return 1; };
        animation.tick();
        // Act
        var now = new Date().getTime();
        animation.tick(now);
        // Assert
        assert.deepEqual(synchronizeTimeValue, now);
    });

    QUnit.test('Last tick', function(assert) {
        var animation = this.createAnimation(this.element, this.params, this.options);
        animation._calcProgress = function() { return 1; };
        animation.tick();
        // Act
        var result = animation.tick();
        // Assert
        assert.ok(!result);
        assert.equal(animation.tick, animationModule.noop);
        var completeAction = this.animateAttributeParameters.completeArguments[0];
        assert.equal(completeAction[0], this.element);
        assert.deepEqual(completeAction[1], { _Progress: 1 });
    });

    QUnit.test('step callBack', function(assert) {
        var steps = [],
            animation = this.createAnimation(this.element, this.params, $.extend(this.options,
                {
                    step: function(p, p1) {
                        steps.push([p, p1]);
                    }
                }));
        animation.tick();
        // Act
        animation.tick();
        animation.tick();
        // Assert
        assert.equal(steps.length, 2);

        assert.roughEqual(steps[0][0], 0.784, 0.01);
        assert.roughEqual(steps[0][1], 0.4, 0.01);

        assert.roughEqual(steps[1][0], 0.992, 0.01);
        assert.roughEqual(steps[1][1], 0.8, 0.01);
    });

    QUnit.test('complete callBack', function(assert) {
        var completeCallCount = 0,
            animation = this.createAnimation(this.element, this.params, $.extend(this.options,
                {
                    complete: function() {
                        completeCallCount++;
                    }
                }));
        animation.tick();
        // Act
        animation.tick();
        animation.tick();
        animation.tick();
        // Assert
        assert.equal(completeCallCount, 1);
    });

    QUnit.test('complete callBack. Check call position', function(assert) {
        assert.expect(2);
        var that = this,
            animation = this.createAnimation(this.element, this.params, $.extend(this.options, {
                // Assert
                complete: function() {
                    var completeAction = that.animateAttributeParameters.completeArguments[0];
                    assert.equal(completeAction[0], that.element);
                    assert.deepEqual(completeAction[1], { _Progress: 1 });
                }
            }));
        animation.tick();
        // Act
        animation.tick();
        animation.tick();
        animation.tick();
    });

    QUnit.test('Partition duration', function(assert) {
        var animation = this.createAnimation(this.element, this.params, $.extend(this.options,
            {
                partitionDuration: 1 / 2
            }));
        assert.equal(animation.duration, 1000 / 2);
    });

    // B239023
    QUnit.test('Stop animation on complete animation', function(assert) {
        assert.expect(1);
        var completeCallCount = 0,
            animation;
        animation = this.createAnimation(this.element, this.params, $.extend(this.options,
            {
                complete: function() {
                    completeCallCount++;
                    if(completeCallCount > 1000) {
                        assert.ok(false, 'infinity loop');
                        return;
                    }
                    animation.stop();
                }
            }));
        animation.tick();
        // Act
        animation.tick();
        animation.tick();
        animation.tick();
        // Assert
        assert.equal(completeCallCount, 1);
    });

    QUnit.module('Delayed animation', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            environment.beforeEach.call(this);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('animation starts after delay', function(assert) {
        var step = sinon.stub(),
            animation = new this.Animation(this.element, this.params, $.extend(this.options,
                {
                    step: step,
                    easing: 'linear',
                    duration: 100,
                    delay: 0.2
                }));
        animation.tick(new Date().getTime());
        this.clock.tick(10);

        // Act
        animation.tick(new Date().getTime());
        this.clock.tick(10);
        animation.tick(new Date().getTime());

        this.clock.tick(0);
        animation.tick(new Date().getTime());
        // Assert
        assert.strictEqual(step.callCount, 1);
        assert.strictEqual(step.getCall(0).args[0], 0);
    });

    QUnit.test('animation duration with delay', function(assert) {
        var step = sinon.stub(),
            animation = new this.Animation(this.element, this.params, $.extend(this.options,
                {
                    step: step,
                    easing: 'linear',
                    duration: 100,
                    delay: 0.2
                }));
        animation.tick(new Date().getTime());
        this.clock.tick(20);
        animation.tick(new Date().getTime());
        // Act
        this.clock.tick(40);
        animation.tick(new Date().getTime());
        this.clock.tick(40);
        animation.tick(new Date().getTime());
        this.clock.tick(20);
        animation.tick(new Date().getTime());
        // Assert
        assert.strictEqual(step.callCount, 3);
        assert.strictEqual(step.getCall(0).args[0], 0.4);
        assert.strictEqual(step.getCall(1).args[0], 0.8);
        assert.strictEqual(step.getCall(2).args[0], 1);
    });
}());

QUnit.module('SvgAnimationStep', {
    beforeEach: function() {
        this.animationStep = animationModule.animationSvgStep;
        this.element = new (vizMocks.stubClass(rendererModule.SvgElement))();
        this.element._transforms = {};
        this.currentParams = {};
    },
    easing: function(assert) {
        return function(p, from, to) {
            assert.ok(typeUtils.isDefined(p), 'progress pass to easing function');
            assert.ok(typeUtils.isDefined(from), 'from value pass to easing function');
            assert.ok(typeUtils.isDefined(to), 'to value pass to easing function');
            return from + (to - from) * p;
        };
    }
});

QUnit.test('animateSvgStep object', function(assert) {
    var step = this.animationStep;
    assert.ok(step);
    assert.ok($.isFunction(step.segments), 'can animate segments');
    assert.ok($.isFunction(step.transform), 'can animate transform');
    assert.ok($.isFunction(step.complete), 'complete action for all animate');
    assert.ok($.isFunction(step.base), 'can translate same attribute');
    assert.ok($.isFunction(step._), 'no action step');
});

QUnit.test('Base step', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.base(this.element, { from: 10, to: 20 }, 0.5, this.easing(assert), this.currentParams, 'x');

    assert.deepEqual(this.currentParams, { x: 15 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { x: 15 });
});

QUnit.test('Transformations step. translateX, translateY', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.transform(this.element, {
        from: {
            translateX: 10,
            translateY: 40
        },
        to: {
            translateX: 20,
            translateY: 60
        }
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { translateX: 15, translateY: 50 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { translateX: 15, translateY: 50 });
});

QUnit.test('Transformations step. Rotate with xy', function(assert) {
    var step = this.animationStep;

    // Act
    // elem, params, progress, easing, currentParams, attributeName
    step.transform(this.element, {
        from: {
            rotate: 10,
            rotateX: 10,
            rotateY: 0
        },
        to: {
            rotate: 360,
            rotateX: 10,
            rotateY: 0
        }
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { rotate: 185, rotateX: 10, rotateY: 0 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { rotate: 185, rotateX: 10, rotateY: 0 });
});

QUnit.test('Transformations step. Rotate without xy', function(assert) {
    var step = this.animationStep;

    // Act
    // elem, params, progress, easing, currentParams, attributeName
    step.transform(this.element, {
        from: { rotate: 10 },
        to: { rotate: 360 }
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { rotate: 185 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { rotate: 185 });
});

QUnit.test('Transformations step. Scale', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.transform(this.element, {
        from: {
            scaleX: 0,
            scaleY: 2
        },
        to: {
            scaleX: 1,
            scaleY: 1
        }
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { scaleX: 0.5, scaleY: 1.5 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { scaleX: 0.5, scaleY: 1.5 });
});

QUnit.test('Transformations step. All transformations', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.transform(this.element, {
        from: {
            scaleX: 0,
            scaleY: 2,
            rotate: 10,
            rotateX: 10,
            rotateY: 0,
            translateX: 10,
            translateY: 40
        },
        to: {
            scaleX: 1,
            scaleY: 1,
            rotate: 360,
            rotateX: 10,
            rotateY: 0,
            translateX: 20,
            translateY: 60
        }
    }, 0.5, this.easing(assert), this.currentParams, 'transform');

    assert.deepEqual(this.currentParams, { translateX: 15, translateY: 50, rotate: 185, rotateX: 10, rotateY: 0, scaleX: 0.5, scaleY: 1.5 });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { translateX: 15, translateY: 50, rotate: 185, rotateX: 10, rotateY: 0, scaleX: 0.5, scaleY: 1.5 });
});

QUnit.test('Arc step', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.arc(this.element, {
        from: {
            x: 1000,
            y: 2000,
            innerRadius: 50,
            outerRadius: 100,
            startAngle: 90,
            endAngle: 180
        }, to: {
            x: 2000,
            y: 3000,
            innerRadius: 100,
            outerRadius: 200,
            startAngle: 300,
            endAngle: -180
        }
    }, 0.5, this.easing(assert), this.currentParams, 'arc');

    // assert
    assert.deepEqual(this.currentParams, {});

    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], {
        x: 1500,
        y: 2500,
        innerRadius: 75,
        outerRadius: 150,
        startAngle: 195,
        endAngle: 0
    });
});

QUnit.test('Segments step', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.segments(this.element, {
        from: [['M', 10, 20], ['L', 10, 40], ['L', 50, 1], ['Z']],
        to: [['M', 0, 10], ['L', 10, 30], ['L', 40, 2], ['Z']]
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { segments: [['M', 5, 15], ['L', 10, 35], ['L', 45, 1.5], ['Z']] });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { segments: [['M', 5, 15], ['L', 10, 35], ['L', 45, 1.5], ['Z']] });
});

QUnit.test('Segments step with end param', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.segments(this.element, {
        from: [['M', 10, 20], ['L', 10, 40], ['L', 50, 1], ['Z']],
        to: [['M', 0, 10], ['L', 10, 30], ['L', 40, 2], ['Z']],
        end: [['M', 1, 2], ['L', 3, 4]]
    }, 0.5, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { segments: [['M', 5, 15], ['L', 10, 35], ['L', 45, 1.5], ['Z']] });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { segments: [['M', 5, 15], ['L', 10, 35], ['L', 45, 1.5], ['Z']] });
});

QUnit.test('Segments last step with end param', function(assert) {
    var step = this.animationStep;
    // elem, params, progress, easing, currentParams, attributeName
    step.segments(this.element, {
        from: [['M', 10, 20], ['L', 10, 40], ['L', 50, 1], ['Z']],
        to: [['M', 0, 10], ['L', 10, 30], ['L', 40, 2], ['Z']],
        end: [['M', 1, 2], ['L', 3, 4]]
    }, 1, this.easing(assert), this.currentParams);

    assert.deepEqual(this.currentParams, { segments: [['M', 1, 2], ['L', 3, 4]] });
    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { segments: [['M', 0, 10], ['L', 10, 30], ['L', 40, 2], ['Z']] });
});

QUnit.test('Complete action', function(assert) {
    var step = this.animationStep;
    step.complete(this.element, { someProp: 'someValue' });

    assert.strictEqual(this.element.stub('attr').callCount, 1);
    assert.deepEqual(this.element.stub('attr').firstCall.args[0], { someProp: 'someValue' });
});
