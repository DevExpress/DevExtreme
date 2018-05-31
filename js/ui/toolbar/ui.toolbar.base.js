"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    isPlainObject = require("../../core/utils/type").isPlainObject,
    registerComponent = require("../../core/component_registrator"),
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    BindableTemplate = require("../widget/bindable_template");

var TOOLBAR_CLASS = "dx-toolbar",
    TOOLBAR_BEFORE_CLASS = "dx-toolbar-before",
    TOOLBAR_CENTER_CLASS = "dx-toolbar-center",
    TOOLBAR_AFTER_CLASS = "dx-toolbar-after",
    TOOLBAR_BOTTOM_CLASS = "dx-toolbar-bottom",
    TOOLBAR_MINI_CLASS = "dx-toolbar-mini",
    TOOLBAR_ITEM_CLASS = "dx-toolbar-item",
    TOOLBAR_LABEL_CLASS = "dx-toolbar-label",
    TOOLBAR_BUTTON_CLASS = "dx-toolbar-button",
    TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container",
    TOOLBAR_GROUP_CLASS = "dx-toolbar-group",
    TOOLBAR_LABEL_SELECTOR = "." + TOOLBAR_LABEL_CLASS,
    BUTTON_FLAT_CLASS = "dx-button-flat",

    TOOLBAR_ITEM_DATA_KEY = "dxToolbarItemDataKey";

var ToolbarBase = CollectionWidget.inherit({
    /**
    * @name dxToolbarItemTemplate
    * @inherits CollectionWidgetItemTemplate
    * @type object
    */
    /**
    * @name dxToolbarItemTemplate.widget
    * @type Enums.ToolbarItemWidget
    */
    /**
    * @name dxToolbarItemTemplate.options
    * @type object
    */

    _initTemplates: function() {
        this.callBase();

        var template = new BindableTemplate(function($container, data, rawModel) {
            if(isPlainObject(data)) {
                if(data.text) {
                    $container.text(data.text).wrapInner("<div>");
                }

                if(data.html) {
                    $container.html(data.html);
                }

                if(data.widget === "dxButton") {
                    if(data.options) {
                        var buttonContainerClass = this.option("useFlatButtons") ? BUTTON_FLAT_CLASS : "";
                        if(data.options.elementAttr) {
                            var customClass = data.options.elementAttr.class;
                            if(customClass) {
                                customClass = customClass.replace(BUTTON_FLAT_CLASS, "");
                                buttonContainerClass += (" " + customClass);
                            }
                        }

                        data.options = extend(data.options, { elementAttr: { class: buttonContainerClass } });
                    }
                }
            } else {
                $container.text(String(data));
            }

            this._getTemplate("dx-polymorph-widget").render({
                container: $container,
                model: rawModel
            });
        }.bind(this), ["text", "html", "widget", "options"], this.option("integrationOptions.watchMethod"));

        this._defaultTemplates["item"] = template;
        this._defaultTemplates["menuItem"] = template;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            renderAs: "topToolbar"
        });
    },

    _itemContainer: function() {
        return this._$toolbarItemsContainer.find([
            "." + TOOLBAR_BEFORE_CLASS,
            "." + TOOLBAR_CENTER_CLASS,
            "." + TOOLBAR_AFTER_CLASS
        ].join(","));
    },

    _itemClass: function() {
        return TOOLBAR_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return TOOLBAR_ITEM_DATA_KEY;
    },

    _buttonClass: function() {
        return TOOLBAR_BUTTON_CLASS;
    },

    _dimensionChanged: function() {
        this._arrangeItems();
    },

    _initMarkup: function() {
        this._renderToolbar();
        this._renderSections();

        this.callBase();

        this.setAria("role", "toolbar");
    },

    _render: function() {
        this.callBase();
        this._arrangeItems();
    },

    _renderToolbar: function() {
        this.$element()
            .addClass(TOOLBAR_CLASS)
            .toggleClass(TOOLBAR_BOTTOM_CLASS, this.option("renderAs") === "bottomToolbar");

        this._$toolbarItemsContainer = $("<div>")
            .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            .appendTo(this.$element());
    },

    _renderSections: function() {
        var $container = this._$toolbarItemsContainer,
            that = this;
        each(["before", "center", "after"], function() {
            var sectionClass = "dx-toolbar-" + this,
                $section = $container.find("." + sectionClass);

            if(!$section.length) {
                that["_$" + this + "Section"] = $section = $("<div>")
                    .addClass(sectionClass)
                    .appendTo($container);
            }
        });
    },

    _arrangeItems: function(elementWidth) {
        elementWidth = elementWidth || this.$element().width();

        this._$centerSection.css({
            margin: "0 auto",
            float: "none"
        });

        var beforeRect = this._$beforeSection.get(0).getBoundingClientRect(),
            afterRect = this._$afterSection.get(0).getBoundingClientRect();

        this._alignCenterSection(beforeRect, afterRect, elementWidth);

        var $label = this._$toolbarItemsContainer.find(TOOLBAR_LABEL_SELECTOR).eq(0),
            $section = $label.parent();

        if(!$label.length) {
            return;
        }

        var labelOffset = beforeRect.width ? beforeRect.width : $label.position().left,
            widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset,
            widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width,
            elemsAtSectionWidth = 0;

        $section.children().not(TOOLBAR_LABEL_SELECTOR).each(function() {
            elemsAtSectionWidth += $(this).outerWidth();
        });

        var freeSpace = elementWidth - elemsAtSectionWidth,
            sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

        if($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._$beforeSection, sectionMaxWidth);
        } else {
            var labelPaddings = $label.outerWidth() - $label.width();
            $label.css("maxWidth", sectionMaxWidth - labelPaddings);
        }
    },

    _alignCenterSection: function(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);

        var isRTL = this.option("rtlEnabled"),
            leftRect = isRTL ? afterRect : beforeRect,
            rightRect = isRTL ? beforeRect : afterRect,
            centerRect = this._$centerSection.get(0).getBoundingClientRect();

        if(leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? "none" : "right"
            });
        }
    },

    _alignSection: function($section, maxWidth) {
        var $labels = $section.find(TOOLBAR_LABEL_SELECTOR),
            labels = $labels.toArray();

        maxWidth = maxWidth - this._getCurrentLabelsPaddings(labels);

        var currentWidth = this._getCurrentLabelsWidth(labels),
            difference = Math.abs(currentWidth - maxWidth);

        if(maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false);
        } else {
            this._alignSectionLabels(labels, difference, true);
        }
    },

    _alignSectionLabels: function(labels, difference, expanding) {
        var getRealLabelWidth = function(label) { return label.getBoundingClientRect().width; };

        for(var i = 0; i < labels.length; i++) {
            var $label = $(labels[i]),
                currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i])),
                labelMaxWidth;

            if(expanding) {
                $label.css("maxWidth", "inherit");
            }

            var possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);

            if(possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference = difference - possibleLabelWidth;
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css("maxWidth", labelMaxWidth);
                break;
            }

            $label.css("maxWidth", labelMaxWidth);
        }
    },


    _getCurrentLabelsWidth: function(labels) {
        var width = 0;

        labels.forEach(function(label, index) {
            width += $(label).outerWidth();
        });

        return width;
    },

    _getCurrentLabelsPaddings: function(labels) {
        var padding = 0;

        labels.forEach(function(label, index) {
            padding += ($(label).outerWidth() - $(label).width());
        });

        return padding;
    },

    _renderItem: function(index, item, itemContainer, $after) {
        var location = item.location || "center",
            container = itemContainer || this._$toolbarItemsContainer.find(".dx-toolbar-" + location),
            itemHasText = Boolean(item.text) || Boolean(item.html),
            itemElement = this.callBase(index, item, container, $after);

        itemElement
            .toggleClass(this._buttonClass(), !itemHasText)
            .toggleClass(TOOLBAR_LABEL_CLASS, itemHasText);

        return itemElement;
    },

    _renderGroupedItems: function() {
        var that = this;

        each(this.option("items"), function(groupIndex, group) {
            var groupItems = group.items,
                $container = $("<div>").addClass(TOOLBAR_GROUP_CLASS),
                location = group.location || "center";

            if(!groupItems.length) return;

            each(groupItems, function(itemIndex, item) {
                that._renderItem(itemIndex, item, $container, null);
            });

            that._$toolbarItemsContainer.find(".dx-toolbar-" + location).append($container);
        });
    },

    _renderItems: function(items) {
        var grouped = items.length && items[0].items;
        grouped ? this._renderGroupedItems() : this.callBase(items);
    },

    _getToolbarItems: function() {
        return this.option("items") || [];
    },

    _renderContentImpl: function() {
        var items = this._getToolbarItems();

        this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }
    },

    _renderEmptyMessage: commonUtils.noop,

    _clean: function() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._arrangeItems();
        }
    },

    _isVisible: function() {
        return this.$element().width() > 0 && this.$element().height() > 0;
    },

    _getIndexByItem: function(item) {
        return inArray(item, this._getToolbarItems());
    },

    _itemOptionChanged: function(item, property, value) {
        this.callBase.apply(this, [item, property, value]);
        this._arrangeItems();
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "width":
                this.callBase.apply(this, arguments);
                this._dimensionChanged();
                break;
            case "renderAs":
                this._invalidate();
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    }

    /**
    * @name dxToolbarMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxToolbarMethods.focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */
});

registerComponent("dxToolbarBase", ToolbarBase);

module.exports = ToolbarBase;
