"use strict";

var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _translator = require("../../../animation/translator");
var _deferred = require("../../../core/utils/deferred");
var _size = require("../../../core/utils/size");
var _m_listEdit = _interopRequireDefault(require("./m_list.edit.decorator"));
var _m_listEdit2 = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _m_listEdit2.register)('delete', 'swipe', _m_listEdit.default.inherit({
  _shouldHandleSwipe: true,
  _renderItemPosition($itemElement, offset, animate) {
    const deferred = (0, _deferred.Deferred)();
    const itemOffset = offset * this._itemElementWidth;
    if (animate) {
      _fx.default.animate($itemElement, {
        to: {
          left: itemOffset
        },
        type: 'slide',
        complete() {
          deferred.resolve($itemElement, offset);
        }
      });
    } else {
      (0, _translator.move)($itemElement, {
        left: itemOffset
      });
      deferred.resolve();
    }
    return deferred.promise();
  },
  _swipeStartHandler($itemElement) {
    this._itemElementWidth = (0, _size.getWidth)($itemElement);
    return true;
  },
  _swipeUpdateHandler($itemElement, args) {
    this._renderItemPosition($itemElement, args.offset);
    return true;
  },
  _swipeEndHandler($itemElement, args) {
    const offset = args.targetOffset;
    this._renderItemPosition($itemElement, offset, true).done(($itemElement, offset) => {
      if (Math.abs(offset)) {
        this._list.deleteItem($itemElement).fail(() => {
          this._renderItemPosition($itemElement, 0, true);
        });
      }
    });
    return true;
  }
}));