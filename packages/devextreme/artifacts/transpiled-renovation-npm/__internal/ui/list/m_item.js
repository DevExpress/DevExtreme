"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _m_item = _interopRequireDefault(require("../../ui/collection/m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LIST_ITEM_BADGE_CONTAINER_CLASS = 'dx-list-item-badge-container';
const LIST_ITEM_BADGE_CLASS = 'dx-list-item-badge';
const BADGE_CLASS = 'dx-badge';
const LIST_ITEM_CHEVRON_CONTAINER_CLASS = 'dx-list-item-chevron-container';
const LIST_ITEM_CHEVRON_CLASS = 'dx-list-item-chevron';
const ListItem = _m_item.default.inherit({
  _renderWatchers() {
    this.callBase();
    this._startWatcher('badge', this._renderBadge.bind(this));
    this._startWatcher('showChevron', this._renderShowChevron.bind(this));
  },
  _renderBadge(badge) {
    this._$element.children(`.${LIST_ITEM_BADGE_CONTAINER_CLASS}`).remove();
    if (!badge) {
      return;
    }
    const $badge = (0, _renderer.default)('<div>').addClass(LIST_ITEM_BADGE_CONTAINER_CLASS).append((0, _renderer.default)('<div>').addClass(LIST_ITEM_BADGE_CLASS).addClass(BADGE_CLASS).text(badge));
    const $chevron = this._$element.children(`.${LIST_ITEM_CHEVRON_CONTAINER_CLASS}`).first();
    $chevron.length > 0 ? $badge.insertBefore($chevron) : $badge.appendTo(this._$element);
  },
  _renderShowChevron(showChevron) {
    this._$element.children(`.${LIST_ITEM_CHEVRON_CONTAINER_CLASS}`).remove();
    if (!showChevron) {
      return;
    }
    const $chevronContainer = (0, _renderer.default)('<div>').addClass(LIST_ITEM_CHEVRON_CONTAINER_CLASS);
    const $chevron = (0, _renderer.default)('<div>').addClass(LIST_ITEM_CHEVRON_CLASS);
    $chevronContainer.append($chevron).appendTo(this._$element);
  }
});
var _default = exports.default = ListItem;