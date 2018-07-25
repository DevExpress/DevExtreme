"use strict";

import { animation } from "./ui.drawer.rendering.strategy";

import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";


const PushStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        $(this._drawer.content()).css("paddingLeft", 0);

        const pos = this._getMenuWidth(offset) * this._drawer._getRTLSignCorrection();

        if(animate) {
            animation.moveTo($(this._drawer.content()), pos, this._drawer.option("animationDuration"), () => {
                this._contentAnimation.resolve();
                this._menuAnimation.resolve();
            });
        } else {
            translator.move($(this._drawer.content()), { left: pos });
        }
    }
});

module.exports = PushStrategy;
