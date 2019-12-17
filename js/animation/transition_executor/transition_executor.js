var $ = require('../../core/renderer'),
    Class = require('../../core/class'),
    extend = require('../../core/utils/extend').extend,
    commonUtils = require('../../core/utils/common'),
    typeUtils = require('../../core/utils/type'),
    iteratorUtils = require('../../core/utils/iterator'),
    fx = require('../fx'),
    animationPresetsModule = require('../presets/presets'),
    deferredUtils = require('../../core/utils/deferred'),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

var directionPostfixes = {
        forward: ' dx-forward',
        backward: ' dx-backward',
        none: ' dx-no-direction',
        undefined: ' dx-no-direction'
    },
    DX_ANIMATING_CLASS = 'dx-animating';

var TransitionExecutor = Class.inherit({
    ctor: function() {
        this._accumulatedDelays = {
            enter: 0,
            leave: 0
        };
        this._animations = [];
        this.reset();
    },

    _createAnimations: function($elements, initialConfig, configModifier, type) {
        var that = this,
            result = [],
            animationConfig;

        configModifier = configModifier || {};
        animationConfig = this._prepareElementAnimationConfig(initialConfig, configModifier, type);

        if(animationConfig) {
            $elements.each(function() {
                var animation = that._createAnimation($(this), animationConfig, configModifier);
                if(animation) {
                    animation.element.addClass(DX_ANIMATING_CLASS);
                    animation.setup();
                    result.push(animation);
                }
            });
        }

        return result;
    },

    _prepareElementAnimationConfig: function(config, configModifier, type) {
        var result;

        if(typeof config === 'string') {
            var presetName = config;
            config = animationPresetsModule.presets.getPreset(presetName);
        }

        if(!config) {
            result = undefined;
        } else if(typeUtils.isFunction(config[type])) {
            result = config[type];
        } else {
            result = extend({
                skipElementInitialStyles: true,
                cleanupWhen: this._completePromise
            }, config, configModifier);

            if(!result.type || result.type === 'css') {
                var cssClass = 'dx-' + type,
                    extraCssClasses = (result.extraCssClasses ? ' ' + result.extraCssClasses : '') + directionPostfixes[result.direction];

                result.type = 'css';
                result.from = (result.from || cssClass) + extraCssClasses;
                result.to = result.to || (cssClass + '-active');
            }

            result.staggerDelay = result.staggerDelay || 0;
            result.delay = result.delay || 0;

            if(result.staggerDelay) {
                result.delay += this._accumulatedDelays[type];
                this._accumulatedDelays[type] += result.staggerDelay;
            }

        }
        return result;
    },

    _createAnimation: function($element, animationConfig, configModifier) {
        var result;

        if(typeUtils.isPlainObject(animationConfig)) {
            result = fx.createAnimation($element, animationConfig);
        } else if(typeUtils.isFunction(animationConfig)) {
            result = animationConfig($element, configModifier);
        }

        return result;
    },

    _startAnimations: function() {
        var animations = this._animations;

        for(var i = 0; i < animations.length; i++) {
            animations[i].start();
        }
    },

    _stopAnimations: function(jumpToEnd) {
        var animations = this._animations;

        for(var i = 0; i < animations.length; i++) {
            animations[i].stop(jumpToEnd);
        }
    },

    _clearAnimations: function() {
        var animations = this._animations;

        for(var i = 0; i < animations.length; i++) {
            animations[i].element.removeClass(DX_ANIMATING_CLASS);
        }

        this._animations.length = 0;
    },

    /**
    * @name TransitionExecutorMethods.reset
    * @publicName reset()
    */
    reset: function() {
        this._accumulatedDelays.enter = 0;
        this._accumulatedDelays.leave = 0;
        this._clearAnimations();
        this._completeDeferred = new Deferred();
        this._completePromise = this._completeDeferred.promise();
    },
    /**
    * @name TransitionExecutorMethods.enter
    * @publicName enter(elements, animation)
    * @param1 elements:jQuery
    * @param2 animation:animationConfig|string
    */
    enter: function($elements, animationConfig, configModifier) {
        var animations = this._createAnimations($elements, animationConfig, configModifier, 'enter');
        this._animations.push.apply(this._animations, animations);
    },
    /**
    * @name TransitionExecutorMethods.leave
    * @publicName leave(elements, animation)
    * @param1 elements:jQuery
    * @param2 animation:animationConfig|string
    */
    leave: function($elements, animationConfig, configModifier) {
        var animations = this._createAnimations($elements, animationConfig, configModifier, 'leave');
        this._animations.push.apply(this._animations, animations);
    },
    /**
    * @name TransitionExecutorMethods.start
    * @publicName start()
    * @return Promise<void>
    */
    start: function() {
        var that = this,
            result;

        if(!this._animations.length) {
            that.reset();
            result = new Deferred().resolve().promise();
        } else {
            var animationDeferreds = iteratorUtils.map(this._animations, function(animation) {
                var result = new Deferred();

                animation.deferred.always(function() {
                    result.resolve();
                });

                return result.promise();
            });

            result = when.apply($, animationDeferreds)
                .always(function() {
                    that._completeDeferred.resolve();
                    that.reset();
                });

            commonUtils.executeAsync(function() {
                that._startAnimations();
            });
        }

        return result;
    },
    /**
    * @name TransitionExecutorMethods.stop
    * @publicName stop()
    */
    stop: function(jumpToEnd) {
        this._stopAnimations(jumpToEnd);
    }

});

exports.TransitionExecutor = TransitionExecutor;
