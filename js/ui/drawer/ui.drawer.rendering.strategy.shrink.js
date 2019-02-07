import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { camelize } from "../../core/utils/inflector";

class ShrinkStrategy extends DrawerStrategy {
    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const drawer = this.getDrawerInstance();
        const direction = drawer.getDrawerPosition();
        const $panel = $(drawer.content());
        const defaultAnimationConfig = this._defaultAnimationConfig();

        if(drawer.option("revealMode") === "slide") {
            const panelOffset = this._getPanelOffset(offset);
            if(animate) {

                let animationConfig = extend(defaultAnimationConfig, {
                    $element: $panel,
                    margin: panelOffset,
                    duration: drawer.option("animationDuration"),
                    direction: direction
                });
                animation.margin(animationConfig);
            } else {
                $panel.css("margin" + camelize(direction, true), panelOffset);
            }
        }

        if(drawer.option("revealMode") === "expand") {
            const size = this._getPanelSize(offset);

            let animationConfig = extend(defaultAnimationConfig, {
                $element: $panel,
                size: size,
                duration: drawer.option("animationDuration"),
                direction: direction
            });

            if(animate) {
                animation.size(animationConfig);
            } else {
                if(drawer.isHorizontalDirection()) {
                    $($panel).css("width", size);
                } else {
                    $($panel).css("height", size);
                }
            }
        }
    }

    needOrderContent(position, isRtl) {
        return (isRtl ? position === "left" : position === "right") || position === "bottom";
    }
}

module.exports = ShrinkStrategy;
