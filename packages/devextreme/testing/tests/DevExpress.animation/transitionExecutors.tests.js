import $ from 'jquery';
import { noop } from '__internal/core/utils/m_common';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import { presets as animationPresets } from 'common/core/animation/presets/presets';
import TransitionExecutorModule from 'common/core/animation/transition_executor/transition_executor';

QUnit.module('transition executor', {
    beforeEach: function() {
        executeAsyncMock.setup();
        this._originalAnimate = fx.animate;
        this._createAnimation = fx.createAnimation;
        this._savedDevice = devices.current();
        animationPresets.clear();
    },
    afterEach: function() {
        fx.animate = this._originalAnimate;
        fx.createAnimation = this._createAnimation;
        devices.current(this._savedDevice);
        animationPresets.resetToDefaults();
        executeAsyncMock.teardown();
    }
});

function MockAnimation(options) {
    options = options || {};
    this.element = options.element;
    this.config = options.config;
    this.animationSetupLog = options.animationSetupLog || [];
    this.animationStartLog = options.animationStartLog || [];
    this.animationStopLog = options.animationStopLog || [];
    this.setup = options.setup || function() {
        this.animationSetupLog.push(arguments);
    };
    this.start = options.start || function() {
        this.animationStartLog.push(arguments);
    };
    this.stop = options.stop || function() {
        this.animationStopLog.push(arguments);
    };
    this.deferred = options.deferred || $.Deferred();
}

QUnit.test('enter/leave/start', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter = $('<div/>');
    const $toLeave = $('<div/>');
    const fxAnimateDeferred = $.Deferred();
    const animationConfig = { duration: 555 };

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: fxAnimateDeferred
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter, animationConfig);
    transitionExecutor.leave($toLeave, animationConfig);

    assert.equal(createAnimationLog.length, 2);
    assert.equal(animationSetupLog.length, 2, 'T266556');
    assert.equal(animationStartLog.length, 0);

    const resultDeferred = transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(animationSetupLog.length, 2);
    assert.equal(animationStartLog.length, 2);

    assert.equal(createAnimationLog[0].element[0], $toEnter[0]);
    assert.equal(createAnimationLog[0].config.type, 'css');
    assert.equal(createAnimationLog[0].config.duration, 555);
    assert.equal(createAnimationLog[0].config.from, 'dx-enter dx-no-direction');
    assert.equal(createAnimationLog[0].config.to, 'dx-enter-active');

    assert.equal(createAnimationLog[1].element[0], $toLeave[0]);
    assert.equal(createAnimationLog[1].config.type, 'css');
    assert.equal(createAnimationLog[1].config.duration, 555);
    assert.equal(createAnimationLog[1].config.from, 'dx-leave dx-no-direction');
    assert.equal(createAnimationLog[1].config.to, 'dx-leave-active');
    assert.equal(resultDeferred.state(), 'pending');

    fxAnimateDeferred.resolve();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(resultDeferred.state(), 'resolved');
});

QUnit.test('stop', function(assert) {
    const animationStopLog = [];
    const $toEnter = $('<div/>');
    const $toLeave = $('<div/>');
    const animationConfig = { duration: 555 };

    fx.createAnimation = function(element, config) {
        const fxAnimateDeferred = $.Deferred();
        const result = new MockAnimation({
            element: element,
            config: config,
            deferred: fxAnimateDeferred,
            stop: function() {
                animationStopLog.push(arguments);
                fxAnimateDeferred.resolve();
            }
        });

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter, animationConfig);
    transitionExecutor.leave($toLeave, animationConfig);
    const resultDeferred = transitionExecutor.start();
    assert.equal(animationStopLog.length, 0);
    assert.equal(resultDeferred.state(), 'pending');

    transitionExecutor.stop();

    assert.equal(animationStopLog.length, 2);
    assert.equal(resultDeferred.state(), 'resolved');
});

QUnit.test('works without jquery', function(assert) {
    const animationStopLog = [];
    const $toEnter = document.createElement('div');
    const $toLeave = document.createElement('div');
    const animationConfig = { duration: 555 };

    fx.createAnimation = function(element, config) {
        const fxAnimateDeferred = $.Deferred();
        const result = new MockAnimation({
            element: element,
            config: config,
            deferred: fxAnimateDeferred,
            stop: function() {
                animationStopLog.push(arguments);
                fxAnimateDeferred.resolve();
            }
        });

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter, animationConfig);
    transitionExecutor.leave($toLeave, animationConfig);
    const resultDeferred = transitionExecutor.start();
    assert.equal(animationStopLog.length, 0);
    assert.equal(resultDeferred.state(), 'pending');

    transitionExecutor.stop();

    assert.equal(animationStopLog.length, 2);
    assert.equal(resultDeferred.state(), 'resolved');
});

QUnit.test('enter/leave/start direction parameter', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter = $('<div/>');
    const $toLeave = $('<div/>');

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: $.Deferred().resolve().promise()
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    createAnimationLog.length = 0;
    transitionExecutor.enter($toEnter, { type: undefined, duration: 555, extraCssClasses: 'a b' }, { direction: 'forward' });
    transitionExecutor.leave($toLeave, { type: 'css', duration: 555, extraCssClasses: 'a b' }, { direction: 'forward' });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(createAnimationLog[0].config.type, 'css');
    assert.equal(createAnimationLog[0].config.from, 'dx-enter a b dx-forward');
    assert.equal(createAnimationLog[0].config.to, 'dx-enter-active');
    assert.equal(createAnimationLog[1].config.type, 'css');
    assert.equal(createAnimationLog[1].config.from, 'dx-leave a b dx-forward');
    assert.equal(createAnimationLog[1].config.to, 'dx-leave-active');

    createAnimationLog.length = 0;
    transitionExecutor.enter($toEnter, { duration: 555 }, { direction: 'backward' });
    transitionExecutor.leave($toLeave, { duration: 555 }, { direction: 'backward' });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(createAnimationLog[0].config.from, 'dx-enter dx-backward');
    assert.equal(createAnimationLog[0].config.to, 'dx-enter-active');
    assert.equal(createAnimationLog[1].config.from, 'dx-leave dx-backward');
    assert.equal(createAnimationLog[1].config.to, 'dx-leave-active');

    createAnimationLog.length = 0;
    transitionExecutor.enter($toEnter, { duration: 555 }, { direction: 'none' });
    transitionExecutor.leave($toLeave, { duration: 555 }, { direction: 'none' });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(createAnimationLog[0].config.from, 'dx-enter dx-no-direction');
    assert.equal(createAnimationLog[0].config.to, 'dx-enter-active');
    assert.equal(createAnimationLog[1].config.from, 'dx-leave dx-no-direction');
    assert.equal(createAnimationLog[1].config.to, 'dx-leave-active');
});

QUnit.test('enter/leave/start non css', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter = $('<div/>');
    const $toLeave = $('<div/>');

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: $.Deferred().resolve().promise()
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    createAnimationLog.length = 0;
    transitionExecutor.enter($toEnter, { type: 'fade', from: 0.1, to: 0.9, duration: 555 });
    transitionExecutor.leave($toLeave, { type: 'fade', from: 0.9, to: 0.1, duration: 555 });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(createAnimationLog[0].element[0], $toEnter[0]);
    assert.equal(createAnimationLog[0].config.type, 'fade');
    assert.equal(createAnimationLog[0].config.from, 0.1);
    assert.equal(createAnimationLog[0].config.to, 0.9);
    assert.equal(createAnimationLog[0].config.duration, 555);

    assert.equal(createAnimationLog[1].element[0], $toLeave[0]);
    assert.equal(createAnimationLog[1].config.type, 'fade');
    assert.equal(createAnimationLog[1].config.from, 0.9, 'from and to are swapped');
    assert.equal(createAnimationLog[1].config.to, 0.1);
    assert.equal(createAnimationLog[1].config.duration, 555);
});

QUnit.test('enter/leave/start custom animations', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter = $('<div/>');
    const $toLeave = $('<div/>');
    const customAnimationNoResult = { enter: noop, leave: noop };
    const modifiers = { test: 'test' };
    const deferred = $.Deferred();

    const customAnimation = {
        enter: function(element, config) {
            const result = new MockAnimation({
                element: element,
                config: config,
                animationSetupLog: animationSetupLog,
                animationStartLog: animationStartLog,
                deferred: deferred
            });
            createAnimationLog.push(result);

            return result;
        },
        leave: function(element, config) {
            const result = new MockAnimation({
                element: element,
                config: config,
                animationSetupLog: animationSetupLog,
                animationStartLog: animationStartLog,
                deferred: deferred
            });
            createAnimationLog.push(result);

            return result;
        }
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    createAnimationLog.length = 0;
    transitionExecutor.enter($toEnter, customAnimation, modifiers);
    transitionExecutor.leave($toLeave, customAnimation, modifiers);
    let transitionsPromise = transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);
    assert.equal(createAnimationLog[0].element[0], $toEnter[0]);
    assert.equal(createAnimationLog[0].config.test, 'test');
    assert.equal(createAnimationLog[1].element[0], $toLeave[0]);
    assert.equal(createAnimationLog[1].config.test, 'test');
    assert.equal(transitionsPromise.state(), 'pending');

    deferred.resolve();
    assert.equal(transitionsPromise.state(), 'resolved');

    transitionExecutor.enter($toEnter, customAnimationNoResult, modifiers);
    transitionExecutor.leave($toLeave, customAnimationNoResult, modifiers);

    transitionsPromise = transitionExecutor.start();
    assert.equal(transitionsPromise.state(), 'resolved');
});

QUnit.test('sync transitions', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter1 = $('<div/>');
    const $toEnter2 = $('<div/>');
    const $toLeave = $('<div/>');
    const fxAnimateDeferreds = [$.Deferred(), $.Deferred(), $.Deferred()];

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: fxAnimateDeferreds[createAnimationLog.length]
        });
        createAnimationLog.push(result);

        return result;
    };


    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter1, { duration: 555 });
    transitionExecutor.enter($toEnter2, { duration: 555 });
    transitionExecutor.leave($toLeave, { duration: 555 });

    assert.equal(createAnimationLog.length, 3);

    const resultDeferred = transitionExecutor.start();
    assert.equal(createAnimationLog.length, 3);
    assert.equal(resultDeferred.state(), 'pending');

    fxAnimateDeferreds[0].resolve();
    assert.equal(resultDeferred.state(), 'pending');
    fxAnimateDeferreds[1].reject();
    assert.equal(resultDeferred.state(), 'pending', 'Addition to T300400');
    fxAnimateDeferreds[2].resolve();
    assert.equal(resultDeferred.state(), 'resolved');
});

QUnit.test('staggering transitions', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter1 = $('<div/>');
    const $toEnter2 = $('<div/>');
    const $toEnter3 = $('<div/>');
    const $toLeave1 = $('<div/>');
    const $toLeave2 = $('<div/>');
    const $toLeave3 = $('<div/>');
    const fxAnimateDeferred = $.Deferred().resolve();
    const animation = {
        duration: 555,
        delay: 100,
        staggerDelay: 111
    };

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: fxAnimateDeferred
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter1, animation);
    transitionExecutor.enter($toEnter2, animation);
    transitionExecutor.enter($toEnter3, animation);

    transitionExecutor.leave($toLeave1, animation);
    transitionExecutor.leave($toLeave2, animation);
    transitionExecutor.leave($toLeave3, animation);

    assert.equal(createAnimationLog.length, 6);
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 6);

    assert.equal(createAnimationLog[0].element[0], $toEnter1[0]);
    assert.equal(createAnimationLog[0].config.duration, 555);
    assert.equal(createAnimationLog[0].config.delay, 100);

    assert.equal(createAnimationLog[1].element[0], $toEnter2[0]);
    assert.equal(createAnimationLog[1].config.duration, 555);
    assert.equal(createAnimationLog[1].config.delay, 211);

    assert.equal(createAnimationLog[2].element[0], $toEnter3[0]);
    assert.equal(createAnimationLog[2].config.duration, 555);
    assert.equal(createAnimationLog[2].config.delay, 322);

    assert.equal(createAnimationLog[3].element[0], $toLeave1[0]);
    assert.equal(createAnimationLog[3].config.duration, 555);
    assert.equal(createAnimationLog[3].config.delay, 100);

    assert.equal(createAnimationLog[4].element[0], $toLeave2[0]);
    assert.equal(createAnimationLog[4].config.duration, 555);
    assert.equal(createAnimationLog[4].config.delay, 211);

    assert.equal(createAnimationLog[5].element[0], $toLeave3[0]);
    assert.equal(createAnimationLog[5].config.duration, 555);
    assert.equal(createAnimationLog[5].config.delay, 322);

});

QUnit.test('animation device-dependent presets', function(assert) {
    const createAnimationLog = [];
    const animationSetupLog = [];
    const animationStartLog = [];
    const $toEnter = $('<div/>');

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: animationSetupLog,
            animationStartLog: animationStartLog,
            deferred: $.Deferred().resolve().promise()
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    animationPresets.registerPreset('test-animation', {
        device: { platform: 'ios' },
        animation: { type: 'fadeIn', from: 0.1, to: 0.9 }
    });

    animationPresets.registerPreset('test-animation', {
        device: function(currentDevice) { return currentDevice.platform === 'android'; },
        animation: { type: 'css', from: 'test', to: 'test-active' }
    });

    devices.current({ platform: 'ios' });
    animationPresets.applyChanges();
    transitionExecutor.enter($toEnter, 'test-animation');
    transitionExecutor.start();

    devices.current({ platform: 'android' });
    animationPresets.applyChanges();
    transitionExecutor.enter($toEnter, 'test-animation');
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 2);

    assert.equal(createAnimationLog[0].config.type, 'fadeIn');
    assert.equal(createAnimationLog[0].config.from, 0.1);
    assert.equal(createAnimationLog[0].config.to, 0.9);

    assert.equal(createAnimationLog[1].config.type, 'css');
    assert.equal(createAnimationLog[1].config.from, 'test dx-no-direction');
    assert.equal(createAnimationLog[1].config.to, 'test-active');
});

QUnit.test('no animations with unknown preset', function(assert) {
    const createAnimationLog = [];
    const $toEnter = $('<div/>');

    fx.createAnimationLog = function(element, config) {
        createAnimationLog.push({
            element: element,
            config: config
        });
        return $.Deferred().resolve().promise();
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

    transitionExecutor.enter($toEnter, 'test-animation');
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 0);
});

QUnit.test('clear presets', function(assert) {
    animationPresets.registerPreset('test-animation1', {
        animation: { type: 'test' }
    });
    animationPresets.registerPreset('test-animation2', {
        animation: { type: 'test' }
    });
    animationPresets.applyChanges();
    assert.ok(animationPresets.getPreset('test-animation1'));
    assert.ok(animationPresets.getPreset('test-animation2'));

    animationPresets.clear('test-animation1');
    assert.ok(!animationPresets.getPreset('test-animation1'));
    assert.ok(animationPresets.getPreset('test-animation2'));

    animationPresets.clear();
    assert.ok(!animationPresets.getPreset('test-animation1'));
    assert.ok(!animationPresets.getPreset('test-animation2'));
});

QUnit.test('preset aliases', function(assert) {
    animationPresets.registerPreset('test-animation', {
        animation: { type: 'fadeIn', from: 0.1, to: 0.9 }
    });
    animationPresets.registerPreset('alias', {
        animation: 'test-animation'
    });
    animationPresets.applyChanges();
    assert.equal(animationPresets.getPreset('alias'), animationPresets.getPreset('test-animation'));
});

QUnit.test('Animation with direction=none on Android (T277115)', function(assert) {
    const createAnimationLog = [];
    const $toEnter = $('<div/>');

    devices.current({ platform: 'android' });
    animationPresets.resetToDefaults();

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: [],
            animationStartLog: [],
            deferred: $.Deferred().resolve().promise()
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();
    transitionExecutor.enter($toEnter, 'slide', { direction: 'none' });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 1);
});

QUnit.test('The \'configModifier.delay\' property is taken into account on Android (T339056)', function(assert) {
    const createAnimationLog = [];
    const $toEnter = $('<div/>');

    devices.current({ platform: 'android' });
    animationPresets.resetToDefaults();

    fx.createAnimation = function(element, config) {
        const result = new MockAnimation({
            element: element,
            config: config,
            animationSetupLog: [],
            animationStartLog: [],
            deferred: $.Deferred().resolve().promise()
        });
        createAnimationLog.push(result);

        return result;
    };

    const transitionExecutor = new TransitionExecutorModule.TransitionExecutor();
    transitionExecutor.enter($toEnter, 'slide', { duration: 123, delay: 234 });
    transitionExecutor.start();

    assert.equal(createAnimationLog.length, 1);
    assert.equal(createAnimationLog[0].config.duration, 123);
    assert.equal(createAnimationLog[0].config.delay, 234);
});
