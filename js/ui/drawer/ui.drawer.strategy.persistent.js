"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator"),
    Deferred = require("../../core/utils/deferred").Deferred,
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when;


var PersistentStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        var animations = [];

        var contentAnimation = new Deferred(),
            menuAnimation = new Deferred();

        var width = this._getMenuWidth(offset);

        translator.move($(this._drawer.content()), { left: 0 });

        if(animate) {
            animations.push(contentAnimation);

            animation.paddingLeft($(this._drawer.content()), width, this._drawer.option("animationDuration"), function() {
                contentAnimation.resolve();
            });
        } else {
            $(this._drawer.content()).css("paddingLeft", width);
        }

        if(this._drawer.option("showMode") === "slide") {
            var menuPos = this._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();
            if(animate) {
                animations.push(menuAnimation);

                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), function() {
                    menuAnimation.resolve();
                });
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), function() {
                    menuAnimation.resolve();
                });
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }

        when.apply($, animations).done((function() {
            this._animationCompleteHandler();
        }).bind(this._drawer));
    }
});

module.exports = PersistentStrategy;
