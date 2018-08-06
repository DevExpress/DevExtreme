"use strict";

import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";

const PersistentStrategy = DrawerStrategy.inherit({
    renderPosition(offset, animate) {
        this.callBase(offset, animate);

        const width = this._getMenuWidth(offset),
            direction = this._drawer.option("menuPosition");

        translator.move($(this._drawer.content()), { left: 0 });

        if(animate) {
            animation.padding($(this._drawer.content()), width, this._drawer.option("animationDuration"), direction, () => {
                this._contentAnimation.resolve();
            });
        } else {
            if(direction === "left") {
                $(this._drawer.content()).css("paddingLeft", width);
            } else {
                $(this._drawer.content()).css("paddingRight", width);
            }
        }

        if(this._drawer.option("showMode") === "slide") {
            const menuPos = this._getMenuOffset(offset);
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), direction, () => {
                    this._menuAnimation.resolve();
                });
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos * this._drawer._getRTLSignCorrection() });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), () => {
                    this._menuAnimation.resolve();
                });
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = PersistentStrategy;
