"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _m_item = _interopRequireDefault(require("../../ui/collection/m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
const BADGE_CLASS = 'dx-badge';
const TabsItem = _m_item.default.inherit({
  _renderWatchers() {
    this.callBase();
    this._startWatcher('badge', this._renderBadge.bind(this));
  },
  _renderBadge(badge) {
    this._$element.children(`.${BADGE_CLASS}`).remove();
    if (!badge) {
      return;
    }
    const $badge = (0, _renderer.default)('<div>').addClass(TABS_ITEM_BADGE_CLASS).addClass(BADGE_CLASS).text(badge);
    this._$element.append($badge);
  }
});
var _default = exports.default = TabsItem;