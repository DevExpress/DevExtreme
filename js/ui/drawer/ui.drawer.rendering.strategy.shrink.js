import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";

class ShrinkStrategy extends DrawerStrategy {
    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const direction = this._drawer.option("position");

        if(this._drawer.option("revealMode") === "slide") {
            const panelPos = this._getPanelOffset(offset);
            if(animate) {

                let animationConfig = {
                    $element: $(this._drawer._$panel),
                    margin: panelPos,
                    duration: this._drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };
                animation.margin(animationConfig);
            } else {
                if(direction === "left") {
                    $(this._drawer._$panel).css("marginLeft", panelPos);
                }
                if(direction === "right") {
                    $(this._drawer._$panel).css("marginRight", panelPos);
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const $element = $(this._drawer._$panel);
            const size = this._getPanelSize(offset);

            let animationConfig = {
                $element: $element,
                size: size,
                duration: this._drawer.option("animationDuration"),
                direction: this._drawer.option("position"),
                complete: () => {
                    this._panelAnimationResolve();
                }
            };

            if(animate) {
                animation.size(animationConfig);
            } else {
                $element.css("width", size);
            }
        }
    }
};

module.exports = ShrinkStrategy;
