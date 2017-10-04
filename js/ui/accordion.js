"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    fx = require("../animation/fx"),
    clickEvent = require("../events/click"),
    devices = require("../core/devices"),
    extend = require("../core/utils/extend").extend,
    iteratorUtils = require("../core/utils/iterator"),
    isPlainObject = require("../core/utils/type").isPlainObject,
    registerComponent = require("../core/component_registrator"),
    eventUtils = require("../events/utils"),
    CollectionWidget = require("./collection/ui.collection_widget.edit"),
    deferredUtils = require("../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    BindableTemplate = require("./widget/bindable_template"),
    iconUtils = require("../core/utils/icon");

var ACCORDION_CLASS = "dx-accordion",
    ACCORDION_WRAPPER_CLASS = "dx-accordion-wrapper",
    ACCORDION_ITEM_CLASS = "dx-accordion-item",
    ACCORDION_ITEM_OPENED_CLASS = "dx-accordion-item-opened",
    ACCORDION_ITEM_CLOSED_CLASS = "dx-accordion-item-closed",
    ACCORDION_ITEM_TITLE_CLASS = "dx-accordion-item-title",
    ACCORDION_ITEM_BODY_CLASS = "dx-accordion-item-body",

    ACCORDION_ITEM_DATA_KEY = "dxAccordionItemData";

/**
* @name dxAccordion
* @publicName dxAccordion
* @inherits CollectionWidget
* @groupName Navigation and Layouting
* @module ui/accordion
* @export default
*/
var Accordion = CollectionWidget.inherit({

    _activeStateUnit: "." + ACCORDION_ITEM_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name dxAccordionOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxAccordionOptions_height
            * @publicName height
            * @type number|string|function
            * @default undefined
            * @type_function_return number|string
            */
            height: undefined,

            /**
            * @name dxAccordionOptions_itemTitleTemplate
            * @publicName itemTitleTemplate
            * @type template
            * @default "title"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:Element
            * @type_function_return string|Node|jQuery
            */
            itemTitleTemplate: "title",

            /**
            * @name dxAccordionOptions_onItemTitleClick
            * @publicName onItemTitleClick
            * @type function|string
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:Element
            * @type_function_param1_field6 itemIndex:number
            * @action
            */
            onItemTitleClick: null,

            /**
            * @name dxAccordionOptions_selectedIndex
            * @publicName selectedIndex
            * @type number
            * @default 0
            */
            selectedIndex: 0,

            /**
            * @name dxAccordionOptions_collapsible
            * @publicName collapsible
            * @type boolean
            * @default false
            */
            collapsible: false,

            /**
            * @name dxAccordionOptions_multiple
            * @publicName multiple
            * @type boolean
            * @default false
            */
            multiple: false,

            /**
            * @name dxAccordionOptions_animationDuration
            * @publicName animationDuration
            * @type number
            * @default 300
            */
            animationDuration: 300,

            /**
            * @name dxAccordionOptions_deferRendering
            * @publicName deferRendering
            * @type boolean
            * @default true
            */
            deferRendering: true,

            /**
            * @name dxAccordionOptions_itemTemplate
            * @publicName itemTemplate
            * @type template
            * @default "item"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:Element
            * @type_function_return string|Node|jQuery
            */

            selectionByClick: true,
            activeStateEnabled: true,
            _itemAttributes: { role: "tab" }

            /**
            * @name dxAccordionItemTemplate_title
            * @publicName title
            * @type String
            */
            /**
            * @name dxAccordionItemTemplate_icon
            * @publicName icon
            * @type String
            */
            /**
            * @name dxAccordionItemTemplate_iconSrc
            * @publicName iconSrc
            * @type String
            * @deprecated dxAccordionItemTemplate_icon
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxAccordionOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _itemElements: function() {
        return this._itemContainer().children(this._itemSelector());
    },

    _init: function() {
        this.callBase();

        this.option("selectionRequired", !this.option("collapsible"));
        this.option("selectionMode", this.option("multiple") ? "multiple" : "single");

        var $element = this.$element();
        $element.addClass(ACCORDION_CLASS);

        this._$container = $("<div>").addClass(ACCORDION_WRAPPER_CLASS);
        $element.append(this._$container);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["title"] = new BindableTemplate(function($container, data) {
            if(isPlainObject(data)) {
                if(data.title) {
                    $container.text(data.title);
                }

                $container.append(iconUtils.getImageContainer(data.icon || data.iconSrc));
            } else {
                $container.html(String(data));
            }
        }, ["title", "icon", "iconSrc"], this.option("integrationOptions.watchMethod"));
    },

    _render: function() {
        this._deferredItems = [];

        this.callBase();
        this._fireContentReadyAction();

        this.setAria({
            "role": "tablist",
            "multiselectable": this.option("multiple")
        });
        this._attachItemTitleClickAction();
    },

    _renderContent: function() {
        this._renderContentImpl();
    },

    _itemDataKey: function() {
        return ACCORDION_ITEM_DATA_KEY;
    },

    _itemClass: function() {
        return ACCORDION_ITEM_CLASS;
    },

    _itemContainer: function() {
        return this._$container;
    },

    _itemTitles: function() {
        return this._itemElements().find("." + ACCORDION_ITEM_TITLE_CLASS);
    },

    _itemContents: function() {
        return this._itemElements().find("." + ACCORDION_ITEM_BODY_CLASS);
    },

    _getItemData: function(target) {
        return $(target).parent().data(this._itemDataKey()) || this.callBase.apply(this, arguments);
    },

    _executeItemRenderAction: function(itemData) {
        if(itemData.type) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _itemSelectHandler: function(e) {
        if($(e.target).closest(this._itemContents()).length) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _renderItemContent: function(args) {
        var itemTitle = this.callBase(extend({}, args, {
            contentClass: ACCORDION_ITEM_TITLE_CLASS,
            templateProperty: "titleTemplate",
            defaultTemplateName: this.option("itemTitleTemplate")
        }));

        var deferred = new Deferred();
        this._deferredItems.push(deferred);

        if(!this.option("deferRendering")) {
            deferred.resolve();
        }

        deferred.done(this.callBase.bind(this, extend({}, args, {
            contentClass: ACCORDION_ITEM_BODY_CLASS,
            container: $("<div>").appendTo($(itemTitle).parent())
        })));
    },

    _attachItemTitleClickAction: function() {
        var itemSelector = "." + ACCORDION_ITEM_TITLE_CLASS,
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        eventsEngine.off(this._itemContainer(), eventName, itemSelector);
        eventsEngine.on(this._itemContainer(), eventName, itemSelector, this._itemTitleClickHandler.bind(this));
    },

    _itemTitleClickHandler: function(e) {
        this._itemJQueryEventHandler(e, "onItemTitleClick");
    },

    _renderSelection: function(addedSelection, removedSelection) {
        this._itemElements().addClass(ACCORDION_ITEM_CLOSED_CLASS);
        this.setAria("hidden", true, this._itemContents());

        this._updateItems(addedSelection, removedSelection, true);
    },

    _updateSelection: function(addedSelection, removedSelection) {
        this._updateItems(addedSelection, removedSelection, false);
    },

    _updateItems: function(addedSelection, removedSelection, skipAnimation) {
        var $items = this._itemElements(),
            that = this;

        iteratorUtils.each(addedSelection, function(_, index) {
            that._deferredItems[index].resolve();

            var $item = $items.eq(index)
                .addClass(ACCORDION_ITEM_OPENED_CLASS)
                .removeClass(ACCORDION_ITEM_CLOSED_CLASS);
            that.setAria("hidden", false, $item.find("." + ACCORDION_ITEM_BODY_CLASS));
        });

        iteratorUtils.each(removedSelection, function(_, index) {
            var $item = $items.eq(index)
                .removeClass(ACCORDION_ITEM_OPENED_CLASS);
            that.setAria("hidden", true, $item.find("." + ACCORDION_ITEM_BODY_CLASS));
        });

        if(that.option("templatesRenderAsynchronously")) {
            this._animationTimer = setTimeout(function() {
                this._updateItemHeights(skipAnimation);
            }.bind(this));
        } else {
            this._updateItemHeights(skipAnimation);
        }
    },

    _updateItemHeights: function(skipAnimation) {
        var that = this,
            deferredAnimate = that._deferredAnimate,
            itemHeight = this._splitFreeSpace(this._calculateFreeSpace());

        clearTimeout(this._animationTimer);

        return when.apply($, iteratorUtils.map(this._itemElements(), function(item) {
            return that._updateItemHeight($(item), itemHeight, skipAnimation);
        })).done(function() {
            if(deferredAnimate) {
                deferredAnimate.resolveWith(that);
            }
        });
    },

    _updateItemHeight: function($item, itemHeight, skipAnimation) {
        var $title = $item.children("." + ACCORDION_ITEM_TITLE_CLASS);

        if(fx.isAnimating($item)) {
            fx.stop($item);
        }

        var startItemHeight = $item.outerHeight(),
            finalItemHeight = $item.hasClass(ACCORDION_ITEM_OPENED_CLASS)
            ? itemHeight + $title.outerHeight() || $item.height("auto").outerHeight()
            : $title.outerHeight();

        return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight);
    },

    _animateItem: function($element, startHeight, endHeight, skipAnimation, fixedHeight) {
        var d;
        if(skipAnimation || startHeight === endHeight) {
            $element.css("height", endHeight);
            d = new Deferred().resolve();
        } else {
            d = fx.animate($element, {
                type: "custom",
                from: { height: startHeight },
                to: { height: endHeight },
                duration: this.option("animationDuration")
            });
        }

        return d.done(function() {
            if($element.hasClass(ACCORDION_ITEM_OPENED_CLASS) && !fixedHeight) {
                $element.css("height", "");
            }

            $element
                .not("." + ACCORDION_ITEM_OPENED_CLASS)
                .addClass(ACCORDION_ITEM_CLOSED_CLASS);
        });
    },

    _splitFreeSpace: function(freeSpace) {
        if(!freeSpace) {
            return freeSpace;
        }

        return freeSpace / this.option("selectedItems").length;
    },

    _calculateFreeSpace: function() {
        var height = this.option("height");
        if(height === undefined || height === "auto") {
            return;
        }

        var $titles = this._itemTitles(),
            itemsHeight = 0;

        iteratorUtils.each($titles, function(_, title) {
            itemsHeight += $(title).outerHeight();
        });

        return this.$element().height() - itemsHeight;
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        this._updateItemHeights(true);
    },

    _clean: function() {
        clearTimeout(this._animationTimer);
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "animationDuration":
            case "onItemTitleClick":
                break;
            case "collapsible":
                this.option("selectionRequired", !this.option("collapsible"));
                break;
            case "itemTitleTemplate":
            case "height":
            case "deferRendering":
                this._invalidate();
                break;
            case "multiple":
                this.option("selectionMode", args.value ? "multiple" : "single");
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxAccordionMethods_expandItem
    * @publicName expandItem(index)
    * @param1 index:numeric
    * @return Promise<void>
    */
    expandItem: function(index) {
        this._deferredAnimate = new Deferred();

        this.selectItem(index);

        return this._deferredAnimate.promise();
    },

    /**
    * @name dxAccordionMethods_collapseItem
    * @publicName collapseItem(index)
    * @param1 index:numeric
    * @return Promise<void>
    */
    collapseItem: function(index) {
        this._deferredAnimate = new Deferred();

        this.unselectItem(index);

        return this._deferredAnimate.promise();
    },

    /**
    * @name dxAccordionMethods_updateDimensions
    * @publicName updateDimensions()
    * @return Promise<void>
    */
    updateDimensions: function() {
        return this._updateItemHeights(false);
    }

});

registerComponent("dxAccordion", Accordion);

module.exports = Accordion;
