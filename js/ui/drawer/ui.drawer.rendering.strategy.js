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
            toConfig["transform"] = "translate(" + position + "px, 0px)";
            animationType = "custom";
        }

        if(direction === "left") {
            toConfig["left"] = position;
            animationType = "slide";
        }

        if(direction === "top" || direction === "bottom") {
            toConfig["top"] = position;
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

    size(config) {
        let $element = config.$element,
            size = config.size,
            direction = config.direction || "left",
            marginTop = config.marginTop || 0,
            duration = config.duration,
            toConfig = {};


        if(direction === "right" || direction === "left") {
            toConfig["width"] = size;
        } else {
            toConfig["height"] = size;
        }

        if(direction === "bottom") {
            toConfig["margin-top"] = marginTop;
        }
        fx.animate($element, {
            to: toConfig,
            duration,
            complete: config.complete
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

    renderPanel(template) {
        template && template.render({
            container: this._drawer.content()
        });
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
        fx.stop(this._drawer._$shader);
        fx.stop($(this._drawer.content()));
        fx.stop($(this._drawer.viewContent()));
    }

    _getPanelOffset(offset) {
        var size = this._drawer._isHorizontalDirection() ? this._drawer.getRealPanelWidth() : this._drawer.getRealPanelHeight();

        if(offset) {
            return -(size - this._drawer.getMaxSize());
        } else {
            return -(size - this._drawer.getMinSize());
        }
    }

    _getPanelSize(offset) {
        return offset ? this._drawer.getMaxSize() : this._drawer.getMinSize();
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

    getPanelContent() {
        return this._drawer._$panel;
    }

    getWidth() {
        return this._drawer.$element().get(0).getBoundingClientRect().width;
    }

    setPanelSize() {
        if(this._drawer._isHorizontalDirection()) {
            $(this._drawer.content()).css("width", this._drawer.getRealPanelWidth());
        } else {
            $(this._drawer.content()).css("height", this._drawer.getRealPanelHeight());
        }
    }

};

module.exports = DrawerStrategy;
module.exports.animation = animation;
