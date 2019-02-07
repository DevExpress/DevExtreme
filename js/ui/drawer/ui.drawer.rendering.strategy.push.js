import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

class PushStrategy extends DrawerStrategy {
    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const drawer = this.getDrawerInstance();
        const $content = $(drawer.viewContent());
        const maxSize = this._getPanelSize(true);

        $(drawer.content()).css(drawer.isHorizontalDirection() ? "width" : "height", maxSize);

        const contentPosition = this._getPanelSize(offset) * drawer._getPositionCorrection();

        if(animate) {
            let animationConfig = {
                $element: $content,
                position: contentPosition,
                direction: drawer.getDrawerPosition(),
                duration: drawer.option("animationDuration"),
                complete: () => {
                    this._elementsAnimationCompleteHandler();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                translator.move($content, { left: contentPosition });
            } else {
                translator.move($content, { top: contentPosition });
            }
        }
    }
}

module.exports = PushStrategy;
