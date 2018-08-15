import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";

const ShrinkStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        const direction = this._drawer.option("position");

        if(this._drawer.option("revealMode") === "slide") {
            const menuPos = this._getMenuOffset(offset);
            if(animate) {

                let animationConfig = {
                    $element: $(this._drawer._$menu),
                    margin: menuPos,
                    duration: this._drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._menuAnimationResolve();
                    }
                };
                animation.margin(animationConfig);
            } else {
                if(direction === "left") {
                    $(this._drawer._$menu).css("marginLeft", menuPos);
                }
                if(direction === "right") {
                    $(this._drawer._$menu).css("marginRight", menuPos);
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const width = this._getMenuWidth(offset);

            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), () => {
                    this._menuAnimationResolve();
                });
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = ShrinkStrategy;
