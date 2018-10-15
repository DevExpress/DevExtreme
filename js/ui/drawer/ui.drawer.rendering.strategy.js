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

        toConfig["margin" + direction.charAt(0).toUpperCase() + direction.substr(1)] = margin;

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
            toConfig["marginTop"] = marginTop;
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

    getDrawerInstance() {
        return this._drawer;
    }

    renderPanel(template) {
        template && template.render({
            container: this.getDrawerInstance().content()
        });
    }

    renderPosition(offset, animate) {
        this.getDrawerInstance().stopAnimations();

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

    _getPanelOffset(offset) {
        const drawer = this.getDrawerInstance();
        const size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();

        if(offset) {
            return -(size - drawer.getMaxSize());
        } else {
            return -(size - drawer.getMinSize());
        }
    }

    _getPanelSize(offset) {
        return offset ? this.getDrawerInstance().getMaxSize() : this.getDrawerInstance().getMinSize();
    }

    renderShaderVisibility(offset, animate, duration) {
        const fadeConfig = this._getFadeConfig(offset);
        const drawer = this.getDrawerInstance();

        if(animate) {
            animation.fade($(drawer._$shader), fadeConfig, duration, () => {
                this._drawer._toggleShaderVisibility(offset);
                this._shaderAnimationResolve();
            });
        } else {
            drawer._toggleShaderVisibility(offset);
            drawer._$shader.css("opacity", fadeConfig.to);
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
        return $(this.getDrawerInstance().content());
    }

    getWidth() {
        return this.getDrawerInstance().$element().get(0).getBoundingClientRect().width;
    }

    setPanelSize(keepMaxSize) {
        const drawer = this.getDrawerInstance();
        const panelSize = this._getPanelSize(drawer.option("opened"));


        if(drawer.isHorizontalDirection()) {
            $(drawer.content()).css("width", keepMaxSize ? drawer.getRealPanelWidth() : panelSize);
        } else {
            $(drawer.content()).css("height", keepMaxSize ? drawer.getRealPanelHeight() : panelSize);
        }
    }

};

module.exports = DrawerStrategy;
module.exports.animation = animation;
