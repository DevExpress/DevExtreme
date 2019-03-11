import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { camelize } from "../../core/utils/inflector";

class ShrinkStrategy extends DrawerStrategy {

    slidePositionRendering(config, offset, animate) {
        const panelOffset = this._getPanelOffset(offset);
        if(animate) {

            let animationConfig = extend(config.defaultAnimationConfig, {
                $element: config.$panel,
                margin: panelOffset,
                duration: config.drawer.option("animationDuration"),
                direction: config.direction
            });
            animation.margin(animationConfig);
        } else {
            config.$panel.css("margin" + camelize(config.direction, true), panelOffset);
        }
    }

    expandPositionRendering(config, offset, animate) {
        const size = this._getPanelSize(offset);

        let animationConfig = extend(config.defaultAnimationConfig, {
            $element: config.$panel,
            size: size,
            duration: config.drawer.option("animationDuration"),
            direction: config.direction
        });

        if(animate) {
            animation.size(animationConfig);
        } else {
            if(config.drawer.isHorizontalDirection()) {
                $(config.$panel).css("width", size);
            } else {
                $(config.$panel).css("height", size);
            }
        }
    }

    needOrderContent(position, isRtl) {
        return (isRtl ? position === "left" : position === "right") || position === "bottom";
    }
}

module.exports = ShrinkStrategy;
