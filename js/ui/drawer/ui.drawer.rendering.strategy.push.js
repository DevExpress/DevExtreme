"use strict";

import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

const PushStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        $(this._drawer.content()).css("paddingLeft", 0);

        const contentPosition = this._getMenuWidth(offset) * this._drawer._getRTLSignCorrection();

        if(animate) {
            let animationConfig = {
                $element: $(this._drawer.content()),
                position: contentPosition,
                duration: this._drawer.option("animationDuration"),
                complete: () => {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            translator.move($(this._drawer.content()), { left: contentPosition });
        }
    }
});

module.exports = PushStrategy;
