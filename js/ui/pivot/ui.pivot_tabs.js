var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    when = require("../../core/utils/deferred").when,
    fx = require("../../animation/fx"),
    swipeEvents = require("../../events/swipe"),
    translator = require("../../animation/translator"),
    eventUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    config = require("../../core/config"),
    BindableTemplate = require("../widget/bindable_template");


var PIVOT_TABS_CLASS = "dx-pivottabs",

    PIVOT_TAB_CLASS = "dx-pivottabs-tab",
    PIVOT_TAB_SELECTED_CLASS = "dx-pivottabs-tab-selected",

    PIVOT_GHOST_TAB_CLASS = "dx-pivottabs-ghosttab",

    PIVOT_TAB_DATA_KEY = "dxPivotTabData",

    PIVOT_TAB_MOVE_DURATION = 200,
    PIVOT_TAB_MOVE_EASING = "cubic-bezier(.40, .80, .60, 1)";

var animation = {

    moveTo: function($tab, position, completeAction) {
        return fx.animate($tab, {
            type: "slide",
            to: { left: position },
            duration: PIVOT_TAB_MOVE_DURATION,
            easing: PIVOT_TAB_MOVE_EASING,
            complete: completeAction
        });
    },

    slideAppear: function($tab, position) {
        return fx.animate($tab, {
            type: "slide",
            to: {
                left: position,
                opacity: 1
            },
            duration: PIVOT_TAB_MOVE_DURATION,
            easing: PIVOT_TAB_MOVE_EASING
        });
    },

    slideDisappear: function($tab, position) {
        return fx.animate($tab, {
            type: "slide",
            to: {
                left: position,
                opacity: 0
            },
            duration: PIVOT_TAB_MOVE_DURATION,
            easing: PIVOT_TAB_MOVE_EASING
        });
    },

    complete: function(elements) {
        if(!elements) {
            return;
        }

        each(elements, function(_, $element) {
            fx.stop($element, true);
        });
    },

    stop: function(elements) {
        if(!elements) {
            return;
        }

        each(elements, function(_, $element) {
            fx.stop($element);
        });
    }

};

var PivotTabs = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            selectedIndex: 0,

            onPrepare: null,
            onUpdatePosition: null,
            onRollback: null,
            focusStateEnabled: false,
            selectionMode: "single",
            selectionRequired: true,
            swipeEnabled: true
        });
    },

    _itemClass: function() {
        return PIVOT_TAB_CLASS;
    },

    _itemDataKey: function() {
        return PIVOT_TAB_DATA_KEY;
    },

    _itemContainer: function() {
        return this.$element();
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

    _itemWidths: function() {
        if(!this._itemWidthsCache) {
            var $tabs = this._itemElements(),
                widths = [];

            $tabs.each(function() {
                widths.push($(this).outerWidth());
            });

            this._itemWidthsCache = widths;
        }

        return this._itemWidthsCache;
    },

    _init: function() {
        this.callBase();
        this._initGhostTab();
        this._initSwipeHandlers();
        this._initActions();
    },

    _dimensionChanged: function() {
        this._clearElementWidthCache();
        this._cleanPositionCache();
        this._updateTabsPositions();
    },

    _initGhostTab: function() {
        this._$ghostTab = $("<div>").addClass(PIVOT_GHOST_TAB_CLASS);
    },

    _initActions: function() {
        this._updatePositionAction = this._createActionByOption("onUpdatePosition");
        this._rollbackAction = this._createActionByOption("onRollback");
        this._prepareAction = this._createActionByOption("onPrepare");
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new BindableTemplate(function($container, data) {
            var text = (data && data.title) ? data.title : String(data);
            $container.empty();
            $container.append($("<span>").text(text));
        }, ["title"], this.option("integrationOptions.watchMethod"));
    },

    _render: function() {
        this.$element().addClass(PIVOT_TABS_CLASS);

        this.callBase();

        this._calculateMaxOffsets(this._getSelectedItemIndices());
        this._updateTabsPositions();

        this._renderGhostTab();
    },

    _renderGhostTab: function() {
        this._itemContainer().append(this._$ghostTab);
        this._toggleGhostTab(false);
    },

    _toggleGhostTab: function(visible) {
        var $ghostTab = this._$ghostTab;

        if(visible) {
            this._updateGhostTabContent();
            $ghostTab.css("opacity", 1);
        } else {
            $ghostTab.css("opacity", 0);
        }
    },

    _isGhostTabVisible: function() {
        return this._$ghostTab.css("opacity") === "1";
    },

    _updateGhostTabContent: function(prevIndex) {
        prevIndex = prevIndex === undefined ? this._previousIndex() : prevIndex;

        var $ghostTab = this._$ghostTab,
            $items = this._itemElements();

        $ghostTab.html($items.eq(prevIndex).html());
    },

    _updateTabsPositions: function(offset) {
        offset = this._applyOffsetBoundaries(offset);

        var isPrevSwipeHandled = this.option("rtlEnabled") ^ (offset > 0) && (offset !== 0),
            tabPositions = this._calculateTabPositions(isPrevSwipeHandled ? "replace" : "append");

        this._moveTabs(tabPositions, offset);

        this._toggleGhostTab(isPrevSwipeHandled);
    },

    _moveTabs: function(positions, offset) {
        offset = offset || 0;
        var $tabs = this._allTabElements();

        $tabs.each(function(index) {
            translator.move($(this), { left: positions[index] + offset });
        });
    },

    _applyOffsetBoundaries: function(offset) {
        offset = offset || 0;
        var maxOffset = offset > 0 ? this._maxRightOffset : this._maxLeftOffset;

        return offset * maxOffset;
    },

    _animateRollback: function() {
        var that = this,

            $tabs = this._itemElements(),
            positions = this._calculateTabPositions("prepend");

        if(this._isGhostTabVisible()) {
            this._swapGhostWithTab($tabs.eq(this._previousIndex()));
            animation.moveTo(this._$ghostTab, positions[this._indexBoundary()], function() {
                that._toggleGhostTab(false);
            });
        }

        $tabs.each(function(index) {
            animation.moveTo($(this), positions[index]);
        });

    },

    _animateComplete: function(newIndex, currentIndex) {
        var $tabs = this._itemElements(),
            isPrevSwipeHandled = this._isGhostTabVisible();

        $tabs.eq(currentIndex).removeClass(PIVOT_TAB_SELECTED_CLASS);

        if(isPrevSwipeHandled) {
            this._animateIndexDecreasing(newIndex);
        } else {
            this._animateIndexIncreasing(newIndex);
        }

        $tabs.eq(newIndex).addClass(PIVOT_TAB_SELECTED_CLASS);
    },

    _animateIndexDecreasing: function(newIndex) {
        var $tabs = this._itemElements(),
            positions = this._calculateTabPositions("append", newIndex),

            animations = [];

        $tabs.each(function(index) {
            animations.push(
                animation.moveTo($(this), positions[index])
            );
        });

        animations.push(
            animation.slideDisappear(this._$ghostTab, positions[this._indexBoundary()])
        );

        return when.apply($, animations);
    },

    _animateIndexIncreasing: function(newIndex) {
        var that = this,

            $tabs = this._itemElements(),

            positions = this._calculateTabPositions("prepend", newIndex),

            previousIndex = this._previousIndex(newIndex),
            $prevTab = $tabs.eq(previousIndex),
            prevTabPosition = translator.locate($prevTab).left,

            rtl = this.option("rtlEnabled"),

            bound = rtl ? this._elementWidth() - this._itemWidths()[previousIndex] : 0,
            isNextSwipeHandled = (prevTabPosition - bound) * this._getRTLSignCorrection() < 0,

            animations = [];

        if(!isNextSwipeHandled) {
            this._moveTabs(this._calculateTabPositions("append", previousIndex));
        }

        this._updateGhostTabContent(previousIndex);
        this._swapGhostWithTab($tabs.eq(previousIndex));

        $tabs.each(function(index) {
            var $tab = $(this),
                newPosition = positions[index];

            animations.push((index === previousIndex) ?
                animation.slideAppear($tab, newPosition) :
                animation.moveTo($tab, newPosition)
            );
        });

        animations.push(
            animation.moveTo(this._$ghostTab, positions[this._indexBoundary()], function() {
                that._toggleGhostTab(false);
            })
        );

        return when.apply($, animations);
    },

    _swapGhostWithTab: function($tab) {
        var $ghostTab = this._$ghostTab,
            lastTabPosition = translator.locate($tab).left,
            lastTabOpacity = $tab.css("opacity");

        translator.move($tab, { left: translator.locate($ghostTab).left });
        $tab.css("opacity", $ghostTab.css("opacity"));
        translator.move($ghostTab, { left: lastTabPosition });
        $ghostTab.css("opacity", lastTabOpacity);
    },

    _calculateTabPositions: function(ghostPosition, index) {
        index = index === undefined ? this.option("selectedIndex") : index;

        var mark = index + ghostPosition;

        if(this._calculatedPositionsMark !== mark) {
            this._calculatedPositions = this._calculateTabPositionsImpl(index, ghostPosition);
            this._calculatedPositionsMark = mark;
        }

        return this._calculatedPositions;
    },

    _calculateTabPositionsImpl: function(currentIndex, ghostPosition) {
        var prevIndex = this._normalizeIndex(currentIndex - 1),
            widths = this._itemWidths();

        var rtl = this.option("rtlEnabled"),
            signCorrection = this._getRTLSignCorrection(),

            tabsContainerWidth = this._elementWidth(),

            nextPosition = rtl ? tabsContainerWidth : 0,
            positions = [];

        var calculateTabPosition = function(currentIndex, width) {
            var rtlOffset = rtl * width;

            positions.splice(currentIndex, 0, nextPosition - rtlOffset);
            nextPosition += width * signCorrection;
        };

        each(widths.slice(currentIndex), calculateTabPosition);
        each(widths.slice(0, currentIndex), calculateTabPosition);

        switch(ghostPosition) {
            case "replace":
                var lastTabPosition = positions[prevIndex];
                positions.splice(prevIndex, 1, rtl ? tabsContainerWidth : -widths[prevIndex]);
                positions.push(lastTabPosition);
                break;
            case "prepend":
                positions.push(rtl ? tabsContainerWidth : -widths[prevIndex]);
                break;
            case "append":
                positions.push(nextPosition - widths[currentIndex] * rtl);
                break;
        }

        return positions;
    },

    _allTabElements: function() {
        return this._itemContainer().find("." + PIVOT_TAB_CLASS + ", ." + PIVOT_GHOST_TAB_CLASS);
    },

    _initSwipeHandlers: function() {
        var $element = this.$element();

        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.start, this.NAME), {
            itemSizeFunc: this._elementWidth.bind(this)
        }, this._swipeStartHandler.bind(this));
        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.swipe, this.NAME), this._swipeUpdateHandler.bind(this));
        eventsEngine.on($element, eventUtils.addNamespace(swipeEvents.end, this.NAME), this._swipeEndHandler.bind(this));
    },

    _swipeStartHandler: function(e) {
        this._prepareAnimation();
        this._prepareAction();

        e.maxLeftOffset = 1;
        e.maxRightOffset = 1;

        if(config().designMode || this.option("disabled") || !this.option("swipeEnabled") || this._indexBoundary() <= 1) {
            e.cancel = true;
        } else {
            this._swipeGestureRunning = true;
        }
    },

    _prepareAnimation: function() {
        this._stopAnimation();
    },

    _stopAnimation: function() {
        animation.complete(this._allTabElements());
    },

    _swipeUpdateHandler: function(e) {
        var offset = e.offset;

        this._updateTabsPositions(offset);
        this._updatePositionAction({ offset: offset });
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.targetOffset * this._getRTLSignCorrection();

        if(targetOffset === 0) {
            this._animateRollback();
            this._rollbackAction();
        } else {
            var newIndex = this._normalizeIndex(this.option("selectedIndex") - targetOffset);
            this.option("selectedIndex", newIndex);
        }

        this._swipeGestureRunning = false;
    },

    _previousIndex: function(atIndex) {
        atIndex = atIndex === undefined ? this.option("selectedIndex") : atIndex;

        return this._normalizeIndex(atIndex - 1);
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

    _renderSelection: function(current) {
        this._itemElements().eq(current).addClass(PIVOT_TAB_SELECTED_CLASS);
    },

    _updateSelection: function(addedItems, removedItems) {
        var newIndex = addedItems[0],
            oldIndex = removedItems[0];

        this._calculateMaxOffsets(newIndex);

        if(!this._swipeGestureRunning) {
            this._prepareAnimation();
        }

        if(this._itemElements().length) {
            this._animateComplete(newIndex, oldIndex);
        }
    },

    _calculateMaxOffsets: function(index) {
        var currentTabWidth = this._itemWidths()[index],
            prevTabWidth = this._itemWidths()[this._previousIndex(index)],

            rtl = this.option("rtlEnabled");

        this._maxLeftOffset = rtl ? prevTabWidth : currentTabWidth;
        this._maxRightOffset = rtl ? currentTabWidth : prevTabWidth;
    },

    _getRTLSignCorrection: function() {
        return this.option("rtlEnabled") ? -1 : 1;
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _clean: function() {
        animation.stop(this._allTabElements());

        clearTimeout(this._resizeEventTimer);
        this._clearElementWidthCache();
        this._cleanPositionCache();

        this.callBase();
    },

    _cleanPositionCache: function() {
        delete this._itemWidthsCache;
        delete this._calculatedPositionsMark;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "items":
            case "rtlEnabled":
                this._cleanPositionCache();
                this.callBase(args);
                break;
            case "onPrepare":
            case "swipeEnabled":
                break;
            case "onUpdatePosition":
            case "onRollback":
                this._initActions();
                break;
            default:
                this.callBase(args);
        }
    },

    prepare: function() {
        this._prepareAnimation();
    },

    updatePosition: function(offset) {
        this._updateTabsPositions(offset);
    },

    rollback: function() {
        this._animateRollback();
    }
});

module.exports = PivotTabs;

///#DEBUG
module.exports.animation = animation;
///#ENDDEBUG
