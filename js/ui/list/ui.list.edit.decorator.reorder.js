const $ = require('../../core/renderer');
const each = require('../../core/utils/iterator').each;
const eventsEngine = require('../../events/core/events_engine');
const translator = require('../../animation/translator');
const fx = require('../../animation/fx');
const dragEvents = require('../../events/drag');
const mathUtils = require('../../core/utils/math');
const Animator = require('../scroll_view/animator');
const eventUtils = require('../../events/utils');
const registerDecorator = require('./ui.list.edit.decorator_registry').register;
const EditDecorator = require('./ui.list.edit.decorator');


const ReorderScrollAnimator = Animator.inherit({

    ctor: function(strategy) {
        this.callBase();

        this._strategy = strategy;
    },

    _isFinished: function() {
        return this._strategy.scrollFinished();
    },

    _step: function() {
        this._strategy.scrollByStep();
    }

});


const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const DRAG_START_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, LIST_EDIT_DECORATOR);
const DRAG_UPDATE_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, LIST_EDIT_DECORATOR);
const DRAG_END_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, LIST_EDIT_DECORATOR);

const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';

const REOREDERING_ITEM_CLASS = 'dx-list-item-reordering';
const REOREDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';

registerDecorator(
    'reorder',
    'default',
    EditDecorator.inherit({

        _init: function() {
            this._groupedEnabled = this._list.option('grouped');

            this._initAnimator();
        },

        _initAnimator: function() {
            this._scrollAnimator = new ReorderScrollAnimator(this);
        },

        _startAnimator: function() {
            if(!this._scrollAnimator.inProgress()) {
                this._scrollAnimator.start();
            }
        },

        _stopAnimator: function() {
            this._scrollAnimator.stop();
        },

        afterBag: function(config) {
            const $itemElement = config.$itemElement;
            const $container = config.$container;

            const $handle = $('<div>').addClass(REORDER_HANDLE_CLASS);

            let lockedDrag = false;
            eventsEngine.on($handle, 'dxpointerdown', function(e) {
                lockedDrag = !eventUtils.isMouseEvent(e);
            });
            eventsEngine.on($handle, 'dxhold', { timeout: 30 }, function(e) {
                e.cancel = true;
                lockedDrag = false;
            });

            eventsEngine.on($handle, DRAG_START_EVENT_NAME, { direction: 'vertical', immediate: true }, (function(e) {
                if(lockedDrag) {
                    e.cancel = true;
                    return;
                }
                this._dragStartHandler($itemElement, e);
            }).bind(this));

            eventsEngine.on($handle, DRAG_UPDATE_EVENT_NAME, this._dragHandler.bind(this, $itemElement));
            eventsEngine.on($handle, DRAG_END_EVENT_NAME, this._dragEndHandler.bind(this, $itemElement));

            $container.addClass(REORDER_HANDLE_CONTAINER_CLASS);
            $container.append($handle);
        },

        _dragStartHandler: function($itemElement, e) {
            if($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
                e.cancel = true;
                return;
            }

            this._stopPreviousAnimation();

            e.targetElements = [];

            this._cacheItemsPositions();

            this._startPointerOffset = e.pageY - $itemElement.offset().top;

            this._elementHeight = $itemElement.outerHeight();

            const itemIndex = this._list.getFlatIndexByItemElement($itemElement);
            this._startIndex = itemIndex;
            this._lastIndex = itemIndex;
            this._dragRange = this._getDragRange(itemIndex);

            this._cacheScrollData();

            const that = this;
            this._createGhostTimeout = setTimeout(function() {
                that._createGhost($itemElement);
                that._updateGhostPosition();

                $itemElement.addClass(REOREDERING_ITEM_CLASS);
            });
        },

        _stopPreviousAnimation: function() {
            fx.stop(this._$ghostItem, true);
        },

        _cacheItemsPositions: function() {
            const itemPositions = this._itemPositions = [];
            each(this._list.itemElements(), function(index, item) {
                let cachedPosition = null;

                itemPositions.push(function() {
                    cachedPosition = (cachedPosition === null)
                        ? $(item).position().top
                        : cachedPosition;

                    return cachedPosition;
                });
            });
        },

        _getDraggingElementPosition: function() {
            return this._itemPositions[this._startIndex]();
        },

        _getLastElementPosition: function() {
            return this._itemPositions[this._lastIndex]();
        },

        _cacheScrollData: function() {
            this._list.updateDimensions();

            this._startScrollTop = this._list.scrollTop();
            this._scrollOffset = 0;
            this._scrollHeight = this._list.scrollHeight();
            this._clientHeight = this._list.clientHeight();
        },

        _scrollTop: function() {
            return this._startScrollTop + this._scrollOffset;
        },

        _createGhost: function($itemElement) {
            this._$ghostItem = $itemElement.clone();
            this._$ghostItem
                .addClass(REOREDERING_ITEM_GHOST_CLASS)
                .appendTo(this._list.itemsContainer());

            this._startGhostPosition = this._getDraggingElementPosition() - this._$ghostItem.position().top;
            translator.move(this._$ghostItem, { top: this._startGhostPosition });
        },

        _dragHandler: function($itemElement, e) {
            this._topOffset = e.offset.y;

            this._updateItemPositions();

            const pointerPosition = this._getPointerPosition();
            this._toggleScroll(pointerPosition);
        },

        _getPointerPosition: function() {
            return this._getDraggingElementPosition() + this._startPointerOffset + this._scrollOffset + this._topOffset;
        },

        _toggleScroll: function(pointerPosition) {
            if(this._scrollHeight <= this._clientHeight) {
                return;
            }

            const minOffset = this._elementHeight * 0.7;

            const topOffset = (this._clientHeight - (pointerPosition - this._scrollTop()));
            const topOffsetRatio = topOffset / minOffset;

            const bottomOffset = (pointerPosition - this._scrollTop());
            const bottomOffsetRatio = bottomOffset / minOffset;

            if(topOffsetRatio < 1) {
                this._stepSize = this._adjustRationIntoRange(topOffsetRatio);
                this._startAnimator();
            } else if(bottomOffsetRatio < 1) {
                this._stepSize = -this._adjustRationIntoRange(bottomOffsetRatio);
                this._startAnimator();
            } else {
                this._stopAnimator();
            }
        },

        _adjustRationIntoRange: function(ratio) {
            return mathUtils.fitIntoRange(Math.round(Math.abs(ratio - 1) * 7), 1, 7);
        },

        _updateItemPositions: function() {
            this._updateGhostPosition();
            this._updateOthersPositions();
        },

        _updateGhostPosition: function() {
            if(!this._$ghostItem) {
                return;
            }

            translator.move(this._$ghostItem, { top: this._startGhostPosition + this._scrollOffset + this._topOffset });
        },

        _updateOthersPositions: function() {
            const currentIndex = this._findItemIndexByPosition(this._getPointerPosition());

            if(this._lastIndex === currentIndex || this._groupedEnabled && !this._sameParent(currentIndex)) {
                return;
            }

            const currentIndexOffset = currentIndex - this._startIndex;
            const currentDirection = mathUtils.sign(currentIndexOffset);

            const minIndex = Math.min(currentIndex, this._lastIndex);
            const maxIndex = Math.max(currentIndex, this._lastIndex);

            for(let itemIndex = minIndex; itemIndex <= maxIndex; itemIndex++) {
                if(itemIndex === this._startIndex) {
                    continue;
                }

                const $item = this._list.getItemElementByFlatIndex(itemIndex);
                const itemIndexOffset = itemIndex - this._startIndex;
                const itemDirection = mathUtils.sign(itemIndexOffset);

                const offsetsDifference = Math.abs(itemIndexOffset) <= Math.abs(currentIndexOffset);
                const sameDirections = currentDirection === itemDirection;

                const setupPosition = offsetsDifference && sameDirections;
                const resetPosition = !offsetsDifference || !sameDirections;

                fx.stop($item);
                if(setupPosition) {
                    fx.animate($item, {
                        type: 'slide',
                        to: { top: this._elementHeight * -currentDirection },
                        duration: 300
                    });
                }
                if(resetPosition) {
                    fx.animate($item, {
                        type: 'slide',
                        to: { top: 0 },
                        duration: 300
                    });
                }
            }

            this._lastIndex = currentIndex;
        },

        _sameParent: function(index) {
            const $dragging = this._list.getItemElementByFlatIndex(this._startIndex);
            const $over = this._list.getItemElementByFlatIndex(index);

            return $over.parent().get(0) === $dragging.parent().get(0);
        },

        scrollByStep: function() {
            this._scrollOffset += this._stepSize;

            this._list.scrollBy(this._stepSize);
            this._updateItemPositions();
        },

        scrollFinished: function() {
            const scrollTop = this._scrollTop();

            const rejectScrollTop = scrollTop <= 0 && this._stepSize < 0;
            const rejectScrollBottom = scrollTop >= this._scrollHeight - this._clientHeight && this._stepSize > 0;

            return rejectScrollTop || rejectScrollBottom;
        },

        _dragEndHandler: function($itemElement) {
            this._scrollAnimator.stop();

            fx.animate(this._$ghostItem, {
                type: 'slide',
                to: { top: this._startGhostPosition + this._getLastElementPosition() - this._getDraggingElementPosition() },
                duration: 300
            }).done((function() {
                $itemElement.removeClass(REOREDERING_ITEM_CLASS);

                this._resetPositions();
                this._list.reorderItem($itemElement, this._list.getItemElementByFlatIndex(this._lastIndex));

                this._deleteGhost();
            }).bind(this));
        },

        _deleteGhost: function() {
            if(!this._$ghostItem) {
                return;
            }

            this._$ghostItem.remove();
        },

        _resetPositions: function() {
            const minIndex = Math.min(this._startIndex, this._lastIndex);
            const maxIndex = Math.max(this._startIndex, this._lastIndex);

            for(let itemIndex = minIndex; itemIndex <= maxIndex; itemIndex++) {
                const $item = this._list.getItemElementByFlatIndex(itemIndex);

                translator.resetPosition($item);
            }
        },

        _getDragRange(draggableIndex) {
            const items = this._list.itemElements();

            if(!this._groupedEnabled) {
                return {
                    maxIndex: items.length - 1,
                    minIndex: 0
                };
            }

            const oneGroupItems = (item1, item2) => item1.parent().is(item2.parent());
            const draggableElement = items.eq(draggableIndex);
            let startGroupIndex = null;
            let endGroupIndex = null;

            each(items, i => {
                const inGroup = oneGroupItems(items.eq(i), draggableElement);

                if(startGroupIndex === null && inGroup) {
                    startGroupIndex = i;
                } else if(endGroupIndex === null && startGroupIndex !== null && !inGroup) {
                    endGroupIndex = i;
                }
            });

            return {
                maxIndex: endGroupIndex || items.length - 1,
                minIndex: startGroupIndex
            };
        },

        _findItemIndexByPosition: function(position) {
            let { minIndex, maxIndex } = this._dragRange;
            let currentIndex;
            let currentPosition;

            while(minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentPosition = this._itemPositions[currentIndex]();

                if(currentPosition < position) {
                    minIndex = currentIndex + 1;
                } else if(currentPosition > position) {
                    maxIndex = currentIndex - 1;
                } else {
                    return currentIndex;
                }
            }

            return mathUtils.fitIntoRange(minIndex, 0, Math.max(maxIndex, 0));
        },

        getExcludedSelectors: function(selectors) {
            selectors.push('.' + REOREDERING_ITEM_GHOST_CLASS);
        },

        dispose: function() {
            clearTimeout(this._createGhostTimeout);
            this.callBase.apply(this, arguments);
        }

    })
);
