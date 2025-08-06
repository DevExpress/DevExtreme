import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { isMouseEvent } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth, setWidth } from '@js/core/utils/size';
import type { Cancelable, DxEvent } from '@js/events';
import type {
  DragChangeEvent,
  DragStartEvent,
  DragTemplateData,
  ReorderEvent,
} from '@js/ui/sortable';
import { isDefined } from '@ts/core/utils/m_type';
import Sortable from '@ts/m_sortable';
import type { BagConfig } from '@ts/ui/list/list.edit.decorator';
import EditDecorator from '@ts/ui/list/list.edit.decorator';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';

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

    this._sortable = list._createComponent(list._scrollView.content(), Sortable, {
      component: list,
      contentTemplate: null,
      allowReordering: false,
      filter,
      container: list.$element().get(0),
      dragDirection: itemDragging?.group ? 'both' : 'vertical',
      handle: `.${REORDER_HANDLE_CLASS}`,
      dragTemplate: this._dragTemplate,
      // @ts-expect-error ts-error
      onDragStart: (e: DragStartEvent): void => {
        this._dragStartHandler(e);
      },
      onDragChange: (e: DragChangeEvent): void => {
        this._dragChangeHandler(e);
      },
      onReorder: (e: ReorderEvent): void => {
        this._reorderHandler(e);
      },
      ...itemDragging,
    });
  }

  afterRender(): void {
    this._sortable.update();
  }

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
      && isDefined(e.fromIndex)
      && isDefined(e.toIndex)
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
    this._list.reorderItem($(e.itemElement), $targetElement);
  }

  afterBag(config: BagConfig): void {
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
      (e: DxEvent<PointerEvent | MouseEvent | TouchEvent> & Cancelable): void => {
        e.cancel = true;
        this._lockedDrag = false;
      },
    );

    config.$container
      .addClass(REORDER_HANDLE_CONTAINER_CLASS)
      .append($handle);
  }
}

registerDecorator(
  'reorder',
  'default',
  EditDecoratorReorder,
);
