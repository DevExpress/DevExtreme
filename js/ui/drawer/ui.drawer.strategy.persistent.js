"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var PersistentStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        var width = this._getMenuWidth(offset);

        translator.move($(this._drawer.content()), { left: 0 });

        if(animate) {
            animation.paddingLeft($(this._drawer.content()), width, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
        } else {
            $(this._drawer.content()).css("paddingLeft", width);
        }

        if(this._drawer.option("showMode") === "slide") {
            var menuPos = this._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = PersistentStrategy;
