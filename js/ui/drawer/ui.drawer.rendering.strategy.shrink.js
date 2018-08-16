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
            const width = this._getPanelWidth(offset);

            if(animate) {
                animation.width($(this._drawer._$panel), width, this._drawer.option("animationDuration"), () => {
                    this._panelAnimationResolve();
                });
            } else {
                $(this._drawer._$panel).css("width", width);
            }
        }
    }
};

module.exports = ShrinkStrategy;
