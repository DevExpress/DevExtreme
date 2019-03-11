import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

class PushStrategy extends DrawerStrategy {
    useDefaultAnimation() {
        return true;
    }

    defaultPositionRendering(config, offset, animate) {
        const maxSize = this._getPanelSize(true);
        $(config.drawer.content()).css(config.drawer.isHorizontalDirection() ? "width" : "height", maxSize);

        const contentPosition = this._getPanelSize(offset) * config.drawer._getPositionCorrection();

        if(animate) {
            let animationConfig = {
                $element: config.$content,
                position: contentPosition,
                direction: config.drawer.getDrawerPosition(),
                duration: config.drawer.option("animationDuration"),
                complete: () => {
                    this._elementsAnimationCompleteHandler();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            if(config.drawer.isHorizontalDirection()) {
                translator.move(config.$content, { left: contentPosition });
            } else {
                translator.move(config.$content, { top: contentPosition });
            }
        }
    }
}

module.exports = PushStrategy;
