"use strict";

var $ = require("../core/renderer"),
    errors = require("../core/errors"),
    extend = require("../core/utils/extend").extend,
    typeUtils = require("../core/utils/type"),
    translator = require("./translator"),
    easing = require("./easing"),
    animationFrame = require("./frame"),
    support = require("../core/utils/support"),
    positionUtils = require("./position"),
    removeEvent = require("../core/remove_event"),
    eventUtils = require("../events/utils"),
    when = require("../integration/jquery/deferred").when,
    transitionEndEventName = support.transitionEndEventName + ".dxFX",
    removeEventName = eventUtils.addNamespace(removeEvent, "dxFX"),
    isFunction = typeUtils.isFunction,
    isPlainObject = typeUtils.isPlainObject,
    noop = require("../core/utils/common").noop;


var RELATIVE_VALUE_REGEX = /^([+-])=(.*)/i,
    ANIM_DATA_KEY = "dxAnimData",
    ANIM_QUEUE_KEY = "dxAnimQueue",
    TRANSFORM_PROP = "transform";


/**
* @name animationConfig
* @publicName animationConfig
* @type object
*/
/**
* @name animationConfig_start
* @publicName start
* @type function
* @type_function_param1 $element:jQuery
* @type_function_param2 config:object
*/
/**
* @name animationConfig_complete
* @publicName complete
* @type function
* @type_function_param1 $element:jQuery
* @type_function_param2 config:object
*/
/**
* @name animationConfig_delay
* @publicName delay
* @type number
* @default 0
*/
/**
* @name animationConfig_staggerDelay
* @publicName staggerDelay
* @type number
* @default undefined
*/
/**
* @name animationConfig_duration
* @publicName duration
* @type number
* @default 400
*/
/**
* @name animationConfig_easing
* @publicName easing
* @type string
* @default 'ease'
*/
/**
* @name animationConfig_type
* @publicName type
* @type string
* @acceptValues 'fade'|'fadeIn'|'fadeOut'|'pop'|'slide'|'slideIn'|'slideOut'|'css'
* @default 'custom'
*/
/**
* @name animationConfig_direction
* @publicName direction
* @type string
* @acceptValues 'top'|'bottom'|'left'|'right'
* @default undefined
*/
/**
* @name animationConfig_from
* @publicName from
* @type number|string|object
* @default {}
*/
/**
* @name animationConfig_to
* @publicName to
* @type number|string|object
* @default {}
*/

var TransitionAnimationStrategy = {
    initAnimation: function($element, config) {
        $element.css({
            "transitionProperty": "none"
        });

        if(typeof config.from === "string") {
            $element.addClass(config.from);
        } else {
            setProps($element, config.from);
        }

        var that = this,
            deferred = $.Deferred(),
            cleanupWhen = config.cleanupWhen;

        config.transitionAnimation = {
            deferred: deferred,
            finish: function() {
                that._finishTransition($element);
                if(cleanupWhen) {
                    when(deferred, cleanupWhen).always(function() {
                        that._cleanup($element, config);
                    });
                } else {
                    that._cleanup($element, config);
                }
                deferred.resolveWith($element, [config, $element]);
            }
        };

        this._completeAnimationCallback($element, config)
            .done(function() {
                config.transitionAnimation.finish();
            })
            .fail(function() {
                deferred.rejectWith($element, [config, $element]);
            });

        if(!config.duration) {
            config.transitionAnimation.finish();
        }

        // NOTE: Hack for setting 'from' css by browser before run animation
        //       Do not move this hack to initAnimation since some css props can be changed in the 'start' callback (T231434)
        //       Unfortunately this can't be unit tested
        // TODO: find better way if possible
        $element.css("transform");
    },
    animate: function($element, config) {
        this._startAnimation($element, config);
        return config.transitionAnimation.deferred.promise();
    },

    _completeAnimationCallback: function($element, config) {
        var that = this,
            startTime = Date.now() + config.delay,
            deferred = $.Deferred(),
            transitionEndFired = $.Deferred(),
            simulatedTransitionEndFired = $.Deferred(),
            simulatedEndEventTimer,
            waitForJSCompleteTimer;

        config.transitionAnimation.cleanup = function() {
            clearTimeout(simulatedEndEventTimer);
            clearTimeout(waitForJSCompleteTimer);
            $element.off(transitionEndEventName);
            $element.off(removeEventName);
        };

        $element
            .one(transitionEndEventName, function() {
                //NOTE: prevent native transitionEnd event from previous animation in queue (Chrome)
                if(Date.now() - startTime >= config.duration) {
                    transitionEndFired.reject();
                }
            })
            .off(removeEventName)
            .on(removeEventName, function() {
                that.stop($element, config);
                deferred.reject();
            });

        waitForJSCompleteTimer = setTimeout(function() { //Fix for a visual bug (T244514): do not setup the timer until all js code has finished working
            simulatedEndEventTimer = setTimeout(function() {
                simulatedTransitionEndFired.reject();
            }, config.duration + config.delay + fx._simulatedTransitionEndDelay/*T255863*/);

            when(transitionEndFired, simulatedTransitionEndFired).fail((function() {
                deferred.resolve();
            }).bind(this));
        });

        return deferred.promise();
    },

    _startAnimation: function($element, config) {
        $element.css({
            "transitionProperty": "all",
            "transitionDelay": config.delay + "ms",
            "transitionDuration": config.duration + "ms",
            "transitionTimingFunction": config.easing
        });

        if(typeof config.to === "string") {
            $element[0].className += " " + config.to;
            //Do not uncomment: performance critical
            //$element.addClass(config.to);
        } else if(config.to) {
            setProps($element, config.to);
        }
    },

    _finishTransition: function($element) {
        $element.css("transition", "none");
    },

    _cleanup: function($element, config) {
        config.transitionAnimation.cleanup();

        if(typeof config.from === "string") {
            $element.removeClass(config.from);
            $element.removeClass(config.to);
        }
    },

    stop: function($element, config, jumpToEnd) {
        if(!config) {
            return;
        }

        if(jumpToEnd) {
            config.transitionAnimation.finish();
        } else {
            if(isPlainObject(config.to)) {
                $.each(config.to, function(key) {
                    $element.css(key, $element.css(key));
                });
            }
            this._finishTransition($element);
            this._cleanup($element, config);
        }
    }
};

var FrameAnimationStrategy = {
    initAnimation: function($element, config) {
        setProps($element, config.from);
    },
    animate: function($element, config) {
        var deferred = $.Deferred(),
            that = this;

        if(!config) {
            return deferred.reject().promise();
        }

        $.each(config.to, function(prop) {
            if(config.from[prop] === undefined) {
                config.from[prop] = that._normalizeValue($element.css(prop));
            }
        });

        if(config.to[TRANSFORM_PROP]) {
            config.from[TRANSFORM_PROP] = that._parseTransform(config.from[TRANSFORM_PROP]);
            config.to[TRANSFORM_PROP] = that._parseTransform(config.to[TRANSFORM_PROP]);
        }

        config.frameAnimation = {
            to: config.to,
            from: config.from,
            currentValue: config.from,
            easing: easing.convertTransitionTimingFuncToEasing(config.easing),
            duration: config.duration,
            startTime: new Date().valueOf(),
            finish: function() {
                this.currentValue = this.to;
                this.draw();
                animationFrame.cancelAnimationFrame(config.frameAnimation.animationFrameId);
                deferred.resolve();
            },
            draw: function() {
                if(config.draw) {
                    config.draw(this.currentValue);
                    return;
                }

                var currentValue = extend({}, this.currentValue);

                if(currentValue[TRANSFORM_PROP]) {
                    currentValue[TRANSFORM_PROP] = $.map(currentValue[TRANSFORM_PROP], function(value, prop) {
                        if(prop === "translate") {
                            return translator.getTranslateCss(value);
                        } else if(prop === "scale") {
                            return "scale(" + value + ")";
                        } else if(prop.substr(0, prop.length - 1) === "rotate") {
                            return prop + "(" + value + "deg)";
                        }
                    }).join(" ");
                }

                $element.css(currentValue);
            }
        };

        if(config.delay) {
            config.frameAnimation.startTime += config.delay;
            config.frameAnimation.delayTimeout = setTimeout(function() {
                that._startAnimation($element, config);
            }, config.delay);
        } else {
            that._startAnimation($element, config);
        }
        return deferred.promise();
    },

    _startAnimation: function($element, config) {
        $element
            .off(removeEventName)
            .on(removeEventName, function() {
                if(config.frameAnimation) {
                    animationFrame.cancelAnimationFrame(config.frameAnimation.animationFrameId);
                }
            });

        this._animationStep($element, config);
    },

    _parseTransform: function(transformString) {
        var result = {};

        $.each(transformString.match(/(\w|\d)+\([^\)]*\)\s*/g), function(i, part) {
            var translateData = translator.parseTranslate(part),
                scaleData = part.match(/scale\((.+?)\)/),
                rotateData = part.match(/(rotate.)\((.+)deg\)/);

            if(translateData) {
                result.translate = translateData;
            }

            if(scaleData && scaleData[1]) {
                result.scale = parseFloat(scaleData[1]);
            }

            if(rotateData && rotateData[1]) {
                result[rotateData[1]] = parseFloat(rotateData[2]);
            }
        });

        return result;
    },

    stop: function($element, config, jumpToEnd) {
        var frameAnimation = config && config.frameAnimation;

        if(!frameAnimation) {
            return;
        }

        animationFrame.cancelAnimationFrame(frameAnimation.animationFrameId);
        clearTimeout(frameAnimation.delayTimeout);

        if(jumpToEnd) {
            frameAnimation.finish();
        }

        delete config.frameAnimation;
    },

    _animationStep: function($element, config) {
        var frameAnimation = config && config.frameAnimation;

        if(!frameAnimation) {
            return;
        }

        var now = new Date().valueOf();

        if(now >= frameAnimation.startTime + frameAnimation.duration) {
            frameAnimation.finish();
            return;
        }

        frameAnimation.currentValue = this._calcStepValue(frameAnimation, now - frameAnimation.startTime);
        frameAnimation.draw();

        var that = this;
        frameAnimation.animationFrameId = animationFrame.requestAnimationFrame(function() {
            that._animationStep($element, config);
        });
    },

    _calcStepValue: function(frameAnimation, currentDuration) {
        var calcValueRecursively = function(from, to) {
            var result = Array.isArray(to) ? [] : {};

            var calcEasedValue = function(propName) {
                var x = currentDuration / frameAnimation.duration,
                    t = currentDuration,
                    b = 1 * from[propName],
                    c = to[propName] - from[propName],
                    d = frameAnimation.duration;

                return easing.getEasing(frameAnimation.easing)(x, t, b, c, d);
            };

            $.each(to, function(propName, endPropValue) {
                if(typeof endPropValue === "string" && parseFloat(endPropValue, 10) === false) {
                    return true;
                }

                result[propName] = typeof endPropValue === "object"
                    ? calcValueRecursively(from[propName], endPropValue)
                    : calcEasedValue(propName);
            });

            return result;
        };

        return calcValueRecursively(frameAnimation.from, frameAnimation.to);
    },

    _normalizeValue: function(value) {
        var numericValue = parseFloat(value, 10);

        if(numericValue === false) {
            return value;
        }

        return numericValue;
    }
};

var FallbackToNoAnimationStrategy = {
    initAnimation: function() {
    },
    animate: function() {
        return $.Deferred().resolve().promise();
    },
    stop: noop,
    isSynchronous: true
};

var animationStrategies = {
    "transition": support.transition ? TransitionAnimationStrategy : FrameAnimationStrategy,
    "frame": FrameAnimationStrategy,
    "noAnimation": FallbackToNoAnimationStrategy
};

var getAnimationStrategy = function(config) {
    config = config || {};
    var strategy = config.strategy || "transition";

    if(config.type === "css" && !support.transition) {
        strategy = "noAnimation";
    }

    return animationStrategies[strategy];
};


var baseConfigValidator = function(config, animationType, validate, typeMessage) {
    $.each(["from", "to"], function() {
        if(!validate(config[this])) {
            throw errors.Error("E0010", animationType, this, typeMessage);
        }
    });
};

var isObjectConfigValidator = function(config, animationType) {
    return baseConfigValidator(config, animationType, function(target) { return isPlainObject(target); }, "a plain object");
};

var isStringConfigValidator = function(config, animationType) {
    return baseConfigValidator(config, animationType, function(target) { return typeof target === "string"; }, "a string");
};

var CustomAnimationConfigurator = {
    setup: function() {
    }
};

var CssAnimationConfigurator = {
    validateConfig: function(config) {
        isStringConfigValidator(config, "css");
    },

    setup: function() {
    }
};

var positionAliases = {
    "top": { my: "bottom center", at: "top center" },
    "bottom": { my: "top center", at: "bottom center" },
    "right": { my: "left center", at: "right center" },
    "left": { my: "right center", at: "left center" }
};

var SlideAnimationConfigurator = {
    validateConfig: function(config) {
        isObjectConfigValidator(config, "slide");
    },

    setup: function($element, config) {
        var location = translator.locate($element);

        if(config.type !== "slide") {
            var positioningConfig = (config.type === "slideIn") ? config.from : config.to;

            positioningConfig.position = extend({ of: window }, positionAliases[config.direction]);
            setupPosition($element, positioningConfig);
        }

        this._setUpConfig(location, config.from);
        this._setUpConfig(location, config.to);

        translator.clearCache($element);
    },

    _setUpConfig: function(location, config) {
        config.left = "left" in config ? config.left : "+=0";
        config.top = "top" in config ? config.top : "+=0";

        this._initNewPosition(location, config);
    },

    _initNewPosition: function(location, config) {
        var position = {
            left: config.left,
            top: config.top
        };

        delete config.left;
        delete config.top;

        var relativeValue = this._getRelativeValue(position.left);
        if(relativeValue !== undefined) {
            position.left = relativeValue + location.left;
        } else {
            config.left = 0;
        }

        relativeValue = this._getRelativeValue(position.top);
        if(relativeValue !== undefined) {
            position.top = relativeValue + location.top;
        } else {
            config.top = 0;
        }

        config[TRANSFORM_PROP] = translator.getTranslateCss({ x: position.left, y: position.top });
    },

    _getRelativeValue: function(value) {
        var relativeValue;
        if(typeof value === "string" && (relativeValue = RELATIVE_VALUE_REGEX.exec(value))) {
            return parseInt(relativeValue[1] + "1") * relativeValue[2];
        }
    }
};

var FadeAnimationConfigurator = {
    setup: function($element, config) {
        var from = config.from,
            fromOpacity = isPlainObject(from) ? (config.skipElementInitialStyles ? 0 : $element.css("opacity")) : String(from),
            toOpacity;

        switch(config.type) {
            case "fadeIn":
                toOpacity = 1;
                break;
            case "fadeOut":
                toOpacity = 0;
                break;
            default:
                toOpacity = String(config.to);
        }

        config.from = {
            visibility: "visible",
            opacity: fromOpacity
        };

        config.to = {
            opacity: toOpacity
        };
    }
};

var PopAnimationConfigurator = {
    validateConfig: function(config) {
        isObjectConfigValidator(config, "pop");
    },

    setup: function($element, config) {
        var from = config.from,
            to = config.to,
            fromOpacity = "opacity" in from ? from.opacity : $element.css("opacity"),
            toOpacity = "opacity" in to ? to.opacity : 1,
            fromScale = "scale" in from ? from.scale : 0,
            toScale = "scale" in to ? to.scale : 1;

        config.from = {
            opacity: fromOpacity
        };

        var translate = translator.getTranslate($element);

        config.from[TRANSFORM_PROP] = this._getCssTransform(translate, fromScale);

        config.to = {
            opacity: toOpacity
        };
        config.to[TRANSFORM_PROP] = this._getCssTransform(translate, toScale);
    },

    _getCssTransform: function(translate, scale) {
        return translator.getTranslateCss(translate) + "scale(" + scale + ")";
    }
};


var animationConfigurators = {
    "custom": CustomAnimationConfigurator,
    "slide": SlideAnimationConfigurator,
    "slideIn": SlideAnimationConfigurator,
    "slideOut": SlideAnimationConfigurator,
    "fade": FadeAnimationConfigurator,
    "fadeIn": FadeAnimationConfigurator,
    "fadeOut": FadeAnimationConfigurator,
    "pop": PopAnimationConfigurator,
    "css": CssAnimationConfigurator
};

var getAnimationConfigurator = function(config) {
    var result = animationConfigurators[config.type];
    if(!result) {
        throw errors.Error("E0011", config.type);
    }

    return result;
};


var defaultJSConfig = {
        type: "custom",
        from: {},
        to: {},
        duration: 400,
        start: noop,
        complete: noop,
        easing: "ease",
        delay: 0
    },
    defaultCssConfig = {
        duration: 400,
        easing: "ease",
        delay: 0
    };

var setupAnimationOnElement = function() {
    var animation = this,
        $element = animation.element,
        config = animation.config;

    setupPosition($element, config.from);
    setupPosition($element, config.to);

    animation.configurator.setup($element, config);

    $element.data(ANIM_DATA_KEY, animation);

    if(fx.off) {
        config.duration = 0;
        config.delay = 0;
    }

    animation.strategy.initAnimation($element, config);

    if(config.start) {
        config.start.apply(this, [$element, config]);
    }
};

var onElementAnimationComplete = function(animation) {
    var $element = animation.element,
        config = animation.config;

    $element.removeData(ANIM_DATA_KEY);
    if(config.complete) {
        config.complete.apply(this, [$element, config]);
    }
    animation.deferred.resolveWith(this, [$element, config]);
};

var startAnimationOnElement = function() {
    var animation = this,
        $element = animation.element,
        config = animation.config;

    animation.isStarted = true;
    return animation.strategy.animate($element, config)
        .done(function() {
            onElementAnimationComplete(animation);
        })
        .fail(function() {
            animation.deferred.rejectWith(this, [$element, config]);
        });
};

var stopAnimationOnElement = function(jumpToEnd) {
    var animation = this,
        $element = animation.element,
        config = animation.config;

    clearTimeout(animation.startTimeout);

    if(!animation.isStarted) {
        animation.start();
    }

    animation.strategy.stop($element, config, jumpToEnd);
};

var scopedRemoveEvent = eventUtils.addNamespace(removeEvent, "dxFXStartAnimation");

var subscribeToRemoveEvent = function(animation) {
    animation.element
        .off(scopedRemoveEvent)
        .on(scopedRemoveEvent, function() {
            fx.stop(animation.element);
        });

    animation.deferred.always(function() {
        animation.element.off(scopedRemoveEvent);
    });
};

var createAnimation = function(element, initialConfig) {
    var defaultConfig = initialConfig.type === "css" ? defaultCssConfig : defaultJSConfig,
        config = extend(true, {}, defaultConfig, initialConfig),
        configurator = getAnimationConfigurator(config),
        strategy = getAnimationStrategy(config),
        animation = {
            element: $(element),
            config: config,
            configurator: configurator,
            strategy: strategy,
            isSynchronous: strategy.isSynchronous,
            setup: setupAnimationOnElement,
            start: startAnimationOnElement,
            stop: stopAnimationOnElement,
            deferred: $.Deferred()
        };

    if(isFunction(configurator.validateConfig)) {
        configurator.validateConfig(config);
    }

    subscribeToRemoveEvent(animation);

    return animation;
};

var animate = function(element, config) {
    var $element = $(element);

    if(!$element.length) {
        return $.Deferred().resolve().promise();
    }

    var animation = createAnimation($element, config);

    pushInAnimationQueue($element, animation);
    return animation.deferred.promise();
};

var pushInAnimationQueue = function($element, animation) {
    var queueData = getAnimQueueData($element);
    writeAnimQueueData($element, queueData);
    queueData.push(animation);

    if(!isAnimating($element)) {
        shiftFromAnimationQueue($element, queueData);
    }
};

var getAnimQueueData = function($element) {
    return $element.data(ANIM_QUEUE_KEY) || [];
};

var writeAnimQueueData = function($element, queueData) {
    $element.data(ANIM_QUEUE_KEY, queueData);
};

var destroyAnimQueueData = function($element) {
    $element.removeData(ANIM_QUEUE_KEY);
};

var isAnimating = function($element) {
    return !!$element.data(ANIM_DATA_KEY);
};

var shiftFromAnimationQueue = function($element, queueData) {
    queueData = getAnimQueueData($element);
    if(!queueData.length) {
        return;
    }

    var animation = queueData.shift();
    if(queueData.length === 0) {
        destroyAnimQueueData($element);
    }

    executeAnimation(animation).done(function() {
        if(!isAnimating($element)) {
            shiftFromAnimationQueue($element);
        }
    });
};

var executeAnimation = function(animation) {
    animation.setup();
    if(fx.off || animation.isSynchronous) {
        animation.start();
    } else {
        animation.startTimeout = setTimeout(function() {
            animation.start();
        });
    }

    return animation.deferred.promise();
};

var setupPosition = function($element, config) {
    if(!config || !config.position) {
        return;
    }

    var position = positionUtils.calculate($element, config.position),
        offset = $element.offset(),
        currentPosition = $element.position();

    extend(config, {
        left: position.h.location - offset.left + currentPosition.left,
        top: position.v.location - offset.top + currentPosition.top
    });

    delete config.position;
};

var setProps = function($element, props) {
    $.each(props, function(key, value) {
        try {
            $element.css(key, value);
        } catch(e) { }
    });
};

var stop = function(element, jumpToEnd) {
    var $element = $(element),
        queueData = getAnimQueueData($element);

    //TODO: think about complete all animation in queue
    $.each(queueData, function(_, animation) {
        animation.config.delay = 0;
        animation.config.duration = 0;
        animation.isSynchronous = true;
    });

    if(!isAnimating($element)) {
        shiftFromAnimationQueue($element, queueData);
    }
    var animation = $element.data(ANIM_DATA_KEY);

    if(animation) {
        animation.stop(jumpToEnd);
    }

    $element.removeData(ANIM_DATA_KEY);
    destroyAnimQueueData($element);
};

/**
* @name fx
* @publicName fx
* @section utils
* @module animation/fx
* @export default
*/
var fx = {
    off: false,
    animationTypes: animationConfigurators,
    /**
    * @name fxmethods_animate
    * @publicName animate(element, config)
    * @param1 element:Node
    * @param2 config:animationConfig
    * @return object
    */
    animate: animate,
    createAnimation: createAnimation,
    /**
    * @name fxmethods_isAnimating
    * @publicName isAnimating(element)
    * @param1 element:Node
    * @return boolean
    */
    isAnimating: isAnimating,
    /**
    * @name fxmethods_stop
    * @publicName stop(element, jumpToEnd)
    * @param1 element:Node
    * @param2 jumpToEnd:boolean
    */
    stop: stop,
    _simulatedTransitionEndDelay: 100
};

module.exports = fx;
