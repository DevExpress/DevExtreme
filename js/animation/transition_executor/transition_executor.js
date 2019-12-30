const $ = require('../../core/renderer');
const Class = require('../../core/class');
const extend = require('../../core/utils/extend').extend;
const commonUtils = require('../../core/utils/common');
const typeUtils = require('../../core/utils/type');
const iteratorUtils = require('../../core/utils/iterator');
const fx = require('../fx');
const animationPresetsModule = require('../presets/presets');
const deferredUtils = require('../../core/utils/deferred');
const when = deferredUtils.when;
const Deferred = deferredUtils.Deferred;

const directionPostfixes = {
    forward: ' dx-forward',
    backward: ' dx-backward',
    none: ' dx-no-direction',
    undefined: ' dx-no-direction'
};
const DX_ANIMATING_CLASS = 'dx-animating';

const TransitionExecutor = Class.inherit({
    ctor: function() {
        this._accumulatedDelays = {
            enter: 0,
            leave: 0
        };
        this._animations = [];
        this.reset();
    },

    _createAnimations: function($elements, initialConfig, configModifier, type) {
        const that = this;
        const result = [];
        let animationConfig;

        configModifier = configModifier || {};
        animationConfig = this._prepareElementAnimationConfig(initialConfig, configModifier, type);

        if(animationConfig) {
            $elements.each(function() {
                const animation = that._createAnimation($(this), animationConfig, configModifier);
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
        let result;

        if(typeof config === 'string') {
            const presetName = config;
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
                const cssClass = 'dx-' + type;
                const extraCssClasses = (result.extraCssClasses ? ' ' + result.extraCssClasses : '') + directionPostfixes[result.direction];

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
        let result;

        if(typeUtils.isPlainObject(animationConfig)) {
            result = fx.createAnimation($element, animationConfig);
        } else if(typeUtils.isFunction(animationConfig)) {
            result = animationConfig($element, configModifier);
        }

        return result;
    },

    _startAnimations: function() {
        const animations = this._animations;

        for(let i = 0; i < animations.length; i++) {
            animations[i].start();
        }
    },

    _stopAnimations: function(jumpToEnd) {
        const animations = this._animations;

        for(let i = 0; i < animations.length; i++) {
            animations[i].stop(jumpToEnd);
        }
    },

    _clearAnimations: function() {
        const animations = this._animations;

        for(let i = 0; i < animations.length; i++) {
            animations[i].element.removeClass(DX_ANIMATING_CLASS);
        }

        this._animations.length = 0;
    },

    reset: function() {
        this._accumulatedDelays.enter = 0;
        this._accumulatedDelays.leave = 0;
        this._clearAnimations();
        this._completeDeferred = new Deferred();
        this._completePromise = this._completeDeferred.promise();
    },
    enter: function($elements, animationConfig, configModifier) {
        const animations = this._createAnimations($elements, animationConfig, configModifier, 'enter');
        this._animations.push.apply(this._animations, animations);
    },
    leave: function($elements, animationConfig, configModifier) {
        const animations = this._createAnimations($elements, animationConfig, configModifier, 'leave');
        this._animations.push.apply(this._animations, animations);
    },
    start: function() {
        const that = this;
        let result;

        if(!this._animations.length) {
            that.reset();
            result = new Deferred().resolve().promise();
        } else {
            const animationDeferreds = iteratorUtils.map(this._animations, function(animation) {
                const result = new Deferred();

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
    stop: function(jumpToEnd) {
        this._stopAnimations(jumpToEnd);
    }

});

exports.TransitionExecutor = TransitionExecutor;
