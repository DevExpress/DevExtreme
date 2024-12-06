import eventsEngine from '@js/common/core/events/core/events_engine';
import { isMouseEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getWidth, setWidth } from '@js/core/utils/size';
import Sortable from '@js/ui/sortable';

import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
const REORDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';
const STATE_HOVER_CLASS = 'dx-state-hover';

registerDecorator(
  'reorder',
  'default',
  EditDecorator.inherit({

    _init() {
      const list = this._list;

      this._groupedEnabled = this._list.option('grouped');

      this._lockedDrag = false;

      const filter = this._groupedEnabled
        ? '> .dx-list-items > .dx-list-group > .dx-list-group-body > .dx-list-item'
        : '> .dx-list-items > .dx-list-item';

      this._sortable = list._createComponent(list._scrollView.content(), Sortable, extend({
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
        onReorder: this._reorderHandler.bind(this),
      }, list.option('itemDragging')));
    },

    afterRender() {
      this._sortable.update();
    },

    _dragTemplate(e) {
      const result = $(e.itemElement)
        .clone()
        .addClass(REORDERING_ITEM_GHOST_CLASS)
        .addClass(STATE_HOVER_CLASS);
      setWidth(result, getWidth(e.itemElement));
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
      this._list.reorderItem($(e.itemElement), $targetElement);
    },

    afterBag(config) {
      const $handle = $('<div>').addClass(REORDER_HANDLE_CLASS);

      eventsEngine.on($handle, 'dxpointerdown', (e) => {
        this._lockedDrag = !isMouseEvent(e);
      });
      eventsEngine.on($handle, 'dxhold', { timeout: 30 }, (e) => {
        e.cancel = true;
        this._lockedDrag = false;
      });

      config.$container
        .addClass(REORDER_HANDLE_CONTAINER_CLASS)
        .append($handle);
    },
  }),
);
