import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { isMouseEvent } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getWidth, setWidth } from '@js/core/utils/size';
import type { Cancelable, DxEvent } from '@js/events';
import type { ItemHoldEvent } from '@js/ui/list';
import type {
  DragChangeEvent,
  DragStartEvent,
  DragTemplateData,
  ReorderEvent,
} from '@js/ui/sortable';
import Sortable from '@ts/m_sortable';

import type { BagConfig } from './m_list.edit.decorator';
import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
const REORDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';
const STATE_HOVER_CLASS = 'dx-state-hover';

class EditDecoratorReorder extends EditDecorator {
  _lockedDrag?: boolean;

  _groupedEnabled?: boolean;

  _sortable!: Sortable;

  _init(): void {
    const list = this._list;

    const { grouped, itemDragging } = this._list.option();

    this._groupedEnabled = grouped;

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
      dragDirection: itemDragging?.group ? 'both' : 'vertical',
      handle: `.${REORDER_HANDLE_CLASS}`,
      dragTemplate: this._dragTemplate,
      onDragStart: this._dragStartHandler.bind(this),
      onDragChange: this._dragChangeHandler.bind(this),
      onReorder: this._reorderHandler.bind(this),
    }, itemDragging));
  }

  afterRender(): void {
    this._sortable.update();
  }

  // eslint-disable-next-line class-methods-use-this
  _dragTemplate(e: DragTemplateData): dxElementWrapper {
    const result = $(e.itemElement)
      .clone()
      .addClass(REORDERING_ITEM_GHOST_CLASS)
      .addClass(STATE_HOVER_CLASS);
    setWidth(result, getWidth(e.itemElement));
    return result;
  }

  _dragStartHandler(e: DragStartEvent): void {
    if (this._lockedDrag) {
      e.cancel = true;
    }
  }

  _dragChangeHandler(e: DragChangeEvent): void {
    if (
      this._groupedEnabled
      && e.fromIndex
      && e.toIndex
      && !this._sameParent(e.fromIndex, e.toIndex)
    ) {
      e.cancel = true;
    }
  }

  _sameParent(fromIndex: number, toIndex: number): boolean {
    const $dragging = this._list.getItemElementByFlatIndex(fromIndex);
    const $over = this._list.getItemElementByFlatIndex(toIndex);

    return $over.parent().get(0) === $dragging.parent().get(0);
  }

  _reorderHandler(e: ReorderEvent): void {
    const $targetElement = this._list.getItemElementByFlatIndex(e.toIndex);
    this._list.reorderItem(e.itemElement, $targetElement.get(0));
  }

  afterBag(config?: BagConfig): void {
    const $handle = $('<div>').addClass(REORDER_HANDLE_CLASS);

    eventsEngine.on(
      $handle,
      pointerEvents.down,
      (e: DxEvent<PointerEvent | MouseEvent | TouchEvent>): void => {
        this._lockedDrag = !isMouseEvent(e);
      },
    );
    eventsEngine.on(
      $handle,
      holdEvent.name,
      { timeout: 30 },
      (e: ItemHoldEvent & Cancelable): void => {
        e.cancel = true;
        this._lockedDrag = false;
      },
    );

    config?.$container?.addClass(REORDER_HANDLE_CONTAINER_CLASS)
      .append($handle);
  }
}

registerDecorator(
  'reorder',
  'default',
  EditDecoratorReorder,
);
