import { getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import { locate } from '../animation/translator';
import { _translator, animation } from './multi_view/ui.multi_view.animation';
import { sign } from '../core/utils/math';
import { extend } from '../core/utils/extend';
import { noop, deferRender } from '../core/utils/common';
import { triggerResizeEvent } from '../events/visibility_change';
import { getPublicElement } from '../core/element';
import { isDefined } from '../core/utils/type';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import CollectionWidget from './collection/ui.collection_widget.live_update';
import Swipeable from '../events/gesture/swipeable';
import { Deferred } from '../core/utils/deferred';
import messageLocalization from '../localization/message';

// STYLE multiView

const MULTIVIEW_CLASS = 'dx-multiview';
const MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
const MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';
const MULTIVIEW_ITEM_DATA_KEY = 'dxMultiViewItemData';

const MULTIVIEW_ANIMATION_DURATION = 200;

const toNumber = value => +(value);

const position = $element => locate($element).left;

const MultiView = CollectionWidget.inherit({

    _activeStateUnit: '.' + MULTIVIEW_ITEM_CLASS,

    _supportedKeys: function() {
        return extend(this.callBase(), {
            pageUp: noop,
            pageDown: noop
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            selectedIndex: 0,

            swipeEnabled: true,

            animationEnabled: true,

            loop: false,

            deferRendering: true,

            /**
            * @name dxMultiViewOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxMultiViewOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxMultiViewOptions.keyExpr
            * @hidden
            */

            loopItemFocus: false,
            selectOnFocus: true,
            selectionMode: 'single',
            selectionRequired: true,
            selectByClick: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _itemClass: function() {
        return MULTIVIEW_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return MULTIVIEW_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$itemContainer;
    },

    _itemElements: function() {
        return this._itemContainer().children(this._itemSelector());
    },

    _itemWidth: function() {
        if(!this._itemWidthValue) {
            this._itemWidthValue = getWidth(this._$wrapper);
        }

        return this._itemWidthValue;
    },

    _clearItemWidthCache: function() {
        delete this._itemWidthValue;
    },

    _itemsCount: function() {
        return this.option('items').length;
    },

    _normalizeIndex: function(index) {
        const count = this._itemsCount();

        if(index < 0) {
            index = index + count;
        }
        if(index >= count) {
            index = index - count;
        }

        return index;
    },

    _getRTLSignCorrection: function() {
        return this.option('rtlEnabled') ? -1 : 1;
    },

    _init: function() {
        this.callBase.apply(this, arguments);

        const $element = this.$element();

        $element.addClass(MULTIVIEW_CLASS);

        this._$wrapper = $('<div>').addClass(MULTIVIEW_WRAPPER_CLASS);
        this._$wrapper.appendTo($element);

        this._$itemContainer = $('<div>').addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);
        this._$itemContainer.appendTo(this._$wrapper);

        this.option('loopItemFocus', this.option('loop'));
        this._findBoundaryIndices();

        this._initSwipeable();
    },

    _initMarkup: function() {
        this._deferredItems = [];

        this.callBase();

        const selectedItemIndices = this._getSelectedItemIndices();
        this._updateItemsVisibility(selectedItemIndices[0]);
    },

    _afterItemElementDeleted: function($item, deletedActionArgs) {
        this.callBase($item, deletedActionArgs);
        if(this._deferredItems) {
            this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
        }
    },

    _beforeItemElementInserted: function(change) {
        this.callBase.apply(this, arguments);
        if(this._deferredItems) {
            this._deferredItems.splice(change.index, 0, null);
        }
    },

    _executeItemRenderAction: function(index, itemData, itemElement) {
        index = (this.option('items') || []).indexOf(itemData);
        this.callBase(index, itemData, itemElement);
    },

    _renderItemContent: function(args) {
        const renderContentDeferred = new Deferred();

        const that = this;
        const callBase = this.callBase;

        const deferred = new Deferred();
        deferred.done(function() {
            const $itemContent = callBase.call(that, args);
            renderContentDeferred.resolve($itemContent);
        });

        this._deferredItems[args.index] = deferred;
        this.option('deferRendering') || deferred.resolve();

        return renderContentDeferred.promise();
    },

    _render: function() {
        this.callBase();

        deferRender(() => {
            const selectedItemIndices = this._getSelectedItemIndices();
            this._updateItems(selectedItemIndices[0]);

            this._setElementAria();
            this._setItemsAria();
        });
    },

    _getElementAria() {
        return {
            role: 'group',
            'roledescription': messageLocalization.format('dxMultiView-elementAriaRoleDescription'),
            label: messageLocalization.format('dxMultiView-elementAriaLabel'),
        };
    },

    _setElementAria() {
        const aria = this._getElementAria();

        this.setAria(aria, this.$element());
    },

    _getItemsAria({ itemIndex, itemsCount }) {
        const aria = {
            role: 'group',
            'roledescription': messageLocalization.format('dxMultiView-itemAriaRoleDescription'),
            label: messageLocalization.format(
                'dxMultiView-itemAriaLabel',
                itemIndex + 1,
                itemsCount,
            ),
        };

        return aria;
    },

    _setItemsAria() {
        const $itemElements = this._itemElements();
        const itemsCount = this._itemsCount();

        $itemElements.each(((itemIndex, item) => {
            const aria = this._getItemsAria({ itemIndex, itemsCount });

            this.setAria(aria, $(item));
        }));
    },

    _updateItems: function(selectedIndex, newIndex) {
        this._updateItemsPosition(selectedIndex, newIndex);
        this._updateItemsVisibility(selectedIndex, newIndex);
    },

    _modifyByChanges: function() {
        this.callBase.apply(this, arguments);

        const selectedItemIndices = this._getSelectedItemIndices();
        this._updateItemsVisibility(selectedItemIndices[0]);
    },

    _updateItemsPosition: function(selectedIndex, newIndex) {
        const $itemElements = this._itemElements();
        const positionSign = isDefined(newIndex) ? -this._animationDirection(newIndex, selectedIndex) : undefined;
        const $selectedItem = $itemElements.eq(selectedIndex);

        _translator.move($selectedItem, 0);
        if(isDefined(newIndex)) {
            _translator.move($itemElements.eq(newIndex), positionSign * 100 + '%');
        }
    },

    _updateItemsVisibility: function(selectedIndex, newIndex) {
        const $itemElements = this._itemElements();

        $itemElements.each((function(itemIndex, item) {
            const $item = $(item);
            const isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;

            if(!isHidden) {
                this._renderSpecificItem(itemIndex);
            }
            $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);

            this.setAria('hidden', isHidden || undefined, $item);
        }).bind(this));
    },

    _renderSpecificItem: function(index) {
        const $item = this._itemElements().eq(index);
        const hasItemContent = $item.find(this._itemContentClass()).length > 0;

        if(isDefined(index) && !hasItemContent) {
            this._deferredItems[index].resolve();
            triggerResizeEvent($item);
        }
    },

    _refreshItem: function($item, item) {
        this.callBase($item, item);

        this._updateItemsVisibility(this.option('selectedIndex'));
    },

    _setAriaSelectionAttribute: noop,

    _updateSelection: function(addedSelection, removedSelection) {
        const newIndex = addedSelection[0];
        const prevIndex = removedSelection[0];

        animation.complete(this._$itemContainer);

        this._updateItems(prevIndex, newIndex);

        const animationDirection = this._animationDirection(newIndex, prevIndex);

        this._animateItemContainer(animationDirection * this._itemWidth(), (function() {
            _translator.move(this._$itemContainer, 0);
            this._updateItems(newIndex);

            // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)
            getWidth(this._$itemContainer);
        }).bind(this));
    },

    _animateItemContainer: function(position, completeCallback) {
        const duration = this.option('animationEnabled') ? MULTIVIEW_ANIMATION_DURATION : 0;

        animation.moveTo(this._$itemContainer, position, duration, completeCallback);
    },

    _animationDirection: function(newIndex, prevIndex) {
        const containerPosition = position(this._$itemContainer);
        const indexDifference = (prevIndex - newIndex) * this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection();
        const isSwipePresent = containerPosition !== 0;

        const directionSignVariable = isSwipePresent ? containerPosition : indexDifference;

        return sign(directionSignVariable);
    },

    _getSwipeDisabledState() {
        return !this.option('swipeEnabled') || this._itemsCount() <= 1;
    },

    _initSwipeable() {
        this._createComponent(this.$element(), Swipeable, {
            disabled: this._getSwipeDisabledState(),
            elastic: false,
            itemSizeFunc: this._itemWidth.bind(this),
            onStart: args => this._swipeStartHandler(args.event),
            onUpdated: args => this._swipeUpdateHandler(args.event),
            onEnd: args => this._swipeEndHandler(args.event)
        });
    },

    _findBoundaryIndices() {
        const items = this.option('items');

        let firstIndex;
        let lastIndex;

        items.forEach((item, index) => {
            const isDisabled = Boolean(item?.disabled);

            if(!isDisabled) {
                firstIndex ??= index;
                lastIndex = index;
            }
        });

        this._boundaryIndices = {
            firstAvailableIndex: firstIndex ?? 0,
            lastAvailableIndex: lastIndex ?? items.length - 1,
            firstTrueIndex: 0,
            lastTrueIndex: items.length - 1,
        };
    },

    _swipeStartHandler: function(e) {
        animation.complete(this._$itemContainer);

        const selectedIndex = this.option('selectedIndex');
        const loop = this.option('loop');

        const { firstAvailableIndex, lastAvailableIndex } = this._boundaryIndices;

        const rtl = this.option('rtlEnabled');

        e.maxLeftOffset = toNumber(loop || (rtl ? selectedIndex > firstAvailableIndex : selectedIndex < lastAvailableIndex));
        e.maxRightOffset = toNumber(loop || (rtl ? selectedIndex < lastAvailableIndex : selectedIndex > firstAvailableIndex));

        this._swipeDirection = null;
    },

    _swipeUpdateHandler: function(e) {
        const offset = e.offset;
        const swipeDirection = sign(offset) * this._getRTLSignCorrection();

        _translator.move(this._$itemContainer, offset * this._itemWidth());

        if(swipeDirection !== this._swipeDirection) {
            this._swipeDirection = swipeDirection;

            const selectedIndex = this.option('selectedIndex');
            const newIndex = this._normalizeIndex(selectedIndex - swipeDirection);

            this._updateItems(selectedIndex, newIndex);
        }
    },

    _findNextAvailableIndex(index, offset) {
        const { items, loop } = this.option();
        const { firstAvailableIndex, lastAvailableIndex, firstTrueIndex, lastTrueIndex } = this._boundaryIndices;

        const isFirstActive = [firstTrueIndex, firstAvailableIndex].includes(index);
        const isLastActive = [lastTrueIndex, lastAvailableIndex].includes(index);

        if(loop) {
            if(isFirstActive && offset < 0) {
                return lastAvailableIndex;
            } else if(isLastActive && offset > 0) {
                return firstAvailableIndex;
            }
        }

        for(let i = index + offset; i >= firstAvailableIndex && i <= lastAvailableIndex; i += offset) {
            const isDisabled = Boolean(items[i].disabled);

            if(!isDisabled) {
                return i;
            }
        }

        return index;
    },

    _swipeEndHandler: function(e) {
        const targetOffset = e.targetOffset * this._getRTLSignCorrection();

        if(targetOffset) {
            const newSelectedIndex = this._findNextAvailableIndex(this.option('selectedIndex'), -targetOffset);

            this.option('selectedIndex', newSelectedIndex);

            // TODO: change focusedElement on focusedItem
            const $selectedElement = this.itemElements().filter('.dx-item-selected');
            this.option('focusStateEnabled') && this.option('focusedElement', getPublicElement($selectedElement));
        } else {
            this._animateItemContainer(0, noop);
        }
    },

    _getItemFocusLoopSignCorrection: function() {
        return this._itemFocusLooped ? -1 : 1;
    },

    _moveFocus: function() {
        this.callBase.apply(this, arguments);

        this._itemFocusLooped = false;
    },

    _prevItem: function($items) {
        const $result = this.callBase.apply(this, arguments);

        this._itemFocusLooped = $result.is($items.last());

        return $result;
    },

    _nextItem: function($items) {
        const $result = this.callBase.apply(this, arguments);

        this._itemFocusLooped = $result.is($items.first());

        return $result;
    },

    _dimensionChanged: function() {
        this._clearItemWidthCache();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _updateSwipeDisabledState() {
        const disabled = this._getSwipeDisabledState();
        Swipeable.getInstance(this.$element()).option('disabled', disabled);
    },

    _dispose: function() {
        delete this._boundaryIndices;

        this.callBase();
    },

    _optionChanged: function(args) {
        const value = args.value;

        switch(args.name) {
            case 'loop':
                this.option('loopItemFocus', value);
                break;
            case 'animationEnabled':
                break;
            case 'swipeEnabled':
                this._updateSwipeDisabledState();
                break;
            case 'deferRendering':
                this._invalidate();
                break;
            case 'items':
                this._updateSwipeDisabledState();
                this._findBoundaryIndices();
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }

});
/**
* @name dxMultiViewItem.visible
* @hidden
*/

registerComponent('dxMultiView', MultiView);

export default MultiView;

/**
 * @name dxMultiViewItem
 * @inherits CollectionWidgetItem
 * @type object
 */
