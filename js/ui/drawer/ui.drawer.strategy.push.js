"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var PushStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        this.callBase(offset, animate);

        $(this._drawer.content()).css("paddingLeft", 0);

        var pos = this._getMenuWidth(offset) * this._drawer._getRTLSignCorrection();

        if(animate) {
            animation.moveTo($(this._drawer.content()), pos, this._drawer.option("animationDuration"), (function() {
                this._contentAnimation.resolve();
                this._menuAnimation.resolve();
            }).bind(this));
        } else {
            translator.move($(this._drawer.content()), { left: pos });
        }
    }
});

module.exports = PushStrategy;
