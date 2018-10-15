import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";

class ShrinkStrategy extends DrawerStrategy {
    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const drawer = this.getDrawerInstance();
        const direction = drawer.getDrawerPosition();
        const $panel = $(drawer.content());

        if(drawer.option("revealMode") === "slide") {
            const panelOffset = this._getPanelOffset(offset);
            if(animate) {

                let animationConfig = {
                    $element: $panel,
                    margin: panelOffset,
                    duration: drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };
                animation.margin(animationConfig);
            } else {
                $panel.css("margin" + direction.charAt(0).toUpperCase() + direction.substr(1), panelOffset);
            }
        }

        if(drawer.option("revealMode") === "expand") {
            const size = this._getPanelSize(offset);

            let animationConfig = {
                $element: $panel,
                size: size,
                duration: drawer.option("animationDuration"),
                direction: direction,
                complete: () => {
                    this._panelAnimationResolve();
                }
            };

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
};

module.exports = ShrinkStrategy;
