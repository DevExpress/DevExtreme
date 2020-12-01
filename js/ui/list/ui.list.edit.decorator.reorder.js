import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { extend } from '../../core/utils/extend';
import { isMouseEvent } from '../../events/utils/index';
import { register as registerDecorator } from './ui.list.edit.decorator_registry';
import EditDecorator from './ui.list.edit.decorator';
import Sortable from '../sortable';

const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
const REORDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';
const STATE_HOVER_CLASS = 'dx-state-hover';

registerDecorator(
    'reorder',
    'default',
    EditDecorator.inherit({

        _init: function() {
            const list = this._list;

            this._groupedEnabled = this._list.option('grouped');

            this._lockedDrag = false;

            const filter = this._groupedEnabled ?
                '> .dx-list-group > .dx-list-group-body > .dx-list-item' :
                '> .dx-list-item';

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
                onReorder: this._reorderHandler.bind(this)
            }, list.option('itemDragging')));
        },

        afterRender: function() {
            this._sortable.update();
        },

        _dragTemplate: function(e) {
            return $(e.itemElement)
                .clone()
                .width($(e.itemElement).width())
                .addClass(REORDERING_ITEM_GHOST_CLASS)
                .addClass(STATE_HOVER_CLASS);
        },

        _dragStartHandler: function(e) {
            if(this._lockedDrag) {
                e.cancel = true;
                return;
            }
        },

        _dragChangeHandler: function(e) {
            if(this._groupedEnabled && !this._sameParent(e.fromIndex, e.toIndex)) {
                e.cancel = true;
                return;
            }
        },

        _sameParent: function(fromIndex, toIndex) {
            const $dragging = this._list.getItemElementByFlatIndex(fromIndex);
            const $over = this._list.getItemElementByFlatIndex(toIndex);

            return $over.parent().get(0) === $dragging.parent().get(0);
        },

        _reorderHandler: function(e) {
            const $targetElement = this._list.getItemElementByFlatIndex(e.toIndex);
            this._list.reorderItem($(e.itemElement), $targetElement);
        },

        afterBag: function(config) {
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
        }
    })
);
