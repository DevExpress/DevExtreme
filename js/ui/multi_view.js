import $ from '../core/renderer';
import fx from '../animation/fx';
import translator from '../animation/translator';
import mathUtils from '../core/utils/math';
import { extend } from '../core/utils/extend';
import { noop, deferRender } from '../core/utils/common';
import { triggerResizeEvent, getPublicElement } from '../core/utils/dom';
import { isDefined } from '../core/utils/type';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import CollectionWidget from './collection/ui.collection_widget.live_update';
import Swipeable from '../events/gesture/swipeable';
import { Deferred } from '../core/utils/deferred';

const MULTIVIEW_CLASS = 'dx-multiview';
const MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
const MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';
const MULTIVIEW_ITEM_DATA_KEY = 'dxMultiViewItemData';

const MULTIVIEW_ANIMATION_DURATION = 200;

const toNumber = value => +(value);

const position = $element => translator.locate($element).left;

const _translator = {
    move($element, position) {
        translator.move($element, { left: position });
    }
};

const animation = {
    moveTo($element, position, duration, completeAction) {
        fx.animate($element, {
            type: 'slide',
            to: { left: position },
            duration: duration,
            complete: completeAction
        });
    },

    complete($element) {
        fx.stop($element, true);
    }
};

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


            _itemAttributes: { role: 'tabpanel' },
            loopItemFocus: false,
            selectOnFocus: true,
            selectionMode: 'single',
            selectionRequired: true,
            selectionByClick: false
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
            this._itemWidthValue = this._$wrapper.width();
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
        var count = this._itemsCount();

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

        var $element = this.$element();

        $element.addClass(MULTIVIEW_CLASS);

        this._$wrapper = $('<div>').addClass(MULTIVIEW_WRAPPER_CLASS);
        this._$wrapper.appendTo($element);

        this._$itemContainer = $('<div>').addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);
        this._$itemContainer.appendTo(this._$wrapper);

        this.option('loopItemFocus', this.option('loop'));

        this._initSwipeable();
    },

    _initMarkup: function() {
        this._deferredItems = [];

        this.callBase();

        var selectedItemIndices = this._getSelectedItemIndices();
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
        var renderContentDeferred = new Deferred();

        var that = this,
            callBase = this.callBase;

        var deferred = new Deferred();
        deferred.done(function() {
            var $itemContent = callBase.call(that, args);
            renderContentDeferred.resolve($itemContent);
        });

        this._deferredItems[args.index] = deferred;
        this.option('deferRendering') || deferred.resolve();

        return renderContentDeferred.promise();
    },

    _render: function() {
        this.callBase();

        deferRender(() => {
            var selectedItemIndices = this._getSelectedItemIndices();
            this._updateItems(selectedItemIndices[0]);
        });
    },

    _updateItems: function(selectedIndex, newIndex) {
        this._updateItemsPosition(selectedIndex, newIndex);
        this._updateItemsVisibility(selectedIndex, newIndex);
    },

    _modifyByChanges: function() {
        this.callBase.apply(this, arguments);

        var selectedItemIndices = this._getSelectedItemIndices();
        this._updateItemsVisibility(selectedItemIndices[0]);
    },

    _updateItemsPosition: function(selectedIndex, newIndex) {
        var $itemElements = this._itemElements(),
            positionSign = isDefined(newIndex) ? -this._animationDirection(newIndex, selectedIndex) : undefined,
            $selectedItem = $itemElements.eq(selectedIndex);

        _translator.move($selectedItem, 0);
        if(isDefined(newIndex)) {
            _translator.move($itemElements.eq(newIndex), positionSign * 100 + '%');
        }
    },

    _updateItemsVisibility: function(selectedIndex, newIndex) {
        var $itemElements = this._itemElements();

        $itemElements.each((function(itemIndex, item) {
            var $item = $(item),
                isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;

            if(!isHidden) {
                this._renderSpecificItem(itemIndex);
            }
            $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);

            this.setAria('hidden', isHidden || undefined, $item);
        }).bind(this));
    },

    _renderSpecificItem: function(index) {
        var $item = this._itemElements().eq(index),
            hasItemContent = $item.find(this._itemContentClass()).length > 0;

        if(isDefined(index) && !hasItemContent) {
            this._deferredItems[index].resolve();
            triggerResizeEvent($item);
        }
    },

    _refreshItem: function($item, item) {
        this.callBase($item, item);

        this._updateItemsVisibility(this.option('selectedIndex'));
    },

    _setAriaSelected: noop,

    _updateSelection: function(addedSelection, removedSelection) {
        var newIndex = addedSelection[0],
            prevIndex = removedSelection[0];

        animation.complete(this._$itemContainer);

        this._updateItems(prevIndex, newIndex);

        var animationDirection = this._animationDirection(newIndex, prevIndex);

        this._animateItemContainer(animationDirection * this._itemWidth(), (function() {
            _translator.move(this._$itemContainer, 0);
            this._updateItems(newIndex);

            // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)
            this._$itemContainer.width();
        }).bind(this));
    },

    _animateItemContainer: function(position, completeCallback) {
        var duration = this.option('animationEnabled') ? MULTIVIEW_ANIMATION_DURATION : 0;

        animation.moveTo(this._$itemContainer, position, duration, completeCallback);
    },

    _animationDirection: function(newIndex, prevIndex) {
        var containerPosition = position(this._$itemContainer),
            indexDifference = (prevIndex - newIndex) * this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection(),
            isSwipePresent = containerPosition !== 0,

            directionSignVariable = isSwipePresent ? containerPosition : indexDifference;

        return mathUtils.sign(directionSignVariable);
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

    _swipeStartHandler: function(e) {
        animation.complete(this._$itemContainer);

        var selectedIndex = this.option('selectedIndex'),
            loop = this.option('loop'),
            lastIndex = this._itemsCount() - 1,
            rtl = this.option('rtlEnabled');

        e.maxLeftOffset = toNumber(loop || (rtl ? selectedIndex > 0 : selectedIndex < lastIndex));
        e.maxRightOffset = toNumber(loop || (rtl ? selectedIndex < lastIndex : selectedIndex > 0));

        this._swipeDirection = null;
    },

    _swipeUpdateHandler: function(e) {
        var offset = e.offset,
            swipeDirection = mathUtils.sign(offset) * this._getRTLSignCorrection();

        _translator.move(this._$itemContainer, offset * this._itemWidth());

        if(swipeDirection !== this._swipeDirection) {
            this._swipeDirection = swipeDirection;

            var selectedIndex = this.option('selectedIndex'),
                newIndex = this._normalizeIndex(selectedIndex - swipeDirection);

            this._updateItems(selectedIndex, newIndex);
        }
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.targetOffset * this._getRTLSignCorrection();
        if(targetOffset) {
            this.option('selectedIndex', this._normalizeIndex(this.option('selectedIndex') - targetOffset));
            // TODO: change focusedElement on focusedItem
            var $selectedElement = this.itemElements().filter('.dx-item-selected');
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
        var $result = this.callBase.apply(this, arguments);

        this._itemFocusLooped = $result.is($items.last());

        return $result;
    },

    _nextItem: function($items) {
        var $result = this.callBase.apply(this, arguments);

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

    _optionChanged: function(args) {
        var value = args.value;

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
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }

});
/**
* @name dxMultiViewItem
* @inherits CollectionWidgetItem
* @type object
*/
/**
* @name dxMultiViewItem.visible
* @hidden
*/

registerComponent('dxMultiView', MultiView);

module.exports = MultiView;
///#DEBUG
module.exports.animation = animation;
module.exports._translator = _translator;
///#ENDDEBUG
