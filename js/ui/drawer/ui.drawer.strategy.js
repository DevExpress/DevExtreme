"use strict";

var Class = require("../../core/class"),
    abstract = Class.abstract,
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

    renderPosition: abstract
});


module.exports = DrawerStrategy;
module.exports.animation = animation;
