import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

const PushStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        $(this._drawer.viewContent()).css("paddingLeft", 0);

        const contentPosition = this._getMenuWidth(offset) * this._drawer._getPositionCorrection();

        if(animate) {
            let animationConfig = {
                $element: $(this._drawer.viewContent()),
                position: contentPosition,
                duration: this._drawer.option("animationDuration"),
                complete: () => {
                    this._contentAnimationResolve();
                    this._menuAnimationResolve();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            translator.move($(this._drawer.viewContent()), { left: contentPosition });
        }
    }
});

module.exports = PushStrategy;
