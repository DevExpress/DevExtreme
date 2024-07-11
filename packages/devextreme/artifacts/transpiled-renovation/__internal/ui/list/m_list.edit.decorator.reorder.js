"use strict";

var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _size = require("../../../core/utils/size");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _sortable = _interopRequireDefault(require("../../../ui/sortable"));
var _m_listEdit = _interopRequireDefault(require("./m_list.edit.decorator"));
var _m_listEdit2 = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
const REORDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';
const STATE_HOVER_CLASS = 'dx-state-hover';
(0, _m_listEdit2.register)('reorder', 'default', _m_listEdit.default.inherit({
  _init() {
    const list = this._list;
    this._groupedEnabled = this._list.option('grouped');
    this._lockedDrag = false;
    const filter = this._groupedEnabled ? '> .dx-list-items > .dx-list-group > .dx-list-group-body > .dx-list-item' : '> .dx-list-items > .dx-list-item';
    this._sortable = list._createComponent(list._scrollView.content(), _sortable.default, (0, _extend.extend)({
      component: list,
      contentTemplate: null,
      allowReordering: false,
      filter,
      container: list.$element(),
      dragDirection: list.option('itemDragging.group') ? 'both' : 'vertical',
      handle: `.${REORDER_HANDLE_CLASS}`,
      dragTemplate: this._dragTemplate,
      onDragStart: this._dragStartHandler.bind(this),
      onDragChange: this._dragChangeHandler.bind(this),
      onReorder: this._reorderHandler.bind(this)
    }, list.option('itemDragging')));
  },
  afterRender() {
    this._sortable.update();
  },
  _dragTemplate(e) {
    const result = (0, _renderer.default)(e.itemElement).clone().addClass(REORDERING_ITEM_GHOST_CLASS).addClass(STATE_HOVER_CLASS);
    (0, _size.setWidth)(result, (0, _size.getWidth)(e.itemElement));
    return result;
  },
  _dragStartHandler(e) {
    if (this._lockedDrag) {
      e.cancel = true;
    }
  },
  _dragChangeHandler(e) {
    if (this._groupedEnabled && !this._sameParent(e.fromIndex, e.toIndex)) {
      e.cancel = true;
    }
  },
  _sameParent(fromIndex, toIndex) {
    const $dragging = this._list.getItemElementByFlatIndex(fromIndex);
    const $over = this._list.getItemElementByFlatIndex(toIndex);
    return $over.parent().get(0) === $dragging.parent().get(0);
  },
  _reorderHandler(e) {
    const $targetElement = this._list.getItemElementByFlatIndex(e.toIndex);
    this._list.reorderItem((0, _renderer.default)(e.itemElement), $targetElement);
  },
  afterBag(config) {
    const $handle = (0, _renderer.default)('<div>').addClass(REORDER_HANDLE_CLASS);
    _events_engine.default.on($handle, 'dxpointerdown', e => {
      this._lockedDrag = !(0, _index.isMouseEvent)(e);
    });
    _events_engine.default.on($handle, 'dxhold', {
      timeout: 30
    }, e => {
      e.cancel = true;
      this._lockedDrag = false;
    });
    config.$container.addClass(REORDER_HANDLE_CONTAINER_CLASS).append($handle);
  }
}));