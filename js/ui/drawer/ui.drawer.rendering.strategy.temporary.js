"use strict";

import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";


const TemporaryStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        const menuPos = this._getMenuOffset(offset) * this._drawer._getRTLSignCorrection();

        $(this._drawer.content()).css("paddingLeft", this._drawer.option("minWidth"));

        if(this._drawer.option("showMode") === "slide") {
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), () => {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                });
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
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
