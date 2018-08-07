"use strict";

import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";


const TemporaryStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        const direction = this._drawer.option("menuPosition");
        const menuPosition = this._getMenuOffset(offset);

        $(this._drawer.content()).css("paddingLeft", this._drawer.option("minWidth") * this._drawer._getPositionCorrection());

        if(this._drawer.option("showMode") === "slide") {
            if(animate) {
                let animationConfig = {
                    $element: $(this._drawer._$menu),
                    position: menuPosition,
                    duration: this._drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimation.resolve();
                        this._menuAnimation.resolve();
                    }
                };

                animation.moveTo(animationConfig);
            } else {
                translator.move($(this._drawer._$menu), { left: menuPosition * this._drawer._getPositionCorrection() });
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
