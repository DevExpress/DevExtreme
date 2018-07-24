"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var PushStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        $(this._drawer.content()).css("paddingLeft", 0);

        var pos = this._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();

        if(animate) {
            animation.moveTo($(this._drawer.content()), pos, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
        } else {
            translator.move($(this._drawer.content()), { left: pos });
        }
    },

    _calculatePixelOffset: function(offset) {
        return this._getMenuWidth(offset);
    },
});

module.exports = PushStrategy;
