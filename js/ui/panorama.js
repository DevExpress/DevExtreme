var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    noop = require("../core/utils/common").noop,
    when = require("../core/utils/deferred").when,
    fx = require("../animation/fx"),
    translator = require("../animation/translator"),
    Class = require("../core/class"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    each = require("../core/utils/iterator").each,
    abstract = abstract,
    registerComponent = require("../core/component_registrator"),
    PanoramaItem = require("./panorama/item"),
    swipeEvents = require("../events/swipe"),
    eventUtils = require("../events/utils"),
    config = require("../core/config"),
    CollectionWidget = require("./collection/ui.collection_widget.edit");

var PANORAMA_CLASS = "dx-panorama",

    PANORAMA_WRAPPER_CLASS = "dx-panorama-wrapper",
    PANORAMA_TITLE_CLASS = "dx-panorama-title",
    PANORAMA_GHOST_TITLE_CLASS = "dx-panorama-ghosttitle",

    PANORAMA_ITEMS_CONTAINER_CLASS = "dx-panorama-itemscontainer",
    PANORAMA_ITEM_CLASS = "dx-panorama-item",
    PANORAMA_GHOST_ITEM_CLASS = "dx-panorama-ghostitem",
    PANORAMA_ITEM_DATA_KEY = "dxPanoramaItemData",

    PANORAMA_ITEM_MARGIN_SCALE = 0.02,
    PANORAMA_TITLE_MARGIN_SCALE = 0.02,

    PANORAMA_BACKGROUND_MOVE_DURATION = 300,
    PANORAMA_BACKGROUND_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)",

    PANORAMA_TITLE_MOVE_DURATION = 300,
    PANORAMA_TITLE_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)",

    PANORAMA_ITEM_MOVE_DURATION = 300,
    PANORAMA_ITEM_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)";


var moveBackground = function($element, position) {
    $element.css("backgroundPosition", position + "px 0%");
};

var position = function($element) {
    return translator.locate($element).left;
};

var move = function($element, position) {
    translator.move($element, { left: position });

    // NOTE: Strange fix for (T277444)
    $element.css("visibility", "");
};

var animation = {

    backgroundMove: function($element, position, completeAction) {
        return fx.animate($element, {
            to: { "backgroundPosition": position + "px 0%" },
            duration: PANORAMA_BACKGROUND_MOVE_DURATION,
            easing: PANORAMA_BACKGROUND_MOVE_EASING,
            complete: completeAction
        });
    },

    titleMove: function($title, position, completeAction) {
        return fx.animate($title, {
            type: "slide",
            to: { left: position },
            duration: PANORAMA_TITLE_MOVE_DURATION,
            easing: PANORAMA_TITLE_MOVE_EASING,
            complete: completeAction
        });
    },

    itemMove: function($item, itemPosition, completeAction) {
        return fx.animate($item, {
            type: "slide",
            to: { left: itemPosition },
            duration: PANORAMA_ITEM_MOVE_DURATION,
            easing: PANORAMA_ITEM_MOVE_EASING,
            complete: function() {
                completeAction && completeAction.apply(this, arguments);

                // NOTE: Strange fix for (T277444)
                $item.css("visibility", position($item) > 0 ? "" : "hidden");
            }
        });
    }

};

var endAnimation = function(elements) {
    if(!elements) {
        return;
    }

    each(elements, function(_, element) {
        fx.stop(element, true);
    });
};


var PanoramaItemsRenderStrategy = Class.inherit({

    ctor: function(panorama) {
        this._panorama = panorama;
    },

    init: noop,

    render: noop,

    allItemElements: function() {
        return this._panorama._itemElements();
    },

    updatePositions: abstract,

    animateRollback: abstract,

    detectBoundsTransition: abstract,

    animateComplete: abstract,

    _getRTLSignCorrection: function() {
        return this._panorama._getRTLSignCorrection();
    },

    _isRTLEnabled: function() {
        return this._panorama.option("rtlEnabled");
    },

    _itemMargin: function() {
        return this._containerWidth() * PANORAMA_ITEM_MARGIN_SCALE;
    },

    _containerWidth: function() {
        return this._panorama._elementWidth();
    },

    _itemWidth: function() {
        return this._panorama._itemWidth();
    },

    _indexBoundary: function() {
        return this._panorama._indexBoundary();
    },

    _normalizeIndex: function(index) {
        return this._panorama._normalizeIndex(index);
    },

    _startNextPosition: function() {
        if(this._isRTLEnabled()) {
            return this._containerWidth() - (this._itemMargin() + this._itemWidth());
        } else {
            return this._itemMargin();
        }
    },

    _startPrevPosition: function() {
        if(this._isRTLEnabled()) {
            return this._containerWidth();
        } else {
            return -this._itemWidth();
        }
    }

});

var PanoramaOneAndLessItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({

    updatePositions: function() {
        var $items = this._panorama._itemElements(),
            startPosition = this._startNextPosition();

        $items.each(function() {
            move($(this), startPosition);
        });
    },

    animateRollback: noop,

    detectBoundsTransition: noop,

    animateComplete: noop

});

var PanoramaTwoItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({

    init: function() {
        this._initGhostItem();
    },

    render: function() {
        this._renderGhostItem();
    },

    _initGhostItem: function() {
        this._$ghostItem = $("<div>").addClass(PANORAMA_GHOST_ITEM_CLASS);
    },

    _renderGhostItem: function() {
        this._panorama._itemContainer().append(this._$ghostItem);

        this._toggleGhostItem(false);
    },

    _toggleGhostItem: function(visible) {
        var $ghostItem = this._$ghostItem;

        if(visible) {
            $ghostItem.css("opacity", 1);
        } else {
            $ghostItem.css("opacity", 0);
        }
    },

    _updateGhostItemContent: function(index) {
        if(index !== false && index !== this._prevGhostIndex) {
            this._$ghostItem.html(this._panorama._itemElements().eq(index).html());
            this._prevGhostIndex = index;
        }
    },

    _isGhostItemVisible: function() {
        return this._$ghostItem.css("opacity") === "1";
    },

    _swapGhostWithItem: function($item) {
        var $ghostItem = this._$ghostItem,
            lastItemPosition = position($item);

        move($item, position($ghostItem));
        move($ghostItem, lastItemPosition);
    },

    allItemElements: function() {
        return this._panorama._itemContainer().find("." + PANORAMA_ITEM_CLASS + ", ." + PANORAMA_GHOST_ITEM_CLASS);
    },

    updatePositions: function(offset) {
        var $items = this.allItemElements(),

            selectedIndex = this._panorama.option("selectedIndex"),

            adjustedOffset = offset * this._getRTLSignCorrection(),
            isGhostReplaceLast = adjustedOffset > 0 && selectedIndex === 0
                                    || adjustedOffset < 0 && selectedIndex === 1,
            isGhostReplaceFirst = adjustedOffset < 0 && selectedIndex === 0
                                    || adjustedOffset > 0 && selectedIndex === 1,

            ghostPosition = isGhostReplaceLast && "replaceLast" || isGhostReplaceFirst && "replaceFirst",
            ghostContentIndex = isGhostReplaceLast && 1 || isGhostReplaceFirst && 0,

            positions = this._calculateItemPositions(selectedIndex, ghostPosition);

        this._updateGhostItemContent(ghostContentIndex);
        this._toggleGhostItem(isGhostReplaceLast || isGhostReplaceFirst);

        $items.each(function(index) {
            move($(this), positions[index] + offset);
        });
    },

    animateRollback: function(currentIndex) {
        var that = this,

            $items = this._panorama._itemElements(),

            startPosition = this._startNextPosition(),
            signCorrection = this._getRTLSignCorrection(),
            offset = (position($items.eq(currentIndex)) - startPosition) * signCorrection,
            ghostOffset = (position(this._$ghostItem) - startPosition) * signCorrection,

            positions = this._calculateItemPositions(currentIndex, ghostOffset > 0 ? "prepend" : "append"),

            isLastReplacedByGhost = currentIndex === 0 && offset > 0 && ghostOffset > 0
                || currentIndex === 1 && ghostOffset < 0;

        if(isLastReplacedByGhost) {
            this._swapGhostWithItem($items.eq(1));
        } else {
            this._swapGhostWithItem($items.eq(0));
        }

        $items.each(function(index) {
            animation.itemMove($(this), positions[index]);
        });

        animation.itemMove(this._$ghostItem, positions[2], function() {
            that._toggleGhostItem(false);
        });
    },

    detectBoundsTransition: function(newIndex, currentIndex) {
        var ghostLocation = position(this._$ghostItem),
            startPosition = this._startNextPosition(),
            rtl = this._isRTLEnabled();

        if(newIndex === 0 && (rtl ^ (ghostLocation < startPosition))) {
            return "left";
        }
        if(currentIndex === 0 && (rtl ^ (ghostLocation > startPosition))) {
            return "right";
        }
    },

    animateComplete: function(boundCross, newIndex, currentIndex) {
        var that = this,

            ghostPosition = !boundCross ^ (currentIndex !== 0) ? "prepend" : "append",

            $items = this._panorama._itemElements(),
            positions = this._calculateItemPositions(newIndex, ghostPosition),

            animations = [];

        $items.each(function(index) {
            animations.push(
                animation.itemMove($(this), positions[index])
            );
        });
        animations.push(
            animation.itemMove(this._$ghostItem, positions[2], function() {
                that._toggleGhostItem(false);
            })
        );

        return when.apply($, animations);
    },

    _calculateItemPositions: function(atIndex, ghostPosition) {
        var positions = [],

            itemMargin = this._itemMargin(),
            itemWidth = this._itemWidth(),
            itemPositionOffset = (itemWidth + itemMargin) * this._getRTLSignCorrection(),

            normalFlow = atIndex === 0,

            prevPosition = this._startPrevPosition(),
            nextPosition = this._startNextPosition();

        positions.push(nextPosition);
        nextPosition += itemPositionOffset;

        if(normalFlow) {
            positions.push(nextPosition);
        } else {
            positions.splice(0, 0, nextPosition);
        }
        nextPosition += itemPositionOffset;

        switch(ghostPosition) {
            case "replaceFirst":
                positions.push(positions[0]);
                if(normalFlow) {
                    positions[0] = nextPosition;
                } else {
                    positions[0] = prevPosition;
                }
                break;
            case "replaceLast":
                if(normalFlow) {
                    positions.splice(1, 0, prevPosition);
                } else {
                    positions.splice(1, 0, nextPosition);
                }
                break;
            case "prepend":
                positions.push(prevPosition);
                break;
            case "append":
                positions.push(nextPosition);
                break;
        }

        return positions;
    }

});

var PanoramaThreeAndMoreItemsRenderStrategy = PanoramaItemsRenderStrategy.inherit({

    updatePositions: function(offset) {
        var $items = this._panorama._itemElements(),
            movingBack = offset * this._getRTLSignCorrection() < 0,
            positions = this._calculateItemPositions(this._panorama.option("selectedIndex"), movingBack);

        $items.each(function(index) {
            move($(this), positions[index] + offset);
        });
    },

    animateRollback: function(selectedIndex) {
        var $items = this._panorama._itemElements(),

            positions = this._calculateItemPositions(selectedIndex),

            animatingItems = [selectedIndex, this._normalizeIndex(selectedIndex + 1)];

        if(this._isRTLEnabled() ^ (position($items.eq(selectedIndex)) > this._startNextPosition())) {
            animatingItems.push(this._normalizeIndex(selectedIndex - 1));
        }

        $items.each(function(index) {
            var $item = $(this);

            if(inArray(index, animatingItems) !== -1) {
                animation.itemMove($item, positions[index]);
            } else {
                move($item, positions[index]);
            }
        });
    },

    detectBoundsTransition: function(newIndex, currentIndex) {
        var lastIndex = this._indexBoundary() - 1;

        if(currentIndex === lastIndex && newIndex === 0) {
            return "left";
        }
        if(currentIndex === 0 && newIndex === lastIndex) {
            return "right";
        }
    },

    animateComplete: function(boundCross, newIndex, currentIndex) {
        var animations = [],
            $items = this._panorama._itemElements(),
            positions = this._calculateItemPositions(newIndex);

        var transitionBack = this._normalizeIndex(currentIndex - 1) === newIndex,
            cyclingItemIndex = $items.length === 3 && transitionBack ? this._normalizeIndex(currentIndex + 1) : null,
            cyclingItemPosition = positions[this._indexBoundary()];

        var animatingItems = [newIndex, currentIndex],
            backAnimatedItemIndex = transitionBack ? currentIndex : newIndex;
        if(!transitionBack) {
            animatingItems.push(this._normalizeIndex(backAnimatedItemIndex + 1));
        }

        $items.each(function(index) {
            var $item = $(this);

            if(inArray(index, animatingItems) === -1) {
                move($item, positions[index]);
                return;
            }

            animations.push((index !== cyclingItemIndex)
                ? animation.itemMove($item, positions[index])
                : animation.itemMove($item, cyclingItemPosition, function() {
                    move($item, positions[index]);
                })
            );
        });

        return when.apply($, animations);
    },

    _calculateItemPositions: function(atIndex, movingBack) {
        var previousIndex = this._normalizeIndex(atIndex - 1),

            itemMargin = this._itemMargin(),
            itemWidth = this._itemWidth(),
            itemPositionOffset = (itemWidth + itemMargin) * this._getRTLSignCorrection(),
            positions = [],

            prevPosition = this._startPrevPosition(),
            nextPosition = this._startNextPosition();

        for(var i = atIndex; i !== previousIndex; i = this._normalizeIndex(i + 1)) {
            positions[i] = nextPosition;
            nextPosition += itemPositionOffset;
        }

        if(movingBack) {
            positions[previousIndex] = nextPosition;
            nextPosition += itemPositionOffset;
        } else {
            positions[previousIndex] = prevPosition;
        }

        positions.push(nextPosition);

        return positions;
    }

});

/**
* @name dxPanorama
* @inherits CollectionWidget
* @module ui/panorama
* @export default
* @deprecated
*/
var Panorama = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxPanoramaOptions.selectedIndex
            * @type number
            * @default 0
            */
            selectedIndex: 0,

            /**
            * @name dxPanoramaOptions.title
            * @type string
            * @default "panorama"
            */
            title: "panorama",

            /**
            * @name dxPanoramaOptions.backgroundImage
            * @type object
            */
            backgroundImage: {
                /**
                * @name dxPanoramaOptions.backgroundImage.url
                * @type string
                * @default null
                */
                url: null,

                /**
                * @name dxPanoramaOptions.backgroundImage.width
                * @type number
                * @default 0
                */
                width: 0,

                /**
                * @name dxPanoramaOptions.backgroundImage.height
                * @type number
                * @default 0
                */
                height: 0
            },

            /**
            * @name dxPanoramaOptions.noDataText
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPanoramaOptions.selectedItems
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPanoramaOptions.selectedItemKeys
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPanoramaOptions.keyExpr
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPanoramaOptions.accessKey
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxPanoramaOptions.tabIndex
            * @hidden
            * @inheritdoc
            */

            /**
             * @name dxPanoramaOptions.items
             * @type Array<string, dxPanoramaItem, object>
             * @fires dxPanoramaOptions.onOptionChanged
             * @inheritdoc
             */

            /**
            * @name dxPanoramaOptions.focusStateEnabled
            * @type boolean
            * @default false
            */
            focusStateEnabled: false,

            selectionMode: "single",
            selectionRequired: true,
            selectionByClick: false,
            titleExpr: function(data) { return data ? data.title : undefined; }
        });
    },

    _itemClass: function() {
        return PANORAMA_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return PANORAMA_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$itemsContainer;
    },

    _itemWidth: function() {
        if(!this._itemWidthCache) {
            this._itemWidthCache = this._itemElements().eq(0).outerWidth() || 0;
        }

        return this._itemWidthCache;
    },

    _clearItemWidthCache: function() {
        delete this._itemWidthCache;
    },

    _elementWidth: function() {
        if(!this._elementWidthCache) {
            this._elementWidthCache = this.$element().width();
        }

        return this._elementWidthCache;
    },

    _clearElementWidthCache: function() {
        delete this._elementWidthCache;
    },

    _titleWidth: function() {
        if(!this._titleWidthCache) {
            this._titleWidthCache = this._$title.outerWidth();
        }

        return this._titleWidthCache;
    },

    _clearTitleWidthCache: function() {
        delete this._titleWidthCache;
    },

    _init: function() {
        this.callBase();

        this._initItemsRenderStrategy();
        this._initWrapper();
        this._initTitle();
        this._initItemsContainer();
        this._initSwipeHandlers();
    },

    _dimensionChanged: function() {
        this._clearItemWidthCache();
        this._clearElementWidthCache();
        this._clearTitleWidthCache();
        this._updatePositions();
    },

    _initWrapper: function() {
        this._$wrapper = $("<div>")
            .addClass(PANORAMA_WRAPPER_CLASS)
            .appendTo(this.$element());
    },

    _initItemsRenderStrategy: function() {
        var itemsRenderStrategy;
        switch(this.option("items").length) {
            case 0:
            case 1:
                itemsRenderStrategy = PanoramaOneAndLessItemsRenderStrategy;
                break;
            case 2:
                itemsRenderStrategy = PanoramaTwoItemsRenderStrategy;
                break;
            default:
                itemsRenderStrategy = PanoramaThreeAndMoreItemsRenderStrategy;
        }
        this._itemsRenderStrategy = new itemsRenderStrategy(this);

        this._itemsRenderStrategy.init();
    },

    _initBackgroundImage: function() {
        var backgroundUrl = this.option("backgroundImage.url");
        if(backgroundUrl) {
            this.$element().css("backgroundImage", "url(" + backgroundUrl + ")");
        }
    },

    _initTitle: function() {
        this._$title = $("<div>").addClass(PANORAMA_TITLE_CLASS);
        this._$ghostTitle = $("<div>").addClass(PANORAMA_GHOST_TITLE_CLASS);

        this._$wrapper.append(this._$title);
        this._$wrapper.append(this._$ghostTitle);

        this._updateTitle();
    },

    _updateTitle: function() {
        var title = this.option("title");

        this._$title.text(title);
        this._$ghostTitle.text(title);

        this._toggleGhostTitle(false);
    },

    _toggleGhostTitle: function(visible) {
        var $ghostTitle = this._$ghostTitle;

        if(visible) {
            $ghostTitle.css("opacity", 1);
        } else {
            $ghostTitle.css("opacity", 0);
        }
    },

    _getRTLSignCorrection: function() {
        return this.option("rtlEnabled") ? -1 : 1;
    },

    _initItemsContainer: function() {
        this._$itemsContainer = $("<div>").addClass(PANORAMA_ITEMS_CONTAINER_CLASS);

        this._$wrapper.append(this._$itemsContainer);
    },

    _initMarkup() {
        this.$element().addClass(PANORAMA_CLASS);
        this.callBase();
        this._initBackgroundImage();
    },

    _render: function() {
        this.callBase();
        this._itemsRenderStrategy.render();
        this._updateSelection();
    },

    _updatePositions: function(offset) {
        offset = offset || 0;

        this._updateBackgroundPosition(offset * this._calculateBackgroundStep());
        this._updateTitlePosition(offset * this._calculateTitleStep());
        this._itemsRenderStrategy.updatePositions(offset * this._elementWidth());
    },

    _updateBackgroundPosition: function(offset) {
        moveBackground(this.$element(), this._calculateBackgroundPosition(this.option("selectedIndex")) + offset);
    },

    _updateTitlePosition: function(offset) {
        move(this._$title, this._calculateTitlePosition(this.option("selectedIndex")) + offset);
    },

    _animateRollback: function(currentIndex) {
        this._animateBackgroundMove(currentIndex);
        this._animateTitleMove(currentIndex);
        this._itemsRenderStrategy.animateRollback(currentIndex);
    },

    _animateBackgroundMove: function(toIndex) {
        return animation.backgroundMove(this.$element(), this._calculateBackgroundPosition(toIndex));
    },

    _animateTitleMove: function(toIndex) {
        return animation.titleMove(this._$title, this._calculateTitlePosition(toIndex));
    },

    _animateComplete: function(newIndex, currentIndex) {
        var that = this,
            boundCross = this._itemsRenderStrategy.detectBoundsTransition(newIndex, currentIndex);

        var backgroundAnimation = this._performBackgroundAnimation(boundCross, newIndex);
        var titleAnimation = this._performTitleAnimation(boundCross, newIndex);
        var itemsAnimation = this._itemsRenderStrategy.animateComplete(boundCross, newIndex, currentIndex);

        when(backgroundAnimation, titleAnimation, itemsAnimation).done(function() {
            that._indexChangeOnAnimation = true;
            that.option("selectedIndex", newIndex);
            that._indexChangeOnAnimation = false;
        });
    },

    _performBackgroundAnimation: function(boundCross, newIndex) {
        if(boundCross) {
            return this._animateBackgroundBoundsTransition(boundCross, newIndex);
        }

        return this._animateBackgroundMove(newIndex);
    },

    _animateBackgroundBoundsTransition: function(bound, newIndex) {
        var that = this,

            isLeft = (bound === "left"),
            afterAnimationPosition = this._calculateBackgroundPosition(newIndex),
            animationEndPositionShift = isLeft ^ this.option("rtlEnabled") ? -this._calculateBackgroundScaledWidth() : this._calculateBackgroundScaledWidth(),
            animationEndPosition = afterAnimationPosition + animationEndPositionShift;

        return animation.backgroundMove(this.$element(), animationEndPosition, function() {
            moveBackground(that.$element(), afterAnimationPosition);
        });
    },

    _performTitleAnimation: function(boundCross, newIndex) {
        if(boundCross) {
            return this._animateTitleBoundsTransition(boundCross, newIndex);
        }
        return this._animateTitleMove(newIndex);
    },

    _animateTitleBoundsTransition: function(bound, newIndex) {
        var that = this,

            $ghostTitle = this._$ghostTitle,

            ghostWidth = this._titleWidth(),
            panoramaWidth = this._elementWidth(),

            isLeft = bound === "left",
            rtl = this.option("rtlEnabled"),
            ghostTitleStartPosition = isLeft ^ rtl ? panoramaWidth : -ghostWidth,
            ghostTitleEndPosition = isLeft ^ rtl ? -(panoramaWidth + ghostWidth) : panoramaWidth;

        move($ghostTitle, ghostTitleStartPosition);
        this._toggleGhostTitle(true);
        this._swapGhostWithTitle();

        var ghostAnimation = animation.titleMove($ghostTitle, ghostTitleEndPosition, function() {
            that._toggleGhostTitle(false);
        });
        var titleAnimation = animation.titleMove(this._$title, this._calculateTitlePosition(newIndex));

        return when(ghostAnimation, titleAnimation);
    },

    _swapGhostWithTitle: function() {
        var $ghostTitle = this._$ghostTitle,
            $title = this._$title,
            lastTitlePosition = position($title);

        move($title, position($ghostTitle));
        move($ghostTitle, lastTitlePosition);
    },

    _calculateTitlePosition: function(atIndex) {
        var panoramaWidth = this._elementWidth(),
            titleWidth = this._titleWidth(),
            titleMargin = panoramaWidth * PANORAMA_TITLE_MARGIN_SCALE,

            titleStartPosition = this.option("rtlEnabled") ? panoramaWidth - titleMargin - titleWidth : titleMargin,
            titleStep = atIndex * this._calculateTitleStep() * this._getRTLSignCorrection();

        return titleStartPosition - titleStep;
    },

    _calculateTitleStep: function() {
        var panoramaWidth = this._elementWidth(),
            titleWidth = this._titleWidth(),
            indexBoundary = this._indexBoundary() || 1;

        return Math.max((titleWidth - panoramaWidth) / indexBoundary, titleWidth / indexBoundary);
    },

    _calculateBackgroundPosition: function(atIndex) {
        var panoramaWidth = this._elementWidth(),
            backgroundScaledWidth = this._calculateBackgroundScaledWidth(),

            backgroundStartPosition = this.option("rtlEnabled") ? panoramaWidth - backgroundScaledWidth : 0,
            backgroundOffset = (atIndex * this._calculateBackgroundStep()) * this._getRTLSignCorrection();

        return backgroundStartPosition - backgroundOffset;
    },

    _calculateBackgroundStep: function() {
        var itemWidth = this._itemWidth(),
            backgroundScaledWidth = this._calculateBackgroundScaledWidth();

        return Math.max((backgroundScaledWidth - itemWidth) / (this._indexBoundary() || 1), 0);
    },

    _calculateBackgroundScaledWidth: function() {
        return this.$element().height() * this.option("backgroundImage.width") / (this.option("backgroundImage.height") || 1);
    },

    _initSwipeHandlers: function() {
        eventsEngine.on(this.$element(), eventUtils.addNamespace(swipeEvents.start, this.NAME), {
            itemSizeFunc: this._elementWidth.bind(this)
        }, this._swipeStartHandler.bind(this));
        eventsEngine.on(this.$element(), eventUtils.addNamespace(swipeEvents.swipe, this.NAME), this._swipeUpdateHandler.bind(this));
        eventsEngine.on(this.$element(), eventUtils.addNamespace(swipeEvents.end, this.NAME), this._swipeEndHandler.bind(this));
    },

    _swipeStartHandler: function(e) {
        this._stopAnimations();

        e.maxLeftOffset = 1;
        e.maxRightOffset = 1;

        if(config().designMode || this.option("disabled") || this._indexBoundary() <= 1) {
            e.cancel = true;
        }
    },

    _stopAnimations: function() {
        endAnimation([this.$element(), this._$ghostTitle, this._$title]);
        endAnimation(this._itemsRenderStrategy.allItemElements());
    },

    _swipeUpdateHandler: function(e) {
        this._updatePositions(e.offset);
    },

    _swipeEndHandler: function(e) {
        var currentIndex = this.option("selectedIndex"),
            targetOffset = e.targetOffset * this._getRTLSignCorrection();

        if(targetOffset === 0) {
            this._animateRollback(currentIndex);
        } else {
            this._animateComplete(this._normalizeIndex(currentIndex - targetOffset), currentIndex);
        }
    },

    _updateSelection: function() {
        if(!this._indexChangeOnAnimation) {
            this._updatePositions();
        }
    },

    _normalizeIndex: function(index) {
        var boundary = this._indexBoundary();

        if(index < 0) {
            index = boundary + index;
        }
        if(index >= boundary) {
            index = index - boundary;
        }

        return index;
    },

    _indexBoundary: function() {
        return this.option("items").length;
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "backgroundImage":
                this._invalidate();
                break;
            case "title":
                this._updateTitle();
                break;
            case "items":
                this._initItemsRenderStrategy();
                this.callBase(args);
                break;
            case "titleExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

    /**
    * @name dxPanoramaMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxPanoramaMethods.focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */
});
/**
* @name dxPanoramaItem
* @inherits CollectionWidgetItem
* @type object
*/
/**
* @name dxPanoramaItem.title
* @type String
*/
/**
* @name dxPanoramaItem.visible
* @hidden
* @inheritdoc
*/
Panorama.ItemClass = PanoramaItem;

registerComponent("dxPanorama", Panorama);

module.exports = Panorama;

///#DEBUG
module.exports.animation = animation;
///#ENDDEBUG
