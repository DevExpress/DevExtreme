"use strict";

var $ = require("jquery"),
    translator = require("../../animation/translator"),
    fx = require("../../animation/fx"),
    registerDecorator = require("./ui.list.edit.decorator_registry").register,
    EditDecorator = require("./ui.list.edit.decorator");


registerDecorator(
    "delete",
    "swipe",
    EditDecorator.inherit({

        _shouldHandleSwipe: true,

        _renderItemPosition: function($itemElement, offset, animate) {
            var deferred = $.Deferred(),
                itemOffset = offset * this._itemElementWidth;

            if(animate) {
                fx.animate($itemElement, {
                    to: { left: itemOffset },
                    type: "slide",
                    complete: function() {
                        deferred.resolve($itemElement, offset);
                    }
                });
            } else {
                translator.move($itemElement, { left: itemOffset });
                deferred.resolve();
            }

            return deferred.promise();
        },

        _swipeStartHandler: function($itemElement) {
            this._itemElementWidth = $itemElement.width();
            return true;
        },

        _swipeUpdateHandler: function($itemElement, args) {
            this._renderItemPosition($itemElement, args.offset);
            return true;
        },

        _swipeEndHandler: function($itemElement, args) {
            var offset = args.targetOffset;

            this._renderItemPosition($itemElement, offset, true).done($.proxy(function($itemElement, offset) {
                if(Math.abs(offset)) {
                    this._list.deleteItem($itemElement).fail($.proxy(function() {
                        this._renderItemPosition($itemElement, 0, true);
                    }, this));
                }
            }, this));
            return true;
        }
    })
);
