"use strict";

import Class from "../../core/class";
import { Deferred } from "../../core/utils/deferred";
import deferredUtils from "../../core/utils/deferred";
import $ from "../../core/renderer";
const when = deferredUtils.when;
import fx from "../../animation/fx";

const animation = {
    moveTo(config) {
        let $element = config.$element,
            position = config.position,
            direction = config.direction || "left",
            toConfig = {},
            animationType;

        if(direction === "right") {
            toConfig["right"] = position;
            toConfig["transform"] = " translate(" + 0 + ", 0)";
            animationType = "custom";
        } else {
            toConfig["left"] = position;
            animationType = "slide";
        }
        fx.animate($element, {
            type: animationType,
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },
    padding(config) {
        let $element = config.$element,
            padding = config.padding,
            direction = config.direction || "left",
            toConfig = {};

        if(direction === "left") {
            toConfig["paddingLeft"] = padding;
        } else {
            toConfig["paddingRight"] = padding;
        }

        fx.animate($element, {
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },

    fade($element, config, duration, completeAction) {
        fx.animate($element, {
            type: "fade",
            to: config.to,
            from: config.from,
            duration,
            complete: completeAction
        });
    },

    width($element, width, duration, completeAction) {
        const toConfig = {};

        toConfig["width"] = width;

        fx.animate($element, {
            to: toConfig,
            duration,
            complete: completeAction
        });
    },

    complete($element) {
        fx.stop($element, true);
    }
};

const DrawerStrategy = Class.inherit({

    ctor(drawer) {
        this._drawer = drawer;
    },

    renderPosition(offset, animate) {
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

    _getMenuOffset(offset) {
        if(offset) {
            return -(this._drawer.getRealMenuWidth() - this._drawer.getMaxWidth());
        } else {
            return -(this._drawer.getRealMenuWidth() - this._drawer.getMinWidth());
        }
    },

    _getMenuWidth(offset) {
        return offset ? this._drawer.getMaxWidth() : this._drawer.getMinWidth();
    },

    renderShaderVisibility(offset, animate, duration) {
        const fadeConfig = this._getFadeConfig(offset);

        if(animate) {
            animation.fade($(this._drawer._$shader), fadeConfig, duration, () => {
                this._shaderAnimation.resolve();
            });
        } else {
            this._drawer._$shader.css("opacity", fadeConfig.to);
        }
    },

    getWidth() {
        return this._drawer.$element().get(0).getBoundingClientRect().width;
    },
    _getFadeConfig(offset) {
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
