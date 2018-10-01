import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

class PushStrategy extends DrawerStrategy {
    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const $element = $(this._drawer.viewContent());
        const maxSize = this._getPanelSize(true);

        $(this._drawer.content()).css(this._drawer._isHorizontalDirection() ? "width" : "height", maxSize);

        const contentPosition = this._getPanelSize(offset) * this._drawer._getPositionCorrection();

        if(animate) {
            let animationConfig = {
                $element: $element,
                position: contentPosition,
                direction: this._drawer.option("position"),
                duration: this._drawer.option("animationDuration"),
                complete: () => {
                    this._contentAnimationResolve();
                    this._panelAnimationResolve();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            if(this._drawer._isHorizontalDirection()) {
                translator.move($element, { left: contentPosition });
            } else {
                translator.move($element, { top: contentPosition });
            }
        }
    }
};

module.exports = PushStrategy;
