"use strict";

var Class = require("../../core/class"),
    Deferred = require("../../core/utils/deferred").Deferred,
    deferredUtils = require("../../core/utils/deferred"),
    $ = require("../../core/renderer"),
    when = deferredUtils.when,
    fx = require("../../animation/fx");


var animation = {
    moveTo: function($element, position, duration, completeAction) {
        fx.animate($element, {
            type: "slide",
            to: { left: position },
            duration: duration,
            complete: completeAction
        });
    },
    paddingLeft: function($element, padding, duration, completeAction) {
        var toConfig = {};

        toConfig["padding-left"] = padding;

        fx.animate($element, {
            to: { paddingLeft: padding },
            duration: duration,
            complete: completeAction
        });
    },

    fade: function($element, config, duration, completeAction) {
        fx.animate($element, {
            type: "fade",
            to: config.to,
            from: config.from,
            duration: duration,
            complete: completeAction
        });
    },

    width: function($element, width, duration, completeAction) {
        var toConfig = {};

        toConfig["width"] = width;

        fx.animate($element, {
            to: toConfig,
            duration: duration,
            complete: completeAction
        });
    },

    complete: function($element) {
        fx.stop($element, true);
    }
};

var DrawerStrategy = Class.inherit({

    ctor: function(drawer) {
        this._drawer = drawer;
    },

    renderPosition: function(offset, animate) {
        this._contentAnimation = new Deferred(),
        this._menuAnimation = new Deferred();
        this._shaderAnimation = new Deferred();

        if(animate) {
            this._drawer._animations.push(this._contentAnimation);
            this._drawer._animations.push(this._menuAnimation);
            this._drawer._animations.push(this._shaderAnimation);

            when.apply($, this._drawer._animations).done((function() {
                this._animationCompleteHandler();
            }).bind(this._drawer));
        }
    },

    _getMenuOffset: function(offset) {
        if(offset) {
            return -(this._drawer.getRealMenuWidth() - this._drawer.getMaxWidth());
        } else {
            return -(this._drawer.getRealMenuWidth() - this._drawer.getMinWidth());
        }
    },

    _getMenuWidth: function(offset) {
        return offset ? this._drawer.getMaxWidth() : this._drawer.getMinWidth();
    },

    renderShaderVisibility: function(offset, animate, duration) {
        var fadeConfig = this._getFadeConfig(offset);

        if(animate) {
            animation.fade($(this._drawer._$shader), fadeConfig, duration, (function() {
                this._shaderAnimation.resolve();
            }).bind(this));
        } else {
            this._drawer._$shader.css("opacity", fadeConfig.to);
        }
    },

    _getFadeConfig: function(offset) {
        if(offset) {
            return {
                to: 0.5,
                from: 0
            };
        } else {
            return {
                to: 0,
                from: 0.5
            };
        }
    },
});


module.exports = DrawerStrategy;
module.exports.animation = animation;
