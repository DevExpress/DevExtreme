var $ = require('../../core/renderer'),
    eventsEngine = require('../../events/core/events_engine'),
    registerComponent = require('../../core/component_registrator'),
    extend = require('../../core/utils/extend').extend,
    each = require('../../core/utils/iterator').each,
    eventUtils = require('../../events/utils'),
    clickEvent = require('../../events/click'),
    Scrollable = require('../scroll_view/ui.scrollable'),
    fx = require('../../animation/fx'),
    translator = require('../../animation/translator');

var DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller',
    DATEVIEW_ROLLER_ACTIVE_CLASS = 'dx-state-active',
    DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current',

    DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item',
    DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected',
    DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame',
    DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';

var DateViewRoller = Scrollable.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            showScrollbar: false,
            useNative: false,
            selectedIndex: 0,
            bounceEnabled: false,
            items: [],
            showOnClick: false,
            onClick: null,
            onSelectedIndexChanged: null
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: { platform: 'generic' },
            options: {
                scrollByContent: true
            }
        }]);
    },

    _init: function() {
        this.callBase();

        this._renderSelectedItemFrame();
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(DATEVIEW_ROLLER_CLASS);

        this._renderContainerClick();
        this._renderItems();
        this._renderSelectedValue();
        this._renderItemsClick();
        this._wrapAction('_endAction', this._endActionHandler.bind(this));
        this._renderSelectedIndexChanged();
    },

    _renderSelectedIndexChanged: function() {
        this._selectedIndexChanged = this._createActionByOption('onSelectedIndexChanged');
    },

    _renderContainerClick: function() {
        if(!this.option('showOnClick')) {
            return;
        }

        var eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        var clickAction = this._createActionByOption('onClick');


        eventsEngine.off(this._$container, eventName);
        eventsEngine.on(this._$container, eventName, function(e) {
            clickAction({ event: e });
        });
    },

    _wrapAction: function(actionName, callback) {
        var strategy = this._strategy,
            originalAction = strategy[actionName];

        strategy[actionName] = function() {
            callback.apply(this, arguments);
            return originalAction.apply(this, arguments);
        };
    },

    _renderItems: function() {
        var items = this.option('items') || [],
            $items = $();

        this._$content.empty();
        // NOTE: rendering ~166+30+12+24+60 <div>s >> 50mc
        items.forEach(function(item) {
            $items = $items.add(
                $('<div>')
                    .addClass(DATEVIEW_ROLLER_ITEM_CLASS)
                    .append(item)
            );
        });

        this._$content.append($items);
        this._$items = $items;
        this.update();
    },

    _renderSelectedItemFrame: function() {
        $('<div>')
            .addClass(DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS)
            .append($('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS))
            .appendTo(this._$container);
    },

    _renderSelectedValue: function(selectedIndex) {
        var index = this._fitIndex(selectedIndex || this.option('selectedIndex'));

        this._moveTo({ top: this._getItemPosition(index) });
        this._renderActiveStateItem();
    },

    _fitIndex: function(index) {
        var items = this.option('items') || [],
            itemCount = items.length;

        if(index >= itemCount) {
            return itemCount - 1;
        }

        if(index < 0) {
            return 0;
        }

        return index;
    },

    _getItemPosition: function(index) {
        return Math.round(this._itemHeight() * index);
    },

    _renderItemsClick: function() {
        var itemSelector = this._getItemSelector(),
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        eventsEngine.off(this.$element(), eventName, itemSelector);
        eventsEngine.on(this.$element(), eventName, itemSelector, this._itemClickHandler.bind(this));
    },

    _getItemSelector: function() {
        return '.' + DATEVIEW_ROLLER_ITEM_CLASS;
    },

    _itemClickHandler: function(e) {
        this.option('selectedIndex', this._itemElementIndex(e.currentTarget));
    },

    _itemElementIndex: function(itemElement) {
        return this._itemElements().index(itemElement);
    },

    _itemElements: function() {
        return this.$element().find(this._getItemSelector());
    },

    _renderActiveStateItem: function() {
        var selectedIndex = this.option('selectedIndex');

        each(this._$items, function(index) {
            $(this).toggleClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index);
        });
    },

    _moveTo: function(targetLocation) {
        targetLocation = this._normalizeLocation(targetLocation);
        var location = this._location(),
            delta = {
                x: -(location.left - targetLocation.left),
                y: -(location.top - targetLocation.top)
            };

        if(this._isVisible() && (delta.x || delta.y)) {
            this._strategy._prepareDirections(true);

            if(this._animation) {
                var that = this;

                fx.stop(this._$content);
                fx.animate(this._$content, {
                    duration: 200,
                    type: 'slide',
                    to: { top: Math.floor(delta.y) },
                    complete: function() {
                        translator.resetPosition(that._$content);
                        that._strategy.handleMove({ delta: delta });
                    }
                });
                delete this._animation;
            } else {
                this._strategy.handleMove({ delta: delta });
            }
        }
    },

    _validate: function(e) {
        return this._strategy.validate(e);
    },

    _endActionHandler: function() {
        var currentSelectedIndex = this.option('selectedIndex'),
            ratio = -this._location().top / this._itemHeight(),
            newSelectedIndex = Math.round(ratio);

        this._animation = true;

        if(newSelectedIndex === currentSelectedIndex) {
            this._renderSelectedValue(newSelectedIndex);
        } else {
            this.option('selectedIndex', newSelectedIndex);
        }
    },

    _itemHeight: function() {
        var $item = this._$items.first();

        return $item.get(0) && $item.get(0).getBoundingClientRect().height || 0;
    },

    _toggleActive: function(state) {
        this.$element().toggleClass(DATEVIEW_ROLLER_ACTIVE_CLASS, state);
    },

    _isVisible: function() {
        return this._$container.is(':visible');
    },

    _fireSelectedIndexChanged: function(value, previousValue) {
        this._selectedIndexChanged({
            value: value,
            previousValue: previousValue,
            event: undefined
        });
    },

    _visibilityChanged: function(visible) {
        this.callBase(visible);

        if(visible) {
            this._renderSelectedValue(this.option('selectedIndex'));
        }
        this.toggleActiveState(false);
    },

    toggleActiveState: function(state) {
        this.$element().toggleClass(DATEVIEW_ROLLER_CURRENT_CLASS, state);
    },

    _refreshSelectedIndex: function() {
        var selectedIndex = this.option('selectedIndex');
        var fitIndex = this._fitIndex(selectedIndex);

        fitIndex === selectedIndex ? this._renderActiveStateItem() : this.option('selectedIndex', fitIndex);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'selectedIndex':
                this._fireSelectedIndexChanged(args.value, args.previousValue);
                this._renderSelectedValue(args.value);
                break;
            case 'items':
                this._renderItems();
                this._refreshSelectedIndex();
                break;
            case 'onClick':
            case 'showOnClick':
                this._renderContainerClick();
                break;
            case 'onSelectedIndexChanged':
                this._renderSelectedIndexChanged();
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxDateViewRoller', DateViewRoller);

module.exports = DateViewRoller;
