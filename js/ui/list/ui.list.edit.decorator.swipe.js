const translator = require('../../animation/translator');
const fx = require('../../animation/fx');
const registerDecorator = require('./ui.list.edit.decorator_registry').register;
const EditDecorator = require('./ui.list.edit.decorator');
const Deferred = require('../../core/utils/deferred').Deferred;


registerDecorator(
    'delete',
    'swipe',
    EditDecorator.inherit({

        _shouldHandleSwipe: true,

        _renderItemPosition: function($itemElement, offset, animate) {
            const deferred = new Deferred();
            const itemOffset = offset * this._itemElementWidth;

            if(animate) {
                fx.animate($itemElement, {
                    to: { left: itemOffset },
                    type: 'slide',
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
            const offset = args.targetOffset;

            this._renderItemPosition($itemElement, offset, true).done((function($itemElement, offset) {
                if(Math.abs(offset)) {
                    this._list.deleteItem($itemElement).fail((function() {
                        this._renderItemPosition($itemElement, 0, true);
                    }).bind(this));
                }
            }).bind(this));
            return true;
        }
    })
);
