import $ from "../../core/renderer";
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
            toConfig["transform"] = " translate(0, 0)";
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
    margin(config) {
        let $element = config.$element,
            margin = config.margin,
            direction = config.direction || "left",
            toConfig = {};

        if(direction === "left") {
            toConfig["marginLeft"] = margin;
        } else {
            toConfig["marginRight"] = margin;
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

class DrawerStrategy {

    constructor(drawer) {
        this._drawer = drawer;
    }

    renderPosition(offset, animate) {
        this._stopAnimations();

        this._drawer._animations.push(new Promise((resolve) => {
            this._contentAnimationResolve = resolve;
        }));
        this._drawer._animations.push(new Promise((resolve) => {
            this._panelAnimationResolve = resolve;
        }));
        this._drawer._animations.push(new Promise((resolve) => {
            this._shaderAnimationResolve = resolve;
        }));

        if(animate) {
            Promise.all(this._drawer._animations).then(() => {
                this._drawer._animationCompleteHandler();
            });
        }
    }

    _stopAnimations() {
        fx.stop(this._drawer._$shader, true);
        fx.stop($(this._drawer.content()), true);
        fx.stop($(this._drawer.viewContent()), true);
    }

    _getPanelOffset(offset) {
        if(offset) {
            return -(this._drawer.getRealPanelWidth() - this._drawer.getMaxWidth());
        } else {
            return -(this._drawer.getRealPanelWidth() - this._drawer.getMinWidth());
        }
    }

    _getPanelWidth(offset) {
        return offset ? this._drawer.getMaxWidth() : this._drawer.getMinWidth();
    }

    renderShaderVisibility(offset, animate, duration) {
        const fadeConfig = this._getFadeConfig(offset);

        if(animate) {
            animation.fade($(this._drawer._$shader), fadeConfig, duration, () => {
                this._shaderAnimationResolve();
            });
        } else {
            this._drawer._$shader.css("opacity", fadeConfig.to);
        }
    }

    getWidth() {
        return this._drawer.$element().get(0).getBoundingClientRect().width;
    }
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
    }
};

module.exports = DrawerStrategy;
module.exports.animation = animation;
