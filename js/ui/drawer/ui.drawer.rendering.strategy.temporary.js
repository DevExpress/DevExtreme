"use strict";

import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";


const TemporaryStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        const direction = this._drawer.option("menuPosition");

        const menuPos = this._getMenuOffset(offset);

        $(this._drawer.content()).css("paddingLeft", this._drawer.option("minWidth") * this._drawer._getRTLSignCorrection());

        if(this._drawer.option("showMode") === "slide") {
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), direction, () => {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                });
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos * this._drawer._getRTLSignCorrection() });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            const width = this._getMenuWidth(offset);
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), () => {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                });
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = TemporaryStrategy;
